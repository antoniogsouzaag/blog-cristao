import app from "./app";
import { pool } from "@workspace/db";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"] ?? "3001";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

if (!process.env["PORT"]) {
  logger.warn("PORT not set by environment, defaulting to 3001");
}

// Log which DB env vars are present (never log values — they contain credentials)
logger.info({
  hasSupabaseDbUrl: !!process.env.SUPABASE_DB_URL,
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV,
}, "Startup: environment check");

// Probe DB connection — non-fatal; the server still starts even if DB is unreachable.
// If this fails, API routes return 500/503 with error details (see /api/healthz/db).
pool.connect().then((client) => {
  client.release();
  logger.info("Startup: database connection OK");
}).catch((err) => {
  logger.error({ err }, "Startup: database connection FAILED — check SUPABASE_DB_URL and Supabase network access");
});

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
