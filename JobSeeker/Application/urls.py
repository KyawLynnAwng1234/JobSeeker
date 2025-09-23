from django.urls import path
from .views import employer_application_detail

urlpatterns = [
    path('employer/applications/<uuid:pk>/', employer_application_detail, name='employer-application-detail'),
]