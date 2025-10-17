// =============================================================================
// SAFETY TRAINING VALIDATION SCHEMAS
// =============================================================================

// Export existing Safety Training schemas
export {
  // Core schemas
  plantSchema,
  createPlantSchema,
  updatePlantSchema,
  userProfileSchema,
  createUserProfileSchema,
  updateUserProfileSchema,
  courseSchema,
  createCourseSchema,
  updateCourseSchema,
  enrollmentSchema,
  createEnrollmentSchema,
  updateEnrollmentSchema,
  progressSchema,
  createProgressSchema,
  updateProgressSchema,
  activityEventSchema,
  createActivityEventSchema,
  updateActivityEventSchema,
  questionEventSchema,
  createQuestionEventSchema,
  updateQuestionEventSchema,
  adminRoleSchema,
  createAdminRoleSchema,
  updateAdminRoleSchema,

  // Utility schemas
  plantAccessSchema,
  safetyAdminFieldsSchema,
  plantManagerFieldsSchema,
  safetyInstructorFieldsSchema,
  hrAdminFieldsSchema,
  paginationSchema,
  plantScopedQuerySchema,
  searchQuerySchema,
  userContextSchema,
  plantScopedResponseSchema,
  validationErrorSchema,
  safetyTrainingErrorSchema,

  // Types
  type Plant,
  type CreatePlant,
  type UpdatePlant,
  type UserProfile,
  type CreateUserProfile,
  type UpdateUserProfile,
  type Course,
  type CreateCourse,
  type UpdateCourse,
  type Enrollment,
  type CreateEnrollment,
  type UpdateEnrollment,
  type Progress,
  type CreateProgress,
  type UpdateProgress,
  type ActivityEvent,
  type CreateActivityEvent,
  type UpdateActivityEvent,
  type QuestionEvent,
  type CreateQuestionEvent,
  type UpdateQuestionEvent,
  type AdminRole,
  type CreateAdminRole,
  type UpdateAdminRole,
  type PlantAccess,
  type UserContext,
  type SafetyTrainingError,
  type PaginationQuery,
  type PlantScopedQuery,
  type SafetyAdminFields,
  type PlantManagerFields,
  type SafetyInstructorFields,
  type HrAdminFields,
} from "./safety-business";

// =============================================================================
// SAFETY BUSINESS DTO VALIDATION SCHEMAS
// =============================================================================

export {
  // Core business schemas
  territorySchema,
  createTerritorySchema,
  updateTerritorySchema,
  accountSchema,
  createAccountSchema,
  updateAccountSchema,
  branchSchema,
  createBranchSchema,
  updateBranchSchema,
  contactSchema,
  createContactSchema,
  updateContactSchema,
  opportunitySchema,
  createOpportunitySchema,
  updateOpportunitySchema,
  productSchema,
  createProductSchema,
  updateProductSchema,
  projectSchema,
  createProjectSchema,
  updateProjectSchema,
  salesFactSchema,
  createSalesFactSchema,
  updateSalesFactSchema,
  activityLogSchema,
  createActivityLogSchema,
  updateActivityLogSchema,

  // Utility schemas
  territoryAccessSchema,
  territoryScopedQuerySchema,
  territorySearchQuerySchema,
  salesRepFieldsSchema,
  salesManagerFieldsSchema,
  adminFieldsSchema,
  businessUserContextSchema,
  businessValidationErrorSchema,
  safetyBusinessErrorSchema,

  // Types
  type Territory,
  type CreateTerritory,
  type UpdateTerritory,
  type Account,
  type CreateAccount,
  type UpdateAccount,
  type Branch,
  type CreateBranch,
  type UpdateBranch,
  type Contact,
  type CreateContact,
  type UpdateContact,
  type Opportunity,
  type CreateOpportunity,
  type UpdateOpportunity,
  type Product,
  type CreateProduct,
  type UpdateProduct,
  type Project,
  type CreateProject,
  type UpdateProject,
  type SalesFact,
  type CreateSalesFact,
  type UpdateSalesFact,
  type ActivityLog,
  type CreateActivityLog,
  type UpdateActivityLog,
  type TerritoryAccess,
  type BusinessUserContext,
  type BusinessValidationError,
  type SafetyBusinessError,
  type TerritoryScopedQuery,
  type TerritorySearchQuery,
  type SalesRepFields,
  type SalesManagerFields,
  type AdminFields,
} from "./safety-business-dtos";

// =============================================================================
// ENHANCED INTEGRATION SCHEMAS
// =============================================================================

export {
  // Enhanced auth schemas
  enhancedAuthUserSchema,
  enhancedUserProfileSchema,

  // Enhanced entity schemas
  enhancedTerritorySchema,
  enhancedPlantSchema,
  enhancedAccountSchema,
  enhancedContactSchema,
  enhancedOpportunitySchema,
  enhancedActivityLogSchema,

  // Enhanced response schemas
  enhancedUnifiedSuccessResponseSchema,
  enhancedUnifiedErrorResponseSchema,
  enhancedCrossSystemMiddlewareSchema,

  // Enhanced types
  type EnhancedAuthUser,
  type EnhancedUserProfile,
  type EnhancedTerritory,
  type EnhancedPlant,
  type EnhancedAccount,
  type EnhancedContact,
  type EnhancedOpportunity,
  type EnhancedActivityLog,
  type EnhancedUnifiedSuccessResponse,
  type EnhancedUnifiedErrorResponse,
  type EnhancedCrossSystemMiddleware,
} from "./enhanced-integration-schemas";

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

export {
  // Validation utilities
  validationUtils,
  validationMessages,
  validationErrorCodes,

  // Enhanced validation schemas
  enhancedUuidSchema,
  enhancedEmailSchema,
  enhancedPhoneSchema,
  enhancedUrlSchema,
  enhancedIsoDateSchema,
  enhancedDecimalStringSchema,

  // Territory and role validation
  territoryValidation,
  roleValidation,

  // Business rules
  safetyBusinessRules,

  // Types
  type ValidationError,
  type BusinessRule,
  type ValidationResult,
} from "./validation-utils";

// =============================================================================
// API REQUEST/RESPONSE SCHEMAS
// =============================================================================

export {
  // Generic request schemas
  createEntityRequestSchema,
  updateEntityRequestSchema,
  deleteEntityRequestSchema,
  getEntityRequestSchema,

  // Specific entity request schemas
  createAccountRequestSchema,
  updateAccountRequestSchema,
  deleteAccountRequestSchema,
  getAccountRequestSchema,
  createContactRequestSchema,
  updateContactRequestSchema,
  deleteContactRequestSchema,
  getContactRequestSchema,
  createOpportunityRequestSchema,
  updateOpportunityRequestSchema,
  deleteOpportunityRequestSchema,
  getOpportunityRequestSchema,
  createBranchRequestSchema,
  updateBranchRequestSchema,
  deleteBranchRequestSchema,
  getBranchRequestSchema,
  createProductRequestSchema,
  updateProductRequestSchema,
  deleteProductRequestSchema,
  getProductRequestSchema,
  createProjectRequestSchema,
  updateProjectRequestSchema,
  deleteProjectRequestSchema,
  getProjectRequestSchema,
  createSalesFactRequestSchema,
  updateSalesFactRequestSchema,
  deleteSalesFactRequestSchema,
  getSalesFactRequestSchema,
  createActivityLogRequestSchema,
  updateActivityLogRequestSchema,
  deleteActivityLogRequestSchema,
  getActivityLogRequestSchema,
  createTerritoryRequestSchema,
  updateTerritoryRequestSchema,
  deleteTerritoryRequestSchema,
  getTerritoryRequestSchema,

  // Response schemas
  successResponseSchema,
  errorResponseSchema,
  paginatedResponseSchema,
  accountResponseSchema,
  contactResponseSchema,
  opportunityResponseSchema,
  branchResponseSchema,
  productResponseSchema,
  projectResponseSchema,
  salesFactResponseSchema,
  activityLogResponseSchema,
  territoryResponseSchema,
  paginatedAccountsResponseSchema,
  paginatedContactsResponseSchema,
  paginatedOpportunitiesResponseSchema,
  paginatedBranchesResponseSchema,
  paginatedProductsResponseSchema,
  paginatedProjectsResponseSchema,
  paginatedSalesFactsResponseSchema,
  paginatedActivityLogsResponseSchema,
  paginatedTerritoriesResponseSchema,

  // Query request schemas
  listAccountsRequestSchema,
  listContactsRequestSchema,
  listOpportunitiesRequestSchema,
  listProductsRequestSchema,
  listProjectsRequestSchema,
  listSalesFactsRequestSchema,
  listActivityLogsRequestSchema,
  searchAccountsRequestSchema,
  searchContactsRequestSchema,
  searchOpportunitiesRequestSchema,
  searchProductsRequestSchema,
  searchProjectsRequestSchema,

  // Form schemas
  accountFormSchema,
  contactFormSchema,
  opportunityFormSchema,
  productFormSchema,
  projectFormSchema,

  // Request types
  type CreateAccountRequest,
  type UpdateAccountRequest,
  type DeleteAccountRequest,
  type GetAccountRequest,
  type CreateContactRequest,
  type UpdateContactRequest,
  type DeleteContactRequest,
  type GetContactRequest,
  type CreateOpportunityRequest,
  type UpdateOpportunityRequest,
  type DeleteOpportunityRequest,
  type GetOpportunityRequest,
  type CreateBranchRequest,
  type UpdateBranchRequest,
  type DeleteBranchRequest,
  type GetBranchRequest,
  type CreateProductRequest,
  type UpdateProductRequest,
  type DeleteProductRequest,
  type GetProductRequest,
  type CreateProjectRequest,
  type UpdateProjectRequest,
  type DeleteProjectRequest,
  type GetProjectRequest,
  type CreateSalesFactRequest,
  type UpdateSalesFactRequest,
  type DeleteSalesFactRequest,
  type GetSalesFactRequest,
  type CreateActivityLogRequest,
  type UpdateActivityLogRequest,
  type DeleteActivityLogRequest,
  type GetActivityLogRequest,
  type CreateTerritoryRequest,
  type UpdateTerritoryRequest,
  type DeleteTerritoryRequest,
  type GetTerritoryRequest,
  type ListAccountsRequest,
  type ListContactsRequest,
  type ListOpportunitiesRequest,
  type ListProductsRequest,
  type ListProjectsRequest,
  type ListSalesFactsRequest,
  type ListActivityLogsRequest,
  type SearchAccountsRequest,
  type SearchContactsRequest,
  type SearchOpportunitiesRequest,
  type SearchProductsRequest,
  type SearchProjectsRequest,
  type AccountResponse,
  type ContactResponse,
  type OpportunityResponse,
  type BranchResponse,
  type ProductResponse,
  type ProjectResponse,
  type SalesFactResponse,
  type ActivityLogResponse,
  type TerritoryResponse,
  type PaginatedAccountsResponse,
  type PaginatedContactsResponse,
  type PaginatedOpportunitiesResponse,
  type PaginatedBranchesResponse,
  type PaginatedProductsResponse,
  type PaginatedProjectsResponse,
  type PaginatedSalesFactsResponse,
  type PaginatedActivityLogsResponse,
  type PaginatedTerritoriesResponse,
  type ErrorResponse,
  type AccountForm,
  type ContactForm,
  type OpportunityForm,
  type ProductForm,
  type ProjectForm,
} from "./api-schemas";

// =============================================================================
// INTEGRATION SCHEMAS (Auth + Safety Systems)
// =============================================================================

export {
  // Safety Training integration
  safetyTrainingUserContextSchema,
  plantScopedTrainingResponseSchema,
  safetyTrainingEntityResponseSchema,

  // Safety Business integration
  safetyBusinessUserContextSchema,
  territoryScopedBusinessResponseSchema,
  safetyBusinessEntityResponseSchema,

  // Cross-system integration
  fullUserContextSchema,
  crossSystemOperationSchema,
  unifiedSuccessResponseSchema,
  unifiedErrorResponseSchema,

  // Middleware validation
  plantScopedMiddlewareSchema,
  territoryScopedMiddlewareSchema,
  crossSystemMiddlewareSchema,

  // Permission validation
  safetyTrainingPermissionSchema,
  safetyBusinessPermissionSchema,
  crossSystemPermissionSchema,

  // Audit and compliance
  crossSystemAuditLogSchema,
  complianceValidationSchema,

  // Integration types
  type SafetyTrainingUserContext,
  type SafetyBusinessUserContext,
  type FullUserContext,
  type PlantScopedTrainingResponse,
  type SafetyTrainingEntityResponse,
  type TerritoryScopedBusinessResponse,
  type SafetyBusinessEntityResponse,
  type UnifiedSuccessResponse,
  type UnifiedErrorResponse,
  type PlantScopedMiddleware,
  type TerritoryScopedMiddleware,
  type CrossSystemMiddleware,
  type SafetyTrainingPermission,
  type SafetyBusinessPermission,
  type CrossSystemPermission,
  type CrossSystemOperation,
  type CrossSystemAuditLog,
  type ComplianceValidation,
} from "./integration-schemas";

// =============================================================================
// AUTH VALIDATION SCHEMAS
// =============================================================================

export {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from "./auth";

// =============================================================================
// PLANT-ROLE VALIDATION UTILITIES
// =============================================================================

export {
  // Validation functions
  validatePlantAccess,
  plantAccessValidationSchema,
  hasRolePermission,
  getRolePermissions,
  validatePlantOperation,
  validateCourseCreation,
  validateEnrollmentAccess,
  validateUserManagement,
  validateProgressAccess,
  validateComplianceAccess,

  // Zod schemas for middleware
  plantScopedRequestSchema,
  roleBasedOperationSchema,

  // Types
  type PlantOperationResult,
  type ValidationContext,
  type PlantScopedRequest,
  type RoleBasedOperation,

  // Constants
  ROLE_HIERARCHY,
} from "./plant-role-validation";

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Common validation patterns and utilities
 */
// Validation utilities are exported from validation-utils.ts
