from rest_framework import serializers
from users.models import Role, User
from users.serializers import UserSignUpSerializer

from core.models import Note, NotePermission


class NoteSerializer(serializers.ModelSerializer):
    author = UserSignUpSerializer(read_only=True)
    title = serializers.CharField(allow_blank=False, allow_null=False, max_length=1024)
    content = serializers.CharField(allow_blank=False, allow_null=False)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "content",
            "version",
            "author",
            "created_at",
            "updated_at",
            "deleted_at",
        ]

        read_only_fields = [
            "id",
            "version",
            "author",
            "created_at",
            "updated_at",
            "deleted_at",
        ]


class HealthCheckSerializer(serializers.Serializer):
    status = serializers.CharField()
    database = serializers.BooleanField()
    debug = serializers.BooleanField()
    cache = serializers.BooleanField()


class NotePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotePermission
        fields = ["id", "user", "note", "role"]

    def validate(self, data):
        # Ensure the note exists
        try:
            Note.objects.get(pk=data["note"].id)
        except Note.DoesNotExist:
            raise serializers.ValidationError("The specified note does not exist.")

        # Ensure the user exists
        try:
            User.objects.get(pk=data["user"].id)
        except User.DoesNotExist:
            raise serializers.ValidationError("The specified user does not exist.")

        # Ensure the role exists
        try:
            Role.objects.get(pk=data["role"].id)
        except Role.DoesNotExist:
            raise serializers.ValidationError("The specified role does not exist.")

        return data
