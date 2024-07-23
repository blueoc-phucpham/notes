from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"

    def ready(self) -> None:
        # Register signals defined in signals.py with receiver decorator
        from users import signals  # noqa: F401
