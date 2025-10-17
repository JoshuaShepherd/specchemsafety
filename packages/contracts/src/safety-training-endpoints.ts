// =============================================================================
// SAFETY TRAINING API ENDPOINT SPECIFICATIONS
// =============================================================================

/**
 * Comprehensive Safety Training API endpoint specifications with plant-scoped access,
 * role-based permissions, and integration with existing auth endpoints.
 */

import { z } from "zod";
import {
  PlantIdSchema,
  CourseIdSchema,
  EnrollmentIdSchema,
  ProgressIdSchema,
  AdminRoleIdSchema,
  UserIdSchema,
  CreatePlantRequestSchema,
  UpdatePlantRequestSchema,
  CreateCourseRequestSchema,
  UpdateCourseRequestSchema,
  CreateEnrollmentRequestSchema,
  UpdateEnrollmentRequestSchema,
  UpdateProgressRequestSchema,
  CreateActivityEventRequestSchema,
  CreateQuestionEventRequestSchema,
  CreateAdminRoleRequestSchema,
  UpdateAdminRoleRequestSchema,
  PlantScopedQuerySchema,
  UserScopedQuerySchema,
  CourseSearchQuerySchema,
  EnrollmentSearchQuerySchema,
  ProgressSearchQuerySchema,
  BulkEnrollmentRequestSchema,
  CourseMaterialUploadRequestSchema,
  PlantResponseSchema,
  CourseResponseSchema,
  EnrollmentResponseSchema,
  ProgressResponseSchema,
  ActivityEventResponseSchema,
  QuestionEventResponseSchema,
  AdminRoleResponseSchema,
  PaginatedPlantResponseSchema,
  PaginatedCourseResponseSchema,
  PaginatedEnrollmentResponseSchema,
  PaginatedProgressResponseSchema,
  PaginatedActivityEventResponseSchema,
  PaginatedQuestionEventResponseSchema,
  PaginatedAdminRoleResponseSchema,
  BulkEnrollmentResponseSchema,
  CourseMaterialUploadResponseSchema,
  SafetyTrainingErrorResponseSchema,
  SafetyTrainingUserContextSchema,
  PlantUserPermissionsSchema,
} from "./safety-training-contracts";

// =============================================================================
// API ENDPOINT DEFINITIONS
// =============================================================================

/**
 * Safety Training API endpoint specifications
 * All endpoints are prefixed with /api/safety-training to avoid conflicts with auth routes
 */

export const SafetyTrainingApiEndpoints = {
  // =============================================================================
  // PLANT MANAGEMENT ENDPOINTS
  // =============================================================================

  /**
   * GET /api/safety-training/plants
   * List all plants accessible to the user
   */
  LIST_PLANTS: {
    method: "GET",
    path: "/api/safety-training/plants",
    query: z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
      search: z.string().optional(),
    }),
    response: PaginatedPlantResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["plants:read"],
  },

  /**
   * GET /api/safety-training/plants/:plantId
   * Get specific plant details
   */
  GET_PLANT: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    response: PlantResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["plants:read"],
  },

  /**
   * POST /api/safety-training/plants
   * Create a new plant
   */
  CREATE_PLANT: {
    method: "POST",
    path: "/api/safety-training/plants",
    body: CreatePlantRequestSchema,
    response: PlantResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["plants:create"],
  },

  /**
   * PUT /api/safety-training/plants/:plantId
   * Update plant details
   */
  UPDATE_PLANT: {
    method: "PUT",
    path: "/api/safety-training/plants/:plantId",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    body: UpdatePlantRequestSchema,
    response: PlantResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["plants:update"],
  },

  /**
   * DELETE /api/safety-training/plants/:plantId
   * Delete a plant (soft delete)
   */
  DELETE_PLANT: {
    method: "DELETE",
    path: "/api/safety-training/plants/:plantId",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    response: z.object({
      success: z.literal(true),
      message: z.string(),
      version: z.literal("1.0"),
    }),
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["plants:delete"],
  },

  // =============================================================================
  // COURSE MANAGEMENT ENDPOINTS
  // =============================================================================

  /**
   * GET /api/safety-training/plants/:plantId/courses
   * List courses for a specific plant
   */
  LIST_COURSES: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/courses",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    query: CourseSearchQuerySchema.omit({ plantId: true }),
    response: PaginatedCourseResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },

  /**
   * GET /api/safety-training/plants/:plantId/courses/:courseId
   * Get specific course details
   */
  GET_COURSE: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/courses/:courseId",
    params: z.object({
      plantId: PlantIdSchema,
      courseId: CourseIdSchema,
    }),
    response: CourseResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"],
  },

  /**
   * POST /api/safety-training/plants/:plantId/courses
   * Create a new course
   */
  CREATE_COURSE: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/courses",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    body: CreateCourseRequestSchema,
    response: CourseResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:create"],
  },

  /**
   * PUT /api/safety-training/plants/:plantId/courses/:courseId
   * Update course details
   */
  UPDATE_COURSE: {
    method: "PUT",
    path: "/api/safety-training/plants/:plantId/courses/:courseId",
    params: z.object({
      plantId: PlantIdSchema,
      courseId: CourseIdSchema,
    }),
    body: UpdateCourseRequestSchema,
    response: CourseResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:update"],
  },

  /**
   * DELETE /api/safety-training/plants/:plantId/courses/:courseId
   * Delete a course (soft delete)
   */
  DELETE_COURSE: {
    method: "DELETE",
    path: "/api/safety-training/plants/:plantId/courses/:courseId",
    params: z.object({
      plantId: PlantIdSchema,
      courseId: CourseIdSchema,
    }),
    response: z.object({
      success: z.literal(true),
      message: z.string(),
      version: z.literal("1.0"),
    }),
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:delete"],
  },

  // =============================================================================
  // ENROLLMENT MANAGEMENT ENDPOINTS
  // =============================================================================

  /**
   * GET /api/safety-training/plants/:plantId/enrollments
   * List enrollments for a specific plant
   */
  LIST_ENROLLMENTS: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/enrollments",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    query: EnrollmentSearchQuerySchema.omit({ plantId: true }),
    response: PaginatedEnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:read"],
  },

  /**
   * GET /api/safety-training/plants/:plantId/enrollments/:enrollmentId
   * Get specific enrollment details
   */
  GET_ENROLLMENT: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/enrollments/:enrollmentId",
    params: z.object({
      plantId: PlantIdSchema,
      enrollmentId: EnrollmentIdSchema,
    }),
    response: EnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:read"],
  },

  /**
   * POST /api/safety-training/plants/:plantId/enrollments
   * Create a new enrollment
   */
  CREATE_ENROLLMENT: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/enrollments",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    body: CreateEnrollmentRequestSchema,
    response: EnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:create"],
  },

  /**
   * POST /api/safety-training/plants/:plantId/enrollments/bulk
   * Create multiple enrollments
   */
  CREATE_BULK_ENROLLMENTS: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/enrollments/bulk",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    body: BulkEnrollmentRequestSchema,
    response: BulkEnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:create"],
  },

  /**
   * PUT /api/safety-training/plants/:plantId/enrollments/:enrollmentId
   * Update enrollment details
   */
  UPDATE_ENROLLMENT: {
    method: "PUT",
    path: "/api/safety-training/plants/:plantId/enrollments/:enrollmentId",
    params: z.object({
      plantId: PlantIdSchema,
      enrollmentId: EnrollmentIdSchema,
    }),
    body: UpdateEnrollmentRequestSchema,
    response: EnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:update"],
  },

  /**
   * DELETE /api/safety-training/plants/:plantId/enrollments/:enrollmentId
   * Cancel an enrollment
   */
  DELETE_ENROLLMENT: {
    method: "DELETE",
    path: "/api/safety-training/plants/:plantId/enrollments/:enrollmentId",
    params: z.object({
      plantId: PlantIdSchema,
      enrollmentId: EnrollmentIdSchema,
    }),
    response: z.object({
      success: z.literal(true),
      message: z.string(),
      version: z.literal("1.0"),
    }),
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:delete"],
  },

  // =============================================================================
  // PROGRESS TRACKING ENDPOINTS
  // =============================================================================

  /**
   * GET /api/safety-training/plants/:plantId/progress
   * List progress records for a specific plant
   */
  LIST_PROGRESS: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/progress",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    query: ProgressSearchQuerySchema.omit({ plantId: true }),
    response: PaginatedProgressResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["progress:read"],
  },

  /**
   * GET /api/safety-training/plants/:plantId/progress/:progressId
   * Get specific progress details
   */
  GET_PROGRESS: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/progress/:progressId",
    params: z.object({
      plantId: PlantIdSchema,
      progressId: ProgressIdSchema,
    }),
    response: ProgressResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["progress:read"],
  },

  /**
   * PUT /api/safety-training/plants/:plantId/progress/:progressId
   * Update progress details
   */
  UPDATE_PROGRESS: {
    method: "PUT",
    path: "/api/safety-training/plants/:plantId/progress/:progressId",
    params: z.object({
      plantId: PlantIdSchema,
      progressId: ProgressIdSchema,
    }),
    body: UpdateProgressRequestSchema,
    response: ProgressResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["progress:update"],
  },

  // =============================================================================
  // ACTIVITY TRACKING ENDPOINTS
  // =============================================================================

  /**
   * GET /api/safety-training/plants/:plantId/activity-events
   * List activity events for a specific plant
   */
  LIST_ACTIVITY_EVENTS: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/activity-events",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    query: PlantScopedQuerySchema.omit({ plantId: true }).extend({
      userId: UserIdSchema.optional(),
      courseId: CourseIdSchema.optional(),
      eventType: z.string().optional(),
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
    }),
    response: PaginatedActivityEventResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["activity:read"],
  },

  /**
   * POST /api/safety-training/plants/:plantId/activity-events
   * Create a new activity event
   */
  CREATE_ACTIVITY_EVENT: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/activity-events",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    body: CreateActivityEventRequestSchema,
    response: ActivityEventResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["activity:create"],
  },

  /**
   * GET /api/safety-training/plants/:plantId/question-events
   * List question events for a specific plant
   */
  LIST_QUESTION_EVENTS: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/question-events",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    query: PlantScopedQuerySchema.omit({ plantId: true }).extend({
      userId: UserIdSchema.optional(),
      courseId: CourseIdSchema.optional(),
      sectionKey: z.string().optional(),
      questionKey: z.string().optional(),
      isCorrect: z.boolean().optional(),
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
    }),
    response: PaginatedQuestionEventResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["activity:read"],
  },

  /**
   * POST /api/safety-training/plants/:plantId/question-events
   * Create a new question event
   */
  CREATE_QUESTION_EVENT: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/question-events",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    body: CreateQuestionEventRequestSchema,
    response: QuestionEventResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["activity:create"],
  },

  // =============================================================================
  // ADMIN ROLE MANAGEMENT ENDPOINTS
  // =============================================================================

  /**
   * GET /api/safety-training/plants/:plantId/admin-roles
   * List admin roles for a specific plant
   */
  LIST_ADMIN_ROLES: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/admin-roles",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    query: PlantScopedQuerySchema.omit({ plantId: true }).extend({
      userId: UserIdSchema.optional(),
      roleType: z.string().optional(),
    }),
    response: PaginatedAdminRoleResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["admin_roles:read"],
  },

  /**
   * GET /api/safety-training/plants/:plantId/admin-roles/:adminRoleId
   * Get specific admin role details
   */
  GET_ADMIN_ROLE: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/admin-roles/:adminRoleId",
    params: z.object({
      plantId: PlantIdSchema,
      adminRoleId: AdminRoleIdSchema,
    }),
    response: AdminRoleResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["admin_roles:read"],
  },

  /**
   * POST /api/safety-training/plants/:plantId/admin-roles
   * Create a new admin role
   */
  CREATE_ADMIN_ROLE: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/admin-roles",
    params: z.object({
      plantId: PlantIdSchema,
    }),
    body: CreateAdminRoleRequestSchema,
    response: AdminRoleResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["admin_roles:create"],
  },

  /**
   * PUT /api/safety-training/plants/:plantId/admin-roles/:adminRoleId
   * Update admin role details
   */
  UPDATE_ADMIN_ROLE: {
    method: "PUT",
    path: "/api/safety-training/plants/:plantId/admin-roles/:adminRoleId",
    params: z.object({
      plantId: PlantIdSchema,
      adminRoleId: AdminRoleIdSchema,
    }),
    body: UpdateAdminRoleRequestSchema,
    response: AdminRoleResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["admin_roles:update"],
  },

  /**
   * DELETE /api/safety-training/plants/:plantId/admin-roles/:adminRoleId
   * Remove an admin role
   */
  DELETE_ADMIN_ROLE: {
    method: "DELETE",
    path: "/api/safety-training/plants/:plantId/admin-roles/:adminRoleId",
    params: z.object({
      plantId: PlantIdSchema,
      adminRoleId: AdminRoleIdSchema,
    }),
    response: z.object({
      success: z.literal(true),
      message: z.string(),
      version: z.literal("1.0"),
    }),
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["admin_roles:delete"],
  },

  // =============================================================================
  // USER-SPECIFIC ENDPOINTS
  // =============================================================================

  /**
   * GET /api/safety-training/users/:userId/enrollments
   * List enrollments for a specific user
   */
  LIST_USER_ENROLLMENTS: {
    method: "GET",
    path: "/api/safety-training/users/:userId/enrollments",
    params: z.object({
      userId: UserIdSchema,
    }),
    query: UserScopedQuerySchema.omit({ userId: true }),
    response: PaginatedEnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:read"],
  },

  /**
   * GET /api/safety-training/users/:userId/progress
   * List progress records for a specific user
   */
  LIST_USER_PROGRESS: {
    method: "GET",
    path: "/api/safety-training/users/:userId/progress",
    params: z.object({
      userId: UserIdSchema,
    }),
    query: UserScopedQuerySchema.omit({ userId: true }),
    response: PaginatedProgressResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["progress:read"],
  },

  /**
   * GET /api/safety-training/users/:userId/activity-events
   * List activity events for a specific user
   */
  LIST_USER_ACTIVITY_EVENTS: {
    method: "GET",
    path: "/api/safety-training/users/:userId/activity-events",
    params: z.object({
      userId: UserIdSchema,
    }),
    query: UserScopedQuerySchema.omit({ userId: true }),
    response: PaginatedActivityEventResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["activity:read"],
  },

  // =============================================================================
  // INTEGRATION ENDPOINTS
  // =============================================================================

  /**
   * GET /api/safety-training/auth/context
   * Get combined auth + safety training user context
   */
  GET_AUTH_CONTEXT: {
    method: "GET",
    path: "/api/safety-training/auth/context",
    response: SafetyTrainingUserContextSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: [],
  },

  /**
   * GET /api/safety-training/plants/:plantId/users/:userId/permissions
   * Get user permissions for a specific plant
   */
  GET_USER_PERMISSIONS: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/users/:userId/permissions",
    params: z.object({
      plantId: PlantIdSchema,
      userId: UserIdSchema,
    }),
    response: z.object({
      success: z.literal(true),
      data: PlantUserPermissionsSchema,
      version: z.literal("1.0"),
    }),
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["users:read"],
  },

  // =============================================================================
  // FILE UPLOAD ENDPOINTS
  // =============================================================================

  /**
   * POST /api/safety-training/plants/:plantId/courses/:courseId/materials
   * Upload course material
   */
  UPLOAD_COURSE_MATERIAL: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/courses/:courseId/materials",
    params: z.object({
      plantId: PlantIdSchema,
      courseId: CourseIdSchema,
    }),
    body: CourseMaterialUploadRequestSchema,
    response: CourseMaterialUploadResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:update"],
  },
} as const;

// =============================================================================
// API ENDPOINT UTILITIES
// =============================================================================

/**
 * Extract endpoint method from endpoint definition
 */
export type EndpointMethod<T extends keyof typeof SafetyTrainingApiEndpoints> =
  (typeof SafetyTrainingApiEndpoints)[T]["method"];

/**
 * Extract endpoint path from endpoint definition
 */
export type EndpointPath<T extends keyof typeof SafetyTrainingApiEndpoints> =
  (typeof SafetyTrainingApiEndpoints)[T]["path"];

/**
 * Extract endpoint params from endpoint definition
 */
export type EndpointParams<T extends keyof typeof SafetyTrainingApiEndpoints> =
  "params" extends keyof (typeof SafetyTrainingApiEndpoints)[T]
    ? z.infer<(typeof SafetyTrainingApiEndpoints)[T]["params"]>
    : never;

/**
 * Extract endpoint query from endpoint definition
 */
export type EndpointQuery<T extends keyof typeof SafetyTrainingApiEndpoints> =
  "query" extends keyof (typeof SafetyTrainingApiEndpoints)[T]
    ? z.infer<(typeof SafetyTrainingApiEndpoints)[T]["query"]>
    : never;

/**
 * Extract endpoint body from endpoint definition
 */
export type EndpointBody<T extends keyof typeof SafetyTrainingApiEndpoints> =
  "body" extends keyof (typeof SafetyTrainingApiEndpoints)[T]
    ? z.infer<(typeof SafetyTrainingApiEndpoints)[T]["body"]>
    : never;

/**
 * Extract endpoint response from endpoint definition
 */
export type EndpointResponse<
  T extends keyof typeof SafetyTrainingApiEndpoints,
> = z.infer<(typeof SafetyTrainingApiEndpoints)[T]["response"]>;

/**
 * Extract endpoint error from endpoint definition
 */
export type EndpointError<T extends keyof typeof SafetyTrainingApiEndpoints> =
  z.infer<(typeof SafetyTrainingApiEndpoints)[T]["error"]>;

/**
 * Get all endpoint names
 */
export type SafetyTrainingEndpointNames =
  keyof typeof SafetyTrainingApiEndpoints;

/**
 * Get endpoints by method
 */
export type EndpointsByMethod<M extends string> = {
  [K in SafetyTrainingEndpointNames]: (typeof SafetyTrainingApiEndpoints)[K]["method"] extends M
    ? K
    : never;
}[SafetyTrainingEndpointNames];

/**
 * Get all GET endpoints
 */
export type GetEndpoints = EndpointsByMethod<"GET">;

/**
 * Get all POST endpoints
 */
export type PostEndpoints = EndpointsByMethod<"POST">;

/**
 * Get all PUT endpoints
 */
export type PutEndpoints = EndpointsByMethod<"PUT">;

/**
 * Get all DELETE endpoints
 */
export type DeleteEndpoints = EndpointsByMethod<"DELETE">;
