// =============================================================================
// SAFETY TRAINING API CONTRACTS
// =============================================================================

/**
 * Comprehensive Safety Training API contracts that integrate with existing auth endpoints
 * while maintaining clear separation and plant-scoped data access.
 */

import { z } from "zod";

// =============================================================================
// SAFETY TRAINING BRANDED TYPES
// =============================================================================

/**
 * Safety Training branded types for type safety
 */
export const SafetyTrainingIdSchema = z
  .string()
  .uuid()
  .brand<"SafetyTrainingId">();
export type SafetyTrainingId = z.infer<typeof SafetyTrainingIdSchema>;

export const CourseIdSchema = z.string().uuid().brand<"CourseId">();
export type CourseId = z.infer<typeof CourseIdSchema>;

export const EnrollmentIdSchema = z.string().uuid().brand<"EnrollmentId">();
export type EnrollmentId = z.infer<typeof EnrollmentIdSchema>;

export const ProgressIdSchema = z.string().uuid().brand<"ProgressId">();
export type ProgressId = z.infer<typeof ProgressIdSchema>;

export const ActivityEventIdSchema = z
  .string()
  .uuid()
  .brand<"ActivityEventId">();
export type ActivityEventId = z.infer<typeof ActivityEventIdSchema>;

export const QuestionEventIdSchema = z
  .string()
  .uuid()
  .brand<"QuestionEventId">();
export type QuestionEventId = z.infer<typeof QuestionEventIdSchema>;

export const AdminRoleIdSchema = z.string().uuid().brand<"AdminRoleId">();
export type AdminRoleId = z.infer<typeof AdminRoleIdSchema>;

export const PlantIdSchema = z.string().uuid().brand<"PlantId">();
export type PlantId = z.infer<typeof PlantIdSchema>;

export const UserIdSchema = z.string().uuid().brand<"UserId">();
export type UserId = z.infer<typeof UserIdSchema>;

// =============================================================================
// SAFETY TRAINING ENUM SCHEMAS
// =============================================================================

/**
 * Course status enum
 */
export const CourseStatusSchema = z.enum([
  "draft",
  "active",
  "inactive",
  "archived",
]);
export type CourseStatus = z.infer<typeof CourseStatusSchema>;

/**
 * Course type enum
 */
export const CourseTypeSchema = z.enum([
  "safety_orientation",
  "hazard_communication",
  "emergency_response",
  "equipment_operation",
  "compliance_training",
  "certification",
  "refresher",
  "custom",
]);
export type CourseType = z.infer<typeof CourseTypeSchema>;

/**
 * Enrollment status enum
 */
export const EnrollmentStatusSchema = z.enum([
  "enrolled",
  "in_progress",
  "completed",
  "failed",
  "expired",
  "cancelled",
]);
export type EnrollmentStatus = z.infer<typeof EnrollmentStatusSchema>;

/**
 * Progress status enum
 */
export const ProgressStatusSchema = z.enum([
  "not_started",
  "in_progress",
  "completed",
  "paused",
  "failed",
]);
export type ProgressStatus = z.infer<typeof ProgressStatusSchema>;

/**
 * Activity event type enum
 */
export const ActivityEventTypeSchema = z.enum([
  "course_started",
  "course_completed",
  "section_started",
  "section_completed",
  "quiz_started",
  "quiz_completed",
  "video_watched",
  "document_viewed",
  "certificate_earned",
  "enrollment_created",
  "enrollment_cancelled",
]);
export type ActivityEventType = z.infer<typeof ActivityEventTypeSchema>;

/**
 * Admin role type enum
 */
export const AdminRoleTypeSchema = z.enum([
  "plant_admin",
  "course_admin",
  "instructor",
  "supervisor",
  "compliance_officer",
]);
export type AdminRoleType = z.infer<typeof AdminRoleTypeSchema>;

// =============================================================================
// SAFETY TRAINING ENTITY SCHEMAS
// =============================================================================

/**
 * Plant entity schema
 */
export const PlantSchema = z
  .object({
    id: PlantIdSchema,
    name: z.string().min(1).max(100),
    code: z.string().min(1).max(20).optional(),
    description: z.string().max(500).optional(),
    location: z.string().max(200).optional(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Plant = z.infer<typeof PlantSchema>;

/**
 * Course entity schema
 */
export const CourseSchema = z
  .object({
    id: CourseIdSchema,
    plantId: PlantIdSchema,
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    type: CourseTypeSchema,
    status: CourseStatusSchema,
    duration: z.number().int().min(1), // in minutes
    prerequisites: z.array(CourseIdSchema).default([]),
    learningObjectives: z.array(z.string()).default([]),
    materials: z
      .array(
        z.object({
          type: z.enum(["video", "document", "quiz", "interactive", "other"]),
          url: z.string().url().optional(),
          title: z.string(),
          description: z.string().optional(),
        })
      )
      .default([]),
    passingScore: z.number().min(0).max(100).default(80),
    certificateValidDays: z.number().int().min(1).optional(),
    isRequired: z.boolean().default(false),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    createdBy: UserIdSchema,
  })
  .strict();

export type Course = z.infer<typeof CourseSchema>;

/**
 * Enrollment entity schema
 */
export const EnrollmentSchema = z
  .object({
    id: EnrollmentIdSchema,
    courseId: CourseIdSchema,
    plantId: PlantIdSchema,
    userId: UserIdSchema,
    status: EnrollmentStatusSchema,
    enrolledAt: z.string().datetime(),
    startedAt: z.string().datetime().optional(),
    completedAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
    assignedBy: UserIdSchema.optional(),
    notes: z.string().max(1000).optional(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Enrollment = z.infer<typeof EnrollmentSchema>;

/**
 * Progress entity schema
 */
export const ProgressSchema = z
  .object({
    id: ProgressIdSchema,
    enrollmentId: EnrollmentIdSchema,
    courseId: CourseIdSchema,
    plantId: PlantIdSchema,
    userId: UserIdSchema,
    status: ProgressStatusSchema,
    progressPercent: z.number().min(0).max(100).default(0),
    currentSection: z.string().optional(),
    timeSpent: z.number().int().min(0).default(0), // in minutes
    lastAccessedAt: z.string().datetime().optional(),
    completedSections: z.array(z.string()).default([]),
    quizScores: z
      .array(
        z.object({
          sectionKey: z.string(),
          score: z.number().min(0).max(100),
          attempts: z.number().int().min(1),
          completedAt: z.string().datetime(),
        })
      )
      .default([]),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type Progress = z.infer<typeof ProgressSchema>;

/**
 * Activity event entity schema
 */
export const ActivityEventSchema = z
  .object({
    id: ActivityEventIdSchema,
    enrollmentId: EnrollmentIdSchema,
    courseId: CourseIdSchema,
    plantId: PlantIdSchema,
    userId: UserIdSchema,
    eventType: ActivityEventTypeSchema,
    sectionKey: z.string().optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
    occurredAt: z.string().datetime(),
    createdAt: z.string().datetime(),
  })
  .strict();

export type ActivityEvent = z.infer<typeof ActivityEventSchema>;

/**
 * Question event entity schema
 */
export const QuestionEventSchema = z
  .object({
    id: QuestionEventIdSchema,
    enrollmentId: EnrollmentIdSchema,
    courseId: CourseIdSchema,
    plantId: PlantIdSchema,
    userId: UserIdSchema,
    sectionKey: z.string(),
    questionKey: z.string(),
    isCorrect: z.boolean(),
    attemptIndex: z.number().int().min(1).default(1),
    responseMeta: z.record(z.string(), z.unknown()).optional(),
    answeredAt: z.string().datetime(),
    createdAt: z.string().datetime(),
  })
  .strict();

export type QuestionEvent = z.infer<typeof QuestionEventSchema>;

/**
 * Admin role entity schema
 */
export const AdminRoleSchema = z
  .object({
    id: AdminRoleIdSchema,
    plantId: PlantIdSchema,
    userId: UserIdSchema,
    roleType: AdminRoleTypeSchema,
    permissions: z.array(z.string()).default([]),
    isActive: z.boolean(),
    assignedAt: z.string().datetime(),
    assignedBy: UserIdSchema,
    expiresAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type AdminRole = z.infer<typeof AdminRoleSchema>;

// =============================================================================
// SAFETY TRAINING REQUEST SCHEMAS
// =============================================================================

/**
 * Create plant request schema
 */
export const CreatePlantRequestSchema = z
  .object({
    name: z.string().min(1).max(100),
    code: z.string().min(1).max(20).optional(),
    description: z.string().max(500).optional(),
    location: z.string().max(200).optional(),
  })
  .strict();

export type CreatePlantRequest = z.infer<typeof CreatePlantRequestSchema>;

/**
 * Update plant request schema
 */
export const UpdatePlantRequestSchema =
  CreatePlantRequestSchema.partial().strict();

export type UpdatePlantRequest = z.infer<typeof UpdatePlantRequestSchema>;

/**
 * Create course request schema
 */
export const CreateCourseRequestSchema = z
  .object({
    plantId: PlantIdSchema,
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    type: CourseTypeSchema,
    duration: z.number().int().min(1),
    prerequisites: z.array(CourseIdSchema).default([]),
    learningObjectives: z.array(z.string()).default([]),
    materials: z
      .array(
        z.object({
          type: z.enum(["video", "document", "quiz", "interactive", "other"]),
          url: z.string().url().optional(),
          title: z.string(),
          description: z.string().optional(),
        })
      )
      .default([]),
    passingScore: z.number().min(0).max(100).default(80),
    certificateValidDays: z.number().int().min(1).optional(),
    isRequired: z.boolean().default(false),
  })
  .strict();

export type CreateCourseRequest = z.infer<typeof CreateCourseRequestSchema>;

/**
 * Update course request schema
 */
export const UpdateCourseRequestSchema =
  CreateCourseRequestSchema.partial().strict();

export type UpdateCourseRequest = z.infer<typeof UpdateCourseRequestSchema>;

/**
 * Create enrollment request schema
 */
export const CreateEnrollmentRequestSchema = z
  .object({
    courseId: CourseIdSchema,
    plantId: PlantIdSchema,
    userId: UserIdSchema,
    expiresAt: z.string().datetime().optional(),
    assignedBy: UserIdSchema.optional(),
    notes: z.string().max(1000).optional(),
  })
  .strict();

export type CreateEnrollmentRequest = z.infer<
  typeof CreateEnrollmentRequestSchema
>;

/**
 * Update enrollment request schema
 */
export const UpdateEnrollmentRequestSchema =
  CreateEnrollmentRequestSchema.partial().strict();

export type UpdateEnrollmentRequest = z.infer<
  typeof UpdateEnrollmentRequestSchema
>;

/**
 * Update progress request schema
 */
export const UpdateProgressRequestSchema = z
  .object({
    enrollmentId: EnrollmentIdSchema,
    courseId: CourseIdSchema,
    plantId: PlantIdSchema,
    status: ProgressStatusSchema.optional(),
    progressPercent: z.number().min(0).max(100).optional(),
    currentSection: z.string().optional(),
    timeSpent: z.number().int().min(0).optional(),
    completedSections: z.array(z.string()).optional(),
    quizScore: z
      .object({
        sectionKey: z.string(),
        score: z.number().min(0).max(100),
        attempts: z.number().int().min(1),
      })
      .optional(),
  })
  .strict();

export type UpdateProgressRequest = z.infer<typeof UpdateProgressRequestSchema>;

/**
 * Create activity event request schema
 */
export const CreateActivityEventRequestSchema = z
  .object({
    enrollmentId: EnrollmentIdSchema,
    courseId: CourseIdSchema,
    plantId: PlantIdSchema,
    eventType: ActivityEventTypeSchema,
    sectionKey: z.string().optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type CreateActivityEventRequest = z.infer<
  typeof CreateActivityEventRequestSchema
>;

/**
 * Create question event request schema
 */
export const CreateQuestionEventRequestSchema = z
  .object({
    enrollmentId: EnrollmentIdSchema,
    courseId: CourseIdSchema,
    plantId: PlantIdSchema,
    sectionKey: z.string(),
    questionKey: z.string(),
    isCorrect: z.boolean(),
    attemptIndex: z.number().int().min(1).default(1),
    responseMeta: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type CreateQuestionEventRequest = z.infer<
  typeof CreateQuestionEventRequestSchema
>;

/**
 * Create admin role request schema
 */
export const CreateAdminRoleRequestSchema = z
  .object({
    plantId: PlantIdSchema,
    userId: UserIdSchema,
    roleType: AdminRoleTypeSchema,
    permissions: z.array(z.string()).default([]),
    expiresAt: z.string().datetime().optional(),
    assignedBy: UserIdSchema,
  })
  .strict();

export type CreateAdminRoleRequest = z.infer<
  typeof CreateAdminRoleRequestSchema
>;

/**
 * Update admin role request schema
 */
export const UpdateAdminRoleRequestSchema =
  CreateAdminRoleRequestSchema.partial().strict();

export type UpdateAdminRoleRequest = z.infer<
  typeof UpdateAdminRoleRequestSchema
>;

// =============================================================================
// SAFETY TRAINING QUERY SCHEMAS
// =============================================================================

/**
 * Plant-scoped query schema
 */
export const PlantScopedQuerySchema = z
  .object({
    plantId: PlantIdSchema,
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();

export type PlantScopedQuery = z.infer<typeof PlantScopedQuerySchema>;

/**
 * User-scoped query schema
 */
export const UserScopedQuerySchema = z
  .object({
    userId: UserIdSchema,
    plantId: PlantIdSchema.optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();

export type UserScopedQuery = z.infer<typeof UserScopedQuerySchema>;

/**
 * Course search query schema
 */
export const CourseSearchQuerySchema = z
  .object({
    plantId: PlantIdSchema,
    query: z.string().min(1).max(200).optional(),
    type: CourseTypeSchema.optional(),
    status: CourseStatusSchema.optional(),
    isRequired: z.boolean().optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();

export type CourseSearchQuery = z.infer<typeof CourseSearchQuerySchema>;

/**
 * Enrollment search query schema
 */
export const EnrollmentSearchQuerySchema = z
  .object({
    plantId: PlantIdSchema,
    userId: UserIdSchema.optional(),
    courseId: CourseIdSchema.optional(),
    status: EnrollmentStatusSchema.optional(),
    query: z.string().min(1).max(200).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();

export type EnrollmentSearchQuery = z.infer<typeof EnrollmentSearchQuerySchema>;

/**
 * Progress search query schema
 */
export const ProgressSearchQuerySchema = z
  .object({
    plantId: PlantIdSchema,
    userId: UserIdSchema.optional(),
    courseId: CourseIdSchema.optional(),
    status: ProgressStatusSchema.optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();

export type ProgressSearchQuery = z.infer<typeof ProgressSearchQuerySchema>;

// =============================================================================
// SAFETY TRAINING RESPONSE SCHEMAS
// =============================================================================

/**
 * Plant response schema
 */
export const PlantResponseSchema = z
  .object({
    success: z.literal(true),
    data: PlantSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type PlantResponse = z.infer<typeof PlantResponseSchema>;

/**
 * Course response schema
 */
export const CourseResponseSchema = z
  .object({
    success: z.literal(true),
    data: CourseSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type CourseResponse = z.infer<typeof CourseResponseSchema>;

/**
 * Enrollment response schema
 */
export const EnrollmentResponseSchema = z
  .object({
    success: z.literal(true),
    data: EnrollmentSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type EnrollmentResponse = z.infer<typeof EnrollmentResponseSchema>;

/**
 * Progress response schema
 */
export const ProgressResponseSchema = z
  .object({
    success: z.literal(true),
    data: ProgressSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type ProgressResponse = z.infer<typeof ProgressResponseSchema>;

/**
 * Activity event response schema
 */
export const ActivityEventResponseSchema = z
  .object({
    success: z.literal(true),
    data: ActivityEventSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type ActivityEventResponse = z.infer<typeof ActivityEventResponseSchema>;

/**
 * Question event response schema
 */
export const QuestionEventResponseSchema = z
  .object({
    success: z.literal(true),
    data: QuestionEventSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type QuestionEventResponse = z.infer<typeof QuestionEventResponseSchema>;

/**
 * Admin role response schema
 */
export const AdminRoleResponseSchema = z
  .object({
    success: z.literal(true),
    data: AdminRoleSchema,
    version: z.literal("1.0"),
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type AdminRoleResponse = z.infer<typeof AdminRoleResponseSchema>;

// =============================================================================
// SAFETY TRAINING PAGINATED RESPONSE SCHEMAS
// =============================================================================

/**
 * Paginated response schema factory
 */
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z
    .object({
      success: z.literal(true),
      data: z.array(dataSchema),
      pagination: z.object({
        page: z.number().int().min(1),
        limit: z.number().int().min(1).max(100),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
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

/**
 * Paginated plant response schema
 */
export const PaginatedPlantResponseSchema =
  createPaginatedResponseSchema(PlantSchema);
export type PaginatedPlantResponse = z.infer<
  typeof PaginatedPlantResponseSchema
>;

/**
 * Paginated course response schema
 */
export const PaginatedCourseResponseSchema =
  createPaginatedResponseSchema(CourseSchema);
export type PaginatedCourseResponse = z.infer<
  typeof PaginatedCourseResponseSchema
>;

/**
 * Paginated enrollment response schema
 */
export const PaginatedEnrollmentResponseSchema =
  createPaginatedResponseSchema(EnrollmentSchema);
export type PaginatedEnrollmentResponse = z.infer<
  typeof PaginatedEnrollmentResponseSchema
>;

/**
 * Paginated progress response schema
 */
export const PaginatedProgressResponseSchema =
  createPaginatedResponseSchema(ProgressSchema);
export type PaginatedProgressResponse = z.infer<
  typeof PaginatedProgressResponseSchema
>;

/**
 * Paginated activity event response schema
 */
export const PaginatedActivityEventResponseSchema =
  createPaginatedResponseSchema(ActivityEventSchema);
export type PaginatedActivityEventResponse = z.infer<
  typeof PaginatedActivityEventResponseSchema
>;

/**
 * Paginated question event response schema
 */
export const PaginatedQuestionEventResponseSchema =
  createPaginatedResponseSchema(QuestionEventSchema);
export type PaginatedQuestionEventResponse = z.infer<
  typeof PaginatedQuestionEventResponseSchema
>;

/**
 * Paginated admin role response schema
 */
export const PaginatedAdminRoleResponseSchema =
  createPaginatedResponseSchema(AdminRoleSchema);
export type PaginatedAdminRoleResponse = z.infer<
  typeof PaginatedAdminRoleResponseSchema
>;

// =============================================================================
// SAFETY TRAINING ERROR RESPONSE SCHEMAS
// =============================================================================

/**
 * Safety training error codes
 */
export const SafetyTrainingErrorCodeSchema = z.enum([
  "PLANT_NOT_FOUND",
  "PLANT_ACCESS_DENIED",
  "COURSE_NOT_FOUND",
  "COURSE_ACCESS_DENIED",
  "ENROLLMENT_NOT_FOUND",
  "ENROLLMENT_ALREADY_EXISTS",
  "ENROLLMENT_EXPIRED",
  "PROGRESS_NOT_FOUND",
  "PROGRESS_ACCESS_DENIED",
  "ACTIVITY_EVENT_NOT_FOUND",
  "QUESTION_EVENT_NOT_FOUND",
  "ADMIN_ROLE_NOT_FOUND",
  "ADMIN_ROLE_ACCESS_DENIED",
  "USER_NOT_AUTHORIZED",
  "PLANT_MISMATCH",
  "INVALID_PROGRESS_UPDATE",
  "COURSE_COMPLETION_FAILED",
  "CERTIFICATE_GENERATION_FAILED",
  "VALIDATION_ERROR",
  "BUSINESS_ERROR",
  "SYSTEM_ERROR",
]);

export type SafetyTrainingErrorCode = z.infer<
  typeof SafetyTrainingErrorCodeSchema
>;

/**
 * Safety training error response schema
 */
export const SafetyTrainingErrorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: SafetyTrainingErrorCodeSchema,
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
      plantId: PlantIdSchema.optional(),
      userId: UserIdSchema.optional(),
    }),
    version: z.literal("1.0"),
  })
  .strict();

export type SafetyTrainingErrorResponse = z.infer<
  typeof SafetyTrainingErrorResponseSchema
>;

// =============================================================================
// SAFETY TRAINING INTEGRATION SCHEMAS
// =============================================================================

/**
 * Combined auth + safety training user context schema
 */
export const SafetyTrainingUserContextSchema = z
  .object({
    user: z.object({
      id: UserIdSchema,
      authUserId: z.string().uuid(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      role: z.string(),
      territoryId: z.string().uuid().optional(),
    }),
    plantAccess: z.array(
      z.object({
        plantId: PlantIdSchema,
        plantName: z.string(),
        permissions: z.array(z.string()),
        adminRoles: z.array(AdminRoleTypeSchema),
      })
    ),
    session: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
      expiresAt: z.string().datetime(),
    }),
  })
  .strict();

export type SafetyTrainingUserContext = z.infer<
  typeof SafetyTrainingUserContextSchema
>;

/**
 * Plant-scoped user permissions schema
 */
export const PlantUserPermissionsSchema = z
  .object({
    userId: UserIdSchema,
    plantId: PlantIdSchema,
    canViewCourses: z.boolean(),
    canCreateCourses: z.boolean(),
    canEditCourses: z.boolean(),
    canDeleteCourses: z.boolean(),
    canViewEnrollments: z.boolean(),
    canCreateEnrollments: z.boolean(),
    canEditEnrollments: z.boolean(),
    canViewProgress: z.boolean(),
    canEditProgress: z.boolean(),
    canViewReports: z.boolean(),
    canManageUsers: z.boolean(),
    adminRoles: z.array(AdminRoleTypeSchema),
  })
  .strict();

export type PlantUserPermissions = z.infer<typeof PlantUserPermissionsSchema>;

// =============================================================================
// SAFETY TRAINING BULK OPERATION SCHEMAS
// =============================================================================

/**
 * Bulk enrollment creation request schema
 */
export const BulkEnrollmentRequestSchema = z
  .object({
    plantId: PlantIdSchema,
    courseId: CourseIdSchema,
    userIds: z.array(UserIdSchema).min(1).max(100),
    expiresAt: z.string().datetime().optional(),
    assignedBy: UserIdSchema.optional(),
    notes: z.string().max(1000).optional(),
  })
  .strict();

export type BulkEnrollmentRequest = z.infer<typeof BulkEnrollmentRequestSchema>;

/**
 * Bulk enrollment response schema
 */
export const BulkEnrollmentResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.object({
      created: z.array(EnrollmentSchema),
      failed: z.array(
        z.object({
          userId: UserIdSchema,
          error: z.string(),
        })
      ),
      total: z.number().int(),
      successCount: z.number().int(),
      failureCount: z.number().int(),
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

export type BulkEnrollmentResponse = z.infer<
  typeof BulkEnrollmentResponseSchema
>;

// =============================================================================
// SAFETY TRAINING FILE UPLOAD SCHEMAS
// =============================================================================

/**
 * Course material upload request schema
 */
export const CourseMaterialUploadRequestSchema = z
  .object({
    courseId: CourseIdSchema,
    plantId: PlantIdSchema,
    materialType: z.enum(["video", "document", "interactive", "other"]),
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    file: z.instanceof(File).optional(),
    url: z.string().url().optional(),
  })
  .strict();

export type CourseMaterialUploadRequest = z.infer<
  typeof CourseMaterialUploadRequestSchema
>;

/**
 * Course material upload response schema
 */
export const CourseMaterialUploadResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.object({
      materialId: z.string().uuid(),
      courseId: CourseIdSchema,
      materialType: z.string(),
      title: z.string(),
      url: z.string().url().optional(),
      fileSize: z.number().int().optional(),
      uploadedAt: z.string().datetime(),
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

export type CourseMaterialUploadResponse = z.infer<
  typeof CourseMaterialUploadResponseSchema
>;
