from django.db import models
from JobSeekerProfile.models import JobseekerProfile, Resume
from Jobs.models import Jobs
import uuid

class SaveJob(models.Model):
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    profile = models.ForeignKey(JobseekerProfile, on_delete=models.CASCADE,)
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE, null=True, blank=True)


class Application(models.Model):
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    job_seeker_profile = models.ForeignKey(JobseekerProfile, on_delete=models.CASCADE,null=True, blank=True)
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE, null=True, blank=True)
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True,null=True, blank=True)
    status = models.CharField(max_length=50, default="pending",null=True, blank=True)
    cover_letter_text = models.TextField(null=True, blank=True)

