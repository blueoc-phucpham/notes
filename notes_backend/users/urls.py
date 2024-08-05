from django.urls import include, path, register_converter
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.converters import UUIDConverter
from users.views import (
    RoleViewSet,
    UserEmailVerificationView,
    UserProfileView,
    UserSignupView,
)

register_converter(UUIDConverter, "uuid")

router = routers.DefaultRouter()
router.register("roles", RoleViewSet, basename="role")

urlpatterns = [
    path("", include(router.urls)),
    path("sign-up/", UserSignupView.as_view(), name="user-signup"),
    path("me/", UserProfileView.as_view(), name="user-me"),
    path(
        "verify/<uuid:token>/",
        UserEmailVerificationView.as_view(),
        name="email-verification",
    ),
    path("login/", TokenObtainPairView.as_view(), name="user-login"),
    path("refresh/", TokenRefreshView.as_view(), name="user-refresh"),
]
