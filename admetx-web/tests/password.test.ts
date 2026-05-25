import { describe, it, expect, beforeAll } from 'vitest';
import { POST as login } from '@/app/api/auth/login/route';
import { POST as change } from '@/app/api/auth/password/route';
import { NextRequest } from 'next/server';

let cookie = '';
beforeAll(async () => {
  process.env.JWT_SECRET ||= 'test-secret-32-bytes-test-secret-bytes';
  process.env.DATABASE_URL ||= 'postgresql://admetx:admetx_local@127.0.0.1:5436/admetx_dev';
  const res = await login(new Request('http://l/api/auth/login', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admetx' }),
  }));
  cookie = (res.headers.get('set-cookie') ?? '').match(/admetx_token=[^;]+/)?.[0] ?? '';
});

function req(body: unknown) {
  return new NextRequest('http://l/api/auth/password', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/password', () => {
  it('rejects wrong current password', async () => {
    const r = await change(req({ current: 'wrong', next: 'newpw1234' }));
    expect(r.status).toBe(401);
  });

  it('accepts and rotates password (then rotates back)', async () => {
    const r1 = await change(req({ current: 'admetx', next: 'temp_pw_123' }));
    expect(r1.status).toBe(200);
    const r2 = await change(req({ current: 'temp_pw_123', next: 'admetx' }));
    expect(r2.status).toBe(200);
  });
});
