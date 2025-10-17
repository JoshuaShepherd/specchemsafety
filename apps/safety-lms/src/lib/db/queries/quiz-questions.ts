import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db } from "../index";
import {
  quizQuestions,
  quizAttempts,
  courseSections,
  QuizQuestion,
  NewQuizQuestion,
  questionTypeEnum,
} from "../schema";

/**
 * Quiz Question Query Operations
 * Handles database queries for quiz questions with proper access control
 */

// =============================================================================
// BASIC QUIZ QUESTION QUERIES
// =============================================================================

/**
 * Get quiz question by ID
 */
export const getQuizQuestionById = async (
  questionId: string
): Promise<QuizQuestion | null> => {
  const result = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.id, questionId))
    .limit(1);

  return result[0] || null;
};

/**
 * Get quiz question by section ID and question key
 */
export const getQuizQuestionByKey = async (
  sectionId: string,
  questionKey: string
): Promise<QuizQuestion | null> => {
  const result = await db
    .select()
    .from(quizQuestions)
    .where(
      and(
        eq(quizQuestions.sectionId, sectionId),
        eq(quizQuestions.questionKey, questionKey)
      )
    )
    .limit(1);

  return result[0] || null;
};

/**
 * Get all quiz questions for a section
 */
export const getQuizQuestionsBySectionId = async (
  sectionId: string,
  options: {
    questionType?: typeof questionTypeEnum.enumValues[number];
    includeUnpublished?: boolean;
    sortBy?: "orderIndex" | "questionKey" | "createdAt";
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<QuizQuestion[]> => {
  const {
    questionType,
    includeUnpublished = false,
    sortBy = "orderIndex",
    sortOrder = "asc",
  } = options;

  let whereClause = eq(quizQuestions.sectionId, sectionId);

  if (questionType) {
    whereClause = and(
      whereClause,
      eq(quizQuestions.questionType, questionType)
    );
  }

  if (!includeUnpublished) {
    whereClause = and(whereClause, eq(quizQuestions.isPublished, true));
  }

  const orderBy =
    sortOrder === "desc"
      ? desc(quizQuestions[sortBy])
      : asc(quizQuestions[sortBy]);

  const result = await db
    .select()
    .from(quizQuestions)
    .where(whereClause)
    .orderBy(orderBy);

  return result;
};

/**
 * Get quiz questions by type across all sections
 */
export const getQuizQuestionsByType = async (
  questionType: typeof questionTypeEnum.enumValues[number],
  options: {
    includeUnpublished?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<QuizQuestion[]> => {
  const { includeUnpublished = false, limit = 20, offset = 0 } = options;

  let whereClause = eq(quizQuestions.questionType, questionType);

  if (!includeUnpublished) {
    whereClause = and(whereClause, eq(quizQuestions.isPublished, true));
  }

  const result = await db
    .select()
    .from(quizQuestions)
    .where(whereClause)
    .orderBy(asc(quizQuestions.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
};

// =============================================================================
// QUIZ QUESTION CREATION AND UPDATES
// =============================================================================

/**
 * Create a new quiz question
 */
export const createQuizQuestion = async (
  questionData: NewQuizQuestion
): Promise<QuizQuestion> => {
  const result = await db
    .insert(quizQuestions)
    .values(questionData)
    .returning();

  return result[0];
};

/**
 * Update quiz question
 */
export const updateQuizQuestion = async (
  questionId: string,
  updates: Partial<QuizQuestion>
): Promise<QuizQuestion | null> => {
  const result = await db
    .update(quizQuestions)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(quizQuestions.id, questionId))
    .returning();

  return result[0] || null;
};

/**
 * Delete quiz question
 */
export const deleteQuizQuestion = async (
  questionId: string
): Promise<boolean> => {
  const result = await db
    .delete(quizQuestions)
    .where(eq(quizQuestions.id, questionId))
    .returning();

  return result.length > 0;
};

// =============================================================================
// QUIZ QUESTION ORDERING OPERATIONS
// =============================================================================

/**
 * Update quiz question order
 */
export const updateQuizQuestionOrder = async (
  questionId: string,
  newOrderIndex: number
): Promise<QuizQuestion | null> => {
  const result = await db
    .update(quizQuestions)
    .set({
      orderIndex: newOrderIndex,
      updatedAt: new Date(),
    })
    .where(eq(quizQuestions.id, questionId))
    .returning();

  return result[0] || null;
};

/**
 * Reorder multiple quiz questions
 */
export const reorderQuizQuestions = async (
  sectionId: string,
  questionOrders: Array<{ questionId: string; orderIndex: number }>
): Promise<QuizQuestion[]> => {
  const results: QuizQuestion[] = [];

  for (const order of questionOrders) {
    const result = await updateQuizQuestionOrder(
      order.questionId,
      order.orderIndex
    );
    if (result) {
      results.push(result);
    }
  }

  return results;
};

/**
 * Get next available order index for a section
 */
export const getNextQuizQuestionOrderIndex = async (
  sectionId: string
): Promise<number> => {
  const result = await db
    .select({ maxOrder: sql<number>`max(${quizQuestions.orderIndex})` })
    .from(quizQuestions)
    .where(eq(quizQuestions.sectionId, sectionId));

  return (result[0]?.maxOrder || 0) + 1;
};

// =============================================================================
// QUIZ QUESTION VALIDATION QUERIES
// =============================================================================

/**
 * Check if question key is unique within a section
 */
export const isQuestionKeyUnique = async (
  sectionId: string,
  questionKey: string,
  excludeQuestionId?: string
): Promise<boolean> => {
  let whereClause = and(
    eq(quizQuestions.sectionId, sectionId),
    eq(quizQuestions.questionKey, questionKey)
  );

  if (excludeQuestionId) {
    whereClause = and(
      whereClause,
      sql`${quizQuestions.id} != ${excludeQuestionId}`
    );
  }

  const result = await db
    .select({ id: quizQuestions.id })
    .from(quizQuestions)
    .where(whereClause)
    .limit(1);

  return result.length === 0;
};

/**
 * Check if order index is unique within a section
 */
export const isQuizQuestionOrderIndexUnique = async (
  sectionId: string,
  orderIndex: number,
  excludeQuestionId?: string
): Promise<boolean> => {
  let whereClause = and(
    eq(quizQuestions.sectionId, sectionId),
    eq(quizQuestions.orderIndex, orderIndex)
  );

  if (excludeQuestionId) {
    whereClause = and(
      whereClause,
      sql`${quizQuestions.id} != ${excludeQuestionId}`
    );
  }

  const result = await db
    .select({ id: quizQuestions.id })
    .from(quizQuestions)
    .where(whereClause)
    .limit(1);

  return result.length === 0;
};

/**
 * Validate quiz question content based on question type
 */
export const validateQuizQuestionContent = async (
  questionType: typeof questionTypeEnum.enumValues[number],
  questionText: string,
  options?: Record<string, string>,
  correctAnswer?: unknown
): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!questionText || questionText.trim().length === 0) {
    errors.push("Question text is required");
  }

  switch (questionType) {
    case "true-false":
      if (typeof correctAnswer !== "boolean") {
        errors.push("True/false questions require a boolean correct answer");
      }
      break;

    case "multiple-choice":
      if (!options || Object.keys(options).length === 0) {
        errors.push("Multiple choice questions require options");
      }
      if (
        typeof correctAnswer !== "string" ||
        !options ||
        !(correctAnswer in options)
      ) {
        errors.push("Correct answer must be one of the provided options");
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// =============================================================================
// QUIZ ATTEMPT QUERIES
// =============================================================================

/**
 * Create quiz attempt
 */
export const createQuizAttempt = async (attemptData: {
  userId: string;
  quizQuestionId: string;
  userAnswer: unknown;
  isCorrect: boolean;
  timeSpentSeconds: number;
}): Promise<any> => {
  const result = await db
    .insert(quizAttempts)
    .values({
      ...attemptData,
      attemptedAt: new Date(),
    })
    .returning();

  return result[0];
};

/**
 * Get quiz attempts for a user
 */
export const getQuizAttemptsByUser = async (
  userId: string,
  options: {
    quizQuestionId?: string;
    isCorrect?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  } = {}
): Promise<any[]> => {
  const {
    quizQuestionId,
    isCorrect,
    dateFrom,
    dateTo,
    limit = 20,
    offset = 0,
  } = options;

  let whereClause = eq(quizAttempts.userId, userId);

  if (quizQuestionId) {
    whereClause = and(
      whereClause,
      eq(quizAttempts.quizQuestionId, quizQuestionId)
    );
  }

  if (isCorrect !== undefined) {
    whereClause = and(whereClause, eq(quizAttempts.isCorrect, isCorrect));
  }

  if (dateFrom) {
    whereClause = and(
      whereClause,
      sql`${quizAttempts.attemptedAt} >= ${dateFrom}`
    );
  }

  if (dateTo) {
    whereClause = and(
      whereClause,
      sql`${quizAttempts.attemptedAt} <= ${dateTo}`
    );
  }

  const result = await db
    .select()
    .from(quizAttempts)
    .where(whereClause)
    .orderBy(desc(quizAttempts.attemptedAt))
    .limit(limit)
    .offset(offset);

  return result;
};

/**
 * Get quiz attempts for a question
 */
export const getQuizAttemptsByQuestion = async (
  quizQuestionId: string,
  options: {
    userId?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<any[]> => {
  const { userId, limit = 20, offset = 0 } = options;

  let whereClause = eq(quizAttempts.quizQuestionId, quizQuestionId);

  if (userId) {
    whereClause = and(whereClause, eq(quizAttempts.userId, userId));
  }

  const result = await db
    .select()
    .from(quizAttempts)
    .where(whereClause)
    .orderBy(desc(quizAttempts.attemptedAt))
    .limit(limit)
    .offset(offset);

  return result;
};

// =============================================================================
// QUIZ QUESTION STATISTICS QUERIES
// =============================================================================

/**
 * Get quiz question statistics
 */
export const getQuizQuestionStatistics = async (
  questionId: string
): Promise<{
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  averageTimeSpent: number;
  successRate: number;
  lastAttempted?: Date;
} | null> => {
  const question = await getQuizQuestionById(questionId);
  if (!question) return null;

  const attempts = await getQuizAttemptsByQuestion(questionId);

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
      ? attempts.sort(
          (a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime()
        )[0].attemptedAt
      : undefined;

  return {
    totalAttempts,
    correctAttempts,
    incorrectAttempts,
    averageTimeSpent,
    successRate,
    lastAttempted,
  };
};

/**
 * Get section quiz statistics
 */
export const getSectionQuizStatistics = async (
  sectionId: string
): Promise<{
  totalQuestions: number;
  publishedQuestions: number;
  totalAttempts: number;
  averageSuccessRate: number;
  questionsByType: Record<typeof questionTypeEnum.enumValues[number], number>;
} | null> => {
  // Get questions in section
  const questions = await getQuizQuestionsBySectionId(sectionId, {
    includeUnpublished: true,
  });

  if (questions.length === 0) {
    return {
      totalQuestions: 0,
      publishedQuestions: 0,
      totalAttempts: 0,
      averageSuccessRate: 0,
      questionsByType: { "true-false": 0, "multiple-choice": 0 },
    };
  }

  const publishedQuestions = questions.filter(q => q.isPublished).length;

  // Get attempts for all questions
  const questionIds = questions.map(q => q.id);
  const attempts = await db
    .select()
    .from(quizAttempts)
    .where(sql`${quizAttempts.quizQuestionId} = any(${questionIds})`);

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const averageSuccessRate =
    totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

  const questionsByType = questions.reduce(
    (acc, q) => {
      acc[q.questionType] = (acc[q.questionType] || 0) + 1;
      return acc;
    },
    {} as Record<typeof questionTypeEnum.enumValues[number], number>
  );

  return {
    totalQuestions: questions.length,
    publishedQuestions,
    totalAttempts,
    averageSuccessRate,
    questionsByType,
  };
};

// =============================================================================
// QUIZ QUESTION SEARCH QUERIES
// =============================================================================

/**
 * Search quiz questions by text
 */
export const searchQuizQuestions = async (
  sectionId: string,
  searchTerm: string,
  options: {
    questionType?: typeof questionTypeEnum.enumValues[number];
    includeUnpublished?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<QuizQuestion[]> => {
  const {
    questionType,
    includeUnpublished = false,
    limit = 20,
    offset = 0,
  } = options;

  let whereClause = and(
    eq(quizQuestions.sectionId, sectionId),
    sql`${quizQuestions.questionText} ilike ${`%${searchTerm}%`}`
  );

  if (questionType) {
    whereClause = and(
      whereClause,
      eq(quizQuestions.questionType, questionType)
    );
  }

  if (!includeUnpublished) {
    whereClause = and(whereClause, eq(quizQuestions.isPublished, true));
  }

  const result = await db
    .select()
    .from(quizQuestions)
    .where(whereClause)
    .orderBy(asc(quizQuestions.orderIndex))
    .limit(limit)
    .offset(offset);

  return result;
};

/**
 * Search quiz questions across all sections
 */
export const searchAllQuizQuestions = async (
  searchTerm: string,
  options: {
    questionType?: typeof questionTypeEnum.enumValues[number];
    includeUnpublished?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<QuizQuestion[]> => {
  const {
    questionType,
    includeUnpublished = false,
    limit = 20,
    offset = 0,
  } = options;

  let whereClause = sql`${quizQuestions.questionText} ilike ${`%${searchTerm}%`}`;

  if (questionType) {
    whereClause = and(
      whereClause,
      eq(quizQuestions.questionType, questionType)
    );
  }

  if (!includeUnpublished) {
    whereClause = and(whereClause, eq(quizQuestions.isPublished, true));
  }

  const result = await db
    .select()
    .from(quizQuestions)
    .where(whereClause)
    .orderBy(asc(quizQuestions.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
};

// =============================================================================
// QUIZ QUESTION ACCESS CONTROL QUERIES
// =============================================================================

/**
 * Get quiz questions accessible to user based on role and section access
 */
export const getAccessibleQuizQuestions = async (
  sectionId: string,
  userRole: string,
  options: {
    questionType?: typeof questionTypeEnum.enumValues[number];
  } = {}
): Promise<QuizQuestion[]> => {
  // All roles can access published quiz questions if they have section access
  // Access control is handled at the section level
  return getQuizQuestionsBySectionId(sectionId, {
    ...options,
    includeUnpublished: userRole === "safety_admin",
  });
};

/**
 * Check if user can access a specific quiz question
 */
export const canUserAccessQuizQuestion = async (
  questionId: string,
  userRole: string
): Promise<boolean> => {
  const question = await getQuizQuestionById(questionId);
  if (!question) return false;

  // Safety admins can access all questions
  if (userRole === "safety_admin") return true;

  // Other roles can only access published questions
  return question.isPublished;
};
