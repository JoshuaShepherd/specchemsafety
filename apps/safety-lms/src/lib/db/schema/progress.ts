import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Progress table - tracks user progress through courses
export const progress = pgTable("progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id),
  plantId: uuid("plant_id")
    .notNull()
    .references(() => plants.id),
  progressPercent: integer("progress_percent").default(0).notNull(),
  currentSection: text("current_section"),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const progressRelations = relations(progress, ({ one }) => ({
  user: one(profiles, {
    fields: [progress.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [progress.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [progress.plantId],
    references: [plants.id],
  }),
}));

// Type exports
export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;

// Import other tables for relations (circular import handling)
import { profiles } from "./profiles";
import { courses } from "./courses";
import { plants } from "./plants";
