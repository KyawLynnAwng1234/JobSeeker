from django.urls import path
from .views import *

urlpatterns = [

    path("application/<uuid:pk>/apply/", apply_job, name="apply-job"),
    path("employer/applications/<uuid:pk>/", employer_application_detail, name="employer-application-detail"),
    path("application/application/list/",application_list,name="application-list"),
    #save jobs
    path("saved-jobs/", save_jobs, name="saved-job-list"),  
    path("saved-jobs/<uuid:j_id>/",save_jobs,name="save-jobs"),
]