import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courseSections } from "./course-sections";

// Question type enum
export const questionTypeEnum = pgEnum("question_type", [
  "true-false",
  "multiple-choice",
]);

// Quiz questions table
export const quizQuestions = pgTable(
  "quiz_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => courseSections.id, { onDelete: "cascade" }),
    questionKey: text("question_key").notNull(),
    questionType: questionTypeEnum("question_type").notNull(),
    questionText: text("question_text").notNull(),
    options: jsonb("options"),
    correctAnswer: jsonb("correct_answer").notNull(),
    explanation: text("explanation"),
    orderIndex: integer("order_index").default(0).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    sectionKeyUnique: unique("quiz_questions_section_key_unique").on(
      table.sectionId,
      table.questionKey
    ),
  })
);

// Relations
export const quizQuestionsRelations = relations(
  quizQuestions,
  ({ one, many }) => ({
    section: one(courseSections, {
      fields: [quizQuestions.sectionId],
      references: [courseSections.id],
    }),
    quizAttempts: many(quizAttempts),
    quizQuestionTranslations: many(quizQuestionTranslations),
  })
);

// Type exports
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type NewQuizQuestion = typeof quizQuestions.$inferInsert;

// Import other tables for relations (circular import handling)
import { quizAttempts } from "./quiz-attempts";
import { quizQuestionTranslations } from "./quiz-question-translations";
