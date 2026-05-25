import { readClaims } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SideNav } from '@/components/side-nav';
import { TopBar } from '@/components/top-bar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const c = await readClaims();
  if (!c) redirect('/login');
  return (
    <div className="h-screen flex flex-col bg-white">
      <TopBar username={c.username} />
      <div className="flex-1 flex overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-auto bg-slate-50/30 p-6">{children}</main>
      </div>
    </div>
  );
}
