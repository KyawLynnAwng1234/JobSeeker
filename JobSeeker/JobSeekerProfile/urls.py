from django.urls import path
from .import views

urlpatterns = [
    path('jobseeker/signin/<str:role>/',views.signin_jobseeker_api,name="jobseekersiginpage"),
    path('jobseeker/sigout/',views.sigout_jobseeker_api,name="jobseekersigoutpage"),
    path('jobseeker/emailverify/',views.email_verify_jobseeker_api,name="emailverifypage"),
]