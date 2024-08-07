# Create your views here.

from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import Role, SignupToken, User
from users.serializers import (
    RoleSerializer,
    UserProfileSerializer,
    UserSearchSerializer,
    UserSignUpSerializer,
    UserVerificationSerializer,
)


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSignUpSerializer

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class UserAssignSupport(GenericAPIView):
    """A view to support searching users by username"""

    permission_classes = [IsAdminUser]
    serializer_class = UserSearchSerializer

    def get(self, request):
        search_query = request.query_params.get("search", "")
        limit = int(request.query_params.get("limit", 10))  # Default to 10 results

        if search_query:
            users = User.objects.filter(
                Q(username__istartswith=search_query)
                | Q(email__istartswith=search_query)
            ).order_by("username")[:limit]
        else:
            users = User.objects.none()

        serializer = self.get_serializer(users, many=True)
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
        )


class UserProfileView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK,
        )


class UserSignupView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSignUpSerializer

    def post(self, request):
        serializer = UserSignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            return Response(
                data=serializer.data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserEmailVerificationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserVerificationSerializer

    def get(self, request, token: str):
        db_token = get_object_or_404(SignupToken, token=token)
        db_token.user.is_active = True
        db_token.user.save()
        # db_token.delete()  # one time token

        serializer = UserVerificationSerializer(db_token)

        return Response(data=serializer.data)
