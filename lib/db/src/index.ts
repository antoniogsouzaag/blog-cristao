import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

function fixDbUrl(url: string): string {
  // Encode special characters in the password portion of the connection string.
  // Handles both postgres:// and postgresql:// schemes (Supabase uses both).
  const match = url.match(/^(postgres(?:ql)?:\/\/[^:]+):(.+)@(.+)$/);
  if (!match) return url;
  const [, prefix, password, rest] = match;
  return `${prefix}:${encodeURIComponent(password)}@${rest}`;
}

const rawUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

// Do NOT throw here at module level — a throw before app.listen() kills the process
// and nginx returns 502. Log a warning; DB queries will fail with a clear error at runtime.
if (!rawUrl) {
  console.error(
    "[db] CRITICAL: SUPABASE_DB_URL and DATABASE_URL are both unset. " +
    "All database queries will fail. Set the variable in your runtime environment."
  );
}

const connectionString = rawUrl
  ? (process.env.SUPABASE_DB_URL ? fixDbUrl(rawUrl) : rawUrl)
  : "postgresql://localhost/unconfigured"; // sentinel — pool.connect() will throw a clear error

export const pool = new Pool({
  connectionString,
  ssl: process.env.SUPABASE_DB_URL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
