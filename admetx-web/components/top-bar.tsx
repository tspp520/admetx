'use client';

import { Bell, Video, Globe, LogOut } from 'lucide-react';
import { Logo } from './logo';
import { useRouter } from 'next/navigation';

export function TopBar({ username }: { username: string }) {
  const router = useRouter();
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      <Logo />
      <div className="flex items-center gap-5 text-slate-500 text-sm">
        <button className="hover:text-teal-600 flex items-center gap-1"><Video size={16}/> 操作视频</button>
        <button className="hover:text-teal-600 flex items-center gap-1"><Globe size={16}/> 中文</button>
        <button className="hover:text-teal-600" aria-label="通知"><Bell size={18}/></button>
        <div className="flex items-center gap-2">
          <span className="text-slate-700">{username}</span>
          <button onClick={logout} className="hover:text-red-500" aria-label="退出登录">
            <LogOut size={18}/>
          </button>
        </div>
      </div>
    </header>
  );
}
