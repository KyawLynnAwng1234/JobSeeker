# applications/views.py
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404  # see below
from django.db import IntegrityError, transaction
from .models import Jobs, JobseekerProfile
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from .models import *
from Jobs.models import *
from .serializers import *

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def apply_job(request, job_id):
    profile = get_object_or_404(JobseekerProfile, user=request.user)
    job = get_object_or_404(Jobs, id=job_id)

    serializer = ApplicationCreateSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        # If max_applicants is not set, treat as unlimited
        if job.max_applicants is not None:
            total = Application.objects.filter(job=job).count()
            if total >= job.max_applicants:
                if job.is_active:  # only save when it changes
                    job.is_active = False
                    job.save(update_fields=["is_active"])
                return Response(
                    {"message": "The maximum number of applicants for this job has been reached."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        try:
            with transaction.atomic():
                application = Application.objects.create(
                    job_seeker_profile=profile,
                    job=job,
                    status=serializer.validated_data.get("status", "P"),
                    cover_letter_text=serializer.validated_data.get("cover_letter_text", "")
                )

                # ✅ Re-count AFTER creating; if we just hit the cap, close the job
                if job.max_applicants is not None:
                    total_after = Application.objects.filter(job=job).count()
                    if total_after >= job.max_applicants and job.is_active:
                        job.is_active = False
                        job.save(update_fields=["is_active"])

                s_application = ApplicationDetailSerializer(application).data
                return Response({
                    "success": True,
                    "message": f"You have successfully applied for the job '{job.title}'.",
                    "data": s_application
                }, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response(
                {"message": "You have already applied for this job."},
                status=status.HTTP_400_BAD_REQUEST
            )

    # DRF already raised on invalid; this branch is rarely reached
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_job(request,job_id):
    try:
        profile=JobseekerProfile.objects.get(user=request.user)
    except JobseekerProfile.DoesNotExist:
        return Response({"detail": "Ah! You have to create profile before save job"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        job=Jobs.objects.get(id=job_id)
    except Jobs.DoesNotExist:
        return Response({"detail": "This job does not exist"}, status=status.HTTP_404_NOT_FOUND)
    try:
        save_job=SaveJob.objects.create(profile=profile,job=job)
        s_save_job=SaveJobsSerializer(save_job).data
        return Response({
            "success": True,
            "message": f"Job '{job.title}' has been saved successfully.",
            "data": s_save_job
        }, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response({"detail": "You have already saved this job"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET',])
@permission_classes([IsAuthenticated])
def saved_jobs(request):
    try:
        profile=JobseekerProfile.objects.get(user=request.user)
    except JobseekerProfile.DoesNotExist:
        return Response({"detail": "Ah! You have to create profile before save job"}, status=status.HTTP_404_NOT_FOUND)
    
    savejobs=SaveJob.objects.filter(profile=profile)
    s_savejobs=SaveJobsSerializer(savejobs,many=True).data
    return Response({"s_savejobs":s_savejobs})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def saved_job_detail(request,sj_id):
    try:
        profile=JobseekerProfile.objects.get(user=request.user)
    except JobseekerProfile.DoesNotExist:
        return Response({"detail": "Ah! You have to create profile before save job"}, status=status.HTTP_404_NOT_FOUND)
    try:
        saved_job=SaveJob.objects.get(profile=profile,id=sj_id)
    except SaveJob.DoesNotExist:
        return Response({"detail": "This job is not saved."}, status=status.HTTP_404_NOT_FOUND)
    s_saved_job=SaveJobsSerializer(saved_job).data
    return Response({"saved_job":s_saved_job})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def saved_job_remove(request,sj_id):
    if request.method == "DELETE":
        try:
            profile=JobseekerProfile.objects.get(user=request.user)
        except JobseekerProfile.DoesNotExist:
            return Response({"detail": "Ah! You have to create profile before save job"}, status=status.HTTP_404_NOT_FOUND)
        try:
            saved_job=SaveJob.objects.get(profile=profile,id=sj_id)
        except SaveJob.DoesNotExist:
            return Response({"detail": "This job is not saved."}, status=status.HTTP_404_NOT_FOUND)
        saved_job.delete()
        return Response({"Message":f"Job {saved_job.job.title} Succssfully Remove"},status=status.HTTP_200_OK)
    else:
        return Response({"Message":"Something Wrong Please try again"})

@api_view(['GET'])
def applied_jobs(request):
    applications = Application.objects.filter(job_seeker_profile__user=request.user)
    app_job=ApplicationListSerializer(applications,many=True).data
    return Response({"apply_jobs": app_job})

@api_view(['GET'])
def applied_job_detail(request,app_id):
    application = get_object_or_404(Application,id=app_id, job_seeker_profile__user=request.user)
    app_detail=ApplicationDetailSerializer(application).data
    return Response({"application_detail": app_detail})

@api_view(['DELETE'])
def applied_job_remove(request,app_id):
    if request.method == "DELETE":
        application=get_object_or_404(Application,id=app_id,job_seeker_profile__user=request.user)
        application.delete()
        return Response({"Message":f"Job {application.job.title} Succssfully Remove"},status=status.HTTP_200_OK)
    else:
        return Response({"Message":"Something Wrong Please try again"})