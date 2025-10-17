/**
 * Role-Based Access Control Mappers
 * Handles role-based permissions and field visibility for safety training system
 * Implements hierarchical role system with plant-scoped permissions
 */

// =============================================================================
// ROLE HIERARCHY AND PERMISSIONS
// =============================================================================

/**
 * Safety training role hierarchy
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
 * Role permissions interface
 */
export interface RolePermissions {
  // Plant management
  canManageAllPlants: boolean;
  canViewAllPlants: boolean;
  canViewPlantData: boolean;

  // User management
  canManageUsers: boolean;
  canManagePlantUsers: boolean;
  canViewAllUsers: boolean;
  canViewPlantUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;

  // Course management
  canManageCourses: boolean;
  canCreateCourses: boolean;
  canEditCourses: boolean;
  canDeleteCourses: boolean;
  canPublishCourses: boolean;
  canViewAllCourses: boolean;
  canViewPlantCourses: boolean;

  // Enrollment management
  canManageEnrollments: boolean;
  canAssignTraining: boolean;
  canViewAllEnrollments: boolean;
  canViewPlantEnrollments: boolean;
  canCreateEnrollments: boolean;
  canEditEnrollments: boolean;
  canDeleteEnrollments: boolean;

  // Progress tracking
  canViewAllProgress: boolean;
  canViewPlantProgress: boolean;
  canEditProgress: boolean;
  canManageProgress: boolean;

  // Reporting and compliance
  canViewAllReports: boolean;
  canViewPlantReports: boolean;
  canViewCompliance: boolean;
  canExportData: boolean;

  // System administration
  canManageAdminRoles: boolean;
  canViewAuditTrails: boolean;
  canViewSystemLogs: boolean;
  canManageSystemSettings: boolean;
}

/**
 * Gets role permissions based on role hierarchy
 */
export const getRolePermissions = (
  role: keyof typeof ROLE_HIERARCHY
): RolePermissions => {
  switch (role) {
    case "safety_admin":
      return {
        // Plant management - full access
        canManageAllPlants: true,
        canManagePlantUsers: true,
        canViewAllPlants: true,
        canViewPlantData: true,

        // User management - full access
        canManageUsers: true,
        canViewAllUsers: true,
        canViewPlantUsers: true,
        canCreateUsers: true,
        canEditUsers: true,
        canDeleteUsers: true,

        // Course management - full access
        canManageCourses: true,
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: true,
        canPublishCourses: true,
        canViewAllCourses: true,
        canViewPlantCourses: true,

        // Enrollment management - full access
        canManageEnrollments: true,
        canAssignTraining: true,
        canViewAllEnrollments: true,
        canViewPlantEnrollments: true,
        canCreateEnrollments: true,
        canEditEnrollments: true,
        canDeleteEnrollments: true,

        // Progress tracking - full access
        canViewAllProgress: true,
        canViewPlantProgress: true,
        canEditProgress: true,
        canManageProgress: true,

        // Reporting and compliance - full access
        canViewAllReports: true,
        canViewPlantReports: true,
        canViewCompliance: true,
        canExportData: true,

        // System administration - full access
        canManageAdminRoles: true,
        canViewAuditTrails: true,
        canViewSystemLogs: true,
        canManageSystemSettings: true,
      };

    case "plant_manager":
      return {
        // Plant management - plant-scoped
        canManageAllPlants: false,
        canManagePlantUsers: true,
        canViewAllPlants: false,
        canViewPlantData: true,

        // User management - plant-scoped
        canManageUsers: false,
        canViewAllUsers: false,
        canViewPlantUsers: true,
        canCreateUsers: true,
        canEditUsers: true,
        canDeleteUsers: false,

        // Course management - plant-scoped
        canManageCourses: false,
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: true,
        canPublishCourses: true,
        canViewAllCourses: false,
        canViewPlantCourses: true,

        // Enrollment management - plant-scoped
        canManageEnrollments: false,
        canAssignTraining: true,
        canViewAllEnrollments: false,
        canViewPlantEnrollments: true,
        canCreateEnrollments: true,
        canEditEnrollments: true,
        canDeleteEnrollments: true,

        // Progress tracking - plant-scoped
        canViewAllProgress: false,
        canViewPlantProgress: true,
        canEditProgress: true,
        canManageProgress: true,

        // Reporting and compliance - plant-scoped
        canViewAllReports: false,
        canViewPlantReports: true,
        canViewCompliance: true,
        canExportData: true,

        // System administration - limited
        canManageAdminRoles: false,
        canViewAuditTrails: false,
        canViewSystemLogs: false,
        canManageSystemSettings: false,
      };

    case "safety_instructor":
      return {
        // Plant management - limited
        canManageAllPlants: false,
        canManagePlantUsers: false,
        canViewAllPlants: false,
        canViewPlantData: true,

        // User management - read-only
        canManageUsers: false,
        canViewAllUsers: false,
        canViewPlantUsers: true,
        canCreateUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,

        // Course management - plant-scoped
        canManageCourses: false,
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: false,
        canPublishCourses: true,
        canViewAllCourses: false,
        canViewPlantCourses: true,

        // Enrollment management - limited
        canManageEnrollments: false,
        canAssignTraining: false,
        canViewAllEnrollments: false,
        canViewPlantEnrollments: true,
        canCreateEnrollments: false,
        canEditEnrollments: false,
        canDeleteEnrollments: false,

        // Progress tracking - plant-scoped
        canViewAllProgress: false,
        canViewPlantProgress: true,
        canEditProgress: true,
        canManageProgress: true,

        // Reporting and compliance - limited
        canViewAllReports: false,
        canViewPlantReports: false,
        canViewCompliance: false,
        canExportData: false,

        // System administration - none
        canManageAdminRoles: false,
        canViewAuditTrails: false,
        canViewSystemLogs: false,
        canManageSystemSettings: false,
      };

    case "hr_admin":
      return {
        // Plant management - limited
        canManageAllPlants: false,
        canManagePlantUsers: false,
        canViewAllPlants: false,
        canViewPlantData: true,

        // User management - plant-scoped
        canManageUsers: false,
        canViewAllUsers: false,
        canViewPlantUsers: true,
        canCreateUsers: true,
        canEditUsers: true,
        canDeleteUsers: false,

        // Course management - read-only
        canManageCourses: false,
        canCreateCourses: false,
        canEditCourses: false,
        canDeleteCourses: false,
        canPublishCourses: false,
        canViewAllCourses: false,
        canViewPlantCourses: true,

        // Enrollment management - plant-scoped
        canManageEnrollments: false,
        canAssignTraining: true,
        canViewAllEnrollments: false,
        canViewPlantEnrollments: true,
        canCreateEnrollments: true,
        canEditEnrollments: true,
        canDeleteEnrollments: true,

        // Progress tracking - read-only
        canViewAllProgress: false,
        canViewPlantProgress: true,
        canEditProgress: false,
        canManageProgress: false,

        // Reporting and compliance - plant-scoped
        canViewAllReports: false,
        canViewPlantReports: true,
        canViewCompliance: true,
        canExportData: true,

        // System administration - none
        canManageAdminRoles: false,
        canViewAuditTrails: false,
        canViewSystemLogs: false,
        canManageSystemSettings: false,
      };

    case "safety_coordinator":
      return {
        // Plant management - none
        canManageAllPlants: false,
        canManagePlantUsers: false,
        canViewAllPlants: false,
        canViewPlantData: true,

        // User management - read-only
        canManageUsers: false,
        canViewAllUsers: false,
        canViewPlantUsers: true,
        canCreateUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,

        // Course management - limited
        canManageCourses: false,
        canCreateCourses: false,
        canEditCourses: true,
        canDeleteCourses: false,
        canPublishCourses: false,
        canViewAllCourses: false,
        canViewPlantCourses: true,

        // Enrollment management - read-only
        canManageEnrollments: false,
        canAssignTraining: false,
        canViewAllEnrollments: false,
        canViewPlantEnrollments: true,
        canCreateEnrollments: false,
        canEditEnrollments: false,
        canDeleteEnrollments: false,

        // Progress tracking - read-only
        canViewAllProgress: false,
        canViewPlantProgress: true,
        canEditProgress: false,
        canManageProgress: false,

        // Reporting and compliance - limited
        canViewAllReports: false,
        canViewPlantReports: false,
        canViewCompliance: true,
        canExportData: false,

        // System administration - none
        canManageAdminRoles: false,
        canViewAuditTrails: false,
        canViewSystemLogs: false,
        canManageSystemSettings: false,
      };

    case "employee":
      return {
        // Plant management - none
        canManageAllPlants: false,
        canManagePlantUsers: false,
        canViewAllPlants: false,
        canViewPlantData: false,

        // User management - self-only
        canManageUsers: false,
        canViewAllUsers: false,
        canViewPlantUsers: false,
        canCreateUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,

        // Course management - read-only
        canManageCourses: false,
        canCreateCourses: false,
        canEditCourses: false,
        canDeleteCourses: false,
        canPublishCourses: false,
        canViewAllCourses: false,
        canViewPlantCourses: true,

        // Enrollment management - self-only
        canManageEnrollments: false,
        canAssignTraining: false,
        canViewAllEnrollments: false,
        canViewPlantEnrollments: false,
        canCreateEnrollments: false,
        canEditEnrollments: false,
        canDeleteEnrollments: false,

        // Progress tracking - self-only
        canViewAllProgress: false,
        canViewPlantProgress: false,
        canEditProgress: true, // Can update own progress
        canManageProgress: false,

        // Reporting and compliance - none
        canViewAllReports: false,
        canViewPlantReports: false,
        canViewCompliance: false,
        canExportData: false,

        // System administration - none
        canManageAdminRoles: false,
        canViewAuditTrails: false,
        canViewSystemLogs: false,
        canManageSystemSettings: false,
      };

    default:
      // Default to employee permissions for unknown roles
      return getRolePermissions("employee");
  }
};

// =============================================================================
// ROLE-BASED FIELD VISIBILITY MAPPERS
// =============================================================================

/**
 * Field visibility configuration
 */
export interface FieldVisibilityConfig {
  [fieldName: string]: {
    roles: string[];
    condition?: (context: any) => boolean;
  };
}

/**
 * User profile field visibility
 */
export const USER_PROFILE_FIELD_VISIBILITY: FieldVisibilityConfig = {
  id: {
    roles: ["safety_admin", "plant_manager", "hr_admin", "safety_instructor"],
  },
  authUserId: { roles: ["safety_admin", "plant_manager"] },
  plantId: { roles: ["safety_admin", "plant_manager", "hr_admin"] },
  firstName: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
      "employee",
    ],
  },
  lastName: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
      "employee",
    ],
  },
  email: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
      "employee",
    ],
  },
  phone: { roles: ["safety_admin", "plant_manager", "hr_admin"] },
  jobTitle: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
    ],
  },
  department: { roles: ["safety_admin", "plant_manager", "hr_admin"] },
  role: { roles: ["safety_admin", "plant_manager"] },
  status: { roles: ["safety_admin", "plant_manager", "hr_admin"] },
  isActive: { roles: ["safety_admin", "plant_manager"] },
  lastLoginAt: { roles: ["safety_admin", "plant_manager"] },
  createdAt: { roles: ["safety_admin", "plant_manager"] },
  updatedAt: { roles: ["safety_admin", "plant_manager"] },
  createdBy: { roles: ["safety_admin"] },
};

/**
 * Course field visibility
 */
export const COURSE_FIELD_VISIBILITY: FieldVisibilityConfig = {
  id: {
    roles: [
      "safety_admin",
      "plant_manager",
      "safety_instructor",
      "hr_admin",
      "safety_coordinator",
      "employee",
    ],
  },
  plantId: { roles: ["safety_admin", "plant_manager"] },
  name: {
    roles: [
      "safety_admin",
      "plant_manager",
      "safety_instructor",
      "hr_admin",
      "safety_coordinator",
      "employee",
    ],
  },
  description: {
    roles: [
      "safety_admin",
      "plant_manager",
      "safety_instructor",
      "hr_admin",
      "safety_coordinator",
      "employee",
    ],
  },
  type: {
    roles: [
      "safety_admin",
      "plant_manager",
      "safety_instructor",
      "hr_admin",
      "safety_coordinator",
    ],
  },
  status: {
    roles: ["safety_admin", "plant_manager", "safety_instructor", "hr_admin"],
  },
  difficultyLevel: {
    roles: [
      "safety_admin",
      "plant_manager",
      "safety_instructor",
      "hr_admin",
      "safety_coordinator",
      "employee",
    ],
  },
  duration: {
    roles: [
      "safety_admin",
      "plant_manager",
      "safety_instructor",
      "hr_admin",
      "safety_coordinator",
      "employee",
    ],
  },
  isRequired: { roles: ["safety_admin", "plant_manager", "hr_admin"] },
  completionCriteria: {
    roles: [
      "safety_admin",
      "plant_manager",
      "safety_instructor",
      "hr_admin",
      "safety_coordinator",
      "employee",
    ],
  },
  prerequisites: {
    roles: [
      "safety_admin",
      "plant_manager",
      "safety_instructor",
      "hr_admin",
      "safety_coordinator",
      "employee",
    ],
  },
  isActive: { roles: ["safety_admin", "plant_manager", "safety_instructor"] },
  createdAt: { roles: ["safety_admin", "plant_manager", "safety_instructor"] },
  updatedAt: { roles: ["safety_admin", "plant_manager", "safety_instructor"] },
};

/**
 * Enrollment field visibility
 */
export const ENROLLMENT_FIELD_VISIBILITY: FieldVisibilityConfig = {
  id: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
      "employee",
    ],
  },
  userId: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
    ],
  },
  courseId: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
      "employee",
    ],
  },
  plantId: { roles: ["safety_admin", "plant_manager"] },
  status: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
      "employee",
    ],
  },
  enrolledAt: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
      "employee",
    ],
  },
  startedAt: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
      "employee",
    ],
  },
  completedAt: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
      "employee",
    ],
  },
  expiresAt: { roles: ["safety_admin", "plant_manager", "hr_admin"] },
  score: {
    roles: [
      "safety_admin",
      "plant_manager",
      "hr_admin",
      "safety_instructor",
      "safety_coordinator",
      "employee",
    ],
  },
  attempts: {
    roles: ["safety_admin", "plant_manager", "hr_admin", "safety_instructor"],
  },
  notes: {
    roles: ["safety_admin", "plant_manager", "hr_admin", "safety_instructor"],
  },
  isActive: { roles: ["safety_admin", "plant_manager", "hr_admin"] },
  createdAt: { roles: ["safety_admin", "plant_manager", "hr_admin"] },
  updatedAt: { roles: ["safety_admin", "plant_manager", "hr_admin"] },
};

/**
 * Checks if a field should be visible to a role
 */
export const isFieldVisibleToRole = (
  fieldName: string,
  userRole: string,
  visibilityConfig: FieldVisibilityConfig,
  context?: any
): boolean => {
  const fieldConfig = visibilityConfig[fieldName];
  if (!fieldConfig) {
    return false; // Field not configured, hide by default
  }

  if (!fieldConfig.roles.includes(userRole)) {
    return false; // Role not in allowed roles
  }

  if (fieldConfig.condition && !fieldConfig.condition(context)) {
    return false; // Condition not met
  }

  return true;
};

/**
 * Filters object fields based on role visibility
 */
export const filterFieldsByRoleVisibility = <T extends Record<string, any>>(
  obj: T,
  userRole: string,
  visibilityConfig: FieldVisibilityConfig,
  context?: any
): Partial<T> => {
  const filtered: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (isFieldVisibleToRole(key, userRole, visibilityConfig, context)) {
      (filtered as any)[key] = value;
    }
  }

  return filtered;
};

// =============================================================================
// ROLE-BASED OPERATION VALIDATION MAPPERS
// =============================================================================

/**
 * Operation validation result
 */
export interface OperationValidationResult {
  canPerform: boolean;
  reason?: string;
  requiredRole?: string;
  permissions?: string[];
}

/**
 * Validates if a user can perform a specific operation
 */
export const validateRoleBasedOperation = (
  userRole: string,
  operation: string,
  resource: string,
  context?: {
    targetUserId?: string;
    targetPlantId?: string;
    userPlantId?: string;
  }
): OperationValidationResult => {
  const permissions = getRolePermissions(
    userRole as keyof typeof ROLE_HIERARCHY
  );

  switch (operation) {
    case "create":
      return validateCreateOperation(resource, permissions, context);
    case "read":
      return validateReadOperation(resource, permissions, context);
    case "update":
      return validateUpdateOperation(resource, permissions, context);
    case "delete":
      return validateDeleteOperation(resource, permissions, context);
    case "assign":
      return validateAssignOperation(resource, permissions, context);
    case "export":
      return validateExportOperation(resource, permissions, context);
    default:
      return {
        canPerform: false,
        reason: `Unknown operation: ${operation}`,
      };
  }
};

/**
 * Validates create operations
 */
const validateCreateOperation = (
  resource: string,
  permissions: RolePermissions,
  context?: any
): OperationValidationResult => {
  switch (resource) {
    case "user":
      if (permissions.canCreateUsers) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to create users",
        requiredRole: "plant_manager",
        permissions: ["canCreateUsers"],
      };

    case "course":
      if (permissions.canCreateCourses) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to create courses",
        requiredRole: "safety_instructor",
        permissions: ["canCreateCourses"],
      };

    case "enrollment":
      if (permissions.canCreateEnrollments) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to create enrollments",
        requiredRole: "hr_admin",
        permissions: ["canCreateEnrollments"],
      };

    default:
      return {
        canPerform: false,
        reason: `Cannot create ${resource}`,
      };
  }
};

/**
 * Validates read operations
 */
const validateReadOperation = (
  resource: string,
  permissions: RolePermissions,
  context?: any
): OperationValidationResult => {
  switch (resource) {
    case "users":
      if (permissions.canViewAllUsers || permissions.canViewPlantUsers) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to view users",
        requiredRole: "safety_coordinator",
        permissions: ["canViewPlantUsers"],
      };

    case "courses":
      if (permissions.canViewAllCourses || permissions.canViewPlantCourses) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to view courses",
        requiredRole: "employee",
        permissions: ["canViewPlantCourses"],
      };

    case "enrollments":
      if (
        permissions.canViewAllEnrollments ||
        permissions.canViewPlantEnrollments
      ) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to view enrollments",
        requiredRole: "safety_coordinator",
        permissions: ["canViewPlantEnrollments"],
      };

    case "progress":
      if (permissions.canViewAllProgress || permissions.canViewPlantProgress) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to view progress",
        requiredRole: "safety_coordinator",
        permissions: ["canViewPlantProgress"],
      };

    case "reports":
      if (permissions.canViewAllReports || permissions.canViewPlantReports) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to view reports",
        requiredRole: "hr_admin",
        permissions: ["canViewPlantReports"],
      };

    default:
      return {
        canPerform: false,
        reason: `Cannot read ${resource}`,
      };
  }
};

/**
 * Validates update operations
 */
const validateUpdateOperation = (
  resource: string,
  permissions: RolePermissions,
  context?: any
): OperationValidationResult => {
  switch (resource) {
    case "user":
      if (permissions.canEditUsers) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to edit users",
        requiredRole: "plant_manager",
        permissions: ["canEditUsers"],
      };

    case "course":
      if (permissions.canEditCourses) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to edit courses",
        requiredRole: "safety_instructor",
        permissions: ["canEditCourses"],
      };

    case "enrollment":
      if (permissions.canEditEnrollments) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to edit enrollments",
        requiredRole: "hr_admin",
        permissions: ["canEditEnrollments"],
      };

    case "progress":
      if (permissions.canEditProgress) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to edit progress",
        requiredRole: "safety_instructor",
        permissions: ["canEditProgress"],
      };

    default:
      return {
        canPerform: false,
        reason: `Cannot update ${resource}`,
      };
  }
};

/**
 * Validates delete operations
 */
const validateDeleteOperation = (
  resource: string,
  permissions: RolePermissions,
  context?: any
): OperationValidationResult => {
  switch (resource) {
    case "user":
      if (permissions.canDeleteUsers) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to delete users",
        requiredRole: "safety_admin",
        permissions: ["canDeleteUsers"],
      };

    case "course":
      if (permissions.canDeleteCourses) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to delete courses",
        requiredRole: "plant_manager",
        permissions: ["canDeleteCourses"],
      };

    case "enrollment":
      if (permissions.canDeleteEnrollments) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to delete enrollments",
        requiredRole: "hr_admin",
        permissions: ["canDeleteEnrollments"],
      };

    default:
      return {
        canPerform: false,
        reason: `Cannot delete ${resource}`,
      };
  }
};

/**
 * Validates assign operations
 */
const validateAssignOperation = (
  resource: string,
  permissions: RolePermissions,
  context?: any
): OperationValidationResult => {
  switch (resource) {
    case "training":
      if (permissions.canAssignTraining) {
        return { canPerform: true };
      }
      return {
        canPerform: false,
        reason: "User does not have permission to assign training",
        requiredRole: "hr_admin",
        permissions: ["canAssignTraining"],
      };

    default:
      return {
        canPerform: false,
        reason: `Cannot assign ${resource}`,
      };
  }
};

/**
 * Validates export operations
 */
const validateExportOperation = (
  resource: string,
  permissions: RolePermissions,
  context?: any
): OperationValidationResult => {
  if (permissions.canExportData) {
    return { canPerform: true };
  }

  return {
    canPerform: false,
    reason: "User does not have permission to export data",
    requiredRole: "hr_admin",
    permissions: ["canExportData"],
  };
};

// =============================================================================
// ROLE HIERARCHY VALIDATION MAPPERS
// =============================================================================

/**
 * Checks if a user role has sufficient permissions for another role
 */
export const hasRoleHierarchyPermission = (
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
 * Gets all roles that a user can manage
 */
export const getManageableRoles = (userRole: string): string[] => {
  const userLevel =
    ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;

  return Object.entries(ROLE_HIERARCHY)
    .filter(([, level]) => level < userLevel)
    .map(([role]) => role);
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// All types are exported as interfaces above
