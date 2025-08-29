from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager
from django.db import models
import uuid


class CustomUserManager(BaseUserManager):
    """Manager for CustomUser with email as the unique identifier."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=(("employer", "Employer"), ("jobseeker", "Jobseeker"))
    )
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"      # ✅ login will use email
    REQUIRED_FIELDS = [] 
    objects = CustomUserManager() 

    def __str__(self):
        return f"{self.email}"

