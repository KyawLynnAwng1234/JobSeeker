from rest_framework import serializers
import json
from uuid import UUID
from datetime import date, datetime
from .models import *
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
    class Meta:
        model=SaveJob
        fields='__all__'



class ApplicationCreateSerializer(serializers.ModelSerializer):
    resume_form   = serializers.JSONField(required=False, allow_null=True, write_only=True)
    resume_upload = serializers.FileField(required=False, allow_null=True, write_only=True)
    resume = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Application
        fields = ["id", "resume", "resume_form", "resume_upload", "status", "cover_letter_text"]
        read_only_fields = ["id", "resume"]
       

    def validate(self, attrs):
        """
        Validate that user provides exactly one resume option:
        - Either resume_upload (file)
        - OR resume_form (JSON)
        """
        has_form = bool(attrs.get("resume_form")) and attrs.get("resume_form") != {}
        has_file = bool(attrs.get("resume_upload"))
        allow_auto = bool(self.context.get("allow_auto_general", False))

        # Case 1: both given → invalid
        if has_form and has_file:
            raise serializers.ValidationError({
                "detail": "Choose only one: Upload a file OR Fill the quick form."
            })

        # Case 2: none given → invalid (unless auto allowed)
        if not allow_auto and not has_form and not has_file:
            raise serializers.ValidationError({
                "detail": "Provide one resume option: file upload or quick form."
            })

        return attrs