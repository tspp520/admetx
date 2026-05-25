import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '@/lib/db/client';
import { users, tasks, taskItems } from '@/lib/db/schema';
import { processNext } from '@/lib/worker';
import { eq } from 'drizzle-orm';

beforeAll(() => {
  process.env.DATABASE_URL ||= 'postgresql://admetx:admetx_local@127.0.0.1:5436/admetx_dev';
  process.env.PREDICTOR_URL ||= 'http://127.0.0.1:8031';
});

describe('worker.processNext', () => {
  it('drains one queued task end-to-end', async () => {
    // assumes admin already seeded
    const [admin] = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);

    // First, drain any leftover queued tasks from prior runs so we pick our own
    // (the worker's atomic update grabs the oldest queued — there may be M3.4 leftovers)
    while (await processNext()) { /* drain */ }

    const [t] = await db.insert(tasks).values({
      ownerId: admin.id, name: 'worker-itest', project: 'unit',
      predictorName: 'rdkit_hybrid', totalCount: 2,
    }).returning();
    await db.insert(taskItems).values([
      { taskId: t.id, idx: 0, smiles: 'CCO' },
      { taskId: t.id, idx: 1, smiles: 'INVALID_SMI' },
    ]);

    const processed = await processNext();
    expect(processed).toBe(true);

    const [updated] = await db.select().from(tasks).where(eq(tasks.id, t.id)).limit(1);
    expect(['succeeded','partial_failed','failed']).toContain(updated.status);

    const items = await db.select().from(taskItems).where(eq(taskItems.taskId, t.id));
    const valid = items.find((i) => i.smiles === 'CCO')!;
    expect(valid.parsedOk).toBe(true);
    expect(valid.result).toBeTruthy();
  });
});
