from django.db import models
from users.models import User

from core.base import Base

# Create your models here.


class Note(Base):
    id = models.AutoField(primary_key=True, unique=True)
    title = models.TextField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    version = models.IntegerField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
