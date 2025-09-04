<<<<<<< HEAD
from rest_framework import serializers
from .models import JobCategory, Jobs
from Accounts.models import CustomUser
from EmployerProfile.models import EmployerProfile

class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = ['id', 'name']

class JobsSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.user.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Jobs
        fields = "__all__"

        read_only_fields = ['employer']

=======
# serializers.py
from rest_framework import serializers
from .models import Jobs

class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        # employer ကို client ကနေ မထည့်စေချင် → fields မှာ မထည့်
        fields = ["title", "description", "location", "job_type",
                  "salary", "category", "is_active", "deadline"]

    
>>>>>>> df9ff5ef6266e84a3e9a6258f21ac997f9f4a8f2
