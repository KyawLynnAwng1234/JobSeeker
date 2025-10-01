from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_overview, name="api-overview"),
    
    # start jobseekerprofile
    path('jobseekerprofile/', views.jobseekerprofile_list, name='jobseekerprofile-list'),
    path('jobseekerprofile/<int:pk>/', views.jobseekerprofile_detail, name='jobseekerprofile-detail'),
    # end JobseekerProfile
    
    # start skills
    path('skill/', views.skill_list, name='skill-list'),
    path('skill/<int:pk>/', views.skill_detail, name='skill-detail'),
    # end skills
    
    # start education
    path('education/', views.education_list, name='education-list'),
    path('education/<int:pk>/', views.education_detail, name='education-detail'),
    # end education
    
    # start Experience
    path('experience/', views.experience_list, name='experience-list'),
    path('experience/<int:pk>/', views.experience_detail, name='experience-detail'),
    # end Experience
    
    # start Language
    path('language/', views.language_list, name='language-list'),
    path('language/<int:pk>/', views.language_detail, name='language-detail'),
    # end Language
    
    # start Resume
    path('resume/', views.resume_list, name='resume-list'),
    path('resume/<int:pk>/', views.resume_detail, name='resume-detail'),
    # end Resume
]

