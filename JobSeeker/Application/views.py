# applications/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Application
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
from .serializers import * # make sure these are correct
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Jobs, JobseekerProfile


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser, MultiPartParser, FormParser])
@transaction.atomic
def apply_job(request, pk):
    job = get_object_or_404(Jobs, id=pk)
    profile = get_object_or_404(JobseekerProfile, user=request.user)
    # Soft guard (friendly 409)
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

    # Toggle this flag if you want to allow auto-general when body is empty
    allow_auto_general = True  # set True to auto-compose from profile when no resume provided

    ser = ApplicationCreateSerializer(
        data=request.data,
        context={"job": job, "profile": profile, "allow_auto_general": allow_auto_general},
    )
    ser.is_valid(raise_exception=True)

    try:
        app = ser.save()
    except IntegrityError as exc:
        # Race-condition safety for the unique constraint
        if "unique_application_per_jobseeker_job" in str(exc):
            existing = Application.objects.filter(job=job, job_seeker_profile=profile).first()
            return Response(
                {
                    "code": "ALREADY_APPLIED",
                    "message": "You’ve already applied to this job.",
                    "application_id": str(existing.id) if existing else None,
                },
                status=status.HTTP_409_CONFLICT,
            )
        raise

    return Response(ApplicationDetailSerializer(app).data, status=status.HTTP_201_CREATED)


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
