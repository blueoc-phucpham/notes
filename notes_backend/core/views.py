from django.core.exceptions import ValidationError
from rest_framework import status, viewsets
from rest_framework.response import Response

from core.models import Note
from core.permissions import CustomNotePermission
from core.serializers import HealthCheckSerializer, NoteSerializer
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from django.db import connection
from django.core.cache import cache


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [CustomNotePermission]

    def perform_create(self, serializer):
        user = self.request.user

        if Note.objects.filter(author=user).count() >= 10:
            raise ValidationError(message="You can only create up to 10 notes.")

        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class HealthCheckView(GenericAPIView):
    permission_classes = []  # Allow any user to access the health check
    serializer_class = HealthCheckSerializer

    def get(self, request, *args, **kwargs):
        health_status = {
            "status": "healthy",
            "database": self.check_database(),
            "cache": self.check_cache(),
        }
        serializer = self.get_serializer(health_status)
        if all(health_status.values()):
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    def check_database(self):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
                return True
        except Exception:
            return False
    def check_cache(self):
        try:
            cache.set("health_check", "ok", 1)
            return cache.get("health_check") == "ok"
        except Exception:
            return False
