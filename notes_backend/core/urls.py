from django.urls import include, path
from rest_framework import routers

from core.views import HealthCheckView, NoteAssign, NoteViewSet

router = routers.DefaultRouter()
router.register("", NoteViewSet, basename="note")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "notes/assign-permission/", NoteAssign.as_view(), name="assign_note_permission"
    ),
    path("health-check/", HealthCheckView.as_view(), name="health-check"),
]
