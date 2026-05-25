/**
 * Thin client for the admetx-auth LDAP sidecar.
 * The sidecar always returns HTTP 200; success/failure is in the body.
 */

export type LdapAttrs = {
  upn?: string | null;
  sam?: string | null;
  display_name?: string | null;
  description?: string | null;     // commonly the Chinese name
  department?: string | null;
  title?: string | null;
  mail?: string | null;
};

export type LdapVerifyResult =
  | { ok: true; attrs: LdapAttrs }
  | { ok: false; error: 'invalid_credentials' | 'locked' | 'unreachable' | 'config_error';
      locked: boolean; remaining_secs: number; attempts_left: number };

export async function ldapVerify(username: string, password: string): Promise<LdapVerifyResult> {
  const url = process.env.LDAP_AUTH_URL;
  if (!url) {
    return { ok: false, error: 'unreachable', locked: false, remaining_secs: 0, attempts_left: 0 };
  }
  try {
    const res = await fetch(`${url}/verify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username, password }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      return { ok: false, error: 'unreachable', locked: false, remaining_secs: 0, attempts_left: 0 };
    }
    const body = await res.json();
    if (body.ok) {
      return { ok: true, attrs: body.attrs ?? {} };
    }
    return {
      ok: false,
      error: body.error ?? 'invalid_credentials',
      locked: !!body.locked,
      remaining_secs: body.remaining_secs ?? 0,
      attempts_left: body.attempts_left ?? 0,
    };
  } catch {
    return { ok: false, error: 'unreachable', locked: false, remaining_secs: 0, attempts_left: 0 };
  }
}

/** Pick the best display name to store: Chinese description > pinyin displayName > sam */
export function pickDisplayName(attrs: LdapAttrs, fallback: string): string {
  return (attrs.description?.trim() || attrs.display_name?.trim() || attrs.sam?.trim() || fallback).slice(0, 128);
}
