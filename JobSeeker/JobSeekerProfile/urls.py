from django.urls import path
from .import views

urlpatterns = [
    # path('jobseeker',views.jobseeker,name="jobseekerpage"),
    path('jobseeker/register/<str:role>/',views.register_jobseeker_api,name="jobseekerRegisterpage"),
    path('jobseeker/sigin/<str:role>/',views.sigin_jobseeker_api,name="jobseekersiginpage"),
    path('jobseeker/sigout',views.sigout_jobseeker_api,name="jobseekersigoutpage"),
    path('emailverify/',views.email_verify_jobseeker_api,name="emailverifypage"),
]