from core.base import Base
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class User(AbstractUser, Base):
    email = models.EmailField(unique=True)
    pass
