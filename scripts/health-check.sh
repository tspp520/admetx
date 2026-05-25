#!/usr/bin/env bash
fail=0
for url in \
  http://127.0.0.1:3030/api/health \
  http://127.0.0.1:3031/api/health \
  http://127.0.0.1:8030/health \
  http://127.0.0.1:8031/health \
  http://127.0.0.1:8032/health \
  http://127.0.0.1:8033/health; do
  if curl -sf "$url" >/dev/null; then echo "OK   $url"
  else echo "FAIL $url"; fail=1; fi
done
exit $fail
