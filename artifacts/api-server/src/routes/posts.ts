import { Router } from "express";
import { db, postsTable, categoriesTable, commentsTable } from "@workspace/db";
import { eq, desc, ilike, or, count, sql } from "drizzle-orm";
import {
  ListPostsQueryParams,
  CreatePostBody,
  GetPostParams,
  UpdatePostParams,
  UpdatePostBody,
  DeletePostParams,
} from "@workspace/api-zod";

const router = Router();

// GET /posts
router.get("/posts", async (req, res) => {
  const parsed = ListPostsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { categoryId, featured, search } = parsed.data;

  const conditions = [];
  if (categoryId !== null && categoryId !== undefined) {
    conditions.push(eq(postsTable.categoryId, categoryId));
  }
  if (featured !== null && featured !== undefined) {
    conditions.push(eq(postsTable.featured, featured));
  }
  if (search) {
    conditions.push(
      or(
        ilike(postsTable.title, `%${search}%`),
        ilike(postsTable.content, `%${search}%`),
        ilike(postsTable.excerpt, `%${search}%`)
      )
    );
  }

  const posts = await db
    .select()
    .from(postsTable)
    .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
    .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
    .orderBy(desc(postsTable.publishedAt));

  const commentCounts = await db
    .select({ postId: commentsTable.postId, cnt: count(commentsTable.id) })
    .from(commentsTable)
    .groupBy(commentsTable.postId);

  const countMap = new Map(commentCounts.map((c) => [c.postId, Number(c.cnt)]));

  const result = posts.map(({ posts: post, categories: category }) => ({
    ...post,
    publishedAt: post.publishedAt.toISOString(),
    category: category
      ? { ...category, postCount: 0 }
      : { id: 0, name: "", slug: "", description: null, postCount: 0 },
    commentCount: countMap.get(post.id) ?? 0,
  }));

  res.json(result);
});

// POST /posts
router.post("/posts", async (req, res) => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const [post] = await db
    .insert(postsTable)
    .values({
      ...parsed.data,
      featured: parsed.data.featured ?? false,
      publishedAt: new Date(),
    })
    .returning();

  const [category] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, post.categoryId));

  res.status(201).json({
    ...post,
    publishedAt: post.publishedAt.toISOString(),
    category: category
      ? { ...category, postCount: 0 }
      : { id: 0, name: "", slug: "", description: null, postCount: 0 },
    commentCount: 0,
  });
});

// GET /posts/featured
router.get("/posts/featured", async (req, res) => {
  const posts = await db
    .select()
    .from(postsTable)
    .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
    .where(eq(postsTable.featured, true))
    .orderBy(desc(postsTable.publishedAt))
    .limit(5);

  const commentCounts = await db
    .select({ postId: commentsTable.postId, cnt: count(commentsTable.id) })
    .from(commentsTable)
    .groupBy(commentsTable.postId);

  const countMap = new Map(commentCounts.map((c) => [c.postId, Number(c.cnt)]));

  const result = posts.map(({ posts: post, categories: category }) => ({
    ...post,
    publishedAt: post.publishedAt.toISOString(),
    category: category
      ? { ...category, postCount: 0 }
      : { id: 0, name: "", slug: "", description: null, postCount: 0 },
    commentCount: countMap.get(post.id) ?? 0,
  }));

  res.json(result);
});

// GET /posts/recent
router.get("/posts/recent", async (req, res) => {
  const posts = await db
    .select()
    .from(postsTable)
    .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
    .orderBy(desc(postsTable.publishedAt))
    .limit(6);

  const commentCounts = await db
    .select({ postId: commentsTable.postId, cnt: count(commentsTable.id) })
    .from(commentsTable)
    .groupBy(commentsTable.postId);

  const countMap = new Map(commentCounts.map((c) => [c.postId, Number(c.cnt)]));

  const result = posts.map(({ posts: post, categories: category }) => ({
    ...post,
    publishedAt: post.publishedAt.toISOString(),
    category: category
      ? { ...category, postCount: 0 }
      : { id: 0, name: "", slug: "", description: null, postCount: 0 },
    commentCount: countMap.get(post.id) ?? 0,
  }));

  res.json(result);
});

// GET /posts/stats
router.get("/posts/stats", async (req, res) => {
  const [[{ totalPosts }], [{ totalCategories }], [{ totalComments }], [{ featuredCount }]] =
    await Promise.all([
      db.select({ totalPosts: count(postsTable.id) }).from(postsTable),
      db.select({ totalCategories: count(categoriesTable.id) }).from(categoriesTable),
      db.select({ totalComments: count(commentsTable.id) }).from(commentsTable),
      db
        .select({ featuredCount: count(postsTable.id) })
        .from(postsTable)
        .where(eq(postsTable.featured, true)),
    ]);

  res.json({
    totalPosts: Number(totalPosts),
    totalCategories: Number(totalCategories),
    totalComments: Number(totalComments),
    featuredCount: Number(featuredCount),
  });
});

// GET /posts/:id
router.get("/posts/:id", async (req, res) => {
  const parsed = GetPostParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [row] = await db
    .select()
    .from(postsTable)
    .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
    .where(eq(postsTable.id, parsed.data.id));

  if (!row) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const [{ cnt }] = await db
    .select({ cnt: count(commentsTable.id) })
    .from(commentsTable)
    .where(eq(commentsTable.postId, parsed.data.id));

  const { posts: post, categories: category } = row;
  res.json({
    ...post,
    publishedAt: post.publishedAt.toISOString(),
    category: category
      ? { ...category, postCount: 0 }
      : { id: 0, name: "", slug: "", description: null, postCount: 0 },
    commentCount: Number(cnt),
  });
});

// PATCH /posts/:id
router.patch("/posts/:id", async (req, res) => {
  const paramsParsed = UpdatePostParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = UpdatePostBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [post] = await db
    .update(postsTable)
    .set(bodyParsed.data)
    .where(eq(postsTable.id, paramsParsed.data.id))
    .returning();

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const [category] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, post.categoryId));

  const [{ cnt }] = await db
    .select({ cnt: count(commentsTable.id) })
    .from(commentsTable)
    .where(eq(commentsTable.postId, post.id));

  res.json({
    ...post,
    publishedAt: post.publishedAt.toISOString(),
    category: category
      ? { ...category, postCount: 0 }
      : { id: 0, name: "", slug: "", description: null, postCount: 0 },
    commentCount: Number(cnt),
  });
});

// DELETE /posts/:id
router.delete("/posts/:id", async (req, res) => {
  const parsed = DeletePostParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(postsTable).where(eq(postsTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
