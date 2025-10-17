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
import { quizQuestions } from "./quiz-questions";

// Quiz attempts table
export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  quizQuestionId: uuid("quiz_question_id")
    .notNull()
    .references(() => quizQuestions.id, { onDelete: "cascade" }),
  userAnswer: jsonb("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
  timeSpentSeconds: integer("time_spent_seconds").default(0).notNull(),
});

// Relations
export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  quizQuestion: one(quizQuestions, {
    fields: [quizAttempts.quizQuestionId],
    references: [quizQuestions.id],
  }),
}));

// Type exports
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type NewQuizAttempt = typeof quizAttempts.$inferInsert;
