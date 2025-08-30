from rest_framework import serializers
from Accounts.models import *


class JobSeekerSignInSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(required=True)
    class Meta:
        model = CustomUser
        fields = ["id", "email",]


