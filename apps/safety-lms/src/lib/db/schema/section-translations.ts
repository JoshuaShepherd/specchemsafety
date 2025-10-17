import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courseSections } from "./course-sections";
import { languageCodeEnum } from "./course-translations";

// Section translations table
export const sectionTranslations = pgTable("section_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => courseSections.id, { onDelete: "cascade" }),
  languageCode: languageCodeEnum("language_code").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const sectionTranslationsRelations = relations(
  sectionTranslations,
  ({ one }) => ({
    section: one(courseSections, {
      fields: [sectionTranslations.sectionId],
      references: [courseSections.id],
    }),
  })
);

// Type exports
export type SectionTranslation = typeof sectionTranslations.$inferSelect;
export type NewSectionTranslation = typeof sectionTranslations.$inferInsert;
