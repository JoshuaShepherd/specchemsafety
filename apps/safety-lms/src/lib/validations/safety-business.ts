import { z } from "zod";

// =============================================================================
// BASE VALIDATION SCHEMAS
// =============================================================================

// Common validation patterns
const uuidSchema = z.string().uuid("Invalid UUID format");
const emailSchema = z.string().email("Invalid email address");
const phoneSchema = z
  .string()
  .optional()
  .refine(
    val => !val || /^\+?[\d\s\-\(\)]+$/.test(val),
    "Invalid phone number format"
  );
const isoDateSchema = z.string().datetime("Invalid ISO date format");
const optionalIsoDateSchema = z
  .string()
  .datetime("Invalid ISO date format")
  .optional();
const positiveDecimalSchema = z
  .string()
  .refine(
    val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
    "Must be a positive number"
  );

// Export the schema for use in other files
export { positiveDecimalSchema };

// =============================================================================
// PLANT VALIDATION
// =============================================================================

export const plantSchema = z.object({
  id: uuidSchema,
  name: z
    .string()
    .min(1, "Plant name is required")
    .max(100, "Plant name too long"),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createPlantSchema = plantSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePlantSchema = createPlantSchema.partial();

// =============================================================================
// USER PROFILE VALIDATION (Safety Training Context)
// =============================================================================

export const userRoleSchema = z.enum([
  "safety_admin",
  "safety_manager",
  "safety_coordinator",
  "safety_instructor",
  "plant_manager",
  "hr_admin",
  "employee",
]);

const userStatusSchema = z.enum(["active", "inactive", "suspended"]);

export const userProfileSchema = z.object({
  id: uuidSchema,
  authUserId: uuidSchema,
  plantId: uuidSchema,
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  email: emailSchema,
  phone: phoneSchema,
  jobTitle: z.string().max(100, "Job title too long").optional(),
  department: z.string().max(100, "Department too long").optional(),
  role: userRoleSchema,
  status: userStatusSchema,
  isActive: z.boolean().default(true),
  lastLoginAt: optionalIsoDateSchema,
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  createdBy: uuidSchema.optional(),
});

export const createUserProfileSchema = userProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserProfileSchema = createUserProfileSchema
  .partial()
  .refine(
    data =>
      data.plantId ||
      data.role ||
      data.status ||
      data.firstName ||
      data.lastName ||
      data.email,
    "At least one field must be provided for update"
  );

// =============================================================================
// COURSE VALIDATION
// =============================================================================

const courseStatusSchema = z.enum(["active", "inactive", "draft", "archived"]);

const courseTypeSchema = z.enum([
  "safety_training",
  "compliance_training",
  "equipment_training",
  "emergency_response",
  "hazard_communication",
  "personal_protective_equipment",
  "other",
]);

const difficultyLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);

export const courseSchema = z.object({
  id: uuidSchema,
  plantId: uuidSchema,
  name: z
    .string()
    .min(1, "Course name is required")
    .max(200, "Course name too long"),
  description: z.string().max(2000, "Description too long").optional(),
  type: courseTypeSchema,
  status: courseStatusSchema,
  difficultyLevel: difficultyLevelSchema,
  duration: z.number().int().positive("Duration must be positive").optional(), // in minutes
  isRequired: z.boolean().default(false),
  completionCriteria: z
    .string()
    .max(1000, "Completion criteria too long")
    .optional(),
  prerequisites: z.string().max(1000, "Prerequisites too long").optional(),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createCourseSchema = courseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCourseSchema = createCourseSchema
  .partial()
  .refine(
    data =>
      data.name ||
      data.type ||
      data.status ||
      data.plantId ||
      data.difficultyLevel,
    "At least one field must be provided for update"
  );

// =============================================================================
// ENROLLMENT VALIDATION
// =============================================================================

const enrollmentStatusSchema = z.enum([
  "enrolled",
  "in_progress",
  "completed",
  "failed",
  "dropped",
  "expired",
]);

export const enrollmentSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  courseId: uuidSchema,
  plantId: uuidSchema,
  status: enrollmentStatusSchema,
  enrolledAt: isoDateSchema,
  startedAt: optionalIsoDateSchema,
  completedAt: optionalIsoDateSchema,
  expiresAt: optionalIsoDateSchema,
  score: z.number().min(0).max(100).optional(),
  attempts: z.number().int().min(0).default(0),
  notes: z.string().max(1000, "Notes too long").optional(),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createEnrollmentSchema = enrollmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateEnrollmentSchema = createEnrollmentSchema
  .partial()
  .refine(
    data =>
      data.status ||
      data.score ||
      data.attempts ||
      data.userId ||
      data.courseId,
    "At least one field must be provided for update"
  );

// =============================================================================
// PROGRESS VALIDATION
// =============================================================================

const progressStatusSchema = z.enum([
  "not_started",
  "in_progress",
  "completed",
  "failed",
]);

export const progressSchema = z.object({
  id: uuidSchema,
  enrollmentId: uuidSchema,
  userId: uuidSchema,
  courseId: uuidSchema,
  plantId: uuidSchema,
  status: progressStatusSchema,
  progressPercentage: z.number().min(0).max(100).default(0),
  timeSpent: z.number().int().min(0).default(0), // in minutes
  lastAccessedAt: optionalIsoDateSchema,
  completedAt: optionalIsoDateSchema,
  score: z.number().min(0).max(100).optional(),
  notes: z.string().max(1000, "Notes too long").optional(),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createProgressSchema = progressSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProgressSchema = createProgressSchema
  .partial()
  .refine(
    data =>
      data.status ||
      data.progressPercentage ||
      data.timeSpent ||
      data.enrollmentId,
    "At least one field must be provided for update"
  );

// =============================================================================
// ACTIVITY EVENT VALIDATION
// =============================================================================

const activityEventTypeSchema = z.enum([
  "course_started",
  "course_completed",
  "course_failed",
  "quiz_attempted",
  "quiz_completed",
  "certificate_earned",
  "training_assigned",
  "training_overdue",
  "compliance_updated",
  "other",
]);

export const activityEventSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  courseId: uuidSchema.optional(),
  enrollmentId: uuidSchema.optional(),
  plantId: uuidSchema,
  type: activityEventTypeSchema,
  description: z.string().max(1000, "Description too long").optional(),
  metadata: z.string().max(2000, "Metadata too long").optional(), // JSON string
  occurredAt: isoDateSchema,
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createActivityEventSchema = activityEventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateActivityEventSchema = createActivityEventSchema
  .partial()
  .refine(
    data => data.type || data.description || data.userId || data.plantId,
    "At least one field must be provided for update"
  );

// =============================================================================
// QUESTION EVENT VALIDATION
// =============================================================================

const questionEventTypeSchema = z.enum([
  "question_answered",
  "question_skipped",
  "hint_requested",
  "answer_reviewed",
  "other",
]);

const questionResultSchema = z.enum(["correct", "incorrect", "skipped"]);

export const questionEventSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  courseId: uuidSchema,
  enrollmentId: uuidSchema.optional(),
  plantId: uuidSchema,
  questionId: z.string().max(100, "Question ID too long"),
  type: questionEventTypeSchema,
  result: questionResultSchema.optional(),
  userAnswer: z.string().max(1000, "User answer too long").optional(),
  correctAnswer: z.string().max(1000, "Correct answer too long").optional(),
  timeSpent: z.number().int().min(0).optional(), // in seconds
  metadata: z.string().max(2000, "Metadata too long").optional(), // JSON string
  occurredAt: isoDateSchema,
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createQuestionEventSchema = questionEventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateQuestionEventSchema = createQuestionEventSchema
  .partial()
  .refine(
    data =>
      data.type ||
      data.result ||
      data.userId ||
      data.courseId ||
      data.questionId,
    "At least one field must be provided for update"
  );

// =============================================================================
// ADMIN ROLE VALIDATION
// =============================================================================

const adminRoleTypeSchema = z.enum([
  "plant_admin",
  "safety_admin",
  "hr_admin",
  "training_admin",
  "compliance_admin",
  "other",
]);

export const adminRoleSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  plantId: uuidSchema,
  roleType: adminRoleTypeSchema,
  permissions: z.string().max(2000, "Permissions too long").optional(), // JSON string
  assignedBy: uuidSchema,
  assignedAt: isoDateSchema,
  expiresAt: optionalIsoDateSchema,
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createAdminRoleSchema = adminRoleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateAdminRoleSchema = createAdminRoleSchema
  .partial()
  .refine(
    data => data.roleType || data.permissions || data.userId || data.plantId,
    "At least one field must be provided for update"
  );

// =============================================================================
// PLANT-SCOPED VALIDATION UTILITIES
// =============================================================================

// Plant access validation
export const plantAccessSchema = z.object({
  plantId: uuidSchema,
  userId: uuidSchema,
});

// Role-based validation schemas for safety training
export const safetyAdminFieldsSchema = z.object({
  // Safety admins can manage all plants and users
  canManageAllPlants: z.boolean().default(true),
  canManageUsers: z.boolean().default(true),
  canManageCourses: z.boolean().default(true),
  canViewAllData: z.boolean().default(true),
  canManageAdminRoles: z.boolean().default(true),
});

export const plantManagerFieldsSchema = z.object({
  // Plant managers can manage within their plant
  canManagePlantUsers: z.boolean().default(true),
  canManagePlantCourses: z.boolean().default(true),
  canViewPlantData: z.boolean().default(true),
  canAssignTraining: z.boolean().default(true),
  canViewReports: z.boolean().default(true),
});

export const safetyInstructorFieldsSchema = z.object({
  // Safety instructors can manage training content
  canCreateCourses: z.boolean().default(true),
  canEditCourses: z.boolean().default(true),
  canViewEnrollments: z.boolean().default(true),
  canViewProgress: z.boolean().default(true),
  canManageQuestions: z.boolean().default(true),
});

export const hrAdminFieldsSchema = z.object({
  // HR admins can manage user enrollments and compliance
  canManageEnrollments: z.boolean().default(true),
  canViewCompliance: z.boolean().default(true),
  canAssignRequiredTraining: z.boolean().default(true),
  canViewReports: z.boolean().default(true),
});

// =============================================================================
// API REQUEST/RESPONSE SCHEMAS
// =============================================================================

// Common API patterns
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const plantScopedQuerySchema = z.object({
  plantId: uuidSchema,
  ...paginationSchema.shape,
});

export const searchQuerySchema = z.object({
  query: z.string().min(1, "Search query is required"),
  plantId: uuidSchema,
  ...paginationSchema.shape,
});

// =============================================================================
// INTEGRATION SCHEMAS (Auth + Safety Training)
// =============================================================================

// Combined user context for API responses
export const userContextSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  firstName: z.string(),
  lastName: z.string(),
  role: userRoleSchema,
  plantId: uuidSchema,
  plant: plantSchema.optional(),
});

// Plant-scoped response wrapper
export const plantScopedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: dataSchema,
    plant: plantSchema,
    user: userContextSchema,
    pagination: paginationSchema.optional(),
  });

// =============================================================================
// VALIDATION ERROR SCHEMAS
// =============================================================================

export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
});

export const safetyTrainingErrorSchema = z.object({
  code: z.enum([
    "PLANT_ACCESS_DENIED",
    "ROLE_PERMISSION_DENIED",
    "COURSE_NOT_FOUND",
    "ENROLLMENT_NOT_FOUND",
    "USER_NOT_FOUND",
    "PLANT_NOT_FOUND",
    "INVALID_PLANT_SCOPE",
    "DUPLICATE_ENROLLMENT",
    "INVALID_COURSE_STATUS",
    "TRAINING_OVERDUE",
    "COMPLIANCE_VIOLATION",
  ]),
  message: z.string(),
  details: z.array(validationErrorSchema).optional(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Core entity types
export type Plant = z.infer<typeof plantSchema>;
export type CreatePlant = z.infer<typeof createPlantSchema>;
export type UpdatePlant = z.infer<typeof updatePlantSchema>;

export type UserProfile = z.infer<typeof userProfileSchema>;
export type CreateUserProfile = z.infer<typeof createUserProfileSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

export type Course = z.infer<typeof courseSchema>;
export type CreateCourse = z.infer<typeof createCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;

export type Enrollment = z.infer<typeof enrollmentSchema>;
export type CreateEnrollment = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollment = z.infer<typeof updateEnrollmentSchema>;

export type Progress = z.infer<typeof progressSchema>;
export type CreateProgress = z.infer<typeof createProgressSchema>;
export type UpdateProgress = z.infer<typeof updateProgressSchema>;

export type ActivityEvent = z.infer<typeof activityEventSchema>;
export type CreateActivityEvent = z.infer<typeof createActivityEventSchema>;
export type UpdateActivityEvent = z.infer<typeof updateActivityEventSchema>;

export type QuestionEvent = z.infer<typeof questionEventSchema>;
export type CreateQuestionEvent = z.infer<typeof createQuestionEventSchema>;
export type UpdateQuestionEvent = z.infer<typeof updateQuestionEventSchema>;

export type AdminRole = z.infer<typeof adminRoleSchema>;
export type CreateAdminRole = z.infer<typeof createAdminRoleSchema>;
export type UpdateAdminRole = z.infer<typeof updateAdminRoleSchema>;

// Utility types
export type PlantAccess = z.infer<typeof plantAccessSchema>;
export type UserContext = z.infer<typeof userContextSchema>;
export type ValidationError = z.infer<typeof validationErrorSchema>;
export type SafetyTrainingError = z.infer<typeof safetyTrainingErrorSchema>;

// API types
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type PlantScopedQuery = z.infer<typeof plantScopedQuerySchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;

// Role-based types
export type SafetyAdminFields = z.infer<typeof safetyAdminFieldsSchema>;
export type PlantManagerFields = z.infer<typeof plantManagerFieldsSchema>;
export type SafetyInstructorFields = z.infer<
  typeof safetyInstructorFieldsSchema
>;
export type HrAdminFields = z.infer<typeof hrAdminFieldsSchema>;
