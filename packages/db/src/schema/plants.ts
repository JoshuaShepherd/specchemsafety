import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Plants table - represents different plant/facility locations
export const plants = pgTable("plants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const plantsRelations = relations(plants, ({ many }) => ({
  profiles: many(profiles),
  courses: many(courses),
  enrollments: many(enrollments),
  progress: many(progress),
  activityEvents: many(activityEvents),
  questionEvents: many(questionEvents),
  adminRoles: many(adminRoles),
}));

// Type exports
export type Plant = typeof plants.$inferSelect;
export type NewPlant = typeof plants.$inferInsert;

// Import other tables for relations (circular import handling)
import { profiles } from "./profiles";
import { courses } from "./courses";
import { enrollments } from "./enrollments";
import { progress } from "./progress";
import { activityEvents } from "./activity-events";
import { questionEvents } from "./question-events";
import { adminRoles } from "./admin-roles";
