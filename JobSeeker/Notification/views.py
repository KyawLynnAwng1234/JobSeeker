from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from Application.models import *
from Jobs.models import *
from .serializers import NotificationSerializer
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q

# application notifications list
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def application_notification_list(request):
    """
    Login user ရဲ့ jobs notification list ပြရန်
    """
    user = request.user
    ct_app = ContentType.objects.get_for_model(Application, for_concrete_model=False)

    # Base queryset (all application notifications for this user)
    base_qs = (
        Notification.objects
        .filter(user=user, content_type=ct_app)
        .select_related('content_type')
        .order_by('-created_at')
    )

    # Counts (cheap + consistent)
    total_count = base_qs.count()
    read_count = base_qs.filter(is_read=True).count()
    unread_count = total_count - read_count

    # Split lists
    read_notifications = base_qs.filter(is_read=True)
    unread_notifications = base_qs.filter(is_read=False)

    # Serialize separately (DON’T pass two querysets to one serializer)
    all_ser = NotificationSerializer(base_qs, many=True, context={'request': request})
    read_ser = NotificationSerializer(read_notifications, many=True, context={'request': request})
    unread_ser = NotificationSerializer(unread_notifications, many=True, context={'request': request})

    return Response({
        "counts": {
            "total": total_count,
            "read": read_count,
            "unread": unread_count,
        },

        "all_list": all_ser.data,
        "read_list": read_ser.data,
        "unread_list": unread_ser.data,
    })

#delete application notification read list
@api_view(["DELETE"])  # allow API DELETE and admin POST form
@permission_classes([IsAuthenticated])
def application_notification_delete(request,pk):
        """
        Login user ရဲ့ read notification တွေကို delete လုပ်ရန်
        """
        user = request.user
        ct_app = ContentType.objects.get_for_model(Application, for_concrete_model=False)
        # Queryset of read application notifications for this user
        read_qs = (
            Notification.objects
            .filter(user=user,content_type=ct_app, pk=pk)
        )
        deleted_count, _ = read_qs.delete()
        return Response({
             "message": f"{deleted_count} read notifications deleted.",
             
             }, status=204)


#job notification list api
@api_view(['GET'])  
@permission_classes([IsAuthenticated])
@permission_classes([IsAdminUser])
def job_notifications_list(request):
    """
    Admin: list ONLY Job-related notifications (site-wide).
    """
    ct_jobs = ContentType.objects.get_for_model(Jobs, for_concrete_model=False)
    qs = (Notification.objects
          .filter(content_type=ct_jobs)
        #   .select_related('content_type')
          .order_by('-created_at'))
    serializer = NotificationSerializer(qs, many=True)
    return Response(serializer.data)

    
    
   
    
    


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