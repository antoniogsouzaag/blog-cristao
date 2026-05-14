import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

// Extended health check: tests DB connectivity and returns error details.
// Useful for diagnosing production connection issues without hitting a real route.
router.get("/healthz/db", async (_req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(503).json({ status: "error", db: "unreachable", error: message });
  }
});

export default router;
