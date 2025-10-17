import { QuizQuestion, NewQuizQuestion } from "../db/schema/quiz-questions";
import { QuizAttempt } from "../db/schema/quiz-attempts";
import {
  QuizQuestion as QuizQuestionSchema,
  CreateQuizQuestionRequest,
  UpdateQuizQuestionRequest,
  SubmitQuizAnswerRequest,
  QuizAttempt as QuizAttemptSchema,
  QuestionType,
} from "@specchem/contracts";

/**
 * Quiz Question Data Mappers
 * Handles transformation between quiz question database entities and API responses
 */

// =============================================================================
// QUIZ QUESTION DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps quiz question database entity to API response
 */
export const mapQuizQuestionToApiResponse = (
  question: QuizQuestion
): QuizQuestionSchema => ({
  id: question.id,
  sectionId: question.sectionId,
  questionKey: question.questionKey,
  questionType: question.questionType as QuestionType,
  questionText: question.questionText,
  options: question.options,
  correctAnswer: question.correctAnswer,
  explanation: question.explanation,
  orderIndex: question.orderIndex,
  isPublished: question.isPublished,
  createdAt: question.createdAt.toISOString(),
  updatedAt: question.updatedAt.toISOString(),
});

/**
 * Maps multiple quiz questions to API responses
 */
export const mapQuizQuestionsToApiResponses = (
  questions: QuizQuestion[]
): QuizQuestionSchema[] => questions.map(mapQuizQuestionToApiResponse);

// =============================================================================
// API REQUEST → QUIZ QUESTION DATABASE MAPPERS
// =============================================================================

/**
 * Maps create quiz question API request to database entity
 */
export const mapCreateQuizQuestionRequestToDb = (
  request: CreateQuizQuestionRequest,
  sectionId: string
): NewQuizQuestion => ({
  sectionId,
  questionKey: request.questionKey,
  questionType: request.questionType,
  questionText: request.questionText,
  options: request.options,
  correctAnswer: request.correctAnswer,
  explanation: request.explanation,
  orderIndex: request.orderIndex,
  isPublished: request.isPublished,
});

/**
 * Maps update quiz question API request to database entity
 */
export const mapUpdateQuizQuestionRequestToDb = (
  request: UpdateQuizQuestionRequest,
  existingQuestion: QuizQuestion
): Partial<QuizQuestion> => ({
  ...existingQuestion,
  questionKey: request.questionKey ?? existingQuestion.questionKey,
  questionType: request.questionType ?? existingQuestion.questionType,
  questionText: request.questionText ?? existingQuestion.questionText,
  options: request.options ?? existingQuestion.options,
  correctAnswer: request.correctAnswer ?? existingQuestion.correctAnswer,
  explanation: request.explanation ?? existingQuestion.explanation,
  orderIndex: request.orderIndex ?? existingQuestion.orderIndex,
  isPublished: request.isPublished ?? existingQuestion.isPublished,
  updatedAt: new Date(),
});

// =============================================================================
// QUIZ ANSWER VALIDATION MAPPERS
// =============================================================================

/**
 * Quiz answer validation result
 */
export interface QuizAnswerValidationResult {
  isValid: boolean;
  isCorrect: boolean;
  errors: string[];
  explanation?: string;
}

/**
 * Validates quiz answer based on question type and correct answer
 */
export const validateQuizAnswer = (
  question: QuizQuestion,
  userAnswer: string | boolean | number
): QuizAnswerValidationResult => {
  const errors: string[] = [];

  // Validate answer format based on question type
  switch (question.questionType) {
    case "true-false":
      if (typeof userAnswer !== "boolean") {
        errors.push("True/false questions require a boolean answer");
      }
      break;

    case "multiple-choice":
      if (typeof userAnswer !== "string") {
        errors.push("Multiple choice questions require a string answer");
      } else if (question.options && !(userAnswer in question.options)) {
        errors.push("Answer must be one of the provided options");
      }
      break;
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      isCorrect: false,
      errors,
    };
  }

  // Check if answer is correct
  const isCorrect = userAnswer === question.correctAnswer;

  return {
    isValid: true,
    isCorrect,
    errors: [],
    explanation: question.explanation,
  };
};

/**
 * Maps quiz answer submission to quiz attempt
 */
export const mapQuizAnswerSubmissionToAttempt = (
  request: SubmitQuizAnswerRequest,
  userId: string,
  isCorrect: boolean
): Partial<QuizAttempt> => ({
  userId,
  quizQuestionId: request.quizQuestionId,
  userAnswer: request.userAnswer,
  isCorrect,
  timeSpentSeconds: request.timeSpentSeconds,
  attemptedAt: new Date(),
});

// =============================================================================
// QUIZ ATTEMPT MAPPERS
// =============================================================================

/**
 * Maps quiz attempt database entity to API response
 */
export const mapQuizAttemptToApiResponse = (
  attempt: QuizAttempt
): QuizAttemptSchema => ({
  id: attempt.id,
  userId: attempt.userId,
  quizQuestionId: attempt.quizQuestionId,
  userAnswer: attempt.userAnswer,
  isCorrect: attempt.isCorrect,
  attemptedAt: attempt.attemptedAt.toISOString(),
  timeSpentSeconds: attempt.timeSpentSeconds,
});

/**
 * Maps multiple quiz attempts to API responses
 */
export const mapQuizAttemptsToApiResponses = (
  attempts: QuizAttempt[]
): QuizAttemptSchema[] => attempts.map(mapQuizAttemptToApiResponse);

// =============================================================================
// QUIZ QUESTION ORDERING MAPPERS
// =============================================================================

/**
 * Quiz question ordering result
 */
export interface QuizQuestionOrderingResult {
  questions: QuizQuestionSchema[];
  reordered: boolean;
  conflicts: Array<{
    questionId: string;
    questionKey: string;
    conflict: string;
  }>;
}

/**
 * Validates and applies quiz question ordering
 */
export const validateAndApplyQuizQuestionOrdering = (
  questions: QuizQuestion[],
  newOrder: Array<{ questionId: string; orderIndex: number }>
): QuizQuestionOrderingResult => {
  const questionMap = new Map(questions.map(q => [q.id, q]));
  const conflicts: Array<{
    questionId: string;
    questionKey: string;
    conflict: string;
  }> = [];
  const reorderedQuestions: QuizQuestion[] = [];

  // Check for conflicts
  const usedIndices = new Set<number>();
  for (const orderItem of newOrder) {
    const question = questionMap.get(orderItem.questionId);
    if (!question) {
      conflicts.push({
        questionId: orderItem.questionId,
        questionKey: "",
        conflict: "Quiz question not found",
      });
      continue;
    }

    if (usedIndices.has(orderItem.orderIndex)) {
      conflicts.push({
        questionId: orderItem.questionId,
        questionKey: question.questionKey,
        conflict: "Duplicate order index",
      });
    } else {
      usedIndices.add(orderItem.orderIndex);
      reorderedQuestions.push({
        ...question,
        orderIndex: orderItem.orderIndex,
        updatedAt: new Date(),
      });
    }
  }

  return {
    questions: mapQuizQuestionsToApiResponses(reorderedQuestions),
    reordered: conflicts.length === 0,
    conflicts,
  };
};

// =============================================================================
// QUIZ QUESTION ACCESS VALIDATION MAPPERS
// =============================================================================

/**
 * Quiz question access validation result
 */
export interface QuizQuestionAccessResult {
  hasAccess: boolean;
  question?: QuizQuestionSchema;
  reason?: string;
  permissions?: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canSubmitAnswer: boolean;
  };
}

/**
 * Validates quiz question access based on user role and section access
 */
export const validateQuizQuestionAccess = (
  question: QuizQuestion,
  userRole: string,
  sectionAccess: boolean
): QuizQuestionAccessResult => {
  if (!sectionAccess) {
    return {
      hasAccess: false,
      reason: "User does not have access to the section",
    };
  }

  // Safety admins can access all quiz questions
  if (userRole === "safety_admin") {
    return {
      hasAccess: true,
      question: mapQuizQuestionToApiResponse(question),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canSubmitAnswer: true,
      },
    };
  }

  // Plant managers can access quiz questions in their plant
  if (userRole === "plant_manager") {
    return {
      hasAccess: true,
      question: mapQuizQuestionToApiResponse(question),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canSubmitAnswer: true,
      },
    };
  }

  // Safety instructors can manage quiz questions in their plant
  if (userRole === "safety_instructor") {
    return {
      hasAccess: true,
      question: mapQuizQuestionToApiResponse(question),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: false,
        canSubmitAnswer: true,
      },
    };
  }

  // HR admins can view quiz questions in their plant
  if (userRole === "hr_admin") {
    return {
      hasAccess: true,
      question: mapQuizQuestionToApiResponse(question),
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canSubmitAnswer: true,
      },
    };
  }

  // Employees can view and answer published quiz questions
  if (userRole === "employee") {
    return {
      hasAccess: question.isPublished,
      question: question.isPublished
        ? mapQuizQuestionToApiResponse(question)
        : undefined,
      permissions: {
        canView: question.isPublished,
        canEdit: false,
        canDelete: false,
        canSubmitAnswer: question.isPublished,
      },
    };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to this quiz question",
  };
};

// =============================================================================
// QUIZ STATISTICS MAPPERS
// =============================================================================

/**
 * Quiz question statistics
 */
export interface QuizQuestionStatistics {
  question: QuizQuestionSchema;
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  averageTimeSpent: number;
  successRate: number;
  lastAttempted?: string;
}

/**
 * Maps quiz question to statistics response
 */
export const mapQuizQuestionToStatistics = (
  question: QuizQuestion,
  attempts: QuizAttempt[]
): QuizQuestionStatistics => {
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const incorrectAttempts = totalAttempts - correctAttempts;
  const averageTimeSpent =
    totalAttempts > 0
      ? attempts.reduce((sum, a) => sum + a.timeSpentSeconds, 0) / totalAttempts
      : 0;
  const successRate =
    totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
  const lastAttempted =
    attempts.length > 0
      ? attempts
          .sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime())[0]
          .attemptedAt.toISOString()
      : undefined;

  return {
    question: mapQuizQuestionToApiResponse(question),
    totalAttempts,
    correctAttempts,
    incorrectAttempts,
    averageTimeSpent,
    successRate,
    lastAttempted,
  };
};

// =============================================================================
// QUIZ QUESTION FILTERING MAPPERS
// =============================================================================

/**
 * Quiz question filtering criteria
 */
export interface QuizQuestionFilterCriteria {
  questionType?: QuestionType;
  sectionId?: string;
  isPublished?: boolean;
  hasOptions?: boolean;
  hasExplanation?: boolean;
}

/**
 * Maps filtering criteria to database query filters
 */
export const mapQuizQuestionFilterCriteriaToDbFilters = (
  criteria: QuizQuestionFilterCriteria
): any => {
  const where: any = {};

  if (criteria.questionType) {
    where.questionType = criteria.questionType;
  }

  if (criteria.sectionId) {
    where.sectionId = criteria.sectionId;
  }

  if (criteria.isPublished !== undefined) {
    where.isPublished = criteria.isPublished;
  }

  if (criteria.hasOptions !== undefined) {
    if (criteria.hasOptions) {
      where.options = { not: null };
    } else {
      where.options = null;
    }
  }

  if (criteria.hasExplanation !== undefined) {
    if (criteria.hasExplanation) {
      where.explanation = { not: null };
    } else {
      where.explanation = null;
    }
  }

  return where;
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type {
  QuizAnswerValidationResult,
  QuizQuestionOrderingResult,
  QuizQuestionAccessResult,
  QuizQuestionStatistics,
  QuizQuestionFilterCriteria,
};
