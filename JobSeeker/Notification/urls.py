from django.urls import path
from . import views

urlpatterns = [
    path('notifications/', views.notification_list_api, name='notification-list'),
    path('notifications/create/', views.notification_create_api, name='notification-create'),
    path('notifications/<uuid:pk>/', views.notification_detail_api, name='notification-detail'),
    path('notifications/<uuid:pk>/update/', views.notification_update_api, name='notification-update'),
    path('notifications/<uuid:pk>/delete/', views.notification_delete_api, name='notification-delete'),
]