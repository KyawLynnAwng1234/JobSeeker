from django.db import models
from JobSeekerProfile.models import JobseekerProfile,Resume
from Jobs.models import Jobs
from django.db.models import Q
from django.core.exceptions import ValidationError
import uuid

class SaveJob(models.Model):
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    profile = models.ForeignKey(JobseekerProfile, on_delete=models.CASCADE,related_name='saved_jobs', null=True, blank=True)
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["profile", "job"],
                name="unique_save_job_per_jobseeker_job"
        )
    ]
    def __str__(self):
        return f"{self.profile} saved {self.job}"



class Application(models.Model):
    STATUS_CHOICES = [
        ('P', 'Pending'),
        ('AC', 'Accept'),
        ('RJ', 'Reject'),
    ]
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    job_seeker_profile = models.ForeignKey(JobseekerProfile,on_delete=models.CASCADE,null=True)
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE, null=True)
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True,blank=True)
    resume_form = models.JSONField(null=True, blank=True, default=None)
    resume_upload=models.ImageField(upload_to="resume-file",null=True,blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES,default='P',null=True, blank=True)
    cover_letter_text = models.TextField(null=True)
    max_applicants = models.PositiveIntegerField(default=0, help_text="Maximum number of allowed applicants",null=True)
    applied_at = models.DateTimeField(auto_now_add=True,null=True, blank=True)
    updated_at=models.DateTimeField(auto_now=True,null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["job_seeker_profile", "job"],
                name="unique_application_per_jobseeker_job"
        ),
            models.CheckConstraint(
            name="app_resume_xor_form",
            check=(
                (Q(resume__isnull=False) & Q(resume_form__isnull=True)) |
                (Q(resume__isnull=True) & Q(resume_form__isnull=False))
            ),
        ),
    ]
        
    def clean(self):
        """
        Custom validation before saving (called by ModelForm.is_valid() or full_clean()).
        """
        if self.resume and self.resume_form:
            raise ValidationError("❌ Choose either an uploaded resume OR fill the manual resume form, not both.")

        if not self.resume and not self.resume_form:
            raise ValidationError("❌ You must provide either an uploaded resume OR fill the manual resume form.")
       
    def __str__(self):
        return f"{self.job_seeker_profile} → {self.job} ({self.status})"



