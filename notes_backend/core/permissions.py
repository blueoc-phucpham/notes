from rest_framework import permissions

from core.models import NotePermission


class CustomNotePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Superusers can do anything
        if request.user.is_superuser:
            return True

        # Check if the user is the author
        if obj.author == request.user:
            return True

        # For shared notes, check permissions
        if request.method in ["PUT", "PATCH", "DELETE"]:
            note_permissions = NotePermission.objects.filter(
                user=request.user, note=obj
            )
            role_permissions = [
                note_per.role.permissions for note_per in note_permissions
            ]

            if request.method in ["PUT", "PATCH"]:
                return any(
                    "edit" in role_permission for role_permission in role_permissions
                )

            if request.method == "DELETE":
                return any(
                    "delete" in role_permission for role_permission in role_permissions
                )

        # For GET requests, allow if the user has any permission on the note
        if request.method in permissions.SAFE_METHODS:
            return NotePermission.objects.filter(user=request.user, note=obj).exists()

        return False
