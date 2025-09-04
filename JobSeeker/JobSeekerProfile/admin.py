from django.contrib import admin
<<<<<<< HEAD
from .models import JobseekerProfile, Resume, Education, Experience, Language, Skill
# Register your models here.

admin.site.register(JobseekerProfile)
admin.site.register(Resume)
admin.site.register(Education)
admin.site.register(Experience)
admin.site.register(Language)
admin.site.register(Skill)
=======
from .models import *

# Register your models here.
admin.site.register(JobseekerProfile)
admin.site.register(Resume)
>>>>>>> df9ff5ef6266e84a3e9a6258f21ac997f9f4a8f2
