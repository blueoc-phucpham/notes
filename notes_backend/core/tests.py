import random
import string

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User


@pytest.fixture
def api_client():
    user = User.objects.create_user(
        username="testuser", email="testuser@yop.com", password="js.sj"
    )
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    return client


@pytest.fixture
def note_data():
    return {"title": "Test Note", "content": "This is a test note content."}


@pytest.fixture
def long_title():
    return "".join(random.choices(string.ascii_letters + string.digits, k=2048))


@pytest.mark.django_db
def test_create_note_ok(api_client, note_data):
    url = reverse("note-list")
    response = api_client.post(url, data=note_data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["id"] > 0
    assert response.json()["version"] == 1
    assert response.json()["title"] == note_data["title"]
    assert response.json()["content"] == note_data["content"]
    assert response.json()["author"]["username"] == "testuser"


@pytest.mark.django_db
def test_create_note_blank_title(api_client):
    data = {"title": "            ", "content": "some test content"}

    url = reverse("note-list")
    response = api_client.post(url, data=data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_create_note_null_content(api_client):
    data = {"title": "Some titlee", "content": None}

    url = reverse("note-list")
    response = api_client.post(url, data=data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_create_note_null_title(api_client):
    data = {"title": None, "content": "some test content"}

    url = reverse("note-list")
    response = api_client.post(url, data=data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_create_note_long_title(api_client, long_title):
    data = {"title": long_title, "content": "some test content"}
    url = reverse("note-list")

    response = api_client.post(url, data=data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_create_note_exceed_10_notes(api_client):
    data = {"title": "some note title", "content": "some test content"}
    url = reverse("note-list")

    for _ in range(10):
        api_client.post(url, data=data, format="json")

    response = api_client.post(url, data=data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
