import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Decode a URL-encoded component safely — returns the original string on malformed input.
// Supabase dashboard shows connection strings with URL-encoded passwords (e.g. %40 for @),
// so we must decode after extracting the password from the URL.
function tryDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

// Parse a postgres(ql):// URL manually so special chars in the password (@ # ? etc.)
// never reach new URL() inside pg-connection-string, which would throw Invalid URL.
// Uses lastIndexOf('@') to locate the host boundary, so '@' inside passwords is safe.
// Also decodes URL-encoded passwords (e.g. from the Supabase dashboard) before passing
// to pg, which expects the raw password string, not a percent-encoded one.
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

  // First ':' in userInfo separates user from password; decode percent-encoding in both
  const colonIdx = userInfo.indexOf(":");
  const user = tryDecode(colonIdx >= 0 ? userInfo.slice(0, colonIdx) : userInfo);
  const password = tryDecode(colonIdx >= 0 ? userInfo.slice(colonIdx + 1) : "");

  if (!host || Number.isNaN(port)) return null;

  return { host, port, user, password, database };
}

// Strip surrounding whitespace and quotes — EasyPanel users sometimes paste values
// from .env files including the surrounding quotes (e.g. "postgresql://...").
function cleanEnvVar(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const trimmed = v.trim();
  const unquoted = trimmed.replace(/^(["'])(.+)\1$/, "$2");
  return unquoted || undefined;
}

const rawUrl = cleanEnvVar(process.env.SUPABASE_DB_URL) || cleanEnvVar(process.env.DATABASE_URL);
const isSupabase = !!cleanEnvVar(process.env.SUPABASE_DB_URL);

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

  if (isSupabase) {
    const parsed = parsePostgresUrl(rawUrl);
    if (parsed) {
      // Pass individual params so pg never URL-parses the raw password string.
      // Passwords are already decoded by parsePostgresUrl (handles Supabase dashboard URLs
      // where the password is percent-encoded, e.g. %40 for @, %23 for #).
      console.log(`[db] Connecting to ${parsed.host}:${parsed.port}/${parsed.database} as ${parsed.user} (Supabase, SSL=true)`);
      return { ...base, ...parsed, ssl: { rejectUnauthorized: false } };
    }
    // Fallback: connectionString with SSL — parsing failed but Supabase still requires SSL.
    // Log the scheme prefix only — never log credentials.
    const preview = rawUrl.slice(0, 30).replace(/:.+/, ":***");
    console.error(`[db] WARNING: Failed to parse SUPABASE_DB_URL (starts with: ${preview}) — using connectionString fallback with SSL. Check for extra quotes or whitespace in EasyPanel env var.`);
    return { ...base, connectionString: rawUrl, ssl: { rejectUnauthorized: false } };
  }

  return { ...base, connectionString: rawUrl };
}

export const pool = new Pool(buildPoolConfig());
export const db = drizzle(pool, { schema });

export * from "./schema";
