'use client';
import { useState } from 'react';
import { PasswordInput } from '@/components/password-input';

export function PasswordForm() {
  const [cur, setCur] = useState('');
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');
  const [msg, setMsg] = useState<{kind:'ok'|'err';text:string}|null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (n1.length < 6) return setMsg({kind:'err', text:'新密码至少 6 位'});
    if (n1 !== n2)     return setMsg({kind:'err', text:'两次输入不一致'});
    const r = await fetch('/api/auth/password', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ current: cur, next: n1 }),
    });
    if (r.ok) { setMsg({kind:'ok',text:'已更新'}); setCur(''); setN1(''); setN2(''); }
    else {
      const j = await r.json().catch(()=>({}));
      setMsg({kind:'err', text: j.error==='invalid_credentials' ? '当前密码错误' : '更新失败'});
    }
  }
  return (
    <form onSubmit={submit} className="bg-white border rounded-lg p-6 max-w-xl space-y-4">
      <h2 className="font-medium text-slate-800">修改密码</h2>
      <PasswordInput value={cur} onChange={setCur}
        placeholder="当前密码" autoComplete="current-password" />
      <PasswordInput value={n1} onChange={setN1}
        placeholder="新密码（≥6 位）" autoComplete="new-password" />
      <PasswordInput value={n2} onChange={setN2}
        placeholder="重复新密码" autoComplete="new-password" />
      <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-md px-4 py-2">
        更新密码
      </button>
      {msg && <p className={`text-sm ${msg.kind==='ok'?'text-teal-600':'text-red-500'}`}>{msg.text}</p>}
    </form>
  );
}
