from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.reverse import reverse
from django.shortcuts import render, redirect, HttpResponse
from rest_framework.response import Response
from rest_framework import status
from .models import Education, Experience, JobseekerProfile, Language, Skill, Resume
from .serializers import EducationSerializer, ExperienceSerializer, JobseekerProfileSerializer, LanguageSerializar, SkillSerializar, ResumeSerializer

# start api_overview
@api_view(['GET'])
def api_overview(request, format=None):
    api_urls = {
        # start jobseekerprofile
        "JobseekerProfile List/Create": reverse('jobseekerprofile-list', request=request, format=format),
        "JobseekerProfile Detail": reverse('jobseekerprofile-detail', args=[1], request=request, format=format),
        # end jobseekerprofile
        
        # start resume
        "Resume List/Create": reverse('resume-list', request=request, format=format),
        "Resume Detail": reverse('resume-detail', args=[1], request=request, format=format),
        # end resume
        
        # start education
        "Education List/Create": reverse('education-list', request=request, format=format),
        "Education Detail": reverse('education-detail', args=[1], request=request, format=format),
        # end education
        
        # start experience
        "Experience List/Create": reverse('experience-list', request=request, format=format),
        "Experience Detail": reverse('experience-detail', args=[1], request=request, format=format),
        # end experience
        
        # start language
        "Language List/Create": reverse('language-list', request=request, format=format),
        "Language Detail": reverse('language-detail', args=[1], request=request, format=format),
        # end language
        
        # start skill
        "Skill List/Create": reverse('skill-list', request=request, format=format),
        "Skill Detail": reverse('skill-detail', args=[1], request=request, format=format),
        # end skill
    }
    return Response(api_urls)

######### start Skills ###########
# Create + Read (List)
@api_view(['GET', 'POST'])
def skill_list(request):
    if request.method == 'GET':   # READ all
        skills = Skill.objects.all()
        serializer = SkillSerializar(skills, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':   # CREATE
        serializer = SkillSerializar(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Read (Single) + Update + Delete
@api_view(['GET', 'PUT', 'DELETE'])
def skill_detail(request, pk):
    try:
        skill = Skill.objects.get(pk=pk)
    except Skill.DoesNotExist:
        return Response({"error": "Skill not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':   # READ one
        serializer = SkillSerializar(skill)
        return Response(serializer.data)

    elif request.method == 'PUT':   # UPDATE
        serializer = SkillSerializar(skill, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':   # DELETE
        skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

######### end skills ##########

######### start jobseekerprofile ###########
# Create + Read (List)
@api_view(['GET', 'POST'])
# @parser_classes([MultiPartParser, FormParser])
def jobseekerprofile_list(request):
    print("request.data =", request.data)
    if request.method == 'GET':   # READ all
        jobseekerprofiles = JobseekerProfile.objects.all()
        serializer = JobseekerProfileSerializer(jobseekerprofiles, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':   # CREATE
        serializer = JobseekerProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Read (Single) + Update + Delete
@api_view(['GET', 'PUT', 'DELETE'])
def jobseekerprofile_detail(request, pk):
    try:
        jobseekerprofile = JobseekerProfile.objects.get(pk=pk)
    except JobseekerProfile.DoesNotExist:
        return Response({"error": "JobseekerProfile not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':   # READ one
        serializer = JobseekerProfileSerializer(jobseekerprofile)
        return Response(serializer.data)

    elif request.method == 'PUT':   # UPDATE
        serializer = JobseekerProfileSerializer(jobseekerprofile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':   # DELETE
        jobseekerprofile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

######### end jobseekerprofile ##########

######### start Education ###########
# Create + Read (List)
@api_view(['GET', 'POST'])
def education_list(request):
    if request.method == 'GET':   # READ all
        educations = Education.objects.all()
        serializer = EducationSerializer(educations, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':   # CREATE
        serializer = EducationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Read (Single) + Update + Delete
@api_view(['GET', 'PUT', 'DELETE'])
def education_detail(request, pk):
    try:
        education = Education.objects.get(pk=pk)
    except Education.DoesNotExist:
        return Response({"error": "Education not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':   # READ one
        serializer = EducationSerializer(education)
        return Response(serializer.data)

    elif request.method == 'PUT':   # UPDATE
        serializer = EducationSerializer(education, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':   # DELETE
        education.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

######### end Education ##########

######### start Experience ###########
# Create + Read (List)
@api_view(['GET', 'POST'])
def experience_list(request):
    if request.method == 'GET':   # READ all
        experiences = Experience.objects.all()
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':   # CREATE
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Read (Single) + Update + Delete
@api_view(['GET', 'PUT', 'DELETE'])
def experience_detail(request, pk):
    try:
        experience = Experience.objects.get(pk=pk)
    except Experience.DoesNotExist:
        return Response({"error": "Experience not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':   # READ one
        serializer = ExperienceSerializer(experience)
        return Response(serializer.data)

    elif request.method == 'PUT':   # UPDATE
        serializer = ExperienceSerializer(experience, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':   # DELETE
        experience.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

######### end Education ##########

######## start Language ###########
# Create + Read (List)
@api_view(['GET', 'POST'])
def language_list(request):
    if request.method == 'GET':   # READ all
        languages = Language.objects.all()
        serializer = LanguageSerializar(languages, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':   # CREATE
        serializer = LanguageSerializar(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Read (Single) + Update + Delete
@api_view(['GET', 'PUT', 'DELETE'])
def language_detail(request, pk):
    try:
        language = Language.objects.get(pk=pk)
    except Language.DoesNotExist:
        return Response({"error": "Language not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':   # READ one
        serializer = LanguageSerializar(language)
        return Response(serializer.data)

    elif request.method == 'PUT':   # UPDATE
        serializer = LanguageSerializar(language, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':   # DELETE
        language.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

######### end Language ##########

######### start Resume ###########
# Create + Read (List)
@api_view(['GET', 'POST'])
def resume_list(request):
    if request.method == 'GET':   # READ all
        resumes = Resume.objects.all()
        serializer = ResumeSerializer(resumes, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':   # CREATE
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Read (Single) + Update + Delete
@api_view(['GET', 'PUT', 'DELETE'])
def resume_detail(request, pk):
    try:
        resume = Resume.objects.get(pk=pk)
    except Resume.DoesNotExist:
        return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':   # READ one
        serializer = ResumeSerializer(resume)
        return Response(serializer.data)

    elif request.method == 'PUT':   # UPDATE
        serializer = ResumeSerializer(resume, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':   # DELETE
        resume.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




