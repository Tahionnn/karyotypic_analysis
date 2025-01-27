#!/bin/sh
# wait-for-db.sh

# Wait for the database to be ready
until pg_isready -h postgres -U admin; do
  echo "Waiting for the database to be ready..."
  sleep 1
done

# Start the API application
exec "$@"
