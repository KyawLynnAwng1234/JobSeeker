from django.db import router
from django.utils.dateparse import parse_date
from JobSeekerProfile.models import Education, Experience, Skill, Language

def _to_date(v):
    if not v:
        return None
    if isinstance(v, str):
        try:
            return parse_date(v)
        except Exception:
            return None
    return v

def _to_int(v):
    try:
        return int(v) if v not in (None, "", [], {}) else None
    except Exception:
        return None

def _get(d, *keys, default=""):
    for k in keys:
        if isinstance(d, dict) and k in d and d[k] not in (None, ""):
            return d[k]
    return default

def persist_resume_sections(profile, snap: dict):
    """
    Persist partial resume sections into normalized tables.
    Supports:
      - Root single object: {"name": "...", "proficiency": "..."}  -> Language upsert (and Skill upsert if you want)
      - Lists: "languages", "skills", "education", "experience"
    """
    if not isinstance(snap, dict):
        return

    # --- DB aliases ---
    db_lang  = router.db_for_write(Language)
    db_skill = router.db_for_write(Skill)
    db_edu   = router.db_for_write(Education)
    db_exp   = router.db_for_write(Experience)

    # ---------- Root single object -> Language (and Skill) ----------
    root_name = _get(snap, "name")
    if root_name:
        prof = _get(snap, "proficiency", "level", "rating", default="")
        # Language upsert
        Language.objects.using(db_lang).update_or_create(
            profile=profile, name=root_name,
            defaults={"proficiency": prof}
        )
        # OPTIONAL: also mirror as a Skill (comment out if not desired)
        Skill.objects.using(db_skill).update_or_create(
            profile=profile, name=root_name,
            defaults={"proficiency": prof}
        )

    # ---------- Languages list ----------
    langs = snap.get("languages") or []
    if isinstance(langs, list):
        for l in langs:
            if not isinstance(l, dict):
                continue
            nm = _get(l, "name")
            if not nm:
                continue
            prof = _get(l, "proficiency", "level", "rating", default="")
            Language.objects.using(db_lang).update_or_create(
                profile=profile, name=nm,
                defaults={"proficiency": prof}
            )

    # ---------- Skills list ----------
    skills = snap.get("skills") or []
    if isinstance(skills, list):
        for s in skills:
            if not isinstance(s, dict):
                continue
            nm = _get(s, "name")
            if not nm:
                continue
            prof = _get(s, "proficiency", "level", "rating", default="")
            Skill.objects.using(db_skill).update_or_create(
                profile=profile, name=nm,
                defaults={"proficiency": prof}
            )

    # ---------- Education list ----------
    edu_list = snap.get("education") or snap.get("educations") or []
    if isinstance(edu_list, list):
        for e in edu_list:
            if not isinstance(e, dict):
                continue
            Education.objects.using(db_edu).update_or_create(
                profile=profile,
                school_name=_get(e, "school_name", "school", "institution", "university", "college"),
                defaults={
                    "school_name": _get(e,"school_name"),
                    "field_of_study": _get(e, "field_of_study"),
                    "degree": _get(e, "degree", "degree_name"),
                    ""
                    
                    "start_year": _to_int(_get(e, "start_year", "start")),
                    "end_year": _to_int(_get(e, "end_year", "end"))
                    
                }
            )

    # ---------- Experience list ----------
    exp_list = snap.get("experience") or snap.get("experiences") or []
    if isinstance(exp_list, list):
        for x in exp_list:
            if not isinstance(x, dict):
                continue
            Experience.objects.using(db_exp).update_or_create(
                profile=profile,
                company_name=_get(x, "company_name", "company", "organization", "employer"),
                defaults={
                    "position": _get(x, "position", "role", "title", "job_title"),
                    "description": _get(x, "description", "details", "desc"),
                    "start_date": _to_date(_get(x, "start_date", "from", "start")),
                    "end_date": _to_date(_get(x, "end_date", "to", "end")),
                    "is_current": bool(_get(x, "is_current", "current", default=False)),
                }
            )
