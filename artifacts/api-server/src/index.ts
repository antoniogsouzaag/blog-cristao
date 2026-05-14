import app from "./app";
import { pool } from "@workspace/db";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Probe DB connection at startup — non-fatal: server starts regardless so nginx never 502s.
// Errors here will surface on every API request anyway via the route handlers.
pool.connect().then((client) => {
  client.release();
  logger.info("Database connection established");
}).catch((err) => {
  logger.error({ err }, "Startup DB probe failed — check SUPABASE_DB_URL / DATABASE_URL and network reachability");
});

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
