# applications/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Application
from .serializers import ApplicationDetailSerializer  # see below

@api_view(['GET'])
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
