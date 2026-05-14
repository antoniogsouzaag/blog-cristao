import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Parse a postgres(ql):// URL manually so special chars in the password (@ # ? etc.)
// never reach new URL() inside pg-connection-string, which would throw Invalid URL.
// Uses lastIndexOf('@') to locate the host boundary, so '@' inside passwords is safe.
function parsePostgresUrl(url: string): pg.PoolConfig | null {
  const schemeMatch = url.match(/^postgres(?:ql)?:\/\/(.+)$/s);
  if (!schemeMatch) return null;

  const rest = schemeMatch[1];

  // Last '@' separates userinfo from host
  const lastAt = rest.lastIndexOf("@");
  if (lastAt === -1) return null;

  const userInfo = rest.slice(0, lastAt);
  const hostAndPath = rest.slice(lastAt + 1);

  // Split host:port from /database?params
  const slashIdx = hostAndPath.indexOf("/");
  const hostPort = slashIdx >= 0 ? hostAndPath.slice(0, slashIdx) : hostAndPath;
  const database = slashIdx >= 0 ? hostAndPath.slice(slashIdx + 1).split("?")[0] : "postgres";

  // Last ':' in hostPort separates host from port (safe for plain hostnames)
  const lastColon = hostPort.lastIndexOf(":");
  const host = lastColon >= 0 ? hostPort.slice(0, lastColon) : hostPort;
  const port = lastColon >= 0 ? parseInt(hostPort.slice(lastColon + 1), 10) : 5432;

  // First ':' in userInfo separates user from password
  const colonIdx = userInfo.indexOf(":");
  const user = colonIdx >= 0 ? userInfo.slice(0, colonIdx) : userInfo;
  const password = colonIdx >= 0 ? userInfo.slice(colonIdx + 1) : "";

  if (!host || Number.isNaN(port)) return null;

  return { host, port, user, password, database };
}

const rawUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!rawUrl) {
  console.error(
    "[db] CRITICAL: SUPABASE_DB_URL and DATABASE_URL are both unset. " +
      "All database queries will fail. Set the variable in your runtime environment.",
  );
}

function buildPoolConfig(): pg.PoolConfig {
  const base: pg.PoolConfig = {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };

  if (!rawUrl) {
    // Sentinel — every query will fail with a clear connection error
    return { ...base, connectionString: "postgresql://localhost/unconfigured" };
  }

  if (process.env.SUPABASE_DB_URL) {
    const parsed = parsePostgresUrl(rawUrl);
    if (parsed) {
      // Pass individual params so pg never URL-parses the raw password string.
      // This correctly handles any special chars (@ # ? ! etc.) without encoding.
      return { ...base, ...parsed, ssl: { rejectUnauthorized: false } };
    }
    console.error("[db] WARNING: Failed to parse SUPABASE_DB_URL — falling back to connectionString.");
  }

  return { ...base, connectionString: rawUrl };
}

export const pool = new Pool(buildPoolConfig());
export const db = drizzle(pool, { schema });

export * from "./schema";
