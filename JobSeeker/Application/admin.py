from django.contrib import admin
<<<<<<< HEAD
from .models import SaveJob, Application
# Register your models here.

admin.site.register(SaveJob)
admin.site.register(Application)
=======
from .models import *

# Register your models here.
admin.site.register(Application)
>>>>>>> df9ff5ef6266e84a3e9a6258f21ac997f9f4a8f2
