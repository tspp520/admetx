import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { signJwt, isCookieSecure, TTL_SHORT_SEC, TTL_LONG_SEC } from '@/lib/auth';
import { audit } from '@/lib/audit';

const Body = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128),
  rememberMe: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  let parsed;
  try { parsed = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }); }

  const [user] = await db.select().from(users)
    .where(eq(users.username, parsed.username)).limit(1);
  if (!user) {
    void audit({ username: parsed.username, action: 'login_failed', req,
                 detail: { reason: 'unknown_user' } });
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const ok = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!ok) {
    void audit({ userId: user.id, username: user.username, action: 'login_failed', req,
                 authSource: 'local', detail: { reason: 'bad_password' } });
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const ttlSec = parsed.rememberMe ? TTL_LONG_SEC : TTL_SHORT_SEC;
  const token = await signJwt({
    sub: String(user.id),
    username: user.username,
    role: user.role as 'admin' | 'user',
  }, ttlSec);

  void audit({ userId: user.id, username: user.username, action: 'login', req,
               authSource: 'local', detail: { rememberMe: parsed.rememberMe } });

  const res = NextResponse.json({
    user: { id: user.id, username: user.username, displayName: user.displayName, role: user.role },
  });
  res.cookies.set('admetx_token', token, {
    httpOnly: true, sameSite: 'lax', path: '/',
    secure: isCookieSecure(),
    maxAge: ttlSec,
  });
  return res;
}
