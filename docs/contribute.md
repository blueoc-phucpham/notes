
# Contributing to Notes
We welcome contributions to Notes! This document provides guidelines for contributing to both the Django REST Framework backend and React frontend.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/notes.git`
3. Create a new branch: `git checkout -b your-branch-name`

## Backend (Django REST Framework)

### Setup

1. Navigate to the backend directory: `cd notes_backend`
2. Create a virtual environment: `pipenv install`
3. Apply migrations: `python manage.py migrate`
4. Config .env variables `cp .env.example .env`
### Running the Backend

1. Start the development server: `python manage.py runserver`

### Code Style

- Follow PEP 8 guidelines
- Use meaningful variable and function names
- Write docstrings for functions and classes
- Code formatting with Ruff

## Frontend (React)

### Setup

1. Navigate to the frontend directory: `cd notes_frontend`
2. Install dependencies: `npm install`

### Running the Frontend

1. Start the development server: `npm run dev`

### Code Style

- Use functional components and hooks
- Use meaningful component and variable names

## Making Changes

1. Make your changes in your feature branch
2. Write or update tests as needed
3. Ensure all tests pass
4. Commit your changes with a clear commit message


# Deployment

Comming soon if I have access to server