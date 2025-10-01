from django.contrib import admin
from .models import *

# Register your models here.

# start JobseekerProfile
class JobseekerProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'full_name', 'phone', 'address', 'profile_picture', 'bio']
admin.site.register(JobseekerProfile, JobseekerProfileAdmin)
# end JobseekerProfile

# start Resume
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['id', 'profile', 'title', 'file_url', 'file_type', 'is_default', 'created_at']
admin.site.register(Resume, ResumeAdmin)
# end Resume

# start Education
class EducationAdmin(admin.ModelAdmin):
    list_display = ['id', 'profile', 'school_name', 'degree', 'field_of_study', 'start_year', 'end_year']
admin.site.register(Education, EducationAdmin)
# end Education

# start Experience
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['id', 'profile', 'company_name', 'position', 'start_date', 'end_date', 'description']
admin.site.register(Experience, ExperienceAdmin)
# end Experience

# start Language
class LanguageAdmin(admin.ModelAdmin):
    list_display = ['id', 'profile', 'name', 'proficiency']
admin.site.register(Language, LanguageAdmin)
# end Language

# start Skill
class SkillAdmin(admin.ModelAdmin):
    list_display = ['id', 'profile', 'name', 'proficiency']
admin.site.register(Skill, SkillAdmin)

# Register your models here.
admin.site.register(JobseekerProfile)
admin.site.register(Resume)
admin.site.register(Skill)
admin.site.register(Education)
admin.site.register(Language)
admin.site.register(Experience)


