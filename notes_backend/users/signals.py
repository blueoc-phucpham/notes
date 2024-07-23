import uuid

from django.db.models.signals import post_save
from django.dispatch import receiver

from users.emails import send_signup_email
from users.models import SignupToken, User


@receiver(post_save, sender=User)
def create_signup_token(sender, instance, created, **kwargs):
    if created:
        token = SignupToken.objects.create(user=instance, token=uuid.uuid4())
        token.save()
        token.refresh_from_db()
        send_signup_email(user=instance)
