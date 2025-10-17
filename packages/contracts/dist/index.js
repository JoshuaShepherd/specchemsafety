// src/safety-training-contracts.ts
import { z } from "zod";
var SafetyTrainingIdSchema = z.string().uuid().brand();
var CourseIdSchema = z.string().uuid().brand();
var EnrollmentIdSchema = z.string().uuid().brand();
var ProgressIdSchema = z.string().uuid().brand();
var ActivityEventIdSchema = z.string().uuid().brand();
var QuestionEventIdSchema = z.string().uuid().brand();
var AdminRoleIdSchema = z.string().uuid().brand();
var PlantIdSchema = z.string().uuid().brand();
var UserIdSchema = z.string().uuid().brand();
var CourseStatusSchema = z.enum([
  "draft",
  "active",
  "inactive",
  "archived"
]);
var CourseTypeSchema = z.enum([
  "safety_orientation",
  "hazard_communication",
  "emergency_response",
  "equipment_operation",
  "compliance_training",
  "certification",
  "refresher",
  "custom"
]);
var EnrollmentStatusSchema = z.enum([
  "enrolled",
  "in_progress",
  "completed",
  "failed",
  "expired",
  "cancelled"
]);
var ProgressStatusSchema = z.enum([
  "not_started",
  "in_progress",
  "completed",
  "paused",
  "failed"
]);
var ActivityEventTypeSchema = z.enum([
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
  "enrollment_cancelled"
]);
var AdminRoleTypeSchema = z.enum([
  "plant_admin",
  "course_admin",
  "instructor",
  "supervisor",
  "compliance_officer"
]);
var PlantSchema = z.object({
  id: PlantIdSchema,
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(20).optional(),
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}).strict();
var CourseSchema = z.object({
  id: CourseIdSchema,
  plantId: PlantIdSchema,
  name: z.string().min(1).max(200),
  description: z.string().max(2e3).optional(),
  type: CourseTypeSchema,
  status: CourseStatusSchema,
  duration: z.number().int().min(1),
  // in minutes
  prerequisites: z.array(CourseIdSchema).default([]),
  learningObjectives: z.array(z.string()).default([]),
  materials: z.array(
    z.object({
      type: z.enum(["video", "document", "quiz", "interactive", "other"]),
      url: z.string().url().optional(),
      title: z.string(),
      description: z.string().optional()
    })
  ).default([]),
  passingScore: z.number().min(0).max(100).default(80),
  certificateValidDays: z.number().int().min(1).optional(),
  isRequired: z.boolean().default(false),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: UserIdSchema
}).strict();
var EnrollmentSchema = z.object({
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
  notes: z.string().max(1e3).optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}).strict();
var ProgressSchema = z.object({
  id: ProgressIdSchema,
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  status: ProgressStatusSchema,
  progressPercent: z.number().min(0).max(100).default(0),
  currentSection: z.string().optional(),
  timeSpent: z.number().int().min(0).default(0),
  // in minutes
  lastAccessedAt: z.string().datetime().optional(),
  completedSections: z.array(z.string()).default([]),
  quizScores: z.array(
    z.object({
      sectionKey: z.string(),
      score: z.number().min(0).max(100),
      attempts: z.number().int().min(1),
      completedAt: z.string().datetime()
    })
  ).default([]),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}).strict();
var ActivityEventSchema = z.object({
  id: ActivityEventIdSchema,
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  eventType: ActivityEventTypeSchema,
  sectionKey: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
  occurredAt: z.string().datetime(),
  createdAt: z.string().datetime()
}).strict();
var QuestionEventSchema = z.object({
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
  createdAt: z.string().datetime()
}).strict();
var AdminRoleSchema = z.object({
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
  updatedAt: z.string().datetime()
}).strict();
var CreatePlantRequestSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(20).optional(),
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional()
}).strict();
var UpdatePlantRequestSchema = CreatePlantRequestSchema.partial().strict();
var CreateCourseRequestSchema = z.object({
  plantId: PlantIdSchema,
  name: z.string().min(1).max(200),
  description: z.string().max(2e3).optional(),
  type: CourseTypeSchema,
  duration: z.number().int().min(1),
  prerequisites: z.array(CourseIdSchema).default([]),
  learningObjectives: z.array(z.string()).default([]),
  materials: z.array(
    z.object({
      type: z.enum(["video", "document", "quiz", "interactive", "other"]),
      url: z.string().url().optional(),
      title: z.string(),
      description: z.string().optional()
    })
  ).default([]),
  passingScore: z.number().min(0).max(100).default(80),
  certificateValidDays: z.number().int().min(1).optional(),
  isRequired: z.boolean().default(false)
}).strict();
var UpdateCourseRequestSchema = CreateCourseRequestSchema.partial().strict();
var CreateEnrollmentRequestSchema = z.object({
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  expiresAt: z.string().datetime().optional(),
  assignedBy: UserIdSchema.optional(),
  notes: z.string().max(1e3).optional()
}).strict();
var UpdateEnrollmentRequestSchema = CreateEnrollmentRequestSchema.partial().strict();
var UpdateProgressRequestSchema = z.object({
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  status: ProgressStatusSchema.optional(),
  progressPercent: z.number().min(0).max(100).optional(),
  currentSection: z.string().optional(),
  timeSpent: z.number().int().min(0).optional(),
  completedSections: z.array(z.string()).optional(),
  quizScore: z.object({
    sectionKey: z.string(),
    score: z.number().min(0).max(100),
    attempts: z.number().int().min(1)
  }).optional()
}).strict();
var CreateActivityEventRequestSchema = z.object({
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  eventType: ActivityEventTypeSchema,
  sectionKey: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional()
}).strict();
var CreateQuestionEventRequestSchema = z.object({
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  sectionKey: z.string(),
  questionKey: z.string(),
  isCorrect: z.boolean(),
  attemptIndex: z.number().int().min(1).default(1),
  responseMeta: z.record(z.string(), z.unknown()).optional()
}).strict();
var CreateAdminRoleRequestSchema = z.object({
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  roleType: AdminRoleTypeSchema,
  permissions: z.array(z.string()).default([]),
  expiresAt: z.string().datetime().optional(),
  assignedBy: UserIdSchema
}).strict();
var UpdateAdminRoleRequestSchema = CreateAdminRoleRequestSchema.partial().strict();
var PlantScopedQuerySchema = z.object({
  plantId: PlantIdSchema,
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
}).strict();
var UserScopedQuerySchema = z.object({
  userId: UserIdSchema,
  plantId: PlantIdSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
}).strict();
var CourseSearchQuerySchema = z.object({
  plantId: PlantIdSchema,
  query: z.string().min(1).max(200).optional(),
  type: CourseTypeSchema.optional(),
  status: CourseStatusSchema.optional(),
  isRequired: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
}).strict();
var EnrollmentSearchQuerySchema = z.object({
  plantId: PlantIdSchema,
  userId: UserIdSchema.optional(),
  courseId: CourseIdSchema.optional(),
  status: EnrollmentStatusSchema.optional(),
  query: z.string().min(1).max(200).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
}).strict();
var ProgressSearchQuerySchema = z.object({
  plantId: PlantIdSchema,
  userId: UserIdSchema.optional(),
  courseId: CourseIdSchema.optional(),
  status: ProgressStatusSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
}).strict();
var PlantResponseSchema = z.object({
  success: z.literal(true),
  data: PlantSchema,
  version: z.literal("1.0"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional()
  }).optional()
}).strict();
var CourseResponseSchema = z.object({
  success: z.literal(true),
  data: CourseSchema,
  version: z.literal("1.0"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional()
  }).optional()
}).strict();
var EnrollmentResponseSchema = z.object({
  success: z.literal(true),
  data: EnrollmentSchema,
  version: z.literal("1.0"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional()
  }).optional()
}).strict();
var ProgressResponseSchema = z.object({
  success: z.literal(true),
  data: ProgressSchema,
  version: z.literal("1.0"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional()
  }).optional()
}).strict();
var ActivityEventResponseSchema = z.object({
  success: z.literal(true),
  data: ActivityEventSchema,
  version: z.literal("1.0"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional()
  }).optional()
}).strict();
var QuestionEventResponseSchema = z.object({
  success: z.literal(true),
  data: QuestionEventSchema,
  version: z.literal("1.0"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional()
  }).optional()
}).strict();
var AdminRoleResponseSchema = z.object({
  success: z.literal(true),
  data: AdminRoleSchema,
  version: z.literal("1.0"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional()
  }).optional()
}).strict();
var createPaginatedResponseSchema = (dataSchema) => z.object({
  success: z.literal(true),
  data: z.array(dataSchema),
  pagination: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(100),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  }),
  version: z.literal("1.0"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional()
  }).optional()
}).strict();
var PaginatedPlantResponseSchema = createPaginatedResponseSchema(PlantSchema);
var PaginatedCourseResponseSchema = createPaginatedResponseSchema(CourseSchema);
var PaginatedEnrollmentResponseSchema = createPaginatedResponseSchema(EnrollmentSchema);
var PaginatedProgressResponseSchema = createPaginatedResponseSchema(ProgressSchema);
var PaginatedActivityEventResponseSchema = createPaginatedResponseSchema(ActivityEventSchema);
var PaginatedQuestionEventResponseSchema = createPaginatedResponseSchema(QuestionEventSchema);
var PaginatedAdminRoleResponseSchema = createPaginatedResponseSchema(AdminRoleSchema);
var SafetyTrainingErrorCodeSchema = z.enum([
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
  "SYSTEM_ERROR"
]);
var SafetyTrainingErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: SafetyTrainingErrorCodeSchema,
    message: z.string().min(1),
    details: z.array(
      z.object({
        field: z.string().optional(),
        message: z.string(),
        code: z.string().optional()
      })
    ).optional(),
    requestId: z.string().optional(),
    timestamp: z.string().datetime(),
    path: z.string().optional(),
    method: z.string().optional(),
    plantId: PlantIdSchema.optional(),
    userId: UserIdSchema.optional()
  }),
  version: z.literal("1.0")
}).strict();
var SafetyTrainingUserContextSchema = z.object({
  user: z.object({
    id: UserIdSchema,
    authUserId: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.string(),
    territoryId: z.string().uuid().optional()
  }),
  plantAccess: z.array(
    z.object({
      plantId: PlantIdSchema,
      plantName: z.string(),
      permissions: z.array(z.string()),
      adminRoles: z.array(AdminRoleTypeSchema)
    })
  ),
  session: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresAt: z.string().datetime()
  })
}).strict();
var PlantUserPermissionsSchema = z.object({
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
  adminRoles: z.array(AdminRoleTypeSchema)
}).strict();
var BulkEnrollmentRequestSchema = z.object({
  plantId: PlantIdSchema,
  courseId: CourseIdSchema,
  userIds: z.array(UserIdSchema).min(1).max(100),
  expiresAt: z.string().datetime().optional(),
  assignedBy: UserIdSchema.optional(),
  notes: z.string().max(1e3).optional()
}).strict();
var BulkEnrollmentResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    created: z.array(EnrollmentSchema),
    failed: z.array(
      z.object({
        userId: UserIdSchema,
        error: z.string()
      })
    ),
    total: z.number().int(),
    successCount: z.number().int(),
    failureCount: z.number().int()
  }),
  version: z.literal("1.0"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional()
  }).optional()
}).strict();
var CourseMaterialUploadRequestSchema = z.object({
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  materialType: z.enum(["video", "document", "interactive", "other"]),
  title: z.string().min(1).max(200),
  description: z.string().max(1e3).optional(),
  file: z.instanceof(File).optional(),
  url: z.string().url().optional()
}).strict();
var CourseMaterialUploadResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    materialId: z.string().uuid(),
    courseId: CourseIdSchema,
    materialType: z.string(),
    title: z.string(),
    url: z.string().url().optional(),
    fileSize: z.number().int().optional(),
    uploadedAt: z.string().datetime()
  }),
  version: z.literal("1.0"),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().optional()
  }).optional()
}).strict();

// src/safety-training-endpoints.ts
import { z as z2 } from "zod";
var SafetyTrainingApiEndpoints = {
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
    query: z2.object({
      page: z2.number().int().min(1).default(1),
      limit: z2.number().int().min(1).max(100).default(20),
      sortBy: z2.string().optional(),
      sortOrder: z2.enum(["asc", "desc"]).default("desc"),
      search: z2.string().optional()
    }),
    response: PaginatedPlantResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["plants:read"]
  },
  /**
   * GET /api/safety-training/plants/:plantId
   * Get specific plant details
   */
  GET_PLANT: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId",
    params: z2.object({
      plantId: PlantIdSchema
    }),
    response: PlantResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["plants:read"]
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
    permissions: ["plants:create"]
  },
  /**
   * PUT /api/safety-training/plants/:plantId
   * Update plant details
   */
  UPDATE_PLANT: {
    method: "PUT",
    path: "/api/safety-training/plants/:plantId",
    params: z2.object({
      plantId: PlantIdSchema
    }),
    body: UpdatePlantRequestSchema,
    response: PlantResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["plants:update"]
  },
  /**
   * DELETE /api/safety-training/plants/:plantId
   * Delete a plant (soft delete)
   */
  DELETE_PLANT: {
    method: "DELETE",
    path: "/api/safety-training/plants/:plantId",
    params: z2.object({
      plantId: PlantIdSchema
    }),
    response: z2.object({
      success: z2.literal(true),
      message: z2.string(),
      version: z2.literal("1.0")
    }),
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["plants:delete"]
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
    params: z2.object({
      plantId: PlantIdSchema
    }),
    query: CourseSearchQuerySchema.omit({ plantId: true }),
    response: PaginatedCourseResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
  },
  /**
   * GET /api/safety-training/plants/:plantId/courses/:courseId
   * Get specific course details
   */
  GET_COURSE: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/courses/:courseId",
    params: z2.object({
      plantId: PlantIdSchema,
      courseId: CourseIdSchema
    }),
    response: CourseResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
  },
  /**
   * POST /api/safety-training/plants/:plantId/courses
   * Create a new course
   */
  CREATE_COURSE: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/courses",
    params: z2.object({
      plantId: PlantIdSchema
    }),
    body: CreateCourseRequestSchema,
    response: CourseResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:create"]
  },
  /**
   * PUT /api/safety-training/plants/:plantId/courses/:courseId
   * Update course details
   */
  UPDATE_COURSE: {
    method: "PUT",
    path: "/api/safety-training/plants/:plantId/courses/:courseId",
    params: z2.object({
      plantId: PlantIdSchema,
      courseId: CourseIdSchema
    }),
    body: UpdateCourseRequestSchema,
    response: CourseResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:update"]
  },
  /**
   * DELETE /api/safety-training/plants/:plantId/courses/:courseId
   * Delete a course (soft delete)
   */
  DELETE_COURSE: {
    method: "DELETE",
    path: "/api/safety-training/plants/:plantId/courses/:courseId",
    params: z2.object({
      plantId: PlantIdSchema,
      courseId: CourseIdSchema
    }),
    response: z2.object({
      success: z2.literal(true),
      message: z2.string(),
      version: z2.literal("1.0")
    }),
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:delete"]
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
    params: z2.object({
      plantId: PlantIdSchema
    }),
    query: EnrollmentSearchQuerySchema.omit({ plantId: true }),
    response: PaginatedEnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:read"]
  },
  /**
   * GET /api/safety-training/plants/:plantId/enrollments/:enrollmentId
   * Get specific enrollment details
   */
  GET_ENROLLMENT: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/enrollments/:enrollmentId",
    params: z2.object({
      plantId: PlantIdSchema,
      enrollmentId: EnrollmentIdSchema
    }),
    response: EnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:read"]
  },
  /**
   * POST /api/safety-training/plants/:plantId/enrollments
   * Create a new enrollment
   */
  CREATE_ENROLLMENT: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/enrollments",
    params: z2.object({
      plantId: PlantIdSchema
    }),
    body: CreateEnrollmentRequestSchema,
    response: EnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:create"]
  },
  /**
   * POST /api/safety-training/plants/:plantId/enrollments/bulk
   * Create multiple enrollments
   */
  CREATE_BULK_ENROLLMENTS: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/enrollments/bulk",
    params: z2.object({
      plantId: PlantIdSchema
    }),
    body: BulkEnrollmentRequestSchema,
    response: BulkEnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:create"]
  },
  /**
   * PUT /api/safety-training/plants/:plantId/enrollments/:enrollmentId
   * Update enrollment details
   */
  UPDATE_ENROLLMENT: {
    method: "PUT",
    path: "/api/safety-training/plants/:plantId/enrollments/:enrollmentId",
    params: z2.object({
      plantId: PlantIdSchema,
      enrollmentId: EnrollmentIdSchema
    }),
    body: UpdateEnrollmentRequestSchema,
    response: EnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:update"]
  },
  /**
   * DELETE /api/safety-training/plants/:plantId/enrollments/:enrollmentId
   * Cancel an enrollment
   */
  DELETE_ENROLLMENT: {
    method: "DELETE",
    path: "/api/safety-training/plants/:plantId/enrollments/:enrollmentId",
    params: z2.object({
      plantId: PlantIdSchema,
      enrollmentId: EnrollmentIdSchema
    }),
    response: z2.object({
      success: z2.literal(true),
      message: z2.string(),
      version: z2.literal("1.0")
    }),
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:delete"]
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
    params: z2.object({
      plantId: PlantIdSchema
    }),
    query: ProgressSearchQuerySchema.omit({ plantId: true }),
    response: PaginatedProgressResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["progress:read"]
  },
  /**
   * GET /api/safety-training/plants/:plantId/progress/:progressId
   * Get specific progress details
   */
  GET_PROGRESS: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/progress/:progressId",
    params: z2.object({
      plantId: PlantIdSchema,
      progressId: ProgressIdSchema
    }),
    response: ProgressResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["progress:read"]
  },
  /**
   * PUT /api/safety-training/plants/:plantId/progress/:progressId
   * Update progress details
   */
  UPDATE_PROGRESS: {
    method: "PUT",
    path: "/api/safety-training/plants/:plantId/progress/:progressId",
    params: z2.object({
      plantId: PlantIdSchema,
      progressId: ProgressIdSchema
    }),
    body: UpdateProgressRequestSchema,
    response: ProgressResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["progress:update"]
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
    params: z2.object({
      plantId: PlantIdSchema
    }),
    query: PlantScopedQuerySchema.omit({ plantId: true }).extend({
      userId: UserIdSchema.optional(),
      courseId: CourseIdSchema.optional(),
      eventType: z2.string().optional(),
      dateFrom: z2.string().datetime().optional(),
      dateTo: z2.string().datetime().optional()
    }),
    response: PaginatedActivityEventResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["activity:read"]
  },
  /**
   * POST /api/safety-training/plants/:plantId/activity-events
   * Create a new activity event
   */
  CREATE_ACTIVITY_EVENT: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/activity-events",
    params: z2.object({
      plantId: PlantIdSchema
    }),
    body: CreateActivityEventRequestSchema,
    response: ActivityEventResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["activity:create"]
  },
  /**
   * GET /api/safety-training/plants/:plantId/question-events
   * List question events for a specific plant
   */
  LIST_QUESTION_EVENTS: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/question-events",
    params: z2.object({
      plantId: PlantIdSchema
    }),
    query: PlantScopedQuerySchema.omit({ plantId: true }).extend({
      userId: UserIdSchema.optional(),
      courseId: CourseIdSchema.optional(),
      sectionKey: z2.string().optional(),
      questionKey: z2.string().optional(),
      isCorrect: z2.boolean().optional(),
      dateFrom: z2.string().datetime().optional(),
      dateTo: z2.string().datetime().optional()
    }),
    response: PaginatedQuestionEventResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["activity:read"]
  },
  /**
   * POST /api/safety-training/plants/:plantId/question-events
   * Create a new question event
   */
  CREATE_QUESTION_EVENT: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/question-events",
    params: z2.object({
      plantId: PlantIdSchema
    }),
    body: CreateQuestionEventRequestSchema,
    response: QuestionEventResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["activity:create"]
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
    params: z2.object({
      plantId: PlantIdSchema
    }),
    query: PlantScopedQuerySchema.omit({ plantId: true }).extend({
      userId: UserIdSchema.optional(),
      roleType: z2.string().optional()
    }),
    response: PaginatedAdminRoleResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["admin_roles:read"]
  },
  /**
   * GET /api/safety-training/plants/:plantId/admin-roles/:adminRoleId
   * Get specific admin role details
   */
  GET_ADMIN_ROLE: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/admin-roles/:adminRoleId",
    params: z2.object({
      plantId: PlantIdSchema,
      adminRoleId: AdminRoleIdSchema
    }),
    response: AdminRoleResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["admin_roles:read"]
  },
  /**
   * POST /api/safety-training/plants/:plantId/admin-roles
   * Create a new admin role
   */
  CREATE_ADMIN_ROLE: {
    method: "POST",
    path: "/api/safety-training/plants/:plantId/admin-roles",
    params: z2.object({
      plantId: PlantIdSchema
    }),
    body: CreateAdminRoleRequestSchema,
    response: AdminRoleResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["admin_roles:create"]
  },
  /**
   * PUT /api/safety-training/plants/:plantId/admin-roles/:adminRoleId
   * Update admin role details
   */
  UPDATE_ADMIN_ROLE: {
    method: "PUT",
    path: "/api/safety-training/plants/:plantId/admin-roles/:adminRoleId",
    params: z2.object({
      plantId: PlantIdSchema,
      adminRoleId: AdminRoleIdSchema
    }),
    body: UpdateAdminRoleRequestSchema,
    response: AdminRoleResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["admin_roles:update"]
  },
  /**
   * DELETE /api/safety-training/plants/:plantId/admin-roles/:adminRoleId
   * Remove an admin role
   */
  DELETE_ADMIN_ROLE: {
    method: "DELETE",
    path: "/api/safety-training/plants/:plantId/admin-roles/:adminRoleId",
    params: z2.object({
      plantId: PlantIdSchema,
      adminRoleId: AdminRoleIdSchema
    }),
    response: z2.object({
      success: z2.literal(true),
      message: z2.string(),
      version: z2.literal("1.0")
    }),
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["admin_roles:delete"]
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
    params: z2.object({
      userId: UserIdSchema
    }),
    query: UserScopedQuerySchema.omit({ userId: true }),
    response: PaginatedEnrollmentResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["enrollments:read"]
  },
  /**
   * GET /api/safety-training/users/:userId/progress
   * List progress records for a specific user
   */
  LIST_USER_PROGRESS: {
    method: "GET",
    path: "/api/safety-training/users/:userId/progress",
    params: z2.object({
      userId: UserIdSchema
    }),
    query: UserScopedQuerySchema.omit({ userId: true }),
    response: PaginatedProgressResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["progress:read"]
  },
  /**
   * GET /api/safety-training/users/:userId/activity-events
   * List activity events for a specific user
   */
  LIST_USER_ACTIVITY_EVENTS: {
    method: "GET",
    path: "/api/safety-training/users/:userId/activity-events",
    params: z2.object({
      userId: UserIdSchema
    }),
    query: UserScopedQuerySchema.omit({ userId: true }),
    response: PaginatedActivityEventResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["activity:read"]
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
    permissions: []
  },
  /**
   * GET /api/safety-training/plants/:plantId/users/:userId/permissions
   * Get user permissions for a specific plant
   */
  GET_USER_PERMISSIONS: {
    method: "GET",
    path: "/api/safety-training/plants/:plantId/users/:userId/permissions",
    params: z2.object({
      plantId: PlantIdSchema,
      userId: UserIdSchema
    }),
    response: z2.object({
      success: z2.literal(true),
      data: PlantUserPermissionsSchema,
      version: z2.literal("1.0")
    }),
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["users:read"]
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
    params: z2.object({
      plantId: PlantIdSchema,
      courseId: CourseIdSchema
    }),
    body: CourseMaterialUploadRequestSchema,
    response: CourseMaterialUploadResponseSchema,
    error: SafetyTrainingErrorResponseSchema,
    auth: true,
    permissions: ["courses:update"]
  }
};

// src/safety-training-openapi-minimal.ts
var zodToOpenApi = (schema) => {
  return {
    type: "string",
    description: `Schema type: ${schema._def.typeName || "unknown"}`
  };
};
var generateSafetyTrainingOpenApi = () => {
  return {
    openapi: "3.0.0",
    info: {
      title: "Safety Training API",
      version: "1.0.0",
      description: "API for Safety Training management with plant-scoped access control"
    },
    servers: [
      {
        url: "/api/safety-training",
        description: "Safety Training API endpoints"
      }
    ],
    paths: {
      "/plants": {
        get: {
          summary: "List plants",
          description: "Get list of plants accessible to the user",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            isActive: { type: "boolean" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  };
};

// src/safety-training-validation.ts
var SafetyTrainingValidationMiddleware = class {
  config;
  constructor(config = {}) {
    this.config = {
      enableLogging: true,
      enableMetrics: false,
      strictMode: true,
      customValidators: {},
      ...config
    };
  }
  /**
   * Validate API request parameters
   */
  async validateRequest(endpoint, request, context) {
    const requestId = this.generateRequestId();
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const validationContext = {
      userId: context.userId || "",
      plantId: context.plantId,
      permissions: context.permissions || [],
      adminRoles: context.adminRoles || [],
      requestId,
      timestamp
    };
    const errors = [];
    try {
      const endpointConfig = SafetyTrainingApiEndpoints[endpoint];
      if (!endpointConfig) {
        errors.push({
          field: "endpoint",
          message: `Unknown endpoint: ${endpoint}`,
          code: "UNKNOWN_ENDPOINT"
        });
        return { success: false, errors, context: validationContext };
      }
      const params = this.extractPathParams(request, endpointConfig);
      if ("params" in endpointConfig && endpointConfig.params) {
        const paramResult = this.validateSchema(
          params,
          endpointConfig.params
        );
        if (!paramResult.success) {
          errors.push(...paramResult.errors);
        }
      }
      const query = this.extractQueryParams(request);
      if ("query" in endpointConfig && endpointConfig.query) {
        const queryResult = this.validateSchema(
          query,
          endpointConfig.query
        );
        if (!queryResult.success) {
          errors.push(...queryResult.errors);
        }
      }
      let body;
      if ("body" in endpointConfig && endpointConfig.body && ["POST", "PUT", "PATCH"].includes(endpointConfig.method)) {
        try {
          body = await request.json();
        } catch (error) {
          console.error("JSON parsing error:", error);
          errors.push({
            field: "body",
            message: "Invalid JSON in request body",
            code: "INVALID_JSON"
          });
        }
        if (body !== void 0) {
          const bodyResult = this.validateSchema(
            body,
            endpointConfig.body
          );
          if (!bodyResult.success) {
            errors.push(...bodyResult.errors);
          }
        }
      }
      if ("params" in endpointConfig && endpointConfig.params && "plantId" in endpointConfig.params.shape && validationContext.plantId) {
        const plantAccessResult = this.validatePlantAccess(
          validationContext,
          validationContext.plantId
        );
        if (!plantAccessResult.success) {
          errors.push(...plantAccessResult.errors);
        }
      }
      const permissionResult = this.validatePermissions(validationContext, [
        ...endpointConfig.permissions || []
      ]);
      if (!permissionResult.success) {
        errors.push(...permissionResult.errors);
      }
      if (errors.length > 0) {
        return { success: false, errors, context: validationContext };
      }
      return {
        success: true,
        data: {
          params,
          query,
          body
        },
        errors: [],
        context: validationContext
      };
    } catch (error) {
      this.logError("Validation error", error, validationContext);
      errors.push({
        field: "validation",
        message: "Internal validation error",
        code: "INTERNAL_ERROR"
      });
      return { success: false, errors, context: validationContext };
    }
  }
  /**
   * Validate API response
   */
  validateResponse(endpoint, response, context) {
    const errors = [];
    try {
      const endpointConfig = SafetyTrainingApiEndpoints[endpoint];
      if (!endpointConfig) {
        errors.push({
          field: "endpoint",
          message: `Unknown endpoint: ${endpoint}`,
          code: "UNKNOWN_ENDPOINT"
        });
        return { success: false, errors, context };
      }
      const responseResult = this.validateSchema(
        response,
        endpointConfig.response
      );
      if (!responseResult.success) {
        errors.push(...responseResult.errors);
      }
      if (errors.length > 0) {
        return { success: false, errors, context };
      }
      return {
        success: true,
        data: response,
        errors: [],
        context
      };
    } catch (error) {
      this.logError("Response validation error", error, context);
      errors.push({
        field: "response",
        message: "Internal response validation error",
        code: "INTERNAL_ERROR"
      });
      return { success: false, errors, context };
    }
  }
  /**
   * Create error response
   */
  createErrorResponse(code, message, details = [], context) {
    const errorResponse = SafetyTrainingErrorResponseSchema.parse({
      success: false,
      error: {
        code,
        message,
        details: details.map((d) => ({
          field: d.field,
          message: d.message,
          code: d.code
        })),
        requestId: context.requestId,
        timestamp: context.timestamp,
        plantId: context.plantId,
        userId: context.userId
      },
      version: "1.0"
    });
    return {
      json: (data, options) => {
        return new Response(JSON.stringify(data || errorResponse), {
          status: options?.status || this.getHttpStatus(code),
          headers: { "Content-Type": "application/json" }
        });
      }
    };
  }
  /**
   * Create success response
   */
  createSuccessResponse(data, context, metadata) {
    const successResponse = {
      success: true,
      data,
      version: "1.0",
      metadata: {
        timestamp: context.timestamp,
        requestId: context.requestId,
        ...metadata
      }
    };
    return {
      json: (data2, options) => {
        return new Response(JSON.stringify(data2 || successResponse), {
          status: options?.status || 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    };
  }
  // =============================================================================
  // PRIVATE VALIDATION METHODS
  // =============================================================================
  /**
   * Validate schema against data
   */
  validateSchema(data, schema) {
    try {
      const result = schema.safeParse(data);
      if (result.success) {
        return { success: true, data: result.data, errors: [] };
      }
      const errors = result.error.issues.map(
        (error) => ({
          field: error.path.join("."),
          message: error.message,
          code: error.code,
          value: error.input
        })
      );
      return { success: false, errors };
    } catch (error) {
      console.error("Schema validation error:", error);
      return {
        success: false,
        errors: [
          {
            field: "schema",
            message: "Schema validation failed",
            code: "SCHEMA_ERROR"
          }
        ]
      };
    }
  }
  /**
   * Extract path parameters from request
   */
  extractPathParams(request, endpointConfig) {
    const params = {};
    const pathSegments = request.nextUrl.pathname.split("/");
    const endpointSegments = endpointConfig.path.split("/");
    endpointSegments.forEach((segment, index) => {
      if (segment.startsWith(":")) {
        const paramName = segment.slice(1);
        params[paramName] = pathSegments[index];
      }
    });
    return params;
  }
  /**
   * Extract query parameters from request
   */
  extractQueryParams(request) {
    const params = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      if (!isNaN(Number(value)) && value.trim() !== "") {
        params[key] = Number(value);
      } else if (value === "true" || value === "false") {
        params[key] = value === "true";
      } else {
        params[key] = value;
      }
    });
    return params;
  }
  /**
   * Validate plant access
   */
  validatePlantAccess(context, plantId) {
    const errors = [];
    if (!context.permissions.includes(`plants:${plantId}:read`)) {
      errors.push({
        field: "plantId",
        message: "Access denied to plant",
        code: "PLANT_ACCESS_DENIED",
        value: plantId
      });
    }
    return { success: errors.length === 0, errors };
  }
  /**
   * Validate user permissions
   */
  validatePermissions(context, requiredPermissions) {
    const errors = [];
    for (const permission of requiredPermissions) {
      if (!context.permissions.includes(permission)) {
        errors.push({
          field: "permissions",
          message: `Missing required permission: ${permission}`,
          code: "AUTHORIZATION_ERROR",
          value: permission
        });
      }
    }
    return { success: errors.length === 0, errors };
  }
  /**
   * Generate unique request ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * Get HTTP status code for error
   */
  getHttpStatus(code) {
    const statusMap = {
      PLANT_NOT_FOUND: 404,
      PLANT_ACCESS_DENIED: 403,
      COURSE_NOT_FOUND: 404,
      COURSE_ACCESS_DENIED: 403,
      ENROLLMENT_NOT_FOUND: 404,
      ENROLLMENT_ALREADY_EXISTS: 409,
      ENROLLMENT_EXPIRED: 410,
      PROGRESS_NOT_FOUND: 404,
      PROGRESS_ACCESS_DENIED: 403,
      ACTIVITY_EVENT_NOT_FOUND: 404,
      QUESTION_EVENT_NOT_FOUND: 404,
      ADMIN_ROLE_NOT_FOUND: 404,
      ADMIN_ROLE_ACCESS_DENIED: 403,
      USER_NOT_AUTHORIZED: 401,
      PLANT_MISMATCH: 400,
      INVALID_PROGRESS_UPDATE: 400,
      COURSE_COMPLETION_FAILED: 400,
      CERTIFICATE_GENERATION_FAILED: 500,
      VALIDATION_ERROR: 400,
      BUSINESS_ERROR: 400,
      SYSTEM_ERROR: 500
    };
    return statusMap[code] || 500;
  }
  /**
   * Log error with context
   */
  logError(message, error, context) {
    if (this.config.enableLogging) {
      console.error(`[${context.requestId}] ${message}:`, {
        error: error instanceof Error ? error.message : error,
        context: {
          userId: context.userId,
          plantId: context.plantId,
          timestamp: context.timestamp
        }
      });
    }
  }
};
var createSafetyTrainingValidationMiddleware = (config) => {
  return new SafetyTrainingValidationMiddleware(config);
};
var safetyTrainingValidation = createSafetyTrainingValidationMiddleware();
var validatePlantId = (plantId) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(plantId);
};
var validateUserId = (userId) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
};
var validateCourseId = (courseId) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(courseId);
};
var validateEnrollmentId = (enrollmentId) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(enrollmentId);
};
var validateProgressPercent = (percent) => {
  return Number.isFinite(percent) && percent >= 0 && percent <= 100;
};
var validateDuration = (duration) => {
  return Number.isInteger(duration) && duration > 0 && duration <= 1440;
};
var validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
var validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
var validateDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return !isNaN(date.getTime());
};
var validatePagination = (page, limit) => {
  return Number.isInteger(page) && page >= 1 && Number.isInteger(limit) && limit >= 1 && limit <= 100;
};
var validateSortOrder = (sortOrder) => {
  return ["asc", "desc"].includes(sortOrder.toLowerCase());
};
var validateCourseType = (courseType) => {
  const validTypes = [
    "safety_orientation",
    "hazard_communication",
    "emergency_response",
    "equipment_operation",
    "compliance_training",
    "certification",
    "refresher",
    "custom"
  ];
  return validTypes.includes(courseType);
};
var validateEnrollmentStatus = (status) => {
  const validStatuses = [
    "enrolled",
    "in_progress",
    "completed",
    "failed",
    "expired",
    "cancelled"
  ];
  return validStatuses.includes(status);
};
var validateProgressStatus = (status) => {
  const validStatuses = [
    "not_started",
    "in_progress",
    "completed",
    "paused",
    "failed"
  ];
  return validStatuses.includes(status);
};
var validateAdminRoleType = (roleType) => {
  const validTypes = [
    "plant_admin",
    "course_admin",
    "instructor",
    "supervisor",
    "compliance_officer"
  ];
  return validTypes.includes(roleType);
};

// src/lms-content-contracts.ts
import { z as z3 } from "zod";
var CourseSectionIdSchema = z3.string().uuid().brand();
var ContentBlockIdSchema = z3.string().uuid().brand();
var QuizQuestionIdSchema = z3.string().uuid().brand();
var UserProgressIdSchema = z3.string().uuid().brand();
var QuizAttemptIdSchema = z3.string().uuid().brand();
var ContentInteractionIdSchema = z3.string().uuid().brand();
var CourseTranslationIdSchema = z3.string().uuid().brand();
var SectionTranslationIdSchema = z3.string().uuid().brand();
var ContentBlockTranslationIdSchema = z3.string().uuid().brand();
var QuizQuestionTranslationIdSchema = z3.string().uuid().brand();
var ContentBlockTypeSchema = z3.enum([
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
  "audio"
]);
var QuestionTypeSchema = z3.enum(["true-false", "multiple-choice"]);
var LanguageCodeSchema = z3.enum(["en", "es", "fr", "de"]);
var InteractionTypeSchema = z3.enum([
  "view",
  "click",
  "expand",
  "collapse",
  "download",
  "share"
]);
var CourseSectionSchema = z3.object({
  id: CourseSectionIdSchema,
  courseId: z3.string().uuid(),
  sectionKey: z3.string().min(1).max(100),
  title: z3.string().min(1).max(200),
  orderIndex: z3.number().int().min(0),
  iconName: z3.string().max(50).optional(),
  isPublished: z3.boolean(),
  createdAt: z3.string().datetime(),
  updatedAt: z3.string().datetime()
}).strict();
var ContentBlockSchema = z3.object({
  id: ContentBlockIdSchema,
  sectionId: CourseSectionIdSchema,
  blockType: ContentBlockTypeSchema,
  orderIndex: z3.number().int().min(0),
  content: z3.record(z3.string(), z3.unknown()),
  metadata: z3.record(z3.string(), z3.unknown()).optional(),
  createdAt: z3.string().datetime(),
  updatedAt: z3.string().datetime()
}).strict();
var QuizQuestionSchema = z3.object({
  id: QuizQuestionIdSchema,
  sectionId: CourseSectionIdSchema,
  questionKey: z3.string().min(1).max(100),
  questionType: QuestionTypeSchema,
  questionText: z3.string().min(1).max(1e3),
  options: z3.record(z3.string(), z3.string()).optional(),
  correctAnswer: z3.union([z3.string(), z3.boolean(), z3.number()]),
  explanation: z3.string().max(2e3).optional(),
  orderIndex: z3.number().int().min(0).default(0),
  isPublished: z3.boolean(),
  createdAt: z3.string().datetime(),
  updatedAt: z3.string().datetime()
}).strict();
var CourseTranslationSchema = z3.object({
  id: CourseTranslationIdSchema,
  courseId: z3.string().uuid(),
  languageCode: LanguageCodeSchema,
  title: z3.string().min(1).max(200),
  description: z3.string().max(2e3).optional(),
  createdAt: z3.string().datetime(),
  updatedAt: z3.string().datetime()
}).strict();
var SectionTranslationSchema = z3.object({
  id: SectionTranslationIdSchema,
  sectionId: CourseSectionIdSchema,
  languageCode: LanguageCodeSchema,
  title: z3.string().min(1).max(200),
  createdAt: z3.string().datetime(),
  updatedAt: z3.string().datetime()
}).strict();
var ContentBlockTranslationSchema = z3.object({
  id: ContentBlockTranslationIdSchema,
  contentBlockId: ContentBlockIdSchema,
  languageCode: LanguageCodeSchema,
  content: z3.record(z3.string(), z3.unknown()),
  createdAt: z3.string().datetime(),
  updatedAt: z3.string().datetime()
}).strict();
var QuizQuestionTranslationSchema = z3.object({
  id: QuizQuestionTranslationIdSchema,
  quizQuestionId: QuizQuestionIdSchema,
  languageCode: LanguageCodeSchema,
  questionText: z3.string().min(1).max(1e3),
  options: z3.record(z3.string(), z3.string()).optional(),
  correctAnswer: z3.union([z3.string(), z3.boolean(), z3.number()]),
  explanation: z3.string().max(2e3).optional(),
  createdAt: z3.string().datetime(),
  updatedAt: z3.string().datetime()
}).strict();
var UserProgressSchema = z3.object({
  id: UserProgressIdSchema,
  userId: z3.string().min(1),
  courseId: z3.string().uuid(),
  sectionId: CourseSectionIdSchema,
  isCompleted: z3.boolean(),
  completionPercentage: z3.number().int().min(0).max(100),
  timeSpentSeconds: z3.number().int().min(0),
  lastAccessedAt: z3.string().datetime(),
  completedAt: z3.string().datetime().optional(),
  createdAt: z3.string().datetime(),
  updatedAt: z3.string().datetime()
}).strict();
var QuizAttemptSchema = z3.object({
  id: QuizAttemptIdSchema,
  userId: z3.string().min(1),
  quizQuestionId: QuizQuestionIdSchema,
  userAnswer: z3.union([z3.string(), z3.boolean(), z3.number()]),
  isCorrect: z3.boolean(),
  attemptedAt: z3.string().datetime(),
  timeSpentSeconds: z3.number().int().min(0)
}).strict();
var ContentInteractionSchema = z3.object({
  id: ContentInteractionIdSchema,
  userId: z3.string().min(1),
  contentBlockId: ContentBlockIdSchema,
  interactionType: InteractionTypeSchema,
  metadata: z3.record(z3.string(), z3.unknown()).optional(),
  interactedAt: z3.string().datetime()
}).strict();
var CreateCourseSectionRequestSchema = z3.object({
  courseId: z3.string().uuid(),
  sectionKey: z3.string().min(1).max(100),
  title: z3.string().min(1).max(200),
  orderIndex: z3.number().int().min(0),
  iconName: z3.string().max(50).optional(),
  isPublished: z3.boolean().default(false)
}).strict();
var UpdateCourseSectionRequestSchema = CreateCourseSectionRequestSchema.partial().strict();
var CreateContentBlockRequestSchema = z3.object({
  sectionId: CourseSectionIdSchema,
  blockType: ContentBlockTypeSchema,
  orderIndex: z3.number().int().min(0),
  content: z3.record(z3.string(), z3.unknown()),
  metadata: z3.record(z3.string(), z3.unknown()).optional()
}).strict();
var UpdateContentBlockRequestSchema = CreateContentBlockRequestSchema.partial().strict();
var CreateQuizQuestionRequestSchema = z3.object({
  sectionId: CourseSectionIdSchema,
  questionKey: z3.string().min(1).max(100),
  questionType: QuestionTypeSchema,
  questionText: z3.string().min(1).max(1e3),
  options: z3.record(z3.string(), z3.string()).optional(),
  correctAnswer: z3.union([z3.string(), z3.boolean(), z3.number()]),
  explanation: z3.string().max(2e3).optional(),
  orderIndex: z3.number().int().min(0).default(0),
  isPublished: z3.boolean().default(false)
}).strict();
var UpdateQuizQuestionRequestSchema = CreateQuizQuestionRequestSchema.partial().strict();
var SubmitQuizAnswerRequestSchema = z3.object({
  quizQuestionId: QuizQuestionIdSchema,
  userAnswer: z3.union([z3.string(), z3.boolean(), z3.number()]),
  timeSpentSeconds: z3.number().int().min(0).default(0)
}).strict();
var UpdateUserProgressRequestSchema = z3.object({
  courseId: z3.string().uuid(),
  sectionId: CourseSectionIdSchema,
  isCompleted: z3.boolean().optional(),
  completionPercentage: z3.number().int().min(0).max(100).optional(),
  timeSpentSeconds: z3.number().int().min(0).optional()
}).strict();
var TrackContentInteractionRequestSchema = z3.object({
  contentBlockId: ContentBlockIdSchema,
  interactionType: InteractionTypeSchema,
  metadata: z3.record(z3.string(), z3.unknown()).optional()
}).strict();
var CourseContentQuerySchema = z3.object({
  courseKey: z3.string().min(1).max(100),
  languageCode: LanguageCodeSchema.default("en"),
  includeUnpublished: z3.boolean().default(false)
}).strict();
var SectionContentQuerySchema = z3.object({
  courseKey: z3.string().min(1).max(100),
  sectionKey: z3.string().min(1).max(100),
  languageCode: LanguageCodeSchema.default("en"),
  includeUnpublished: z3.boolean().default(false)
}).strict();
var UserProgressQuerySchema = z3.object({
  userId: z3.string().min(1),
  courseId: z3.string().uuid().optional(),
  sectionId: CourseSectionIdSchema.optional(),
  isCompleted: z3.boolean().optional()
}).strict();
var QuizAttemptsQuerySchema = z3.object({
  userId: z3.string().min(1),
  quizQuestionId: QuizQuestionIdSchema.optional(),
  isCorrect: z3.boolean().optional(),
  dateFrom: z3.string().datetime().optional(),
  dateTo: z3.string().datetime().optional()
}).strict();
var ContentInteractionsQuerySchema = z3.object({
  userId: z3.string().min(1),
  contentBlockId: ContentBlockIdSchema.optional(),
  interactionType: InteractionTypeSchema.optional(),
  dateFrom: z3.string().datetime().optional(),
  dateTo: z3.string().datetime().optional()
}).strict();
var CourseSectionResponseSchema = z3.object({
  success: z3.literal(true),
  data: CourseSectionSchema,
  version: z3.literal("1.0"),
  metadata: z3.object({
    timestamp: z3.string().datetime(),
    requestId: z3.string().optional()
  }).optional()
}).strict();
var ContentBlockResponseSchema = z3.object({
  success: z3.literal(true),
  data: ContentBlockSchema,
  version: z3.literal("1.0"),
  metadata: z3.object({
    timestamp: z3.string().datetime(),
    requestId: z3.string().optional()
  }).optional()
}).strict();
var QuizQuestionResponseSchema = z3.object({
  success: z3.literal(true),
  data: QuizQuestionSchema,
  version: z3.literal("1.0"),
  metadata: z3.object({
    timestamp: z3.string().datetime(),
    requestId: z3.string().optional()
  }).optional()
}).strict();
var UserProgressResponseSchema = z3.object({
  success: z3.literal(true),
  data: UserProgressSchema,
  version: z3.literal("1.0"),
  metadata: z3.object({
    timestamp: z3.string().datetime(),
    requestId: z3.string().optional()
  }).optional()
}).strict();
var QuizAttemptResponseSchema = z3.object({
  success: z3.literal(true),
  data: QuizAttemptSchema,
  version: z3.literal("1.0"),
  metadata: z3.object({
    timestamp: z3.string().datetime(),
    requestId: z3.string().optional()
  }).optional()
}).strict();
var ContentInteractionResponseSchema = z3.object({
  success: z3.literal(true),
  data: ContentInteractionSchema,
  version: z3.literal("1.0"),
  metadata: z3.object({
    timestamp: z3.string().datetime(),
    requestId: z3.string().optional()
  }).optional()
}).strict();
var CourseWithSectionsResponseSchema = z3.object({
  success: z3.literal(true),
  data: z3.object({
    course: z3.object({
      id: z3.string().uuid(),
      courseKey: z3.string(),
      title: z3.string(),
      description: z3.string().optional(),
      version: z3.string(),
      isPublished: z3.boolean()
    }),
    sections: z3.array(CourseSectionSchema)
  }),
  version: z3.literal("1.0"),
  metadata: z3.object({
    timestamp: z3.string().datetime(),
    requestId: z3.string().optional()
  }).optional()
}).strict();
var SectionWithContentResponseSchema = z3.object({
  success: z3.literal(true),
  data: z3.object({
    section: CourseSectionSchema,
    contentBlocks: z3.array(ContentBlockSchema),
    quizQuestions: z3.array(QuizQuestionSchema)
  }),
  version: z3.literal("1.0"),
  metadata: z3.object({
    timestamp: z3.string().datetime(),
    requestId: z3.string().optional()
  }).optional()
}).strict();
var CourseCompletionStatusResponseSchema = z3.object({
  success: z3.literal(true),
  data: z3.object({
    courseId: z3.string().uuid(),
    userId: z3.string(),
    totalSections: z3.number().int().min(0),
    completedSections: z3.number().int().min(0),
    completionPercentage: z3.number().int().min(0).max(100),
    timeSpentSeconds: z3.number().int().min(0),
    lastAccessedAt: z3.string().datetime(),
    completedAt: z3.string().datetime().optional()
  }),
  version: z3.literal("1.0"),
  metadata: z3.object({
    timestamp: z3.string().datetime(),
    requestId: z3.string().optional()
  }).optional()
}).strict();
var LmsContentErrorCodeSchema = z3.enum([
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
  "SYSTEM_ERROR"
]);
var LmsContentErrorResponseSchema = z3.object({
  success: z3.literal(false),
  error: z3.object({
    code: LmsContentErrorCodeSchema,
    message: z3.string().min(1),
    details: z3.array(
      z3.object({
        field: z3.string().optional(),
        message: z3.string(),
        code: z3.string().optional()
      })
    ).optional(),
    requestId: z3.string().optional(),
    timestamp: z3.string().datetime(),
    path: z3.string().optional(),
    method: z3.string().optional(),
    courseId: z3.string().uuid().optional(),
    userId: z3.string().optional()
  }),
  version: z3.literal("1.0")
}).strict();

// src/lms-content-endpoints.ts
import { z as z4 } from "zod";
var LmsContentApiEndpoints = {
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
    params: z4.object({
      courseKey: z4.string().min(1).max(100)
    }),
    query: CourseContentQuerySchema.omit({ courseKey: true }),
    response: CourseWithSectionsResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
  },
  /**
   * GET /api/lms-content/courses/:courseKey/sections/:sectionKey
   * Get specific section with content blocks and quiz questions
   */
  GET_SECTION_CONTENT: {
    method: "GET",
    path: "/api/lms-content/courses/:courseKey/sections/:sectionKey",
    params: z4.object({
      courseKey: z4.string().min(1).max(100),
      sectionKey: z4.string().min(1).max(100)
    }),
    query: SectionContentQuerySchema.omit({
      courseKey: true,
      sectionKey: true
    }),
    response: SectionWithContentResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
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
    params: z4.object({
      courseKey: z4.string().min(1).max(100)
    }),
    query: z4.object({
      languageCode: LanguageCodeSchema.default("en"),
      includeUnpublished: z4.boolean().default(false),
      sortBy: z4.enum(["orderIndex", "title", "createdAt"]).default("orderIndex"),
      sortOrder: z4.enum(["asc", "desc"]).default("asc")
    }),
    response: z4.object({
      success: z4.literal(true),
      data: z4.array(
        z4.object({
          id: CourseSectionIdSchema,
          sectionKey: z4.string(),
          title: z4.string(),
          orderIndex: z4.number().int(),
          iconName: z4.string().optional(),
          isPublished: z4.boolean(),
          createdAt: z4.string().datetime(),
          updatedAt: z4.string().datetime()
        })
      ),
      version: z4.literal("1.0")
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
  },
  /**
   * GET /api/lms-content/sections/:sectionId
   * Get specific section details
   */
  GET_COURSE_SECTION: {
    method: "GET",
    path: "/api/lms-content/sections/:sectionId",
    params: z4.object({
      sectionId: CourseSectionIdSchema
    }),
    response: CourseSectionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
  },
  /**
   * POST /api/lms-content/courses/:courseKey/sections
   * Create a new course section
   */
  CREATE_COURSE_SECTION: {
    method: "POST",
    path: "/api/lms-content/courses/:courseKey/sections",
    params: z4.object({
      courseKey: z4.string().min(1).max(100)
    }),
    body: CreateCourseSectionRequestSchema.omit({ courseId: true }),
    response: CourseSectionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:create"]
  },
  /**
   * PUT /api/lms-content/sections/:sectionId
   * Update course section details
   */
  UPDATE_COURSE_SECTION: {
    method: "PUT",
    path: "/api/lms-content/sections/:sectionId",
    params: z4.object({
      sectionId: CourseSectionIdSchema
    }),
    body: UpdateCourseSectionRequestSchema,
    response: CourseSectionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:update"]
  },
  /**
   * DELETE /api/lms-content/sections/:sectionId
   * Delete a course section
   */
  DELETE_COURSE_SECTION: {
    method: "DELETE",
    path: "/api/lms-content/sections/:sectionId",
    params: z4.object({
      sectionId: CourseSectionIdSchema
    }),
    response: z4.object({
      success: z4.literal(true),
      message: z4.string(),
      version: z4.literal("1.0")
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:delete"]
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
    params: z4.object({
      sectionId: CourseSectionIdSchema
    }),
    query: z4.object({
      languageCode: LanguageCodeSchema.default("en"),
      blockType: z4.enum([
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
        "audio"
      ]).optional(),
      sortBy: z4.enum(["orderIndex", "blockType", "createdAt"]).default("orderIndex"),
      sortOrder: z4.enum(["asc", "desc"]).default("asc")
    }),
    response: z4.object({
      success: z4.literal(true),
      data: z4.array(ContentBlockResponseSchema.shape.data),
      version: z4.literal("1.0")
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
  },
  /**
   * GET /api/lms-content/content-blocks/:contentBlockId
   * Get specific content block details
   */
  GET_CONTENT_BLOCK: {
    method: "GET",
    path: "/api/lms-content/content-blocks/:contentBlockId",
    params: z4.object({
      contentBlockId: ContentBlockIdSchema
    }),
    response: ContentBlockResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
  },
  /**
   * POST /api/lms-content/sections/:sectionId/content-blocks
   * Create a new content block
   */
  CREATE_CONTENT_BLOCK: {
    method: "POST",
    path: "/api/lms-content/sections/:sectionId/content-blocks",
    params: z4.object({
      sectionId: CourseSectionIdSchema
    }),
    body: CreateContentBlockRequestSchema.omit({ sectionId: true }),
    response: ContentBlockResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:create"]
  },
  /**
   * PUT /api/lms-content/content-blocks/:contentBlockId
   * Update content block details
   */
  UPDATE_CONTENT_BLOCK: {
    method: "PUT",
    path: "/api/lms-content/content-blocks/:contentBlockId",
    params: z4.object({
      contentBlockId: ContentBlockIdSchema
    }),
    body: UpdateContentBlockRequestSchema,
    response: ContentBlockResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:update"]
  },
  /**
   * DELETE /api/lms-content/content-blocks/:contentBlockId
   * Delete a content block
   */
  DELETE_CONTENT_BLOCK: {
    method: "DELETE",
    path: "/api/lms-content/content-blocks/:contentBlockId",
    params: z4.object({
      contentBlockId: ContentBlockIdSchema
    }),
    response: z4.object({
      success: z4.literal(true),
      message: z4.string(),
      version: z4.literal("1.0")
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:delete"]
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
    params: z4.object({
      sectionId: CourseSectionIdSchema
    }),
    query: z4.object({
      languageCode: LanguageCodeSchema.default("en"),
      questionType: z4.enum(["true-false", "multiple-choice"]).optional(),
      includeUnpublished: z4.boolean().default(false),
      sortBy: z4.enum(["orderIndex", "questionKey", "createdAt"]).default("orderIndex"),
      sortOrder: z4.enum(["asc", "desc"]).default("asc")
    }),
    response: z4.object({
      success: z4.literal(true),
      data: z4.array(QuizQuestionResponseSchema.shape.data),
      version: z4.literal("1.0")
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
  },
  /**
   * GET /api/lms-content/quiz-questions/:quizQuestionId
   * Get specific quiz question details
   */
  GET_QUIZ_QUESTION: {
    method: "GET",
    path: "/api/lms-content/quiz-questions/:quizQuestionId",
    params: z4.object({
      quizQuestionId: QuizQuestionIdSchema
    }),
    response: QuizQuestionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
  },
  /**
   * POST /api/lms-content/sections/:sectionId/quiz-questions
   * Create a new quiz question
   */
  CREATE_QUIZ_QUESTION: {
    method: "POST",
    path: "/api/lms-content/sections/:sectionId/quiz-questions",
    params: z4.object({
      sectionId: CourseSectionIdSchema
    }),
    body: CreateQuizQuestionRequestSchema.omit({ sectionId: true }),
    response: QuizQuestionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:create"]
  },
  /**
   * PUT /api/lms-content/quiz-questions/:quizQuestionId
   * Update quiz question details
   */
  UPDATE_QUIZ_QUESTION: {
    method: "PUT",
    path: "/api/lms-content/quiz-questions/:quizQuestionId",
    params: z4.object({
      quizQuestionId: QuizQuestionIdSchema
    }),
    body: UpdateQuizQuestionRequestSchema,
    response: QuizQuestionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:update"]
  },
  /**
   * DELETE /api/lms-content/quiz-questions/:quizQuestionId
   * Delete a quiz question
   */
  DELETE_QUIZ_QUESTION: {
    method: "DELETE",
    path: "/api/lms-content/quiz-questions/:quizQuestionId",
    params: z4.object({
      quizQuestionId: QuizQuestionIdSchema
    }),
    response: z4.object({
      success: z4.literal(true),
      message: z4.string(),
      version: z4.literal("1.0")
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:delete"]
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
    params: z4.object({
      userId: z4.string().min(1)
    }),
    query: UserProgressQuerySchema.omit({ userId: true }),
    response: z4.object({
      success: z4.literal(true),
      data: z4.array(UserProgressResponseSchema.shape.data),
      version: z4.literal("1.0")
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["progress:read"]
  },
  /**
   * GET /api/lms-content/users/:userId/courses/:courseId/completion
   * Get course completion status for a user
   */
  GET_COURSE_COMPLETION_STATUS: {
    method: "GET",
    path: "/api/lms-content/users/:userId/courses/:courseId/completion",
    params: z4.object({
      userId: z4.string().min(1),
      courseId: z4.string().uuid()
    }),
    response: CourseCompletionStatusResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["progress:read"]
  },
  /**
   * PUT /api/lms-content/users/:userId/progress
   * Update user progress
   */
  UPDATE_USER_PROGRESS: {
    method: "PUT",
    path: "/api/lms-content/users/:userId/progress",
    params: z4.object({
      userId: z4.string().min(1)
    }),
    body: UpdateUserProgressRequestSchema,
    response: UserProgressResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["progress:update"]
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
    params: z4.object({
      quizQuestionId: QuizQuestionIdSchema
    }),
    body: SubmitQuizAnswerRequestSchema.omit({ quizQuestionId: true }),
    response: QuizAttemptResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["quiz:submit"]
  },
  /**
   * GET /api/lms-content/users/:userId/quiz-attempts
   * Get user's quiz attempts
   */
  GET_USER_QUIZ_ATTEMPTS: {
    method: "GET",
    path: "/api/lms-content/users/:userId/quiz-attempts",
    params: z4.object({
      userId: z4.string().min(1)
    }),
    query: QuizAttemptsQuerySchema.omit({ userId: true }),
    response: z4.object({
      success: z4.literal(true),
      data: z4.array(QuizAttemptResponseSchema.shape.data),
      version: z4.literal("1.0")
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["quiz:read"]
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
    params: z4.object({
      contentBlockId: ContentBlockIdSchema
    }),
    body: TrackContentInteractionRequestSchema.omit({ contentBlockId: true }),
    response: ContentInteractionResponseSchema,
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["interaction:track"]
  },
  /**
   * GET /api/lms-content/users/:userId/content-interactions
   * Get user's content interactions
   */
  GET_USER_CONTENT_INTERACTIONS: {
    method: "GET",
    path: "/api/lms-content/users/:userId/content-interactions",
    params: z4.object({
      userId: z4.string().min(1)
    }),
    query: ContentInteractionsQuerySchema.omit({ userId: true }),
    response: z4.object({
      success: z4.literal(true),
      data: z4.array(ContentInteractionResponseSchema.shape.data),
      version: z4.literal("1.0")
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["interaction:read"]
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
    params: z4.object({
      courseKey: z4.string().min(1).max(100),
      languageCode: LanguageCodeSchema
    }),
    response: z4.object({
      success: z4.literal(true),
      data: z4.object({
        course: z4.object({
          title: z4.string(),
          description: z4.string().optional()
        }),
        sections: z4.array(
          z4.object({
            sectionKey: z4.string(),
            title: z4.string()
          })
        ),
        contentBlocks: z4.array(
          z4.object({
            contentBlockId: ContentBlockIdSchema,
            content: z4.record(z4.string(), z4.unknown())
          })
        ),
        quizQuestions: z4.array(
          z4.object({
            quizQuestionId: QuizQuestionIdSchema,
            questionText: z4.string(),
            options: z4.record(z4.string(), z4.string()).optional(),
            explanation: z4.string().optional()
          })
        )
      }),
      version: z4.literal("1.0")
    }),
    error: LmsContentErrorResponseSchema,
    auth: true,
    permissions: ["courses:read"]
  }
};

// src/index.ts
var PACKAGE_VERSION = "1.0.0";
var PACKAGE_NAME = "@specchem/contracts";
var PACKAGE_DESCRIPTION = "TypeScript contracts and interfaces for Safety System API";
var PACKAGE_METADATA = {
  name: PACKAGE_NAME,
  version: PACKAGE_VERSION,
  description: PACKAGE_DESCRIPTION,
  features: [
    "TypeScript API Contracts",
    "Database Type Re-exports",
    "Authentication Interfaces",
    "Comprehensive Safety Training Contracts",
    "Plant-scoped Multi-tenancy",
    "Role-based Access Control",
    "OpenAPI Specifications",
    "Validation Middleware",
    "Safety Business Contracts",
    "Search and Filter Types",
    "Reporting Interfaces",
    "Error Handling Types"
  ],
  contracts: {
    apiContracts: 25,
    authContracts: 3,
    trainingContracts: 45,
    businessContracts: 4,
    searchContracts: 3,
    reportingContracts: 3,
    errorContracts: 2,
    endpointSpecs: 35,
    openApiSpecs: 1,
    validationMiddleware: 1,
    totalContracts: 122
  },
  safetyTraining: {
    entities: 7,
    requestSchemas: 12,
    responseSchemas: 7,
    paginatedSchemas: 7,
    querySchemas: 6,
    endpointSpecs: 35,
    errorCodes: 21,
    validationUtils: 15,
    integrationSchemas: 2
  },
  compatibility: {
    typescript: "5.0+",
    node: "18.0+",
    nextjs: "14.0+",
    zod: "3.0+"
  }
};
export {
  ActivityEventIdSchema,
  ActivityEventResponseSchema,
  ActivityEventSchema,
  ActivityEventTypeSchema,
  AdminRoleIdSchema,
  AdminRoleResponseSchema,
  AdminRoleSchema,
  AdminRoleTypeSchema,
  BulkEnrollmentRequestSchema,
  BulkEnrollmentResponseSchema,
  ContentBlockIdSchema,
  ContentBlockResponseSchema,
  ContentBlockSchema,
  ContentBlockTranslationIdSchema,
  ContentBlockTranslationSchema,
  ContentBlockTypeSchema,
  ContentInteractionIdSchema,
  ContentInteractionResponseSchema,
  ContentInteractionSchema,
  ContentInteractionsQuerySchema,
  CourseCompletionStatusResponseSchema,
  CourseContentQuerySchema,
  CourseIdSchema,
  CourseMaterialUploadRequestSchema,
  CourseMaterialUploadResponseSchema,
  CourseResponseSchema,
  CourseSchema,
  CourseSearchQuerySchema,
  CourseSectionIdSchema,
  CourseSectionResponseSchema,
  CourseSectionSchema,
  CourseStatusSchema,
  CourseTranslationIdSchema,
  CourseTranslationSchema,
  CourseTypeSchema,
  CourseWithSectionsResponseSchema,
  CreateActivityEventRequestSchema,
  CreateAdminRoleRequestSchema,
  CreateContentBlockRequestSchema,
  CreateCourseRequestSchema,
  CreateCourseSectionRequestSchema,
  CreateEnrollmentRequestSchema,
  CreatePlantRequestSchema,
  CreateQuestionEventRequestSchema,
  CreateQuizQuestionRequestSchema,
  EnrollmentIdSchema,
  EnrollmentResponseSchema,
  EnrollmentSchema,
  EnrollmentSearchQuerySchema,
  EnrollmentStatusSchema,
  InteractionTypeSchema,
  LanguageCodeSchema,
  LmsContentApiEndpoints,
  LmsContentErrorCodeSchema,
  LmsContentErrorResponseSchema,
  PACKAGE_DESCRIPTION,
  PACKAGE_METADATA,
  PACKAGE_NAME,
  PACKAGE_VERSION,
  PaginatedActivityEventResponseSchema,
  PaginatedAdminRoleResponseSchema,
  PaginatedCourseResponseSchema,
  PaginatedEnrollmentResponseSchema,
  PaginatedPlantResponseSchema,
  PaginatedProgressResponseSchema,
  PaginatedQuestionEventResponseSchema,
  PlantIdSchema,
  PlantResponseSchema,
  PlantSchema,
  PlantScopedQuerySchema,
  PlantUserPermissionsSchema,
  ProgressIdSchema,
  ProgressResponseSchema,
  ProgressSchema,
  ProgressSearchQuerySchema,
  ProgressStatusSchema,
  QuestionEventIdSchema,
  QuestionEventResponseSchema,
  QuestionEventSchema,
  QuestionTypeSchema,
  QuizAttemptIdSchema,
  QuizAttemptResponseSchema,
  QuizAttemptSchema,
  QuizAttemptsQuerySchema,
  QuizQuestionIdSchema,
  QuizQuestionResponseSchema,
  QuizQuestionSchema,
  QuizQuestionTranslationIdSchema,
  QuizQuestionTranslationSchema,
  SafetyTrainingApiEndpoints,
  SafetyTrainingErrorCodeSchema,
  SafetyTrainingErrorResponseSchema,
  SafetyTrainingIdSchema,
  SafetyTrainingUserContextSchema,
  SafetyTrainingValidationMiddleware,
  SectionContentQuerySchema,
  SectionTranslationIdSchema,
  SectionTranslationSchema,
  SectionWithContentResponseSchema,
  SubmitQuizAnswerRequestSchema,
  TrackContentInteractionRequestSchema,
  UpdateAdminRoleRequestSchema,
  UpdateContentBlockRequestSchema,
  UpdateCourseRequestSchema,
  UpdateCourseSectionRequestSchema,
  UpdateEnrollmentRequestSchema,
  UpdatePlantRequestSchema,
  UpdateProgressRequestSchema,
  UpdateQuizQuestionRequestSchema,
  UpdateUserProgressRequestSchema,
  UserIdSchema,
  UserProgressIdSchema,
  UserProgressQuerySchema,
  UserProgressResponseSchema,
  UserProgressSchema,
  UserScopedQuerySchema,
  createPaginatedResponseSchema,
  createSafetyTrainingValidationMiddleware,
  generateSafetyTrainingOpenApi,
  safetyTrainingValidation,
  validateAdminRoleType,
  validateCourseId,
  validateCourseType,
  validateDateTime,
  validateDuration,
  validateEmail,
  validateEnrollmentId,
  validateEnrollmentStatus,
  validatePagination,
  validatePlantId,
  validateProgressPercent,
  validateProgressStatus,
  validateSortOrder,
  validateUrl,
  validateUserId,
  zodToOpenApi
};
//# sourceMappingURL=index.js.map