import { z } from "zod";

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Comprehensive validation utilities for the Safety System
 * Provides common validation functions used across all schemas
 */
export const validationUtils = {
  /**
   * Validates UUID format
   */
  isValidUUID: (value: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },

  /**
   * Validates email format
   */
  isValidEmail: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  /**
   * Validates phone number format (flexible international format)
   */
  isValidPhone: (value: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(value) && value.replace(/\D/g, "").length >= 7;
  },

  /**
   * Validates URL format
   */
  isValidURL: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validates ISO date format
   */
  isValidISODate: (value: string): boolean => {
    const date = new Date(value);
    return (
      date instanceof Date && !isNaN(date.getTime()) && value.includes("T")
    );
  },

  /**
   * Validates positive number
   */
  isPositiveNumber: (value: number): boolean => {
    return typeof value === "number" && value >= 0 && !isNaN(value);
  },

  /**
   * Validates number is within range
   */
  isNumberInRange: (value: number, min: number, max: number): boolean => {
    return typeof value === "number" && value >= min && value <= max;
  },

  /**
   * Validates string length
   */
  isStringLengthValid: (value: string, min: number, max: number): boolean => {
    return (
      typeof value === "string" && value.length >= min && value.length <= max
    );
  },

  /**
   * Validates decimal string (for monetary values)
   */
  isValidDecimalString: (value: string): boolean => {
    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    return decimalRegex.test(value) && parseFloat(value) >= 0;
  },

  /**
   * Validates territory access
   */
  hasTerritoryAccess: (
    userTerritoryId: string,
    targetTerritoryId: string
  ): boolean => {
    return userTerritoryId === targetTerritoryId;
  },

  /**
   * Validates plant access
   */
  hasPlantAccess: (userPlantId: string, targetPlantId: string): boolean => {
    return userPlantId === targetPlantId;
  },

  /**
   * Validates role permissions
   */
  hasRolePermission: (
    userRole: string,
    requiredRoles: string[],
    operation: "read" | "write" | "admin" = "read"
  ): boolean => {
    return requiredRoles.includes(userRole);
  },

  /**
   * Validates cross-system access
   */
  hasCrossSystemAccess: (
    userRoles: string[],
    system: "training" | "business" | "both"
  ): boolean => {
    const trainingRoles = [
      "safety_admin",
      "safety_manager",
      "safety_coordinator",
      "safety_instructor",
      "plant_manager",
      "hr_admin",
    ];

    const businessRoles = [
      "safety_admin",
      "sales_admin",
      "sales_manager",
      "sales_rep",
      "territory_manager",
    ];

    switch (system) {
      case "training":
        return userRoles.some(role => trainingRoles.includes(role));
      case "business":
        return userRoles.some(role => businessRoles.includes(role));
      case "both":
        return userRoles.some(
          role => trainingRoles.includes(role) || businessRoles.includes(role)
        );
      default:
        return false;
    }
  },

  /**
   * Validates business rule constraints
   */
  validateBusinessRules: (
    entity: any,
    rules: BusinessRule[]
  ): ValidationResult => {
    const errors: ValidationError[] = [];

    for (const rule of rules) {
      try {
        const result = rule.validate(entity);
        if (!result.valid) {
          errors.push({
            field: rule.field,
            message: result.message || rule.message,
            code: rule.code,
            value: entity[rule.field],
          });
        }
      } catch (error) {
        errors.push({
          field: rule.field,
          message: rule.message,
          code: rule.code,
          value: entity[rule.field],
        });
      }
    }

    return {
      valid: errors.length === 0,
      issues: errors,
    };
  },
};

// =============================================================================
// VALIDATION MESSAGES
// =============================================================================

export const validationMessages = {
  // Common messages
  REQUIRED_FIELD: "This field is required",
  INVALID_FORMAT: "Invalid format",
  INVALID_EMAIL: "Invalid email address",
  INVALID_PHONE: "Invalid phone number",
  INVALID_URL: "Invalid URL format",
  INVALID_UUID: "Invalid UUID format",
  INVALID_DATE: "Invalid date format",

  // Length messages
  TOO_SHORT: "Value is too short",
  TOO_LONG: "Value is too long",

  // Range messages
  OUT_OF_RANGE: "Value is out of acceptable range",
  NEGATIVE_NUMBER: "Value must be positive",
  INVALID_PERCENTAGE: "Percentage must be between 0 and 100",

  // Business rule messages
  DUPLICATE_VALUE: "This value already exists",
  INVALID_STAGE_TRANSITION: "Invalid stage transition",
  MISSING_REQUIRED_FIELD: "Required field is missing",
  INVALID_RELATIONSHIP: "Invalid entity relationship",

  // Access control messages
  ACCESS_DENIED: "Access denied",
  TERRITORY_ACCESS_DENIED: "Territory access denied",
  PLANT_ACCESS_DENIED: "Plant access denied",
  ROLE_PERMISSION_DENIED: "Insufficient role permissions",
  CROSS_SYSTEM_ACCESS_DENIED: "Cross-system access denied",

  // Not found messages
  NOT_FOUND: "Resource not found",
  ACCOUNT_NOT_FOUND: "Account not found",
  CONTACT_NOT_FOUND: "Contact not found",
  OPPORTUNITY_NOT_FOUND: "Opportunity not found",
  PRODUCT_NOT_FOUND: "Product not found",
  PROJECT_NOT_FOUND: "Project not found",
  TERRITORY_NOT_FOUND: "Territory not found",
  PLANT_NOT_FOUND: "Plant not found",
  USER_NOT_FOUND: "User not found",

  // Compliance messages
  COMPLIANCE_VIOLATION: "Compliance violation detected",
  SAFETY_REQUIREMENT_NOT_MET: "Safety requirement not met",
  TRAINING_OVERDUE: "Required training is overdue",
  CERTIFICATION_EXPIRED: "Safety certification has expired",

  // System messages
  SYSTEM_ERROR: "System error occurred",
  VALIDATION_ERROR: "Validation error occurred",
  DATABASE_ERROR: "Database error occurred",
  NETWORK_ERROR: "Network error occurred",
};

// =============================================================================
// VALIDATION ERROR CODES
// =============================================================================

export const validationErrorCodes = {
  // Common codes
  REQUIRED: "REQUIRED",
  INVALID_FORMAT: "INVALID_FORMAT",
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_PHONE: "INVALID_PHONE",
  INVALID_URL: "INVALID_URL",
  INVALID_UUID: "INVALID_UUID",
  INVALID_DATE: "INVALID_DATE",

  // Length codes
  TOO_SHORT: "TOO_SHORT",
  TOO_LONG: "TOO_LONG",

  // Range codes
  OUT_OF_RANGE: "OUT_OF_RANGE",
  NEGATIVE_NUMBER: "NEGATIVE_NUMBER",
  INVALID_PERCENTAGE: "INVALID_PERCENTAGE",

  // Business rule codes
  DUPLICATE_VALUE: "DUPLICATE_VALUE",
  INVALID_STAGE_TRANSITION: "INVALID_STAGE_TRANSITION",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",
  INVALID_RELATIONSHIP: "INVALID_RELATIONSHIP",

  // Access control codes
  ACCESS_DENIED: "ACCESS_DENIED",
  TERRITORY_ACCESS_DENIED: "TERRITORY_ACCESS_DENIED",
  PLANT_ACCESS_DENIED: "PLANT_ACCESS_DENIED",
  ROLE_PERMISSION_DENIED: "ROLE_PERMISSION_DENIED",
  CROSS_SYSTEM_ACCESS_DENIED: "CROSS_SYSTEM_ACCESS_DENIED",

  // Not found codes
  NOT_FOUND: "NOT_FOUND",
  ACCOUNT_NOT_FOUND: "ACCOUNT_NOT_FOUND",
  CONTACT_NOT_FOUND: "CONTACT_NOT_FOUND",
  OPPORTUNITY_NOT_FOUND: "OPPORTUNITY_NOT_FOUND",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND",
  TERRITORY_NOT_FOUND: "TERRITORY_NOT_FOUND",
  PLANT_NOT_FOUND: "PLANT_NOT_FOUND",
  USER_NOT_FOUND: "USER_NOT_FOUND",

  // Compliance codes
  COMPLIANCE_VIOLATION: "COMPLIANCE_VIOLATION",
  SAFETY_REQUIREMENT_NOT_MET: "SAFETY_REQUIREMENT_NOT_MET",
  TRAINING_OVERDUE: "TRAINING_OVERDUE",
  CERTIFICATION_EXPIRED: "CERTIFICATION_EXPIRED",

  // System codes
  SYSTEM_ERROR: "SYSTEM_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
};

// =============================================================================
// BUSINESS RULE VALIDATION
// =============================================================================

// =============================================================================
// SAFETY BUSINESS RULES
// =============================================================================

export const safetyBusinessRules = {
  /**
   * Opportunity stage transition rules
   */
  opportunityStageRules: [
    {
      name: "opportunity_stage_transition",
      field: "stage",
      code: "INVALID_STAGE_TRANSITION",
      message: "Invalid stage transition",
      validate: (opportunity: any) => {
        const validTransitions: Record<string, string[]> = {
          prospecting: ["qualification", "closed_lost"],
          qualification: ["needs_analysis", "closed_lost"],
          needs_analysis: ["proposal", "closed_lost"],
          proposal: ["negotiation", "closed_lost"],
          negotiation: ["closed_won", "closed_lost"],
          closed_won: [],
          closed_lost: [],
        };

        // If no previous stage, allow any initial stage
        if (!opportunity.previousStage) {
          return { valid: true };
        }

        const allowedTransitions =
          validTransitions[opportunity.previousStage] || [];
        const isValidTransition = allowedTransitions.includes(
          opportunity.stage
        );

        return {
          valid: isValidTransition,
          message: isValidTransition
            ? undefined
            : `Cannot transition from ${opportunity.previousStage} to ${opportunity.stage}`,
        };
      },
    },
  ],

  /**
   * Contact role validation rules
   */
  contactRoleRules: [
    {
      name: "contact_role_validation",
      field: "role",
      code: "INVALID_CONTACT_ROLE",
      message: "Invalid contact role",
      validate: (contact: any) => {
        const validRoles = [
          "safety_manager",
          "safety_coordinator",
          "safety_instructor",
          "hr_manager",
          "plant_manager",
          "purchasing_manager",
          "decision_maker",
          "influencer",
          "user",
          "other",
        ];

        return {
          valid: validRoles.includes(contact.role),
          message: validRoles.includes(contact.role)
            ? undefined
            : `Invalid contact role: ${contact.role}`,
        };
      },
    },
  ],

  /**
   * Account type validation rules
   */
  accountTypeRules: [
    {
      field: "type",
      code: "INVALID_ACCOUNT_TYPE",
      validate: (account: any) => {
        const validTypes = [
          "safety_equipment_customer",
          "training_client",
          "consulting_client",
          "maintenance_client",
          "partner",
          "vendor",
        ];

        return {
          valid: validTypes.includes(account.type),
          message: validTypes.includes(account.type)
            ? undefined
            : `Invalid account type: ${account.type}`,
        };
      },
    },
  ],

  /**
   * Product category validation rules
   */
  productCategoryRules: [
    {
      field: "category",
      code: "INVALID_PRODUCT_CATEGORY",
      validate: (product: any) => {
        const validCategories = [
          "safety_equipment",
          "training_material",
          "consulting_service",
          "maintenance_service",
          "compliance_tool",
          "software",
          "other",
        ];

        return {
          valid: validCategories.includes(product.category),
          message: validCategories.includes(product.category)
            ? undefined
            : `Invalid product category: ${product.category}`,
        };
      },
    },
  ],
};

// =============================================================================
// TERRITORY AND ROLE VALIDATION UTILITIES
// =============================================================================

export const territoryValidation = {
  /**
   * Validates territory access for user operations
   */
  validateTerritoryAccess: (
    userTerritoryId: string,
    targetTerritoryId: string,
    userRole: string
  ): ValidationResult => {
    // Admin roles can access any territory
    const adminRoles = ["safety_admin", "sales_admin"];
    if (adminRoles.includes(userRole)) {
      return { valid: true };
    }

    // Other roles can only access their own territory
    return {
      valid: userTerritoryId === targetTerritoryId,
      message:
        userTerritoryId === targetTerritoryId
          ? undefined
          : "Access denied: Territory access not permitted",
    };
  },

  /**
   * Validates territory-scoped entity operations
   */
  validateTerritoryScopedOperation: (
    userTerritoryId: string,
    entityTerritoryId: string,
    operation: "read" | "write" | "admin",
    userRole: string
  ): ValidationResult => {
    // Admin roles can perform any operation on any territory
    const adminRoles = ["safety_admin", "sales_admin"];
    if (adminRoles.includes(userRole)) {
      return { valid: true };
    }

    // Territory managers can perform operations in their territory
    if (
      userRole === "territory_manager" &&
      userTerritoryId === entityTerritoryId
    ) {
      return { valid: true };
    }

    // Sales managers can perform operations in their territory
    if (userRole === "sales_manager" && userTerritoryId === entityTerritoryId) {
      return { valid: true };
    }

    // Sales reps can read and write in their territory
    if (
      userRole === "sales_rep" &&
      userTerritoryId === entityTerritoryId &&
      operation !== "admin"
    ) {
      return { valid: true };
    }

    return {
      valid: false,
      message:
        "Access denied: Insufficient permissions for territory-scoped operation",
    };
  },
};

export const roleValidation = {
  /**
   * Validates role permissions for specific operations
   */
  validateRolePermission: (
    userRole: string,
    operation: "read" | "write" | "admin",
    resource: string,
    system: "training" | "business" | "both"
  ): ValidationResult => {
    const rolePermissions = {
      // Training system permissions
      training: {
        safety_admin: { read: true, write: true, admin: true },
        safety_manager: { read: true, write: true, admin: false },
        safety_coordinator: { read: true, write: true, admin: false },
        safety_instructor: { read: true, write: false, admin: false },
        plant_manager: { read: true, write: true, admin: false },
        hr_admin: { read: true, write: true, admin: false },
        employee: { read: true, write: false, admin: false },
      },

      // Business system permissions
      business: {
        safety_admin: { read: true, write: true, admin: true },
        sales_admin: { read: true, write: true, admin: true },
        sales_manager: { read: true, write: true, admin: false },
        sales_rep: { read: true, write: true, admin: false },
        territory_manager: { read: true, write: true, admin: false },
      },
    };

    const permissions = rolePermissions[system];
    if (!permissions || !permissions[userRole]) {
      return {
        valid: false,
        message: `Invalid role for ${system} system: ${userRole}`,
      };
    }

    const hasPermission = permissions[userRole][operation];
    return {
      valid: hasPermission,
      message: hasPermission
        ? undefined
        : `Insufficient permissions for ${operation} operation on ${resource}`,
    };
  },
};

// =============================================================================
// ENHANCED VALIDATION SCHEMAS
// =============================================================================

/**
 * Enhanced UUID schema with custom validation
 */
export const enhancedUuidSchema = z
  .string()
  .refine(val => validationUtils.isValidUUID(val), {
    message: validationMessages.INVALID_UUID,
  });

/**
 * Enhanced email schema with custom validation
 */
export const enhancedEmailSchema = z
  .string()
  .refine(val => validationUtils.isValidEmail(val), {
    message: validationMessages.INVALID_EMAIL,
  });

/**
 * Enhanced phone schema with custom validation
 */
export const enhancedPhoneSchema = z
  .string()
  .optional()
  .refine(val => !val || validationUtils.isValidPhone(val), {
    message: validationMessages.INVALID_PHONE,
  });

/**
 * Enhanced URL schema with custom validation
 */
export const enhancedUrlSchema = z
  .string()
  .optional()
  .refine(val => !val || validationUtils.isValidURL(val), {
    message: validationMessages.INVALID_URL,
  });

/**
 * Enhanced ISO date schema with custom validation
 */
export const enhancedIsoDateSchema = z
  .string()
  .refine(val => validationUtils.isValidISODate(val), {
    message: validationMessages.INVALID_DATE,
  });

/**
 * Enhanced decimal string schema for monetary values
 */
export const enhancedDecimalStringSchema = z
  .string()
  .optional()
  .refine(val => !val || validationUtils.isValidDecimalString(val), {
    message: "Must be a valid decimal number",
  });

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface BusinessRule {
  name: string;
  field: string;
  validate: (entity: any) => ValidationResult;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
  issues?: ValidationError[];
}
