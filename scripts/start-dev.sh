#!/usr/bin/env bash
set -euo pipefail
ROOT=/export/projects/admetx
mkdir -p "$ROOT/logs"

cd "$ROOT/admetx-predictor"
nohup .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8031 \
  >>"$ROOT/logs/predictor-dev.log" 2>&1 &
echo "predictor-dev pid=$!"

cd "$ROOT/admetx-web"
set -a; source "$ROOT/admetx-web/.env.dev"; set +a
nohup /usr/local/nodejs/bin/pnpm dev -p 3031 -H 0.0.0.0 \
  >>"$ROOT/logs/web-dev.log" 2>&1 &
echo "web-dev pid=$!"
