/**
 * In-process per-username lockout for the local (emergency) login path.
 * LDAP path has its own lockout inside the sidecar — this only guards
 * the emergency `admin` route so a brute-forcer can't bypass LDAP lockout
 * by hitting the local fallback.
 *
 * Resets when the Next.js process restarts (acceptable for a single-node deploy).
 */

const MAX_FAILS = 3;
const LOCKOUT_SECS = 300; // 5 min, matches pylearn / admetx-auth sidecar

type State = { count: number; lockedUntil: number };
const STATE = new Map<string, State>();

export type LockoutCheck = { locked: false; attemptsLeft: number }
                        | { locked: true;  remainingSecs: number };

export function checkLockout(username: string): LockoutCheck {
  const key = username.toLowerCase();
  const s = STATE.get(key);
  const now = Date.now() / 1000;
  if (s && s.lockedUntil > now) {
    return { locked: true, remainingSecs: Math.ceil(s.lockedUntil - now) };
  }
  // Expired lock auto-resets the counter on next check
  if (s && s.lockedUntil && s.lockedUntil <= now) {
    STATE.delete(key);
    return { locked: false, attemptsLeft: MAX_FAILS };
  }
  return { locked: false, attemptsLeft: MAX_FAILS - (s?.count ?? 0) };
}

export function recordFailure(username: string): LockoutCheck {
  const key = username.toLowerCase();
  const now = Date.now() / 1000;
  const cur = STATE.get(key) ?? { count: 0, lockedUntil: 0 };
  if (cur.lockedUntil && now >= cur.lockedUntil) {
    cur.count = 0;
    cur.lockedUntil = 0;
  }
  cur.count += 1;
  if (cur.count >= MAX_FAILS) {
    cur.lockedUntil = now + LOCKOUT_SECS;
    STATE.set(key, cur);
    return { locked: true, remainingSecs: LOCKOUT_SECS };
  }
  STATE.set(key, cur);
  return { locked: false, attemptsLeft: MAX_FAILS - cur.count };
}

export function recordSuccess(username: string): void {
  STATE.delete(username.toLowerCase());
}
