import { z } from "zod";

// =============================================================================
// BASE VALIDATION SCHEMAS
// =============================================================================

// Common validation patterns
const uuidSchema = z.string().uuid("Invalid UUID format");
const emailSchema = z.string().email("Invalid email address");
const phoneSchema = z
  .string()
  .optional()
  .refine(
    val => !val || /^\+?[\d\s\-\(\)]+$/.test(val),
    "Invalid phone number format"
  );
const isoDateSchema = z.string().datetime("Invalid ISO date format");
const optionalIsoDateSchema = z
  .string()
  .datetime("Invalid ISO date format")
  .optional();
const positiveDecimalSchema = z
  .string()
  .refine(
    val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
    "Must be a positive number"
  );
const urlSchema = z.string().url("Invalid URL format").optional();

// =============================================================================
// TERRITORY VALIDATION
// =============================================================================

export const territorySchema = z.object({
  id: uuidSchema,
  name: z
    .string()
    .min(1, "Territory name is required")
    .max(100, "Territory name too long"),
  region: z.string().max(50, "Region too long").optional(),
  description: z.string().max(500, "Description too long").optional(),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createTerritorySchema = territorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTerritorySchema = createTerritorySchema.partial();

// =============================================================================
// ACCOUNT VALIDATION (Safety Equipment & Service Customers)
// =============================================================================

const accountTypeSchema = z.enum([
  "safety_equipment_customer",
  "training_client",
  "consulting_client",
  "maintenance_client",
  "partner",
  "vendor",
]);

const accountStatusSchema = z.enum([
  "active",
  "inactive",
  "prospect",
  "suspended",
]);

const industrySchema = z.enum([
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
]);

export const accountSchema = z.object({
  id: uuidSchema,
  territoryId: uuidSchema,
  ownerId: uuidSchema,
  name: z
    .string()
    .min(1, "Account name is required")
    .max(200, "Account name too long"),
  accountNumber: z.string().max(50, "Account number too long").optional(),
  type: accountTypeSchema.default("safety_equipment_customer"),
  status: accountStatusSchema.default("active"),
  industry: industrySchema.optional(),
  website: urlSchema,
  phone: phoneSchema,
  email: emailSchema.optional(),
  description: z.string().max(2000, "Description too long").optional(),
  annualRevenue: positiveDecimalSchema.optional(),
  employeeCount: z
    .enum(["1-10", "11-50", "51-200", "201-500", "500+"])
    .optional(),
  safetyComplianceLevel: z
    .enum(["OSHA Compliant", "ISO 45001", "Custom", "Non-Compliant"])
    .optional(),
  billingAddress: z.string().max(500, "Billing address too long").optional(),
  shippingAddress: z.string().max(500, "Shipping address too long").optional(),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  createdBy: uuidSchema,
});

export const createAccountSchema = accountSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateAccountSchema = createAccountSchema
  .partial()
  .refine(
    data =>
      data.name || data.type || data.status || data.territoryId || data.ownerId,
    "At least one field must be provided for update"
  );

// =============================================================================
// BRANCH VALIDATION (Physical Locations)
// =============================================================================

export const branchSchema = z.object({
  id: uuidSchema,
  accountId: uuidSchema,
  name: z
    .string()
    .min(1, "Branch name is required")
    .max(200, "Branch name too long"),
  branchCode: z.string().max(20, "Branch code too long").optional(),
  address: z
    .string()
    .min(1, "Address is required")
    .max(300, "Address too long"),
  city: z.string().min(1, "City is required").max(100, "City name too long"),
  state: z.string().min(1, "State is required").max(50, "State name too long"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .max(20, "Postal code too long"),
  country: z.string().max(50, "Country name too long").default("US"),
  phone: phoneSchema,
  email: emailSchema.optional(),
  contactPerson: z.string().max(100, "Contact person name too long").optional(),
  safetyManager: z.string().max(100, "Safety manager name too long").optional(),
  isPrimary: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createBranchSchema = branchSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateBranchSchema = createBranchSchema
  .partial()
  .refine(
    data =>
      data.name || data.address || data.city || data.state || data.accountId,
    "At least one field must be provided for update"
  );

// =============================================================================
// CONTACT VALIDATION (Individual People)
// =============================================================================

const contactRoleSchema = z.enum([
  "decision_maker",
  "influencer",
  "user",
  "evaluator",
  "champion",
  "gatekeeper",
  "other",
]);

const contactStatusSchema = z.enum(["active", "inactive", "do_not_contact"]);

export const contactSchema = z.object({
  id: uuidSchema,
  accountId: uuidSchema,
  branchId: uuidSchema.optional(),
  ownerId: uuidSchema,
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  email: emailSchema,
  phone: phoneSchema,
  mobile: phoneSchema,
  jobTitle: z.string().max(100, "Job title too long").optional(),
  department: z.string().max(100, "Department too long").optional(),
  role: contactRoleSchema.default("user"),
  status: contactStatusSchema.default("active"),
  isPrimary: z.boolean().default(false),
  safetyCertifications: z
    .string()
    .max(500, "Safety certifications too long")
    .optional(), // e.g., "OSHA 30", "CSP", "ASP"
  notes: z.string().max(2000, "Notes too long").optional(),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  createdBy: uuidSchema,
});

export const createContactSchema = contactSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateContactSchema = createContactSchema
  .partial()
  .refine(
    data =>
      data.firstName ||
      data.lastName ||
      data.email ||
      data.accountId ||
      data.ownerId,
    "At least one field must be provided for update"
  );

// =============================================================================
// OPPORTUNITY VALIDATION (Sales Pipeline)
// =============================================================================

const opportunityTypeSchema = z.enum([
  "safety_equipment_sale",
  "training_service",
  "consulting_service",
  "maintenance_contract",
  "compliance_assessment",
  "emergency_response_planning",
  "other",
]);

const opportunityStageSchema = z.enum([
  "prospecting",
  "qualification",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
]);

const opportunityStatusSchema = z.enum([
  "open",
  "closed",
  "on_hold",
  "cancelled",
]);

const opportunitySourceSchema = z.enum([
  "website",
  "referral",
  "cold_call",
  "trade_show",
  "social_media",
  "advertising",
  "other",
]);

const probabilitySchema = z.enum(["10", "25", "50", "75", "90"]);

export const opportunitySchema = z.object({
  id: uuidSchema,
  accountId: uuidSchema,
  contactId: uuidSchema.optional(),
  ownerId: uuidSchema,
  name: z
    .string()
    .min(1, "Opportunity name is required")
    .max(200, "Opportunity name too long"),
  description: z.string().max(2000, "Description too long").optional(),
  type: opportunityTypeSchema,
  stage: opportunityStageSchema.default("prospecting"),
  status: opportunityStatusSchema.default("open"),
  source: opportunitySourceSchema.optional(),
  probability: probabilitySchema.default("10"),
  amount: positiveDecimalSchema.optional(), // Expected deal value
  closeDate: optionalIsoDateSchema, // Expected close date
  actualCloseDate: optionalIsoDateSchema, // Actual close date
  lostReason: z.string().max(500, "Lost reason too long").optional(),
  nextSteps: z.string().max(1000, "Next steps too long").optional(),
  safetyRequirements: z
    .string()
    .max(1000, "Safety requirements too long")
    .optional(),
  complianceNotes: z.string().max(1000, "Compliance notes too long").optional(),
  notes: z.string().max(2000, "Notes too long").optional(),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  createdBy: uuidSchema,
});

export const createOpportunitySchema = opportunitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateOpportunitySchema = createOpportunitySchema
  .partial()
  .refine(
    data =>
      data.name ||
      data.type ||
      data.stage ||
      data.status ||
      data.accountId ||
      data.ownerId,
    "At least one field must be provided for update"
  );

// =============================================================================
// PRODUCT VALIDATION (Safety Equipment & Services)
// =============================================================================

const productCategorySchema = z.enum([
  "safety_equipment",
  "training_material",
  "consulting_service",
  "maintenance_service",
  "compliance_tool",
  "software",
  "other",
]);

const productStatusSchema = z.enum([
  "active",
  "inactive",
  "discontinued",
  "coming_soon",
]);

export const productSchema = z.object({
  id: uuidSchema,
  territoryId: uuidSchema,
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name too long"),
  description: z.string().max(2000, "Description too long").optional(),
  category: productCategorySchema,
  sku: z.string().max(50, "SKU too long").optional(),
  price: positiveDecimalSchema.optional(),
  cost: positiveDecimalSchema.optional(),
  status: productStatusSchema.default("active"),
  isService: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductSchema = createProductSchema
  .partial()
  .refine(
    data => data.name || data.category || data.status || data.territoryId,
    "At least one field must be provided for update"
  );

// =============================================================================
// PROJECT VALIDATION (Construction/Implementation Projects)
// =============================================================================

const projectStatusSchema = z.enum([
  "planning",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled",
]);

const projectPrioritySchema = z.enum(["low", "medium", "high", "critical"]);

export const projectSchema = z.object({
  id: uuidSchema,
  accountId: uuidSchema,
  branchId: uuidSchema.optional(),
  territoryId: uuidSchema,
  ownerId: uuidSchema,
  name: z
    .string()
    .min(1, "Project name is required")
    .max(200, "Project name too long"),
  description: z.string().max(2000, "Description too long").optional(),
  status: projectStatusSchema.default("planning"),
  priority: projectPrioritySchema.default("medium"),
  startDate: optionalIsoDateSchema,
  endDate: optionalIsoDateSchema,
  budget: positiveDecimalSchema.optional(),
  actualCost: positiveDecimalSchema.optional(),
  progress: z.number().min(0).max(100).default(0), // Percentage
  safetyRequirements: z
    .string()
    .max(1000, "Safety requirements too long")
    .optional(),
  complianceNotes: z.string().max(1000, "Compliance notes too long").optional(),
  notes: z.string().max(2000, "Notes too long").optional(),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  createdBy: uuidSchema,
});

export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .refine(
    data =>
      data.name ||
      data.status ||
      data.priority ||
      data.accountId ||
      data.ownerId,
    "At least one field must be provided for update"
  );

// =============================================================================
// SALES FACTS VALIDATION (Historical Sales Data)
// =============================================================================

const salesFactTypeSchema = z.enum([
  "equipment_sale",
  "service_revenue",
  "training_revenue",
  "consulting_revenue",
  "maintenance_revenue",
  "other",
]);

export const salesFactSchema = z.object({
  id: uuidSchema,
  accountId: uuidSchema,
  opportunityId: uuidSchema.optional(),
  productId: uuidSchema.optional(),
  territoryId: uuidSchema,
  userId: uuidSchema, // Sales rep
  type: salesFactTypeSchema,
  amount: positiveDecimalSchema,
  quantity: z.number().int().min(0).default(1),
  unitPrice: positiveDecimalSchema.optional(),
  discount: positiveDecimalSchema.optional(),
  commission: positiveDecimalSchema.optional(),
  saleDate: isoDateSchema,
  invoiceNumber: z.string().max(50, "Invoice number too long").optional(),
  paymentStatus: z.enum(["pending", "paid", "overdue", "cancelled"]).optional(),
  notes: z.string().max(1000, "Notes too long").optional(),
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createSalesFactSchema = salesFactSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSalesFactSchema = createSalesFactSchema
  .partial()
  .refine(
    data =>
      data.type ||
      data.amount ||
      data.accountId ||
      data.territoryId ||
      data.userId,
    "At least one field must be provided for update"
  );

// =============================================================================
// ACTIVITY LOG VALIDATION (Business Activity Tracking)
// =============================================================================

const activityLogTypeSchema = z.enum([
  "account_created",
  "account_updated",
  "contact_added",
  "opportunity_created",
  "opportunity_updated",
  "opportunity_closed",
  "project_started",
  "project_completed",
  "meeting_scheduled",
  "call_made",
  "email_sent",
  "proposal_sent",
  "contract_signed",
  "payment_received",
  "other",
]);

export const activityLogSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  entityType: z.enum([
    "account",
    "contact",
    "opportunity",
    "project",
    "product",
    "other",
  ]),
  entityId: uuidSchema,
  type: activityLogTypeSchema,
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long"),
  metadata: z.string().max(2000, "Metadata too long").optional(), // JSON string
  occurredAt: isoDateSchema,
  isActive: z.boolean().default(true),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const createActivityLogSchema = activityLogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateActivityLogSchema = createActivityLogSchema
  .partial()
  .refine(
    data =>
      data.type ||
      data.description ||
      data.userId ||
      data.entityType ||
      data.entityId,
    "At least one field must be provided for update"
  );

// =============================================================================
// TERRITORY-SCOPED VALIDATION UTILITIES
// =============================================================================

// Territory access validation
export const territoryAccessSchema = z.object({
  territoryId: uuidSchema,
  userId: uuidSchema,
});

// Territory-scoped queries
export const territoryScopedQuerySchema = z.object({
  territoryId: uuidSchema,
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Territory-scoped search
export const territorySearchQuerySchema = z.object({
  query: z.string().min(1, "Search query is required"),
  ...territoryScopedQuerySchema.shape,
});

// =============================================================================
// ROLE-BASED FIELD VALIDATION
// =============================================================================

// Sales rep fields (limited access)
export const salesRepFieldsSchema = z.object({
  canViewOwnAccounts: z.boolean().default(true),
  canCreateOpportunities: z.boolean().default(true),
  canUpdateOwnOpportunities: z.boolean().default(true),
  canViewOwnSales: z.boolean().default(true),
  canCreateActivityLogs: z.boolean().default(true),
});

// Sales manager fields (territory access)
export const salesManagerFieldsSchema = z.object({
  canViewTerritoryAccounts: z.boolean().default(true),
  canManageTerritoryOpportunities: z.boolean().default(true),
  canViewTerritorySales: z.boolean().default(true),
  canManageTerritoryUsers: z.boolean().default(true),
  canViewTerritoryReports: z.boolean().default(true),
});

// Admin fields (full access)
export const adminFieldsSchema = z.object({
  canManageAllTerritories: z.boolean().default(true),
  canManageAllAccounts: z.boolean().default(true),
  canManageAllOpportunities: z.boolean().default(true),
  canViewAllSales: z.boolean().default(true),
  canManageAllUsers: z.boolean().default(true),
  canViewAllReports: z.boolean().default(true),
});

// =============================================================================
// API REQUEST/RESPONSE SCHEMAS
// =============================================================================

// Common API patterns
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const searchQuerySchema = z.object({
  query: z.string().min(1, "Search query is required"),
  ...paginationSchema.shape,
});

// Territory-scoped response wrapper
export const territoryScopedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: dataSchema,
    territory: territorySchema.optional(),
    pagination: paginationSchema.optional(),
  });

// =============================================================================
// INTEGRATION SCHEMAS (Auth + Safety Business)
// =============================================================================

// Combined user context for API responses
export const businessUserContextSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum([
    "safety_admin",
    "sales_admin",
    "sales_manager",
    "sales_rep",
    "territory_manager",
  ]),
  territoryId: uuidSchema.optional(),
  territory: territorySchema.optional(),
});

// Business entity response with user context
export const businessEntityResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: dataSchema,
    user: businessUserContextSchema,
    territory: territorySchema.optional(),
    pagination: paginationSchema.optional(),
  });

// =============================================================================
// VALIDATION ERROR SCHEMAS
// =============================================================================

export const businessValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
});

export const safetyBusinessErrorSchema = z.object({
  code: z.enum([
    "TERRITORY_ACCESS_DENIED",
    "ROLE_PERMISSION_DENIED",
    "ACCOUNT_NOT_FOUND",
    "CONTACT_NOT_FOUND",
    "OPPORTUNITY_NOT_FOUND",
    "PRODUCT_NOT_FOUND",
    "PROJECT_NOT_FOUND",
    "TERRITORY_NOT_FOUND",
    "INVALID_TERRITORY_SCOPE",
    "DUPLICATE_ACCOUNT",
    "INVALID_OPPORTUNITY_STAGE",
    "SALES_TARGET_EXCEEDED",
    "COMPLIANCE_VIOLATION",
  ]),
  message: z.string(),
  details: z.array(businessValidationErrorSchema).optional(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Core entity types
export type Territory = z.infer<typeof territorySchema>;
export type CreateTerritory = z.infer<typeof createTerritorySchema>;
export type UpdateTerritory = z.infer<typeof updateTerritorySchema>;

export type Account = z.infer<typeof accountSchema>;
export type CreateAccount = z.infer<typeof createAccountSchema>;
export type UpdateAccount = z.infer<typeof updateAccountSchema>;

export type Branch = z.infer<typeof branchSchema>;
export type CreateBranch = z.infer<typeof createBranchSchema>;
export type UpdateBranch = z.infer<typeof updateBranchSchema>;

export type Contact = z.infer<typeof contactSchema>;
export type CreateContact = z.infer<typeof createContactSchema>;
export type UpdateContact = z.infer<typeof updateContactSchema>;

export type Opportunity = z.infer<typeof opportunitySchema>;
export type CreateOpportunity = z.infer<typeof createOpportunitySchema>;
export type UpdateOpportunity = z.infer<typeof updateOpportunitySchema>;

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;

export type SalesFact = z.infer<typeof salesFactSchema>;
export type CreateSalesFact = z.infer<typeof createSalesFactSchema>;
export type UpdateSalesFact = z.infer<typeof updateSalesFactSchema>;

export type ActivityLog = z.infer<typeof activityLogSchema>;
export type CreateActivityLog = z.infer<typeof createActivityLogSchema>;
export type UpdateActivityLog = z.infer<typeof updateActivityLogSchema>;

// Utility types
export type TerritoryAccess = z.infer<typeof territoryAccessSchema>;
export type BusinessUserContext = z.infer<typeof businessUserContextSchema>;
export type BusinessValidationError = z.infer<
  typeof businessValidationErrorSchema
>;
export type SafetyBusinessError = z.infer<typeof safetyBusinessErrorSchema>;

// API types
export type TerritoryScopedQuery = z.infer<typeof territoryScopedQuerySchema>;
export type TerritorySearchQuery = z.infer<typeof territorySearchQuerySchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;

// Role-based types
export type SalesRepFields = z.infer<typeof salesRepFieldsSchema>;
export type SalesManagerFields = z.infer<typeof salesManagerFieldsSchema>;
export type AdminFields = z.infer<typeof adminFieldsSchema>;
