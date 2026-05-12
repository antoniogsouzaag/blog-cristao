import { defineConfig } from "drizzle-kit";
import path from "path";

function fixDbUrl(url: string): string {
  const match = url.match(/^(postgresql:\/\/[^:]+):(.+)@(.+)$/);
  if (!match) return url;
  const [, prefix, password, rest] = match;
  return `${prefix}:${encodeURIComponent(password)}@${rest}`;
}

const rawUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error("SUPABASE_DB_URL or DATABASE_URL must be set");
}

const url = process.env.SUPABASE_DB_URL ? fixDbUrl(rawUrl) : rawUrl;

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  tablesFilter: ["posts", "categories", "comments", "ebooks", "ebook_purchases", "leads"],
  dbCredentials: {
    url,
    ssl: process.env.SUPABASE_DB_URL ? { rejectUnauthorized: false } : false,
  },
});
