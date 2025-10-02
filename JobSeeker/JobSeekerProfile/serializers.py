from rest_framework import serializers
from Accounts.models import *


class JobSeekerSignInSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = CustomUser
        fields = ["id", "email","username"]

    def get_username(self, obj):
        return obj.email.split('@')[0] if obj.email else None



