from django.urls import path
from .views import *

urlpatterns = [

    path("application/profile/requirements/",profile_requirements, name="profile-requirements"),
    path("application/<uuid:pk>/apply/", apply_job, name="apply-job"),
    path("employer/applications/<uuid:pk>/", employer_application_detail, name="employer-application-detail"),

    #save jobs
    path("saved-jobs/", save_jobs, name="saved-job-list"),  
    path("saved-jobs/<uuid:j_id>/",save_jobs,name="save-jobs"),
]