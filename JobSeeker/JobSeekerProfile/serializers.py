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