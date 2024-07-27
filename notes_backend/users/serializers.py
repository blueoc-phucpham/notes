import django.contrib.auth.password_validation as validators
from django.core import exceptions
from rest_framework import serializers

from users.models import Role, SignupToken, User


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = [
            "id",
            "label",
            "permissions",
            "created_at",
            "updated_at",
            "deleted_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "deleted_at"]


class UserSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)

    def validate(self, data):
        user = self.instance
        # get the password from the data
        password = data.get("password")
        errors = dict()
        try:
            validators.validate_password(password=password, user=user)
        except exceptions.ValidationError as e:
            errors["password"] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(UserSignUpSerializer, self).validate(data)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.is_active = False
        # user.set_password(user.password)
        user.save()

        return user

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "is_active",
            "password",
            "created_at",
            "updated_at",
            "deleted_at",
        ]
        read_only_fields = ["is_active", "created_at", "updated_at", "deleted_at"]


class UserVerificationSerializer(serializers.ModelSerializer):
    user = UserSignUpSerializer(read_only=True)

    class Meta:
        model = SignupToken
        fields = ["token", "user"]
        read_only_fields = ["token", "user"]
