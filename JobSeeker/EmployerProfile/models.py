from django.db import models
from Accounts.models import CustomUser
import uuid

class EmployerProfile(models.Model):
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,related_name="employerprofile")
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    business_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.business_name

