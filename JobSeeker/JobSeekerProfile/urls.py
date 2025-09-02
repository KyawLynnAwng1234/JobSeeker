<<<<<<< HEAD
from django.urls import path
from .import views

urlpatterns = [
    path('jobseeker/sigin/<str:role>/',views.sigin_jobseeker_api,name="jobseekersiginpage"),
    path('jobseeker/sigout/',views.sigout_jobseeker_api,name="jobseekersigoutpage"),
    path('jobseeker/emailverify/',views.email_verify_jobseeker_api,name="emailverifypage"),
]
=======
from django.urls import path
>>>>>>> e657c1597df5ed2d10297f42b19dc39b22bbcf52
