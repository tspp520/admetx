import { redirect } from 'next/navigation';
import { readClaims } from '@/lib/auth';

export default async function Index() {
  const c = await readClaims();
  redirect(c ? '/predict' : '/login');
}
