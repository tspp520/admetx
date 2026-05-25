import { NextResponse } from 'next/server';
import { readClaims } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const c = await readClaims();
  if (!c) return NextResponse.json({ user: null });
  const [u] = await db.select({
    id: users.id, username: users.username, displayName: users.displayName, role: users.role,
  }).from(users).where(eq(users.id, Number(c.sub))).limit(1);
  return NextResponse.json({ user: u ?? null });
}
