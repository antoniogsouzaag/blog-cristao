import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db/schema";
import { z } from "zod";

const router = Router();

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  postId: z.number().int().positive().optional(),
});

router.post("/leads", async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const existing = await db
    .select({ id: leadsTable.id })
    .from(leadsTable)
    .where(eq(leadsTable.email, parsed.data.email));

  if (existing.length > 0) {
    res.status(200).json({ ok: true, message: "already_registered" });
    return;
  }

  const [lead] = await db
    .insert(leadsTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp ?? null,
      postId: parsed.data.postId ?? null,
    })
    .returning();

  res.status(201).json(lead);
});

export default router;
