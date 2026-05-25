import { describe, it, expect } from 'vitest';
import { parseUpload } from '@/lib/parse-upload';

describe('parseUpload', () => {
  it('parses .smi (one per line)', () => {
    expect(parseUpload('test.smi', 'CCO\nc1ccccc1\n')).toEqual(['CCO','c1ccccc1']);
  });
  it('parses .txt the same way', () => {
    expect(parseUpload('test.txt', 'CCO')).toEqual(['CCO']);
  });
  it('parses .csv with smiles header', () => {
    const csv = 'name,smiles\nethanol,CCO\nbenzene,c1ccccc1\n';
    expect(parseUpload('test.csv', csv)).toEqual(['CCO','c1ccccc1']);
  });
  it('parses .csv without header (first column)', () => {
    expect(parseUpload('a.csv', 'CCO\nc1ccccc1')).toEqual(['CCO','c1ccccc1']);
  });
  it('rejects unknown extension', () => {
    expect(() => parseUpload('a.pdf', 'CCO')).toThrow();
  });
});
