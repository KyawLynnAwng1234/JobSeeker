from django.contrib import admin
from .models import SaveJob, Application

# Register your models here.

# start Savejob
class SaveJobAdmin(admin.ModelAdmin):
    list_display = ['id', 'profile', 'job']
admin.site.register(SaveJob, SaveJobAdmin)

# Register your models here.
admin.site.register(Application)
admin.site.register(SaveJob)
