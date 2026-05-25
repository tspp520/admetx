# admetx-auth

LDAP-only authentication sidecar for admetx. Wraps the `MultiDomainLDAPAuthenticator`
pattern from `pylearn_hub` (multi-domain AD forest + GC search + UPN bind + lockout)
as a FastAPI service exposing `POST /verify`.

## Why a sidecar

- Reuses pylearn's production-tested AD logic verbatim.
- Web layer (Next.js) does not need to bundle an LDAP client.
- Lockout state lives in one Python process, easy to reason about.

## Run

```bash
python3.12 -m venv .venv
.venv/bin/pip install -e ".[dev]" -i https://pypi.tuna.tsinghua.edu.cn/simple/

# .env must set LDAP_BIND_PASSWORD (service account password)
.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8032
```

## API

```
GET  /health
POST /verify   { "username": "cp12398", "password": "..." }
  → 200 { ok: true,  attrs: { upn, display_name, description, ... } }
  → 200 { ok: false, error: "invalid_credentials" | "locked" | "unreachable" | "config_error",
                     locked, remaining_secs, attempts_left }
```

Note: `/verify` always returns HTTP 200; success/failure is in `ok`. Lets the
caller distinguish "wrong password" from "service is down" without HTTP-status games.
