from django.contrib import admin
from .models import JobCategory, Jobs

# Register your models here.

# start JobCategory
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
admin.site.register(JobCategory, JobCategoryAdmin)
# end JobCategory


# start Jobs
class JobsAdmin(admin.ModelAdmin):
    list_display = ['id', 'employer', 'title', 'description', 'location', 'job_type', 'salary', 'category', 'is_active', 'deadline']
admin.site.register(Jobs, JobsAdmin)
# end Jobs