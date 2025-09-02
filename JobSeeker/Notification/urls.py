from django.urls import path
from . import views


urlpatterns = [
    path('notifications/', views.notifications_list, name='notifications'),
    path('notifications/create/', views.notification_create, name='notifications-create'),
    path('notifications/detail/<int:pk>/', views.notification_detail, name='notifications-detail'),
    path('notifications/update/<int:pk>/', views.notification_update, name='notifications-update'),
    path('notifications/delete/<int:pk>/', views.notification_delete, name='notifications-delete'),
]