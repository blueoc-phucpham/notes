test:
	pytest
coverage:
	pytest --cov=. --cov-report lcov:lcov.info

run:
	python manage.py runserver

start:
	env DEBUG=False uvicorn notes.asgi:application

app:
	python manage.py startapp

migrate:
	python manage.py makemigrations
	python manage.py migrate

shell:
	python manage.py shell

admin:
	python manage.py createsuperuser
report:
	pytest --html=report.html --self-contained-html
	pytest --cov=. --cov-report html:cov_html
	