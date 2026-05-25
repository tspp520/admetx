import { describe, it, expect } from 'vitest';
import { splitSmilesInput, looksLikeSmiles, MAX_SMILES_BATCH } from '@/lib/smiles';

describe('splitSmilesInput', () => {
  it('splits by newline and trims', () => {
    expect(splitSmilesInput("CCO\n  c1ccccc1  \n")).toEqual(['CCO','c1ccccc1']);
  });
  it('drops empty lines', () => {
    expect(splitSmilesInput("\n\nCCO\n\n")).toEqual(['CCO']);
  });
  it('enforces max batch', () => {
    expect(() => splitSmilesInput(Array(MAX_SMILES_BATCH+1).fill('CCO').join('\n')))
      .toThrow(/最多/);
  });
});

describe('looksLikeSmiles', () => {
  it('accepts plausible', () => {
    expect(looksLikeSmiles('CCO')).toBe(true);
    expect(looksLikeSmiles('c1ccccc1')).toBe(true);
  });
  it('rejects obvious garbage', () => {
    expect(looksLikeSmiles('hello world!!!')).toBe(false);
    expect(looksLikeSmiles('')).toBe(false);
  });
});
