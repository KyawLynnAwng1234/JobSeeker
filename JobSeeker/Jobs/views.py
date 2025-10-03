
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q

# import Application
from Application.models import Application
from .models import JobCategory, Jobs
from .serializers import JobCategorySerializer, JobsSerializer
from EmployerProfile.models import EmployerProfile
from django.shortcuts import get_object_or_404

# Create your views here.
# job category list
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_category_list(request):
    user = request.user
    if user.is_staff:  # Admin
        categories = JobCategory.objects.all().order_by('-id')
    elif hasattr(user, "role") and user.role == "employer":  # Employer
        categories = JobCategory.objects.filter(user=user).order_by('-created_at')
    else:  # Other users (e.g. job seekers) → no access
        return Response(
            {"error": "You do not have permission to view categories."},
            status=status.HTTP_403_FORBIDDEN,
        )
    serializer = JobCategorySerializer(categories, many=True)
    return Response(serializer.data)

# custom permission
class IsAdminOrEmployer(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.role == 'employer')
        )
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def job_category_create(request):
    user=request.user
    serializer = JobCategorySerializer(data=request.data)
    if serializer.is_valid():
       serializer.save(user=request.user)
       return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

# Category Detail
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrEmployer])
def job_category_detail(request, pk):
    user = request.user
    if user.is_staff:  # Admin
        category = get_object_or_404(JobCategory, pk=pk)
    else:  # Employer
        category = get_object_or_404(JobCategory, pk=pk, user=user)
    serializer = JobCategorySerializer(category)
    return Response(serializer.data)

# Category Update
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsAdminOrEmployer])
def job_category_update(request, pk):
    user = request.user
    if user.is_staff:
        category = get_object_or_404(JobCategory, pk=pk)
    else:
        category = get_object_or_404(JobCategory, pk=pk, user=user)
        serializer = JobCategorySerializer(category, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Category Delete
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminOrEmployer])
def job_category_delete(request, pk):
    user = request.user
    if user.is_staff:
        category = get_object_or_404(JobCategory, pk=pk)
    else:
        category = get_object_or_404(JobCategory, pk=pk,user=user)
        category.delete()
    return Response({'message': 'Category deleted'}, status=status.HTTP_204_NO_CONTENT)

# jobs list
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def jobs_list(request):
    user = request.user
    if user.is_staff:  
        jobs = Jobs.objects.all().order_by('-id')
    else:  
        jobs = Jobs.objects.filter(employer__user=user).order_by('-id')
    serializer = JobsSerializer(jobs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# jobs create
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminOrEmployer])
def jobs_create(request):
    user = request.user
    # Check if user has an EmployerProfile
    try:
        employer_profile = EmployerProfile.objects.get(user=user)
    except EmployerProfile.DoesNotExist:
        return Response({'error': 'Employer profile not found'}, status=status.HTTP_404_NOT_FOUND)
    # Serializer validation
    serializer = JobsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(employer=employer_profile)  # Automatically assign employer
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Job Detail (GET)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def jobs_detail(request, pk):
    try:
        job = Jobs.objects.get(pk=pk)
    except Jobs.DoesNotExist:
        return Response({"error": "Job not found"},status=status.HTTP_404_NOT_FOUND)
    user = request.user
    if user.is_staff:  
        serializer = JobsSerializer(job)
        return Response(serializer.data)   
    elif hasattr(user, "employerprofile") and job.employer.user == user:
        serializer = JobsSerializer(job)
        return Response(serializer.data)
    else:
        serializer = JobsSerializer(job)
        return Response(serializer.data)
    

# Job Update (PUT/PATCH)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsAdminOrEmployer])
def jobs_update(request, pk):
    user = request.user
    if user.is_staff:
        job = get_object_or_404(Jobs, pk=pk)
    else:
        job = get_object_or_404(Jobs, pk=pk, employer__user=user)
    serializer = JobsSerializer(job, data=request.data, partial=True)  # partial=True = PATCH နဲ့လည်းအဆင်ပြေ
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Job Delete (DELETE)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminOrEmployer])
def jobs_delete(request, pk):
    user = request.user
    if user.is_staff:
        job = get_object_or_404(Jobs, pk=pk)
    else:
        job = get_object_or_404(Jobs, pk=pk, employer__user=user)
    job.delete()
    return Response({'message': 'Job deleted'}, status=status.HTTP_204_NO_CONTENT)




    