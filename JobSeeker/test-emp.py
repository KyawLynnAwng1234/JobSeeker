from EmployerProfile.serializers import EmployerProfileSerializer
from EmployerProfile.models import EmployerProfile
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "JobSeeker.settings")  # 👈 replace with your project’s settings path
django.setup()


def test_employer(request):
    employer=EmployerProfile.objects.get(id=1)
    print(employer)


test_employer()