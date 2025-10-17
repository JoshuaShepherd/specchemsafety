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
import { courseSections } from "./course-sections";

// User progress table
export const userProgress = pgTable(
  "user_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => courseSections.id, { onDelete: "cascade" }),
    isCompleted: boolean("is_completed").default(false).notNull(),
    completionPercentage: integer("completion_percentage").default(0).notNull(),
    timeSpentSeconds: integer("time_spent_seconds").default(0).notNull(),
    lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    userSectionUnique: unique("user_progress_user_section_unique").on(
      table.userId,
      table.sectionId
    ),
  })
);

// Relations
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  course: one(courses, {
    fields: [userProgress.courseId],
    references: [courses.id],
  }),
  section: one(courseSections, {
    fields: [userProgress.sectionId],
    references: [courseSections.id],
  }),
}));

// Type exports
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
