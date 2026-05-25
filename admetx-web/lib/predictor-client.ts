export type ItemResult = {
  idx: number;
  smiles: string;
  parsedOk: boolean;
  indicators?: Record<string, Record<string, number | boolean>>;
  error?: string;
};

export type PredictBatchResponse = { predictor: string; results: ItemResult[] };

export async function predictBatch(
  smiles: string[],
  predictor?: string,
): Promise<PredictBatchResponse> {
  const url = process.env.PREDICTOR_URL;
  if (!url) throw new Error('PREDICTOR_URL not set');
  const res = await fetch(`${url}/predict`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ smiles, predictor }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`predictor returned ${res.status}: ${body}`);
  }
  const raw = await res.json() as {
    predictor: string;
    results: Array<{ idx: number; smiles: string; parsed_ok: boolean;
      indicators?: ItemResult['indicators']; error?: string }>;
  };
  return {
    predictor: raw.predictor,
    results: raw.results.map((r) => ({
      idx: r.idx, smiles: r.smiles, parsedOk: r.parsed_ok,
      indicators: r.indicators, error: r.error,
    })),
  };
}
