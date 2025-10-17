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

import {
  enhancedUuidSchema,
  enhancedEmailSchema,
  enhancedIsoDateSchema,
  territoryValidation,
  roleValidation,
  validationMessages,
  validationErrorCodes,
} from "./validation-utils";

// =============================================================================
// ENHANCED AUTH INTEGRATION SCHEMAS
// =============================================================================

/**
 * Enhanced auth user context with comprehensive system access
 */
export const enhancedAuthUserSchema = z.object({
  id: enhancedUuidSchema,
  email: enhancedEmailSchema,
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  role: z.enum([
    // Training system roles
    "safety_admin",
    "safety_manager",
    "safety_coordinator",
    "safety_instructor",
    "plant_manager",
    "hr_admin",
    "employee",

    // Business system roles
    "sales_admin",
    "sales_manager",
    "sales_rep",
    "territory_manager",
  ]),

  // Multi-system context
  systems: z
    .array(z.enum(["training", "business"]))
    .min(1, "User must have access to at least one system"),

  // Training system context
  plantId: enhancedUuidSchema.optional(),
  plant: plantSchema.optional(),
  trainingProfile: userProfileSchema.optional(),

  // Business system context
  territoryId: enhancedUuidSchema.optional(),
  territory: territorySchema.optional(),

  // Enhanced permissions
  permissions: z.object({
    // Training system permissions
    training: z.object({
      canManageAllPlants: z.boolean().default(false),
      canManageUsers: z.boolean().default(false),
      canManageCourses: z.boolean().default(false),
      canViewAllData: z.boolean().default(false),
      canManageAdminRoles: z.boolean().default(false),
      canViewComplianceReports: z.boolean().default(false),
      canManageEnrollments: z.boolean().default(false),
      canViewProgress: z.boolean().default(false),
    }),

    // Business system permissions
    business: z.object({
      canManageAllTerritories: z.boolean().default(false),
      canManageAllAccounts: z.boolean().default(false),
      canManageAllOpportunities: z.boolean().default(false),
      canViewAllSales: z.boolean().default(false),
      canManageAllUsers: z.boolean().default(false),
      canViewAllReports: z.boolean().default(false),
      canManageProducts: z.boolean().default(false),
      canManageProjects: z.boolean().default(false),
    }),

    // Cross-system permissions
    crossSystem: z.object({
      canAccessBothSystems: z.boolean().default(false),
      canViewCrossSystemReports: z.boolean().default(false),
      canManageSystemIntegrations: z.boolean().default(false),
    }),
  }),

  // Session and security
  session: z.object({
    accessToken: z.string().min(1, "Access token required"),
    refreshToken: z.string().min(1, "Refresh token required"),
    expiresAt: enhancedIsoDateSchema,
    lastActivityAt: enhancedIsoDateSchema,
  }),

  // Audit trail
  createdAt: enhancedIsoDateSchema,
  updatedAt: enhancedIsoDateSchema,
  lastLoginAt: enhancedIsoDateSchema.optional(),
});

// =============================================================================
// ENHANCED TERRITORY + PLANT INTEGRATION SCHEMAS
// =============================================================================

/**
 * Enhanced territory schema with plant relationships
 */
export const enhancedTerritorySchema = territorySchema.extend({
  plants: z.array(plantSchema).optional(),
  plantCount: z.number().int().min(0).default(0),

  // Territory-level metrics
  metrics: z.object({
    totalAccounts: z.number().int().min(0).default(0),
    totalOpportunities: z.number().int().min(0).default(0),
    totalRevenue: z.string().optional(),
    activeUsers: z.number().int().min(0).default(0),
    complianceScore: z.number().min(0).max(100).optional(),
  }),

  // Territory settings
  settings: z.object({
    timezone: z.string().default("UTC"),
    currency: z.string().default("USD"),
    dateFormat: z.string().default("MM/DD/YYYY"),
    complianceStandards: z.array(z.string()).default([]),
  }),
});

/**
 * Enhanced plant schema with territory relationships
 */
export const enhancedPlantSchema = plantSchema.extend({
  territoryId: enhancedUuidSchema.optional(),
  territory: enhancedTerritorySchema.optional(),

  // Plant-level metrics
  metrics: z.object({
    totalUsers: z.number().int().min(0).default(0),
    totalCourses: z.number().int().min(0).default(0),
    totalEnrollments: z.number().int().min(0).default(0),
    completionRate: z.number().min(0).max(100).optional(),
    complianceScore: z.number().min(0).max(100).optional(),
  }),

  // Plant settings
  settings: z.object({
    timezone: z.string().default("UTC"),
    workingHours: z.object({
      start: z.string().default("08:00"),
      end: z.string().default("17:00"),
      timezone: z.string().default("UTC"),
    }),
    safetyStandards: z.array(z.string()).default([]),
  }),
});

// =============================================================================
// ENHANCED USER PROFILE INTEGRATION SCHEMAS
// =============================================================================

/**
 * Enhanced user profile with dual-system access
 */
export const enhancedUserProfileSchema = userProfileSchema.extend({
  // Multi-system context
  systems: z.array(z.enum(["training", "business"])).min(1),

  // Training system fields
  plantId: enhancedUuidSchema.optional(),
  plant: enhancedPlantSchema.optional(),

  // Business system fields
  territoryId: enhancedUuidSchema.optional(),
  territory: enhancedTerritorySchema.optional(),

  // Enhanced role with system context
  roles: z.object({
    training: userRoleSchema.optional(),
    business: z
      .enum([
        "safety_admin",
        "sales_admin",
        "sales_manager",
        "sales_rep",
        "territory_manager",
      ])
      .optional(),
  }),

  // Comprehensive permissions
  permissions: enhancedAuthUserSchema.shape.permissions,

  // User preferences
  preferences: z.object({
    defaultSystem: z.enum(["training", "business"]).default("training"),
    language: z.string().default("en"),
    notifications: z.object({
      email: z.boolean().default(true),
      sms: z.boolean().default(false),
      push: z.boolean().default(true),
    }),
  }),
});

// =============================================================================
// ENHANCED BUSINESS ENTITY INTEGRATION SCHEMAS
// =============================================================================

/**
 * Enhanced account schema with training system integration
 */
export const enhancedAccountSchema = accountSchema.extend({
  // Training system integration
  plants: z.array(enhancedPlantSchema).optional(),
  plantCount: z.number().int().min(0).default(0),

  // Enhanced compliance tracking
  compliance: z.object({
    oshaCompliance: z.boolean().default(false),
    iso45001Compliance: z.boolean().default(false),
    customCompliance: z.boolean().default(false),
    lastAuditDate: enhancedIsoDateSchema.optional(),
    nextAuditDate: enhancedIsoDateSchema.optional(),
    complianceScore: z.number().min(0).max(100).optional(),
  }),

  // Training metrics
  trainingMetrics: z.object({
    totalEmployees: z.number().int().min(0).default(0),
    trainedEmployees: z.number().int().min(0).default(0),
    trainingCompletionRate: z.number().min(0).max(100).optional(),
    overdueTrainings: z.number().int().min(0).default(0),
    upcomingRenewals: z.number().int().min(0).default(0),
  }),

  // Enhanced business metrics
  businessMetrics: z.object({
    totalOpportunities: z.number().int().min(0).default(0),
    openOpportunities: z.number().int().min(0).default(0),
    totalRevenue: z.string().optional(),
    lastActivityDate: enhancedIsoDateSchema.optional(),
    relationshipScore: z.number().min(0).max(100).optional(),
  }),
});

/**
 * Enhanced contact schema with training system integration
 */
export const enhancedContactSchema = contactSchema.extend({
  // Training system integration
  plantId: enhancedUuidSchema.optional(),
  plant: enhancedPlantSchema.optional(),

  // Enhanced safety profile
  safetyProfile: z.object({
    certifications: z
      .array(
        z.object({
          name: z.string(),
          issuedDate: enhancedIsoDateSchema,
          expiryDate: enhancedIsoDateSchema,
          issuingAuthority: z.string(),
          isActive: z.boolean(),
        })
      )
      .default([]),

    trainingHistory: z
      .array(
        z.object({
          courseId: enhancedUuidSchema,
          courseName: z.string(),
          completedDate: enhancedIsoDateSchema,
          score: z.number().min(0).max(100).optional(),
          certificateNumber: z.string().optional(),
        })
      )
      .default([]),

    upcomingTrainings: z
      .array(
        z.object({
          courseId: enhancedUuidSchema,
          courseName: z.string(),
          scheduledDate: enhancedIsoDateSchema,
          isRequired: z.boolean(),
        })
      )
      .default([]),
  }),

  // Enhanced communication preferences
  communicationPreferences: z.object({
    preferredMethod: z.enum(["email", "phone", "sms"]).default("email"),
    preferredTime: z.string().default("09:00-17:00"),
    timezone: z.string().default("UTC"),
    language: z.string().default("en"),
    optOutMarketing: z.boolean().default(false),
  }),
});

/**
 * Enhanced opportunity schema with training system integration
 */
export const enhancedOpportunitySchema = opportunitySchema.extend({
  // Training system integration
  trainingRequirements: z.object({
    requiredCourses: z
      .array(
        z.object({
          courseId: enhancedUuidSchema,
          courseName: z.string(),
          isRequired: z.boolean(),
          estimatedCost: z.string().optional(),
        })
      )
      .default([]),

    trainingBudget: z.string().optional(),
    trainingTimeline: z.object({
      startDate: enhancedIsoDateSchema.optional(),
      endDate: enhancedIsoDateSchema.optional(),
      isFlexible: z.boolean().default(true),
    }),
  }),

  // Enhanced compliance tracking
  complianceRequirements: z.object({
    standards: z.array(z.string()).default([]),
    auditRequired: z.boolean().default(false),
    auditDate: enhancedIsoDateSchema.optional(),
    complianceDeadline: enhancedIsoDateSchema.optional(),
  }),

  // Enhanced opportunity metrics
  opportunityMetrics: z.object({
    daysInStage: z.number().int().min(0).default(0),
    stageHistory: z
      .array(
        z.object({
          stage: z.string(),
          enteredAt: enhancedIsoDateSchema,
          exitedAt: enhancedIsoDateSchema.optional(),
          duration: z.number().int().min(0).optional(),
        })
      )
      .default([]),

    activityCount: z.number().int().min(0).default(0),
    lastActivityDate: enhancedIsoDateSchema.optional(),
    stakeholderCount: z.number().int().min(0).default(0),
  }),
});

// =============================================================================
// ENHANCED ACTIVITY LOG INTEGRATION SCHEMAS
// =============================================================================

/**
 * Enhanced activity log with cross-system support
 */
export const enhancedActivityLogSchema = z.object({
  id: enhancedUuidSchema,

  // Multi-system context
  system: z.enum(["training", "business", "both"]),

  // Entity relationships
  entityType: z.enum([
    "account",
    "contact",
    "opportunity",
    "project",
    "product",
    "plant",
    "user",
    "course",
    "enrollment",
    "progress",
  ]),
  entityId: enhancedUuidSchema,

  // Activity details
  type: z.enum([
    // Business activities
    "account_created",
    "account_updated",
    "contact_added",
    "opportunity_created",
    "opportunity_updated",
    "opportunity_closed",
    "project_started",
    "project_completed",
    "meeting_scheduled",
    "call_made",
    "email_sent",
    "proposal_sent",
    "contract_signed",

    // Training activities
    "course_created",
    "course_updated",
    "enrollment_created",
    "progress_updated",
    "training_completed",
    "certification_earned",
    "training_overdue",
    "compliance_audit",

    // Cross-system activities
    "system_access",
    "data_sync",
    "report_generated",
    "integration_event",
  ]),

  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description too long"),

  // Enhanced metadata
  metadata: z.object({
    // System-specific data
    trainingData: z
      .object({
        courseId: enhancedUuidSchema.optional(),
        plantId: enhancedUuidSchema.optional(),
        enrollmentId: enhancedUuidSchema.optional(),
        progressPercent: z.number().min(0).max(100).optional(),
        score: z.number().min(0).max(100).optional(),
      })
      .optional(),

    businessData: z
      .object({
        opportunityId: enhancedUuidSchema.optional(),
        territoryId: enhancedUuidSchema.optional(),
        amount: z.string().optional(),
        stage: z.string().optional(),
        source: z.string().optional(),
      })
      .optional(),

    // Common data
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    location: z
      .object({
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
  }),

  // User context
  userId: enhancedUuidSchema,
  userRole: z.string(),
  userTerritoryId: enhancedUuidSchema.optional(),
  userPlantId: enhancedUuidSchema.optional(),

  // Timestamps
  occurredAt: enhancedIsoDateSchema,
  createdAt: enhancedIsoDateSchema,
  updatedAt: enhancedIsoDateSchema,

  // Status and flags
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(false),
  requiresFollowUp: z.boolean().default(false),
});

// =============================================================================
// ENHANCED API RESPONSE SCHEMAS
// =============================================================================

/**
 * Enhanced unified success response with comprehensive context
 */
export const enhancedUnifiedSuccessResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    success: z.boolean().default(true),
    data: dataSchema,

    // Enhanced context
    context: z.object({
      user: enhancedAuthUserSchema,
      system: z.enum(["training", "business", "both"]),
      territory: enhancedTerritorySchema.optional(),
      plant: enhancedPlantSchema.optional(),

      // Request metadata
      request: z.object({
        id: enhancedUuidSchema,
        timestamp: enhancedIsoDateSchema,
        duration: z.number().int().min(0).optional(),
        source: z.string().optional(),
      }),
    }),

    // Enhanced pagination
    pagination: z
      .object({
        page: z.number().int().min(1),
        limit: z.number().int().min(1),
        total: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),

        // Enhanced pagination metadata
        metadata: z
          .object({
            estimatedTotalTime: z.number().optional(),
            cached: z.boolean().default(false),
            cacheExpiry: enhancedIsoDateSchema.optional(),
          })
          .optional(),
      })
      .optional(),

    // Enhanced messaging
    message: z.string().optional(),
    warnings: z
      .array(
        z.object({
          code: z.string(),
          message: z.string(),
          field: z.string().optional(),
        })
      )
      .default([]),

    timestamp: enhancedIsoDateSchema,
  });

/**
 * Enhanced unified error response with comprehensive error handling
 */
export const enhancedUnifiedErrorResponseSchema = z.object({
  success: z.boolean().default(false),

  error: z.object({
    code: z.enum([
      // Access control errors
      "ACCESS_DENIED",
      "TERRITORY_ACCESS_DENIED",
      "PLANT_ACCESS_DENIED",
      "ROLE_PERMISSION_DENIED",
      "CROSS_SYSTEM_ACCESS_DENIED",

      // Not found errors
      "NOT_FOUND",
      "ACCOUNT_NOT_FOUND",
      "CONTACT_NOT_FOUND",
      "OPPORTUNITY_NOT_FOUND",
      "PRODUCT_NOT_FOUND",
      "PROJECT_NOT_FOUND",
      "TERRITORY_NOT_FOUND",
      "PLANT_NOT_FOUND",
      "USER_NOT_FOUND",
      "COURSE_NOT_FOUND",
      "ENROLLMENT_NOT_FOUND",

      // Validation errors
      "VALIDATION_ERROR",
      "INVALID_FORMAT",
      "MISSING_REQUIRED_FIELD",
      "INVALID_STAGE_TRANSITION",
      "DUPLICATE_VALUE",
      "INVALID_RELATIONSHIP",

      // Business rule errors
      "BUSINESS_RULE_VIOLATION",
      "COMPLIANCE_VIOLATION",
      "SAFETY_REQUIREMENT_NOT_MET",
      "TRAINING_OVERDUE",
      "CERTIFICATION_EXPIRED",
      "SALES_TARGET_EXCEEDED",

      // System errors
      "SYSTEM_ERROR",
      "DATABASE_ERROR",
      "NETWORK_ERROR",
      "TIMEOUT_ERROR",
      "RATE_LIMIT_EXCEEDED",
      "MAINTENANCE_MODE",
      "SERVICE_UNAVAILABLE",
    ]),

    message: z.string(),
    details: z
      .array(
        z.object({
          field: z.string(),
          message: z.string(),
          code: z.string(),
          value: z.any().optional(),
        })
      )
      .optional(),

    // Enhanced error context
    context: z
      .object({
        system: z.enum(["training", "business", "both"]).optional(),
        operation: z.string().optional(),
        resource: z.string().optional(),
        userId: enhancedUuidSchema.optional(),
        territoryId: enhancedUuidSchema.optional(),
        plantId: enhancedUuidSchema.optional(),
      })
      .optional(),

    // Error tracking
    tracking: z
      .object({
        errorId: enhancedUuidSchema,
        correlationId: enhancedUuidSchema.optional(),
        requestId: enhancedUuidSchema.optional(),
        stackTrace: z.string().optional(),
      })
      .optional(),
  }),

  // Enhanced error metadata
  metadata: z
    .object({
      retryable: z.boolean().default(false),
      retryAfter: z.number().int().min(0).optional(),
      suggestedActions: z.array(z.string()).default([]),
      documentation: z.string().optional(),
    })
    .optional(),

  timestamp: enhancedIsoDateSchema,
});

// =============================================================================
// ENHANCED MIDDLEWARE VALIDATION SCHEMAS
// =============================================================================

/**
 * Enhanced cross-system middleware validation
 */
export const enhancedCrossSystemMiddlewareSchema = z.object({
  userId: enhancedUuidSchema,

  // Multi-system context
  systems: z.array(z.enum(["training", "business"])).min(1),

  // Plant context
  plantId: enhancedUuidSchema.optional(),
  plant: enhancedPlantSchema.optional(),

  // Territory context
  territoryId: enhancedUuidSchema.optional(),
  territory: enhancedTerritorySchema.optional(),

  // Enhanced role validation
  roles: z.object({
    training: userRoleSchema.optional(),
    business: z
      .enum([
        "safety_admin",
        "sales_admin",
        "sales_manager",
        "sales_rep",
        "territory_manager",
      ])
      .optional(),
  }),

  // Operation context
  operation: z.enum(["read", "write", "admin"]),
  resources: z.array(
    z.enum([
      // Training resources
      "users",
      "courses",
      "enrollments",
      "progress",
      "compliance",

      // Business resources
      "accounts",
      "contacts",
      "opportunities",
      "products",
      "projects",
      "sales",

      // Cross-system resources
      "reports",
      "integrations",
      "audit_logs",
      "system_settings",
    ])
  ),

  // Enhanced permissions
  permissions: enhancedAuthUserSchema.shape.permissions,

  // Request metadata
  request: z.object({
    id: enhancedUuidSchema,
    method: z.string(),
    path: z.string(),
    timestamp: enhancedIsoDateSchema,
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
  }),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Enhanced auth types
export type EnhancedAuthUser = z.infer<typeof enhancedAuthUserSchema>;
export type EnhancedUserProfile = z.infer<typeof enhancedUserProfileSchema>;

// Enhanced entity types
export type EnhancedTerritory = z.infer<typeof enhancedTerritorySchema>;
export type EnhancedPlant = z.infer<typeof enhancedPlantSchema>;
export type EnhancedAccount = z.infer<typeof enhancedAccountSchema>;
export type EnhancedContact = z.infer<typeof enhancedContactSchema>;
export type EnhancedOpportunity = z.infer<typeof enhancedOpportunitySchema>;
export type EnhancedActivityLog = z.infer<typeof enhancedActivityLogSchema>;

// Enhanced response types
export type EnhancedUnifiedSuccessResponse<T> = z.infer<
  ReturnType<typeof enhancedUnifiedSuccessResponseSchema>
>;
export type EnhancedUnifiedErrorResponse = z.infer<
  typeof enhancedUnifiedErrorResponseSchema
>;

// Enhanced middleware types
export type EnhancedCrossSystemMiddleware = z.infer<
  typeof enhancedCrossSystemMiddlewareSchema
>;
