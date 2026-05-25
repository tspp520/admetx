import { LoginForm } from './login-form';
import { readClaims } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  if (await readClaims()) redirect('/predict');
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-sm bg-white">
        <LoginForm />
      </div>
      <footer className="fixed bottom-4 text-xs text-slate-400">
        © {new Date().getFullYear()} admetx 内部工具
      </footer>
    </main>
  );
}
