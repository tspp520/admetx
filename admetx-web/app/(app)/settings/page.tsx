import { readClaims } from '@/lib/auth';
import { PasswordForm } from './password-form';

export default async function SettingsPage() {
  const c = await readClaims();
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-medium text-slate-800 mb-2">个人信息</h2>
        <dl className="grid grid-cols-[100px_1fr] text-sm gap-y-2">
          <dt className="text-slate-500">用户名</dt><dd>{c?.username}</dd>
          <dt className="text-slate-500">角色</dt><dd>{c?.role}</dd>
        </dl>
      </div>
      <PasswordForm />
    </div>
  );
}
