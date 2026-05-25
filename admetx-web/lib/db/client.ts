import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

declare global {
  // eslint-disable-next-line no-var
  var __pg: ReturnType<typeof postgres> | undefined;
}

const client = global.__pg ?? postgres(connectionString, { max: 5 });
if (process.env.NODE_ENV !== 'production') global.__pg = client;

export const db = drizzle(client, { schema });
