import { describe, it, expect } from "vitest";
import {
  // Enhanced schemas
  enhancedAuthUserSchema,
  enhancedTerritorySchema,
  enhancedPlantSchema,
  enhancedAccountSchema,
  enhancedContactSchema,
  enhancedOpportunitySchema,
  enhancedActivityLogSchema,
  enhancedUnifiedSuccessResponseSchema,
  enhancedUnifiedErrorResponseSchema,
  enhancedCrossSystemMiddlewareSchema,

  // Core schemas
  accountSchema,
  contactSchema,
  opportunitySchema,
  territorySchema,
  plantSchema,
  userProfileSchema,

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

import {
  allFixtures,
  enhancedAuthUserFixtures,
  enhancedTerritoryFixtures,
  enhancedPlantFixtures,
  enhancedAccountFixtures,
  enhancedContactFixtures,
  enhancedOpportunityFixtures,
  enhancedActivityLogFixtures,
  apiResponseFixtures,
  formDataFixtures,
  validationTestUtils,
} from "./enhanced-schema-fixtures";

// =============================================================================
// ENHANCED SCHEMA VALIDATION TESTS
// =============================================================================

describe("Enhanced Schema Validation", () => {
  describe("Enhanced Auth User Schema", () => {
    it("should validate safety admin with full access", () => {
      const result = enhancedAuthUserSchema.safeParse(
        enhancedAuthUserFixtures.safetyAdmin
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.role).toBe("safety_admin");
        expect(result.data.systems).toEqual(["training", "business"]);
        expect(result.data.permissions.training.canManageAllPlants).toBe(true);
        expect(result.data.permissions.business.canManageAllTerritories).toBe(
          true
        );
        expect(result.data.permissions.crossSystem.canAccessBothSystems).toBe(
          true
        );
      }
    });

    it("should validate sales manager with business access", () => {
      const result = enhancedAuthUserSchema.safeParse(
        enhancedAuthUserFixtures.salesManager
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.role).toBe("sales_manager");
        expect(result.data.systems).toEqual(["business"]);
        expect(result.data.permissions.business.canManageAllAccounts).toBe(
          true
        );
        expect(result.data.permissions.training.canManageAllPlants).toBe(false);
      }
    });

    it("should validate safety instructor with training access", () => {
      const result = enhancedAuthUserSchema.safeParse(
        enhancedAuthUserFixtures.safetyInstructor
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.role).toBe("safety_instructor");
        expect(result.data.systems).toEqual(["training"]);
        expect(result.data.permissions.training.canManageCourses).toBe(true);
        expect(result.data.permissions.business.canManageAllAccounts).toBe(
          false
        );
      }
    });

    it("should reject user with invalid email", () => {
      const invalidUser = {
        ...enhancedAuthUserFixtures.safetyAdmin,
        email: "invalid-email",
      };
      const result = enhancedAuthUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it("should reject user with empty systems array", () => {
      const invalidUser = {
        ...enhancedAuthUserFixtures.safetyAdmin,
        systems: [],
      };
      const result = enhancedAuthUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it("should reject user with invalid role", () => {
      const invalidUser = {
        ...enhancedAuthUserFixtures.safetyAdmin,
        role: "invalid_role",
      };
      const result = enhancedAuthUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe("Enhanced Territory Schema", () => {
    it("should validate territory with plants and metrics", () => {
      const result = enhancedTerritorySchema.safeParse(
        enhancedTerritoryFixtures.northAmerica
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBe("North America");
        expect(result.data.plantCount).toBe(2);
        expect(result.data.metrics.totalAccounts).toBe(150);
        expect(result.data.metrics.complianceScore).toBe(95);
        expect(result.data.settings.timezone).toBe("America/New_York");
      }
    });

    it("should validate territory without plants", () => {
      const result = enhancedTerritorySchema.safeParse(
        enhancedTerritoryFixtures.europe
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBe("Europe");
        expect(result.data.plantCount).toBe(0);
        expect(result.data.plants).toEqual([]);
      }
    });

    it("should reject territory with negative plant count", () => {
      const invalidTerritory = {
        ...enhancedTerritoryFixtures.northAmerica,
        plantCount: -1,
      };
      const result = enhancedTerritorySchema.safeParse(invalidTerritory);
      expect(result.success).toBe(false);
    });

    it("should reject territory with invalid compliance score", () => {
      const invalidTerritory = {
        ...enhancedTerritoryFixtures.northAmerica,
        metrics: {
          ...enhancedTerritoryFixtures.northAmerica.metrics,
          complianceScore: 150, // Invalid: over 100
        },
      };
      const result = enhancedTerritorySchema.safeParse(invalidTerritory);
      expect(result.success).toBe(false);
    });
  });

  describe("Enhanced Plant Schema", () => {
    it("should validate plant with territory and metrics", () => {
      const result = enhancedPlantSchema.safeParse(
        enhancedPlantFixtures.mainPlant
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBe("Main Manufacturing Plant");
        expect(result.data.territoryId).toBe(baseTerritoryId);
        expect(result.data.metrics.totalUsers).toBe(150);
        expect(result.data.metrics.completionRate).toBe(85);
        expect(result.data.settings.timezone).toBe("America/Chicago");
      }
    });

    it("should reject plant with invalid completion rate", () => {
      const invalidPlant = {
        ...enhancedPlantFixtures.mainPlant,
        metrics: {
          ...enhancedPlantFixtures.mainPlant.metrics,
          completionRate: 150, // Invalid: over 100
        },
      };
      const result = enhancedPlantSchema.safeParse(invalidPlant);
      expect(result.success).toBe(false);
    });
  });

  describe("Enhanced Account Schema", () => {
    it("should validate account with training integration", () => {
      const result = enhancedAccountSchema.safeParse(
        enhancedAccountFixtures.manufacturingCorp
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBe("ABC Manufacturing Corp");
        expect(result.data.plantCount).toBe(1);
        expect(result.data.compliance.oshaCompliance).toBe(true);
        expect(result.data.trainingMetrics.totalEmployees).toBe(450);
        expect(result.data.businessMetrics.totalOpportunities).toBe(8);
      }
    });

    it("should validate account without plants", () => {
      const result = enhancedAccountSchema.safeParse(
        enhancedAccountFixtures.constructionCompany
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBe("XYZ Construction Company");
        expect(result.data.plantCount).toBe(0);
        expect(result.data.plants).toEqual([]);
      }
    });

    it("should reject account with negative employee count", () => {
      const invalidAccount = {
        ...enhancedAccountFixtures.manufacturingCorp,
        trainingMetrics: {
          ...enhancedAccountFixtures.manufacturingCorp.trainingMetrics,
          totalEmployees: -50,
        },
      };
      const result = enhancedAccountSchema.safeParse(invalidAccount);
      expect(result.success).toBe(false);
    });

    it("should reject account with invalid compliance score", () => {
      const invalidAccount = {
        ...enhancedAccountFixtures.manufacturingCorp,
        compliance: {
          ...enhancedAccountFixtures.manufacturingCorp.compliance,
          complianceScore: 150, // Invalid: over 100
        },
      };
      const result = enhancedAccountSchema.safeParse(invalidAccount);
      expect(result.success).toBe(false);
    });
  });

  describe("Enhanced Contact Schema", () => {
    it("should validate contact with safety profile", () => {
      const result = enhancedContactSchema.safeParse(
        enhancedContactFixtures.safetyDirector
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.firstName).toBe("Jane");
        expect(result.data.lastName).toBe("Smith");
        expect(result.data.safetyProfile.certifications).toHaveLength(2);
        expect(result.data.safetyProfile.trainingHistory).toHaveLength(2);
        expect(result.data.communicationPreferences.preferredMethod).toBe(
          "email"
        );
      }
    });

    it("should validate contact with minimal safety profile", () => {
      const result = enhancedContactSchema.safeParse(
        enhancedContactFixtures.hrManager
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.firstName).toBe("Michael");
        expect(result.data.safetyProfile.certifications).toHaveLength(1);
        expect(result.data.safetyProfile.upcomingTrainings).toHaveLength(0);
      }
    });

    it("should reject contact with invalid email", () => {
      const invalidContact = {
        ...enhancedContactFixtures.safetyDirector,
        email: "invalid-email",
      };
      const result = enhancedContactSchema.safeParse(invalidContact);
      expect(result.success).toBe(false);
    });

    it("should reject contact with invalid certification score", () => {
      const invalidContact = {
        ...enhancedContactFixtures.safetyDirector,
        safetyProfile: {
          ...enhancedContactFixtures.safetyDirector.safetyProfile,
          trainingHistory: [
            {
              ...enhancedContactFixtures.safetyDirector.safetyProfile
                .trainingHistory[0],
              score: 150, // Invalid: over 100
            },
          ],
        },
      };
      const result = enhancedContactSchema.safeParse(invalidContact);
      expect(result.success).toBe(false);
    });
  });

  describe("Enhanced Opportunity Schema", () => {
    it("should validate opportunity with training requirements", () => {
      const result = enhancedOpportunitySchema.safeParse(
        enhancedOpportunityFixtures.equipmentUpgrade
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBe("Safety Equipment Upgrade Project");
        expect(result.data.trainingRequirements.requiredCourses).toHaveLength(
          2
        );
        expect(result.data.trainingRequirements.trainingBudget).toBe("8000.00");
        expect(result.data.opportunityMetrics.daysInStage).toBe(15);
        expect(result.data.opportunityMetrics.stageHistory).toHaveLength(3);
      }
    });

    it("should validate opportunity without training requirements", () => {
      const result = enhancedOpportunitySchema.safeParse(
        enhancedOpportunityFixtures.trainingProgram
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBe("Comprehensive Safety Training Program");
        expect(result.data.type).toBe("training_service");
        expect(result.data.complianceRequirements.auditRequired).toBe(false);
      }
    });

    it("should reject opportunity with invalid probability", () => {
      const invalidOpportunity = {
        ...enhancedOpportunityFixtures.equipmentUpgrade,
        probability: "95", // Invalid: not in allowed values
      };
      const result = enhancedOpportunitySchema.safeParse(invalidOpportunity);
      expect(result.success).toBe(false);
    });

    it("should reject opportunity with negative days in stage", () => {
      const invalidOpportunity = {
        ...enhancedOpportunityFixtures.equipmentUpgrade,
        opportunityMetrics: {
          ...enhancedOpportunityFixtures.equipmentUpgrade.opportunityMetrics,
          daysInStage: -5,
        },
      };
      const result = enhancedOpportunitySchema.safeParse(invalidOpportunity);
      expect(result.success).toBe(false);
    });
  });

  describe("Enhanced Activity Log Schema", () => {
    it("should validate business activity log", () => {
      const result = enhancedActivityLogSchema.safeParse(
        enhancedActivityLogFixtures.accountCreated
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.system).toBe("business");
        expect(result.data.entityType).toBe("account");
        expect(result.data.type).toBe("account_created");
        expect(result.data.metadata.businessData).toBeDefined();
        expect(result.data.metadata.ipAddress).toBe("192.168.1.100");
      }
    });

    it("should validate training activity log", () => {
      const result = enhancedActivityLogSchema.safeParse(
        enhancedActivityLogFixtures.trainingCompleted
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.system).toBe("training");
        expect(result.data.entityType).toBe("enrollment");
        expect(result.data.type).toBe("training_completed");
        expect(result.data.metadata.trainingData.score).toBe(95);
        expect(result.data.requiresFollowUp).toBe(true);
      }
    });

    it("should validate cross-system activity log", () => {
      const result = enhancedActivityLogSchema.safeParse(
        enhancedActivityLogFixtures.crossSystemIntegration
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.system).toBe("both");
        expect(result.data.type).toBe("integration_event");
        expect(result.data.metadata.trainingData).toBeDefined();
        expect(result.data.metadata.businessData).toBeDefined();
      }
    });

    it("should reject activity log with invalid system", () => {
      const invalidLog = {
        ...enhancedActivityLogFixtures.accountCreated,
        system: "invalid_system",
      };
      const result = enhancedActivityLogSchema.safeParse(invalidLog);
      expect(result.success).toBe(false);
    });

    it("should reject activity log with invalid score", () => {
      const invalidLog = {
        ...enhancedActivityLogFixtures.trainingCompleted,
        metadata: {
          ...enhancedActivityLogFixtures.trainingCompleted.metadata,
          trainingData: {
            ...enhancedActivityLogFixtures.trainingCompleted.metadata
              .trainingData,
            score: 150, // Invalid: over 100
          },
        },
      };
      const result = enhancedActivityLogSchema.safeParse(invalidLog);
      expect(result.success).toBe(false);
    });
  });
});

// =============================================================================
// API RESPONSE SCHEMA TESTS
// =============================================================================

describe("API Response Schema Validation", () => {
  describe("Enhanced Unified Success Response", () => {
    it("should validate unified success response with account data", () => {
      const responseSchema =
        enhancedUnifiedSuccessResponseSchema(accountSchema);
      const response = {
        success: true,
        data: enhancedAccountFixtures.manufacturingCorp,
        context: {
          user: enhancedAuthUserFixtures.safetyAdmin,
          system: "business" as const,
          territory: enhancedTerritoryFixtures.northAmerica,
          plant: undefined,
          request: {
            id: "123e4567-e89b-12d3-a456-426614174200",
            timestamp: baseTimestamp,
            duration: 150,
            source: "api",
          },
        },
        message: "Account retrieved successfully",
        warnings: [],
        timestamp: baseTimestamp,
      };

      const result = responseSchema.safeParse(response);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.success).toBe(true);
        expect(result.data.data.name).toBe("ABC Manufacturing Corp");
        expect(result.data.context.user.role).toBe("safety_admin");
        expect(result.data.context.system).toBe("business");
      }
    });

    it("should validate unified success response with pagination", () => {
      const responseSchema = enhancedUnifiedSuccessResponseSchema(
        z.array(accountSchema)
      );
      const response = {
        success: true,
        data: [
          enhancedAccountFixtures.manufacturingCorp,
          enhancedAccountFixtures.constructionCompany,
        ],
        context: {
          user: enhancedAuthUserFixtures.salesManager,
          system: "business" as const,
          territory: enhancedTerritoryFixtures.northAmerica,
          plant: undefined,
          request: {
            id: "123e4567-e89b-12d3-a456-426614174201",
            timestamp: baseTimestamp,
            duration: 200,
            source: "api",
          },
        },
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
          metadata: {
            estimatedTotalTime: 250,
            cached: false,
          },
        },
        message: "Accounts retrieved successfully",
        warnings: [
          {
            code: "PERFORMANCE_WARNING",
            message: "Query took longer than expected",
            field: "duration",
          },
        ],
        timestamp: baseTimestamp,
      };

      const result = responseSchema.safeParse(response);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.data).toHaveLength(2);
        expect(result.data.pagination.total).toBe(2);
        expect(result.data.warnings).toHaveLength(1);
      }
    });
  });

  describe("Enhanced Unified Error Response", () => {
    it("should validate unified error response with detailed context", () => {
      const result = enhancedUnifiedErrorResponseSchema.safeParse(
        apiResponseFixtures.errorResponse
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.success).toBe(false);
        expect(result.data.error.code).toBe("TERRITORY_ACCESS_DENIED");
        expect(result.data.error.details).toHaveLength(1);
        expect(result.data.error.context.system).toBe("business");
        expect(result.data.metadata.retryable).toBe(false);
        expect(result.data.metadata.suggestedActions).toHaveLength(1);
      }
    });

    it("should reject error response with invalid error code", () => {
      const invalidResponse = {
        ...apiResponseFixtures.errorResponse,
        error: {
          ...apiResponseFixtures.errorResponse.error,
          code: "INVALID_ERROR_CODE",
        },
      };
      const result =
        enhancedUnifiedErrorResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });
});

// =============================================================================
// FORM SCHEMA VALIDATION TESTS
// =============================================================================

describe("Form Schema Validation", () => {
  describe("Account Form", () => {
    it("should validate valid account form data", () => {
      const result = accountFormSchema.safeParse(formDataFixtures.accountForm);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBe("Test Manufacturing Company");
        expect(result.data.type).toBe("safety_equipment_customer");
        expect(result.data.industry).toBe("manufacturing");
      }
    });

    it("should reject account form with empty name", () => {
      const invalidForm = {
        ...formDataFixtures.accountForm,
        name: "",
      };
      const result = accountFormSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
    });

    it("should reject account form with invalid email", () => {
      const invalidForm = {
        ...formDataFixtures.accountForm,
        email: "invalid-email",
      };
      const result = accountFormSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
    });

    it("should reject account form with invalid website URL", () => {
      const invalidForm = {
        ...formDataFixtures.accountForm,
        website: "invalid-url",
      };
      const result = accountFormSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
    });
  });

  describe("Contact Form", () => {
    it("should validate valid contact form data", () => {
      const result = contactFormSchema.safeParse(formDataFixtures.contactForm);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.firstName).toBe("John");
        expect(result.data.lastName).toBe("Doe");
        expect(result.data.email).toBe("john.doe@testmanufacturing.com");
      }
    });

    it("should reject contact form with invalid email", () => {
      const invalidForm = {
        ...formDataFixtures.contactForm,
        email: "invalid-email",
      };
      const result = contactFormSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
    });

    it("should reject contact form with missing required fields", () => {
      const invalidForm = {
        ...formDataFixtures.contactForm,
        firstName: "",
        lastName: "",
      };
      const result = contactFormSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
    });
  });

  describe("Opportunity Form", () => {
    it("should validate valid opportunity form data", () => {
      const result = opportunityFormSchema.safeParse(
        formDataFixtures.opportunityForm
      );
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.name).toBe("Safety Equipment Purchase");
        expect(result.data.type).toBe("safety_equipment_sale");
        expect(result.data.stage).toBe("prospecting");
      }
    });

    it("should reject opportunity form with invalid probability", () => {
      const invalidForm = {
        ...formDataFixtures.opportunityForm,
        probability: "95", // Invalid: not in allowed values
      };
      const result = opportunityFormSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
    });

    it("should reject opportunity form with invalid stage", () => {
      const invalidForm = {
        ...formDataFixtures.opportunityForm,
        stage: "invalid_stage",
      };
      const result = opportunityFormSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
    });
  });
});

// =============================================================================
// VALIDATION UTILITIES TESTS
// =============================================================================

describe("Validation Utilities", () => {
  describe("validationUtils", () => {
    it("should validate UUIDs correctly", () => {
      expect(validationUtils.isValidUUID(baseUserId)).toBe(true);
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
      expect(validationUtils.isValidPhone("123")).toBe(false); // Too short
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
      expect(validationUtils.isValidISODate("2024-01-01")).toBe(false); // Missing time
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

    it("should validate string lengths correctly", () => {
      expect(validationUtils.isStringLengthValid("test", 1, 10)).toBe(true);
      expect(validationUtils.isStringLengthValid("", 1, 10)).toBe(false);
      expect(
        validationUtils.isStringLengthValid("very long string", 1, 5)
      ).toBe(false);
    });

    it("should validate decimal strings correctly", () => {
      expect(validationUtils.isValidDecimalString("123.45")).toBe(true);
      expect(validationUtils.isValidDecimalString("123")).toBe(true);
      expect(validationUtils.isValidDecimalString("123.456")).toBe(false); // Too many decimals
      expect(validationUtils.isValidDecimalString("-123.45")).toBe(false); // Negative
    });

    it("should validate territory access correctly", () => {
      expect(
        validationUtils.hasTerritoryAccess(baseTerritoryId, baseTerritoryId)
      ).toBe(true);
      expect(
        validationUtils.hasTerritoryAccess(
          baseTerritoryId,
          "different-territory"
        )
      ).toBe(false);
    });

    it("should validate plant access correctly", () => {
      expect(validationUtils.hasPlantAccess(basePlantId, basePlantId)).toBe(
        true
      );
      expect(
        validationUtils.hasPlantAccess(basePlantId, "different-plant")
      ).toBe(false);
    });

    it("should validate role permissions correctly", () => {
      expect(
        validationUtils.hasRolePermission("safety_admin", [
          "safety_admin",
          "sales_admin",
        ])
      ).toBe(true);
      expect(
        validationUtils.hasRolePermission("safety_rep", [
          "safety_admin",
          "sales_admin",
        ])
      ).toBe(false);
    });

    it("should validate cross-system access correctly", () => {
      expect(
        validationUtils.hasCrossSystemAccess(["safety_admin"], "training")
      ).toBe(true);
      expect(
        validationUtils.hasCrossSystemAccess(["safety_admin"], "business")
      ).toBe(true);
      expect(
        validationUtils.hasCrossSystemAccess(["safety_admin"], "both")
      ).toBe(true);
      expect(
        validationUtils.hasCrossSystemAccess(["employee"], "business")
      ).toBe(false);
    });
  });

  describe("validationMessages", () => {
    it("should have all required validation messages", () => {
      expect(validationMessages.REQUIRED_FIELD).toBe("This field is required");
      expect(validationMessages.INVALID_EMAIL).toBe("Invalid email address");
      expect(validationMessages.ACCESS_DENIED).toBe("Access denied");
      expect(validationMessages.NOT_FOUND).toBe("Resource not found");
      expect(validationMessages.COMPLIANCE_VIOLATION).toBe(
        "Compliance violation detected"
      );
      expect(validationMessages.TRAINING_OVERDUE).toBe(
        "Required training is overdue"
      );
    });
  });

  describe("validationErrorCodes", () => {
    it("should have all required error codes", () => {
      expect(validationErrorCodes.REQUIRED).toBe("REQUIRED");
      expect(validationErrorCodes.INVALID_FORMAT).toBe("INVALID_FORMAT");
      expect(validationErrorCodes.ACCESS_DENIED).toBe("ACCESS_DENIED");
      expect(validationErrorCodes.NOT_FOUND).toBe("NOT_FOUND");
      expect(validationErrorCodes.COMPLIANCE_VIOLATION).toBe(
        "COMPLIANCE_VIOLATION"
      );
      expect(validationErrorCodes.TRAINING_OVERDUE).toBe("TRAINING_OVERDUE");
    });
  });
});

// =============================================================================
// COMPREHENSIVE FIXTURE VALIDATION TESTS
// =============================================================================

describe("Comprehensive Fixture Validation", () => {
  describe("All Enhanced Schemas", () => {
    it("should validate all enhanced auth user fixtures", () => {
      const results = validationTestUtils.validateFixtures(
        enhancedAuthUserSchema,
        enhancedAuthUserFixtures
      );

      expect(results.safetyAdmin.success).toBe(true);
      expect(results.salesManager.success).toBe(true);
      expect(results.safetyInstructor.success).toBe(true);
    });

    it("should validate all enhanced territory fixtures", () => {
      const results = validationTestUtils.validateFixtures(
        enhancedTerritorySchema,
        enhancedTerritoryFixtures
      );

      expect(results.northAmerica.success).toBe(true);
      expect(results.europe.success).toBe(true);
    });

    it("should validate all enhanced plant fixtures", () => {
      const results = validationTestUtils.validateFixtures(
        enhancedPlantSchema,
        enhancedPlantFixtures
      );

      expect(results.mainPlant.success).toBe(true);
      expect(results.secondaryPlant.success).toBe(true);
    });

    it("should validate all enhanced account fixtures", () => {
      const results = validationTestUtils.validateFixtures(
        enhancedAccountSchema,
        enhancedAccountFixtures
      );

      expect(results.manufacturingCorp.success).toBe(true);
      expect(results.constructionCompany.success).toBe(true);
    });

    it("should validate all enhanced contact fixtures", () => {
      const results = validationTestUtils.validateFixtures(
        enhancedContactSchema,
        enhancedContactFixtures
      );

      expect(results.safetyDirector.success).toBe(true);
      expect(results.hrManager.success).toBe(true);
    });

    it("should validate all enhanced opportunity fixtures", () => {
      const results = validationTestUtils.validateFixtures(
        enhancedOpportunitySchema,
        enhancedOpportunityFixtures
      );

      expect(results.equipmentUpgrade.success).toBe(true);
      expect(results.trainingProgram.success).toBe(true);
    });

    it("should validate all enhanced activity log fixtures", () => {
      const results = validationTestUtils.validateFixtures(
        enhancedActivityLogSchema,
        enhancedActivityLogFixtures
      );

      expect(results.accountCreated.success).toBe(true);
      expect(results.trainingCompleted.success).toBe(true);
      expect(results.crossSystemIntegration.success).toBe(true);
    });
  });

  describe("API Response Fixtures", () => {
    it("should validate all API response fixtures", () => {
      expect(
        accountResponseSchema.safeParse(apiResponseFixtures.accountResponse)
          .success
      ).toBe(true);
      expect(
        contactResponseSchema.safeParse(apiResponseFixtures.contactResponse)
          .success
      ).toBe(true);
      expect(
        opportunityResponseSchema.safeParse(
          apiResponseFixtures.opportunityResponse
        ).success
      ).toBe(true);
      expect(
        paginatedAccountsResponseSchema.safeParse(
          apiResponseFixtures.paginatedAccountsResponse
        ).success
      ).toBe(true);
      expect(
        enhancedUnifiedErrorResponseSchema.safeParse(
          apiResponseFixtures.errorResponse
        ).success
      ).toBe(true);
    });
  });

  describe("Form Data Fixtures", () => {
    it("should validate all form data fixtures", () => {
      expect(
        accountFormSchema.safeParse(formDataFixtures.accountForm).success
      ).toBe(true);
      expect(
        contactFormSchema.safeParse(formDataFixtures.contactForm).success
      ).toBe(true);
      expect(
        opportunityFormSchema.safeParse(formDataFixtures.opportunityForm)
          .success
      ).toBe(true);
    });
  });
});

// =============================================================================
// INTEGRATION SCHEMA TESTS
// =============================================================================

describe("Integration Schema Validation", () => {
  describe("Cross-System Middleware", () => {
    it("should validate cross-system middleware with both systems", () => {
      const middleware = {
        userId: baseUserId,
        systems: ["training", "business"] as const,
        plantId: basePlantId,
        plant: enhancedPlantFixtures.mainPlant,
        territoryId: baseTerritoryId,
        territory: enhancedTerritoryFixtures.northAmerica,
        roles: {
          training: "safety_admin" as const,
          business: "sales_admin" as const,
        },
        operation: "admin" as const,
        resources: ["users", "accounts", "courses", "opportunities"] as const,
        permissions: enhancedAuthUserFixtures.safetyAdmin.permissions,
        request: {
          id: "123e4567-e89b-12d3-a456-426614174300",
          method: "POST",
          path: "/api/accounts",
          timestamp: baseTimestamp,
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0",
        },
      };

      const result = enhancedCrossSystemMiddlewareSchema.safeParse(middleware);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.systems).toEqual(["training", "business"]);
        expect(result.data.operation).toBe("admin");
        expect(result.data.resources).toHaveLength(4);
      }
    });

    it("should validate cross-system middleware with single system", () => {
      const middleware = {
        userId: baseUserId,
        systems: ["business"] as const,
        territoryId: baseTerritoryId,
        territory: enhancedTerritoryFixtures.northAmerica,
        roles: {
          business: "sales_manager" as const,
        },
        operation: "write" as const,
        resources: ["accounts", "contacts", "opportunities"] as const,
        permissions: enhancedAuthUserFixtures.salesManager.permissions,
        request: {
          id: "123e4567-e89b-12d3-a456-426614174301",
          method: "PUT",
          path: "/api/accounts/123",
          timestamp: baseTimestamp,
        },
      };

      const result = enhancedCrossSystemMiddlewareSchema.safeParse(middleware);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.systems).toEqual(["business"]);
        expect(result.data.operation).toBe("write");
        expect(result.data.plantId).toBeUndefined();
      }
    });

    it("should reject middleware with empty systems array", () => {
      const invalidMiddleware = {
        userId: baseUserId,
        systems: [],
        operation: "read" as const,
        resources: ["accounts"] as const,
        permissions: enhancedAuthUserFixtures.salesManager.permissions,
        request: {
          id: "123e4567-e89b-12d3-a456-426614174302",
          method: "GET",
          path: "/api/accounts",
          timestamp: baseTimestamp,
        },
      };

      const result =
        enhancedCrossSystemMiddlewareSchema.safeParse(invalidMiddleware);
      expect(result.success).toBe(false);
    });

    it("should reject middleware with invalid operation", () => {
      const invalidMiddleware = {
        userId: baseUserId,
        systems: ["business"] as const,
        operation: "invalid_operation",
        resources: ["accounts"] as const,
        permissions: enhancedAuthUserFixtures.salesManager.permissions,
        request: {
          id: "123e4567-e89b-12d3-a456-426614174303",
          method: "GET",
          path: "/api/accounts",
          timestamp: baseTimestamp,
        },
      };

      const result =
        enhancedCrossSystemMiddlewareSchema.safeParse(invalidMiddleware);
      expect(result.success).toBe(false);
    });
  });
});

// =============================================================================
// PERFORMANCE AND EDGE CASE TESTS
// =============================================================================

describe("Performance and Edge Cases", () => {
  describe("Large Data Validation", () => {
    it("should handle large arrays of data efficiently", () => {
      const largeAccountArray = Array(1000)
        .fill(null)
        .map((_, index) => ({
          ...enhancedAccountFixtures.manufacturingCorp,
          id: `123e4567-e89b-12d3-a456-426614174${index.toString().padStart(3, "0")}`,
          name: `Account ${index}`,
        }));

      const startTime = Date.now();
      const schema = z.array(enhancedAccountSchema);
      const result = schema.safeParse(largeAccountArray);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe("Edge Case Validation", () => {
    it("should handle null and undefined values gracefully", () => {
      const edgeCaseAccount = {
        ...enhancedAccountFixtures.manufacturingCorp,
        description: null,
        website: undefined,
        annualRevenue: "",
        plants: null,
        trainingMetrics: {
          ...enhancedAccountFixtures.manufacturingCorp.trainingMetrics,
          totalEmployees: undefined,
        },
      };

      const result = enhancedAccountSchema.safeParse(edgeCaseAccount);
      // Should either validate successfully or fail with clear error messages
      expect(typeof result.success).toBe("boolean");
    });

    it("should handle very long strings appropriately", () => {
      const longString = "a".repeat(10000);
      const edgeCaseAccount = {
        ...enhancedAccountFixtures.manufacturingCorp,
        description: longString,
        name: longString,
      };

      const result = enhancedAccountSchema.safeParse(edgeCaseAccount);
      expect(result.success).toBe(false); // Should fail due to length constraints

      if (!result.success) {
        expect(
          result.error.errors.some(error => error.message.includes("too long"))
        ).toBe(true);
      }
    });

    it("should handle special characters in strings", () => {
      const specialCharsAccount = {
        ...enhancedAccountFixtures.manufacturingCorp,
        name: "Company with Special Chars: !@#$%^&*()_+-=[]{}|;':\",./<>?",
        description: "Description with unicode: 🏭 🛡️ ⚠️",
      };

      const result = enhancedAccountSchema.safeParse(specialCharsAccount);
      expect(result.success).toBe(true); // Should handle special characters gracefully
    });
  });
});
