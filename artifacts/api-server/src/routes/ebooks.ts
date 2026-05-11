import { Router } from "express";
import { db, ebooksTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListEbooksQueryParams,
  CreateEbookBody,
  GetEbookParams,
  UpdateEbookParams,
  UpdateEbookBody,
  DeleteEbookParams,
} from "@workspace/api-zod";

const router = Router();

// GET /ebooks
router.get("/ebooks", async (req, res) => {
  const parsed = ListEbooksQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { featured, onSale, category } = parsed.data;

  const conditions = [];
  if (featured != null) conditions.push(eq(ebooksTable.featured, featured));
  if (onSale != null) conditions.push(eq(ebooksTable.onSale, onSale));
  if (category != null) conditions.push(eq(ebooksTable.category, category));

  const ebooks = await db
    .select()
    .from(ebooksTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(ebooksTable.publishedAt);

  res.json(ebooks);
});

// GET /ebooks/:ebookId
router.get("/ebooks/:ebookId", async (req, res) => {
  const parsed = GetEbookParams.safeParse({ ebookId: Number(req.params.ebookId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ebook ID" });
    return;
  }
  const ebook = await db
    .select()
    .from(ebooksTable)
    .where(eq(ebooksTable.id, parsed.data.ebookId))
    .then((r) => r[0]);

  if (!ebook) {
    res.status(404).json({ error: "Ebook não encontrado" });
    return;
  }
  res.json(ebook);
});

// POST /ebooks
router.post("/ebooks", async (req, res) => {
  const parsed = CreateEbookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos", details: parsed.error });
    return;
  }
  const data = parsed.data;
  const [ebook] = await db.insert(ebooksTable).values({
    title: data.title,
    slug: data.slug,
    description: data.description,
    excerpt: data.excerpt,
    authorName: data.authorName,
    coverUrl: data.coverUrl ?? null,
    price: data.price ?? "0",
    originalPrice: data.originalPrice ?? null,
    fileUrl: data.fileUrl ?? null,
    category: data.category ?? "geral",
    featured: data.featured ?? false,
    onSale: data.onSale ?? false,
    pageCount: data.pageCount ?? null,
  }).returning();
  res.status(201).json(ebook);
});

// PATCH /ebooks/:ebookId
router.patch("/ebooks/:ebookId", async (req, res) => {
  const paramParsed = UpdateEbookParams.safeParse({ ebookId: Number(req.params.ebookId) });
  if (!paramParsed.success) {
    res.status(400).json({ error: "Invalid ebook ID" });
    return;
  }
  const bodyParsed = UpdateEbookBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Dados inválidos" });
    return;
  }

  const updates: Record<string, unknown> = {};
  const b = bodyParsed.data;
  if (b.title !== undefined) updates.title = b.title;
  if (b.slug !== undefined) updates.slug = b.slug;
  if (b.description !== undefined) updates.description = b.description;
  if (b.excerpt !== undefined) updates.excerpt = b.excerpt;
  if (b.authorName !== undefined) updates.authorName = b.authorName;
  if (b.coverUrl !== undefined) updates.coverUrl = b.coverUrl;
  if (b.price !== undefined) updates.price = b.price;
  if (b.originalPrice !== undefined) updates.originalPrice = b.originalPrice;
  if (b.fileUrl !== undefined) updates.fileUrl = b.fileUrl;
  if (b.category !== undefined) updates.category = b.category;
  if (b.featured !== undefined) updates.featured = b.featured;
  if (b.onSale !== undefined) updates.onSale = b.onSale;
  if (b.pageCount !== undefined) updates.pageCount = b.pageCount;

  const [updated] = await db
    .update(ebooksTable)
    .set(updates)
    .where(eq(ebooksTable.id, paramParsed.data.ebookId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Ebook não encontrado" });
    return;
  }
  res.json(updated);
});

// DELETE /ebooks/:ebookId
router.delete("/ebooks/:ebookId", async (req, res) => {
  const parsed = DeleteEbookParams.safeParse({ ebookId: Number(req.params.ebookId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ebook ID" });
    return;
  }
  await db.delete(ebooksTable).where(eq(ebooksTable.id, parsed.data.ebookId));
  res.status(204).send();
});

export default router;
