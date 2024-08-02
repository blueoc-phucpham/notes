from rest_framework import serializers
from users.serializers import UserSignUpSerializer

from core.models import Note


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
