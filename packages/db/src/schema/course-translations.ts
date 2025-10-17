import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courses } from "./courses";

// Language code enum
export const languageCodeEnum = pgEnum("language_code", [
  "en",
  "es",
  "fr",
  "de",
]);

// Course translations table
export const courseTranslations = pgTable(
  "course_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    languageCode: languageCodeEnum("language_code").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    courseLanguageUnique: unique(
      "course_translations_course_language_unique"
    ).on(table.courseId, table.languageCode),
  })
);

// Relations
export const courseTranslationsRelations = relations(
  courseTranslations,
  ({ one }) => ({
    course: one(courses, {
      fields: [courseTranslations.courseId],
      references: [courses.id],
    }),
  })
);

// Type exports
export type CourseTranslation = typeof courseTranslations.$inferSelect;
export type NewCourseTranslation = typeof courseTranslations.$inferInsert;
