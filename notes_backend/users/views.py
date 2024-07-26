# Create your views here.

from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import SignupToken, User
from users.serializers import UserSignUpSerializer, UserVerificationSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSignUpSerializer

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class UserSignupView(APIView):
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
        db_token.delete()  # one time token

        serializer = UserVerificationSerializer(db_token)

        return Response(data=serializer.data)
