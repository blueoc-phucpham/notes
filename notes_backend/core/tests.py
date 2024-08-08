import random
import string

import pytest
from django.core.cache import cache
from django.db import connection
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import Role, User

from core.models import Note, NotePermission


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
def admin_client():
    admin = User.objects.create_superuser(
        username="admin-tester", email="admin@example.com", password="test1password123"
    )

    client = APIClient()
    refresh = RefreshToken.for_user(admin)
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

    user = User.objects.get(username="testuser")
    note = Note.objects.create(**data, author=user)
    user.save()
    note.save()
    url = reverse("note-detail", args=(note.id,))

    response = api_client.get(url, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["title"] == note.title
    assert response.json()["content"] == note.content


@pytest.mark.django_db
def test_view_note_notfound_if_not_author(api_client):
    data = {"title": "some note title", "content": "some test content"}

    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    user.save()
    note.save()
    url = reverse("note-detail", args=(note.id,))

    response = api_client.get(url, format="json")

    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_view_shared_note_if_not_author(api_client):
    data = {"title": "some note title", "content": "some test content"}

    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    role = Role.objects.create(label="viewer", permissions=["view"])
    guess = User.objects.get(username="testuser")

    # Create the permission
    perm = NotePermission.objects.create(user=guess, note=note, role=role)

    perm.save()
    user.save()
    note.save()
    url = reverse("note-shared")

    response = api_client.get(url, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 1

    data = response.json()[0]

    assert data["title"] == note.title
    assert data["content"] == note.content


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
def test_update_note_if_has_edit_role_ok(api_client):
    data = {"title": "some note title", "content": "some test content"}
    updated = {"title": "some updated title", "content": "some updated content"}

    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    guess = User.objects.get(username="testuser")
    role = Role.objects.create(label="viewer", permissions=["view", "edit"])

    # Create the permission
    perm = NotePermission.objects.create(user=guess, note=note, role=role)
    perm.save()

    url = reverse("note-detail", args=(note.id,))

    response = api_client.put(url, data=updated, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["title"] == updated["title"]
    assert response.json()["content"] == updated["content"]
    assert response.json()["version"] == 2


@pytest.mark.django_db
def test_update_note_if_not_has_edit_role_failed(api_client):
    data = {"title": "some note title", "content": "some test content"}
    updated = {"title": "some updated title", "content": "some updated content"}

    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    guess = User.objects.get(username="testuser")
    role = Role.objects.create(label="viewer", permissions=["view"])

    # Create the permission
    perm = NotePermission.objects.create(user=guess, note=note, role=role)
    perm.save()

    url = reverse("note-detail", args=(note.id,))

    response = api_client.put(url, data=updated, format="json")

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_update_note_admin_can_do_anything():
    data = {"title": "some note title", "content": "some test content"}
    updated = {"title": "some updated title", "content": "some updated content"}

    user = User.objects.create_user(username="test1", password="test1password123")
    admin = User.objects.create_superuser(
        username="admin-tester", email="admin@example.com", password="test1password123"
    )
    note = Note.objects.create(**data, author=user)

    url = reverse("note-detail", args=(note.id,))

    client = APIClient()
    refresh = RefreshToken.for_user(admin)
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

    assert response.status_code == status.HTTP_404_NOT_FOUND
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

    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_delete_note_not_author_but_has_delete_role(api_client):
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)

    guess = User.objects.get(username="testuser")
    role = Role.objects.create(label="viewer", permissions=["delete"])

    # Create the permission
    perm = NotePermission.objects.create(user=guess, note=note, role=role)
    perm.save()

    url = reverse("note-detail", args=(note.id,))

    response = api_client.delete(url, format="json")

    assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_delete_note_admin(api_client):
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    admin = User.objects.create_superuser(
        username="admin-tester", email="admin@example.com", password="test1password123"
    )

    client = APIClient()
    refresh = RefreshToken.for_user(admin)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    url = reverse("note-detail", args=(note.id,))

    response = client.delete(url, format="json")

    assert response.status_code == status.HTTP_204_NO_CONTENT


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
    assert response.json()["database"]
    assert response.json()["cache"]


@pytest.mark.django_db
def test_assign_role(admin_client):
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    role = Role.objects.create(label="test", permissions=["view"])

    url = reverse("assign-note-permission")
    payload = {"user": user.id, "note": note.id, "role": role.id}

    response = admin_client.post(url, payload, format="json")

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_update_assign_role(admin_client):
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    role = Role.objects.create(label="test", permissions=["view"])
    other = Role.objects.create(label="test1", permissions=["view", "edit"])

    NotePermission.objects.create(user=user, note=note, role=role)

    url = reverse("assign-note-permission")
    payload = {"user": user.id, "note": note.id, "role": other.id}

    response = admin_client.post(url, payload, format="json")

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_update_assign_role_not_exist(admin_client):
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    role = Role.objects.create(label="test", permissions=["view"])

    NotePermission.objects.create(user=user, note=note, role=role)

    url = reverse("assign-note-permission")
    payload = {"user": user.id, "note": note.id, "role": 123}

    response = admin_client.post(url, payload, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_update_assign_user_not_exist(admin_client):
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    role = Role.objects.create(label="test", permissions=["view"])

    NotePermission.objects.create(user=user, note=note, role=role)

    url = reverse("assign-note-permission")
    payload = {"user": 123, "note": note.id, "role": role.id}

    response = admin_client.post(url, payload, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_update_assign_note_not_exist(admin_client):
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    role = Role.objects.create(label="test", permissions=["view"])

    NotePermission.objects.create(user=user, note=note, role=role)

    url = reverse("assign-note-permission")
    payload = {"user": user.id, "note": 123, "role": role.id}

    response = admin_client.post(url, payload, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_delete_assign_role(admin_client):
    data = {"title": "some note title", "content": "some test content"}
    user = User.objects.create_user(username="test1", password="test1password123")
    note = Note.objects.create(**data, author=user)
    role = Role.objects.create(label="test", permissions=["view"])

    NotePermission.objects.create(user=user, note=note, role=role)

    url = reverse("assign-note-permission")
    payload = {"user": user.id, "note": note.id, "role": role.id}

    response = admin_client.delete(url, payload, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert not NotePermission.objects.all()
