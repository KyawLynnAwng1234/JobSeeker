<<<<<<< HEAD
from django.urls import path
from .import views

urlpatterns = [
    path('employer/preregister/',views.preregister_employer_api,name="employer-preregisterpage"),
    path('employer/register/<str:role>/',views.register_employer_api,name="employer-registerpage"),
    # path('employer/sigout/',views.sigout_employer_api,name="employersigoutpage"),
    path('employer/emailverify/<uidb64>/<token>/',views.emailverify_employer_api,name="employer-emailverifypage"),
]
=======
from django.urls import path
>>>>>>> e657c1597df5ed2d10297f42b19dc39b22bbcf52
