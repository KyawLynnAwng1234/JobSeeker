from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from Application.models import *
from Jobs.models import *
from .serializers import NotificationSerializer
from django.contrib.contenttypes.models import ContentType

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_sample_notifications(request):
    try:
        # Example objects
        job = Jobs.objects.first()
        application = Application.objects.first()

        if not job or not application:
            return Response({"error": "No job or Application found"}, status=404)

        # Create notification for a Job
        Notification.objects.create(
            user=job.employer.user,
            message="New job created!",
            type="job_created",
            content_type=ContentType.objects.get_for_model(Jobs),
            object_id=job.id
        )

        # Create notification for an Employer
        Notification.objects.create(
            user=application.profile.user,
            message="New Application Here",
            type="Application Notification",
            content_type=ContentType.objects.get_for_model(Application),
            object_id=application.id
        )

        return Response({"success": True, "message": "Notifications created"})
    
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# # notifications list
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_list_api(request):
    """
    Login user ရဲ့ notification list ပြရန်
    """
    user = request.user
    notifications = Notification.objects.filter(user=user).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    
    unread_count = notifications.filter(is_read=False).count()
    
    return Response({
        "notifications": serializer.data,
        "unread_count": unread_count
    })


# # notifications create
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def notification_create_api(request):
#     """
#     Admin သို့ system ကို အသုံးပြုပြီး notification create
#     """
#     serializer = NotificationSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(user=request.user)  # auto assign current user, or specify target user
#         return Response(serializer.data, status=201)
#     return Response(serializer.errors, status=400)


# # notifications detail
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def notification_detail_api(request, pk):
#     """
#     Login user ရဲ့ notification တစ်ခုကို ကြည့်ရန်
#     """
#     notification = get_object_or_404(Notification, pk=pk, user=request.user)
#     serializer = NotificationSerializer(notification)
#     return Response(serializer.data)


# # notifications update
# @api_view(['PATCH'])
# @permission_classes([IsAuthenticated])
# def notification_update_api(request, pk):
#     """
#     Notification ကို mark as read လုပ်ခြင်း
#     """
#     notification = get_object_or_404(Notification, pk=pk, user=request.user)
#     serializer = NotificationSerializer(notification, data=request.data, partial=True)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=400)


# # notification delete
# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
# def notification_delete_api(request, pk):
#     """
#     Login user ရဲ့ notification ကို delete လုပ်ရန်
#     """
#     notification = get_object_or_404(Notification, pk=pk, user=request.user)
#     notification.delete()
#     return Response({"message": "Notification deleted"}, status=204)