#!/bin/sh
set -e

# Generate litestream.yml in the app directory where node user has write permission
envsubst < /etc/litestream.yml.template > /app/litestream.yml

# Remove existing db if exists
if [ -f /app/db/deploy.db ]; then
    mv /app/db/deploy.db /app/db/deploy.db.bak
fi

# Restore database from GCS if exists
litestream restore -if-replica-exists -config /app/litestream.yml /app/db/deploy.db

if [ -f /app/db/deploy.db ]; then
    echo "Successfully restored database from Cloud Storage"
    rm -f /app/db/deploy.db.bak
else
    echo "No database backup found in Cloud Storage, using original"
    mv /app/db/deploy.db.bak /app/db/deploy.db
fi

# Before starting the app, ensure WAL mode is disabled for Prisma compatibility
sqlite3 /app/db/deploy.db "PRAGMA journal_mode=DELETE;"

# Start Litestream replication with the app as the subprocess
exec litestream replicate \
    -config /app/litestream.yml \
    -exec "node node_modules/@remix-run/serve/dist/cli.js build/server/index.js"
