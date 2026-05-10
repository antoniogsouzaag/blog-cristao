import { Router } from "express";
import { db, commentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateCommentParams, CreateCommentBody, ListCommentsParams } from "@workspace/api-zod";

const router = Router();

// GET /posts/:postId/comments
router.get("/posts/:postId/comments", async (req, res) => {
  const parsed = ListCommentsParams.safeParse({ postId: Number(req.params.postId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid postId" });
    return;
  }

  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postId, parsed.data.postId))
    .orderBy(commentsTable.createdAt);

  res.json(
    comments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    }))
  );
});

// POST /posts/:postId/comments
router.post("/posts/:postId/comments", async (req, res) => {
  const paramsParsed = CreateCommentParams.safeParse({ postId: Number(req.params.postId) });
  const bodyParsed = CreateCommentBody.safeParse(req.body);

  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [comment] = await db
    .insert(commentsTable)
    .values({
      postId: paramsParsed.data.postId,
      ...bodyParsed.data,
    })
    .returning();

  res.status(201).json({
    ...comment,
    createdAt: comment.createdAt.toISOString(),
  });
});

export default router;
