#!/bin/bash
set -e

# Create a file flag to check if initialization has been done
INIT_FLAG="/app/docker_init_done.flag"

# Run initialization only if the flag file doesn't exist
if [ ! -f "$INIT_FLAG" ]; then
    echo "Running first-time initialization..."
    
    # Wait for database to be ready
    echo "Waiting for database..."
    while ! pg_isready -h db -p 5432 -U postgres; do
        sleep 1
    done
    
    # Run migrations
    echo "Running migrations..."
    python manage.py migrate
    
    # Collect static files
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
    
    # Create superuser if environment variables are set
    if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ]; then
        echo "Creating superuser..."
        python manage.py createsuperuser --noinput
    else
        echo "Skipping superuser creation. Set DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_PASSWORD, and DJANGO_SUPERUSER_EMAIL to create one."
    fi
    
    # Create the flag file to indicate initialization is done
    touch "$INIT_FLAG"
    echo "Initialization completed."
else
    echo "Initialization already done. Skipping..."
fi

# Execute the command passed to docker
exec "$@"