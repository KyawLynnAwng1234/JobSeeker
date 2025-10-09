from django.db import models
from django.db import models
from EmployerProfile.models import EmployerProfile
from Accounts.models import CustomUser
import uuid

class JobCategory(models.Model):
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True,blank=True,null=True)
    updated_at = models.DateTimeField(auto_now=True,blank=True,null=True)
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,blank=True,null=True)

    def __str__(self):
        return self.name

class Jobs(models.Model):

    JOB_TYPE_CHOICES = [
        ('FULL', 'Full-time'),
        ('PART', 'Part-time'),
        ('INTERN', 'Internship'),
        ('REMOTE', 'Remote'),
        
    ]

    LOCATION_CHOICES = [
        ('MO', 'MRAUK-U'),
        ('MB', 'MINBRAR'),
        ('SIT', 'SITTWE'),
        ('RD', 'RETHEEDAUNG'),
        ('MD', 'MAUNGDAW'),
        ('KP', 'KYAWTPYHU'),
        ('TD', 'THANDWE'),
        ('TG', 'TOUNGUP'),
        ('AN', 'ANN'),
        ('PNG', 'PONNAGYUN'),
        ('KT', 'KYAUKTAW'),
        ('RM', 'RAMREE'),
        ('MA', 'MANAUNG'),
        ('GW', 'GWA'),
        ('PT', 'PAUKTAW'),
        ('BTD', 'BUTHIDAUNG'),
        ('MB', 'MYEBON'),
    ]

    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    
    employer=models.ForeignKey(EmployerProfile, on_delete=models.CASCADE,blank=True,null=True,related_name="jobs")
    title = models.CharField(max_length=150)
    description = models.TextField()
    location = models.CharField(choices=LOCATION_CHOICES,default='MO',)
    job_type = models.CharField(choices=JOB_TYPE_CHOICES,default='FULL',)
    salary = models.DecimalField(max_digits=12,decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    max_applicants = models.PositiveIntegerField(default=0, help_text="Maximum number of allowed applicants")
    deadline = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True,null=True, blank=True)

    def __str__(self):
        return self.title