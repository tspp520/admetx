import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { tasks, taskItems } from '@/lib/db/schema';
import { readClaimsFromRequest } from '@/lib/auth';
import { looksLikeSmiles, MAX_SMILES_BATCH } from '@/lib/smiles';

const CreateBody = z.object({
  name: z.string().min(1).max(128),
  project: z.string().min(1).max(128),
  smiles: z.array(z.string().min(1).max(500)).min(1).max(MAX_SMILES_BATCH),
  predictor: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const claims = await readClaimsFromRequest(req);
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body;
  try { body = CreateBody.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }); }

  for (const s of body.smiles) {
    if (!looksLikeSmiles(s)) {
      return NextResponse.json(
        { error: 'invalid_smiles', message: `非法字符: ${s}` },
        { status: 400 },
      );
    }
  }

  const predictorName = body.predictor ?? 'rdkit_hybrid';
  const [task] = await db.insert(tasks).values({
    ownerId: Number(claims.sub),
    name: body.name,
    project: body.project,
    status: 'queued',
    predictorName,
    totalCount: body.smiles.length,
  }).returning();

  await db.insert(taskItems).values(body.smiles.map((smi, idx) => ({
    taskId: task.id, idx, smiles: smi,
  })));

  return NextResponse.json({ task }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const claims = await readClaimsFromRequest(req);
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const rows = await db.select().from(tasks)
    .where(eq(tasks.ownerId, Number(claims.sub)))
    .orderBy(desc(tasks.createdAt))
    .limit(50);
  return NextResponse.json({ tasks: rows });
}
