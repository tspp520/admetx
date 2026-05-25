import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { predictBatch } from '@/lib/predictor-client';

describe('predictBatch', () => {
  const realFetch = global.fetch;
  beforeEach(() => { process.env.PREDICTOR_URL = 'http://predictor.test'; });
  afterEach(() => { global.fetch = realFetch; });

  it('calls /predict and returns results', async () => {
    global.fetch = vi.fn(async () => new Response(JSON.stringify({
      predictor: 'rdkit_hybrid',
      results: [{ idx: 0, smiles: 'CCO', parsed_ok: true, indicators: { physicochemical: { MW: 46 } } }],
    }), { status: 200 })) as unknown as typeof fetch;

    const out = await predictBatch(['CCO']);
    expect(out.predictor).toBe('rdkit_hybrid');
    expect(out.results[0].parsedOk).toBe(true);
    expect(out.results[0].indicators?.physicochemical.MW).toBe(46);
  });

  it('throws on http error', async () => {
    global.fetch = vi.fn(async () => new Response('boom', { status: 500 })) as unknown as typeof fetch;
    await expect(predictBatch(['CCO'])).rejects.toThrow(/predictor.*500/);
  });
});
