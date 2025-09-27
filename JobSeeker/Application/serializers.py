from rest_framework import serializers
from .models import Application
from Application.models import Resume

# import helpers (make sure these exist in your utils)
from .utils import build_resume_snapshot, check_requirements, jsonify_dates, MIN_REQ

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'

class ApplicationDetailSerializer(serializers.ModelSerializer):
    resume = ResumeSerializer(read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    employer_company = serializers.CharField(source="job.employer.business_name", read_only=True)

    class Meta:
        model = Application
        fields = "__all__"

class ApplicationCreateSerializer(serializers.ModelSerializer):
    # only expose these two inputs to the client
    resume_form   = serializers.JSONField(required=False, allow_null=True, write_only=True)
    resume_upload = serializers.FileField(required=False, allow_null=True, write_only=True)

    # hide FK from input; return it read-only
    resume = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Application
        fields = [
            "id", "resume", "resume_form", "resume_upload",
            "status", "cover_letter_text",
        ]
        read_only_fields = ["id", "resume"]

    def validate(self, attrs):
        has_form  = bool(attrs.get("resume_form"))
        has_file  = bool(attrs.get("resume_upload"))
        allow_auto = bool(self.context.get("allow_auto_general", False))

        if allow_auto:
            # allow 0 or 1 (0 means: try auto-general from profile)
            if has_form and has_file:
                raise serializers.ValidationError({"detail": "Choose only one: resume_upload (file) OR resume_form (JSON)."})
        else:
            # strict: exactly one is required
            if (has_form + has_file) != 1:
                raise serializers.ValidationError({"detail": "Provide exactly one: resume_upload (file) OR resume_form (JSON)."})

        return attrs

    def create(self, attrs):
        profile = self.context["profile"]
        job     = self.context["job"]
        allow_auto = bool(self.context.get("allow_auto_general", False))

        form   = attrs.pop("resume_form", None)
        upload = attrs.pop("resume_upload", None)

        # A) resume_form path — make JSONField-safe
        if form is not None:
            form = jsonify_dates(form)  # <-- convert any date/datetime to ISO strings
            resume = Resume.objects.create(
                profile=profile,
                title=form.get("title") or f"{getattr(profile, 'full_name', str(profile.pk))} – Resume",
                data=form,   # Resume must have JSONField 'data'
            )

        # B) file upload path
        elif upload is not None:
            resume = Resume.objects.create(
                profile=profile,
                title=f"{getattr(profile, 'full_name', str(profile.pk))} – Resume",
                file=upload,  # Resume must have FileField 'file'
            )

        # C) auto-general path (empty body & allow_auto_general=True)
        else:
            if not allow_auto:
                raise serializers.ValidationError({"detail": "A resume is required: upload a file or fill the form."})

            snap = build_resume_snapshot(profile)  # this already returns jsonify_dates(snapshot) if you applied the utils fix
            # be extra safe even if build_resume_snapshot wasn't patched yet:
            snap = jsonify_dates(snap)

            missing = check_requirements(snap, MIN_REQ)
            if missing:
                raise serializers.ValidationError({
                    "code": "NEED_PROFILE_DATA_FOR_GENERAL_RESUME",
                    "message": "Please add some profile data or upload a resume.",
                    "missing": missing
                })

            resume = Resume.objects.create(
                profile=profile,
                title=f"{getattr(profile, 'full_name', str(profile.pk))} – General Resume",
                data=snap,
            )

        # Create the application linked to the new Resume (FK is hidden/read-only)
        app = Application.objects.create(
            job=job,
            job_seeker_profile=profile,
            resume=resume,
            status=attrs.get("status", "P"),
            cover_letter_text=attrs.get("cover_letter_text", ""),
        )
        return app
