
from django.contrib import admin
from django.urls import path,re_path,include
from django.conf import settings
from django.conf.urls.static import static
from UI import views

urlpatterns = [
    #app urls
    path('admin/', admin.site.urls),
    path('accounts-jobseeker/',include('JobSeekerProfile.urls')),
    path('accounts-employer/',include('EmployerProfile.urls')),
    path('job/',include('Jobs.urls')),
    path('notifications/',include('Notification.urls')),

    #allauth and dj-rest-auth
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
    path("auth/social/", include("allauth.socialaccount.urls")),

   
   
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

#frontend
urlpatterns += [
    re_path(r'^(?:.*)/?$', views.frontend)
]