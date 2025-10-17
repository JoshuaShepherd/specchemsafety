import { z } from "zod";
import {
  // Core schemas
  accountSchema,
  contactSchema,
  opportunitySchema,
  branchSchema,
  productSchema,
  projectSchema,
  salesFactSchema,
  activityLogSchema,
  territorySchema,

  // Create/Update schemas
  createAccountSchema,
  updateAccountSchema,
  createContactSchema,
  updateContactSchema,
  createOpportunitySchema,
  updateOpportunitySchema,
  createBranchSchema,
  updateBranchSchema,
  createProductSchema,
  updateProductSchema,
  createProjectSchema,
  updateProjectSchema,
  createSalesFactSchema,
  updateSalesFactSchema,
  createActivityLogSchema,
  updateActivityLogSchema,
  createTerritorySchema,
  updateTerritorySchema,

  // Utility schemas
  paginationSchema,
  territoryScopedQuerySchema,
  territorySearchQuerySchema,
  businessUserContextSchema,
  businessValidationErrorSchema,
  safetyBusinessErrorSchema,
} from "./safety-business-dtos";

// =============================================================================
// API REQUEST SCHEMAS
// =============================================================================

// Generic CRUD request schemas
export const createEntityRequestSchema = <T extends z.ZodTypeAny>(
  entitySchema: T
) =>
  z.object({
    data: entitySchema,
    territoryId: z.string().uuid("Invalid territory ID").optional(),
  });

export const updateEntityRequestSchema = <T extends z.ZodTypeAny>(
  entitySchema: T
) =>
  z.object({
    id: z.string().uuid("Invalid entity ID"),
    data: entitySchema,
    territoryId: z.string().uuid("Invalid territory ID").optional(),
  });

export const deleteEntityRequestSchema = z.object({
  id: z.string().uuid("Invalid entity ID"),
  territoryId: z.string().uuid("Invalid territory ID").optional(),
});

export const getEntityRequestSchema = z.object({
  id: z.string().uuid("Invalid entity ID"),
  territoryId: z.string().uuid("Invalid territory ID").optional(),
});

// Specific entity request schemas
export const createAccountRequestSchema =
  createEntityRequestSchema(createAccountSchema);
export const updateAccountRequestSchema =
  updateEntityRequestSchema(updateAccountSchema);
export const deleteAccountRequestSchema = deleteEntityRequestSchema;
export const getAccountRequestSchema = getEntityRequestSchema;

export const createContactRequestSchema =
  createEntityRequestSchema(createContactSchema);
export const updateContactRequestSchema =
  updateEntityRequestSchema(updateContactSchema);
export const deleteContactRequestSchema = deleteEntityRequestSchema;
export const getContactRequestSchema = getEntityRequestSchema;

export const createOpportunityRequestSchema = createEntityRequestSchema(
  createOpportunitySchema
);
export const updateOpportunityRequestSchema = updateEntityRequestSchema(
  updateOpportunitySchema
);
export const deleteOpportunityRequestSchema = deleteEntityRequestSchema;
export const getOpportunityRequestSchema = getEntityRequestSchema;

export const createBranchRequestSchema =
  createEntityRequestSchema(createBranchSchema);
export const updateBranchRequestSchema =
  updateEntityRequestSchema(updateBranchSchema);
export const deleteBranchRequestSchema = deleteEntityRequestSchema;
export const getBranchRequestSchema = getEntityRequestSchema;

export const createProductRequestSchema =
  createEntityRequestSchema(createProductSchema);
export const updateProductRequestSchema =
  updateEntityRequestSchema(updateProductSchema);
export const deleteProductRequestSchema = deleteEntityRequestSchema;
export const getProductRequestSchema = getEntityRequestSchema;

export const createProjectRequestSchema =
  createEntityRequestSchema(createProjectSchema);
export const updateProjectRequestSchema =
  updateEntityRequestSchema(updateProjectSchema);
export const deleteProjectRequestSchema = deleteEntityRequestSchema;
export const getProjectRequestSchema = getEntityRequestSchema;

export const createSalesFactRequestSchema = createEntityRequestSchema(
  createSalesFactSchema
);
export const updateSalesFactRequestSchema = updateEntityRequestSchema(
  updateSalesFactSchema
);
export const deleteSalesFactRequestSchema = deleteEntityRequestSchema;
export const getSalesFactRequestSchema = getEntityRequestSchema;

export const createActivityLogRequestSchema = createEntityRequestSchema(
  createActivityLogSchema
);
export const updateActivityLogRequestSchema = updateEntityRequestSchema(
  updateActivityLogSchema
);
export const deleteActivityLogRequestSchema = deleteEntityRequestSchema;
export const getActivityLogRequestSchema = getEntityRequestSchema;

export const createTerritoryRequestSchema = createEntityRequestSchema(
  createTerritorySchema
);
export const updateTerritoryRequestSchema = updateEntityRequestSchema(
  updateTerritorySchema
);
export const deleteTerritoryRequestSchema = deleteEntityRequestSchema;
export const getTerritoryRequestSchema = getEntityRequestSchema;

// =============================================================================
// API RESPONSE SCHEMAS
// =============================================================================

// Generic response schemas
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean().default(true),
    data: dataSchema,
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  });

export const errorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: safetyBusinessErrorSchema,
  timestamp: z.string().datetime(),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    success: z.boolean().default(true),
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  });

// Specific entity response schemas
export const accountResponseSchema = successResponseSchema(accountSchema);
export const contactResponseSchema = successResponseSchema(contactSchema);
export const opportunityResponseSchema =
  successResponseSchema(opportunitySchema);
export const branchResponseSchema = successResponseSchema(branchSchema);
export const productResponseSchema = successResponseSchema(productSchema);
export const projectResponseSchema = successResponseSchema(projectSchema);
export const salesFactResponseSchema = successResponseSchema(salesFactSchema);
export const activityLogResponseSchema =
  successResponseSchema(activityLogSchema);
export const territoryResponseSchema = successResponseSchema(territorySchema);

// Paginated response schemas
export const paginatedAccountsResponseSchema =
  paginatedResponseSchema(accountSchema);
export const paginatedContactsResponseSchema =
  paginatedResponseSchema(contactSchema);
export const paginatedOpportunitiesResponseSchema =
  paginatedResponseSchema(opportunitySchema);
export const paginatedBranchesResponseSchema =
  paginatedResponseSchema(branchSchema);
export const paginatedProductsResponseSchema =
  paginatedResponseSchema(productSchema);
export const paginatedProjectsResponseSchema =
  paginatedResponseSchema(projectSchema);
export const paginatedSalesFactsResponseSchema =
  paginatedResponseSchema(salesFactSchema);
export const paginatedActivityLogsResponseSchema =
  paginatedResponseSchema(activityLogSchema);
export const paginatedTerritoriesResponseSchema =
  paginatedResponseSchema(territorySchema);

// =============================================================================
// QUERY REQUEST SCHEMAS
// =============================================================================

// List entities request schemas
export const listAccountsRequestSchema = z.object({
  ...territoryScopedQuerySchema.shape,
  filters: z
    .object({
      status: z
        .enum(["active", "inactive", "prospect", "suspended"])
        .optional(),
      type: z
        .enum([
          "safety_equipment_customer",
          "training_client",
          "consulting_client",
          "maintenance_client",
          "partner",
          "vendor",
        ])
        .optional(),
      industry: z
        .enum([
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
        ])
        .optional(),
      ownerId: z.string().uuid().optional(),
    })
    .optional(),
});

export const listContactsRequestSchema = z.object({
  accountId: z.string().uuid().optional(),
  ...territoryScopedQuerySchema.shape,
  filters: z
    .object({
      status: z.enum(["active", "inactive", "do_not_contact"]).optional(),
      role: z
        .enum([
          "decision_maker",
          "influencer",
          "user",
          "evaluator",
          "champion",
          "gatekeeper",
          "other",
        ])
        .optional(),
      isPrimary: z.boolean().optional(),
      ownerId: z.string().uuid().optional(),
    })
    .optional(),
});

export const listOpportunitiesRequestSchema = z.object({
  accountId: z.string().uuid().optional(),
  ...territoryScopedQuerySchema.shape,
  filters: z
    .object({
      stage: z
        .enum([
          "prospecting",
          "qualification",
          "proposal",
          "negotiation",
          "closed_won",
          "closed_lost",
        ])
        .optional(),
      status: z.enum(["open", "closed", "on_hold", "cancelled"]).optional(),
      type: z
        .enum([
          "safety_equipment_sale",
          "training_service",
          "consulting_service",
          "maintenance_contract",
          "compliance_assessment",
          "emergency_response_planning",
          "other",
        ])
        .optional(),
      ownerId: z.string().uuid().optional(),
      probability: z.enum(["10", "25", "50", "75", "90"]).optional(),
    })
    .optional(),
});

export const listProductsRequestSchema = z.object({
  ...territoryScopedQuerySchema.shape,
  filters: z
    .object({
      category: z
        .enum([
          "safety_equipment",
          "training_material",
          "consulting_service",
          "maintenance_service",
          "compliance_tool",
          "software",
          "other",
        ])
        .optional(),
      status: z
        .enum(["active", "inactive", "discontinued", "coming_soon"])
        .optional(),
      isService: z.boolean().optional(),
    })
    .optional(),
});

export const listProjectsRequestSchema = z.object({
  accountId: z.string().uuid().optional(),
  ...territoryScopedQuerySchema.shape,
  filters: z
    .object({
      status: z
        .enum(["planning", "in_progress", "on_hold", "completed", "cancelled"])
        .optional(),
      priority: z.enum(["low", "medium", "high", "critical"]).optional(),
      ownerId: z.string().uuid().optional(),
    })
    .optional(),
});

export const listSalesFactsRequestSchema = z.object({
  accountId: z.string().uuid().optional(),
  ...territoryScopedQuerySchema.shape,
  filters: z
    .object({
      type: z
        .enum([
          "equipment_sale",
          "service_revenue",
          "training_revenue",
          "consulting_revenue",
          "maintenance_revenue",
          "other",
        ])
        .optional(),
      paymentStatus: z
        .enum(["pending", "paid", "overdue", "cancelled"])
        .optional(),
      userId: z.string().uuid().optional(),
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
    })
    .optional(),
});

export const listActivityLogsRequestSchema = z.object({
  entityType: z
    .enum(["account", "contact", "opportunity", "project", "product", "other"])
    .optional(),
  entityId: z.string().uuid().optional(),
  ...territoryScopedQuerySchema.shape,
  filters: z
    .object({
      type: z
        .enum([
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
        ])
        .optional(),
      userId: z.string().uuid().optional(),
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
    })
    .optional(),
});

// Search request schemas
export const searchAccountsRequestSchema = z.object({
  ...territorySearchQuerySchema.shape,
  filters: listAccountsRequestSchema.shape.filters.optional(),
});

export const searchContactsRequestSchema = z.object({
  ...territorySearchQuerySchema.shape,
  filters: listContactsRequestSchema.shape.filters.optional(),
});

export const searchOpportunitiesRequestSchema = z.object({
  ...territorySearchQuerySchema.shape,
  filters: listOpportunitiesRequestSchema.shape.filters.optional(),
});

export const searchProductsRequestSchema = z.object({
  ...territorySearchQuerySchema.shape,
  filters: listProductsRequestSchema.shape.filters.optional(),
});

export const searchProjectsRequestSchema = z.object({
  ...territorySearchQuerySchema.shape,
  filters: listProjectsRequestSchema.shape.filters.optional(),
});

// =============================================================================
// FORM VALIDATION SCHEMAS
// =============================================================================

// Account form schemas
export const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, "Account name is required")
    .max(200, "Account name too long"),
  accountNumber: z.string().max(50, "Account number too long").optional(),
  type: z
    .enum([
      "safety_equipment_customer",
      "training_client",
      "consulting_client",
      "maintenance_client",
      "partner",
      "vendor",
    ])
    .default("safety_equipment_customer"),
  status: z
    .enum(["active", "inactive", "prospect", "suspended"])
    .default("active"),
  industry: z
    .enum([
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
    ])
    .optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  description: z.string().max(2000, "Description too long").optional(),
  annualRevenue: z.string().optional(),
  employeeCount: z
    .enum(["1-10", "11-50", "51-200", "201-500", "500+"])
    .optional(),
  safetyComplianceLevel: z
    .enum(["OSHA Compliant", "ISO 45001", "Custom", "Non-Compliant"])
    .optional(),
  billingAddress: z.string().max(500, "Billing address too long").optional(),
  shippingAddress: z.string().max(500, "Shipping address too long").optional(),
  territoryId: z.string().uuid("Invalid territory ID"),
  ownerId: z.string().uuid("Invalid owner ID"),
});

// Contact form schemas
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  jobTitle: z.string().max(100, "Job title too long").optional(),
  department: z.string().max(100, "Department too long").optional(),
  role: z
    .enum([
      "decision_maker",
      "influencer",
      "user",
      "evaluator",
      "champion",
      "gatekeeper",
      "other",
    ])
    .default("user"),
  status: z.enum(["active", "inactive", "do_not_contact"]).default("active"),
  isPrimary: z.boolean().default(false),
  safetyCertifications: z
    .string()
    .max(500, "Safety certifications too long")
    .optional(),
  notes: z.string().max(2000, "Notes too long").optional(),
  accountId: z.string().uuid("Invalid account ID"),
  branchId: z.string().uuid("Invalid branch ID").optional(),
  ownerId: z.string().uuid("Invalid owner ID"),
});

// Opportunity form schemas
export const opportunityFormSchema = z.object({
  name: z
    .string()
    .min(1, "Opportunity name is required")
    .max(200, "Opportunity name too long"),
  description: z.string().max(2000, "Description too long").optional(),
  type: z.enum([
    "safety_equipment_sale",
    "training_service",
    "consulting_service",
    "maintenance_contract",
    "compliance_assessment",
    "emergency_response_planning",
    "other",
  ]),
  stage: z
    .enum([
      "prospecting",
      "qualification",
      "proposal",
      "negotiation",
      "closed_won",
      "closed_lost",
    ])
    .default("prospecting"),
  status: z.enum(["open", "closed", "on_hold", "cancelled"]).default("open"),
  source: z
    .enum([
      "website",
      "referral",
      "cold_call",
      "trade_show",
      "social_media",
      "advertising",
      "other",
    ])
    .optional(),
  probability: z.enum(["10", "25", "50", "75", "90"]).default("10"),
  amount: z.string().optional(),
  closeDate: z.string().optional(),
  nextSteps: z.string().max(1000, "Next steps too long").optional(),
  safetyRequirements: z
    .string()
    .max(1000, "Safety requirements too long")
    .optional(),
  complianceNotes: z.string().max(1000, "Compliance notes too long").optional(),
  notes: z.string().max(2000, "Notes too long").optional(),
  accountId: z.string().uuid("Invalid account ID"),
  contactId: z.string().uuid("Invalid contact ID").optional(),
  ownerId: z.string().uuid("Invalid owner ID"),
});

// Product form schemas
export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name too long"),
  description: z.string().max(2000, "Description too long").optional(),
  category: z.enum([
    "safety_equipment",
    "training_material",
    "consulting_service",
    "maintenance_service",
    "compliance_tool",
    "software",
    "other",
  ]),
  sku: z.string().max(50, "SKU too long").optional(),
  price: z.string().optional(),
  cost: z.string().optional(),
  status: z
    .enum(["active", "inactive", "discontinued", "coming_soon"])
    .default("active"),
  isService: z.boolean().default(false),
  territoryId: z.string().uuid("Invalid territory ID"),
});

// Project form schemas
export const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(200, "Project name too long"),
  description: z.string().max(2000, "Description too long").optional(),
  status: z
    .enum(["planning", "in_progress", "on_hold", "completed", "cancelled"])
    .default("planning"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
  safetyRequirements: z
    .string()
    .max(1000, "Safety requirements too long")
    .optional(),
  complianceNotes: z.string().max(1000, "Compliance notes too long").optional(),
  notes: z.string().max(2000, "Notes too long").optional(),
  accountId: z.string().uuid("Invalid account ID"),
  branchId: z.string().uuid("Invalid branch ID").optional(),
  territoryId: z.string().uuid("Invalid territory ID"),
  ownerId: z.string().uuid("Invalid owner ID"),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Request types
export type CreateAccountRequest = z.infer<typeof createAccountRequestSchema>;
export type UpdateAccountRequest = z.infer<typeof updateAccountRequestSchema>;
export type DeleteAccountRequest = z.infer<typeof deleteAccountRequestSchema>;
export type GetAccountRequest = z.infer<typeof getAccountRequestSchema>;

export type CreateContactRequest = z.infer<typeof createContactRequestSchema>;
export type UpdateContactRequest = z.infer<typeof updateContactRequestSchema>;
export type DeleteContactRequest = z.infer<typeof deleteContactRequestSchema>;
export type GetContactRequest = z.infer<typeof getContactRequestSchema>;

export type CreateOpportunityRequest = z.infer<
  typeof createOpportunityRequestSchema
>;
export type UpdateOpportunityRequest = z.infer<
  typeof updateOpportunityRequestSchema
>;
export type DeleteOpportunityRequest = z.infer<
  typeof deleteOpportunityRequestSchema
>;
export type GetOpportunityRequest = z.infer<typeof getOpportunityRequestSchema>;

export type CreateBranchRequest = z.infer<typeof createBranchRequestSchema>;
export type UpdateBranchRequest = z.infer<typeof updateBranchRequestSchema>;
export type DeleteBranchRequest = z.infer<typeof deleteBranchRequestSchema>;
export type GetBranchRequest = z.infer<typeof getBranchRequestSchema>;

export type CreateProductRequest = z.infer<typeof createProductRequestSchema>;
export type UpdateProductRequest = z.infer<typeof updateProductRequestSchema>;
export type DeleteProductRequest = z.infer<typeof deleteProductRequestSchema>;
export type GetProductRequest = z.infer<typeof getProductRequestSchema>;

export type CreateProjectRequest = z.infer<typeof createProjectRequestSchema>;
export type UpdateProjectRequest = z.infer<typeof updateProjectRequestSchema>;
export type DeleteProjectRequest = z.infer<typeof deleteProjectRequestSchema>;
export type GetProjectRequest = z.infer<typeof getProjectRequestSchema>;

export type CreateSalesFactRequest = z.infer<
  typeof createSalesFactRequestSchema
>;
export type UpdateSalesFactRequest = z.infer<
  typeof updateSalesFactRequestSchema
>;
export type DeleteSalesFactRequest = z.infer<
  typeof deleteSalesFactRequestSchema
>;
export type GetSalesFactRequest = z.infer<typeof getSalesFactRequestSchema>;

export type CreateActivityLogRequest = z.infer<
  typeof createActivityLogRequestSchema
>;
export type UpdateActivityLogRequest = z.infer<
  typeof updateActivityLogRequestSchema
>;
export type DeleteActivityLogRequest = z.infer<
  typeof deleteActivityLogRequestSchema
>;
export type GetActivityLogRequest = z.infer<typeof getActivityLogRequestSchema>;

export type CreateTerritoryRequest = z.infer<
  typeof createTerritoryRequestSchema
>;
export type UpdateTerritoryRequest = z.infer<
  typeof updateTerritoryRequestSchema
>;
export type DeleteTerritoryRequest = z.infer<
  typeof deleteTerritoryRequestSchema
>;
export type GetTerritoryRequest = z.infer<typeof getTerritoryRequestSchema>;

// List request types
export type ListAccountsRequest = z.infer<typeof listAccountsRequestSchema>;
export type ListContactsRequest = z.infer<typeof listContactsRequestSchema>;
export type ListOpportunitiesRequest = z.infer<
  typeof listOpportunitiesRequestSchema
>;
export type ListBranchesRequest = z.infer<typeof listProductsRequestSchema>;
export type ListProductsRequest = z.infer<typeof listProductsRequestSchema>;
export type ListProjectsRequest = z.infer<typeof listProjectsRequestSchema>;
export type ListSalesFactsRequest = z.infer<typeof listSalesFactsRequestSchema>;
export type ListActivityLogsRequest = z.infer<
  typeof listActivityLogsRequestSchema
>;

// Search request types
export type SearchAccountsRequest = z.infer<typeof searchAccountsRequestSchema>;
export type SearchContactsRequest = z.infer<typeof searchContactsRequestSchema>;
export type SearchOpportunitiesRequest = z.infer<
  typeof searchOpportunitiesRequestSchema
>;
export type SearchProductsRequest = z.infer<typeof searchProductsRequestSchema>;
export type SearchProjectsRequest = z.infer<typeof searchProjectsRequestSchema>;

// Response types
export type AccountResponse = z.infer<typeof accountResponseSchema>;
export type ContactResponse = z.infer<typeof contactResponseSchema>;
export type OpportunityResponse = z.infer<typeof opportunityResponseSchema>;
export type BranchResponse = z.infer<typeof branchResponseSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type SalesFactResponse = z.infer<typeof salesFactResponseSchema>;
export type ActivityLogResponse = z.infer<typeof activityLogResponseSchema>;
export type TerritoryResponse = z.infer<typeof territoryResponseSchema>;

// Paginated response types
export type PaginatedAccountsResponse = z.infer<
  typeof paginatedAccountsResponseSchema
>;
export type PaginatedContactsResponse = z.infer<
  typeof paginatedContactsResponseSchema
>;
export type PaginatedOpportunitiesResponse = z.infer<
  typeof paginatedOpportunitiesResponseSchema
>;
export type PaginatedBranchesResponse = z.infer<
  typeof paginatedBranchesResponseSchema
>;
export type PaginatedProductsResponse = z.infer<
  typeof paginatedProductsResponseSchema
>;
export type PaginatedProjectsResponse = z.infer<
  typeof paginatedProjectsResponseSchema
>;
export type PaginatedSalesFactsResponse = z.infer<
  typeof paginatedSalesFactsResponseSchema
>;
export type PaginatedActivityLogsResponse = z.infer<
  typeof paginatedActivityLogsResponseSchema
>;
export type PaginatedTerritoriesResponse = z.infer<
  typeof paginatedTerritoriesResponseSchema
>;

// Error response types
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Form types
export type AccountForm = z.infer<typeof accountFormSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type OpportunityForm = z.infer<typeof opportunityFormSchema>;
export type ProductForm = z.infer<typeof productFormSchema>;
export type ProjectForm = z.infer<typeof projectFormSchema>;
