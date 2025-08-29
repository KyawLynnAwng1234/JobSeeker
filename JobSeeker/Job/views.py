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
