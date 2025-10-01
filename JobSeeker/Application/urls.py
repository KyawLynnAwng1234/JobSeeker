from django.urls import path
from .views import *

urlpatterns = [
    path("application/<uuid:pk>/apply/", apply_job, name="apply-job"),
    path('employer/applications/<uuid:pk>/', employer_application_detail, name='employer-application-detail'),
]