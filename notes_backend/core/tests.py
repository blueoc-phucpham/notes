import random
import string

from django.db import connection
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User

from core.models import Note
from django.core.cache import cache


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


@pytest.mark.django_db
def test_view_note_ok(api_client):
    data = {"title": "some note title", "content": "some test content"}

    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    user.save()
    note.save()
    url = reverse("note-detail", args=(note.id,))

    response = api_client.get(url, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["title"] == note.title
    assert response.json()["content"] == note.content


@pytest.mark.django_db
def test_view_note_401(client):
    url = reverse("note-detail", args=(123,))
    response = client.get(url, format="json")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_view_note_404(api_client):
    url = reverse("note-detail", args=(123,))
    response = api_client.get(url, format="json")

    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_update_note_ok():
    data = {"title": "some note title", "content": "some test content"}
    updated = {"title": "some updated title", "content": "some updated content"}

    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)

    url = reverse("note-detail", args=(note.id,))

    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    response = client.put(url, data=updated, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["title"] == updated["title"]
    assert response.json()["content"] == updated["content"]
    assert response.json()["version"] == 2


@pytest.mark.django_db
def test_update_note_404():
    updated = {"title": "some updated title", "content": "some updated content"}
    user = User.objects.create_user(username="test1", password="test1password123")

    url = reverse("note-detail", args=(123,))

    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    response = client.put(url, data=updated, format="json")

    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_update_note_blank_title():
    data = {"title": "some note title", "content": "some test content"}
    updated = {"title": "     ", "content": "some updated content"}

    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)

    url = reverse("note-detail", args=(note.id,))

    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    response = client.put(url, data=updated, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_update_note_blank_content():
    data = {"title": "some note title", "content": "some test content"}
    updated = {"title": "some tilete", "content": "   "}

    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)

    url = reverse("note-detail", args=(note.id,))

    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    response = client.put(url, data=updated, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_update_note_long_title(long_title):
    data = {"title": "some note title", "content": "some test content"}
    updated = {"title": long_title, "content": "   "}

    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)

    url = reverse("note-detail", args=(note.id,))

    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    response = client.put(url, data=updated, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_update_note_not_author(api_client):
    data = {"title": "some note title", "content": "some test content"}
    updated = {"title": "some updated title", "content": "some updated content"}

    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)

    url = reverse("note-detail", args=(note.id,))

    response = api_client.put(url, data=updated, format="json")

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert note.version == 1


@pytest.mark.django_db
def test_delete_note_ok():
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)

    url = reverse("note-detail", args=(note.id,))

    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    response = client.delete(url, format="json")

    assert response.status_code == status.HTTP_204_NO_CONTENT
    with pytest.raises(Note.DoesNotExist):
        Note.objects.get(pk=note.id)


@pytest.mark.django_db
def test_delete_note_twice():
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)

    url = reverse("note-detail", args=(note.id,))

    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    response = client.delete(url, format="json")
    response = client.delete(url, format="json")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    with pytest.raises(Note.DoesNotExist):
        Note.objects.get(pk=note.id)


@pytest.mark.django_db
def test_delete_note_not_author(api_client):
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)

    url = reverse("note-detail", args=(note.id,))

    response = api_client.delete(url, format="json")

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_health_check_view(api_client):
    url = reverse("health-check")

    # Ensure database and cache are working
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")

    cache.set("test_key", "test_value", 1)

    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "healthy"
    assert response.json()["database"] == True
    assert response.json()["cache"] == True