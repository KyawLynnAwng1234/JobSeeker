from django.urls import path
from .import views

urlpatterns = [
    path('createjob/',views.create_job_api,name="createjobpage"),
]