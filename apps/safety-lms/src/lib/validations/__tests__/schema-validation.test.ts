import { describe, it, expect } from "vitest";
import {
  // Safety Training schemas
  plantSchema,
  userProfileSchema,
  courseSchema,
  enrollmentSchema,
  progressSchema,
  activityEventSchema,
  questionEventSchema,
  adminRoleSchema,

  // Safety Business schemas
  territorySchema,
  accountSchema,
  contactSchema,
  opportunitySchema,
  branchSchema,
  productSchema,
  projectSchema,
  salesFactSchema,
  activityLogSchema,

  // API schemas
  accountResponseSchema,
  contactResponseSchema,
  opportunityResponseSchema,
  paginatedAccountsResponseSchema,

  // Form schemas
  accountFormSchema,
  contactFormSchema,
  opportunityFormSchema,

  // Integration schemas
  safetyTrainingUserContextSchema,
  safetyBusinessUserContextSchema,
  fullUserContextSchema,
  unifiedSuccessResponseSchema,

  // Utility schemas
  validationUtils,
  validationMessages,
  validationErrorCodes,
} from "../index";

// =============================================================================
// TEST FIXTURES
// =============================================================================

const testPlant = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Test Manufacturing Plant",
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

const testTerritory = {
  id: "123e4567-e89b-12d3-a456-426614174001",
  name: "North America",
  region: "Americas",
  description: "North American territory",
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

const testUserProfile = {
  id: "123e4567-e89b-12d3-a456-426614174002",
  authUserId: "123e4567-e89b-12d3-a456-426614174003",
  plantId: testPlant.id,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1-555-123-4567",
  jobTitle: "Safety Manager",
  department: "Safety",
  role: "safety_manager",
  status: "active",
  isActive: true,
  lastLoginAt: "2024-01-01T12:00:00.000Z",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  createdBy: "123e4567-e89b-12d3-a456-426614174004",
};

const testAccount = {
  id: "123e4567-e89b-12d3-a456-426614174005",
  territoryId: testTerritory.id,
  ownerId: testUserProfile.id,
  name: "ABC Manufacturing Corp",
  accountNumber: "ACC-001",
  type: "safety_equipment_customer",
  status: "active",
  industry: "manufacturing",
  website: "https://abcmanufacturing.com",
  phone: "+1-555-987-6543",
  email: "contact@abcmanufacturing.com",
  description: "Leading manufacturer of automotive parts",
  annualRevenue: "5000000.00",
  employeeCount: "201-500",
  safetyComplianceLevel: "OSHA Compliant",
  billingAddress: "123 Industrial Blvd, Detroit, MI 48201",
  shippingAddress: "123 Industrial Blvd, Detroit, MI 48201",
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  createdBy: testUserProfile.id,
};

const testContact = {
  id: "123e4567-e89b-12d3-a456-426614174006",
  accountId: testAccount.id,
  ownerId: testUserProfile.id,
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@abcmanufacturing.com",
  phone: "+1-555-987-6544",
  mobile: "+1-555-987-6545",
  jobTitle: "Safety Director",
  department: "Safety",
  role: "decision_maker",
  status: "active",
  isPrimary: true,
  safetyCertifications: "OSHA 30, CSP",
  notes: "Primary safety contact for all equipment purchases",
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  createdBy: testUserProfile.id,
};

const testOpportunity = {
  id: "123e4567-e89b-12d3-a456-426614174007",
  accountId: testAccount.id,
  contactId: testContact.id,
  ownerId: testUserProfile.id,
  name: "Safety Equipment Upgrade Project",
  description: "Upgrade all safety equipment across 3 facilities",
  type: "safety_equipment_sale",
  stage: "proposal",
  status: "open",
  source: "referral",
  probability: "75",
  amount: "250000.00",
  closeDate: "2024-06-30T00:00:00.000Z",
  nextSteps: "Prepare detailed proposal with pricing",
  safetyRequirements: "OSHA compliant equipment for manufacturing",
  complianceNotes: "Must meet current OSHA standards",
  notes: "High priority project for Q2",
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  createdBy: testUserProfile.id,
};

const testCourse = {
  id: "123e4567-e89b-12d3-a456-426614174008",
  plantId: testPlant.id,
  name: "OSHA 30-Hour Construction Safety",
  description: "Comprehensive construction safety training",
  type: "safety_training",
  status: "active",
  difficultyLevel: "intermediate",
  duration: 1800, // 30 hours in minutes
  isRequired: true,
  completionCriteria: "Pass final exam with 80% or higher",
  prerequisites: "Basic safety awareness",
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

// =============================================================================
// SAFETY TRAINING SCHEMA TESTS
// =============================================================================

describe("Safety Training Schema Validation", () => {
  describe("Plant Schema", () => {
    it("should validate a valid plant", () => {
      const result = plantSchema.safeParse(testPlant);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Test Manufacturing Plant");
        expect(result.data.isActive).toBe(true);
      }
    });

    it("should reject plant with invalid UUID", () => {
      const invalidPlant = { ...testPlant, id: "invalid-uuid" };
      const result = plantSchema.safeParse(invalidPlant);
      expect(result.success).toBe(false);
    });

    it("should reject plant with missing name", () => {
      const invalidPlant = { ...testPlant, name: "" };
      const result = plantSchema.safeParse(invalidPlant);
      expect(result.success).toBe(false);
    });
  });

  describe("User Profile Schema", () => {
    it("should validate a valid user profile", () => {
      const result = userProfileSchema.safeParse(testUserProfile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("john.doe@example.com");
        expect(result.data.role).toBe("safety_manager");
      }
    });

    it("should reject user profile with invalid email", () => {
      const invalidProfile = { ...testUserProfile, email: "invalid-email" };
      const result = userProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });

    it("should reject user profile with invalid role", () => {
      const invalidProfile = { ...testUserProfile, role: "invalid_role" };
      const result = userProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });
  });

  describe("Course Schema", () => {
    it("should validate a valid course", () => {
      const result = courseSchema.safeParse(testCourse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("OSHA 30-Hour Construction Safety");
        expect(result.data.type).toBe("safety_training");
        expect(result.data.isRequired).toBe(true);
      }
    });

    it("should reject course with invalid duration", () => {
      const invalidCourse = { ...testCourse, duration: -1 };
      const result = courseSchema.safeParse(invalidCourse);
      expect(result.success).toBe(false);
    });
  });
});

// =============================================================================
// SAFETY BUSINESS SCHEMA TESTS
// =============================================================================

describe("Safety Business Schema Validation", () => {
  describe("Territory Schema", () => {
    it("should validate a valid territory", () => {
      const result = territorySchema.safeParse(testTerritory);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("North America");
        expect(result.data.region).toBe("Americas");
      }
    });

    it("should reject territory with missing name", () => {
      const invalidTerritory = { ...testTerritory, name: "" };
      const result = territorySchema.safeParse(invalidTerritory);
      expect(result.success).toBe(false);
    });
  });

  describe("Account Schema", () => {
    it("should validate a valid account", () => {
      const result = accountSchema.safeParse(testAccount);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("ABC Manufacturing Corp");
        expect(result.data.type).toBe("safety_equipment_customer");
        expect(result.data.industry).toBe("manufacturing");
      }
    });

    it("should reject account with invalid website URL", () => {
      const invalidAccount = { ...testAccount, website: "invalid-url" };
      const result = accountSchema.safeParse(invalidAccount);
      expect(result.success).toBe(false);
    });

    it("should reject account with invalid industry", () => {
      const invalidAccount = { ...testAccount, industry: "invalid_industry" };
      const result = accountSchema.safeParse(invalidAccount);
      expect(result.success).toBe(false);
    });
  });

  describe("Contact Schema", () => {
    it("should validate a valid contact", () => {
      const result = contactSchema.safeParse(testContact);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("Jane");
        expect(result.data.lastName).toBe("Smith");
        expect(result.data.isPrimary).toBe(true);
      }
    });

    it("should reject contact with invalid email", () => {
      const invalidContact = { ...testContact, email: "invalid-email" };
      const result = contactSchema.safeParse(invalidContact);
      expect(result.success).toBe(false);
    });
  });

  describe("Opportunity Schema", () => {
    it("should validate a valid opportunity", () => {
      const result = opportunitySchema.safeParse(testOpportunity);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Safety Equipment Upgrade Project");
        expect(result.data.stage).toBe("proposal");
        expect(result.data.probability).toBe("75");
      }
    });

    it("should reject opportunity with invalid stage", () => {
      const invalidOpportunity = { ...testOpportunity, stage: "invalid_stage" };
      const result = opportunitySchema.safeParse(invalidOpportunity);
      expect(result.success).toBe(false);
    });

    it("should reject opportunity with invalid probability", () => {
      const invalidOpportunity = { ...testOpportunity, probability: "95" };
      const result = opportunitySchema.safeParse(invalidOpportunity);
      expect(result.success).toBe(false);
    });
  });
});

// =============================================================================
// API SCHEMA TESTS
// =============================================================================

describe("API Schema Validation", () => {
  describe("Response Schemas", () => {
    it("should validate account response", () => {
      const accountResponse = {
        success: true,
        data: testAccount,
        message: "Account retrieved successfully",
        timestamp: "2024-01-01T00:00:00.000Z",
      };
      const result = accountResponseSchema.safeParse(accountResponse);
      expect(result.success).toBe(true);
    });

    it("should validate contact response", () => {
      const contactResponse = {
        success: true,
        data: testContact,
        message: "Contact retrieved successfully",
        timestamp: "2024-01-01T00:00:00.000Z",
      };
      const result = contactResponseSchema.safeParse(contactResponse);
      expect(result.success).toBe(true);
    });

    it("should validate opportunity response", () => {
      const opportunityResponse = {
        success: true,
        data: testOpportunity,
        message: "Opportunity retrieved successfully",
        timestamp: "2024-01-01T00:00:00.000Z",
      };
      const result = opportunityResponseSchema.safeParse(opportunityResponse);
      expect(result.success).toBe(true);
    });

    it("should validate paginated accounts response", () => {
      const paginatedResponse = {
        success: true,
        data: [testAccount],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        message: "Accounts retrieved successfully",
        timestamp: "2024-01-01T00:00:00.000Z",
      };
      const result =
        paginatedAccountsResponseSchema.safeParse(paginatedResponse);
      expect(result.success).toBe(true);
    });
  });
});

// =============================================================================
// FORM SCHEMA TESTS
// =============================================================================

describe("Form Schema Validation", () => {
  describe("Account Form", () => {
    it("should validate account form data", () => {
      const accountForm = {
        name: "Test Account",
        type: "safety_equipment_customer",
        status: "active",
        industry: "manufacturing",
        website: "https://test.com",
        email: "test@test.com",
        territoryId: testTerritory.id,
        ownerId: testUserProfile.id,
      };
      const result = accountFormSchema.safeParse(accountForm);
      expect(result.success).toBe(true);
    });

    it("should reject account form with empty name", () => {
      const invalidForm = {
        name: "",
        type: "safety_equipment_customer",
        territoryId: testTerritory.id,
        ownerId: testUserProfile.id,
      };
      const result = accountFormSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
    });
  });

  describe("Contact Form", () => {
    it("should validate contact form data", () => {
      const contactForm = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        accountId: testAccount.id,
        ownerId: testUserProfile.id,
      };
      const result = contactFormSchema.safeParse(contactForm);
      expect(result.success).toBe(true);
    });

    it("should reject contact form with invalid email", () => {
      const invalidForm = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        accountId: testAccount.id,
        ownerId: testUserProfile.id,
      };
      const result = contactFormSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
    });
  });

  describe("Opportunity Form", () => {
    it("should validate opportunity form data", () => {
      const opportunityForm = {
        name: "Test Opportunity",
        type: "safety_equipment_sale",
        stage: "prospecting",
        accountId: testAccount.id,
        ownerId: testUserProfile.id,
      };
      const result = opportunityFormSchema.safeParse(opportunityForm);
      expect(result.success).toBe(true);
    });
  });
});

// =============================================================================
// INTEGRATION SCHEMA TESTS
// =============================================================================

describe("Integration Schema Validation", () => {
  describe("User Context Schemas", () => {
    it("should validate safety training user context", () => {
      const trainingContext = {
        id: testUserProfile.id,
        email: testUserProfile.email,
        firstName: testUserProfile.firstName,
        lastName: testUserProfile.lastName,
        role: testUserProfile.role,
        plantId: testPlant.id,
        plant: testPlant,
        permissions: {
          canManageAllPlants: false,
          canManageUsers: true,
          canManageCourses: true,
          canViewAllData: false,
          canManageAdminRoles: false,
        },
      };
      const result = safetyTrainingUserContextSchema.safeParse(trainingContext);
      expect(result.success).toBe(true);
    });

    it("should validate safety business user context", () => {
      const businessContext = {
        id: testUserProfile.id,
        email: testUserProfile.email,
        firstName: testUserProfile.firstName,
        lastName: testUserProfile.lastName,
        role: "sales_manager",
        territoryId: testTerritory.id,
        territory: testTerritory,
        permissions: {
          canManageAllTerritories: false,
          canManageAllAccounts: true,
          canManageAllOpportunities: true,
          canViewAllSales: true,
          canManageAllUsers: false,
          canViewAllReports: true,
        },
      };
      const result = safetyBusinessUserContextSchema.safeParse(businessContext);
      expect(result.success).toBe(true);
    });

    it("should validate full user context", () => {
      const fullContext = {
        id: testUserProfile.id,
        email: testUserProfile.email,
        firstName: testUserProfile.firstName,
        lastName: testUserProfile.lastName,
        role: "safety_admin",
        plantId: testPlant.id,
        plant: testPlant,
        trainingProfile: testUserProfile,
        trainingPermissions: {
          canManageAllPlants: true,
          canManageUsers: true,
          canManageCourses: true,
          canViewAllData: true,
          canManageAdminRoles: true,
        },
        territoryId: testTerritory.id,
        territory: testTerritory,
        businessPermissions: {
          canManageAllTerritories: true,
          canManageAllAccounts: true,
          canManageAllOpportunities: true,
          canViewAllSales: true,
          canManageAllUsers: true,
          canViewAllReports: true,
        },
      };
      const result = fullUserContextSchema.safeParse(fullContext);
      expect(result.success).toBe(true);
    });
  });

  describe("Unified Response Schemas", () => {
    it("should validate unified success response", () => {
      const unifiedResponse = {
        success: true,
        data: testAccount,
        context: {
          user: {
            id: testUserProfile.id,
            email: testUserProfile.email,
            firstName: testUserProfile.firstName,
            lastName: testUserProfile.lastName,
            role: "safety_admin",
            plantId: testPlant.id,
            plant: testPlant,
            trainingProfile: testUserProfile,
            trainingPermissions: {
              canManageAllPlants: true,
              canManageUsers: true,
              canManageCourses: true,
              canViewAllData: true,
              canManageAdminRoles: true,
            },
            territoryId: testTerritory.id,
            territory: testTerritory,
            businessPermissions: {
              canManageAllTerritories: true,
              canManageAllAccounts: true,
              canManageAllOpportunities: true,
              canViewAllSales: true,
              canManageAllUsers: true,
              canViewAllReports: true,
            },
          },
          plant: testPlant,
          territory: testTerritory,
        },
        message: "Operation successful",
        timestamp: "2024-01-01T00:00:00.000Z",
      };
      const result =
        unifiedSuccessResponseSchema(accountSchema).safeParse(unifiedResponse);
      expect(result.success).toBe(true);
    });
  });
});

// =============================================================================
// VALIDATION UTILITIES TESTS
// =============================================================================

describe("Validation Utilities", () => {
  describe("validationUtils", () => {
    it("should validate UUIDs correctly", () => {
      expect(validationUtils.isValidUUID(testAccount.id)).toBe(true);
      expect(validationUtils.isValidUUID("invalid-uuid")).toBe(false);
      expect(validationUtils.isValidUUID("")).toBe(false);
    });

    it("should validate emails correctly", () => {
      expect(validationUtils.isValidEmail("test@example.com")).toBe(true);
      expect(validationUtils.isValidEmail("invalid-email")).toBe(false);
      expect(validationUtils.isValidEmail("")).toBe(false);
    });

    it("should validate phone numbers correctly", () => {
      expect(validationUtils.isValidPhone("+1-555-123-4567")).toBe(true);
      expect(validationUtils.isValidPhone("555-123-4567")).toBe(true);
      expect(validationUtils.isValidPhone("invalid-phone")).toBe(false);
    });

    it("should validate URLs correctly", () => {
      expect(validationUtils.isValidURL("https://example.com")).toBe(true);
      expect(validationUtils.isValidURL("http://example.com")).toBe(true);
      expect(validationUtils.isValidURL("invalid-url")).toBe(false);
    });

    it("should validate ISO dates correctly", () => {
      expect(validationUtils.isValidISODate("2024-01-01T00:00:00.000Z")).toBe(
        true
      );
      expect(validationUtils.isValidISODate("2024-01-01")).toBe(false);
      expect(validationUtils.isValidISODate("invalid-date")).toBe(false);
    });

    it("should validate positive numbers correctly", () => {
      expect(validationUtils.isPositiveNumber(5)).toBe(true);
      expect(validationUtils.isPositiveNumber(0)).toBe(true);
      expect(validationUtils.isPositiveNumber(-1)).toBe(false);
    });

    it("should validate number ranges correctly", () => {
      expect(validationUtils.isNumberInRange(5, 1, 10)).toBe(true);
      expect(validationUtils.isNumberInRange(0, 1, 10)).toBe(false);
      expect(validationUtils.isNumberInRange(15, 1, 10)).toBe(false);
    });
  });

  describe("validationMessages", () => {
    it("should have all required validation messages", () => {
      expect(validationMessages.REQUIRED_FIELD).toBe("This field is required");
      expect(validationMessages.INVALID_EMAIL).toBe("Invalid email address");
      expect(validationMessages.ACCESS_DENIED).toBe("Access denied");
      expect(validationMessages.NOT_FOUND).toBe("Resource not found");
    });
  });

  describe("validationErrorCodes", () => {
    it("should have all required error codes", () => {
      expect(validationErrorCodes.REQUIRED).toBe("REQUIRED");
      expect(validationErrorCodes.INVALID_FORMAT).toBe("INVALID_FORMAT");
      expect(validationErrorCodes.ACCESS_DENIED).toBe("ACCESS_DENIED");
      expect(validationErrorCodes.NOT_FOUND).toBe("NOT_FOUND");
    });
  });
});
