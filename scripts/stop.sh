#!/usr/bin/env bash
set -euo pipefail
for sig in TERM KILL; do
  for port in 3030 3031 8030 8031 8032 8033; do
    pids=$(ss -tlnp 2>/dev/null | awk -v p=":$port" 'index($4,p){gsub(/.*pid=/,"",$NF); split($NF,a,","); print a[1]}' | sort -u)
    for pid in $pids; do
      [ -n "$pid" ] && kill -$sig "$pid" 2>/dev/null || true
    done
  done
  sleep 1
done
echo "stopped"
