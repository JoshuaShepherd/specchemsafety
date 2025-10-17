import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courseSections } from "./course-sections";

// Content block type enum
export const contentBlockTypeEnum = pgEnum("content_block_type", [
  "hero",
  "text",
  "card",
  "image",
  "table",
  "list",
  "grid",
  "callout",
  "quote",
  "divider",
  "video",
  "audio",
]);

// Content blocks table
export const contentBlocks = pgTable(
  "content_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => courseSections.id, { onDelete: "cascade" }),
    blockType: contentBlockTypeEnum("block_type").notNull(),
    orderIndex: integer("order_index").notNull(),
    content: jsonb("content").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    sectionOrderUnique: unique("content_blocks_section_order_unique").on(
      table.sectionId,
      table.orderIndex
    ),
  })
);

// Relations
export const contentBlocksRelations = relations(
  contentBlocks,
  ({ one, many }) => ({
    section: one(courseSections, {
      fields: [contentBlocks.sectionId],
      references: [courseSections.id],
    }),
    contentInteractions: many(contentInteractions),
    contentBlockTranslations: many(contentBlockTranslations),
  })
);

// Type exports
export type ContentBlock = typeof contentBlocks.$inferSelect;
export type NewContentBlock = typeof contentBlocks.$inferInsert;

// Import other tables for relations (circular import handling)
import { contentInteractions } from "./content-interactions";
import { contentBlockTranslations } from "./content-block-translations";
