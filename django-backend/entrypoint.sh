#!/bin/bash
set -e

echo "Waiting for database..."
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@digicon.com', 'Admin@1234')
"

echo "App initialization complete. Starting server..."
exec "$@"
