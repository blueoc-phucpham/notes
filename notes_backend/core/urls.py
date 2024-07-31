from django.urls import include, path
from rest_framework import routers

from core.views import NoteViewSet, HealthCheckView

router = routers.DefaultRouter()
router.register("", NoteViewSet, basename="note")

urlpatterns = [
    path("", include(router.urls)),
    path("health-check", HealthCheckView.as_view(), name="health-check"),
]
