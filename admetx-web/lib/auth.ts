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
const TTL_SEC = 60 * 60 * 24; // 24h

export async function signJwt(claims: Claims): Promise<string> {
  return await new SignJWT(claims as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SEC}s`)
    .sign(secret());
}

export async function verifyJwt(token: string): Promise<Claims> {
  const { payload } = await jwtVerify(token, secret());
  return payload as unknown as Claims;
}

export async function setAuthCookie(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: 'lax', path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: TTL_SEC,
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
