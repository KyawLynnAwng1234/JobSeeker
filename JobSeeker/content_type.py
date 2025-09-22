from django.contrib.contenttypes.models import ContentType
from django.db import connection

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "JobSeeker.settings")
django.setup()

def get_content_type_for_model(model):

    obj=ContentType.objects.all()
    print(obj)


get_content_type_for_model()
