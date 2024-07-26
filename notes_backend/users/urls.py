from django.urls import path, register_converter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.converters import UUIDConverter
from users.views import UserEmailVerificationView, UserSignupView

register_converter(UUIDConverter, "uuid")


urlpatterns = [
    path("signup", UserSignupView.as_view(), name="user-signup"),
    path(
        "verify/<uuid:token>",
        UserEmailVerificationView.as_view(),
        name="email-verification",
    ),
    path("login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh", TokenRefreshView.as_view(), name="token_refresh"),
]
