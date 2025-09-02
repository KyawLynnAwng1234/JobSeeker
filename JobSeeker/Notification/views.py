from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from django.shortcuts import get_object_or_404
from .serializers import NotificationSerializer
# Create your views here.




# ✅ List Notifications (only current user's)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications_list(request):
    notifications = Notification.objects.filter(
        user=request.user
    ).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



# Create Notification (admin or system)
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def notification_create(request):
    # Optional: restrict to admin/system
    serializer = NotificationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)  # or specify a target user
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#1. Detail View (GET)
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def notification_detail(request, pk):
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    serializer = NotificationSerializer(notification)
    return Response(serializer.data, status=status.HTTP_200_OK)

#  Update / Mark as Read (PATCH)
@api_view(['PATCH'])
# @permission_classes([IsAuthenticated])
def notification_update(request, pk):
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    serializer = NotificationSerializer(notification, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#  Delete View (DELETE)
@api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
def notification_delete(request, pk):
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    notification.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
