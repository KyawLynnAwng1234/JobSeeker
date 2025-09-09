# serializers.py
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'  # id, user, message, type, is_read, created_at
        read_only_fields = ('id', 'user', 'created_at')  # Auto-generated fields
