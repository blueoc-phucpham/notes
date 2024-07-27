from django.urls import include, path
from rest_framework import routers

from core.views import NoteViewSet

router = routers.DefaultRouter()
router.register("", NoteViewSet, basename="note")

urlpatterns = [path("", include(router.urls))]
