from django.db import models
from Accounts.models import CustomUser

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    type = models.CharField(max_length=50)  # e.g. "application_update"
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

