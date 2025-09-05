from django.contrib import admin
from .models import JobCategory, Jobs

admin.site.register(Jobs)
admin.site.register(JobCategory )

