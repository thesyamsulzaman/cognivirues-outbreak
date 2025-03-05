#!/bin/sh
# Test PostgreSQL connection
until pg_isready -h $POSTGRES_HOST -p 5432 -U $POSTGRES_USER; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done
echo "PostgreSQL is ready. Continuing with Prisma setup."
