import pytest
from django.urls import reverse
from rest_framework import status

# Create your tests here.


def test_simple():
    assert 1 + 1 == 2


@pytest.mark.django_db
def test_signup_api(client):
    url = reverse("user-signup")  # Assuming you've named your URL
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "securepassword123",
    }

    response = client.post(url, data, content_type="application/json")

    assert response.status_code == status.HTTP_201_CREATED
    assert "id" in response.json()
    assert response.json()["username"] == "testuser"
    assert response.json()["email"] == "testuser@example.com"
    assert "password" not in response.json()


@pytest.mark.django_db
def test_signup_duplicate_username(client):
    url = reverse("user-signup")
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "securepassword123",
    }

    # First signup
    response = client.post(url, data, content_type="application/json")
    assert response.status_code == status.HTTP_201_CREATED

    # Try to signup with the same username
    response = client.post(url, data, content_type="application/json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "username" in response.json()


@pytest.mark.django_db
def test_signup_invalid_email(client):
    url = reverse("user-signup")
    data = {
        "username": "testuser2",
        "email": "invalid-email",
        "password": "securepassword123",
    }

    response = client.post(url, data, content_type="application/json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.json()


@pytest.mark.django_db
def test_signup_weak_password(client):
    url = reverse("user-signup")
    data = {
        "username": "testuser3",
        "email": "testuser3@example.com",
        "password": "123",  # Assuming this is too weak
    }

    response = client.post(url, data, content_type="application/json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "password" in response.json()


@pytest.mark.django_db
def test_signup_password_too_short(client):
    url = reverse("user-signup")
    data = {
        "username": "testuser3",
        "email": "testuser3@example.com",
        "password": "abc",
    }

    response = client.post(url, data, content_type="application/json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "password" in response.json()


@pytest.mark.django_db
def test_signup_password_numeric(client):
    url = reverse("user-signup")
    data = {
        "username": "testuser3",
        "email": "testuser3@example.com",
        "password": "12345678",  # Assuming this is too weak
    }

    response = client.post(url, data, content_type="application/json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "password" in response.json()


@pytest.mark.django_db
def test_signup_blank_username(client):
    url = reverse("user-signup")
    data = {
        "username": "",
        "email": "testuser3@example.com",
        "password": "verysecretandlongpassword123",
    }

    response = client.post(url, data, content_type="application/json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "username" in response.json()


@pytest.mark.django_db
def test_signup_account_not_activated(client):
    url = reverse("user-signup")
    data = {
        "username": "testuser",
        "email": "testuser3@example.com",
        "password": "verysecretandlongpassword123",
    }

    response = client.post(url, data, content_type="application/json")
    assert response.status_code == status.HTTP_201_CREATED
    assert not response.json()["is_active"]
