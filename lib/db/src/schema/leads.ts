import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { postsTable } from "./posts";

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp"),
  postId: integer("post_id").references(() => postsTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Lead = typeof leadsTable.$inferSelect;
