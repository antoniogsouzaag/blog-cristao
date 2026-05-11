import { pgTable, serial, text, boolean, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ebooksTable = pgTable("ebooks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  excerpt: text("excerpt").notNull(),
  authorName: text("author_name").notNull(),
  coverUrl: text("cover_url"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  fileUrl: text("file_url"),
  category: text("category").notNull().default("geral"),
  featured: boolean("featured").notNull().default(false),
  onSale: boolean("on_sale").notNull().default(false),
  pageCount: integer("page_count"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ebookPurchasesTable = pgTable("ebook_purchases", {
  id: serial("id").primaryKey(),
  ebookId: integer("ebook_id").notNull().references(() => ebooksTable.id),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEbookSchema = createInsertSchema(ebooksTable).omit({ id: true, createdAt: true });
export const insertEbookPurchaseSchema = createInsertSchema(ebookPurchasesTable).omit({ id: true, createdAt: true });
export type InsertEbook = z.infer<typeof insertEbookSchema>;
export type Ebook = typeof ebooksTable.$inferSelect;
export type EbookPurchase = typeof ebookPurchasesTable.$inferSelect;
