import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Courses table - safety training courses
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  version: text("version").default("1.0").notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(enrollments),
  progress: many(progress),
  activityEvents: many(activityEvents),
  questionEvents: many(questionEvents),
}));

// Type exports
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

// Import other tables for relations (circular import handling)
import { enrollments } from "./enrollments";
import { progress } from "./progress";
import { activityEvents } from "./activity-events";
import { questionEvents } from "./question-events";
