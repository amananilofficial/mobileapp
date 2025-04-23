#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
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

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "Checking if superuser exists..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
"

# Start server
exec "$@"

#!/bin/bash
set -e

# Wait for the database to be ready
echo "Waiting for database..."
# Use pg_isready instead of nc
until pg_isready -h db -p 5432; do
  sleep 1
done
echo "db:5432 - accepting connections"

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations api
python manage.py migrate api
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Check if superuser exists
echo "