import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { contentBlocks } from "./content-blocks";

// Interaction type enum
export const interactionTypeEnum = pgEnum("interaction_type", [
  "view",
  "click",
  "expand",
  "collapse",
  "download",
  "share",
]);

// Content interactions table
export const contentInteractions = pgTable("content_interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  contentBlockId: uuid("content_block_id")
    .notNull()
    .references(() => contentBlocks.id, { onDelete: "cascade" }),
  interactionType: interactionTypeEnum("interaction_type").notNull(),
  metadata: jsonb("metadata"),
  interactedAt: timestamp("interacted_at").defaultNow().notNull(),
});

// Relations
export const contentInteractionsRelations = relations(
  contentInteractions,
  ({ one }) => ({
    contentBlock: one(contentBlocks, {
      fields: [contentInteractions.contentBlockId],
      references: [contentBlocks.id],
    }),
  })
);

// Type exports
export type ContentInteraction = typeof contentInteractions.$inferSelect;
export type NewContentInteraction = typeof contentInteractions.$inferInsert;
