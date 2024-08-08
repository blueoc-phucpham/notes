"""
Django settings for notes project.

Generated by 'django-admin startproject' using Django 5.0.7.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
from typing import Dict, List, Self
from xmlrpc.client import boolean

from pydantic import AnyHttpUrl, Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydjantic import BaseDBConfig, to_django

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


class DatabaseSettings(BaseDBConfig):
    default: str | dict = Field(
        default="sqlite:///db.sqlite3",
        alias="DATABASE_URL",
    )
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env")


class GeneralSettings(BaseSettings):
    SECRET_KEY: str = Field(
        default="4534fe789d616205b2d54a6d313c8f9c9dc1635f5440f3d7e6de6fce71439f1e",
        validation_alias="DJANGO_SECRET_KEY",
    )
    DEBUG: bool = Field(default=True)
    DEFAULT_AUTO_FIELD: str = "django.db.models.BigAutoField"
    DATABASES: DatabaseSettings = DatabaseSettings()

    ALLOWED_HOSTS: List[str] = ["127.0.0.1"]
    CORS_ALLOW_ALL_ORIGINS: bool = False
    ROOT_URLCONF: str = "notes.urls"
    WSGI_APPLICATION: str = "notes.wsgi.application"

    INSTALLED_APPS: List[str] = [
        "users",
        "core",
        "corsheaders",
        "rest_framework_simplejwt",
        "drf_spectacular",
        "rest_framework",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
    ]

    MIDDLEWARE: List[str] = [
        "corsheaders.middleware.CorsMiddleware",
        "django.middleware.security.SecurityMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
    ]

    AUTH_PASSWORD_VALIDATORS: List[Dict] = [
        {
            "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
        },
    ]

    REST_FRAMEWORK: Dict = {
        # Use Django's standard `django.contrib.auth` permissions,
        # or allow read-only access for unauthenticated users.
        "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
        "DEFAULT_AUTHENTICATION_CLASSES": [
            "rest_framework_simplejwt.authentication.JWTAuthentication",
        ],
        "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
        "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    }

    SPECTACULAR_SETTINGS: Dict = {
        "TITLE": "Notes API",
        "DESCRIPTION": "Yet another notes API",
        "VERSION": "1.0.0",
        "SERVE_INCLUDE_SCHEMA": False,
        # OTHER SETTINGS
    }

    CORS_ALLOWED_ORIGINS: List[str] = ["http://127.0.0.1:3000"]

    AUTH_USER_MODEL: str = "users.User"

    APP_NAME: str = "Note"
    BACKEND_HOST: AnyHttpUrl | str = "http://localhost:8000"
    FRONTEND_HOST: AnyHttpUrl | str = "http://localhost:3000"

    ADMIN_PASSWORD: str

    @model_validator(mode="after")
    def patch_setting_if_debug(self) -> Self:
        if self.DEBUG:
            self.EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
            self.CORS_ALLOW_ALL_ORIGINS = True
        else:
            self.EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

        return self


class EmailSettings(BaseSettings):
    EMAIL_ENABLED: bool = False
    EMAIL_HOST: str | None = None
    EMAIL_PORT: int | None = None
    EMAIL_HOST_USER: str | None = None
    EMAIL_HOST_PASSWORD: str | None = None
    EMAIL_USE_TLS: boolean = False

    EMAIL_BACKEND: str = "django.core.mail.backends.console.EmailBackend"

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="allow")


class I18NSettings(BaseSettings):
    LANGUAGE_CODE: str = "en-us"
    TIME_ZONE: str = "UTC"
    USE_I18N: bool = True
    USE_L10N: bool = True
    USE_TZ: bool = True


class StaticSettings(BaseSettings):
    STATIC_URL: str = "/static/"

    TEMPLATES: List[Dict] = [
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": [],
            "APP_DIRS": True,
            "OPTIONS": {
                "context_processors": [
                    "django.template.context_processors.debug",
                    "django.template.context_processors.request",
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                ],
            },
        },
    ]


class ProjectSettings(GeneralSettings, I18NSettings, StaticSettings, EmailSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="allow")


settings = ProjectSettings()
to_django(settings=settings)
