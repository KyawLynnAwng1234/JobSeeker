from rest_framework import serializers
import json
from uuid import UUID
from datetime import date, datetime
from .models import Application
from Application.models import Resume
from .utils_resume_persist import persist_resume_sections
from .utils import jsonify_dates
from JobSeekerProfile.models import Education, Experience, Skill, Language


# ---------- Helpers ----------

def _as_list(v):
    if not v:
        return []
    if isinstance(v, list):
        return v
    return [v]

def _snapshot_from_db(profile):
    """Return a dict snapshot of what’s in DB now."""
    return {
        "education":  list(Education.objects.filter(profile=profile).values()),
        "experience": list(Experience.objects.filter(profile=profile).values()),
        "skills":     list(Skill.objects.filter(profile=profile).values()),
        "languages":  list(Language.objects.filter(profile=profile).values()),
    }

def _require_all_sections(snapshot):
    """Require ALL sections: education, experience, skills, languages."""
    missing = []
    if len(_as_list(snapshot.get("education"))) == 0:
        missing.append("education")
    if len(_as_list(snapshot.get("experience"))) == 0:
        missing.append("experience")
    if len(_as_list(snapshot.get("skills"))) == 0:
        missing.append("skills")
    if len(_as_list(snapshot.get("languages"))) == 0:
        missing.append("languages")
    return missing

def _json_safe_default(obj):
    if isinstance(obj, UUID):
        return str(obj)
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    return str(obj)

def _json_safe(obj):
    return json.loads(json.dumps(obj, default=_json_safe_default))


# ---------- Serializers ----------

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = "__all__"


class ApplicationDetailSerializer(serializers.ModelSerializer):
    resume = ResumeSerializer(read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    employer_company = serializers.CharField(source="job.employer.business_name", read_only=True)

    class Meta:
        model = Application
        fields = "__all__"


class ApplicationCreateSerializer(serializers.ModelSerializer):
    resume_form   = serializers.JSONField(required=False, allow_null=True, write_only=True)
    resume_upload = serializers.FileField(required=False, allow_null=True, write_only=True)
    resume = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Application
        fields = ["id", "resume", "resume_form", "resume_upload", "status", "cover_letter_text"]
        read_only_fields = ["id", "resume"]

    def validate(self, attrs):
        has_form  = bool(attrs.get("resume_form"))
        has_file  = bool(attrs.get("resume_upload"))
        allow_auto = bool(self.context.get("allow_auto_general", False))

        if allow_auto:
            if has_form and has_file:
                raise serializers.ValidationError(
                    {"detail": "Choose only one: resume_upload (file) OR resume_form (JSON)."}
                )
        else:
            if (has_form + has_file) != 1:
                raise serializers.ValidationError(
                    {"detail": "Provide exactly one: resume_upload (file) OR resume_form (JSON)."}
                )
        return attrs

    def create(self, attrs):
        """
        IMPORTANT: This serializer NO LONGER wraps the whole method in a transaction.
        The view will handle a small atomic block only for the success path.
        """
        profile    = self.context["profile"]
        job        = self.context["job"]
        allow_auto = bool(self.context.get("allow_auto_general", False))

        form   = attrs.pop("resume_form", None)
        upload = attrs.pop("resume_upload", None)

        # ---------- A) resume_form path ----------
        if form is not None:
            if isinstance(form, str):
                try:
                    form = json.loads(form)
                except Exception:
                    raise serializers.ValidationError({"resume_form": "Invalid JSON."})

            form = jsonify_dates(form)

            # Persist what the user sent (even partial). This must happen OUTSIDE any atomic block in the view.
            persist_resume_sections(profile, form)

            # Validate against current DB snapshot
            snapshot = _snapshot_from_db(profile)
            missing = _require_all_sections(snapshot)
            if missing:
                # Do NOT create Resume/Application, but keep saved data
                raise serializers.ValidationError({
                    "code": "MISSING_REQUIRED_SECTIONS",
                    "message": "Please complete required sections before applying.",
                    "missing": missing
                })

            # All present → create Resume (the view will wrap this in a small atomic block)
            safe_snapshot = _json_safe(snapshot)
            resume = Resume.objects.create(
                profile=profile,
                title=form.get("title") or f"{getattr(profile, 'full_name', str(profile.pk))} – Resume",
                data=safe_snapshot,
            )

        # ---------- B) file upload path ----------
        elif upload is not None:
            resume = Resume.objects.create(
                profile=profile,
                title=f"{getattr(profile, 'full_name', str(profile.pk))} – Resume",
                file=upload,
            )

        # ---------- C) auto-general path ----------
        else:
            if not allow_auto:
                raise serializers.ValidationError({"detail": "A resume is required."})

            snapshot = _snapshot_from_db(profile)
            missing = _require_all_sections(snapshot)
            if missing:
                raise serializers.ValidationError({
                    "code": "NEED_PROFILE_DATA_FOR_GENERAL_RESUME",
                    "message": "Please add profile data or upload a resume.",
                    "missing": missing
                })

            safe_snapshot = _json_safe(snapshot)
            resume = Resume.objects.create(
                profile=profile,
                title=f"{getattr(profile, 'full_name', str(profile.pk))} – General Resume",
                data=safe_snapshot,
            )

        # Requirements satisfied → create Application
        app = Application.objects.create(
            job=job,
            job_seeker_profile=profile,
            resume=resume,
            status=attrs.get("status", "P"),
            cover_letter_text=attrs.get("cover_letter_text", ""),
        )
        return app
