import { z } from "zod";

// =============================================================================
// BRANDED TYPES FOR DOMAIN SAFETY
// =============================================================================

/**
 * Branded types provide compile-time type safety by preventing ID confusion
 * and ensuring type-safe operations across domain boundaries.
 */

// =============================================================================
// DOMAIN ENTITY BRANDED TYPES
// =============================================================================

// Core Safety Training Entities
export type PlantId = string & { readonly __brand: "PlantId" };
export type UserId = string & { readonly __brand: "UserId" };
export type CourseId = string & { readonly __brand: "CourseId" };
export type EnrollmentId = string & { readonly __brand: "EnrollmentId" };
export type ProgressId = string & { readonly __brand: "ProgressId" };
export type ActivityEventId = string & { readonly __brand: "ActivityEventId" };
export type QuestionEventId = string & { readonly __brand: "QuestionEventId" };
export type AdminRoleId = string & { readonly __brand: "AdminRoleId" };

// Safety Business Entities
export type TerritoryId = string & { readonly __brand: "TerritoryId" };
export type AccountId = string & { readonly __brand: "AccountId" };
export type BranchId = string & { readonly __brand: "BranchId" };
export type ContactId = string & { readonly __brand: "ContactId" };
export type OpportunityId = string & { readonly __brand: "OpportunityId" };
export type ProductId = string & { readonly __brand: "ProductId" };
export type ProjectId = string & { readonly __brand: "ProjectId" };
export type SalesFactId = string & { readonly __brand: "SalesFactId" };
export type ActivityLogId = string & { readonly __brand: "ActivityLogId" };

// Auth Integration
export type AuthUserId = string & { readonly __brand: "AuthUserId" };

// =============================================================================
// BRANDED SCHEMAS FOR RUNTIME VALIDATION
// =============================================================================

// Core Safety Training Schemas
export const PlantIdSchema = z.string().uuid().brand<"PlantId">();
export const UserIdSchema = z.string().uuid().brand<"UserId">();
export const CourseIdSchema = z.string().uuid().brand<"CourseId">();
export const EnrollmentIdSchema = z.string().uuid().brand<"EnrollmentId">();
export const ProgressIdSchema = z.string().uuid().brand<"ProgressId">();
export const ActivityEventIdSchema = z
  .string()
  .uuid()
  .brand<"ActivityEventId">();
export const QuestionEventIdSchema = z
  .string()
  .uuid()
  .brand<"QuestionEventId">();
export const AdminRoleIdSchema = z.string().uuid().brand<"AdminRoleId">();

// Safety Business Schemas
export const TerritoryIdSchema = z.string().uuid().brand<"TerritoryId">();
export const AccountIdSchema = z.string().uuid().brand<"AccountId">();
export const BranchIdSchema = z.string().uuid().brand<"BranchId">();
export const ContactIdSchema = z.string().uuid().brand<"ContactId">();
export const OpportunityIdSchema = z.string().uuid().brand<"OpportunityId">();
export const ProductIdSchema = z.string().uuid().brand<"ProductId">();
export const ProjectIdSchema = z.string().uuid().brand<"ProjectId">();
export const SalesFactIdSchema = z.string().uuid().brand<"SalesFactId">();
export const ActivityLogIdSchema = z.string().uuid().brand<"ActivityLogId">();

// Auth Integration Schema
export const AuthUserIdSchema = z.string().uuid().brand<"AuthUserId">();

// =============================================================================
// BRANDED ENUM TYPES
// =============================================================================

// Safety Training Enums
export type UserRole =
  | "safety_admin"
  | "safety_manager"
  | "safety_coordinator"
  | "safety_instructor"
  | "safety_rep"
  | "plant_manager"
  | "hr_admin"
  | "employee";

export type PlantStatus = "active" | "inactive" | "suspended" | "closed";
export type CourseStatus = "active" | "inactive" | "draft" | "archived";
export type EnrollmentStatus =
  | "enrolled"
  | "in_progress"
  | "completed"
  | "failed"
  | "dropped"
  | "expired";
export type ProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "failed";

// Safety Business Enums
export type AccountStatus = "active" | "inactive" | "suspended" | "closed";
export type AccountType =
  | "safety_equipment_customer"
  | "training_client"
  | "consulting_client"
  | "maintenance_client"
  | "partner"
  | "vendor";

export type OpportunityStatus = "open" | "closed" | "on_hold" | "cancelled";
export type OpportunityStage =
  | "prospecting"
  | "qualification"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";
export type ProductStatus =
  | "active"
  | "inactive"
  | "discontinued"
  | "coming_soon";
export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

// =============================================================================
// BRANDED ENUM SCHEMAS
// =============================================================================

// Safety Training Enum Schemas
export const UserRoleSchema = z
  .enum([
    "safety_admin",
    "safety_manager",
    "safety_coordinator",
    "safety_instructor",
    "safety_rep",
    "plant_manager",
    "hr_admin",
    "employee",
  ])
  .brand<"UserRole">();

export const PlantStatusSchema = z
  .enum(["active", "inactive", "suspended", "closed"])
  .brand<"PlantStatus">();
export const CourseStatusSchema = z
  .enum(["active", "inactive", "draft", "archived"])
  .brand<"CourseStatus">();
export const EnrollmentStatusSchema = z
  .enum([
    "enrolled",
    "in_progress",
    "completed",
    "failed",
    "dropped",
    "expired",
  ])
  .brand<"EnrollmentStatus">();
export const ProgressStatusSchema = z
  .enum(["not_started", "in_progress", "completed", "failed"])
  .brand<"ProgressStatus">();

// Safety Business Enum Schemas
export const AccountStatusSchema = z
  .enum(["active", "inactive", "suspended", "closed"])
  .brand<"AccountStatus">();
export const AccountTypeSchema = z
  .enum([
    "safety_equipment_customer",
    "training_client",
    "consulting_client",
    "maintenance_client",
    "partner",
    "vendor",
  ])
  .brand<"AccountType">();

export const OpportunityStatusSchema = z
  .enum(["open", "closed", "on_hold", "cancelled"])
  .brand<"OpportunityStatus">();
export const OpportunityStageSchema = z
  .enum([
    "prospecting",
    "qualification",
    "proposal",
    "negotiation",
    "closed_won",
    "closed_lost",
  ])
  .brand<"OpportunityStage">();
export const ProductStatusSchema = z
  .enum(["active", "inactive", "discontinued", "coming_soon"])
  .brand<"ProductStatus">();
export const ProjectStatusSchema = z
  .enum(["planning", "in_progress", "on_hold", "completed", "cancelled"])
  .brand<"ProjectStatus">();

// =============================================================================
// TYPE-SAFE ROLE CHECKING
// =============================================================================

/**
 * Type-safe role checking functions that provide compile-time guarantees
 * about role-based permissions and operations.
 */

export const isAdminRole = (role: UserRole): role is "safety_admin" =>
  role === "safety_admin";

export const isManagerRole = (
  role: UserRole
): role is "safety_manager" | "safety_admin" =>
  role === "safety_manager" || role === "safety_admin";

export const isInstructorRole = (
  role: UserRole
): role is "safety_instructor" | "safety_coordinator" =>
  role === "safety_instructor" || role === "safety_coordinator";

export const isPlantManagerRole = (role: UserRole): role is "plant_manager" =>
  role === "plant_manager";

export const isHrAdminRole = (role: UserRole): role is "hr_admin" =>
  role === "hr_admin";

export const isEmployeeRole = (role: UserRole): role is "employee" =>
  role === "employee";

// =============================================================================
// TYPE-SAFE ID CONVERSION UTILITIES
// =============================================================================

/**
 * Type-safe ID conversion utilities that ensure proper branded type handling
 * while maintaining runtime validation.
 */

export const createPlantId = (id: string): PlantId => {
  const validated = PlantIdSchema.parse(id);
  return validated as unknown as PlantId;
};

export const createUserId = (id: string): UserId => {
  const validated = UserIdSchema.parse(id);
  return validated as unknown as UserId;
};

export const createTerritoryId = (id: string): TerritoryId => {
  const validated = TerritoryIdSchema.parse(id);
  return validated as unknown as TerritoryId;
};

export const createAccountId = (id: string): AccountId => {
  const validated = AccountIdSchema.parse(id);
  return validated as unknown as AccountId;
};

export const createContactId = (id: string): ContactId => {
  const validated = ContactIdSchema.parse(id);
  return validated as unknown as ContactId;
};

export const createOpportunityId = (id: string): OpportunityId => {
  const validated = OpportunityIdSchema.parse(id);
  return validated as unknown as OpportunityId;
};

// =============================================================================
// TYPE-SAFE ENUM CONVERSION UTILITIES
// =============================================================================

export const createUserRole = (role: string): UserRole => {
  const validated = UserRoleSchema.parse(role);
  return validated as unknown as UserRole;
};

export const createAccountStatus = (status: string): AccountStatus => {
  const validated = AccountStatusSchema.parse(status);
  return validated as unknown as AccountStatus;
};

export const createAccountType = (type: string): AccountType => {
  const validated = AccountTypeSchema.parse(type);
  return validated as unknown as AccountType;
};

export const createOpportunityStatus = (status: string): OpportunityStatus => {
  const validated = OpportunityStatusSchema.parse(status);
  return validated as unknown as OpportunityStatus;
};

export const createOpportunityStage = (stage: string): OpportunityStage => {
  const validated = OpportunityStageSchema.parse(stage);
  return validated as unknown as OpportunityStage;
};

// =============================================================================
// TYPE-SAFE VALIDATION UTILITIES
// =============================================================================

/**
 * Type-safe validation utilities that provide both compile-time and runtime
 * type safety for branded types and enums.
 */

export const isValidPlantId = (id: unknown): id is PlantId => {
  return PlantIdSchema.safeParse(id).success;
};

export const isValidUserId = (id: unknown): id is UserId => {
  return UserIdSchema.safeParse(id).success;
};

export const isValidTerritoryId = (id: unknown): id is TerritoryId => {
  return TerritoryIdSchema.safeParse(id).success;
};

export const isValidAccountId = (id: unknown): id is AccountId => {
  return AccountIdSchema.safeParse(id).success;
};

export const isValidUserRole = (role: unknown): role is UserRole => {
  return UserRoleSchema.safeParse(role).success;
};

export const isValidAccountStatus = (
  status: unknown
): status is AccountStatus => {
  return AccountStatusSchema.safeParse(status).success;
};

// =============================================================================
// TYPE-SAFE COMPARISON UTILITIES
// =============================================================================

/**
 * Type-safe comparison utilities that prevent accidental ID mixing
 * and ensure proper domain entity comparisons.
 */

export const isSamePlant = (id1: PlantId, id2: PlantId): boolean => id1 === id2;
export const isSameUser = (id1: UserId, id2: UserId): boolean => id1 === id2;
export const isSameTerritory = (id1: TerritoryId, id2: TerritoryId): boolean =>
  id1 === id2;
export const isSameAccount = (id1: AccountId, id2: AccountId): boolean =>
  id1 === id2;
export const isSameContact = (id1: ContactId, id2: ContactId): boolean =>
  id1 === id2;
export const isSameOpportunity = (
  id1: OpportunityId,
  id2: OpportunityId
): boolean => id1 === id2;

// =============================================================================
// TYPE-SAFE COLLECTION UTILITIES
// =============================================================================

/**
 * Type-safe collection utilities for working with arrays of branded types.
 */

export const filterByPlantId = <T extends { plantId: PlantId }>(
  items: T[],
  plantId: PlantId
): T[] => items.filter(item => isSamePlant(item.plantId, plantId));

export const filterByUserId = <T extends { userId: UserId }>(
  items: T[],
  userId: UserId
): T[] => items.filter(item => isSameUser(item.userId, userId));

export const filterByTerritoryId = <T extends { territoryId: TerritoryId }>(
  items: T[],
  territoryId: TerritoryId
): T[] => items.filter(item => isSameTerritory(item.territoryId, territoryId));

export const filterByAccountId = <T extends { accountId: AccountId }>(
  items: T[],
  accountId: AccountId
): T[] => items.filter(item => isSameAccount(item.accountId, accountId));

// =============================================================================
// TYPE-SAFE MAPPING UTILITIES
// =============================================================================

/**
 * Type-safe mapping utilities for transforming between different ID types
 * while maintaining type safety.
 */

export const mapToPlantIds = (items: { plantId: PlantId }[]): PlantId[] =>
  items.map(item => item.plantId);

export const mapToUserIds = (items: { userId: UserId }[]): UserId[] =>
  items.map(item => item.userId);

export const mapToTerritoryIds = (
  items: { territoryId: TerritoryId }[]
): TerritoryId[] => items.map(item => item.territoryId);

export const mapToAccountIds = (
  items: { accountId: AccountId }[]
): AccountId[] => items.map(item => item.accountId);

// =============================================================================
// TYPE-SAFE SET UTILITIES
// =============================================================================

/**
 * Type-safe set utilities for working with unique collections of branded types.
 */

export const createPlantIdSet = (ids: PlantId[]): Set<PlantId> => new Set(ids);
export const createUserIdSet = (ids: UserId[]): Set<UserId> => new Set(ids);
export const createTerritoryIdSet = (ids: TerritoryId[]): Set<TerritoryId> =>
  new Set(ids);
export const createAccountIdSet = (ids: AccountId[]): Set<AccountId> =>
  new Set(ids);

export const hasPlantId = (set: Set<PlantId>, id: PlantId): boolean =>
  set.has(id);
export const hasUserId = (set: Set<UserId>, id: UserId): boolean => set.has(id);
export const hasTerritoryId = (
  set: Set<TerritoryId>,
  id: TerritoryId
): boolean => set.has(id);
export const hasAccountId = (set: Set<AccountId>, id: AccountId): boolean =>
  set.has(id);

// =============================================================================
// TYPE-SAFE ERROR HANDLING
// =============================================================================

/**
 * Type-safe error handling for branded type operations.
 */

export class BrandedTypeError extends Error {
  constructor(
    public readonly expectedType: string,
    public readonly actualValue: unknown,
    message?: string
  ) {
    super(message || `Expected ${expectedType}, got ${typeof actualValue}`);
    this.name = "BrandedTypeError";
  }
}

export const assertPlantId = (id: unknown): PlantId => {
  if (!isValidPlantId(id)) {
    throw new BrandedTypeError("PlantId", id);
  }
  return id;
};

export const assertUserId = (id: unknown): UserId => {
  if (!isValidUserId(id)) {
    throw new BrandedTypeError("UserId", id);
  }
  return id;
};

export const assertTerritoryId = (id: unknown): TerritoryId => {
  if (!isValidTerritoryId(id)) {
    throw new BrandedTypeError("TerritoryId", id);
  }
  return id;
};

export const assertAccountId = (id: unknown): AccountId => {
  if (!isValidAccountId(id)) {
    throw new BrandedTypeError("AccountId", id);
  }
  return id;
};

// =============================================================================
// TYPE-SAFE SERIALIZATION
// =============================================================================

/**
 * Type-safe serialization utilities for branded types.
 */

export const serializePlantId = (id: PlantId): string => id as string;
export const serializeUserId = (id: UserId): string => id as string;
export const serializeTerritoryId = (id: TerritoryId): string => id as string;
export const serializeAccountId = (id: AccountId): string => id as string;
export const serializeContactId = (id: ContactId): string => id as string;
export const serializeOpportunityId = (id: OpportunityId): string =>
  id as string;

export const deserializePlantId = (id: string): PlantId => createPlantId(id);
export const deserializeUserId = (id: string): UserId => createUserId(id);
export const deserializeTerritoryId = (id: string): TerritoryId =>
  createTerritoryId(id);
export const deserializeAccountId = (id: string): AccountId =>
  createAccountId(id);
export const deserializeContactId = (id: string): ContactId =>
  createContactId(id);
export const deserializeOpportunityId = (id: string): OpportunityId =>
  createOpportunityId(id);

// =============================================================================
// TYPE-SAFE JSON SERIALIZATION
// =============================================================================

/**
 * Type-safe JSON serialization for objects containing branded types.
 */

export const serializeBrandedObject = <T extends Record<string, any>>(
  obj: T
): Record<string, any> => {
  const serialized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      typeof value === "string" &&
      (isValidPlantId(value) ||
        isValidUserId(value) ||
        isValidTerritoryId(value) ||
        isValidAccountId(value))
    ) {
      serialized[key] = value as string;
    } else if (typeof value === "object" && value !== null) {
      serialized[key] = serializeBrandedObject(value);
    } else {
      serialized[key] = value;
    }
  }

  return serialized;
};

export const deserializeBrandedObject = <T extends Record<string, any>>(
  obj: Record<string, any>,
  schema: Record<string, (value: string) => any>
): T => {
  const deserialized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && schema[key]) {
      deserialized[key] = schema[key](value);
    } else if (typeof value === "object" && value !== null) {
      deserialized[key] = deserializeBrandedObject(value, schema);
    } else {
      deserialized[key] = value;
    }
  }

  return deserialized as T;
};
