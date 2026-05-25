import type { Config } from 'drizzle-kit';
import 'dotenv/config';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL not set — run with .env.local or export the var');

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },
  verbose: true,
  strict: true,
} satisfies Config;
