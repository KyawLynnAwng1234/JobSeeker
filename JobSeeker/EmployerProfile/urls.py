from django.urls import path
from .import views

urlpatterns = [

    #employer authentication paths
    path('employer/preregister/',views.preregister_employer_api,name="employer-preregisterpage"),
    path('employer/register/<str:role>/',views.register_employer_api,name="employer-registerpage"),
    path('employer/login/',views.login_employer_api,name="employer-loginpage"),
    path('employer/logout/',views.logout_employer_api,name="employer-logoutpage"),
    path('employer/emailverify/<uidb64>/<token>/',views.emailverify_employer_api,name="employer-emailverifypage"),
    path('employer/resend-verification-email/',views.resend_verification_api,name="employer-resend-verification-emailpage"),

   
    #employer dashboard paths
    path('employer/dashboard/', views.dashboard_api, name='employer-dashboard'),
    path('employer/profile/', views.employer_profile_api, name='employer-profile'),
    path('employer/profile-update/<str:pk>/',views.update_employer_profile_api,name="empployer-profile-update")
]