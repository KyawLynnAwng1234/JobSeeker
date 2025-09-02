from django.contrib import admin
from .models import JobCategory, Jobs
# Register your models here.

admin.site.register(JobCategory)
admin.site.register(Jobs)