<<<<<<< HEAD
from rest_framework import serializers
from .models import Education, Experience, JobseekerProfile, Language, Resume, Skill

# start jobseekerserializer
class JobseekerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobseekerProfile
        fields = '__all__' 

# start Resumeserializer
class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
        
# start Educationserializer
class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'
        
# start Experienceserializer
class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'
        
# start LanguageSerializar
class LanguageSerializar(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'
        
# start SkillSerializar
class SkillSerializar(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'
=======
from rest_framework import serializers
from Accounts.models import *


class JobSeekerSignInSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(required=True)
    username = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = CustomUser
        fields = ["id", "email","username"]

    def get_username(self, obj):
        return obj.email.split('@')[0] if obj.email else None



>>>>>>> 1bd9536d0467365122d63ca9338c38cb539590a9
