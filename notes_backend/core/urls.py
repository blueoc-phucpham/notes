from django.urls import include, path
from rest_framework import routers

from core.views import HealthCheckView, NoteAssign, NoteViewSet

router = routers.DefaultRouter()
router.register("", NoteViewSet, basename="note")

urlpatterns = [
    path("assign-permission/", NoteAssign.as_view(), name="assign-note-permission"),
    path("health-check/", HealthCheckView.as_view(), name="health-check"),
    path("", include(router.urls)),
]
