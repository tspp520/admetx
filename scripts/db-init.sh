#!/usr/bin/env bash
# Provision Postgres for admetx on a fresh machine.
# Idempotent: re-running is safe.
#
# Requires: docker. Does NOT require sudo.
#
# Env tunables:
#   POSTGRES_PORT       (default 5436)
#   POSTGRES_PASSWORD   (default admetx_local)
#   CONTAINER_NAME      (default admetx-postgres)
set -euo pipefail

PORT="${POSTGRES_PORT:-5436}"
PW="${POSTGRES_PASSWORD:-admetx_local}"
NAME="${CONTAINER_NAME:-admetx-postgres}"

# 1. Container
if docker ps --format '{{.Names}}' | grep -qx "$NAME"; then
  echo "OK: container $NAME already running"
elif docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
  echo "Starting existing container $NAME"
  docker start "$NAME" >/dev/null
else
  echo "Creating container $NAME on 127.0.0.1:$PORT"
  docker run -d --name "$NAME" --restart unless-stopped \
    -e POSTGRES_USER=admetx \
    -e POSTGRES_PASSWORD="$PW" \
    -e POSTGRES_DB=admetx_prod \
    -p "127.0.0.1:$PORT:5432" \
    postgres:16-alpine >/dev/null
fi

# 2. Wait until ready
for i in {1..30}; do
  if docker exec "$NAME" pg_isready -U admetx >/dev/null 2>&1; then break; fi
  sleep 1
done
if ! docker exec "$NAME" pg_isready -U admetx >/dev/null 2>&1; then
  echo "FATAL: postgres not ready after 30s"
  exit 1
fi

# 3. Ensure admetx_dev database exists
run_sql() { docker exec "$NAME" psql -U admetx -d admetx_prod -tAc "$1"; }
if ! run_sql "SELECT 1 FROM pg_database WHERE datname='admetx_dev'" | grep -q 1; then
  run_sql "CREATE DATABASE admetx_dev OWNER admetx" >/dev/null
fi

echo "OK: $NAME on 127.0.0.1:$PORT — admetx_prod + admetx_dev ready"
