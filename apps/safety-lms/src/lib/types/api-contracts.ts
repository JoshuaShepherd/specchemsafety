import { z } from "zod";
import {
  UserId,
  TerritoryId,
  PlantId,
  AccountId,
  ContactId,
  OpportunityId,
  UserRole,
  AccountStatus,
  AccountType,
  OpportunityStatus,
  OpportunityStage,
  ProductStatus,
  ProjectStatus,
  UserIdSchema,
  TerritoryIdSchema,
  PlantIdSchema,
  AccountIdSchema,
  ContactIdSchema,
  OpportunityIdSchema,
  UserRoleSchema,
  AccountStatusSchema,
  AccountTypeSchema,
  OpportunityStatusSchema,
  OpportunityStageSchema,
  ProductStatusSchema,
  ProjectStatusSchema,
} from "./branded-types";

// =============================================================================
// STRICT API CONTRACTS
// =============================================================================

/**
 * Strict API contracts ensure compile-time type safety with no additional
 * properties allowed, versioned responses, and comprehensive validation.
 */

// =============================================================================
// API VERSIONING
// =============================================================================

/**
 * API version schema
 */
export const ApiVersionSchema = z
  .enum(["1.0", "1.1", "2.0"])
  .brand<"ApiVersion">();
export type ApiVersion = z.infer<typeof ApiVersionSchema>;

/**
 * Current API version
 */
export const CURRENT_API_VERSION: ApiVersion = "1.0" as ApiVersion;

// =============================================================================
// STRICT ENTITY RESPONSE SCHEMAS
// =============================================================================

/**
 * Strict account response schema with no additional properties
 */
export const StrictAccountResponseSchema = z
  .object({
    id: AccountIdSchema,
    name: z.string().min(1).max(200),
    accountNumber: z.string().max(50).optional(),
    type: AccountTypeSchema,
    status: AccountStatusSchema,
    industry: z
      .enum([
        "manufacturing",
        "construction",
        "mining",
        "oil_gas",
        "chemical",
        "healthcare",
        "transportation",
        "utilities",
        "government",
        "education",
        "retail",
        "other",
      ])
      .optional(),
    website: z.string().url().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    description: z.string().max(2000).optional(),
    annualRevenue: z.string().optional(),
    employeeCount: z
      .enum(["1-10", "11-50", "51-200", "201-500", "500+"])
      .optional(),
    safetyComplianceLevel: z
      .enum(["OSHA Compliant", "ISO 45001", "Custom", "Non-Compliant"])
      .optional(),
    billingAddress: z.string().max(500).optional(),
    shippingAddress: z.string().max(500).optional(),
    territoryId: TerritoryIdSchema,
    ownerId: UserIdSchema,
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    createdBy: UserIdSchema,
  })
  .strict(); // No additional properties allowed

export type StrictAccountResponse = z.infer<typeof StrictAccountResponseSchema>;

/**
 * Strict contact response schema with no additional properties
 */
export const StrictContactResponseSchema = z
  .object({
    id: ContactIdSchema,
    accountId: AccountIdSchema,
    branchId: z.string().uuid().optional(),
    ownerId: UserIdSchema,
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email(),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    jobTitle: z.string().max(100).optional(),
    department: z.string().max(100).optional(),
    role: z
      .enum([
        "decision_maker",
        "influencer",
        "user",
        "evaluator",
        "champion",
        "gatekeeper",
        "other",
      ])
      .default("user"),
    status: z.enum(["active", "inactive", "do_not_contact"]).default("active"),
    isPrimary: z.boolean().default(false),
    safetyCertifications: z.string().max(500).optional(),
    notes: z.string().max(2000).optional(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    createdBy: UserIdSchema,
  })
  .strict();

export type StrictContactResponse = z.infer<typeof StrictContactResponseSchema>;

/**
 * Strict opportunity response schema with no additional properties
 */
export const StrictOpportunityResponseSchema = z
  .object({
    id: OpportunityIdSchema,
    accountId: AccountIdSchema,
    contactId: z.string().uuid().optional(),
    ownerId: UserIdSchema,
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    type: z.enum([
      "safety_equipment_sale",
      "training_service",
      "consulting_service",
      "maintenance_contract",
      "compliance_assessment",
      "emergency_response_planning",
      "other",
    ]),
    stage: OpportunityStageSchema,
    status: OpportunityStatusSchema,
    source: z
      .enum([
        "website",
        "referral",
        "cold_call",
        "trade_show",
        "social_media",
        "advertising",
        "other",
      ])
      .optional(),
    probability: z.enum(["10", "25", "50", "75", "90"]).default("10"),
    amount: z.string().optional(),
    closeDate: z.string().datetime().optional(),
    actualCloseDate: z.string().datetime().optional(),
    lostReason: z.string().max(500).optional(),
    nextSteps: z.string().max(1000).optional(),
    safetyRequirements: z.string().max(1000).optional(),
    complianceNotes: z.string().max(1000).optional(),
    notes: z.string().max(2000).optional(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    createdBy: UserIdSchema,
  })
  .strict();

export type StrictOpportunityResponse = z.infer<
  typeof StrictOpportunityResponseSchema
>;

/**
 * Strict territory response schema with no additional properties
 */
export const StrictTerritoryResponseSchema = z
  .object({
    id: TerritoryIdSchema,
    name: z.string().min(1).max(100),
    code: z.string().min(1).max(20),
    description: z.string().max(500).optional(),
    region: z.string().max(50).optional(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type StrictTerritoryResponse = z.infer<
  typeof StrictTerritoryResponseSchema
>;

/**
 * Strict plant response schema with no additional properties
 */
export const StrictPlantResponseSchema = z
  .object({
    id: PlantIdSchema,
    name: z.string().min(1).max(100),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type StrictPlantResponse = z.infer<typeof StrictPlantResponseSchema>;

/**
 * Strict user response schema with no additional properties
 */
export const StrictUserResponseSchema = z
  .object({
    id: UserIdSchema,
    authUserId: z.string().uuid(),
    plantId: PlantIdSchema.optional(),
    territoryId: TerritoryIdSchema.optional(),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email(),
    phone: z.string().optional(),
    jobTitle: z.string().max(100).optional(),
    department: z.string().max(100).optional(),
    role: UserRoleSchema,
    status: z.enum(["active", "inactive", "suspended"]),
    isActive: z.boolean(),
    lastLoginAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    createdBy: z.string().uuid().optional(),
  })
  .strict();

export type StrictUserResponse = z.infer<typeof StrictUserResponseSchema>;

// =============================================================================
// VERSIONED API RESPONSE SCHEMAS
// =============================================================================

/**
 * Versioned account response schema
 */
export const ApiV1AccountResponseSchema = StrictAccountResponseSchema.extend({
  version: z.literal("1.0"),
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    lastModifiedBy: UserIdSchema.optional(),
    tags: z.array(z.string()).optional(),
    customFields: z.record(z.string(), z.unknown()).optional(),
  }),
}).strict();

export type ApiV1AccountResponse = z.infer<typeof ApiV1AccountResponseSchema>;

/**
 * Versioned contact response schema
 */
export const ApiV1ContactResponseSchema = StrictContactResponseSchema.extend({
  version: z.literal("1.0"),
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    lastModifiedBy: UserIdSchema.optional(),
    tags: z.array(z.string()).optional(),
    customFields: z.record(z.string(), z.unknown()).optional(),
  }),
}).strict();

export type ApiV1ContactResponse = z.infer<typeof ApiV1ContactResponseSchema>;

/**
 * Versioned opportunity response schema
 */
export const ApiV1OpportunityResponseSchema =
  StrictOpportunityResponseSchema.extend({
    version: z.literal("1.0"),
    metadata: z.object({
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      lastModifiedBy: UserIdSchema.optional(),
      tags: z.array(z.string()).optional(),
      customFields: z.record(z.string(), z.unknown()).optional(),
    }),
  }).strict();

export type ApiV1OpportunityResponse = z.infer<
  typeof ApiV1OpportunityResponseSchema
>;

// =============================================================================
// STRICT API REQUEST SCHEMAS
// =============================================================================

/**
 * Strict account creation request schema
 */
export const StrictCreateAccountRequestSchema = z
  .object({
    name: z.string().min(1).max(200),
    accountNumber: z.string().max(50).optional(),
    type: AccountTypeSchema,
    status: AccountStatusSchema.optional(),
    industry: z
      .enum([
        "manufacturing",
        "construction",
        "mining",
        "oil_gas",
        "chemical",
        "healthcare",
        "transportation",
        "utilities",
        "government",
        "education",
        "retail",
        "other",
      ])
      .optional(),
    website: z.string().url().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    description: z.string().max(2000).optional(),
    annualRevenue: z.string().optional(),
    employeeCount: z
      .enum(["1-10", "11-50", "51-200", "201-500", "500+"])
      .optional(),
    safetyComplianceLevel: z
      .enum(["OSHA Compliant", "ISO 45001", "Custom", "Non-Compliant"])
      .optional(),
    billingAddress: z.string().max(500).optional(),
    shippingAddress: z.string().max(500).optional(),
    territoryId: TerritoryIdSchema,
    ownerId: UserIdSchema,
  })
  .strict();

export type StrictCreateAccountRequest = z.infer<
  typeof StrictCreateAccountRequestSchema
>;

/**
 * Strict account update request schema
 */
export const StrictUpdateAccountRequestSchema =
  StrictCreateAccountRequestSchema.partial().strict();

export type StrictUpdateAccountRequest = z.infer<
  typeof StrictUpdateAccountRequestSchema
>;

/**
 * Strict contact creation request schema
 */
export const StrictCreateContactRequestSchema = z
  .object({
    accountId: AccountIdSchema,
    branchId: z.string().uuid().optional(),
    ownerId: UserIdSchema,
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email(),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    jobTitle: z.string().max(100).optional(),
    department: z.string().max(100).optional(),
    role: z
      .enum([
        "decision_maker",
        "influencer",
        "user",
        "evaluator",
        "champion",
        "gatekeeper",
        "other",
      ])
      .default("user"),
    status: z.enum(["active", "inactive", "do_not_contact"]).default("active"),
    isPrimary: z.boolean().default(false),
    safetyCertifications: z.string().max(500).optional(),
    notes: z.string().max(2000).optional(),
  })
  .strict();

export type StrictCreateContactRequest = z.infer<
  typeof StrictCreateContactRequestSchema
>;

/**
 * Strict contact update request schema
 */
export const StrictUpdateContactRequestSchema =
  StrictCreateContactRequestSchema.partial().strict();

export type StrictUpdateContactRequest = z.infer<
  typeof StrictUpdateContactRequestSchema
>;

/**
 * Strict opportunity creation request schema
 */
export const StrictCreateOpportunityRequestSchema = z
  .object({
    accountId: AccountIdSchema,
    contactId: z.string().uuid().optional(),
    ownerId: UserIdSchema,
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    type: z.enum([
      "safety_equipment_sale",
      "training_service",
      "consulting_service",
      "maintenance_contract",
      "compliance_assessment",
      "emergency_response_planning",
      "other",
    ]),
    stage: OpportunityStageSchema.optional(),
    status: OpportunityStatusSchema.optional(),
    source: z
      .enum([
        "website",
        "referral",
        "cold_call",
        "trade_show",
        "social_media",
        "advertising",
        "other",
      ])
      .optional(),
    probability: z.enum(["10", "25", "50", "75", "90"]).default("10"),
    amount: z.string().optional(),
    closeDate: z.string().datetime().optional(),
    nextSteps: z.string().max(1000).optional(),
    safetyRequirements: z.string().max(1000).optional(),
    complianceNotes: z.string().max(1000).optional(),
    notes: z.string().max(2000).optional(),
  })
  .strict();

export type StrictCreateOpportunityRequest = z.infer<
  typeof StrictCreateOpportunityRequestSchema
>;

/**
 * Strict opportunity update request schema
 */
export const StrictUpdateOpportunityRequestSchema =
  StrictCreateOpportunityRequestSchema.partial().strict();

export type StrictUpdateOpportunityRequest = z.infer<
  typeof StrictUpdateOpportunityRequestSchema
>;

// =============================================================================
// STRICT QUERY PARAMETER SCHEMAS
// =============================================================================

/**
 * Strict pagination schema
 */
export const StrictPaginationSchema = z
  .object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();

export type StrictPagination = z.infer<typeof StrictPaginationSchema>;

/**
 * Strict search query schema
 */
export const StrictSearchQuerySchema = z
  .object({
    query: z.string().min(1).max(200),
    ...StrictPaginationSchema.shape,
  })
  .strict();

export type StrictSearchQuery = z.infer<typeof StrictSearchQuerySchema>;

/**
 * Strict territory-scoped query schema
 */
export const StrictTerritoryScopedQuerySchema = z
  .object({
    territoryId: TerritoryIdSchema,
    ...StrictPaginationSchema.shape,
  })
  .strict();

export type StrictTerritoryScopedQuery = z.infer<
  typeof StrictTerritoryScopedQuerySchema
>;

/**
 * Strict plant-scoped query schema
 */
export const StrictPlantScopedQuerySchema = z
  .object({
    plantId: PlantIdSchema,
    ...StrictPaginationSchema.shape,
  })
  .strict();

export type StrictPlantScopedQuery = z.infer<
  typeof StrictPlantScopedQuerySchema
>;

// =============================================================================
// STRICT ERROR RESPONSE SCHEMAS
// =============================================================================

/**
 * Strict error response schema with branded error codes
 */
export const StrictErrorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: z.enum([
        "VALIDATION_ERROR",
        "BUSINESS_ERROR",
        "SYSTEM_ERROR",
        "AUTHENTICATION_ERROR",
        "AUTHORIZATION_ERROR",
        "NOT_FOUND",
        "DUPLICATE",
        "INVALID_STATE",
        "COMPLIANCE_VIOLATION",
        "RATE_LIMIT_EXCEEDED",
        "SERVICE_UNAVAILABLE",
        "INTERNAL_ERROR",
      ]),
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
    }),
    version: ApiVersionSchema,
  })
  .strict();

export type StrictErrorResponse = z.infer<typeof StrictErrorResponseSchema>;

/**
 * Strict success response schema
 */
export const StrictSuccessResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.unknown(),
    version: ApiVersionSchema,
    metadata: z
      .object({
        timestamp: z.string().datetime(),
        requestId: z.string().optional(),
        pagination: StrictPaginationSchema.optional(),
      })
      .optional(),
  })
  .strict();

export type StrictSuccessResponse = z.infer<typeof StrictSuccessResponseSchema>;

// =============================================================================
// STRICT PAGINATED RESPONSE SCHEMAS
// =============================================================================

/**
 * Strict paginated response schema
 */
export const StrictPaginatedResponseSchema = <T extends z.ZodTypeAny>(
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
      version: ApiVersionSchema,
      metadata: z
        .object({
          timestamp: z.string().datetime(),
          requestId: z.string().optional(),
        })
        .optional(),
    })
    .strict();

/**
 * Strict paginated account response schema
 */
export const StrictPaginatedAccountResponseSchema =
  StrictPaginatedResponseSchema(StrictAccountResponseSchema);
export type StrictPaginatedAccountResponse = z.infer<
  typeof StrictPaginatedAccountResponseSchema
>;

/**
 * Strict paginated contact response schema
 */
export const StrictPaginatedContactResponseSchema =
  StrictPaginatedResponseSchema(StrictContactResponseSchema);
export type StrictPaginatedContactResponse = z.infer<
  typeof StrictPaginatedContactResponseSchema
>;

/**
 * Strict paginated opportunity response schema
 */
export const StrictPaginatedOpportunityResponseSchema =
  StrictPaginatedResponseSchema(StrictOpportunityResponseSchema);
export type StrictPaginatedOpportunityResponse = z.infer<
  typeof StrictPaginatedOpportunityResponseSchema
>;

// =============================================================================
// STRICT API CONTRACT VALIDATION
// =============================================================================

/**
 * Validates that a response conforms to the strict API contract
 */
export const validateStrictApiContract = <T>(
  response: unknown,
  schema: z.ZodSchema<T>
): T => {
  try {
    return schema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `API contract validation failed: ${error.issues.map(e => e.message).join(", ")}`
      );
    }
    throw error;
  }
};

/**
 * Validates that a request conforms to the strict API contract
 */
export const validateStrictApiRequest = <T>(
  request: unknown,
  schema: z.ZodSchema<T>
): T => {
  try {
    return schema.parse(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `API request validation failed: ${error.issues.map(e => e.message).join(", ")}`
      );
    }
    throw error;
  }
};

/**
 * Creates a strict API response with proper versioning
 */
export const createStrictApiResponse = <T>(
  data: T,
  version: ApiVersion = CURRENT_API_VERSION,
  metadata?: {
    timestamp?: string;
    requestId?: string;
    pagination?: StrictPagination;
  }
): StrictSuccessResponse => {
  return {
    success: true,
    data,
    version,
    metadata: {
      timestamp: metadata?.timestamp || new Date().toISOString(),
      requestId: metadata?.requestId,
      pagination: metadata?.pagination,
    },
  };
};

/**
 * Creates a strict API error response with proper versioning
 */
export const createStrictApiErrorResponse = (
  code: StrictErrorResponse["error"]["code"],
  message: string,
  details?: StrictErrorResponse["error"]["details"],
  version: ApiVersion = CURRENT_API_VERSION,
  metadata?: {
    requestId?: string;
    path?: string;
    method?: string;
  }
): StrictErrorResponse => {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      requestId: metadata?.requestId,
      timestamp: new Date().toISOString(),
      path: metadata?.path,
      method: metadata?.method,
    },
    version,
  };
};

// =============================================================================
// STRICT API CONTRACT TESTING
// =============================================================================

/**
 * Type-safe API contract testing utilities
 */
export const createApiContractTest = <T>(
  schema: z.ZodSchema<T>,
  testData: T
): {
  isValid: boolean;
  errors: string[];
  validatedData: T | null;
} => {
  try {
    const validatedData = schema.parse(testData);
    return {
      isValid: true,
      errors: [],
      validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.issues.map(e => e.message),
        validatedData: null,
      };
    }
    return {
      isValid: false,
      errors: ["Unknown validation error"],
      validatedData: null,
    };
  }
};

/**
 * Validates that an API response has no additional properties
 */
export const validateNoAdditionalProperties = <T>(
  response: unknown,
  schema: z.ZodSchema<T>
): boolean => {
  try {
    const validated = schema.parse(response);
    const responseKeys = Object.keys(response as object);
    const schemaKeys = Object.keys(validated as object);

    // Check if response has any keys not in the schema
    const hasAdditionalProperties = responseKeys.some(
      key => !schemaKeys.includes(key)
    );

    return !hasAdditionalProperties;
  } catch {
    return false;
  }
};

/**
 * Validates API contract backward compatibility
 */
export const validateApiContractCompatibility = <T>(
  oldSchema: z.ZodSchema<T>,
  newSchema: z.ZodSchema<T>,
  testData: T
): {
  isCompatible: boolean;
  breakingChanges: string[];
  warnings: string[];
} => {
  const breakingChanges: string[] = [];
  const warnings: string[] = [];

  try {
    // Validate with old schema
    const oldResult = oldSchema.parse(testData);

    // Validate with new schema
    const newResult = newSchema.parse(testData);

    // Check for breaking changes
    const oldKeys = Object.keys(oldResult as object);
    const newKeys = Object.keys(newResult as object);

    // Check for removed fields
    const removedFields = oldKeys.filter(key => !newKeys.includes(key));
    if (removedFields.length > 0) {
      breakingChanges.push(`Removed fields: ${removedFields.join(", ")}`);
    }

    // Check for type changes
    for (const key of oldKeys) {
      if (newKeys.includes(key)) {
        const oldType = typeof (oldResult as any)[key];
        const newType = typeof (newResult as any)[key];
        if (oldType !== newType) {
          breakingChanges.push(
            `Type change for field '${key}': ${oldType} -> ${newType}`
          );
        }
      }
    }

    return {
      isCompatible: breakingChanges.length === 0,
      breakingChanges,
      warnings,
    };
  } catch (error) {
    return {
      isCompatible: false,
      breakingChanges: ["Schema validation failed"],
      warnings: [],
    };
  }
};
