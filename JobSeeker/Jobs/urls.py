from django.urls import path
from . import views

urlpatterns = [
    

    # jobs category urls
    path('job-categories/', views.jobcategory_list_api, name='job_categories'),
    path('job-categories/create/', views.jobcategory_create_api, name='job-category-create'),
    path('job-categories/detail/<uuid:pk>/', views.jobcategory_detail_api, name='job-category-detail'),
    path('job-categories/update/<uuid:pk>/', views.jobcategory_update_api, name='job-category-update'),
    path('job-categories/delete/<uuid:pk>/', views.jobcategory_delete_api, name='job-category-delete'),
    
    # # # jobs urls
    path('jobs/', views.jobs_list_api, name='jobs-list'),
    path('jobs/create/', views.jobs_create_api, name='job-create'),

    #dashboard
    # path('dashboard/', views.dashboard_api, name='dashboard'),

    path('jobs/detail/<uuid:pk>/', views.jobs_detail_api, name='job-detail'),
    path('jobs/update/<uuid:pk>/', views.jobs_update_api, name='job-update'),
    path('jobs/delete/<uuid:pk>/', views.jobs_delete_api, name='job-delete'),


]

