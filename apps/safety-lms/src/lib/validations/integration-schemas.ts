import { z } from "zod";
import {
  // Safety Training schemas
  userProfileSchema,
  plantSchema,
  courseSchema,
  enrollmentSchema,
  progressSchema,
  activityEventSchema,
  questionEventSchema,
  adminRoleSchema,
  userRoleSchema,

  // Utility schemas
  paginationSchema,
  plantScopedQuerySchema,
} from "./safety-business";

import {
  // Safety Business schemas
  accountSchema,
  contactSchema,
  opportunitySchema,
  branchSchema,
  productSchema,
  projectSchema,
  salesFactSchema,
  activityLogSchema,
  territorySchema,
  businessUserContextSchema,

  // Utility schemas
  territoryScopedQuerySchema,
} from "./safety-business-dtos";

// =============================================================================
// AUTH + SAFETY TRAINING INTEGRATION SCHEMAS
// =============================================================================

// Combined user context for Safety Training operations
export const safetyTrainingUserContextSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: userRoleSchema,
  plantId: z.string().uuid(),
  plant: plantSchema.optional(),
  profile: userProfileSchema.optional(),
  permissions: z.object({
    canManageAllPlants: z.boolean().default(false),
    canManageUsers: z.boolean().default(false),
    canManageCourses: z.boolean().default(false),
    canViewAllData: z.boolean().default(false),
    canManageAdminRoles: z.boolean().default(false),
  }),
});

// Plant-scoped Safety Training response wrapper
export const plantScopedTrainingResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: dataSchema,
    plant: plantSchema,
    user: safetyTrainingUserContextSchema,
    pagination: paginationSchema.optional(),
  });

// Safety Training entity response with user context
export const safetyTrainingEntityResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: dataSchema,
    user: safetyTrainingUserContextSchema,
    plant: plantSchema.optional(),
    pagination: paginationSchema.optional(),
  });

// =============================================================================
// AUTH + SAFETY BUSINESS INTEGRATION SCHEMAS
// =============================================================================

// Combined user context for Safety Business operations
export const safetyBusinessUserContextSchema = businessUserContextSchema.extend(
  {
    permissions: z.object({
      canManageAllTerritories: z.boolean().default(false),
      canManageAllAccounts: z.boolean().default(false),
      canManageAllOpportunities: z.boolean().default(false),
      canViewAllSales: z.boolean().default(false),
      canManageAllUsers: z.boolean().default(false),
      canViewAllReports: z.boolean().default(false),
    }),
  }
);

// Territory-scoped Safety Business response wrapper
export const territoryScopedBusinessResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: dataSchema,
    territory: territorySchema,
    user: safetyBusinessUserContextSchema,
    pagination: paginationSchema.optional(),
  });

// Safety Business entity response with user context
export const safetyBusinessEntityResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: dataSchema,
    user: safetyBusinessUserContextSchema,
    territory: territorySchema.optional(),
    pagination: paginationSchema.optional(),
  });

// =============================================================================
// CROSS-SYSTEM INTEGRATION SCHEMAS
// =============================================================================

// User with both Safety Training and Business context
export const fullUserContextSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: userRoleSchema,

  // Safety Training context
  plantId: z.string().uuid().optional(),
  plant: plantSchema.optional(),
  trainingProfile: userProfileSchema.optional(),
  trainingPermissions: z.object({
    canManageAllPlants: z.boolean().default(false),
    canManageUsers: z.boolean().default(false),
    canManageCourses: z.boolean().default(false),
    canViewAllData: z.boolean().default(false),
    canManageAdminRoles: z.boolean().default(false),
  }),

  // Safety Business context
  territoryId: z.string().uuid().optional(),
  territory: territorySchema.optional(),
  businessPermissions: z.object({
    canManageAllTerritories: z.boolean().default(false),
    canManageAllAccounts: z.boolean().default(false),
    canManageAllOpportunities: z.boolean().default(false),
    canViewAllSales: z.boolean().default(false),
    canManageAllUsers: z.boolean().default(false),
    canViewAllReports: z.boolean().default(false),
  }),
});

// Cross-system operation validation
export const crossSystemOperationSchema = z.object({
  operation: z.enum([
    "create_account",
    "update_account",
    "create_contact",
    "update_contact",
    "create_opportunity",
    "update_opportunity",
    "create_project",
    "create_course",
    "update_course",
    "create_enrollment",
    "update_enrollment",
    "view_progress",
    "create_activity_log",
    "view_reports",
  ]),
  system: z.enum(["training", "business", "both"]),
  resource: z.enum([
    "accounts",
    "contacts",
    "opportunities",
    "projects",
    "products",
    "sales",
    "courses",
    "enrollments",
    "progress",
    "users",
    "reports",
  ]),
  context: z.object({
    plantId: z.string().uuid().optional(),
    territoryId: z.string().uuid().optional(),
    entityId: z.string().uuid().optional(),
  }),
});

// =============================================================================
// UNIFIED API RESPONSE SCHEMAS
// =============================================================================

// Unified success response for both systems
export const unifiedSuccessResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    success: z.boolean().default(true),
    data: dataSchema,
    context: z.object({
      user: fullUserContextSchema,
      plant: plantSchema.optional(),
      territory: territorySchema.optional(),
    }),
    pagination: paginationSchema.optional(),
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  });

// Unified error response for both systems
export const unifiedErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.object({
    code: z.enum([
      "PLANT_ACCESS_DENIED",
      "TERRITORY_ACCESS_DENIED",
      "ROLE_PERMISSION_DENIED",
      "COURSE_NOT_FOUND",
      "ENROLLMENT_NOT_FOUND",
      "ACCOUNT_NOT_FOUND",
      "CONTACT_NOT_FOUND",
      "OPPORTUNITY_NOT_FOUND",
      "PRODUCT_NOT_FOUND",
      "PROJECT_NOT_FOUND",
      "USER_NOT_FOUND",
      "PLANT_NOT_FOUND",
      "TERRITORY_NOT_FOUND",
      "INVALID_PLANT_SCOPE",
      "INVALID_TERRITORY_SCOPE",
      "DUPLICATE_ENROLLMENT",
      "DUPLICATE_ACCOUNT",
      "INVALID_COURSE_STATUS",
      "INVALID_OPPORTUNITY_STAGE",
      "TRAINING_OVERDUE",
      "SALES_TARGET_EXCEEDED",
      "COMPLIANCE_VIOLATION",
      "CROSS_SYSTEM_ACCESS_DENIED",
    ]),
    message: z.string(),
    details: z
      .array(
        z.object({
          field: z.string(),
          message: z.string(),
          code: z.string(),
        })
      )
      .optional(),
    system: z.enum(["training", "business", "both"]).optional(),
  }),
  timestamp: z.string().datetime(),
});

// =============================================================================
// MIDDLEWARE VALIDATION SCHEMAS
// =============================================================================

// Plant-scoped middleware validation
export const plantScopedMiddlewareSchema = z.object({
  userId: z.string().uuid(),
  plantId: z.string().uuid(),
  userRole: userRoleSchema,
  operation: z.enum(["read", "write", "admin"]),
  resource: z.enum([
    "users",
    "courses",
    "enrollments",
    "progress",
    "compliance",
  ]),
});

// Territory-scoped middleware validation
export const territoryScopedMiddlewareSchema = z.object({
  userId: z.string().uuid(),
  territoryId: z.string().uuid(),
  userRole: z.enum([
    "safety_admin",
    "sales_admin",
    "sales_manager",
    "sales_rep",
    "territory_manager",
  ]),
  operation: z.enum(["read", "write", "admin"]),
  resource: z.enum([
    "accounts",
    "contacts",
    "opportunities",
    "products",
    "projects",
    "sales",
  ]),
});

// Cross-system middleware validation
export const crossSystemMiddlewareSchema = z.object({
  userId: z.string().uuid(),
  plantId: z.string().uuid().optional(),
  territoryId: z.string().uuid().optional(),
  userRole: z.union([
    userRoleSchema,
    z.enum([
      "safety_admin",
      "sales_admin",
      "sales_manager",
      "sales_rep",
      "territory_manager",
    ]),
  ]),
  operation: z.enum(["read", "write", "admin"]),
  systems: z.array(z.enum(["training", "business"])),
  resources: z.array(
    z.enum([
      "users",
      "courses",
      "enrollments",
      "progress",
      "compliance",
      "accounts",
      "contacts",
      "opportunities",
      "products",
      "projects",
      "sales",
    ])
  ),
});

// =============================================================================
// PERMISSION VALIDATION SCHEMAS
// =============================================================================

// Safety Training permission validation
export const safetyTrainingPermissionSchema = z.object({
  userRole: userRoleSchema,
  operation: z.enum(["read", "write", "admin"]),
  resource: z.enum([
    "users",
    "courses",
    "enrollments",
    "progress",
    "compliance",
  ]),
  plantId: z.string().uuid(),
  targetPlantId: z.string().uuid().optional(),
});

// Safety Business permission validation
export const safetyBusinessPermissionSchema = z.object({
  userRole: z.enum([
    "safety_admin",
    "sales_admin",
    "sales_manager",
    "sales_rep",
    "territory_manager",
  ]),
  operation: z.enum(["read", "write", "admin"]),
  resource: z.enum([
    "accounts",
    "contacts",
    "opportunities",
    "products",
    "projects",
    "sales",
  ]),
  territoryId: z.string().uuid(),
  targetTerritoryId: z.string().uuid().optional(),
});

// Cross-system permission validation
export const crossSystemPermissionSchema = z.object({
  userRole: z.union([
    userRoleSchema,
    z.enum([
      "safety_admin",
      "sales_admin",
      "sales_manager",
      "sales_rep",
      "territory_manager",
    ]),
  ]),
  operation: z.enum(["read", "write", "admin"]),
  systems: z.array(z.enum(["training", "business"])),
  resources: z.array(
    z.enum([
      "users",
      "courses",
      "enrollments",
      "progress",
      "compliance",
      "accounts",
      "contacts",
      "opportunities",
      "products",
      "projects",
      "sales",
    ])
  ),
  context: z.object({
    plantId: z.string().uuid().optional(),
    territoryId: z.string().uuid().optional(),
  }),
});

// =============================================================================
// AUDIT AND COMPLIANCE SCHEMAS
// =============================================================================

// Cross-system audit log
export const crossSystemAuditLogSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  system: z.enum(["training", "business", "both"]),
  operation: z.enum([
    "create",
    "read",
    "update",
    "delete",
    "login",
    "logout",
    "access_denied",
  ]),
  resource: z.string(),
  resourceId: z.string().uuid().optional(),
  context: z.object({
    plantId: z.string().uuid().optional(),
    territoryId: z.string().uuid().optional(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
  }),
  metadata: z.string().max(2000).optional(), // JSON string
  occurredAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

// Compliance validation
export const complianceValidationSchema = z.object({
  userId: z.string().uuid(),
  system: z.enum(["training", "business", "both"]),
  operation: z.enum(["create", "update", "delete"]),
  resource: z.string(),
  complianceChecks: z.array(
    z.object({
      check: z.string(),
      passed: z.boolean(),
      message: z.string().optional(),
    })
  ),
  timestamp: z.string().datetime(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// User context types
export type SafetyTrainingUserContext = z.infer<
  typeof safetyTrainingUserContextSchema
>;
export type SafetyBusinessUserContext = z.infer<
  typeof safetyBusinessUserContextSchema
>;
export type FullUserContext = z.infer<typeof fullUserContextSchema>;

// Response types
export type PlantScopedTrainingResponse<T> = z.infer<
  ReturnType<typeof plantScopedTrainingResponseSchema>
>;
export type SafetyTrainingEntityResponse<T> = z.infer<
  ReturnType<typeof safetyTrainingEntityResponseSchema>
>;
export type TerritoryScopedBusinessResponse<T> = z.infer<
  ReturnType<typeof territoryScopedBusinessResponseSchema>
>;
export type SafetyBusinessEntityResponse<T> = z.infer<
  ReturnType<typeof safetyBusinessEntityResponseSchema>
>;

// Unified response types
export type UnifiedSuccessResponse<T> = z.infer<
  ReturnType<typeof unifiedSuccessResponseSchema>
>;
export type UnifiedErrorResponse = z.infer<typeof unifiedErrorResponseSchema>;

// Middleware types
export type PlantScopedMiddleware = z.infer<typeof plantScopedMiddlewareSchema>;
export type TerritoryScopedMiddleware = z.infer<
  typeof territoryScopedMiddlewareSchema
>;
export type CrossSystemMiddleware = z.infer<typeof crossSystemMiddlewareSchema>;

// Permission types
export type SafetyTrainingPermission = z.infer<
  typeof safetyTrainingPermissionSchema
>;
export type SafetyBusinessPermission = z.infer<
  typeof safetyBusinessPermissionSchema
>;
export type CrossSystemPermission = z.infer<typeof crossSystemPermissionSchema>;

// Operation types
export type CrossSystemOperation = z.infer<typeof crossSystemOperationSchema>;

// Audit types
export type CrossSystemAuditLog = z.infer<typeof crossSystemAuditLogSchema>;
export type ComplianceValidation = z.infer<typeof complianceValidationSchema>;
