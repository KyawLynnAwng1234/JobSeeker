
from django.contrib import admin
from django.urls import path,re_path,include
from UI import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/',include('JobSeekerProfile.urls')),

    re_path(r'^(?:.*)/?$', views.frontend),
]
