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
    with transaction.atomic():
        job = Jobs.objects.select_for_update().get(id=job_id)
        # Friendly guard: already applied
        existing = Application.objects.filter(job=job, job_seeker_profile=profile).first()
        if existing:
            return Response(
                {
                    "code": "ALREADY_APPLIED",
                    "message": "You’ve already applied to this job.",
                    "application_id": str(existing.id),
                    "applied_at": existing.applied_at,
                },
                status=status.HTTP_409_CONFLICT,
            )

        # Hard guard: job already closed
        if not job.is_active:
            return Response(
                {"code": "JOB_CLOSED", "message": "This job is no longer accepting applications."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # ====== CREATE APPLICATION ======
        ser = ApplicationCreateSerializer(
            data=request.data,
            context={"job": job, "profile": profile},
        )
        ser.is_valid(raise_exception=True)
        v = ser.validated_data
        app = Application.objects.create(
        job_seeker_profile=profile,
        job=job,
        resume=v.get("resume"),                 # <-- saved resume FK
        resume_form=v.get("resume_form"),
        resume_upload=v.get("resume_upload"),
        cover_letter_text=v.get("cover_letter_text", ""),
        status="P",
        )
        # ====== CHECK JOB LIMIT ======
        total = Application.objects.filter(job=job).count()
        max_apps = int(job.max_applicants or 0)
        if max_apps > 0 and total >= max_apps and job.is_active:
            job.is_active = False
            job.save(update_fields=["is_active"])
    return Response(ApplicationDetailSerializer(app).data, status=status.HTTP_201_CREATED)

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