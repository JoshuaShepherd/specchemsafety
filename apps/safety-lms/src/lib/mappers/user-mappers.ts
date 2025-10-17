import { Profile, NewProfile } from "../db/schema/profiles";
import {
  UserProfile,
  CreateUserProfile,
  UpdateUserProfile,
} from "../validations/safety-business";

// Re-export UserProfile for use in other modules
export type { UserProfile };
import { mapPlantToApiResponse } from "./plant-mappers";

/**
 * User Profile Data Mappers
 * Handles transformation between user profile database entities and API responses
 * Integrates with auth system for complete user context
 */

// =============================================================================
// USER PROFILE DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps user profile database entity to API response
 */
export const mapUserProfileToApiResponse = (
  profile: Profile,
  plant?: { id: string; name: string; isActive: boolean }
): UserProfile => ({
  id: profile.id,
  authUserId: profile.id, // In current schema, profile.id is the auth user ID
  plantId: profile.plantId,
  firstName: profile.firstName,
  lastName: profile.lastName,
  email: profile.email,
  phone: undefined, // Not in current schema
  jobTitle: profile.jobTitle,
  department: undefined, // Not in current schema
  role: "employee", // Default role - would need to be added to schema
  status: profile.status === "active" ? "active" : "inactive",
  isActive: profile.status === "active",
  lastLoginAt: undefined, // Not in current schema
  createdAt: profile.createdAt.toISOString(),
  updatedAt: profile.updatedAt.toISOString(),
  createdBy: undefined, // Not in current schema
});

/**
 * Maps multiple user profiles to API responses
 */
export const mapUserProfilesToApiResponses = (
  profiles: Profile[],
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): UserProfile[] =>
  profiles.map(profile => {
    const plant = plants?.get(profile.plantId);
    return mapUserProfileToApiResponse(profile, plant);
  });

// =============================================================================
// API REQUEST → USER PROFILE DATABASE MAPPERS
// =============================================================================

/**
 * Maps create user profile API request to database entity
 */
export const mapCreateUserProfileRequestToDb = (
  request: CreateUserProfile
): NewProfile => ({
  id: request.authUserId,
  plantId: request.plantId,
  firstName: request.firstName,
  lastName: request.lastName,
  email: request.email,
  jobTitle: request.jobTitle,
  status: request.status === "active" ? "active" : "suspended",
});

/**
 * Maps update user profile API request to database entity
 */
export const mapUpdateUserProfileRequestToDb = (
  request: UpdateUserProfile,
  existingProfile: Profile
): Partial<Profile> => ({
  ...existingProfile,
  firstName: request.firstName ?? existingProfile.firstName,
  lastName: request.lastName ?? existingProfile.lastName,
  email: request.email ?? existingProfile.email,
  jobTitle: request.jobTitle ?? existingProfile.jobTitle,
  status: request.status === "active" ? "active" : "suspended",
  updatedAt: new Date(),
});

// =============================================================================
// AUTH + USER PROFILE INTEGRATION MAPPERS
// =============================================================================

/**
 * Combined user context from auth and profile
 */
export interface UserContext {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  plantId: string;
  plant?: {
    id: string;
    name: string;
    isActive: boolean;
  };
  permissions?: {
    canManageAllPlants: boolean;
    canManageUsers: boolean;
    canManageCourses: boolean;
    canViewAllData: boolean;
    canManageAdminRoles: boolean;
  };
}

/**
 * Maps auth user + profile to complete user context
 */
export const mapAuthUserToUserContext = (
  authUser: { id: string; email: string },
  profile: Profile,
  plant?: { id: string; name: string; isActive: boolean },
  role: string = "employee"
): UserContext => ({
  id: authUser.id,
  email: authUser.email,
  firstName: profile.firstName,
  lastName: profile.lastName,
  role,
  plantId: profile.plantId,
  plant,
  permissions: getRolePermissions(role),
});

/**
 * Gets role-based permissions
 */
const getRolePermissions = (role: string) => {
  switch (role) {
    case "safety_admin":
      return {
        canManageAllPlants: true,
        canManageUsers: true,
        canManageCourses: true,
        canViewAllData: true,
        canManageAdminRoles: true,
      };
    case "plant_manager":
      return {
        canManageAllPlants: false,
        canManageUsers: true,
        canManageCourses: true,
        canViewAllData: false,
        canManageAdminRoles: false,
      };
    case "safety_instructor":
    case "hr_admin":
      return {
        canManageAllPlants: false,
        canManageUsers: false,
        canManageCourses: true,
        canViewAllData: false,
        canManageAdminRoles: false,
      };
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
// PLANT-SCOPED USER MAPPERS
// =============================================================================

/**
 * Plant-scoped user list response
 */
export interface PlantScopedUserResponse {
  users: UserProfile[];
  plant: {
    id: string;
    name: string;
    isActive: boolean;
  };
  total: number;
  pagination?: {
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Maps users to plant-scoped response
 */
export const mapUsersToPlantScopedResponse = (
  users: Profile[],
  plant: { id: string; name: string; isActive: boolean },
  total: number,
  pagination?: {
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
): PlantScopedUserResponse => ({
  users: mapUserProfilesToApiResponses(users, new Map([[plant.id, plant]])),
  plant,
  total,
  pagination,
});

// =============================================================================
// ROLE-BASED USER FILTERING MAPPERS
// =============================================================================

/**
 * User access validation result
 */
export interface UserAccessResult {
  hasAccess: boolean;
  user?: UserProfile;
  reason?: string;
}

/**
 * Validates and maps user access based on requester's role and plant
 */
export const validateAndMapUserAccess = (
  targetUser: Profile,
  requesterRole: string,
  requesterPlantId: string,
  plant?: { id: string; name: string; isActive: boolean }
): UserAccessResult => {
  // Safety admins can access all users
  if (requesterRole === "safety_admin") {
    return {
      hasAccess: true,
      user: mapUserProfileToApiResponse(targetUser, plant),
    };
  }

  // Plant managers can access users in their plant
  if (
    requesterRole === "plant_manager" &&
    targetUser.plantId === requesterPlantId
  ) {
    return {
      hasAccess: true,
      user: mapUserProfileToApiResponse(targetUser, plant),
    };
  }

  // HR admins can access users in their plant
  if (requesterRole === "hr_admin" && targetUser.plantId === requesterPlantId) {
    return {
      hasAccess: true,
      user: mapUserProfileToApiResponse(targetUser, plant),
    };
  }

  // Users can always access their own profile
  if (targetUser.id === requesterPlantId) {
    // This would need to be adjusted based on actual auth user ID
    return {
      hasAccess: true,
      user: mapUserProfileToApiResponse(targetUser, plant),
    };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to view this profile",
  };
};

/**
 * Filters users based on requester's access permissions
 */
export const filterUsersByAccess = (
  users: Profile[],
  requesterRole: string,
  requesterPlantId: string,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): UserProfile[] => {
  return users
    .map(user => {
      const plant = plants?.get(user.plantId);
      return validateAndMapUserAccess(
        user,
        requesterRole,
        requesterPlantId,
        plant
      );
    })
    .filter(result => result.hasAccess)
    .map(result => result.user!);
};

// =============================================================================
// USER SEARCH AND FILTERING MAPPERS
// =============================================================================

/**
 * User search criteria
 */
export interface UserSearchCriteria {
  query?: string;
  role?: string;
  status?: string;
  department?: string;
  plantId?: string;
}

/**
 * Maps search criteria to database query filters
 */
export const mapSearchCriteriaToDbFilters = (
  criteria: UserSearchCriteria,
  requesterRole: string,
  requesterPlantId: string
): {
  where: any;
  plantScope: string[];
} => {
  const where: any = {};
  let plantScope: string[] = [];

  // Apply plant scoping based on role
  if (requesterRole === "safety_admin") {
    // Safety admins can search across all plants
    plantScope = criteria.plantId ? [criteria.plantId] : [];
  } else {
    // Other roles are limited to their plant
    plantScope = [requesterPlantId];
  }

  if (plantScope.length > 0) {
    where.plantId = { in: plantScope };
  }

  // Apply other filters
  if (criteria.query) {
    where.or = [
      { firstName: { contains: criteria.query } },
      { lastName: { contains: criteria.query } },
      { email: { contains: criteria.query } },
    ];
  }

  if (criteria.status) {
    where.status = criteria.status === "active" ? "active" : "suspended";
  }

  return { where, plantScope };
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// All types are exported as interfaces above
