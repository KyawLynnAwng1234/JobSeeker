from django.contrib import admin
<<<<<<< HEAD
from .models import JobCategory, Jobs
# Register your models here.

admin.site.register(JobCategory)
admin.site.register(Jobs)
=======
from .models import Jobs,JobCategory

# Register your models here.

admin.site.register(Jobs)
admin.site.register(JobCategory)
>>>>>>> df9ff5ef6266e84a3e9a6258f21ac997f9f4a8f2
