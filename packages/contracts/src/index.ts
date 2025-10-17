// =============================================================================
// CONTRACTS PACKAGE EXPORTS
// =============================================================================

/**
 * Contracts package exports for the Safety System.
 * This provides TypeScript interfaces and types for API contracts.
 */

// =============================================================================
// DATABASE TYPES RE-EXPORTS
// =============================================================================

// Note: Database types will be re-exported from @specchem/db once the package is fully built
// For now, we'll define basic interfaces that match the database schema

// =============================================================================
// API CONTRACT INTERFACES
// =============================================================================

/**
 * Base API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

/**
 * Paginated API response structure
 */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * API request parameters for pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * API request parameters for filtering
 */
export interface FilterParams {
  search?: string;
  filters?: Record<string, string | number | boolean | string[]>;
  dateRange?: {
    start: string;
    end: string;
  };
}

// =============================================================================
// AUTHENTICATION CONTRACTS
// =============================================================================

/**
 * User authentication response
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    territoryId: string;
  };
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
}

/**
 * Login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  territoryId: string;
  role?: string;
}

// =============================================================================
// SAFETY TRAINING CONTRACTS
// =============================================================================

/**
 * Comprehensive Safety Training API contracts
 */
export * from "./safety-training-contracts";
export * from "./safety-training-endpoints";
export * from "./safety-training-openapi-minimal";
export * from "./safety-training-validation";

// =============================================================================
// LMS CONTENT CONTRACTS
// =============================================================================

/**
 * LMS Content API contracts for structured course content
 */
export * from "./lms-content-contracts";
export * from "./lms-content-endpoints";

// =============================================================================
// SAFETY BUSINESS CONTRACTS
// =============================================================================

/**
 * Account creation request
 */
export interface CreateAccountRequest {
  name: string;
  type: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  annualRevenue?: number;
  employeeCount?: string;
  safetyComplianceLevel?: string;
  billingAddress?: string;
  shippingAddress?: string;
}

/**
 * Contact creation request
 */
export interface CreateContactRequest {
  accountId: string;
  branchId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  department?: string;
  role?: string;
  isPrimary?: boolean;
  safetyCertifications?: string;
  notes?: string;
}

/**
 * Opportunity creation request
 */
export interface CreateOpportunityRequest {
  accountId: string;
  contactId?: string;
  name: string;
  description?: string;
  type: string;
  stage?: string;
  source?: string;
  probability?: string;
  amount?: number;
  closeDate?: string;
  nextSteps?: string;
  safetyRequirements?: string;
  complianceNotes?: string;
  notes?: string;
}

/**
 * Activity log creation request
 */
export interface CreateActivityLogRequest {
  accountId?: string;
  contactId?: string;
  type: string;
  subject: string;
  description?: string;
  status?: string;
  priority?: string;
  scheduledAt?: string;
  duration?: string;
  outcome?: string;
  nextSteps?: string;
  safetyNotes?: string;
}

// =============================================================================
// SEARCH AND FILTER CONTRACTS
// =============================================================================

/**
 * Search request parameters
 */
export interface SearchRequest extends PaginationParams, FilterParams {
  query?: string;
}

/**
 * Account search filters
 */
export interface AccountSearchFilters {
  type?: string[];
  status?: string[];
  industry?: string[];
  territoryId?: string;
  ownerId?: string;
  isActive?: boolean;
}

/**
 * Contact search filters
 */
export interface ContactSearchFilters {
  accountId?: string;
  branchId?: string;
  role?: string[];
  status?: string[];
  isPrimary?: boolean;
  isActive?: boolean;
}

/**
 * Opportunity search filters
 */
export interface OpportunitySearchFilters {
  accountId?: string;
  contactId?: string;
  type?: string[];
  stage?: string[];
  status?: string[];
  source?: string[];
  probability?: string[];
  ownerId?: string;
  isActive?: boolean;
}

// =============================================================================
// REPORTING CONTRACTS
// =============================================================================

/**
 * Sales report request
 */
export interface SalesReportRequest {
  periodType: string;
  periodStart: string;
  periodEnd: string;
  territoryId?: string;
  userId?: string;
  factType?: string[];
}

/**
 * Training report request
 */
export interface TrainingReportRequest {
  periodStart: string;
  periodEnd: string;
  plantId?: string;
  courseId?: string;
  userId?: string;
}

/**
 * Compliance report request
 */
export interface ComplianceReportRequest {
  periodStart: string;
  periodEnd: string;
  territoryId?: string;
  complianceStandard?: string[];
}

// =============================================================================
// ERROR CONTRACTS
// =============================================================================

/**
 * API error response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string | number | boolean>;
  timestamp: string;
}

/**
 * Validation error response
 */
export interface ValidationError extends ApiError {
  field: string;
  value: unknown;
  constraint: string;
}

// =============================================================================
// PACKAGE METADATA
// =============================================================================

export const PACKAGE_VERSION = "1.0.0";
export const PACKAGE_NAME = "@specchem/contracts";
export const PACKAGE_DESCRIPTION =
  "TypeScript contracts and interfaces for Safety System API";

/**
 * Package metadata
 */
export const PACKAGE_METADATA = {
  name: PACKAGE_NAME,
  version: PACKAGE_VERSION,
  description: PACKAGE_DESCRIPTION,
  features: [
    "TypeScript API Contracts",
    "Database Type Re-exports",
    "Authentication Interfaces",
    "Comprehensive Safety Training Contracts",
    "Plant-scoped Multi-tenancy",
    "Role-based Access Control",
    "OpenAPI Specifications",
    "Validation Middleware",
    "Safety Business Contracts",
    "Search and Filter Types",
    "Reporting Interfaces",
    "Error Handling Types",
  ],
  contracts: {
    apiContracts: 25,
    authContracts: 3,
    trainingContracts: 45,
    businessContracts: 4,
    searchContracts: 3,
    reportingContracts: 3,
    errorContracts: 2,
    endpointSpecs: 35,
    openApiSpecs: 1,
    validationMiddleware: 1,
    totalContracts: 122,
  },
  safetyTraining: {
    entities: 7,
    requestSchemas: 12,
    responseSchemas: 7,
    paginatedSchemas: 7,
    querySchemas: 6,
    endpointSpecs: 35,
    errorCodes: 21,
    validationUtils: 15,
    integrationSchemas: 2,
  },
  compatibility: {
    typescript: "5.0+",
    node: "18.0+",
    nextjs: "14.0+",
    zod: "3.0+",
  },
} as const;
