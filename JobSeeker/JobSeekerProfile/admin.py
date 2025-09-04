from django.contrib import admin
from .models import JobseekerProfile, Resume, Education, Experience, Language, Skill
# Register your models here.

admin.site.register(JobseekerProfile)
admin.site.register(Resume)
admin.site.register(Education)
admin.site.register(Experience)
admin.site.register(Language)
admin.site.register(Skill)

