import { db } from './db/client';
import { auditLog, type AuditAction, type AuthSource } from './db/schema';

/**
 * Append a row to audit_log. Never throws — auditing must not break the request.
 * Fire-and-forget: callers can `void audit(...)` if they want non-blocking.
 */
export async function audit(entry: {
  userId?: number | null;
  username: string;
  action: AuditAction;
  authSource?: AuthSource;
  req?: Request;
  detail?: Record<string, unknown>;
}): Promise<void> {
  try {
    const ip = entry.req ? readClientIp(entry.req) : undefined;
    const userAgent = entry.req?.headers.get('user-agent')?.slice(0, 256) ?? undefined;
    await db.insert(auditLog).values({
      userId: entry.userId ?? null,
      username: entry.username,
      action: entry.action,
      authSource: entry.authSource,
      ip,
      userAgent,
      detail: entry.detail ?? null,
    });
  } catch (e) {
    console.error('[audit] write failed:', e);
  }
}

function readClientIp(req: Request): string | undefined {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim().slice(0, 64);
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim().slice(0, 64);
  return undefined;
}
