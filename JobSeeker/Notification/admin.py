from django.contrib import admin
from .models import Notification

# Register your models here.

# start Notification
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'message', 'type', 'is_read', 'created_at']
admin.site.register(Notification, NotificationAdmin)
# end Notification