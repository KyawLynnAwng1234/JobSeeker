from django.urls import path
from . import views

urlpatterns = [
    path('notifications/applications/', views.application_notification_list, name='notification-list'),
    path('notifications/applications/delete/<uuid:pk>/', views.application_notification_delete, name='notification-read-delete'),
    path('notifications/jobs/', views.job_notifications_list, name='application-notification-list'),  # new path for application notifications
]