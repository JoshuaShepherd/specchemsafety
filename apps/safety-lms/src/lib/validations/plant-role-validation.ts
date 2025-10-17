import { z } from "zod";
import {
  plantAccessSchema,
  safetyAdminFieldsSchema,
  plantManagerFieldsSchema,
  safetyInstructorFieldsSchema,
  hrAdminFieldsSchema,
  userRoleSchema,
} from "./safety-business";

// =============================================================================
// PLANT-BASED VALIDATION UTILITIES
// =============================================================================

/**
 * Validates that a user has access to a specific plant
 */
export const validatePlantAccess = (
  userPlantId: string,
  targetPlantId: string
): boolean => {
  return userPlantId === targetPlantId;
};

/**
 * Validates plant access with Zod schema
 */
export const plantAccessValidationSchema = plantAccessSchema.refine(
  data => validatePlantAccess(data.userId, data.plantId),
  {
    message: "User does not have access to this plant",
    path: ["plantId"],
  }
);

// =============================================================================
// ROLE-BASED VALIDATION UTILITIES
// =============================================================================

/**
 * Role hierarchy for safety training system
 */
export const ROLE_HIERARCHY = {
  safety_admin: 100,
  plant_manager: 80,
  safety_instructor: 60,
  hr_admin: 60,
  safety_coordinator: 40,
  employee: 20,
} as const;

/**
 * Check if a role has sufficient permissions
 */
export const hasRolePermission = (
  userRole: string,
  requiredRole: string
): boolean => {
  const userLevel =
    ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  const requiredLevel =
    ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0;
  return userLevel >= requiredLevel;
};

/**
 * Get role-based field permissions
 */
export const getRolePermissions = (role: string) => {
  switch (role) {
    case "safety_admin":
      return safetyAdminFieldsSchema.parse({
        canManageAllPlants: true,
        canManageUsers: true,
        canManageCourses: true,
        canViewAllData: true,
        canManageAdminRoles: true,
      });

    case "plant_manager":
      return plantManagerFieldsSchema.parse({
        canManagePlantUsers: true,
        canManagePlantCourses: true,
        canViewPlantData: true,
        canAssignTraining: true,
        canViewReports: true,
      });

    case "safety_instructor":
      return safetyInstructorFieldsSchema.parse({
        canCreateCourses: true,
        canEditCourses: true,
        canViewEnrollments: true,
        canViewProgress: true,
        canManageQuestions: true,
      });

    case "hr_admin":
      return hrAdminFieldsSchema.parse({
        canManageEnrollments: true,
        canViewCompliance: true,
        canAssignRequiredTraining: true,
        canViewReports: true,
      });

    default:
      return {
        canManageAllPlants: false,
        canManageUsers: false,
        canManageCourses: false,
        canViewAllData: false,
        canManageAdminRoles: false,
      };
  }
};

// =============================================================================
// PLANT-SCOPED OPERATION VALIDATION
// =============================================================================

/**
 * Validates that a user can perform operations on a specific plant
 */
export const validatePlantOperation = (
  userRole: string,
  userPlantId: string,
  targetPlantId: string,
  operation: "read" | "write" | "admin"
): { isValid: boolean; reason?: string } => {
  // Safety admins can access all plants
  if (userRole === "safety_admin") {
    return { isValid: true };
  }

  // Check plant access
  if (!validatePlantAccess(userPlantId, targetPlantId)) {
    return {
      isValid: false,
      reason: "User does not have access to this plant",
    };
  }

  // Check role permissions for operation
  const permissions = getRolePermissions(userRole);

  switch (operation) {
    case "read":
      if (
        userRole === "safety_admin" ||
        (permissions as any).canViewAllData ||
        (permissions as any).canViewPlantData
      ) {
        return { isValid: true };
      }
      break;

    case "write":
      if (
        userRole === "safety_admin" ||
        (permissions as any).canManagePlantUsers ||
        (permissions as any).canManagePlantCourses ||
        (permissions as any).canManageEnrollments
      ) {
        return { isValid: true };
      }
      break;

    case "admin":
      if (
        userRole === "safety_admin" ||
        (permissions as any).canManageAdminRoles
      ) {
        return { isValid: true };
      }
      break;
  }

  return {
    isValid: false,
    reason: "Insufficient permissions for this operation",
  };
};

// =============================================================================
// COURSE MANAGEMENT VALIDATION
// =============================================================================

/**
 * Validates course creation permissions
 */
export const validateCourseCreation = (
  userRole: string,
  userPlantId: string,
  coursePlantId: string
): { isValid: boolean; reason?: string } => {
  const operation = validatePlantOperation(
    userRole,
    userPlantId,
    coursePlantId,
    "write"
  );
  if (!operation.isValid) {
    return operation;
  }

  const permissions = getRolePermissions(userRole);
  if (
    !(permissions as any).canCreateCourses &&
    !(permissions as any).canManagePlantCourses
  ) {
    return { isValid: false, reason: "User cannot create courses" };
  }

  return { isValid: true };
};

/**
 * Validates enrollment permissions
 */
export const validateEnrollmentAccess = (
  userRole: string,
  userPlantId: string,
  enrollmentPlantId: string,
  action: "view" | "create" | "update" | "delete"
): { isValid: boolean; reason?: string } => {
  const operation = validatePlantOperation(
    userRole,
    userPlantId,
    enrollmentPlantId,
    "write"
  );
  if (!operation.isValid && action !== "view") {
    return operation;
  }

  const permissions = getRolePermissions(userRole);

  switch (action) {
    case "view":
      if (
        (permissions as any).canViewAllData ||
        (permissions as any).canViewPlantData ||
        (permissions as any).canViewEnrollments
      ) {
        return { isValid: true };
      }
      break;

    case "create":
    case "update":
    case "delete":
      if (
        (permissions as any).canManageEnrollments ||
        (permissions as any).canAssignTraining
      ) {
        return { isValid: true };
      }
      break;
  }

  return { isValid: false, reason: `User cannot ${action} enrollments` };
};

// =============================================================================
// USER MANAGEMENT VALIDATION
// =============================================================================

/**
 * Validates user management permissions
 */
export const validateUserManagement = (
  userRole: string,
  userPlantId: string,
  targetPlantId: string,
  action: "view" | "create" | "update" | "delete"
): { isValid: boolean; reason?: string } => {
  const operation = validatePlantOperation(
    userRole,
    userPlantId,
    targetPlantId,
    "write"
  );
  if (!operation.isValid && action !== "view") {
    return operation;
  }

  const permissions = getRolePermissions(userRole);

  switch (action) {
    case "view":
      if (
        (permissions as any).canViewAllData ||
        (permissions as any).canViewPlantData
      ) {
        return { isValid: true };
      }
      break;

    case "create":
    case "update":
    case "delete":
      if (
        (permissions as any).canManageUsers ||
        (permissions as any).canManagePlantUsers
      ) {
        return { isValid: true };
      }
      break;
  }

  return { isValid: false, reason: `User cannot ${action} users` };
};

// =============================================================================
// PROGRESS TRACKING VALIDATION
// =============================================================================

/**
 * Validates progress tracking permissions
 */
export const validateProgressAccess = (
  userRole: string,
  userPlantId: string,
  progressPlantId: string,
  isOwnProgress: boolean = false
): { isValid: boolean; reason?: string } => {
  // Users can always view their own progress
  if (isOwnProgress) {
    return { isValid: true };
  }

  const operation = validatePlantOperation(
    userRole,
    userPlantId,
    progressPlantId,
    "read"
  );
  if (!operation.isValid) {
    return operation;
  }

  const permissions = getRolePermissions(userRole);
  if (
    (permissions as any).canViewAllData ||
    (permissions as any).canViewPlantData ||
    (permissions as any).canViewProgress
  ) {
    return { isValid: true };
  }

  return { isValid: false, reason: "User cannot view this progress data" };
};

// =============================================================================
// COMPLIANCE VALIDATION
// =============================================================================

/**
 * Validates compliance reporting permissions
 */
export const validateComplianceAccess = (
  userRole: string,
  userPlantId: string,
  targetPlantId: string
): { isValid: boolean; reason?: string } => {
  const operation = validatePlantOperation(
    userRole,
    userPlantId,
    targetPlantId,
    "read"
  );
  if (!operation.isValid) {
    return operation;
  }

  const permissions = getRolePermissions(userRole);
  if (
    (permissions as any).canViewAllData ||
    (permissions as any).canViewPlantData ||
    (permissions as any).canViewCompliance
  ) {
    return { isValid: true };
  }

  return { isValid: false, reason: "User cannot view compliance data" };
};

// =============================================================================
// ZOD SCHEMAS FOR MIDDLEWARE
// =============================================================================

/**
 * Plant-scoped request validation schema
 */
export const plantScopedRequestSchema = z.object({
  plantId: z.string().uuid("Invalid plant ID"),
  userRole: userRoleSchema,
  userPlantId: z.string().uuid("Invalid user plant ID"),
});

/**
 * Role-based operation validation schema
 */
export const roleBasedOperationSchema = z.object({
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

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type PlantOperationResult = {
  isValid: boolean;
  reason?: string;
};

export type ValidationContext = {
  userRole: string;
  userPlantId: string;
  targetPlantId: string;
  operation: "read" | "write" | "admin";
  resource?: string;
};

export type PlantScopedRequest = z.infer<typeof plantScopedRequestSchema>;
export type RoleBasedOperation = z.infer<typeof roleBasedOperationSchema>;
