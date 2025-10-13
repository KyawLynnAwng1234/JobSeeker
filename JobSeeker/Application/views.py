# applications/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import *
from Jobs.models import *
from .serializers import *
from django.shortcuts import get_object_or_404  # see below
from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Jobs, JobseekerProfile
from .serializers import *


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def apply_job(request, pk):
    profile = get_object_or_404(JobseekerProfile, user=request.user)
    with transaction.atomic():
        job = Jobs.objects.select_for_update().get(id=pk)
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def application_list(request):
    app=Application.objects.all()#filter(job_seeker_profile__user=request.user)
    app_count=app.count()
    print(app)
    print(app_count)
    s_app=ApplicationListSerializer(app,many=True).data

    

    
    return Response({"Applications":s_app})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def employer_application_detail(request, pk):
    """
    Employer can view details of an application ONLY if it belongs to their job.
    """
    try:
        app = Application.objects.select_related('job', 'job__employer', 'job__employer__user')\
                                 .get(pk=pk, job__employer__user=request.user)
    except Application.DoesNotExist:
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(ApplicationDetailSerializer(app).data)

@api_view(['GET','POST','DELETE'])
@permission_classes([IsAuthenticated])
def save_jobs(request, j_id=None):
    try:
        profile=JobseekerProfile.objects.get(user=request.user)
    except JobseekerProfile.DoesNotExist:
        return Response({"detail": "Ah! You have to create profile before save job"}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == "GET" and j_id is None:
        savejobs=SaveJob.objects.filter(profile=profile)
        s_savejobs=SaveJobsSerializer(savejobs,many=True).data
        return Response({"s_savejobs":s_savejobs})
    if request.method == "POST" and j_id is not None:
        try :
            job=Jobs.objects.get(id=j_id)
        except Jobs.DoesNotExist:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
        saved, created = SaveJob.objects.get_or_create(profile=profile, job=job)

        if not created:
            return Response({"message": "Already saved."}, status=status.HTTP_200_OK)
        serializer = SaveJobsSerializer(saved)
        return Response({
            "message": "Job saved successfully!",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    #DELETE: unsave job
    if request.method == "DELETE" and j_id is not None:
        try:
            saved = SaveJob.objects.get(profile=profile, job_id=j_id)
            saved.delete()
            return Response({"detail": "Job unsaved successfully."}, status=status.HTTP_204_NO_CONTENT)
        except SaveJob.DoesNotExist:
            return Response({"detail": "This job is not saved."}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)

