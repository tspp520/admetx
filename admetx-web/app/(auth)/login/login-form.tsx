'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@/components/password-input';

export function LoginForm() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
        body: JSON.stringify({ username: u, password: p, rememberMe }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        // Server localizes messages (attempts_left countdown, lockout seconds, LDAP unavailable…).
        // Prefer server message; fall back to a generic label.
        const fallback =
          j.error === 'invalid_credentials' ? '账号或密码错误'
          : j.error === 'account_locked'    ? '账号已锁定'
          : j.error === 'auth_service_unavailable' ? 'LDAP 服务暂不可达，请稍后重试或用应急 admin 账号'
          : '登录失败';
        setErr(j.message || fallback);
        return;
      }
      router.push('/predict');
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 w-full max-w-sm">
      <h1 className="text-xl font-semibold text-slate-800">睿智医药 AdmetX 成药性预测平台</h1>
      <input
        className="border rounded-md px-3 py-2 text-sm"
        placeholder="用户名"
        value={u} onChange={(e) => setU(e.target.value)} autoComplete="username"
      />
      <PasswordInput
        value={p} onChange={setP}
        placeholder="密码" autoComplete="current-password"
      />
      <label className="flex items-center gap-2 text-xs text-slate-600 select-none">
        <input
          type="checkbox" checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="accent-teal-500"
        />
        记住我（30 天内免登录）
      </label>
      <button
        type="submit" disabled={pending}
        className="rounded-md bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300
                   text-white text-sm font-medium py-2 transition"
      >
        {pending ? '登录中…' : '登录'}
      </button>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t">
        请使用公司域账号登录，密码即电脑开机密码。<br />
        忘记或锁定，请联系 IT 重置。
      </p>
    </form>
  );
}
