test:
	pytest
coverage:
	pytest --cov=. --cov-report lcov:lcov.info

run:
	python manage.py runserver

app:
	python manage.py startapp

migrate:
	python manage.py makemigrations
	python manage.py migrate

shell:
	python manage.py shell

admin:
	python manage.py createsuperuser