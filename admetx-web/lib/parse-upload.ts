import { MAX_SMILES_BATCH } from './smiles';

export function parseUpload(filename: string, content: string): string[] {
  const ext = filename.toLowerCase().split('.').pop();
  let lines: string[];
  if (ext === 'csv') {
    const rows = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const first = rows[0]?.toLowerCase() ?? '';
    const headers = first.split(',').map((h) => h.trim());
    let col = 0;
    let start = 0;
    if (headers.includes('smiles')) {
      col = headers.indexOf('smiles');
      start = 1;
    }
    lines = rows.slice(start).map((r) => (r.split(',')[col] ?? '').trim()).filter(Boolean);
  } else if (ext === 'smi' || ext === 'txt') {
    lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  } else if (ext === 'sdf') {
    throw new Error('SDF 暂未支持，首版请用 .csv / .smi / .txt');
  } else {
    throw new Error(`不支持的文件类型: .${ext}`);
  }

  if (lines.length === 0) throw new Error('文件中没有 SMILES');
  if (lines.length > MAX_SMILES_BATCH) {
    throw new Error(`最多 ${MAX_SMILES_BATCH} 个 SMILES`);
  }
  return lines;
}
