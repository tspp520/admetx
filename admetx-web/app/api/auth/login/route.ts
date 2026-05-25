import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { signJwt } from '@/lib/auth';

const Body = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128),
});

export async function POST(req: Request) {
  let parsed;
  try { parsed = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }); }

  const [user] = await db.select().from(users)
    .where(eq(users.username, parsed.username)).limit(1);
  if (!user) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });

  const ok = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });

  const token = await signJwt({
    sub: String(user.id),
    username: user.username,
    role: user.role as 'admin' | 'user',
  });

  const res = NextResponse.json({
    user: { id: user.id, username: user.username, displayName: user.displayName, role: user.role },
  });
  res.cookies.set('admetx_token', token, {
    httpOnly: true, sameSite: 'lax', path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
  });
  return res;
}
