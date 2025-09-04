<<<<<<< HEAD
from django.urls import path
from .import views

urlpatterns = [

    path('jobseeker/signin/<str:role>/',views.signin_jobseeker_api,name="jobseekersiginpage"),
    path('jobseeker/sigout/',views.sigout_jobseeker_api,name="jobseekersigoutpage"),
<<<<<<< HEAD
    path('jobseeker/emailverify/',views.email_verify_jobseeker_api,name="emailverifypage"),
]
=======
from django.urls import path
>>>>>>> e657c1597df5ed2d10297f42b19dc39b22bbcf52
=======
    path('jobseeker/send/otp/',views.otp_verify_jobseeker_api,name="jobseekeremailverifypage"),
    path("jobseeker/resend/otp/",views.otp_resend_jobseeker_api, name="jobseeker-otp-resend"),

    #current user for login user 
    path('jobseeker/currentuser/',views.current_user,name="jobseekercurrentuserpage"),

    #employer dashboard
    

]
>>>>>>> df9ff5ef6266e84a3e9a6258f21ac997f9f4a8f2
