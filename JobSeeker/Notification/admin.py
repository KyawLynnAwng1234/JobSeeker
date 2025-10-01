# notifications/admin.py
from django.contrib import admin
from .models import Notification


# Register your models here.

# start Notification
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'message', 'type', 'is_read', 'created_at']
admin.site.register(Notification, NotificationAdmin)
# end Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'message', 'is_read', 'created_at')
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('message', 'metadata')
    ordering = ('-created_at',)






>>>>>>> 1bd9536d0467365122d63ca9338c38cb539590a9
