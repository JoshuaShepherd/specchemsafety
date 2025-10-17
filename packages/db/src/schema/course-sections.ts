import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courses } from "./courses";

// Course sections table
export const courseSections = pgTable(
  "course_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    sectionKey: text("section_key").notNull(),
    title: text("title").notNull(),
    orderIndex: integer("order_index").notNull(),
    iconName: text("icon_name"),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    courseSectionUnique: unique("course_sections_course_section_unique").on(
      table.courseId,
      table.sectionKey
    ),
    courseOrderUnique: unique("course_sections_course_order_unique").on(
      table.courseId,
      table.orderIndex
    ),
  })
);

// Relations
export const courseSectionsRelations = relations(
  courseSections,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseSections.courseId],
      references: [courses.id],
    }),
    contentBlocks: many(contentBlocks),
    quizQuestions: many(quizQuestions),
    userProgress: many(userProgress),
    sectionTranslations: many(sectionTranslations),
  })
);

// Type exports
export type CourseSection = typeof courseSections.$inferSelect;
export type NewCourseSection = typeof courseSections.$inferInsert;

// Import other tables for relations (circular import handling)
import { contentBlocks } from "./content-blocks";
import { quizQuestions } from "./quiz-questions";
import { userProgress } from "./user-progress";
import { sectionTranslations } from "./section-translations";
