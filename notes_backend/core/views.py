from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.db import connection
from django.db.models import Q
from notes.settings import settings
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from core.models import Note, NotePermission
from core.permissions import CustomNotePermission
from core.serializers import (
    HealthCheckSerializer,
    NotePermissionSerializer,
    NoteSerializer,
)


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.order_by("created_at", "id").all()
    serializer_class = NoteSerializer
    permission_classes = [CustomNotePermission]
    ordering_fields = ["created_at", "id"]
    ordering = ["id"]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Note.objects.none()

        if user.is_superuser:
            return Note.objects.all()

        if self.request.method == "GET":
            return (
                Note.objects.filter(Q(author=user))
                .distinct()
                .order_by("created_at", "id")
            )

        return (
            Note.objects.filter(Q(author=user) | Q(notepermission__user=user))
            .distinct()
            .order_by("created_at", "id")
        )

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

    @action(detail=False, methods=["GET"])
    def shared(self, request):
        user = request.user
        shared_notes = Note.objects.filter(notepermission__user=user).distinct()
        serializer = self.get_serializer(shared_notes, many=True)
        return Response(serializer.data)


class NoteAssign(GenericAPIView):
    serializer_class = NotePermissionSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            note = serializer.validated_data["note"]
            role = serializer.validated_data["role"]

            # Check if a permission already exists for this user and note
            permission, created = NotePermission.objects.update_or_create(
                user=user, note=note, defaults={"role": role}
            )

            if created:
                message = "Permission assigned successfully"
                status_code = status.HTTP_201_CREATED
            else:
                message = "Permission updated successfully"
                status_code = status.HTTP_200_OK

            return Response(
                {
                    "message": message,
                    "permission": self.get_serializer(permission).data,
                },
                status=status_code,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            note = serializer.validated_data["note"]

            try:
                permission = NotePermission.objects.get(user=user, note=note)
                permission.delete()
                return Response(
                    {"message": "Permission removed successfully"},
                    status=status.HTTP_200_OK,
                )
            except NotePermission.DoesNotExist:
                return Response(
                    {"message": "Permission does not exist"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HealthCheckView(GenericAPIView):
    permission_classes = []  # Allow any user to access the health check
    serializer_class = HealthCheckSerializer

    def get(self, request, *args, **kwargs):
        health_status = {
            "status": "healthy",
            "debug": settings.DEBUG,
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
