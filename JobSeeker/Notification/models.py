from django.db import models
from Accounts.models import CustomUser
import uuid

class Notification(models.Model):
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False  # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    type = models.CharField(max_length=50)  # e.g. "application_update"
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True,null=True, blank=True)

