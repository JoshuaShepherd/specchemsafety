import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const eventTypeEnum = pgEnum("event_type", [
  "view_section",
  "start_course",
  "complete_course",
]);

// Activity Events table - tracks user activity within courses
export const activityEvents = pgTable("activity_events", {
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
  eventType: eventTypeEnum("event_type").notNull(),
  meta: jsonb("meta"),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const activityEventsRelations = relations(activityEvents, ({ one }) => ({
  user: one(profiles, {
    fields: [activityEvents.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [activityEvents.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [activityEvents.plantId],
    references: [plants.id],
  }),
}));

// Type exports
export type ActivityEvent = typeof activityEvents.$inferSelect;
export type NewActivityEvent = typeof activityEvents.$inferInsert;

// Import other tables for relations (circular import handling)
import { profiles } from "./profiles";
import { courses } from "./courses";
import { plants } from "./plants";
