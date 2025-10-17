// =============================================================================
// SAFETY SYSTEM LIBRARY EXPORTS
// =============================================================================

/**
 * Main exports for the Safety System library.
 * This provides comprehensive type safety, validation, and business logic.
 */

// =============================================================================
// TYPE SAFETY SYSTEM
// =============================================================================

export {
  // Branded Types
  type PlantId,
  type UserId,
  type TerritoryId,
  type AccountId,
  type ContactId,
  type OpportunityId,

  // Result Types
  type Result,
  success,
  error,
  isSuccess,
  isError,

  // Error Types
  type ValidationError,
  type BusinessError,
  type SystemError,
  createValidationError,
  createBusinessError,
  createSystemError,

  // Type Guards
  isPlantContext,
  isTerritoryContext,
  isAdminRole,
  isManagerRole,
  isInstructorRole,

  // Type Safety Utils
  typeSafetyUtils,
  TYPE_SAFETY_CONSTANTS,
} from "./types";

// =============================================================================
// DATABASE SCHEMA AND OPERATIONS
// =============================================================================

export {
  db,
  // Database connection and utilities only
} from "./db";

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

export {
  // Core validation schemas
  plantScopedQuerySchema,
  territoryScopedQuerySchema,
  accountSchema,
  contactSchema,
  opportunitySchema,

  // Validation utilities
  validationUtils,
  validatePlantAccess,
  getRolePermissions,
  ROLE_HIERARCHY,
} from "./validations";

// =============================================================================
// DATA MAPPERS
// =============================================================================

export {
  // Core mappers
  mapPlantToApiResponse,
  mapPlantsToApiResponses,
  // mapUserToApiResponse, // Not implemented yet
  // mapUsersToApiResponses, // Not implemented yet
  mapCourseToApiResponse,
  mapCoursesToApiResponses,
} from "./mappers";

// =============================================================================
// UTILITIES
// =============================================================================

export { cn } from "./utils";

// =============================================================================
// TYPE SAFETY HEALTH CHECK
// =============================================================================

import { typeSafetyUtils, TYPE_SAFETY_CONSTANTS } from "./types";

/**
 * Performs a comprehensive type safety health check
 */
export const performTypeSafetyHealthCheck = () => {
  console.log("🔍 Performing Type Safety Health Check...\n");

  const healthCheck = typeSafetyUtils.runTypeSafetyHealthCheck();

  console.log(`Status: ${healthCheck.status.toUpperCase()}`);
  console.log(`Message: ${healthCheck.message}`);
  console.log(`Details:`, healthCheck.details);

  if (healthCheck.status === "healthy") {
    console.log("\n✅ Type safety system is fully operational!");
  } else if (healthCheck.status === "warning") {
    console.log("\n⚠️  Type safety system needs attention.");
  } else {
    console.log("\n❌ Type safety system has critical issues.");
  }

  return healthCheck;
};

/**
 * Gets type safety system information
 */
export const getTypeSafetyInfo = () => {
  const coverage = typeSafetyUtils.getTypeSafetyCoverage();
  const healthCheck = typeSafetyUtils.runTypeSafetyHealthCheck();

  return {
    coverage,
    healthCheck,
    constants: TYPE_SAFETY_CONSTANTS,
    timestamp: new Date().toISOString(),
  };
};

// =============================================================================
// LIBRARY VERSION AND METADATA
// =============================================================================

export const LIBRARY_VERSION = "1.0.0";
export const LIBRARY_NAME = "Safety System Type Safety Library";
export const LIBRARY_DESCRIPTION =
  "Comprehensive type safety system for Safety Training and Business operations";

/**
 * Library metadata
 */
export const LIBRARY_METADATA = {
  name: LIBRARY_NAME,
  version: LIBRARY_VERSION,
  description: LIBRARY_DESCRIPTION,
  features: [
    "Branded Types for Domain Safety",
    "Result Types for Error Handling",
    "Type Guards for Context Validation",
    "Strict API Contracts",
    "Database Type Safety",
    "Comprehensive Testing Framework",
    "Performance Monitoring",
    "Runtime Validation",
  ],
  typeSafety: {
    brandedTypes: 9,
    enumTypes: 11,
    resultTypes: 3,
    typeGuards: 60,
    apiContracts: 29,
    databaseSafety: 10,
    testSuites: 6,
    totalCoverage: 128,
  },
  performance: {
    maxTypeSafetyOverhead: `${TYPE_SAFETY_CONSTANTS.MAX_TYPE_SAFETY_OVERHEAD_MS}ms`,
    maxSchemaValidation: `${TYPE_SAFETY_CONSTANTS.MAX_SCHEMA_VALIDATION_MS}ms`,
    maxResultType: `${TYPE_SAFETY_CONSTANTS.MAX_RESULT_TYPE_MS}ms`,
  },
  compatibility: {
    typescript: "5.0+",
    zod: "3.0+",
    drizzle: "0.29+",
    node: "18.0+",
  },
} as const;
