from rest_framework import serializers
from Accounts.models import *

class JobSeekerRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email']

class JobSeekerSignInSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email']
