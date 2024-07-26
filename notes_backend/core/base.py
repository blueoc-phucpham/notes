from django.db import models
from django.utils import timezone


class BaseModelManager(models.Manager):
    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(deleted_at=None)


class Base(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(default=None, null=True)

    objects = BaseModelManager()

    class Meta:
        abstract = True

    def delete(self):
        self.deleted_at = timezone.now()
        self.save()
