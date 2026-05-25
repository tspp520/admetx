import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { eq, sql } from 'drizzle-orm';
import crypto from 'node:crypto';

import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { signJwt, isCookieSecure, TTL_SHORT_SEC, TTL_LONG_SEC } from '@/lib/auth';
import { audit } from '@/lib/audit';
import { ldapVerify, pickDisplayName } from '@/lib/ldap-client';

const Body = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(256),
  rememberMe: z.boolean().optional().default(false),
});

/** Hard-coded emergency local accounts — kept so admin can still log in if LDAP is down. */
const EMERGENCY_LOCAL_USERS = new Set(['admin']);

function pickTtl(rememberMe: boolean): number {
  return rememberMe ? TTL_LONG_SEC : TTL_SHORT_SEC;
}

function setCookie(res: NextResponse, token: string, ttlSec: number) {
  res.cookies.set('admetx_token', token, {
    httpOnly: true, sameSite: 'lax', path: '/',
    secure: isCookieSecure(),
    maxAge: ttlSec,
  });
}

export async function POST(req: Request) {
  let parsed;
  try { parsed = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }); }

  const usernameLower = parsed.username.trim().toLowerCase();
  const ttlSec = pickTtl(parsed.rememberMe);

  // ── Path A: emergency local account (admin) ──
  if (EMERGENCY_LOCAL_USERS.has(usernameLower)) {
    const [u] = await db.select().from(users)
      .where(eq(users.username, usernameLower)).limit(1);
    if (!u) {
      void audit({ username: usernameLower, action: 'login_failed', req,
                   authSource: 'local', detail: { reason: 'emergency_user_missing' } });
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    }
    const ok = await bcrypt.compare(parsed.password, u.passwordHash);
    if (!ok) {
      void audit({ userId: u.id, username: u.username, action: 'login_failed', req,
                   authSource: 'local', detail: { reason: 'bad_password' } });
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    }
    const token = await signJwt(
      { sub: String(u.id), username: u.username, role: u.role as 'admin' | 'user' },
      ttlSec,
    );
    void audit({ userId: u.id, username: u.username, action: 'login', req,
                 authSource: 'local', detail: { rememberMe: parsed.rememberMe, emergency: true } });
    const res = NextResponse.json({
      user: { id: u.id, username: u.username, displayName: u.displayName, role: u.role },
    });
    setCookie(res, token, ttlSec);
    return res;
  }

  // ── Path B: LDAP ──
  const v = await ldapVerify(parsed.username, parsed.password);
  if (!v.ok) {
    if (v.error === 'unreachable' || v.error === 'config_error') {
      void audit({ username: usernameLower, action: 'login_failed', req,
                   authSource: 'ldap', detail: { reason: v.error } });
      return NextResponse.json(
        { error: 'auth_service_unavailable', message: 'LDAP 服务不可达，请联系管理员' },
        { status: 503 },
      );
    }
    if (v.locked) {
      void audit({ username: usernameLower, action: 'login_failed', req,
                   authSource: 'ldap', detail: { reason: 'locked', remaining_secs: v.remaining_secs } });
      return NextResponse.json(
        { error: 'account_locked', message: `账号已锁定，请 ${v.remaining_secs} 秒后再试` },
        { status: 423 },
      );
    }
    void audit({ username: usernameLower, action: 'login_failed', req,
                 authSource: 'ldap', detail: { reason: 'invalid_credentials', attempts_left: v.attempts_left } });
    const msg = v.attempts_left === 1
      ? '账号或密码错误，还剩最后 1 次机会'
      : v.attempts_left > 0
        ? `账号或密码错误，还剩 ${v.attempts_left} 次机会`
        : '账号或密码错误';
    return NextResponse.json({ error: 'invalid_credentials', message: msg }, { status: 401 });
  }

  // LDAP OK → upsert user row (don't downgrade existing role)
  const sam = (v.attrs.sam || usernameLower).toLowerCase();
  const displayName = pickDisplayName(v.attrs, sam);

  // Dummy bcrypt hash so the NOT NULL column is satisfied; never used for matching
  // (LDAP users never go through Path A unless they're in EMERGENCY_LOCAL_USERS).
  const dummyHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

  const [u] = await db
    .insert(users)
    .values({ username: sam, displayName, passwordHash: dummyHash, role: 'user' })
    .onConflictDoUpdate({
      target: users.username,
      set: { displayName, updatedAt: sql`now()` },
    })
    .returning();

  const token = await signJwt(
    { sub: String(u.id), username: u.username, role: u.role as 'admin' | 'user' },
    ttlSec,
  );
  void audit({ userId: u.id, username: u.username, action: 'login', req,
               authSource: 'ldap',
               detail: { rememberMe: parsed.rememberMe, upn: v.attrs.upn, department: v.attrs.department } });

  const res = NextResponse.json({
    user: { id: u.id, username: u.username, displayName: u.displayName, role: u.role },
  });
  setCookie(res, token, ttlSec);
  return res;
}
