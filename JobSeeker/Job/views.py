<<<<<<< HEAD
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import JobCategory, Jobs
from .serializers import JobCategorySerializer, JobsSerializer
from EmployerProfile.models import EmployerProfile
from Accounts.decorators import role_required
from django.shortcuts import get_object_or_404

# Create your views here.


# Category List (GET)
@api_view(['GET'])
def jobcategory_list_api(request):
    categories = JobCategory.objects.all()
    serializer = JobCategorySerializer(categories, many=True)
    return Response(serializer.data)

# Category Create (POST)
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
# @role_required(['employer', 'admin'])  # create လုပ်နိုင်သူ role
def jobcategory_create_api(request):
    serializer = JobCategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

# Category Detail
@api_view(['GET'])
def jobcategory_detail_api(request, pk):
    category = get_object_or_404(JobCategory, pk=pk)
    serializer = JobCategorySerializer(category)
    return Response(serializer.data)

# Category Update
@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# @role_required(['employer', 'admin'])  # create လုပ်နိုင်သူ role
def jobcategory_update_api(request, pk):
    try:
        category = JobCategory.objects.get(pk=pk)
    except JobCategory.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = JobCategorySerializer(category, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Category Delete
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@role_required(['employer', 'admin'])  # create လုပ်နိုင်သူ role
def jobcategory_delete_api(request, pk):
    try:
        category = JobCategory.objects.get(pk=pk)
    except JobCategory.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    category.delete()
    return Response({'message': 'Category deleted'}, status=status.HTTP_204_NO_CONTENT)


# jobs list
@api_view(['GET'])
def jobs_list_api(request):
    jobs = Jobs.objects.all()
    serializer = JobsSerializer(jobs, many=True)
    return Response(serializer.data, status=200)

# jobs create
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@role_required(['employer'])
def jobs_create_api(request):
    user = request.user
    try:
        employer_profile = EmployerProfile.objects.get(user=user)
    except EmployerProfile.DoesNotExist:
        return Response({'error': 'Employer profile not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = JobsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(employer=employer_profile)  # employer assign automatically
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Job Detail
@api_view(['GET'])
def jobs_detail_api(request, pk):
    try:
        job = Jobs.objects.get(pk=pk)
    except Jobs.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = JobsSerializer(job)
    return Response(serializer.data)


# Job Update
@api_view(['PATCH'])
# @permission_classes([IsAuthenticated])
# @role_required(['employer', 'admin'])  # create လုပ်နိုင်သူ role
def jobs_update_api(request, pk):
    try:
        job = Jobs.objects.get(pk=pk)
    except Jobs.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = JobsSerializer(job, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Job Delete
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@role_required(['employer', 'admin'])  # create လုပ်နိုင်သူ role
def jobs_delete_api(request, pk):
    try:
        job = Jobs.objects.get(pk=pk)
    except Jobs.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    job.delete()
    return Response({'message': 'Job deleted'}, status=status.HTTP_204_NO_CONTENT)

=======
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import JobCreateSerializer
from .models import EmployerProfile

@api_view(["POST"])
def create_job_api(request):
    # 1. must be verified
    print("AUTH:", request.user.is_authenticated, request.user)

    if not request.user.is_verified:
        return Response(
            {"detail": "Please verify your email before creating a job."},
            status=status.HTTP_403_FORBIDDEN
        )

    # 2. must have employer profile
    try:
        employer = EmployerProfile.objects.get(user=request.user)
    except EmployerProfile.DoesNotExist:
        return Response(
            {"detail": "You must complete employer profile before creating jobs."},
            status=status.HTTP_403_FORBIDDEN
        )

    # 3. validate and save
    serializer = JobCreateSerializer(data=request.data)
    if serializer.is_valid():
        job = serializer.save(employer=employer)  # ✅ inject employer
        return Response(JobCreateSerializer(job).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
>>>>>>> df9ff5ef6266e84a3e9a6258f21ac997f9f4a8f2
