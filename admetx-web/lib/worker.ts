import { eq, asc } from 'drizzle-orm';
import { db } from './db/client';
import { tasks, taskItems } from './db/schema';
import { predictBatch } from './predictor-client';

const POLL_MS = 1000;
const MAX_CONCURRENCY = 1;
let started = false;
let inFlight = 0;

export async function processNext(): Promise<boolean> {
  // Atomically claim the oldest queued task by flipping it to 'running'.
  const [picked] = await db.update(tasks)
    .set({ status: 'running', startedAt: new Date() })
    .where(eq(tasks.status, 'queued'))
    .returning();
  if (!picked) return false;

  const items = await db.select().from(taskItems)
    .where(eq(taskItems.taskId, picked.id))
    .orderBy(asc(taskItems.idx));

  let ok = 0, fail = 0;
  try {
    const { results } = await predictBatch(
      items.map((i) => i.smiles), picked.predictorName,
    );
    for (const r of results) {
      const it = items[r.idx];
      if (r.parsedOk) ok += 1; else fail += 1;
      await db.update(taskItems)
        .set({
          parsedOk: r.parsedOk,
          result: r.indicators ?? null,
          errorMessage: r.error ?? null,
        })
        .where(eq(taskItems.id, it.id));
    }
    let status: 'succeeded' | 'partial_failed' | 'failed';
    if (fail === 0) status = 'succeeded';
    else if (ok === 0) status = 'failed';
    else status = 'partial_failed';
    await db.update(tasks).set({
      status, finishedCount: items.length, finishedAt: new Date(),
    }).where(eq(tasks.id, picked.id));
  } catch (e) {
    await db.update(tasks).set({
      status: 'failed',
      errorMessage: (e as Error).message,
      finishedAt: new Date(),
    }).where(eq(tasks.id, picked.id));
  }
  return true;
}

export function startWorker() {
  if (started) return;
  started = true;
  const loop = async () => {
    if (inFlight < MAX_CONCURRENCY) {
      inFlight += 1;
      try { await processNext(); }
      catch (e) { console.error('[worker] error', e); }
      finally { inFlight -= 1; }
    }
    setTimeout(loop, POLL_MS);
  };
  setTimeout(loop, POLL_MS);
  console.log('[worker] started');
}
