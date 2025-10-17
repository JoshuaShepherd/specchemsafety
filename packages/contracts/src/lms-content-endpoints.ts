// =============================================================================
// LMS CONTENT API ENDPOINT SPECIFICATIONS
// =============================================================================

/**
 * LMS Content API endpoint specifications for structured course content,
 * sections, blocks, quizzes, and user progress tracking.
 */

import { z } from "zod";
import {
  CourseSectionIdSchema,
  ContentBlockIdSchema,
  QuizQuestionIdSchema,
  UserProgressIdSchema,
  QuizAttemptIdSchema,
  ContentInteractionIdSchema,
  LanguageCodeSchema,
  CreateCourseSectionRequestSchema,
  UpdateCourseSectionRequestSchema,
  CreateContentBlockRequestSchema,
  UpdateContentBlockRequestSchema,
  CreateQuizQuestionRequestSchema,
  UpdateQuizQuestionRequestSchema,
  SubmitQuizAnswerRequestSchema,
  UpdateUserProgressRequestSchema,
  TrackContentInteractionRequestSchema,
  CourseContentQuerySchema,
  SectionContentQuerySchema,
  UserProgressQuerySchema,
  QuizAttemptsQuerySchema,
  ContentInteractionsQuerySchema,
  CourseSectionResponseSchema,
  ContentBlockResponseSchema,
  QuizQuestionResponseSchema,
  UserProgressResponseSchema,
  QuizAttemptResponseSchema,
  ContentInteractionResponseSchema,
  CourseWithSectionsResponseSchema,
  SectionWithContentResponseSchema,
  CourseCompletionStatusResponseSchema,
  LmsContentErrorResponseSchema,
} from "./lms-content-contracts";

// =============================================================================
// LMS CONTENT API ENDPOINT DEFINITIONS
// =============================================================================

/**
 * LMS Content API endpoint specifications
 * All endpoints are prefixed with /api/lms-content
 */

export const LmsContentApiEndpoints = {
  // =============================================================================
  // COURSE CONTENT ENDPOINTS
  // =============================================================================

  /**
   * GET /api/lms-content/courses/:courseKey/content
   * Get complete course content with sections
   */
  GET_COURSE_CONTENT: {
    method: "GET",
    path: "/api/lms-content/courses/:courseKey/content",
    params: z.object({
      courseKey: z.string().min(1).max(100),
    }),
    query: CourseContentQuerySchema.omit({ courseKey: true }),
    response: CourseWithSectionsResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },

  /**
   * GET /api/lms-content/courses/:courseKey/sections/:sectionKey
   * Get specific section with content blocks and quiz questions
   */
  GET_SECTION_CONTENT: {
    method: "GET",
    path: "/api/lms-content/courses/:courseKey/sections/:sectionKey",
    params: z.object({
      courseKey: z.string().min(1).max(100),
      sectionKey: z.string().min(1).max(100),
    }),
    query: SectionContentQuerySchema.omit({
      courseKey: true,
      sectionKey: true,
    }),
    response: SectionWithContentResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },

  // =============================================================================
  // COURSE SECTION MANAGEMENT ENDPOINTS
  // =============================================================================

  /**
   * GET /api/lms-content/courses/:courseKey/sections
   * List all sections for a course
   */
  LIST_COURSE_SECTIONS: {
    method: "GET",
    path: "/api/lms-content/courses/:courseKey/sections",
    params: z.object({
      courseKey: z.string().min(1).max(100),
    }),
    query: z.object({
      languageCode: LanguageCodeSchema.default("en"),
      includeUnpublished: z.boolean().default(false),
      sortBy: z
        .enum(["orderIndex", "title", "createdAt"])
        .default("orderIndex"),
      sortOrder: z.enum(["asc", "desc"]).default("asc"),
    }),
    response: z.object({
      success: z.literal(true),
      data: z.array(
        z.object({
          id: CourseSectionIdSchema,
          sectionKey: z.string(),
          title: z.string(),
          orderIndex: z.number().int(),
          iconName: z.string().optional(),
          isPublished: z.boolean(),
          createdAt: z.string().datetime(),
          updatedAt: z.string().datetime(),
        })
      ),
      version: z.literal("1.0"),
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },

  /**
   * GET /api/lms-content/sections/:sectionId
   * Get specific section details
   */
  GET_COURSE_SECTION: {
    method: "GET",
    path: "/api/lms-content/sections/:sectionId",
    params: z.object({
      sectionId: CourseSectionIdSchema,
    }),
    response: CourseSectionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },

  /**
   * POST /api/lms-content/courses/:courseKey/sections
   * Create a new course section
   */
  CREATE_COURSE_SECTION: {
    method: "POST",
    path: "/api/lms-content/courses/:courseKey/sections",
    params: z.object({
      courseKey: z.string().min(1).max(100),
    }),
    body: CreateCourseSectionRequestSchema.omit({ courseId: true }),
    response: CourseSectionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:create"],
  },

  /**
   * PUT /api/lms-content/sections/:sectionId
   * Update course section details
   */
  UPDATE_COURSE_SECTION: {
    method: "PUT",
    path: "/api/lms-content/sections/:sectionId",
    params: z.object({
      sectionId: CourseSectionIdSchema,
    }),
    body: UpdateCourseSectionRequestSchema,
    response: CourseSectionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:update"],
  },

  /**
   * DELETE /api/lms-content/sections/:sectionId
   * Delete a course section
   */
  DELETE_COURSE_SECTION: {
    method: "DELETE",
    path: "/api/lms-content/sections/:sectionId",
    params: z.object({
      sectionId: CourseSectionIdSchema,
    }),
    response: z.object({
      success: z.literal(true),
      message: z.string(),
      version: z.literal("1.0"),
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:delete"],
  },

  // =============================================================================
  // CONTENT BLOCK MANAGEMENT ENDPOINTS
  // =============================================================================

  /**
   * GET /api/lms-content/sections/:sectionId/content-blocks
   * List content blocks for a section
   */
  LIST_CONTENT_BLOCKS: {
    method: "GET",
    path: "/api/lms-content/sections/:sectionId/content-blocks",
    params: z.object({
      sectionId: CourseSectionIdSchema,
    }),
    query: z.object({
      languageCode: LanguageCodeSchema.default("en"),
      blockType: z
        .enum([
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
        ])
        .optional(),
      sortBy: z
        .enum(["orderIndex", "blockType", "createdAt"])
        .default("orderIndex"),
      sortOrder: z.enum(["asc", "desc"]).default("asc"),
    }),
    response: z.object({
      success: z.literal(true),
      data: z.array(ContentBlockResponseSchema.shape.data),
      version: z.literal("1.0"),
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },

  /**
   * GET /api/lms-content/content-blocks/:contentBlockId
   * Get specific content block details
   */
  GET_CONTENT_BLOCK: {
    method: "GET",
    path: "/api/lms-content/content-blocks/:contentBlockId",
    params: z.object({
      contentBlockId: ContentBlockIdSchema,
    }),
    response: ContentBlockResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },

  /**
   * POST /api/lms-content/sections/:sectionId/content-blocks
   * Create a new content block
   */
  CREATE_CONTENT_BLOCK: {
    method: "POST",
    path: "/api/lms-content/sections/:sectionId/content-blocks",
    params: z.object({
      sectionId: CourseSectionIdSchema,
    }),
    body: CreateContentBlockRequestSchema.omit({ sectionId: true }),
    response: ContentBlockResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:create"],
  },

  /**
   * PUT /api/lms-content/content-blocks/:contentBlockId
   * Update content block details
   */
  UPDATE_CONTENT_BLOCK: {
    method: "PUT",
    path: "/api/lms-content/content-blocks/:contentBlockId",
    params: z.object({
      contentBlockId: ContentBlockIdSchema,
    }),
    body: UpdateContentBlockRequestSchema,
    response: ContentBlockResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:update"],
  },

  /**
   * DELETE /api/lms-content/content-blocks/:contentBlockId
   * Delete a content block
   */
  DELETE_CONTENT_BLOCK: {
    method: "DELETE",
    path: "/api/lms-content/content-blocks/:contentBlockId",
    params: z.object({
      contentBlockId: ContentBlockIdSchema,
    }),
    response: z.object({
      success: z.literal(true),
      message: z.string(),
      version: z.literal("1.0"),
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:delete"],
  },

  // =============================================================================
  // QUIZ QUESTION MANAGEMENT ENDPOINTS
  // =============================================================================

  /**
   * GET /api/lms-content/sections/:sectionId/quiz-questions
   * List quiz questions for a section
   */
  LIST_QUIZ_QUESTIONS: {
    method: "GET",
    path: "/api/lms-content/sections/:sectionId/quiz-questions",
    params: z.object({
      sectionId: CourseSectionIdSchema,
    }),
    query: z.object({
      languageCode: LanguageCodeSchema.default("en"),
      questionType: z.enum(["true-false", "multiple-choice"]).optional(),
      includeUnpublished: z.boolean().default(false),
      sortBy: z
        .enum(["orderIndex", "questionKey", "createdAt"])
        .default("orderIndex"),
      sortOrder: z.enum(["asc", "desc"]).default("asc"),
    }),
    response: z.object({
      success: z.literal(true),
      data: z.array(QuizQuestionResponseSchema.shape.data),
      version: z.literal("1.0"),
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },

  /**
   * GET /api/lms-content/quiz-questions/:quizQuestionId
   * Get specific quiz question details
   */
  GET_QUIZ_QUESTION: {
    method: "GET",
    path: "/api/lms-content/quiz-questions/:quizQuestionId",
    params: z.object({
      quizQuestionId: QuizQuestionIdSchema,
    }),
    response: QuizQuestionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },

  /**
   * POST /api/lms-content/sections/:sectionId/quiz-questions
   * Create a new quiz question
   */
  CREATE_QUIZ_QUESTION: {
    method: "POST",
    path: "/api/lms-content/sections/:sectionId/quiz-questions",
    params: z.object({
      sectionId: CourseSectionIdSchema,
    }),
    body: CreateQuizQuestionRequestSchema.omit({ sectionId: true }),
    response: QuizQuestionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:create"],
  },

  /**
   * PUT /api/lms-content/quiz-questions/:quizQuestionId
   * Update quiz question details
   */
  UPDATE_QUIZ_QUESTION: {
    method: "PUT",
    path: "/api/lms-content/quiz-questions/:quizQuestionId",
    params: z.object({
      quizQuestionId: QuizQuestionIdSchema,
    }),
    body: UpdateQuizQuestionRequestSchema,
    response: QuizQuestionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:update"],
  },

  /**
   * DELETE /api/lms-content/quiz-questions/:quizQuestionId
   * Delete a quiz question
   */
  DELETE_QUIZ_QUESTION: {
    method: "DELETE",
    path: "/api/lms-content/quiz-questions/:quizQuestionId",
    params: z.object({
      quizQuestionId: QuizQuestionIdSchema,
    }),
    response: z.object({
      success: z.literal(true),
      message: z.string(),
      version: z.literal("1.0"),
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:delete"],
  },

  // =============================================================================
  // USER PROGRESS ENDPOINTS
  // =============================================================================

  /**
   * GET /api/lms-content/users/:userId/progress
   * Get user progress for courses
   */
  GET_USER_PROGRESS: {
    method: "GET",
    path: "/api/lms-content/users/:userId/progress",
    params: z.object({
      userId: z.string().min(1),
    }),
    query: UserProgressQuerySchema.omit({ userId: true }),
    response: z.object({
      success: z.literal(true),
      data: z.array(UserProgressResponseSchema.shape.data),
      version: z.literal("1.0"),
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["progress:read"],
  },

  /**
   * GET /api/lms-content/users/:userId/courses/:courseId/completion
   * Get course completion status for a user
   */
  GET_COURSE_COMPLETION_STATUS: {
    method: "GET",
    path: "/api/lms-content/users/:userId/courses/:courseId/completion",
    params: z.object({
      userId: z.string().min(1),
      courseId: z.string().uuid(),
    }),
    response: CourseCompletionStatusResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["progress:read"],
  },

  /**
   * PUT /api/lms-content/users/:userId/progress
   * Update user progress
   */
  UPDATE_USER_PROGRESS: {
    method: "PUT",
    path: "/api/lms-content/users/:userId/progress",
    params: z.object({
      userId: z.string().min(1),
    }),
    body: UpdateUserProgressRequestSchema,
    response: UserProgressResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["progress:update"],
  },

  // =============================================================================
  // QUIZ INTERACTION ENDPOINTS
  // =============================================================================

  /**
   * POST /api/lms-content/quiz-questions/:quizQuestionId/submit
   * Submit quiz answer
   */
  SUBMIT_QUIZ_ANSWER: {
    method: "POST",
    path: "/api/lms-content/quiz-questions/:quizQuestionId/submit",
    params: z.object({
      quizQuestionId: QuizQuestionIdSchema,
    }),
    body: SubmitQuizAnswerRequestSchema.omit({ quizQuestionId: true }),
    response: QuizAttemptResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["quiz:submit"],
  },

  /**
   * GET /api/lms-content/users/:userId/quiz-attempts
   * Get user's quiz attempts
   */
  GET_USER_QUIZ_ATTEMPTS: {
    method: "GET",
    path: "/api/lms-content/users/:userId/quiz-attempts",
    params: z.object({
      userId: z.string().min(1),
    }),
    query: QuizAttemptsQuerySchema.omit({ userId: true }),
    response: z.object({
      success: z.literal(true),
      data: z.array(QuizAttemptResponseSchema.shape.data),
      version: z.literal("1.0"),
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["quiz:read"],
  },

  // =============================================================================
  // CONTENT INTERACTION ENDPOINTS
  // =============================================================================

  /**
   * POST /api/lms-content/content-blocks/:contentBlockId/interact
   * Track content interaction
   */
  TRACK_CONTENT_INTERACTION: {
    method: "POST",
    path: "/api/lms-content/content-blocks/:contentBlockId/interact",
    params: z.object({
      contentBlockId: ContentBlockIdSchema,
    }),
    body: TrackContentInteractionRequestSchema.omit({ contentBlockId: true }),
    response: ContentInteractionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["interaction:track"],
  },

  /**
   * GET /api/lms-content/users/:userId/content-interactions
   * Get user's content interactions
   */
  GET_USER_CONTENT_INTERACTIONS: {
    method: "GET",
    path: "/api/lms-content/users/:userId/content-interactions",
    params: z.object({
      userId: z.string().min(1),
    }),
    query: ContentInteractionsQuerySchema.omit({ userId: true }),
    response: z.object({
      success: z.literal(true),
      data: z.array(ContentInteractionResponseSchema.shape.data),
      version: z.literal("1.0"),
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["interaction:read"],
  },

  // =============================================================================
  // TRANSLATION ENDPOINTS
  // =============================================================================

  /**
   * GET /api/lms-content/courses/:courseKey/translations/:languageCode
   * Get course translations
   */
  GET_COURSE_TRANSLATIONS: {
    method: "GET",
    path: "/api/lms-content/courses/:courseKey/translations/:languageCode",
    params: z.object({
      courseKey: z.string().min(1).max(100),
      languageCode: LanguageCodeSchema,
    }),
    response: z.object({
      success: z.literal(true),
      data: z.object({
        course: z.object({
          title: z.string(),
          description: z.string().optional(),
        }),
        sections: z.array(
          z.object({
            sectionKey: z.string(),
            title: z.string(),
          })
        ),
        contentBlocks: z.array(
          z.object({
            contentBlockId: ContentBlockIdSchema,
            content: z.record(z.string(), z.unknown()),
          })
        ),
        quizQuestions: z.array(
          z.object({
            quizQuestionId: QuizQuestionIdSchema,
            questionText: z.string(),
            options: z.record(z.string(), z.string()).optional(),
            explanation: z.string().optional(),
          })
        ),
      }),
      version: z.literal("1.0"),
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },
} as const;

// =============================================================================
// LMS CONTENT API ENDPOINT UTILITIES
// =============================================================================

/**
 * Extract endpoint method from endpoint definition
 */
export type LmsContentEndpointMethod<
  T extends keyof typeof LmsContentApiEndpoints,
> = (typeof LmsContentApiEndpoints)[T]["method"];

/**
 * Extract endpoint path from endpoint definition
 */
export type LmsContentEndpointPath<
  T extends keyof typeof LmsContentApiEndpoints,
> = (typeof LmsContentApiEndpoints)[T]["path"];

/**
 * Extract endpoint params from endpoint definition
 */
export type LmsContentEndpointParams<
  T extends keyof typeof LmsContentApiEndpoints,
> = "params" extends keyof (typeof LmsContentApiEndpoints)[T]
  ? z.infer<(typeof LmsContentApiEndpoints)[T]["params"]>
  : never;

/**
 * Extract endpoint query from endpoint definition
 */
export type LmsContentEndpointQuery<
  T extends keyof typeof LmsContentApiEndpoints,
> = "query" extends keyof (typeof LmsContentApiEndpoints)[T]
  ? z.infer<(typeof LmsContentApiEndpoints)[T]["query"]>
  : never;

/**
 * Extract endpoint body from endpoint definition
 */
export type LmsContentEndpointBody<
  T extends keyof typeof LmsContentApiEndpoints,
> = "body" extends keyof (typeof LmsContentApiEndpoints)[T]
  ? z.infer<(typeof LmsContentApiEndpoints)[T]["body"]>
  : never;

/**
 * Extract endpoint response from endpoint definition
 */
export type LmsContentEndpointResponse<
  T extends keyof typeof LmsContentApiEndpoints,
> = z.infer<(typeof LmsContentApiEndpoints)[T]["response"]>;

/**
 * Extract endpoint error from endpoint definition
 */
export type LmsContentEndpointError<
  T extends keyof typeof LmsContentApiEndpoints,
> = z.infer<(typeof LmsContentApiEndpoints)[T]["error"]>;

/**
 * Get all endpoint names
 */
export type LmsContentEndpointNames = keyof typeof LmsContentApiEndpoints;

/**
 * Get endpoints by method
 */
export type LmsContentEndpointsByMethod<M extends string> = {
  [K in LmsContentEndpointNames]: (typeof LmsContentApiEndpoints)[K]["method"] extends M
    ? K
    : never;
}[LmsContentEndpointNames];

/**
 * Get all GET endpoints
 */
export type LmsContentGetEndpoints = LmsContentEndpointsByMethod<"GET">;

/**
 * Get all POST endpoints
 */
export type LmsContentPostEndpoints = LmsContentEndpointsByMethod<"POST">;

/**
 * Get all PUT endpoints
 */
export type LmsContentPutEndpoints = LmsContentEndpointsByMethod<"PUT">;

/**
 * Get all DELETE endpoints
 */
export type LmsContentDeleteEndpoints = LmsContentEndpointsByMethod<"DELETE">;
