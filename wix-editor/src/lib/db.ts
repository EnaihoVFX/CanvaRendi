import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/db/schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}

// Global cache for development to prevent exhausting connection pool
const globalForDb = globalThis as unknown as {
    conn: Pool | undefined;
};

const conn = globalForDb.conn ?? new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }, // Required for Supabase/Neon in many environments
});

if (process.env.NODE_ENV !== 'production') {
    globalForDb.conn = conn;
}

// prepare: false is required when using PgBouncer (Supabase) in transaction pooling mode,
// as PgBouncer doesn't support named prepared statements.
export const db = drizzle(conn, { schema, logger: process.env.NODE_ENV !== 'production' });
