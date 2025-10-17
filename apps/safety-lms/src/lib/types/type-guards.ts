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
// TYPE GUARDS FOR DOMAIN SAFETY
// =============================================================================

/**
 * Type guards provide compile-time type safety for runtime type checking,
 * ensuring proper context switching and preventing invalid operations.
 */

// =============================================================================
// USER CONTEXT TYPE GUARDS
// =============================================================================

/**
 * Base user context interface
 */
export interface BaseUserContext {
  id: UserId;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

/**
 * Plant-scoped user context
 */
export interface PlantUserContext extends BaseUserContext {
  plantId: PlantId;
  plant?: {
    id: PlantId;
    name: string;
    isActive: boolean;
  };
}

/**
 * Territory-scoped user context
 */
export interface TerritoryUserContext extends BaseUserContext {
  territoryId: TerritoryId;
  territory?: {
    id: TerritoryId;
    name: string;
    isActive: boolean;
  };
}

/**
 * Union type for all user contexts
 */
export type UserContext = PlantUserContext | TerritoryUserContext;

/**
 * Type guard to check if context is plant-scoped
 */
export const isPlantContext = (
  context: UserContext
): context is PlantUserContext => {
  return "plantId" in context && context.plantId !== undefined;
};

/**
 * Type guard to check if context is territory-scoped
 */
export const isTerritoryContext = (
  context: UserContext
): context is TerritoryUserContext => {
  return "territoryId" in context && context.territoryId !== undefined;
};

/**
 * Type guard to check if context has plant access
 */
export const hasPlantAccess = (
  context: UserContext,
  plantId: PlantId
): boolean => {
  return isPlantContext(context) && context.plantId === plantId;
};

/**
 * Type guard to check if context has territory access
 */
export const hasTerritoryAccess = (
  context: UserContext,
  territoryId: TerritoryId
): boolean => {
  return isTerritoryContext(context) && context.territoryId === territoryId;
};

// =============================================================================
// ROLE-BASED TYPE GUARDS
// =============================================================================

/**
 * Type guard for admin roles
 */
export const isAdminRole = (role: UserRole): role is "safety_admin" => {
  return role === "safety_admin";
};

/**
 * Type guard for manager roles
 */
export const isManagerRole = (
  role: UserRole
): role is "safety_manager" | "safety_admin" => {
  return role === "safety_manager" || role === "safety_admin";
};

/**
 * Type guard for instructor roles
 */
export const isInstructorRole = (
  role: UserRole
): role is "safety_instructor" | "safety_coordinator" => {
  return role === "safety_instructor" || role === "safety_coordinator";
};

/**
 * Type guard for plant manager role
 */
export const isPlantManagerRole = (role: UserRole): role is "plant_manager" => {
  return role === "plant_manager";
};

/**
 * Type guard for HR admin role
 */
export const isHrAdminRole = (role: UserRole): role is "hr_admin" => {
  return role === "hr_admin";
};

/**
 * Type guard for employee role
 */
export const isEmployeeRole = (role: UserRole): role is "employee" => {
  return role === "employee";
};

/**
 * Type guard for safety rep role
 */
export const isSafetyRepRole = (role: UserRole): role is "safety_rep" => {
  return role === "safety_rep";
};

// =============================================================================
// PERMISSION-BASED TYPE GUARDS
// =============================================================================

/**
 * Permission set interface
 */
export interface PermissionSet {
  canManageAllTerritories: boolean;
  canManageAllAccounts: boolean;
  canManageAllOpportunities: boolean;
  canViewAllSales: boolean;
  canManageAllUsers: boolean;
  canViewAllReports: boolean;
  canManageAllPlants: boolean;
  canManagePlantUsers: boolean;
  canManagePlantCourses: boolean;
  canViewPlantData: boolean;
  canAssignTraining: boolean;
  canViewPlantReports: boolean;
  canCreateCourses: boolean;
  canEditCourses: boolean;
  canViewEnrollments: boolean;
  canViewProgress: boolean;
  canManageQuestions: boolean;
  canManageEnrollments: boolean;
  canViewCompliance: boolean;
  canAssignRequiredTraining: boolean;
}

/**
 * Type guard to check if user can manage all territories
 */
export const canManageAllTerritories = (context: UserContext): boolean => {
  return isAdminRole(context.role);
};

/**
 * Type guard to check if user can manage all accounts
 */
export const canManageAllAccounts = (context: UserContext): boolean => {
  return isAdminRole(context.role) || isManagerRole(context.role);
};

/**
 * Type guard to check if user can manage all opportunities
 */
export const canManageAllOpportunities = (context: UserContext): boolean => {
  return isAdminRole(context.role) || isManagerRole(context.role);
};

/**
 * Type guard to check if user can view all sales
 */
export const canViewAllSales = (context: UserContext): boolean => {
  return isAdminRole(context.role) || isManagerRole(context.role);
};

/**
 * Type guard to check if user can manage all users
 */
export const canManageAllUsers = (context: UserContext): boolean => {
  return isAdminRole(context.role);
};

/**
 * Type guard to check if user can view all reports
 */
export const canViewAllReports = (context: UserContext): boolean => {
  return isAdminRole(context.role) || isManagerRole(context.role);
};

/**
 * Type guard to check if user can manage all plants
 */
export const canManageAllPlants = (context: UserContext): boolean => {
  return isAdminRole(context.role);
};

/**
 * Type guard to check if user can manage plant users
 */
export const canManagePlantUsers = (context: UserContext): boolean => {
  return isAdminRole(context.role) || isPlantManagerRole(context.role);
};

/**
 * Type guard to check if user can manage plant courses
 */
export const canManagePlantCourses = (context: UserContext): boolean => {
  return (
    isAdminRole(context.role) ||
    isPlantManagerRole(context.role) ||
    isInstructorRole(context.role)
  );
};

/**
 * Type guard to check if user can view plant data
 */
export const canViewPlantData = (context: UserContext): boolean => {
  return (
    isAdminRole(context.role) ||
    isPlantManagerRole(context.role) ||
    isInstructorRole(context.role)
  );
};

/**
 * Type guard to check if user can assign training
 */
export const canAssignTraining = (context: UserContext): boolean => {
  return (
    isAdminRole(context.role) ||
    isPlantManagerRole(context.role) ||
    isHrAdminRole(context.role)
  );
};

/**
 * Type guard to check if user can view plant reports
 */
export const canViewPlantReports = (context: UserContext): boolean => {
  return (
    isAdminRole(context.role) ||
    isPlantManagerRole(context.role) ||
    isHrAdminRole(context.role)
  );
};

/**
 * Type guard to check if user can create courses
 */
export const canCreateCourses = (context: UserContext): boolean => {
  return isAdminRole(context.role) || isInstructorRole(context.role);
};

/**
 * Type guard to check if user can edit courses
 */
export const canEditCourses = (context: UserContext): boolean => {
  return isAdminRole(context.role) || isInstructorRole(context.role);
};

/**
 * Type guard to check if user can view enrollments
 */
export const canViewEnrollments = (context: UserContext): boolean => {
  return (
    isAdminRole(context.role) ||
    isPlantManagerRole(context.role) ||
    isInstructorRole(context.role) ||
    isHrAdminRole(context.role)
  );
};

/**
 * Type guard to check if user can view progress
 */
export const canViewProgress = (context: UserContext): boolean => {
  return (
    isAdminRole(context.role) ||
    isPlantManagerRole(context.role) ||
    isInstructorRole(context.role) ||
    isHrAdminRole(context.role)
  );
};

/**
 * Type guard to check if user can manage questions
 */
export const canManageQuestions = (context: UserContext): boolean => {
  return isAdminRole(context.role) || isInstructorRole(context.role);
};

/**
 * Type guard to check if user can manage enrollments
 */
export const canManageEnrollments = (context: UserContext): boolean => {
  return isAdminRole(context.role) || isHrAdminRole(context.role);
};

/**
 * Type guard to check if user can view compliance
 */
export const canViewCompliance = (context: UserContext): boolean => {
  return (
    isAdminRole(context.role) ||
    isPlantManagerRole(context.role) ||
    isHrAdminRole(context.role)
  );
};

/**
 * Type guard to check if user can assign required training
 */
export const canAssignRequiredTraining = (context: UserContext): boolean => {
  return isAdminRole(context.role) || isHrAdminRole(context.role);
};

// =============================================================================
// ENTITY TYPE GUARDS
// =============================================================================

/**
 * Type guard for account entities
 */
export const isAccount = (
  entity: unknown
): entity is {
  id: AccountId;
  name: string;
  type: AccountType;
  status: AccountStatus;
  territoryId: TerritoryId;
  ownerId: UserId;
} => {
  return (
    typeof entity === "object" &&
    entity !== null &&
    "id" in entity &&
    "name" in entity &&
    "type" in entity &&
    "status" in entity &&
    "territoryId" in entity &&
    "ownerId" in entity
  );
};

/**
 * Type guard for contact entities
 */
export const isContact = (
  entity: unknown
): entity is {
  id: ContactId;
  firstName: string;
  lastName: string;
  email: string;
  accountId: AccountId;
  ownerId: UserId;
} => {
  return (
    typeof entity === "object" &&
    entity !== null &&
    "id" in entity &&
    "firstName" in entity &&
    "lastName" in entity &&
    "email" in entity &&
    "accountId" in entity &&
    "ownerId" in entity
  );
};

/**
 * Type guard for opportunity entities
 */
export const isOpportunity = (
  entity: unknown
): entity is {
  id: OpportunityId;
  name: string;
  type: string;
  stage: OpportunityStage;
  status: OpportunityStatus;
  accountId: AccountId;
  ownerId: UserId;
} => {
  return (
    typeof entity === "object" &&
    entity !== null &&
    "id" in entity &&
    "name" in entity &&
    "type" in entity &&
    "stage" in entity &&
    "status" in entity &&
    "accountId" in entity &&
    "ownerId" in entity
  );
};

/**
 * Type guard for plant entities
 */
export const isPlant = (
  entity: unknown
): entity is {
  id: PlantId;
  name: string;
  isActive: boolean;
} => {
  return (
    typeof entity === "object" &&
    entity !== null &&
    "id" in entity &&
    "name" in entity &&
    "isActive" in entity
  );
};

/**
 * Type guard for territory entities
 */
export const isTerritory = (
  entity: unknown
): entity is {
  id: TerritoryId;
  name: string;
  isActive: boolean;
} => {
  return (
    typeof entity === "object" &&
    entity !== null &&
    "id" in entity &&
    "name" in entity &&
    "isActive" in entity
  );
};

// =============================================================================
// STATUS TYPE GUARDS
// =============================================================================

/**
 * Type guard for active account status
 */
export const isActiveAccount = (status: AccountStatus): status is "active" => {
  return status === "active";
};

/**
 * Type guard for inactive account status
 */
export const isInactiveAccount = (
  status: AccountStatus
): status is "inactive" => {
  return status === "inactive";
};

/**
 * Type guard for suspended account status
 */
export const isSuspendedAccount = (
  status: AccountStatus
): status is "suspended" => {
  return status === "suspended";
};

/**
 * Type guard for closed account status
 */
export const isClosedAccount = (status: AccountStatus): status is "closed" => {
  return status === "closed";
};

/**
 * Type guard for open opportunity status
 */
export const isOpenOpportunity = (
  status: OpportunityStatus
): status is "open" => {
  return status === "open";
};

/**
 * Type guard for closed opportunity status
 */
export const isClosedOpportunity = (
  status: OpportunityStatus
): status is "closed" => {
  return status === "closed";
};

/**
 * Type guard for on-hold opportunity status
 */
export const isOnHoldOpportunity = (
  status: OpportunityStatus
): status is "on_hold" => {
  return status === "on_hold";
};

/**
 * Type guard for cancelled opportunity status
 */
export const isCancelledOpportunity = (
  status: OpportunityStatus
): status is "cancelled" => {
  return status === "cancelled";
};

// =============================================================================
// STAGE TYPE GUARDS
// =============================================================================

/**
 * Type guard for prospecting stage
 */
export const isProspectingStage = (
  stage: OpportunityStage
): stage is "prospecting" => {
  return stage === "prospecting";
};

/**
 * Type guard for qualification stage
 */
export const isQualificationStage = (
  stage: OpportunityStage
): stage is "qualification" => {
  return stage === "qualification";
};

/**
 * Type guard for proposal stage
 */
export const isProposalStage = (
  stage: OpportunityStage
): stage is "proposal" => {
  return stage === "proposal";
};

/**
 * Type guard for negotiation stage
 */
export const isNegotiationStage = (
  stage: OpportunityStage
): stage is "negotiation" => {
  return stage === "negotiation";
};

/**
 * Type guard for closed won stage
 */
export const isClosedWonStage = (
  stage: OpportunityStage
): stage is "closed_won" => {
  return stage === "closed_won";
};

/**
 * Type guard for closed lost stage
 */
export const isClosedLostStage = (
  stage: OpportunityStage
): stage is "closed_lost" => {
  return stage === "closed_lost";
};

// =============================================================================
// CONTEXT VALIDATION TYPE GUARDS
// =============================================================================

/**
 * Type guard to validate plant context for operations
 */
export const validatePlantContext = (
  context: UserContext,
  plantId: PlantId
): boolean => {
  return isPlantContext(context) && hasPlantAccess(context, plantId);
};

/**
 * Type guard to validate territory context for operations
 */
export const validateTerritoryContext = (
  context: UserContext,
  territoryId: TerritoryId
): boolean => {
  return (
    isTerritoryContext(context) && hasTerritoryAccess(context, territoryId)
  );
};

/**
 * Type guard to validate cross-system context
 */
export const validateCrossSystemContext = (context: UserContext): boolean => {
  return isAdminRole(context.role);
};

/**
 * Type guard to validate operation permissions
 */
export const validateOperationPermission = (
  context: UserContext,
  operation: string,
  resource?: string
): boolean => {
  switch (operation) {
    case "create_account":
      return canManageAllAccounts(context);
    case "update_account":
      return canManageAllAccounts(context);
    case "delete_account":
      return canManageAllAccounts(context);
    case "view_account":
      return canManageAllAccounts(context) || canViewAllSales(context);
    case "create_opportunity":
      return canManageAllOpportunities(context);
    case "update_opportunity":
      return canManageAllOpportunities(context);
    case "delete_opportunity":
      return canManageAllOpportunities(context);
    case "view_opportunity":
      return canManageAllOpportunities(context) || canViewAllSales(context);
    case "create_course":
      return canCreateCourses(context);
    case "update_course":
      return canEditCourses(context);
    case "delete_course":
      return canManagePlantCourses(context);
    case "view_course":
      return canViewPlantData(context);
    case "create_enrollment":
      return canManageEnrollments(context);
    case "update_enrollment":
      return canManageEnrollments(context);
    case "delete_enrollment":
      return canManageEnrollments(context);
    case "view_enrollment":
      return canViewEnrollments(context);
    case "assign_training":
      return canAssignTraining(context);
    case "view_progress":
      return canViewProgress(context);
    case "view_reports":
      return canViewAllReports(context) || canViewPlantReports(context);
    case "manage_users":
      return canManageAllUsers(context) || canManagePlantUsers(context);
    default:
      return false;
  }
};

// =============================================================================
// SCHEMA VALIDATION TYPE GUARDS
// =============================================================================

/**
 * Type guard to validate user ID schema
 */
export const isValidUserId = (id: unknown): id is UserId => {
  return UserIdSchema.safeParse(id).success;
};

/**
 * Type guard to validate territory ID schema
 */
export const isValidTerritoryId = (id: unknown): id is TerritoryId => {
  return TerritoryIdSchema.safeParse(id).success;
};

/**
 * Type guard to validate plant ID schema
 */
export const isValidPlantId = (id: unknown): id is PlantId => {
  return PlantIdSchema.safeParse(id).success;
};

/**
 * Type guard to validate account ID schema
 */
export const isValidAccountId = (id: unknown): id is AccountId => {
  return AccountIdSchema.safeParse(id).success;
};

/**
 * Type guard to validate contact ID schema
 */
export const isValidContactId = (id: unknown): id is ContactId => {
  return ContactIdSchema.safeParse(id).success;
};

/**
 * Type guard to validate opportunity ID schema
 */
export const isValidOpportunityId = (id: unknown): id is OpportunityId => {
  return OpportunityIdSchema.safeParse(id).success;
};

/**
 * Type guard to validate user role schema
 */
export const isValidUserRole = (role: unknown): role is UserRole => {
  return UserRoleSchema.safeParse(role).success;
};

/**
 * Type guard to validate account status schema
 */
export const isValidAccountStatus = (
  status: unknown
): status is AccountStatus => {
  return AccountStatusSchema.safeParse(status).success;
};

/**
 * Type guard to validate account type schema
 */
export const isValidAccountType = (type: unknown): type is AccountType => {
  return AccountTypeSchema.safeParse(type).success;
};

/**
 * Type guard to validate opportunity status schema
 */
export const isValidOpportunityStatus = (
  status: unknown
): status is OpportunityStatus => {
  return OpportunityStatusSchema.safeParse(status).success;
};

/**
 * Type guard to validate opportunity stage schema
 */
export const isValidOpportunityStage = (
  stage: unknown
): stage is OpportunityStage => {
  return OpportunityStageSchema.safeParse(stage).success;
};

/**
 * Type guard to validate product status schema
 */
export const isValidProductStatus = (
  status: unknown
): status is ProductStatus => {
  return ProductStatusSchema.safeParse(status).success;
};

/**
 * Type guard to validate project status schema
 */
export const isValidProjectStatus = (
  status: unknown
): status is ProjectStatus => {
  return ProjectStatusSchema.safeParse(status).success;
};

// =============================================================================
// COMPOSITE TYPE GUARDS
// =============================================================================

/**
 * Type guard to validate complete user context
 */
export const isValidUserContext = (
  context: unknown
): context is UserContext => {
  if (typeof context !== "object" || context === null) {
    return false;
  }

  const ctx = context as any;

  // Check base properties
  if (
    !isValidUserId(ctx.id) ||
    typeof ctx.email !== "string" ||
    typeof ctx.firstName !== "string" ||
    typeof ctx.lastName !== "string" ||
    !isValidUserRole(ctx.role)
  ) {
    return false;
  }

  // Check context-specific properties
  if (ctx.plantId !== undefined) {
    return isValidPlantId(ctx.plantId);
  }

  if (ctx.territoryId !== undefined) {
    return isValidTerritoryId(ctx.territoryId);
  }

  return false;
};

/**
 * Type guard to validate complete account entity
 */
export const isValidAccountEntity = (
  entity: unknown
): entity is {
  id: AccountId;
  name: string;
  type: AccountType;
  status: AccountStatus;
  territoryId: TerritoryId;
  ownerId: UserId;
} => {
  if (!isAccount(entity)) {
    return false;
  }

  return (
    isValidAccountId(entity.id) &&
    isValidAccountType(entity.type) &&
    isValidAccountStatus(entity.status) &&
    isValidTerritoryId(entity.territoryId) &&
    isValidUserId(entity.ownerId)
  );
};

/**
 * Type guard to validate complete contact entity
 */
export const isValidContactEntity = (
  entity: unknown
): entity is {
  id: ContactId;
  firstName: string;
  lastName: string;
  email: string;
  accountId: AccountId;
  ownerId: UserId;
} => {
  if (!isContact(entity)) {
    return false;
  }

  return (
    isValidContactId(entity.id) &&
    isValidAccountId(entity.accountId) &&
    isValidUserId(entity.ownerId)
  );
};

/**
 * Type guard to validate complete opportunity entity
 */
export const isValidOpportunityEntity = (
  entity: unknown
): entity is {
  id: OpportunityId;
  name: string;
  type: string;
  stage: OpportunityStage;
  status: OpportunityStatus;
  accountId: AccountId;
  ownerId: UserId;
} => {
  if (!isOpportunity(entity)) {
    return false;
  }

  return (
    isValidOpportunityId(entity.id) &&
    isValidOpportunityStage(entity.stage) &&
    isValidOpportunityStatus(entity.status) &&
    isValidAccountId(entity.accountId) &&
    isValidUserId(entity.ownerId)
  );
};
