#!/usr/bin/env bash
set -euo pipefail
ROOT=/export/projects/admetx
mkdir -p "$ROOT/logs"

# Predictor prod
cd "$ROOT/admetx-predictor"
nohup .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8030 \
  >>"$ROOT/logs/predictor-prod.log" 2>&1 &
echo "predictor-prod pid=$!"

# Web prod
cd "$ROOT/admetx-web"
set -a; source "$ROOT/admetx-web/.env.prod"; set +a
nohup /usr/local/nodejs/bin/pnpm start -p 3030 -H 0.0.0.0 \
  >>"$ROOT/logs/web-prod.log" 2>&1 &
echo "web-prod pid=$!"
