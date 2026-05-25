import 'dotenv/config';
import { db } from './client';
import { users } from './schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function main() {
  const existing = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);
  if (existing.length > 0) {
    console.log('admin already exists, skipping');
    return;
  }
  const hash = await bcrypt.hash('admetx', 10);
  await db.insert(users).values({
    username: 'admin',
    passwordHash: hash,
    displayName: '系统管理员',
    role: 'admin',
  });
  console.log('seeded admin / admetx');
}
main().catch((e) => { console.error(e); process.exit(1); });
