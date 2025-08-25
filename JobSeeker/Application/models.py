from django.db import models
from JobSeekerProfile.models import JobseekerProfile, Resume
from Job.models import Jobs

class SaveJob(models.Model):
    profile = models.ForeignKey(JobseekerProfile, on_delete=models.CASCADE)
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE)


class Application(models.Model):
    job_seeker_profile = models.ForeignKey(JobseekerProfile, on_delete=models.CASCADE)
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="pending")
    cover_letter_text = models.TextField(blank=True, null=True)

