import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Question Events table - tracks user responses to quiz questions
export const questionEvents = pgTable("question_events", {
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
  sectionKey: text("section_key").notNull(),
  questionKey: text("question_key").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  attemptIndex: integer("attempt_index").default(1).notNull(),
  responseMeta: jsonb("response_meta"),
  answeredAt: timestamp("answered_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const questionEventsRelations = relations(questionEvents, ({ one }) => ({
  user: one(profiles, {
    fields: [questionEvents.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [questionEvents.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [questionEvents.plantId],
    references: [plants.id],
  }),
}));

// Type exports
export type QuestionEvent = typeof questionEvents.$inferSelect;
export type NewQuestionEvent = typeof questionEvents.$inferInsert;

// Import other tables for relations (circular import handling)
import { profiles } from "./profiles";
import { courses } from "./courses";
import { plants } from "./plants";
