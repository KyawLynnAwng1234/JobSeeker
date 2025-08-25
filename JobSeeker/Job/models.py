from django.db import models
from EmployerProfile.models import EmployerProfile

class JobCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Jobs(models.Model):
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

