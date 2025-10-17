"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ActivityEventIdSchema: () => ActivityEventIdSchema,
  ActivityEventResponseSchema: () => ActivityEventResponseSchema,
  ActivityEventSchema: () => ActivityEventSchema,
  ActivityEventTypeSchema: () => ActivityEventTypeSchema,
  AdminRoleIdSchema: () => AdminRoleIdSchema,
  AdminRoleResponseSchema: () => AdminRoleResponseSchema,
  AdminRoleSchema: () => AdminRoleSchema,
  AdminRoleTypeSchema: () => AdminRoleTypeSchema,
  BulkEnrollmentRequestSchema: () => BulkEnrollmentRequestSchema,
  BulkEnrollmentResponseSchema: () => BulkEnrollmentResponseSchema,
  ContentBlockIdSchema: () => ContentBlockIdSchema,
  ContentBlockResponseSchema: () => ContentBlockResponseSchema,
  ContentBlockSchema: () => ContentBlockSchema,
  ContentBlockTranslationIdSchema: () => ContentBlockTranslationIdSchema,
  ContentBlockTranslationSchema: () => ContentBlockTranslationSchema,
  ContentBlockTypeSchema: () => ContentBlockTypeSchema,
  ContentInteractionIdSchema: () => ContentInteractionIdSchema,
  ContentInteractionResponseSchema: () => ContentInteractionResponseSchema,
  ContentInteractionSchema: () => ContentInteractionSchema,
  ContentInteractionsQuerySchema: () => ContentInteractionsQuerySchema,
  CourseCompletionStatusResponseSchema: () => CourseCompletionStatusResponseSchema,
  CourseContentQuerySchema: () => CourseContentQuerySchema,
  CourseIdSchema: () => CourseIdSchema,
  CourseMaterialUploadRequestSchema: () => CourseMaterialUploadRequestSchema,
  CourseMaterialUploadResponseSchema: () => CourseMaterialUploadResponseSchema,
  CourseResponseSchema: () => CourseResponseSchema,
  CourseSchema: () => CourseSchema,
  CourseSearchQuerySchema: () => CourseSearchQuerySchema,
  CourseSectionIdSchema: () => CourseSectionIdSchema,
  CourseSectionResponseSchema: () => CourseSectionResponseSchema,
  CourseSectionSchema: () => CourseSectionSchema,
  CourseStatusSchema: () => CourseStatusSchema,
  CourseTranslationIdSchema: () => CourseTranslationIdSchema,
  CourseTranslationSchema: () => CourseTranslationSchema,
  CourseTypeSchema: () => CourseTypeSchema,
  CourseWithSectionsResponseSchema: () => CourseWithSectionsResponseSchema,
  CreateActivityEventRequestSchema: () => CreateActivityEventRequestSchema,
  CreateAdminRoleRequestSchema: () => CreateAdminRoleRequestSchema,
  CreateContentBlockRequestSchema: () => CreateContentBlockRequestSchema,
  CreateCourseRequestSchema: () => CreateCourseRequestSchema,
  CreateCourseSectionRequestSchema: () => CreateCourseSectionRequestSchema,
  CreateEnrollmentRequestSchema: () => CreateEnrollmentRequestSchema,
  CreatePlantRequestSchema: () => CreatePlantRequestSchema,
  CreateQuestionEventRequestSchema: () => CreateQuestionEventRequestSchema,
  CreateQuizQuestionRequestSchema: () => CreateQuizQuestionRequestSchema,
  EnrollmentIdSchema: () => EnrollmentIdSchema,
  EnrollmentResponseSchema: () => EnrollmentResponseSchema,
  EnrollmentSchema: () => EnrollmentSchema,
  EnrollmentSearchQuerySchema: () => EnrollmentSearchQuerySchema,
  EnrollmentStatusSchema: () => EnrollmentStatusSchema,
  InteractionTypeSchema: () => InteractionTypeSchema,
  LanguageCodeSchema: () => LanguageCodeSchema,
  LmsContentApiEndpoints: () => LmsContentApiEndpoints,
  LmsContentErrorCodeSchema: () => LmsContentErrorCodeSchema,
  LmsContentErrorResponseSchema: () => LmsContentErrorResponseSchema,
  PACKAGE_DESCRIPTION: () => PACKAGE_DESCRIPTION,
  PACKAGE_METADATA: () => PACKAGE_METADATA,
  PACKAGE_NAME: () => PACKAGE_NAME,
  PACKAGE_VERSION: () => PACKAGE_VERSION,
  PaginatedActivityEventResponseSchema: () => PaginatedActivityEventResponseSchema,
  PaginatedAdminRoleResponseSchema: () => PaginatedAdminRoleResponseSchema,
  PaginatedCourseResponseSchema: () => PaginatedCourseResponseSchema,
  PaginatedEnrollmentResponseSchema: () => PaginatedEnrollmentResponseSchema,
  PaginatedPlantResponseSchema: () => PaginatedPlantResponseSchema,
  PaginatedProgressResponseSchema: () => PaginatedProgressResponseSchema,
  PaginatedQuestionEventResponseSchema: () => PaginatedQuestionEventResponseSchema,
  PlantIdSchema: () => PlantIdSchema,
  PlantResponseSchema: () => PlantResponseSchema,
  PlantSchema: () => PlantSchema,
  PlantScopedQuerySchema: () => PlantScopedQuerySchema,
  PlantUserPermissionsSchema: () => PlantUserPermissionsSchema,
  ProgressIdSchema: () => ProgressIdSchema,
  ProgressResponseSchema: () => ProgressResponseSchema,
  ProgressSchema: () => ProgressSchema,
  ProgressSearchQuerySchema: () => ProgressSearchQuerySchema,
  ProgressStatusSchema: () => ProgressStatusSchema,
  QuestionEventIdSchema: () => QuestionEventIdSchema,
  QuestionEventResponseSchema: () => QuestionEventResponseSchema,
  QuestionEventSchema: () => QuestionEventSchema,
  QuestionTypeSchema: () => QuestionTypeSchema,
  QuizAttemptIdSchema: () => QuizAttemptIdSchema,
  QuizAttemptResponseSchema: () => QuizAttemptResponseSchema,
  QuizAttemptSchema: () => QuizAttemptSchema,
  QuizAttemptsQuerySchema: () => QuizAttemptsQuerySchema,
  QuizQuestionIdSchema: () => QuizQuestionIdSchema,
  QuizQuestionResponseSchema: () => QuizQuestionResponseSchema,
  QuizQuestionSchema: () => QuizQuestionSchema,
  QuizQuestionTranslationIdSchema: () => QuizQuestionTranslationIdSchema,
  QuizQuestionTranslationSchema: () => QuizQuestionTranslationSchema,
  SafetyTrainingApiEndpoints: () => SafetyTrainingApiEndpoints,
  SafetyTrainingErrorCodeSchema: () => SafetyTrainingErrorCodeSchema,
  SafetyTrainingErrorResponseSchema: () => SafetyTrainingErrorResponseSchema,
  SafetyTrainingIdSchema: () => SafetyTrainingIdSchema,
  SafetyTrainingUserContextSchema: () => SafetyTrainingUserContextSchema,
  SafetyTrainingValidationMiddleware: () => SafetyTrainingValidationMiddleware,
  SectionContentQuerySchema: () => SectionContentQuerySchema,
  SectionTranslationIdSchema: () => SectionTranslationIdSchema,
  SectionTranslationSchema: () => SectionTranslationSchema,
  SectionWithContentResponseSchema: () => SectionWithContentResponseSchema,
  SubmitQuizAnswerRequestSchema: () => SubmitQuizAnswerRequestSchema,
  TrackContentInteractionRequestSchema: () => TrackContentInteractionRequestSchema,
  UpdateAdminRoleRequestSchema: () => UpdateAdminRoleRequestSchema,
  UpdateContentBlockRequestSchema: () => UpdateContentBlockRequestSchema,
  UpdateCourseRequestSchema: () => UpdateCourseRequestSchema,
  UpdateCourseSectionRequestSchema: () => UpdateCourseSectionRequestSchema,
  UpdateEnrollmentRequestSchema: () => UpdateEnrollmentRequestSchema,
  UpdatePlantRequestSchema: () => UpdatePlantRequestSchema,
  UpdateProgressRequestSchema: () => UpdateProgressRequestSchema,
  UpdateQuizQuestionRequestSchema: () => UpdateQuizQuestionRequestSchema,
  UpdateUserProgressRequestSchema: () => UpdateUserProgressRequestSchema,
  UserIdSchema: () => UserIdSchema,
  UserProgressIdSchema: () => UserProgressIdSchema,
  UserProgressQuerySchema: () => UserProgressQuerySchema,
  UserProgressResponseSchema: () => UserProgressResponseSchema,
  UserProgressSchema: () => UserProgressSchema,
  UserScopedQuerySchema: () => UserScopedQuerySchema,
  createPaginatedResponseSchema: () => createPaginatedResponseSchema,
  createSafetyTrainingValidationMiddleware: () => createSafetyTrainingValidationMiddleware,
  generateSafetyTrainingOpenApi: () => generateSafetyTrainingOpenApi,
  safetyTrainingValidation: () => safetyTrainingValidation,
  validateAdminRoleType: () => validateAdminRoleType,
  validateCourseId: () => validateCourseId,
  validateCourseType: () => validateCourseType,
  validateDateTime: () => validateDateTime,
  validateDuration: () => validateDuration,
  validateEmail: () => validateEmail,
  validateEnrollmentId: () => validateEnrollmentId,
  validateEnrollmentStatus: () => validateEnrollmentStatus,
  validatePagination: () => validatePagination,
  validatePlantId: () => validatePlantId,
  validateProgressPercent: () => validateProgressPercent,
  validateProgressStatus: () => validateProgressStatus,
  validateSortOrder: () => validateSortOrder,
  validateUrl: () => validateUrl,
  validateUserId: () => validateUserId,
  zodToOpenApi: () => zodToOpenApi
});
module.exports = __toCommonJS(index_exports);

// src/safety-training-contracts.ts
var import_zod = require("zod");
var SafetyTrainingIdSchema = import_zod.z.string().uuid().brand();
var CourseIdSchema = import_zod.z.string().uuid().brand();
var EnrollmentIdSchema = import_zod.z.string().uuid().brand();
var ProgressIdSchema = import_zod.z.string().uuid().brand();
var ActivityEventIdSchema = import_zod.z.string().uuid().brand();
var QuestionEventIdSchema = import_zod.z.string().uuid().brand();
var AdminRoleIdSchema = import_zod.z.string().uuid().brand();
var PlantIdSchema = import_zod.z.string().uuid().brand();
var UserIdSchema = import_zod.z.string().uuid().brand();
var CourseStatusSchema = import_zod.z.enum([
  "draft",
  "active",
  "inactive",
  "archived"
]);
var CourseTypeSchema = import_zod.z.enum([
  "safety_orientation",
  "hazard_communication",
  "emergency_response",
  "equipment_operation",
  "compliance_training",
  "certification",
  "refresher",
  "custom"
]);
var EnrollmentStatusSchema = import_zod.z.enum([
  "enrolled",
  "in_progress",
  "completed",
  "failed",
  "expired",
  "cancelled"
]);
var ProgressStatusSchema = import_zod.z.enum([
  "not_started",
  "in_progress",
  "completed",
  "paused",
  "failed"
]);
var ActivityEventTypeSchema = import_zod.z.enum([
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
var AdminRoleTypeSchema = import_zod.z.enum([
  "plant_admin",
  "course_admin",
  "instructor",
  "supervisor",
  "compliance_officer"
]);
var PlantSchema = import_zod.z.object({
  id: PlantIdSchema,
  name: import_zod.z.string().min(1).max(100),
  code: import_zod.z.string().min(1).max(20).optional(),
  description: import_zod.z.string().max(500).optional(),
  location: import_zod.z.string().max(200).optional(),
  isActive: import_zod.z.boolean(),
  createdAt: import_zod.z.string().datetime(),
  updatedAt: import_zod.z.string().datetime()
}).strict();
var CourseSchema = import_zod.z.object({
  id: CourseIdSchema,
  plantId: PlantIdSchema,
  name: import_zod.z.string().min(1).max(200),
  description: import_zod.z.string().max(2e3).optional(),
  type: CourseTypeSchema,
  status: CourseStatusSchema,
  duration: import_zod.z.number().int().min(1),
  // in minutes
  prerequisites: import_zod.z.array(CourseIdSchema).default([]),
  learningObjectives: import_zod.z.array(import_zod.z.string()).default([]),
  materials: import_zod.z.array(
    import_zod.z.object({
      type: import_zod.z.enum(["video", "document", "quiz", "interactive", "other"]),
      url: import_zod.z.string().url().optional(),
      title: import_zod.z.string(),
      description: import_zod.z.string().optional()
    })
  ).default([]),
  passingScore: import_zod.z.number().min(0).max(100).default(80),
  certificateValidDays: import_zod.z.number().int().min(1).optional(),
  isRequired: import_zod.z.boolean().default(false),
  isActive: import_zod.z.boolean(),
  createdAt: import_zod.z.string().datetime(),
  updatedAt: import_zod.z.string().datetime(),
  createdBy: UserIdSchema
}).strict();
var EnrollmentSchema = import_zod.z.object({
  id: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  status: EnrollmentStatusSchema,
  enrolledAt: import_zod.z.string().datetime(),
  startedAt: import_zod.z.string().datetime().optional(),
  completedAt: import_zod.z.string().datetime().optional(),
  expiresAt: import_zod.z.string().datetime().optional(),
  assignedBy: UserIdSchema.optional(),
  notes: import_zod.z.string().max(1e3).optional(),
  isActive: import_zod.z.boolean(),
  createdAt: import_zod.z.string().datetime(),
  updatedAt: import_zod.z.string().datetime()
}).strict();
var ProgressSchema = import_zod.z.object({
  id: ProgressIdSchema,
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  status: ProgressStatusSchema,
  progressPercent: import_zod.z.number().min(0).max(100).default(0),
  currentSection: import_zod.z.string().optional(),
  timeSpent: import_zod.z.number().int().min(0).default(0),
  // in minutes
  lastAccessedAt: import_zod.z.string().datetime().optional(),
  completedSections: import_zod.z.array(import_zod.z.string()).default([]),
  quizScores: import_zod.z.array(
    import_zod.z.object({
      sectionKey: import_zod.z.string(),
      score: import_zod.z.number().min(0).max(100),
      attempts: import_zod.z.number().int().min(1),
      completedAt: import_zod.z.string().datetime()
    })
  ).default([]),
  isActive: import_zod.z.boolean(),
  createdAt: import_zod.z.string().datetime(),
  updatedAt: import_zod.z.string().datetime()
}).strict();
var ActivityEventSchema = import_zod.z.object({
  id: ActivityEventIdSchema,
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  eventType: ActivityEventTypeSchema,
  sectionKey: import_zod.z.string().optional(),
  meta: import_zod.z.record(import_zod.z.string(), import_zod.z.unknown()).optional(),
  occurredAt: import_zod.z.string().datetime(),
  createdAt: import_zod.z.string().datetime()
}).strict();
var QuestionEventSchema = import_zod.z.object({
  id: QuestionEventIdSchema,
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  sectionKey: import_zod.z.string(),
  questionKey: import_zod.z.string(),
  isCorrect: import_zod.z.boolean(),
  attemptIndex: import_zod.z.number().int().min(1).default(1),
  responseMeta: import_zod.z.record(import_zod.z.string(), import_zod.z.unknown()).optional(),
  answeredAt: import_zod.z.string().datetime(),
  createdAt: import_zod.z.string().datetime()
}).strict();
var AdminRoleSchema = import_zod.z.object({
  id: AdminRoleIdSchema,
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  roleType: AdminRoleTypeSchema,
  permissions: import_zod.z.array(import_zod.z.string()).default([]),
  isActive: import_zod.z.boolean(),
  assignedAt: import_zod.z.string().datetime(),
  assignedBy: UserIdSchema,
  expiresAt: import_zod.z.string().datetime().optional(),
  createdAt: import_zod.z.string().datetime(),
  updatedAt: import_zod.z.string().datetime()
}).strict();
var CreatePlantRequestSchema = import_zod.z.object({
  name: import_zod.z.string().min(1).max(100),
  code: import_zod.z.string().min(1).max(20).optional(),
  description: import_zod.z.string().max(500).optional(),
  location: import_zod.z.string().max(200).optional()
}).strict();
var UpdatePlantRequestSchema = CreatePlantRequestSchema.partial().strict();
var CreateCourseRequestSchema = import_zod.z.object({
  plantId: PlantIdSchema,
  name: import_zod.z.string().min(1).max(200),
  description: import_zod.z.string().max(2e3).optional(),
  type: CourseTypeSchema,
  duration: import_zod.z.number().int().min(1),
  prerequisites: import_zod.z.array(CourseIdSchema).default([]),
  learningObjectives: import_zod.z.array(import_zod.z.string()).default([]),
  materials: import_zod.z.array(
    import_zod.z.object({
      type: import_zod.z.enum(["video", "document", "quiz", "interactive", "other"]),
      url: import_zod.z.string().url().optional(),
      title: import_zod.z.string(),
      description: import_zod.z.string().optional()
    })
  ).default([]),
  passingScore: import_zod.z.number().min(0).max(100).default(80),
  certificateValidDays: import_zod.z.number().int().min(1).optional(),
  isRequired: import_zod.z.boolean().default(false)
}).strict();
var UpdateCourseRequestSchema = CreateCourseRequestSchema.partial().strict();
var CreateEnrollmentRequestSchema = import_zod.z.object({
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  expiresAt: import_zod.z.string().datetime().optional(),
  assignedBy: UserIdSchema.optional(),
  notes: import_zod.z.string().max(1e3).optional()
}).strict();
var UpdateEnrollmentRequestSchema = CreateEnrollmentRequestSchema.partial().strict();
var UpdateProgressRequestSchema = import_zod.z.object({
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  status: ProgressStatusSchema.optional(),
  progressPercent: import_zod.z.number().min(0).max(100).optional(),
  currentSection: import_zod.z.string().optional(),
  timeSpent: import_zod.z.number().int().min(0).optional(),
  completedSections: import_zod.z.array(import_zod.z.string()).optional(),
  quizScore: import_zod.z.object({
    sectionKey: import_zod.z.string(),
    score: import_zod.z.number().min(0).max(100),
    attempts: import_zod.z.number().int().min(1)
  }).optional()
}).strict();
var CreateActivityEventRequestSchema = import_zod.z.object({
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  eventType: ActivityEventTypeSchema,
  sectionKey: import_zod.z.string().optional(),
  meta: import_zod.z.record(import_zod.z.string(), import_zod.z.unknown()).optional()
}).strict();
var CreateQuestionEventRequestSchema = import_zod.z.object({
  enrollmentId: EnrollmentIdSchema,
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  sectionKey: import_zod.z.string(),
  questionKey: import_zod.z.string(),
  isCorrect: import_zod.z.boolean(),
  attemptIndex: import_zod.z.number().int().min(1).default(1),
  responseMeta: import_zod.z.record(import_zod.z.string(), import_zod.z.unknown()).optional()
}).strict();
var CreateAdminRoleRequestSchema = import_zod.z.object({
  plantId: PlantIdSchema,
  userId: UserIdSchema,
  roleType: AdminRoleTypeSchema,
  permissions: import_zod.z.array(import_zod.z.string()).default([]),
  expiresAt: import_zod.z.string().datetime().optional(),
  assignedBy: UserIdSchema
}).strict();
var UpdateAdminRoleRequestSchema = CreateAdminRoleRequestSchema.partial().strict();
var PlantScopedQuerySchema = import_zod.z.object({
  plantId: PlantIdSchema,
  page: import_zod.z.number().int().min(1).default(1),
  limit: import_zod.z.number().int().min(1).max(100).default(20),
  sortBy: import_zod.z.string().optional(),
  sortOrder: import_zod.z.enum(["asc", "desc"]).default("desc")
}).strict();
var UserScopedQuerySchema = import_zod.z.object({
  userId: UserIdSchema,
  plantId: PlantIdSchema.optional(),
  page: import_zod.z.number().int().min(1).default(1),
  limit: import_zod.z.number().int().min(1).max(100).default(20),
  sortBy: import_zod.z.string().optional(),
  sortOrder: import_zod.z.enum(["asc", "desc"]).default("desc")
}).strict();
var CourseSearchQuerySchema = import_zod.z.object({
  plantId: PlantIdSchema,
  query: import_zod.z.string().min(1).max(200).optional(),
  type: CourseTypeSchema.optional(),
  status: CourseStatusSchema.optional(),
  isRequired: import_zod.z.boolean().optional(),
  page: import_zod.z.number().int().min(1).default(1),
  limit: import_zod.z.number().int().min(1).max(100).default(20),
  sortBy: import_zod.z.string().optional(),
  sortOrder: import_zod.z.enum(["asc", "desc"]).default("desc")
}).strict();
var EnrollmentSearchQuerySchema = import_zod.z.object({
  plantId: PlantIdSchema,
  userId: UserIdSchema.optional(),
  courseId: CourseIdSchema.optional(),
  status: EnrollmentStatusSchema.optional(),
  query: import_zod.z.string().min(1).max(200).optional(),
  page: import_zod.z.number().int().min(1).default(1),
  limit: import_zod.z.number().int().min(1).max(100).default(20),
  sortBy: import_zod.z.string().optional(),
  sortOrder: import_zod.z.enum(["asc", "desc"]).default("desc")
}).strict();
var ProgressSearchQuerySchema = import_zod.z.object({
  plantId: PlantIdSchema,
  userId: UserIdSchema.optional(),
  courseId: CourseIdSchema.optional(),
  status: ProgressStatusSchema.optional(),
  page: import_zod.z.number().int().min(1).default(1),
  limit: import_zod.z.number().int().min(1).max(100).default(20),
  sortBy: import_zod.z.string().optional(),
  sortOrder: import_zod.z.enum(["asc", "desc"]).default("desc")
}).strict();
var PlantResponseSchema = import_zod.z.object({
  success: import_zod.z.literal(true),
  data: PlantSchema,
  version: import_zod.z.literal("1.0"),
  metadata: import_zod.z.object({
    timestamp: import_zod.z.string().datetime(),
    requestId: import_zod.z.string().optional()
  }).optional()
}).strict();
var CourseResponseSchema = import_zod.z.object({
  success: import_zod.z.literal(true),
  data: CourseSchema,
  version: import_zod.z.literal("1.0"),
  metadata: import_zod.z.object({
    timestamp: import_zod.z.string().datetime(),
    requestId: import_zod.z.string().optional()
  }).optional()
}).strict();
var EnrollmentResponseSchema = import_zod.z.object({
  success: import_zod.z.literal(true),
  data: EnrollmentSchema,
  version: import_zod.z.literal("1.0"),
  metadata: import_zod.z.object({
    timestamp: import_zod.z.string().datetime(),
    requestId: import_zod.z.string().optional()
  }).optional()
}).strict();
var ProgressResponseSchema = import_zod.z.object({
  success: import_zod.z.literal(true),
  data: ProgressSchema,
  version: import_zod.z.literal("1.0"),
  metadata: import_zod.z.object({
    timestamp: import_zod.z.string().datetime(),
    requestId: import_zod.z.string().optional()
  }).optional()
}).strict();
var ActivityEventResponseSchema = import_zod.z.object({
  success: import_zod.z.literal(true),
  data: ActivityEventSchema,
  version: import_zod.z.literal("1.0"),
  metadata: import_zod.z.object({
    timestamp: import_zod.z.string().datetime(),
    requestId: import_zod.z.string().optional()
  }).optional()
}).strict();
var QuestionEventResponseSchema = import_zod.z.object({
  success: import_zod.z.literal(true),
  data: QuestionEventSchema,
  version: import_zod.z.literal("1.0"),
  metadata: import_zod.z.object({
    timestamp: import_zod.z.string().datetime(),
    requestId: import_zod.z.string().optional()
  }).optional()
}).strict();
var AdminRoleResponseSchema = import_zod.z.object({
  success: import_zod.z.literal(true),
  data: AdminRoleSchema,
  version: import_zod.z.literal("1.0"),
  metadata: import_zod.z.object({
    timestamp: import_zod.z.string().datetime(),
    requestId: import_zod.z.string().optional()
  }).optional()
}).strict();
var createPaginatedResponseSchema = (dataSchema) => import_zod.z.object({
  success: import_zod.z.literal(true),
  data: import_zod.z.array(dataSchema),
  pagination: import_zod.z.object({
    page: import_zod.z.number().int().min(1),
    limit: import_zod.z.number().int().min(1).max(100),
    total: import_zod.z.number().int().min(0),
    totalPages: import_zod.z.number().int().min(0),
    hasNext: import_zod.z.boolean(),
    hasPrev: import_zod.z.boolean()
  }),
  version: import_zod.z.literal("1.0"),
  metadata: import_zod.z.object({
    timestamp: import_zod.z.string().datetime(),
    requestId: import_zod.z.string().optional()
  }).optional()
}).strict();
var PaginatedPlantResponseSchema = createPaginatedResponseSchema(PlantSchema);
var PaginatedCourseResponseSchema = createPaginatedResponseSchema(CourseSchema);
var PaginatedEnrollmentResponseSchema = createPaginatedResponseSchema(EnrollmentSchema);
var PaginatedProgressResponseSchema = createPaginatedResponseSchema(ProgressSchema);
var PaginatedActivityEventResponseSchema = createPaginatedResponseSchema(ActivityEventSchema);
var PaginatedQuestionEventResponseSchema = createPaginatedResponseSchema(QuestionEventSchema);
var PaginatedAdminRoleResponseSchema = createPaginatedResponseSchema(AdminRoleSchema);
var SafetyTrainingErrorCodeSchema = import_zod.z.enum([
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
var SafetyTrainingErrorResponseSchema = import_zod.z.object({
  success: import_zod.z.literal(false),
  error: import_zod.z.object({
    code: SafetyTrainingErrorCodeSchema,
    message: import_zod.z.string().min(1),
    details: import_zod.z.array(
      import_zod.z.object({
        field: import_zod.z.string().optional(),
        message: import_zod.z.string(),
        code: import_zod.z.string().optional()
      })
    ).optional(),
    requestId: import_zod.z.string().optional(),
    timestamp: import_zod.z.string().datetime(),
    path: import_zod.z.string().optional(),
    method: import_zod.z.string().optional(),
    plantId: PlantIdSchema.optional(),
    userId: UserIdSchema.optional()
  }),
  version: import_zod.z.literal("1.0")
}).strict();
var SafetyTrainingUserContextSchema = import_zod.z.object({
  user: import_zod.z.object({
    id: UserIdSchema,
    authUserId: import_zod.z.string().uuid(),
    email: import_zod.z.string().email(),
    firstName: import_zod.z.string(),
    lastName: import_zod.z.string(),
    role: import_zod.z.string(),
    territoryId: import_zod.z.string().uuid().optional()
  }),
  plantAccess: import_zod.z.array(
    import_zod.z.object({
      plantId: PlantIdSchema,
      plantName: import_zod.z.string(),
      permissions: import_zod.z.array(import_zod.z.string()),
      adminRoles: import_zod.z.array(AdminRoleTypeSchema)
    })
  ),
  session: import_zod.z.object({
    accessToken: import_zod.z.string(),
    refreshToken: import_zod.z.string(),
    expiresAt: import_zod.z.string().datetime()
  })
}).strict();
var PlantUserPermissionsSchema = import_zod.z.object({
  userId: UserIdSchema,
  plantId: PlantIdSchema,
  canViewCourses: import_zod.z.boolean(),
  canCreateCourses: import_zod.z.boolean(),
  canEditCourses: import_zod.z.boolean(),
  canDeleteCourses: import_zod.z.boolean(),
  canViewEnrollments: import_zod.z.boolean(),
  canCreateEnrollments: import_zod.z.boolean(),
  canEditEnrollments: import_zod.z.boolean(),
  canViewProgress: import_zod.z.boolean(),
  canEditProgress: import_zod.z.boolean(),
  canViewReports: import_zod.z.boolean(),
  canManageUsers: import_zod.z.boolean(),
  adminRoles: import_zod.z.array(AdminRoleTypeSchema)
}).strict();
var BulkEnrollmentRequestSchema = import_zod.z.object({
  plantId: PlantIdSchema,
  courseId: CourseIdSchema,
  userIds: import_zod.z.array(UserIdSchema).min(1).max(100),
  expiresAt: import_zod.z.string().datetime().optional(),
  assignedBy: UserIdSchema.optional(),
  notes: import_zod.z.string().max(1e3).optional()
}).strict();
var BulkEnrollmentResponseSchema = import_zod.z.object({
  success: import_zod.z.literal(true),
  data: import_zod.z.object({
    created: import_zod.z.array(EnrollmentSchema),
    failed: import_zod.z.array(
      import_zod.z.object({
        userId: UserIdSchema,
        error: import_zod.z.string()
      })
    ),
    total: import_zod.z.number().int(),
    successCount: import_zod.z.number().int(),
    failureCount: import_zod.z.number().int()
  }),
  version: import_zod.z.literal("1.0"),
  metadata: import_zod.z.object({
    timestamp: import_zod.z.string().datetime(),
    requestId: import_zod.z.string().optional()
  }).optional()
}).strict();
var CourseMaterialUploadRequestSchema = import_zod.z.object({
  courseId: CourseIdSchema,
  plantId: PlantIdSchema,
  materialType: import_zod.z.enum(["video", "document", "interactive", "other"]),
  title: import_zod.z.string().min(1).max(200),
  description: import_zod.z.string().max(1e3).optional(),
  file: import_zod.z.instanceof(File).optional(),
  url: import_zod.z.string().url().optional()
}).strict();
var CourseMaterialUploadResponseSchema = import_zod.z.object({
  success: import_zod.z.literal(true),
  data: import_zod.z.object({
    materialId: import_zod.z.string().uuid(),
    courseId: CourseIdSchema,
    materialType: import_zod.z.string(),
    title: import_zod.z.string(),
    url: import_zod.z.string().url().optional(),
    fileSize: import_zod.z.number().int().optional(),
    uploadedAt: import_zod.z.string().datetime()
  }),
  version: import_zod.z.literal("1.0"),
  metadata: import_zod.z.object({
    timestamp: import_zod.z.string().datetime(),
    requestId: import_zod.z.string().optional()
  }).optional()
}).strict();

// src/safety-training-endpoints.ts
var import_zod2 = require("zod");
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
    query: import_zod2.z.object({
      page: import_zod2.z.number().int().min(1).default(1),
      limit: import_zod2.z.number().int().min(1).max(100).default(20),
      sortBy: import_zod2.z.string().optional(),
      sortOrder: import_zod2.z.enum(["asc", "desc"]).default("desc"),
      search: import_zod2.z.string().optional()
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
      plantId: PlantIdSchema
    }),
    response: import_zod2.z.object({
      success: import_zod2.z.literal(true),
      message: import_zod2.z.string(),
      version: import_zod2.z.literal("1.0")
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
      plantId: PlantIdSchema,
      courseId: CourseIdSchema
    }),
    response: import_zod2.z.object({
      success: import_zod2.z.literal(true),
      message: import_zod2.z.string(),
      version: import_zod2.z.literal("1.0")
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
      plantId: PlantIdSchema,
      enrollmentId: EnrollmentIdSchema
    }),
    response: import_zod2.z.object({
      success: import_zod2.z.literal(true),
      message: import_zod2.z.string(),
      version: import_zod2.z.literal("1.0")
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
      plantId: PlantIdSchema
    }),
    query: PlantScopedQuerySchema.omit({ plantId: true }).extend({
      userId: UserIdSchema.optional(),
      courseId: CourseIdSchema.optional(),
      eventType: import_zod2.z.string().optional(),
      dateFrom: import_zod2.z.string().datetime().optional(),
      dateTo: import_zod2.z.string().datetime().optional()
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
      plantId: PlantIdSchema
    }),
    query: PlantScopedQuerySchema.omit({ plantId: true }).extend({
      userId: UserIdSchema.optional(),
      courseId: CourseIdSchema.optional(),
      sectionKey: import_zod2.z.string().optional(),
      questionKey: import_zod2.z.string().optional(),
      isCorrect: import_zod2.z.boolean().optional(),
      dateFrom: import_zod2.z.string().datetime().optional(),
      dateTo: import_zod2.z.string().datetime().optional()
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
      plantId: PlantIdSchema
    }),
    query: PlantScopedQuerySchema.omit({ plantId: true }).extend({
      userId: UserIdSchema.optional(),
      roleType: import_zod2.z.string().optional()
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
      plantId: PlantIdSchema,
      adminRoleId: AdminRoleIdSchema
    }),
    response: import_zod2.z.object({
      success: import_zod2.z.literal(true),
      message: import_zod2.z.string(),
      version: import_zod2.z.literal("1.0")
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
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
    params: import_zod2.z.object({
      plantId: PlantIdSchema,
      userId: UserIdSchema
    }),
    response: import_zod2.z.object({
      success: import_zod2.z.literal(true),
      data: PlantUserPermissionsSchema,
      version: import_zod2.z.literal("1.0")
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
    params: import_zod2.z.object({
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
var import_zod3 = require("zod");
var CourseSectionIdSchema = import_zod3.z.string().uuid().brand();
var ContentBlockIdSchema = import_zod3.z.string().uuid().brand();
var QuizQuestionIdSchema = import_zod3.z.string().uuid().brand();
var UserProgressIdSchema = import_zod3.z.string().uuid().brand();
var QuizAttemptIdSchema = import_zod3.z.string().uuid().brand();
var ContentInteractionIdSchema = import_zod3.z.string().uuid().brand();
var CourseTranslationIdSchema = import_zod3.z.string().uuid().brand();
var SectionTranslationIdSchema = import_zod3.z.string().uuid().brand();
var ContentBlockTranslationIdSchema = import_zod3.z.string().uuid().brand();
var QuizQuestionTranslationIdSchema = import_zod3.z.string().uuid().brand();
var ContentBlockTypeSchema = import_zod3.z.enum([
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
var QuestionTypeSchema = import_zod3.z.enum(["true-false", "multiple-choice"]);
var LanguageCodeSchema = import_zod3.z.enum(["en", "es", "fr", "de"]);
var InteractionTypeSchema = import_zod3.z.enum([
  "view",
  "click",
  "expand",
  "collapse",
  "download",
  "share"
]);
var CourseSectionSchema = import_zod3.z.object({
  id: CourseSectionIdSchema,
  courseId: import_zod3.z.string().uuid(),
  sectionKey: import_zod3.z.string().min(1).max(100),
  title: import_zod3.z.string().min(1).max(200),
  orderIndex: import_zod3.z.number().int().min(0),
  iconName: import_zod3.z.string().max(50).optional(),
  isPublished: import_zod3.z.boolean(),
  createdAt: import_zod3.z.string().datetime(),
  updatedAt: import_zod3.z.string().datetime()
}).strict();
var ContentBlockSchema = import_zod3.z.object({
  id: ContentBlockIdSchema,
  sectionId: CourseSectionIdSchema,
  blockType: ContentBlockTypeSchema,
  orderIndex: import_zod3.z.number().int().min(0),
  content: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.unknown()),
  metadata: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.unknown()).optional(),
  createdAt: import_zod3.z.string().datetime(),
  updatedAt: import_zod3.z.string().datetime()
}).strict();
var QuizQuestionSchema = import_zod3.z.object({
  id: QuizQuestionIdSchema,
  sectionId: CourseSectionIdSchema,
  questionKey: import_zod3.z.string().min(1).max(100),
  questionType: QuestionTypeSchema,
  questionText: import_zod3.z.string().min(1).max(1e3),
  options: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.string()).optional(),
  correctAnswer: import_zod3.z.union([import_zod3.z.string(), import_zod3.z.boolean(), import_zod3.z.number()]),
  explanation: import_zod3.z.string().max(2e3).optional(),
  orderIndex: import_zod3.z.number().int().min(0).default(0),
  isPublished: import_zod3.z.boolean(),
  createdAt: import_zod3.z.string().datetime(),
  updatedAt: import_zod3.z.string().datetime()
}).strict();
var CourseTranslationSchema = import_zod3.z.object({
  id: CourseTranslationIdSchema,
  courseId: import_zod3.z.string().uuid(),
  languageCode: LanguageCodeSchema,
  title: import_zod3.z.string().min(1).max(200),
  description: import_zod3.z.string().max(2e3).optional(),
  createdAt: import_zod3.z.string().datetime(),
  updatedAt: import_zod3.z.string().datetime()
}).strict();
var SectionTranslationSchema = import_zod3.z.object({
  id: SectionTranslationIdSchema,
  sectionId: CourseSectionIdSchema,
  languageCode: LanguageCodeSchema,
  title: import_zod3.z.string().min(1).max(200),
  createdAt: import_zod3.z.string().datetime(),
  updatedAt: import_zod3.z.string().datetime()
}).strict();
var ContentBlockTranslationSchema = import_zod3.z.object({
  id: ContentBlockTranslationIdSchema,
  contentBlockId: ContentBlockIdSchema,
  languageCode: LanguageCodeSchema,
  content: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.unknown()),
  createdAt: import_zod3.z.string().datetime(),
  updatedAt: import_zod3.z.string().datetime()
}).strict();
var QuizQuestionTranslationSchema = import_zod3.z.object({
  id: QuizQuestionTranslationIdSchema,
  quizQuestionId: QuizQuestionIdSchema,
  languageCode: LanguageCodeSchema,
  questionText: import_zod3.z.string().min(1).max(1e3),
  options: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.string()).optional(),
  correctAnswer: import_zod3.z.union([import_zod3.z.string(), import_zod3.z.boolean(), import_zod3.z.number()]),
  explanation: import_zod3.z.string().max(2e3).optional(),
  createdAt: import_zod3.z.string().datetime(),
  updatedAt: import_zod3.z.string().datetime()
}).strict();
var UserProgressSchema = import_zod3.z.object({
  id: UserProgressIdSchema,
  userId: import_zod3.z.string().min(1),
  courseId: import_zod3.z.string().uuid(),
  sectionId: CourseSectionIdSchema,
  isCompleted: import_zod3.z.boolean(),
  completionPercentage: import_zod3.z.number().int().min(0).max(100),
  timeSpentSeconds: import_zod3.z.number().int().min(0),
  lastAccessedAt: import_zod3.z.string().datetime(),
  completedAt: import_zod3.z.string().datetime().optional(),
  createdAt: import_zod3.z.string().datetime(),
  updatedAt: import_zod3.z.string().datetime()
}).strict();
var QuizAttemptSchema = import_zod3.z.object({
  id: QuizAttemptIdSchema,
  userId: import_zod3.z.string().min(1),
  quizQuestionId: QuizQuestionIdSchema,
  userAnswer: import_zod3.z.union([import_zod3.z.string(), import_zod3.z.boolean(), import_zod3.z.number()]),
  isCorrect: import_zod3.z.boolean(),
  attemptedAt: import_zod3.z.string().datetime(),
  timeSpentSeconds: import_zod3.z.number().int().min(0)
}).strict();
var ContentInteractionSchema = import_zod3.z.object({
  id: ContentInteractionIdSchema,
  userId: import_zod3.z.string().min(1),
  contentBlockId: ContentBlockIdSchema,
  interactionType: InteractionTypeSchema,
  metadata: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.unknown()).optional(),
  interactedAt: import_zod3.z.string().datetime()
}).strict();
var CreateCourseSectionRequestSchema = import_zod3.z.object({
  courseId: import_zod3.z.string().uuid(),
  sectionKey: import_zod3.z.string().min(1).max(100),
  title: import_zod3.z.string().min(1).max(200),
  orderIndex: import_zod3.z.number().int().min(0),
  iconName: import_zod3.z.string().max(50).optional(),
  isPublished: import_zod3.z.boolean().default(false)
}).strict();
var UpdateCourseSectionRequestSchema = CreateCourseSectionRequestSchema.partial().strict();
var CreateContentBlockRequestSchema = import_zod3.z.object({
  sectionId: CourseSectionIdSchema,
  blockType: ContentBlockTypeSchema,
  orderIndex: import_zod3.z.number().int().min(0),
  content: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.unknown()),
  metadata: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.unknown()).optional()
}).strict();
var UpdateContentBlockRequestSchema = CreateContentBlockRequestSchema.partial().strict();
var CreateQuizQuestionRequestSchema = import_zod3.z.object({
  sectionId: CourseSectionIdSchema,
  questionKey: import_zod3.z.string().min(1).max(100),
  questionType: QuestionTypeSchema,
  questionText: import_zod3.z.string().min(1).max(1e3),
  options: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.string()).optional(),
  correctAnswer: import_zod3.z.union([import_zod3.z.string(), import_zod3.z.boolean(), import_zod3.z.number()]),
  explanation: import_zod3.z.string().max(2e3).optional(),
  orderIndex: import_zod3.z.number().int().min(0).default(0),
  isPublished: import_zod3.z.boolean().default(false)
}).strict();
var UpdateQuizQuestionRequestSchema = CreateQuizQuestionRequestSchema.partial().strict();
var SubmitQuizAnswerRequestSchema = import_zod3.z.object({
  quizQuestionId: QuizQuestionIdSchema,
  userAnswer: import_zod3.z.union([import_zod3.z.string(), import_zod3.z.boolean(), import_zod3.z.number()]),
  timeSpentSeconds: import_zod3.z.number().int().min(0).default(0)
}).strict();
var UpdateUserProgressRequestSchema = import_zod3.z.object({
  courseId: import_zod3.z.string().uuid(),
  sectionId: CourseSectionIdSchema,
  isCompleted: import_zod3.z.boolean().optional(),
  completionPercentage: import_zod3.z.number().int().min(0).max(100).optional(),
  timeSpentSeconds: import_zod3.z.number().int().min(0).optional()
}).strict();
var TrackContentInteractionRequestSchema = import_zod3.z.object({
  contentBlockId: ContentBlockIdSchema,
  interactionType: InteractionTypeSchema,
  metadata: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.unknown()).optional()
}).strict();
var CourseContentQuerySchema = import_zod3.z.object({
  courseKey: import_zod3.z.string().min(1).max(100),
  languageCode: LanguageCodeSchema.default("en"),
  includeUnpublished: import_zod3.z.boolean().default(false)
}).strict();
var SectionContentQuerySchema = import_zod3.z.object({
  courseKey: import_zod3.z.string().min(1).max(100),
  sectionKey: import_zod3.z.string().min(1).max(100),
  languageCode: LanguageCodeSchema.default("en"),
  includeUnpublished: import_zod3.z.boolean().default(false)
}).strict();
var UserProgressQuerySchema = import_zod3.z.object({
  userId: import_zod3.z.string().min(1),
  courseId: import_zod3.z.string().uuid().optional(),
  sectionId: CourseSectionIdSchema.optional(),
  isCompleted: import_zod3.z.boolean().optional()
}).strict();
var QuizAttemptsQuerySchema = import_zod3.z.object({
  userId: import_zod3.z.string().min(1),
  quizQuestionId: QuizQuestionIdSchema.optional(),
  isCorrect: import_zod3.z.boolean().optional(),
  dateFrom: import_zod3.z.string().datetime().optional(),
  dateTo: import_zod3.z.string().datetime().optional()
}).strict();
var ContentInteractionsQuerySchema = import_zod3.z.object({
  userId: import_zod3.z.string().min(1),
  contentBlockId: ContentBlockIdSchema.optional(),
  interactionType: InteractionTypeSchema.optional(),
  dateFrom: import_zod3.z.string().datetime().optional(),
  dateTo: import_zod3.z.string().datetime().optional()
}).strict();
var CourseSectionResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: CourseSectionSchema,
  version: import_zod3.z.literal("1.0"),
  metadata: import_zod3.z.object({
    timestamp: import_zod3.z.string().datetime(),
    requestId: import_zod3.z.string().optional()
  }).optional()
}).strict();
var ContentBlockResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: ContentBlockSchema,
  version: import_zod3.z.literal("1.0"),
  metadata: import_zod3.z.object({
    timestamp: import_zod3.z.string().datetime(),
    requestId: import_zod3.z.string().optional()
  }).optional()
}).strict();
var QuizQuestionResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: QuizQuestionSchema,
  version: import_zod3.z.literal("1.0"),
  metadata: import_zod3.z.object({
    timestamp: import_zod3.z.string().datetime(),
    requestId: import_zod3.z.string().optional()
  }).optional()
}).strict();
var UserProgressResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: UserProgressSchema,
  version: import_zod3.z.literal("1.0"),
  metadata: import_zod3.z.object({
    timestamp: import_zod3.z.string().datetime(),
    requestId: import_zod3.z.string().optional()
  }).optional()
}).strict();
var QuizAttemptResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: QuizAttemptSchema,
  version: import_zod3.z.literal("1.0"),
  metadata: import_zod3.z.object({
    timestamp: import_zod3.z.string().datetime(),
    requestId: import_zod3.z.string().optional()
  }).optional()
}).strict();
var ContentInteractionResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: ContentInteractionSchema,
  version: import_zod3.z.literal("1.0"),
  metadata: import_zod3.z.object({
    timestamp: import_zod3.z.string().datetime(),
    requestId: import_zod3.z.string().optional()
  }).optional()
}).strict();
var CourseWithSectionsResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: import_zod3.z.object({
    course: import_zod3.z.object({
      id: import_zod3.z.string().uuid(),
      courseKey: import_zod3.z.string(),
      title: import_zod3.z.string(),
      description: import_zod3.z.string().optional(),
      version: import_zod3.z.string(),
      isPublished: import_zod3.z.boolean()
    }),
    sections: import_zod3.z.array(CourseSectionSchema)
  }),
  version: import_zod3.z.literal("1.0"),
  metadata: import_zod3.z.object({
    timestamp: import_zod3.z.string().datetime(),
    requestId: import_zod3.z.string().optional()
  }).optional()
}).strict();
var SectionWithContentResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: import_zod3.z.object({
    section: CourseSectionSchema,
    contentBlocks: import_zod3.z.array(ContentBlockSchema),
    quizQuestions: import_zod3.z.array(QuizQuestionSchema)
  }),
  version: import_zod3.z.literal("1.0"),
  metadata: import_zod3.z.object({
    timestamp: import_zod3.z.string().datetime(),
    requestId: import_zod3.z.string().optional()
  }).optional()
}).strict();
var CourseCompletionStatusResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(true),
  data: import_zod3.z.object({
    courseId: import_zod3.z.string().uuid(),
    userId: import_zod3.z.string(),
    totalSections: import_zod3.z.number().int().min(0),
    completedSections: import_zod3.z.number().int().min(0),
    completionPercentage: import_zod3.z.number().int().min(0).max(100),
    timeSpentSeconds: import_zod3.z.number().int().min(0),
    lastAccessedAt: import_zod3.z.string().datetime(),
    completedAt: import_zod3.z.string().datetime().optional()
  }),
  version: import_zod3.z.literal("1.0"),
  metadata: import_zod3.z.object({
    timestamp: import_zod3.z.string().datetime(),
    requestId: import_zod3.z.string().optional()
  }).optional()
}).strict();
var LmsContentErrorCodeSchema = import_zod3.z.enum([
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
var LmsContentErrorResponseSchema = import_zod3.z.object({
  success: import_zod3.z.literal(false),
  error: import_zod3.z.object({
    code: LmsContentErrorCodeSchema,
    message: import_zod3.z.string().min(1),
    details: import_zod3.z.array(
      import_zod3.z.object({
        field: import_zod3.z.string().optional(),
        message: import_zod3.z.string(),
        code: import_zod3.z.string().optional()
      })
    ).optional(),
    requestId: import_zod3.z.string().optional(),
    timestamp: import_zod3.z.string().datetime(),
    path: import_zod3.z.string().optional(),
    method: import_zod3.z.string().optional(),
    courseId: import_zod3.z.string().uuid().optional(),
    userId: import_zod3.z.string().optional()
  }),
  version: import_zod3.z.literal("1.0")
}).strict();

// src/lms-content-endpoints.ts
var import_zod4 = require("zod");
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
    params: import_zod4.z.object({
      courseKey: import_zod4.z.string().min(1).max(100)
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
    params: import_zod4.z.object({
      courseKey: import_zod4.z.string().min(1).max(100),
      sectionKey: import_zod4.z.string().min(1).max(100)
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
    params: import_zod4.z.object({
      courseKey: import_zod4.z.string().min(1).max(100)
    }),
    query: import_zod4.z.object({
      languageCode: LanguageCodeSchema.default("en"),
      includeUnpublished: import_zod4.z.boolean().default(false),
      sortBy: import_zod4.z.enum(["orderIndex", "title", "createdAt"]).default("orderIndex"),
      sortOrder: import_zod4.z.enum(["asc", "desc"]).default("asc")
    }),
    response: import_zod4.z.object({
      success: import_zod4.z.literal(true),
      data: import_zod4.z.array(
        import_zod4.z.object({
          id: CourseSectionIdSchema,
          sectionKey: import_zod4.z.string(),
          title: import_zod4.z.string(),
          orderIndex: import_zod4.z.number().int(),
          iconName: import_zod4.z.string().optional(),
          isPublished: import_zod4.z.boolean(),
          createdAt: import_zod4.z.string().datetime(),
          updatedAt: import_zod4.z.string().datetime()
        })
      ),
      version: import_zod4.z.literal("1.0")
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
    params: import_zod4.z.object({
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
    params: import_zod4.z.object({
      courseKey: import_zod4.z.string().min(1).max(100)
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
    params: import_zod4.z.object({
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
    params: import_zod4.z.object({
      sectionId: CourseSectionIdSchema
    }),
    response: import_zod4.z.object({
      success: import_zod4.z.literal(true),
      message: import_zod4.z.string(),
      version: import_zod4.z.literal("1.0")
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
    params: import_zod4.z.object({
      sectionId: CourseSectionIdSchema
    }),
    query: import_zod4.z.object({
      languageCode: LanguageCodeSchema.default("en"),
      blockType: import_zod4.z.enum([
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
      sortBy: import_zod4.z.enum(["orderIndex", "blockType", "createdAt"]).default("orderIndex"),
      sortOrder: import_zod4.z.enum(["asc", "desc"]).default("asc")
    }),
    response: import_zod4.z.object({
      success: import_zod4.z.literal(true),
      data: import_zod4.z.array(ContentBlockResponseSchema.shape.data),
      version: import_zod4.z.literal("1.0")
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
    params: import_zod4.z.object({
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
    params: import_zod4.z.object({
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
    params: import_zod4.z.object({
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
    params: import_zod4.z.object({
      contentBlockId: ContentBlockIdSchema
    }),
    response: import_zod4.z.object({
      success: import_zod4.z.literal(true),
      message: import_zod4.z.string(),
      version: import_zod4.z.literal("1.0")
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
    params: import_zod4.z.object({
      sectionId: CourseSectionIdSchema
    }),
    query: import_zod4.z.object({
      languageCode: LanguageCodeSchema.default("en"),
      questionType: import_zod4.z.enum(["true-false", "multiple-choice"]).optional(),
      includeUnpublished: import_zod4.z.boolean().default(false),
      sortBy: import_zod4.z.enum(["orderIndex", "questionKey", "createdAt"]).default("orderIndex"),
      sortOrder: import_zod4.z.enum(["asc", "desc"]).default("asc")
    }),
    response: import_zod4.z.object({
      success: import_zod4.z.literal(true),
      data: import_zod4.z.array(QuizQuestionResponseSchema.shape.data),
      version: import_zod4.z.literal("1.0")
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
    params: import_zod4.z.object({
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
    params: import_zod4.z.object({
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
    params: import_zod4.z.object({
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
    params: import_zod4.z.object({
      quizQuestionId: QuizQuestionIdSchema
    }),
    response: import_zod4.z.object({
      success: import_zod4.z.literal(true),
      message: import_zod4.z.string(),
      version: import_zod4.z.literal("1.0")
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
    params: import_zod4.z.object({
      userId: import_zod4.z.string().min(1)
    }),
    query: UserProgressQuerySchema.omit({ userId: true }),
    response: import_zod4.z.object({
      success: import_zod4.z.literal(true),
      data: import_zod4.z.array(UserProgressResponseSchema.shape.data),
      version: import_zod4.z.literal("1.0")
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
    params: import_zod4.z.object({
      userId: import_zod4.z.string().min(1),
      courseId: import_zod4.z.string().uuid()
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
    params: import_zod4.z.object({
      userId: import_zod4.z.string().min(1)
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
    params: import_zod4.z.object({
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
    params: import_zod4.z.object({
      userId: import_zod4.z.string().min(1)
    }),
    query: QuizAttemptsQuerySchema.omit({ userId: true }),
    response: import_zod4.z.object({
      success: import_zod4.z.literal(true),
      data: import_zod4.z.array(QuizAttemptResponseSchema.shape.data),
      version: import_zod4.z.literal("1.0")
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
    params: import_zod4.z.object({
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
    params: import_zod4.z.object({
      userId: import_zod4.z.string().min(1)
    }),
    query: ContentInteractionsQuerySchema.omit({ userId: true }),
    response: import_zod4.z.object({
      success: import_zod4.z.literal(true),
      data: import_zod4.z.array(ContentInteractionResponseSchema.shape.data),
      version: import_zod4.z.literal("1.0")
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
    params: import_zod4.z.object({
      courseKey: import_zod4.z.string().min(1).max(100),
      languageCode: LanguageCodeSchema
    }),
    response: import_zod4.z.object({
      success: import_zod4.z.literal(true),
      data: import_zod4.z.object({
        course: import_zod4.z.object({
          title: import_zod4.z.string(),
          description: import_zod4.z.string().optional()
        }),
        sections: import_zod4.z.array(
          import_zod4.z.object({
            sectionKey: import_zod4.z.string(),
            title: import_zod4.z.string()
          })
        ),
        contentBlocks: import_zod4.z.array(
          import_zod4.z.object({
            contentBlockId: ContentBlockIdSchema,
            content: import_zod4.z.record(import_zod4.z.string(), import_zod4.z.unknown())
          })
        ),
        quizQuestions: import_zod4.z.array(
          import_zod4.z.object({
            quizQuestionId: QuizQuestionIdSchema,
            questionText: import_zod4.z.string(),
            options: import_zod4.z.record(import_zod4.z.string(), import_zod4.z.string()).optional(),
            explanation: import_zod4.z.string().optional()
          })
        )
      }),
      version: import_zod4.z.literal("1.0")
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map