import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

function fixDbUrl(url: string): string {
  // Encode special characters in the password portion of the connection string
  const match = url.match(/^(postgresql:\/\/[^:]+):(.+)@(.+)$/);
  if (!match) return url;
  const [, prefix, password, rest] = match;
  return `${prefix}:${encodeURIComponent(password)}@${rest}`;
}

const rawUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error("SUPABASE_DB_URL or DATABASE_URL must be set.");
}

const connectionString = process.env.SUPABASE_DB_URL ? fixDbUrl(rawUrl) : rawUrl;

export const pool = new Pool({
  connectionString,
  ssl: process.env.SUPABASE_DB_URL ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
