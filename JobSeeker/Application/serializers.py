# applications/serializers.py
from rest_framework import serializers
from .models import Application

class ApplicationDetailSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    employer_company = serializers.CharField(source='job.employer.business_name', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
