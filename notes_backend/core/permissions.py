from rest_framework import permissions

from core.models import NotePermission


class CustomNotePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow all authenticated users to view
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow all authenticated users to view
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        # Allow admins to edit/delete
        if request.user.is_staff:
            return True

        # Allow author to edit/delete
        if request.user == obj.author:
            return True

        # Check if user has specific permissions for this object
        try:
            note_permissions = NotePermission.objects.filter(
                user=request.user, note=obj
            )
            role_permissions = [
                note_per.role.permissions for note_per in note_permissions
            ]

            if request.method in ["PUT", "PATCH"]:
                return any(
                    ["edit" in role_permission for role_permission in role_permissions]
                )
            if request.method == "DELETE":
                return any(
                    [
                        "delete" in role_permission
                        for role_permission in role_permissions
                    ]
                )
        except NotePermission.DoesNotExist:
            return False

        return False
