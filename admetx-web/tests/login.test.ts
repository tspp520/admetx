import { describe, it, expect, beforeAll } from 'vitest';
import { POST } from '@/app/api/auth/login/route';

beforeAll(() => {
  process.env.JWT_SECRET ||= 'test-secret-32-bytes-test-secret-bytes';
  process.env.DATABASE_URL ||= 'postgresql://admetx:admetx_local@127.0.0.1:5436/admetx_dev';
});

function req(body: unknown) {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/login', () => {
  it('rejects missing credentials', async () => {
    const res = await POST(req({}));
    expect(res.status).toBe(400);
  });

  it('rejects unknown user', async () => {
    const res = await POST(req({ username: 'nobody', password: 'x' }));
    expect(res.status).toBe(401);
  });

  it('accepts admin/admetx (requires seeded dev DB)', async () => {
    const res = await POST(req({ username: 'admin', password: 'admetx' }));
    expect(res.status).toBe(200);
    const setCookie = res.headers.get('set-cookie') ?? '';
    expect(setCookie).toMatch(/admetx_token=/);
  });
});
