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
from .serializers import *
from .serializers import _snapshot_from_db, _require_all_sections # make sure these are correct
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Jobs, JobseekerProfile
from .utils import *

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_requirements(request, job_id=None):
    profile = JobseekerProfile.objects.get(user=request.user)
    snapshot = build_resume_snapshot(profile)
    missing = check_requirements(snapshot, MIN_REQ)
    return Response({
        "ok": not missing,
        "missing": decorate_missing(missing),
        "requirements": MIN_REQ,
        "have": {
            "education": len(snapshot.get("education", [])),
            "experience": len(snapshot.get("experience", [])),
            "skills": len(snapshot.get("skills", [])),
            "languages": len(snapshot.get("languages", [])),
            "summary": 1 if (snapshot.get("summary") or "").strip() else 0,
        }
    },status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def apply_job(request, pk):
    job = get_object_or_404(Jobs, id=pk)
    profile = get_object_or_404(JobseekerProfile, user=request.user)

    # Friendly guard
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

    allow_auto_general = True

    # ====== PARTIAL PERSIST (no atomic!) ======
    # If resume_form present, persist it so data survives even if we return 400.
    raw_form = request.data.get("resume_form")
    if raw_form:
        form_obj = raw_form
        if isinstance(raw_form, str):
            try:
                form_obj = json.loads(raw_form)
            except Exception:
                return Response({"resume_form": "Invalid JSON."}, status=400)
        form_obj = jsonify_dates(form_obj)
        persist_resume_sections(profile, form_obj)

        # Check completeness after persisting
        snapshot = _snapshot_from_db(profile)
        missing = _require_all_sections(snapshot)
        if missing:
            return Response(
                {
                    "code": "MISSING_REQUIRED_SECTIONS",
                    "message": "Please complete required sections before applying.",
                    "missing": missing,
                },
                status=400,
            )

    # ====== CREATE (small atomic block) ======
    ser = ApplicationCreateSerializer(
        data=request.data,
        context={"job": job, "profile": profile, "allow_auto_general": allow_auto_general},
    )
    ser.is_valid(raise_exception=True)

    # Only wrap the creation in atomic
    with transaction.atomic():
        app = ser.save()

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
