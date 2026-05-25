import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export type Role = 'admin' | 'user';
export type Claims = { sub: string; username: string; role: Role };

const enc = new TextEncoder();
function secret(): Uint8Array {
  const raw = process.env.JWT_SECRET;
  if (!raw) throw new Error('JWT_SECRET not set');
  return enc.encode(raw);
}

const COOKIE = 'admetx_token';
export const TTL_SHORT_SEC = 60 * 60 * 24;       // 24h — default ("不勾记住我")
export const TTL_LONG_SEC  = 60 * 60 * 24 * 30;  // 30d — "记住我"

// COOKIE_SECURE controls the Set-Cookie `Secure` flag.
// Default OFF: we expose the app via plain http://<ip>:port during preview
// and the browser silently drops Secure cookies over http. Set to "1" / "true"
// only when the deployment is behind HTTPS (e.g. nginx https://admetx.chempartner.com).
export function isCookieSecure(): boolean {
  const v = process.env.COOKIE_SECURE;
  if (v === undefined) return false;
  return v === '1' || v.toLowerCase() === 'true';
}

export async function signJwt(claims: Claims, ttlSec: number = TTL_SHORT_SEC): Promise<string> {
  return await new SignJWT(claims as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ttlSec}s`)
    .sign(secret());
}

export async function verifyJwt(token: string): Promise<Claims> {
  const { payload } = await jwtVerify(token, secret());
  return payload as unknown as Claims;
}

export async function setAuthCookie(token: string, ttlSec: number = TTL_SHORT_SEC) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: 'lax', path: '/',
    secure: isCookieSecure(),
    maxAge: ttlSec,
  });
}

export async function clearAuthCookie() {
  (await cookies()).delete(COOKIE);
}

export async function readClaims(): Promise<Claims | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  try { return await verifyJwt(c); } catch { return null; }
}

export async function requireUser(): Promise<Claims> {
  const c = await readClaims();
  if (!c) throw new Response('Unauthorized', { status: 401 });
  return c;
}

export function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

export function readClaimsFromRequest(req: NextRequest): Promise<Claims | null> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return Promise.resolve(null);
  return verifyJwt(token).catch(() => null);
}
