'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    start(async () => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: u, password: p }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error === 'invalid_credentials' ? '账号或密码错误' : '登录失败');
        return;
      }
      router.push('/predict');
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 w-full max-w-sm">
      <h1 className="text-xl font-semibold text-slate-800">admetx 成药性预测平台</h1>
      <input
        className="border rounded-md px-3 py-2 text-sm"
        placeholder="用户名"
        value={u} onChange={(e) => setU(e.target.value)} autoComplete="username"
      />
      <input
        className="border rounded-md px-3 py-2 text-sm"
        type="password" placeholder="密码"
        value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password"
      />
      <button
        type="submit" disabled={pending}
        className="rounded-md bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300
                   text-white text-sm font-medium py-2 transition"
      >
        {pending ? '登录中…' : '登录'}
      </button>
      {err && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}
