# serializers.py
from rest_framework import serializers
from .models import Jobs

class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        # employer ကို client ကနေ မထည့်စေချင် → fields မှာ မထည့်
        fields = ["title", "description", "location", "job_type",
                  "salary", "category", "is_active", "deadline"]

    
