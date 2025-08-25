from django.contrib import admin
from .models import SaveJob, Application

# Register your models here.

# start Savejob
class SaveJobAdmin(admin.ModelAdmin):
    list_display = ['id', 'profile', 'job']
admin.site.register(SaveJob, SaveJobAdmin)
# end SaveJob

# start Application
admin.site.register(Application)
# end Application