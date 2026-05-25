export const MAX_SMILES_BATCH = 30;

export function splitSmilesInput(raw: string): string[] {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error('请填写至少一个 SMILES');
  if (lines.length > MAX_SMILES_BATCH) {
    throw new Error(`最多 ${MAX_SMILES_BATCH} 个 SMILES`);
  }
  return lines;
}

// Cheap front-end gate; real parsing happens in the Python predictor.
const SMILES_CHARS = /^[A-Za-z0-9@+\-\[\]()=#%/\\.:*$]+$/;

export function looksLikeSmiles(s: string): boolean {
  if (!s) return false;
  if (s.length > 500) return false;
  return SMILES_CHARS.test(s);
}
