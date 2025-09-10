
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
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
#dashboard
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def dashboard_api(request):
#     today=timezone.localdate()
#     user=request.user
#     total_jobs=Jobs.objects.filter(employer__user=user).count()
#     total_applications=Application.objects.filter(job__employer__user=user).count()
#     active_jobs=Jobs.objects.filter(Q(employer__user=user)&Q(deadline__gte=today) | Q(deadline__isnull=True)).count()
#     expired_jobs=Jobs.objects.filter(Q(employer__user=user)&Q(deadline__lt=today)).count()
#     # data=JobsSerializer(expired_jobs,many=True).data
    

#     return Response({
#         'total_jobs':total_jobs,
#         'total_applications':total_applications,
#         'active_jobs':active_jobs,
#         # 'expired_jobs_count':expired_jobs_count
#         'expired_jobs':expired_jobs

#         })
        
#end dashboard


# Category List (GET)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def jobcategory_list_api(request):
    categories= JobCategory.objects.all()
    serializer = JobCategorySerializer(categories, many=True)
    return Response(serializer.data)

# Category Create (POST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])

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
def jobcategory_delete_api(request, pk):
    try:
        category = JobCategory.objects.get(pk=pk)
    except JobCategory.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    category.delete()
    return Response({'message': 'Category deleted'}, status=status.HTTP_204_NO_CONTENT)


# jobs list
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def jobs_list_api(request):
    user=request.user
    jobs = Jobs.objects.filter(employer__user=user)
    serializer = JobsSerializer(jobs, many=True)
    return Response(serializer.data, status=200)

# jobs create
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def jobs_detail_api(request, pk):
    try:
        job = Jobs.objects.get(pk=pk)
    except Jobs.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = JobsSerializer(job)
    return Response(serializer.data)


# Job Update
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
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
def jobs_delete_api(request, pk):
    try:
        job = Jobs.objects.get(pk=pk)
    except Jobs.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    job.delete()
    return Response({'message': 'Job deleted'}, status=status.HTTP_204_NO_CONTENT)




    