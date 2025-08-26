from rest_framework import serializers
from Accounts.models import *


class JobSeekerSignInSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email",]


