import uuid

from core.base import Base
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class User(AbstractUser, Base):
    email = models.EmailField(unique=True)
    pass


class SignupToken(Base):
    token = models.UUIDField(default=uuid.uuid4, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="token")
