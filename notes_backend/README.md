# Notes Backend API

## Setup

> This project use DRF (Django Rest Framework)

> Python 3.11.8

> Django 5.0


### Config Database

```sh
cp .env.example .env

# config connection string
```


### Install dependencies

```sh
pyenv local 3.11.8

pipenv install

python manage.py makemigrations

python manage.py migrate
```

### Run server

```sh
python manage.py runserver

```

### Test

```sh
pytest
```

### Coverage

```sh

```

### Resource

https://github.com/Vitaee/DjangoRestAPI