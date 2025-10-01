from django.contrib import admin
from .models import EmployerProfile
# start EmployerProfile
class EmployerProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'first_name', 'last_name', 'business_name', 'city']
admin.site.register(EmployerProfile, EmployerProfileAdmin)
# end EmployerProfile

admin.site.register(EmployerProfile)

