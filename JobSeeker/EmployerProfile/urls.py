<<<<<<< HEAD
from django.urls import path
from .import views

urlpatterns = [

    #employer authentication paths
    path('employer/preregister/',views.preregister_employer_api,name="employer-preregisterpage"),
    path('employer/register/<str:role>/',views.register_employer_api,name="employer-registerpage"),
    path('employer/login/',views.login_employer_api,name="employer-loginpage"),
    path('employer/logout/',views.logout_employer_api,name="employer-logoutpage"),
    path('employer/emailverify/<uidb64>/<token>/',views.emailverify_employer_api,name="employer-emailverifypage"),
<<<<<<< HEAD
]
=======
from django.urls import path
>>>>>>> e657c1597df5ed2d10297f42b19dc39b22bbcf52
=======
    path('employer/resend-verification-email/',views.resend_verification_api,name="employer-resend-verification-emailpage"),

    #dashboard
    path('employer/dashboard/',views.employer_dashboard,name="employer-dashboard")
]
>>>>>>> df9ff5ef6266e84a3e9a6258f21ac997f9f4a8f2
