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

    class Meta:
        model = Application
        fields = ["id", "status", "cover_letter_text"]
        read_only_fields = ["id"]

    
   