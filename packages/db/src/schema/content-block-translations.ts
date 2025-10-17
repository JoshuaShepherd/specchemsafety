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
import { languageCodeEnum } from "./course-translations";

// Content block translations table
export const contentBlockTranslations = pgTable(
  "content_block_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contentBlockId: uuid("content_block_id")
      .notNull()
      .references(() => contentBlocks.id, { onDelete: "cascade" }),
    languageCode: languageCodeEnum("language_code").notNull(),
    content: jsonb("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    blockLanguageUnique: unique(
      "content_block_translations_block_language_unique"
    ).on(table.contentBlockId, table.languageCode),
  })
);

// Relations
export const contentBlockTranslationsRelations = relations(
  contentBlockTranslations,
  ({ one }) => ({
    contentBlock: one(contentBlocks, {
      fields: [contentBlockTranslations.contentBlockId],
      references: [contentBlocks.id],
    }),
  })
);

// Type exports
export type ContentBlockTranslation =
  typeof contentBlockTranslations.$inferSelect;
export type NewContentBlockTranslation =
  typeof contentBlockTranslations.$inferInsert;
