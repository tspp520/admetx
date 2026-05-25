import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { readClaimsFromRequest } from '@/lib/auth';

const Body = z.object({
  current: z.string().min(1).max(128),
  next: z.string().min(6).max(128),
});

export async function POST(req: NextRequest) {
  const c = await readClaimsFromRequest(req);
  if (!c) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  let body;
  try { body = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }); }

  const [u] = await db.select().from(users).where(eq(users.id, Number(c.sub))).limit(1);
  if (!u) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const ok = await bcrypt.compare(body.current, u.passwordHash);
  if (!ok) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });

  const hash = await bcrypt.hash(body.next, 10);
  await db.update(users).set({ passwordHash: hash, updatedAt: new Date() })
    .where(eq(users.id, u.id));
  return NextResponse.json({ ok: true });
}
