from rest_framework import serializers
import json
from uuid import UUID
from datetime import date, datetime
from .models import *
from Jobs.serializers import JobsSerializer
from Application.models import Resume
from JobSeekerProfile.models import Education, Experience, Skill, Language

# ---------- Serializers ----------
class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = "__all__"

class ApplicationListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Application
        fields="__all__"

class ApplicationDetailSerializer(serializers.ModelSerializer):
    resume = ResumeSerializer(read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    employer_company = serializers.CharField(source="job.employer.business_name", read_only=True)

    class Meta:
        model = Application
        fields = "__all__"

class SaveJobsSerializer(serializers.ModelSerializer):
    job=JobsSerializer(read_only=True)
    job_id=serializers.UUIDField(write_only=True)
    class Meta:
        model=SaveJob
        fields='__all__'

class ApplicationCreateSerializer(serializers.ModelSerializer):
       # new: write-only field that sets the FK `resume`
    resume_id = serializers.PrimaryKeyRelatedField(
        queryset=Resume.objects.none(),  # set real queryset in __init__
        write_only=True,
        required=False,
        allow_null=True,
        source="resume",
        help_text="Existing saved resume UUID"
    )
    resume_form   = serializers.JSONField(required=False, allow_null=True, write_only=True)
    resume_upload = serializers.FileField(required=False, allow_null=True, write_only=True)
    resume = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Application
        fields = ["id", "resume","resume_id", "resume_form", "resume_upload", "status", "cover_letter_text"]
        read_only_fields = ["id", "resume"]

    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        profile = self.context.get("profile")
        if profile:
            # Only allow picking resumes owned by this user
            self.fields["resume_id"].queryset = Resume.objects.filter(profile=profile)       

    def validate(self, attrs):
        # detect which option(s) were provided
        has_saved = bool(attrs.get("resume"))              # via resume_id → source="resume"
        has_form  = bool(attrs.get("resume_form")) and attrs.get("resume_form") != {}
        has_file  = bool(attrs.get("resume_upload"))
        allow_auto = bool(self.context.get("allow_auto_general", False))

        provided = sum([has_saved, has_form, has_file])

        if provided > 1:
            raise serializers.ValidationError({
                "detail": "Choose only ONE: saved resume, file upload, OR quick form."
            })
        if provided == 0 and not allow_auto:
            raise serializers.ValidationError({
                "detail": "Provide one resume option: saved resume (resume_id), file upload, or quick form."
            })
        return attrs