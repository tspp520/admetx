import { describe, it, expect } from 'vitest';
import { signJwt, verifyJwt } from '@/lib/auth';

describe('jwt helpers', () => {
  process.env.JWT_SECRET = 'test-secret-32-bytes-test-secret-bytes';

  it('roundtrips claims', async () => {
    const token = await signJwt({ sub: '42', username: 'alice', role: 'user' });
    const claims = await verifyJwt(token);
    expect(claims.sub).toBe('42');
    expect(claims.username).toBe('alice');
  });

  it('rejects tampered token', async () => {
    const token = await signJwt({ sub: '42', username: 'alice', role: 'user' });
    const bad = token.slice(0, -2) + 'xx';
    await expect(verifyJwt(bad)).rejects.toThrow();
  });
});
