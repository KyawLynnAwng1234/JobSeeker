from django.db import models
from Accounts.models import CustomUser

class EmployerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    business_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.business_name

