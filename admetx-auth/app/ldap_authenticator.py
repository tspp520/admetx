"""
admetx-auth — multi-domain LDAP authenticator.

Ported from pylearn_hub/config/ldap_authenticator.py with these changes:
- No JupyterHub/Traitlets dependency; configured via pydantic-settings
- No async (sidecar runs sync inside FastAPI; LDAP itself is sync)
- Returns rich result dict including attrs + lockout state
- Per-process in-memory lockout (sufficient for single-replica sidecar)
"""
import logging
import time
from dataclasses import dataclass

from ldap3 import Server, Connection, SUBTREE, ALL

from app.config import settings


log = logging.getLogger("admetx_auth")

# In-process lockout state
_FAILED: dict[str, dict[str, float | int]] = {}


def _escape_filter(value: str) -> str:
    """Escape LDAP filter metacharacters to prevent injection."""
    for ch, rep in {'\\': '\\5c', '*': '\\2a', '(': '\\28', ')': '\\29', '\0': '\\00', '/': '\\2f'}.items():
        value = value.replace(ch, rep)
    return value


def _check_lockout(ukey: str) -> tuple[bool, int, int]:
    info = _FAILED.get(ukey, {})
    until = info.get('locked_until', 0)
    count = info.get('count', 0)
    if until and time.time() < until:
        return True, int(until - time.time()), int(count)
    return False, 0, int(count)


def _record_failure(ukey: str) -> tuple[bool, int, int]:
    now = time.time()
    info = _FAILED.get(ukey, {'count': 0, 'locked_until': 0})
    if info.get('locked_until', 0) and now >= info['locked_until']:
        info = {'count': 0, 'locked_until': 0}
    info['count'] = int(info.get('count', 0)) + 1
    if info['count'] >= settings.lockout_max:
        info['locked_until'] = now + settings.lockout_secs
        _FAILED[ukey] = info
        return True, settings.lockout_secs, 0
    _FAILED[ukey] = info
    return False, 0, settings.lockout_max - int(info['count'])


def _record_success(ukey: str) -> None:
    _FAILED.pop(ukey, None)


@dataclass
class VerifyOutcome:
    ok: bool
    attrs: dict | None = None
    error: str | None = None          # 'invalid_credentials' | 'locked' | 'unreachable' | 'config_error'
    locked: bool = False
    remaining_secs: int = 0
    attempts_left: int = 0


def _normalize_username(raw: str) -> str:
    """Accept 'DOMAIN\\user' and 'user@domain' and 'user' — return the bare sAMAccountName."""
    u = raw.strip()
    if '\\' in u:
        u = u.split('\\', 1)[1].strip()
    if '@' in u:
        u = u.split('@', 1)[0].strip()
    return u


def _gc_lookup(username: str) -> tuple[str | None, dict]:
    """Bind service account to GC, search sAMAccountName, return (real_upn, attrs)."""
    if not settings.ldap_bind_password:
        log.error('LDAP_BIND_PASSWORD not set')
        return None, {}
    server = Server(settings.ldap_server, port=settings.ldap_gc_port,
                    get_info=ALL, connect_timeout=5)
    try:
        conn = Connection(server, user=settings.ldap_bind_user,
                          password=settings.ldap_bind_password,
                          auto_bind=True, receive_timeout=5)
    except Exception as e:
        log.warning('GC service bind failed: %s', e)
        return None, {}
    try:
        flt = f'(&(sAMAccountName={_escape_filter(username)})(objectClass=user))'
        conn.search(settings.ldap_search_base, flt, search_scope=SUBTREE,
                    attributes=['userPrincipalName', 'sAMAccountName', 'displayName',
                                'description', 'department', 'title', 'mail'])
        entries = list(conn.entries)
        # Prefer non-disabled entries
        chosen = None
        for e in entries:
            if 'disable' not in e.entry_dn.lower():
                chosen = e
                break
        if chosen is None and entries:
            chosen = entries[0]
        if chosen is None:
            return None, {}
        get = lambda a: str(getattr(chosen, a)) if getattr(chosen, a, None) else None
        attrs = {
            'upn': get('userPrincipalName'),
            'sam': (get('sAMAccountName') or '').lower() or None,
            'display_name': get('displayName'),
            'description': get('description'),
            'department': get('department'),
            'title': get('title'),
            'mail': get('mail'),
        }
        return attrs['upn'], attrs
    except Exception as e:
        log.warning('GC search failed for %s: %s', username, e)
        return None, {}
    finally:
        try: conn.unbind()
        except Exception: pass


def verify(username: str, password: str) -> VerifyOutcome:
    if not settings.ldap_bind_password:
        return VerifyOutcome(ok=False, error='config_error')

    sam = _normalize_username(username)
    if not sam or not password:
        return VerifyOutcome(ok=False, error='invalid_credentials')

    ukey = sam.lower()
    is_locked, remaining, _ = _check_lockout(ukey)
    if is_locked:
        return VerifyOutcome(ok=False, error='locked', locked=True, remaining_secs=remaining)

    # Step 1: look up real UPN via GC
    real_upn, attrs = _gc_lookup(sam)

    # Step 2: build bind candidate list
    candidates: list[tuple[str, str]] = []
    if real_upn:
        candidates.append(('GC-UPN', real_upn))
    for d in settings.upn_domain_list:
        upn = f'{sam}@{d}'
        if upn != real_upn:
            candidates.append(('UPN', upn))

    # Step 3: try each bind
    server = Server(settings.ldap_server, port=settings.ldap_bind_port, connect_timeout=10)
    last_err: str | None = None
    for method, bind_user in candidates:
        try:
            c = Connection(server, user=bind_user, password=password,
                           auto_bind=True, receive_timeout=10)
            try: c.unbind()
            except Exception: pass
            _record_success(ukey)
            log.info('LDAP auth OK: %s via %s', sam, method)
            return VerifyOutcome(ok=True, attrs=attrs or {'sam': ukey})
        except Exception as e:
            msg = str(e)
            if 'socket' in msg.lower() or 'connect' in msg.lower():
                log.error('LDAP server unreachable: %s', msg)
                return VerifyOutcome(ok=False, error='unreachable')
            last_err = msg
            continue

    is_now_locked, remaining, attempts_left = _record_failure(ukey)
    log.info('LDAP auth failed for %s (last err: %s)', sam, last_err)
    return VerifyOutcome(ok=False, error='invalid_credentials',
                         locked=is_now_locked,
                         remaining_secs=remaining,
                         attempts_left=attempts_left)
