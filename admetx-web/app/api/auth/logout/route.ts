import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, readClaimsFromRequest } from '@/lib/auth';
import { audit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  const c = await readClaimsFromRequest(req);
  if (c) {
    void audit({ userId: Number(c.sub), username: c.username, action: 'logout', req });
  }
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
