import { NextRequest, NextResponse } from 'next/server';
import { and, eq, asc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { tasks, taskItems } from '@/lib/db/schema';
import { readClaimsFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const claims = await readClaimsFromRequest(req);
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await ctx.params;
  const [t] = await db.select().from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.ownerId, Number(claims.sub))))
    .limit(1);
  if (!t) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const items = await db.select().from(taskItems)
    .where(eq(taskItems.taskId, id))
    .orderBy(asc(taskItems.idx));
  return NextResponse.json({ task: t, items });
}
