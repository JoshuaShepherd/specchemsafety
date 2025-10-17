// =============================================================================
// LMS CONTENT API CONTRACTS
// =============================================================================

/**
 * LMS Content API contracts for structured course content, sections, blocks, and quizzes
 */

import { z } from "zod";

// =============================================================================
// LMS CONTENT BRANDED TYPES
// =============================================================================

export const CourseSectionIdSchema = z
  .string()
  .uuid()
  .brand<"CourseSectionId">();
export type CourseSectionId = z.infer<typeof CourseSectionIdSchema>;

export const ContentBlockIdSchema = z.string().uuid().brand<"ContentBlockId">();
export type ContentBlockId = z.infer<typeof ContentBlockIdSchema>;

export const QuizQuestionIdSchema = z.string().uuid().brand<"QuizQuestionId">();
export type QuizQuestionId = z.infer<typeof QuizQuestionIdSchema>;

export const UserProgressIdSchema = z.string().uuid().brand<"UserProgressId">();
export type UserProgressId = z.infer<typeof UserProgressIdSchema>;

export const QuizAttemptIdSchema = z.string().uuid().brand<"QuizAttemptId">();
export type QuizAttemptId = z.infer<typeof QuizAttemptIdSchema>;

export const ContentInteractionIdSchema = z
  .string()
  .uuid()
  .brand<"ContentInteractionId">();
export type ContentInteractionId = z.infer<typeof ContentInteractionIdSchema>;

export const CourseTranslationIdSchema = z
  .string()
  .uuid()
  .brand<"CourseTranslationId">();
export type CourseTranslationId = z.infer<typeof CourseTranslationIdSchema>;

export const SectionTranslationIdSchema = z
  .string()
  .uuid()
  .brand<"SectionTranslationId">();
export type SectionTranslationId = z.infer<typeof SectionTranslationIdSchema>;

export const ContentBlockTranslationIdSchema = z
  .string()
  .uuid()
  .brand<"ContentBlockTranslationId">();
export type ContentBlockTranslationId = z.infer<
  typeof ContentBlockTranslationIdSchema
>;

export const QuizQuestionTranslationIdSchema = z
  .string()
  .uuid()
  .brand<"QuizQuestionTranslationId">();
export type QuizQuestionTranslationId = z.infer<
  typeof QuizQuestionTranslationIdSchema
>;

// =============================================================================
// LMS CONTENT ENUM SCHEMAS
// =============================================================================

/**
 * Content block type enum
 */
export const ContentBlockTypeSchema = z.enum([
  "hero",
  "text",
  "card",
  "image",
  "table",
  "list",
  "grid",
  "callout",
  "quote",
  "divider",
  "video",
  "audio",
]);
export type ContentBlockType = z.infer<typeof ContentBlockTypeSchema>;

/**
 * Question type enum
 */
export const QuestionTypeSchema = z.enum(["true-false", "multiple-choice"]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

/**
 * Language code enum
 */
export const LanguageCodeSchema = z.enum(["en", "es", "fr", "de"]);
export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

/**
 * Interaction type enum
 */
export const InteractionTypeSchema = z.enum([
  "view",
  "click",
  "expand",
  "collapse",
  "download",
  "share",
]);
export type InteractionType = z.infer<typeof InteractionTypeSchema>;

// =============================================================================
// LMS CONTENT ENTITY SCHEMAS
// =============================================================================

/**
 * Course section entity schema
 */
export const CourseSectionSchema = z
  .object({
    id: CourseSectionIdSchema,
    courseId: z.string().uuid(),
    sectionKey: z.string().min(1).max(100),
    title: z.string().min(1).max(200),
    orderIndex: z.number().int().min(0),
    iconName: z.string().max(50).optional(),
    isPublished: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type CourseSection = z.infer<typeof CourseSectionSchema>;

/**
 * Content block entity schema
 */
export const ContentBlockSchema = z
  .object({
    id: ContentBlockIdSchema,
    sectionId: CourseSectionIdSchema,
    blockType: ContentBlockTypeSchema,
    orderIndex: z.number().int().min(0),
    content: z.record(z.string(), z.unknown()),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type ContentBlock = z.infer<typeof ContentBlockSchema>;

/**
 * Quiz question entity schema
 */
export const QuizQuestionSchema = z
  .object({
    id: QuizQuestionIdSchema,
    sectionId: CourseSectionIdSchema,
    questionKey: z.string().min(1).max(100),
    questionType: QuestionTypeSchema,
    questionText: z.string().min(1).max(1000),
    options: z.record(z.string(), z.string()).optional(),
    correctAnswer: z.union([z.string(), z.boolean(), z.number()]),
    explanation: z.string().max(2000).optional(),
    orderIndex: z.number().int().min(0).default(0),
    isPublished: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

/**
 * Course translation entity schema
 */
export const CourseTranslationSchema = z
  .object({
    id: CourseTranslationIdSchema,
    courseId: z.string().uuid(),
    languageCode: LanguageCodeSchema,
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type CourseTranslation = z.infer<typeof CourseTranslationSchema>;

/**
 * Section translation entity schema
 */
export const SectionTranslationSchema = z
  .object({
    id: SectionTranslationIdSchema,
    sectionId: CourseSectionIdSchema,
    languageCode: LanguageCodeSchema,
    title: z.string().min(1).max(200),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type SectionTranslation = z.infer<typeof SectionTranslationSchema>;

/**
 * Content block translation entity schema
 */
export const ContentBlockTranslationSchema = z
  .object({
    id: ContentBlockTranslationIdSchema,
    contentBlockId: ContentBlockIdSchema,
    languageCode: LanguageCodeSchema,
    content: z.record(z.string(), z.unknown()),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type ContentBlockTranslation = z.infer<
  typeof ContentBlockTranslationSchema
>;

/**
 * Quiz question translation entity schema
 */
export const QuizQuestionTranslationSchema = z
  .object({
    id: QuizQuestionTranslationIdSchema,
    quizQuestionId: QuizQuestionIdSchema,
    languageCode: LanguageCodeSchema,
    questionText: z.string().min(1).max(1000),
    options: z.record(z.string(), z.string()).optional(),
    correctAnswer: z.union([z.string(), z.boolean(), z.number()]),
    explanation: z.string().max(2000).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type QuizQuestionTranslation = z.infer<
  typeof QuizQuestionTranslationSchema
>;

/**
 * User progress entity schema
 */
export const UserProgressSchema = z
  .object({
    id: UserProgressIdSchema,
    userId: z.string().min(1),
    courseId: z.string().uuid(),
    sectionId: CourseSectionIdSchema,
    isCompleted: z.boolean(),
    completionPercentage: z.number().int().min(0).max(100),
    timeSpentSeconds: z.number().int().min(0),
    lastAccessedAt: z.string().datetime(),
    completedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type UserProgress = z.infer<typeof UserProgressSchema>;

/**
 * Quiz attempt entity schema
 */
export const QuizAttemptSchema = z
  .object({
    id: QuizAttemptIdSchema,
    userId: z.string().min(1),
    quizQuestionId: QuizQuestionIdSchema,
    userAnswer: z.union([z.string(), z.boolean(), z.number()]),
    isCorrect: z.boolean(),
    attemptedAt: z.string().datetime(),
    timeSpentSeconds: z.number().int().min(0),
  })
  .strict();

export type QuizAttempt = z.infer<typeof QuizAttemptSchema>;

/**
 * Content interaction entity schema
 */
export const ContentInteractionSchema = z
  .object({
    id: ContentInteractionIdSchema,
    userId: z.string().min(1),
    contentBlockId: ContentBlockIdSchema,
    interactionType: InteractionTypeSchema,
    metadata: z.record(z.string(), z.unknown()).optional(),
    interactedAt: z.string().datetime(),
  })
  .strict();

export type ContentInteraction = z.infer<typeof ContentInteractionSchema>;

// =============================================================================
// LMS CONTENT REQUEST SCHEMAS
// =============================================================================

/**
 * Create course section request schema
 */
export const CreateCourseSectionRequestSchema = z
  .object({
    courseId: z.string().uuid(),
    sectionKey: z.string().min(1).max(100),
    title: z.string().min(1).max(200),
    orderIndex: z.number().int().min(0),
    iconName: z.string().max(50).optional(),
    isPublished: z.boolean().default(false),
  })
  .strict();

export type CreateCourseSectionRequest = z.infer<
  typeof CreateCourseSectionRequestSchema
>;

/**
 * Update course section request schema
 */
export const UpdateCourseSectionRequestSchema =
  CreateCourseSectionRequestSchema.partial().strict();

export type UpdateCourseSectionRequest = z.infer<
  typeof UpdateCourseSectionRequestSchema
>;

/**
 * Create content block request schema
 */
export const CreateContentBlockRequestSchema = z
  .object({
    sectionId: CourseSectionIdSchema,
    blockType: ContentBlockTypeSchema,
    orderIndex: z.number().int().min(0),
    content: z.record(z.string(), z.unknown()),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type CreateContentBlockRequest = z.infer<
  typeof CreateContentBlockRequestSchema
>;

/**
 * Update content block request schema
 */
export const UpdateContentBlockRequestSchema =
  CreateContentBlockRequestSchema.partial().strict();

export type UpdateContentBlockRequest = z.infer<
  typeof UpdateContentBlockRequestSchema
>;

/**
 * Create quiz question request schema
 */
export const CreateQuizQuestionRequestSchema = z
  .object({
    sectionId: CourseSectionIdSchema,
    questionKey: z.string().min(1).max(100),
    questionType: QuestionTypeSchema,
    questionText: z.string().min(1).max(1000),
    options: z.record(z.string(), z.string()).optional(),
    correctAnswer: z.union([z.string(), z.boolean(), z.number()]),
    explanation: z.string().max(2000).optional(),
    orderIndex: z.number().int().min(0).default(0),
    isPublished: z.boolean().default(false),
  })
  .strict();

export type CreateQuizQuestionRequest = z.infer<
  typeof CreateQuizQuestionRequestSchema
>;

/**
 * Update quiz question request schema
 */
export const UpdateQuizQuestionRequestSchema =
  CreateQuizQuestionRequestSchema.partial().strict();

export type UpdateQuizQuestionRequest = z.infer<
  typeof UpdateQuizQuestionRequestSchema
>;

/**
 * Submit quiz answer request schema
 */
export const SubmitQuizAnswerRequestSchema = z
  .object({
    quizQuestionId: QuizQuestionIdSchema,
    userAnswer: z.union([z.string(), z.boolean(), z.number()]),
    timeSpentSeconds: z.number().int().min(0).default(0),
  })
  .strict();

export type SubmitQuizAnswerRequest = z.infer<
  typeof SubmitQuizAnswerRequestSchema
>;

/**
 * Update user progress request schema
 */
export const UpdateUserProgressRequestSchema = z
  .object({
    courseId: z.string().uuid(),
    sectionId: CourseSectionIdSchema,
    isCompleted: z.boolean().optional(),
    completionPercentage: z.number().int().min(0).max(100).optional(),
    timeSpentSeconds: z.number().int().min(0).optional(),
  })
  .strict();

export type UpdateUserProgressRequest = z.infer<
  typeof UpdateUserProgressRequestSchema
>;

/**
 * Track content interaction request schema
 */
export const TrackContentInteractionRequestSchema = z
  .object({
    contentBlockId: ContentBlockIdSchema,
    interactionType: InteractionTypeSchema,
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type TrackContentInteractionRequest = z.infer<
  typeof TrackContentInteractionRequestSchema
>;

// =============================================================================
// LMS CONTENT QUERY SCHEMAS
// =============================================================================

/**
 * Course content query schema
 */
export const CourseContentQuerySchema = z
  .object({
    courseKey: z.string().min(1).max(100),
    languageCode: LanguageCodeSchema.default("en"),
    includeUnpublished: z.boolean().default(false),
  })
  .strict();

export type CourseContentQuery = z.infer<typeof CourseContentQuerySchema>;

/**
 * Section content query schema
 */
export const SectionContentQuerySchema = z
  .object({
    courseKey: z.string().min(1).max(100),
    sectionKey: z.string().min(1).max(100),
    languageCode: LanguageCodeSchema.default("en"),
    includeUnpublished: z.boolean().default(false),
  })
  .strict();

export type SectionContentQuery = z.infer<typeof SectionContentQuerySchema>;

/**
 * User progress query schema
 */
export const UserProgressQuerySchema = z
  .object({
    userId: z.string().min(1),
    courseId: z.string().uuid().optional(),
    sectionId: CourseSectionIdSchema.optional(),
    isCompleted: z.boolean().optional(),
  })
  .strict();

export type UserProgressQuery = z.infer<typeof UserProgressQuerySchema>;

/**
 * Quiz attempts query schema
 */
export const QuizAttemptsQuerySchema = z
  .object({
    userId: z.string().min(1),
    quizQuestionId: QuizQuestionIdSchema.optional(),
    isCorrect: z.boolean().optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  })
  .strict();

export type QuizAttemptsQuery = z.infer<typeof QuizAttemptsQuerySchema>;

/**
 * Content interactions query schema
 */
export const ContentInteractionsQuerySchema = z
  .object({
    userId: z.string().min(1),
    contentBlockId: ContentBlockIdSchema.optional(),
    interactionType: InteractionTypeSchema.optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  })
  .strict();

export type ContentInteractionsQuery = z.infer<
  typeof ContentInteractionsQuerySchema
>;

// =============================================================================
// LMS CONTENT RESPONSE SCHEMAS
// =============================================================================

/**
 * Course section response schema
 */
export const CourseSectionResponseSchema = z
  .object({
    success: z.literal(true),
    data: CourseSectionSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type CourseSectionResponse = z.infer<typeof CourseSectionResponseSchema>;

/**
 * Content block response schema
 */
export const ContentBlockResponseSchema = z
  .object({
    success: z.literal(true),
    data: ContentBlockSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type ContentBlockResponse = z.infer<typeof ContentBlockResponseSchema>;

/**
 * Quiz question response schema
 */
export const QuizQuestionResponseSchema = z
  .object({
    success: z.literal(true),
    data: QuizQuestionSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type QuizQuestionResponse = z.infer<typeof QuizQuestionResponseSchema>;

/**
 * User progress response schema
 */
export const UserProgressResponseSchema = z
  .object({
    success: z.literal(true),
    data: UserProgressSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type UserProgressResponse = z.infer<typeof UserProgressResponseSchema>;

/**
 * Quiz attempt response schema
 */
export const QuizAttemptResponseSchema = z
  .object({
    success: z.literal(true),
    data: QuizAttemptSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type QuizAttemptResponse = z.infer<typeof QuizAttemptResponseSchema>;

/**
 * Content interaction response schema
 */
export const ContentInteractionResponseSchema = z
  .object({
    success: z.literal(true),
    data: ContentInteractionSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type ContentInteractionResponse = z.infer<
  typeof ContentInteractionResponseSchema
>;

// =============================================================================
// LMS CONTENT COMPOSITE RESPONSE SCHEMAS
// =============================================================================

/**
 * Course with sections response schema
 */
export const CourseWithSectionsResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.object({
      course: z.object({
        id: z.string().uuid(),
        courseKey: z.string(),
        title: z.string(),
        description: z.string().optional(),
        version: z.string(),
        isPublished: z.boolean(),
      }),
      sections: z.array(CourseSectionSchema),
    }),
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type CourseWithSectionsResponse = z.infer<
  typeof CourseWithSectionsResponseSchema
>;

/**
 * Section with content blocks response schema
 */
export const SectionWithContentResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.object({
      section: CourseSectionSchema,
      contentBlocks: z.array(ContentBlockSchema),
      quizQuestions: z.array(QuizQuestionSchema),
    }),
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type SectionWithContentResponse = z.infer<
  typeof SectionWithContentResponseSchema
>;

/**
 * Course completion status response schema
 */
export const CourseCompletionStatusResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.object({
      courseId: z.string().uuid(),
      userId: z.string(),
      totalSections: z.number().int().min(0),
      completedSections: z.number().int().min(0),
      completionPercentage: z.number().int().min(0).max(100),
      timeSpentSeconds: z.number().int().min(0),
      lastAccessedAt: z.string().datetime(),
      completedAt: z.string().datetime().optional(),
    }),
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type CourseCompletionStatusResponse = z.infer<
  typeof CourseCompletionStatusResponseSchema
>;

// =============================================================================
// LMS CONTENT ERROR RESPONSE SCHEMAS
// =============================================================================

/**
 * LMS content error codes
 */
export const LmsContentErrorCodeSchema = z.enum([
  "COURSE_NOT_FOUND",
  "COURSE_SECTION_NOT_FOUND",
  "CONTENT_BLOCK_NOT_FOUND",
  "QUIZ_QUESTION_NOT_FOUND",
  "USER_PROGRESS_NOT_FOUND",
  "QUIZ_ATTEMPT_NOT_FOUND",
  "CONTENT_INTERACTION_NOT_FOUND",
  "TRANSLATION_NOT_FOUND",
  "INVALID_CONTENT_TYPE",
  "INVALID_QUIZ_ANSWER",
  "PROGRESS_UPDATE_FAILED",
  "QUIZ_SUBMISSION_FAILED",
  "CONTENT_INTERACTION_FAILED",
  "VALIDATION_ERROR",
  "BUSINESS_ERROR",
  "SYSTEM_ERROR",
]);

export type LmsContentErrorCode = z.infer<typeof LmsContentErrorCodeSchema>;

/**
 * LMS content error response schema
 */
export const LmsContentErrorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: LmsContentErrorCodeSchema,
      message: z.string().min(1),
      details: z
        .array(
          z.object({
            field: z.string().optional(),
            message: z.string(),
            code: z.string().optional(),
          })
        )
        .optional(),
      requestId: z.string().optional(),
      timestamp: z.string().datetime(),
      path: z.string().optional(),
      method: z.string().optional(),
      courseId: z.string().uuid().optional(),
      userId: z.string().optional(),
    }),
    version: z.literal("1.0"),
  })
  .strict();

export type LmsContentErrorResponse = z.infer<
  typeof LmsContentErrorResponseSchema
>;
