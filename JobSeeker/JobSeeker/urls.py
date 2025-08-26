
from django.contrib import admin
from django.urls import path,re_path,include
from UI import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts-jobseeker/',include('JobSeekerProfile.urls')),
    path('accounts-employer/',include('EmployerProfile.urls')),


    re_path(r'^(?:.*)/?$', views.frontend),
]
