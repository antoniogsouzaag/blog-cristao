import { Router } from "express";
import { db, categoriesTable, postsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { CreateCategoryBody } from "@workspace/api-zod";

const router = Router();

// GET /categories
router.get("/categories", async (req, res) => {
  const categories = await db.select().from(categoriesTable);

  const postCounts = await db
    .select({ categoryId: postsTable.categoryId, cnt: count(postsTable.id) })
    .from(postsTable)
    .groupBy(postsTable.categoryId);

  const countMap = new Map(postCounts.map((c) => [c.categoryId, Number(c.cnt)]));

  res.json(
    categories.map((c) => ({
      ...c,
      postCount: countMap.get(c.id) ?? 0,
    }))
  );
});

// POST /categories
router.post("/categories", async (req, res) => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const [category] = await db.insert(categoriesTable).values(parsed.data).returning();
  res.status(201).json({ ...category, postCount: 0 });
});

export default router;
