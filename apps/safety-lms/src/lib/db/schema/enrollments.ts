import { pgTable, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "enrolled",
  "in_progress",
  "completed",
]);

// Enrollments table - tracks user course enrollments
export const enrollments = pgTable("enrollments", {
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
  status: enrollmentStatusEnum("status").default("enrolled").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(profiles, {
    fields: [enrollments.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [enrollments.plantId],
    references: [plants.id],
  }),
}));

// Type exports
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;

// Import other tables for relations (circular import handling)
import { profiles } from "./profiles";
import { courses } from "./courses";
import { plants } from "./plants";
