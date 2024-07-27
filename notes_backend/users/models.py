import uuid

from core.base import Base
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models

# Create your models here.

PERMISSION_CHOICES = [
    ("view", "View"),
    ("edit", "Edit"),
    ("delete", "Delete"),
]


class User(AbstractUser, Base):
    email = models.EmailField(unique=True)
    pass


class SignupToken(Base):
    token = models.UUIDField(default=uuid.uuid4, primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="token")


class Role(Base):
    id = models.AutoField(primary_key=True, unique=True)
    label = models.TextField(null=False, blank=False, db_index=True)
    permissions = ArrayField(
        models.CharField(max_length=10, choices=PERMISSION_CHOICES),
        blank=True,
        default=list,
    )
