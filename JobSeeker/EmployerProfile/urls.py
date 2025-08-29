from django.urls import path
from .import views

urlpatterns = [

    #employer authentication paths
    path('employer/preregister/',views.preregister_employer_api,name="employer-preregisterpage"),
    path('employer/register/<str:role>/',views.register_employer_api,name="employer-registerpage"),
    path('employer/login/',views.login_api,name="employerlogoutpage"),
    path('employer/emailverify/<uidb64>/<token>/',views.emailverify_employer_api,name="employer-emailverifypage"),
    path('employer/resend-verification-email/',views.resend_verification_api,name="employer-resend-verification-emailpage"),
]