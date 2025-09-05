from django.db import models

# Create your models here.
from django.db import models
from EmployerProfile.models import EmployerProfile
import uuid

class JobCategory(models.Model):
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Jobs(models.Model):
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    description = models.TextField()
    location = models.CharField(max_length=150)
    job_type = models.CharField(max_length=50)
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    deadline = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.title