from django.db import models
from users.models import Role, User

from core.base import Base

# Create your models here.


class Note(Base):
    id = models.AutoField(primary_key=True, unique=True)
    title = models.TextField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    version = models.PositiveBigIntegerField(default=1, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def save(self, *args, **kwargs) -> None:
        if self.pk:
            self.version = self.version + 1

        return super().save(*args, **kwargs)


class NotePermission(Base):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
