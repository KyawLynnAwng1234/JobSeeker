# utils.py
from datetime import date, datetime

# ---- Policy for auto-general resume (tweak as you like) ----------------------
MIN_REQ = {
    "summary": False,   # require profile summary/bio text?
    "education": 1,     # min number of education entries
    "experience": 1,    # min number of experience entries
    "skills": 1,        # e.g., set to 3 if you want 3+ skills
    "language":1,       
}

# =========================
# UI specs per section
# =========================
SECTION_SPECS = {
    "summary": {
        "label": "Profile Summary",
        "fix_url": "/profile/edit#summary",
        "action_label": "Write Summary",
        "required_fields": ["text"],
        "optional_fields": [],
        "defaults": {},
        "messages": {"empty": "Write a short profile summary."},
    },
    "education": {
        "label": "Education",
        "fix_url": "/profile/edit#education",
        "action_label": "Add Education",
        "required_fields": ["school_name", "degree", "start_date"],
        "optional_fields": ["field_of_study", "end_date", "description"],
        "defaults": {"degree": "", "school_name": ""},
        "messages": {"empty": "Add at least one education entry."},
    },
    "experience": {
        "label": "Experience",
        "fix_url": "/profile/edit#experience",
        "action_label": "Add Experience",
        "required_fields": ["company_name", "position", "start_date"],
        "optional_fields": ["end_date", "description", "location"],
        "defaults": {"position": "", "company_name": ""},
        "messages": {"empty": "Add at least one work experience."},
    },
    "skills": {
        "label": "Skills",
        "fix_url": "/profile/edit#skills",
        "action_label": "Add Skill",
        "required_fields": ["name"],
        "optional_fields": [],
        "defaults": {},
        "messages": {"empty": "Add at least one skill."},
    },
    "language": {
        "label": "Language",
        "fix_url": "/profile/edit#language",
        "action_label": "Add Language",
        "required_fields": ["name"],
        "optional_fields": ["proficiency"],
        "defaults": {"proficiency": None},
        "messages": {"empty": "Add at least one language."},
    },
    "certifications": {
        "label": "Certifications",
        "fix_url": "/profile/edit#certifications",
        "action_label": "Add Certification",
        "required_fields": ["name", "issuer"],
        "optional_fields": ["issued_date", "expires_at"],
        "defaults": {},
        "messages": {"empty": "Add at least one certification."},
    },
}

# =========================

# ---- Helpers -----------------------------------------------------------------
def jsonify_dates(obj):
    """Recursively convert date/datetime to ISO strings so JSONField can store them."""
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    if isinstance(obj, list):
        return [jsonify_dates(x) for x in obj]
    if isinstance(obj, dict):
        return {k: jsonify_dates(v) for k, v in obj.items()}
    return obj

def _get_rel_manager(obj, candidates):
    """Return the first related manager that exists on obj from candidate names."""
    for name in candidates:
        mgr = getattr(obj, name, None)
        if mgr is not None and (hasattr(mgr, "all") or hasattr(mgr, "exists")):
            return mgr
    return None

def _order_by_existing(qs, preferred_desc_fields=("-",), preferred_fields=()):
    """Order qs by the first existing field (desc if prefixed with '-') among candidates."""
    if not qs:
        return qs
    model_fields = {f.name for f in qs.model._meta.get_fields() if hasattr(f, "attname")}
    for f in preferred_desc_fields:
        name = f.lstrip("-")
        if name in model_fields:
            return qs.order_by(f)
    for f in preferred_fields:
        if f in model_fields:
            return qs.order_by(f)
    return qs.order_by("-id")  # safe fallback

def _values_smart(qs, wanted_fields, limit=100):
    """
    Return list(dict) with only fields that exist on the model.
    If none of the wanted fields exist, fall back to qs.values() limited.
    """
    if not qs:
        return []
    model_fields = {f.name for f in qs.model._meta.get_fields() if hasattr(f, "attname")}
    use = [f for f in wanted_fields if f in model_fields]
    try:
        if use:
            return list(qs.values(*use)[:limit])
        return list(qs.values()[:limit])
    except Exception:
        # extremely defensive fallback
        return [{"id": getattr(o, "id", None)} for o in qs.all()[:limit]]

# ---- Snapshot builder (now JSONField-safe) -----------------------------------
def build_resume_snapshot(profile):
    summary = (getattr(profile, "bio", "") or getattr(profile, "summary", "") or "").strip()

    # --- Educations ---
    edu_mgr = _get_rel_manager(profile, ["educations", "education_set", "education", "education_entries"])
    if edu_mgr:
        edu_qs = _order_by_existing(
            edu_mgr.all(),
            preferred_desc_fields=("-end_year", "-end_date", "-updated_at"),
            preferred_fields=("end_year", "end_date", "updated_at"),
        )
        educations = _values_smart(
            edu_qs,
            wanted_fields=("school_name", "degree", "field_of_study", "start_year", "start_date", "end_year", "end_date"),
        )
    else:
        educations = []

    # --- Experiences ---
    exp_mgr = _get_rel_manager(profile, ["experiences", "experience_set", "experience", "work_experiences"])
    if exp_mgr:
        exp_qs = _order_by_existing(
            exp_mgr.all(),
            preferred_desc_fields=("-end_date", "-updated_at"),
            preferred_fields=("end_date", "updated_at"),
        )
        experiences = _values_smart(
            exp_qs,
            wanted_fields=("company_name", "position", "start_date", "end_date", "description"),
        )
    else:
        experiences = []

    # --- Skills (M2M or reverse FK) ---
    skills = []
    skill_mgr = _get_rel_manager(profile, ["skills", "skill_set", "skills_set", "profileskills", "profile_skills"])
    if skill_mgr:
        try:
            skills = list(skill_mgr.values_list("name", flat=True))
        except Exception:
            rows = _values_smart(skill_mgr.all(), wanted_fields=("name",))
            skills = [r["name"] for r in rows if "name" in r and r["name"]]

    # --- Languages (required by checker below) ---
    lang_mgr = _get_rel_manager(profile, ["language", "language_set", "profile_languages", "languages_set"])
    if lang_mgr:
        # Prefer a normalized dict shape with name + proficiency if available.
        lang_rows = _values_smart(lang_mgr.all(), wanted_fields=("name", "proficiency"))
        language = [
            {"name": r.get("name"), "proficiency": r.get("proficiency")}
            for r in lang_rows
            if r.get("name")
        ]
    else:
        language= []

    # --- Certifications (optional) ---
    cert_mgr = _get_rel_manager(profile, ["certifications", "certification_set"])
    certifications = _values_smart(cert_mgr.all(), wanted_fields=("name", "issuer", "issued_date", "expires_at")) if cert_mgr else []

    snapshot = {
        "summary": summary,
        "education": educations,
        "experience": experiences,
        "skills": list(skills),
        "language": language,
        "certifications": certifications,
    }
    return jsonify_dates(snapshot)


# ---- Requirements checker ----------------------------------------------------
def check_requirements(snapshot, min_req=None):
    """
    Validate that snapshot meets minimum requirements.
    min_req defaults to MIN_REQ, but you can pass a custom dict per call.
    """
    if min_req is None:
        min_req = MIN_REQ

    missing = []
    if min_req.get("summary") and not (snapshot.get("summary") or "").strip():
        missing.append({"field": "summary", "need": "text"})
    if len(snapshot.get("education", [])) < min_req.get("education", 0):
        missing.append({"field": "education", "need": min_req["education"]})
    if len(snapshot.get("experience", [])) < min_req.get("experience", 0):
        missing.append({"field": "experience", "need": min_req["experience"]})
    if len(snapshot.get("skills", [])) < min_req.get("skills", 0):
        missing.append({"field": "skills", "need": min_req["skills"], "have": len(snapshot.get("skills", []))})
    if len(snapshot.get("language", [])) < min_req.get("language", 0):
        missing.append({"field": "language", "need": min_req["language"], "have": len(snapshot.get("language", []))})
    return missing


def decorate_missing(missing_list):
    """
    Attach UI metadata + per-section required subfields so the frontend
    can render the right checklist and CTA without hardcoding.
    """
    out = []
    for item in missing_list:
        field = item.get("field")
        spec = SECTION_SPECS.get(field, {
            "label": field.title() if field else "Missing",
            "fix_url": "/profile/edit",
            "action_label": "Fix",
            "required_fields": [],
            "optional_fields": [],
            "defaults": {},
            "messages": {"empty": "Please complete this section."},
        })
        out.append({
            **item,
            "label": spec["label"],
            "fix_url": spec["fix_url"],
            "action_label": spec["action_label"],
            "message": item.get("message") or spec["messages"]["empty"],
            "schema": {
                "required_fields": spec["required_fields"],
                "optional_fields": spec.get("optional_fields", []),
                "defaults": spec.get("defaults", {}),
            },
        })
    return out






