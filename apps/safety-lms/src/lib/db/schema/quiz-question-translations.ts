import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { quizQuestions } from "./quiz-questions";
import { languageCodeEnum } from "./course-translations";

// Quiz question translations table
export const quizQuestionTranslations = pgTable("quiz_question_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizQuestionId: uuid("quiz_question_id")
    .notNull()
    .references(() => quizQuestions.id, { onDelete: "cascade" }),
  languageCode: languageCodeEnum("language_code").notNull(),
  questionText: text("question_text").notNull(),
  options: jsonb("options"),
  correctAnswer: jsonb("correct_answer").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const quizQuestionTranslationsRelations = relations(
  quizQuestionTranslations,
  ({ one }) => ({
    quizQuestion: one(quizQuestions, {
      fields: [quizQuestionTranslations.quizQuestionId],
      references: [quizQuestions.id],
    }),
  })
);

// Type exports
export type QuizQuestionTranslation =
  typeof quizQuestionTranslations.$inferSelect;
export type NewQuizQuestionTranslation =
  typeof quizQuestionTranslations.$inferInsert;
