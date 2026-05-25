import { describe, it, expect, beforeAll } from 'vitest';
import { POST as login } from '@/app/api/auth/login/route';
import { POST as createTask, GET as listTasks } from '@/app/api/tasks/route';
import { NextRequest } from 'next/server';

let cookie = '';

function nReq(url: string, method: 'POST' | 'GET', body?: unknown) {
  return new NextRequest(url, {
    method,
    headers: { 'content-type': 'application/json', cookie },
    body: body ? JSON.stringify(body) : undefined,
  });
}

beforeAll(async () => {
  process.env.JWT_SECRET ||= 'test-secret-32-bytes-test-secret-bytes';
  process.env.DATABASE_URL ||= 'postgresql://admetx:admetx_local@127.0.0.1:5436/admetx_dev';
  process.env.PREDICTOR_URL ||= 'http://127.0.0.1:8031';

  const res = await login(new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admetx' }),
  }));
  const setCookie = res.headers.get('set-cookie') ?? '';
  const match = setCookie.match(/admetx_token=[^;]+/);
  cookie = match ? match[0] : '';
});

describe('POST /api/tasks', () => {
  it('rejects missing fields', async () => {
    const res = await createTask(nReq('http://localhost/api/tasks', 'POST', {}));
    expect(res.status).toBe(400);
  });

  it('creates a task queued', async () => {
    const res = await createTask(nReq('http://localhost/api/tasks', 'POST', {
      name: 'test', project: 'unit', smiles: ['CCO', 'c1ccccc1'],
    }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.task.status).toBe('queued');
    expect(body.task.totalCount).toBe(2);
  });

  it('lists tasks scoped to owner', async () => {
    const res = await listTasks(nReq('http://localhost/api/tasks', 'GET'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.tasks)).toBe(true);
    expect(body.tasks.length).toBeGreaterThan(0);
  });
});
