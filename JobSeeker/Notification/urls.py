from django.urls import path
from . import views

urlpatterns = [
    path('notifications/', views.notification_list_api, name='notification-list')
    
]