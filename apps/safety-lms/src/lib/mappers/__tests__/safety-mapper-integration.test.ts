/**
 * Safety Mapper Integration Tests
 * Ensures that existing auth endpoints remain unaffected by safety mapper additions
 * Validates plant-based multi-tenancy and role-based access control
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  SafetyMapperSystem,
  createSafetyMapperSystem,
  SafetyMapperUtils,
  SAFETY_MAPPER_CONSTANTS,
} from "../safety-mapper-system";
import * as AuthIntegrationMappers from "../auth-integration-mappers";
import * as EnrollmentMappers from "../enrollment-mappers";
import * as ProgressMappers from "../progress-mappers";
import * as PlantScopedMappers from "../plant-scoped-mappers";
import * as RoleBasedMappers from "../role-based-mappers";
import * as ComplianceMappers from "../compliance-mappers";

// Mock data for testing
const mockPlant = {
  id: "plant-1",
  name: "Test Plant",
  isActive: true,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

const mockProfile = {
  id: "user-1",
  authUserId: "user-1",
  territoryId: "territory-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  jobTitle: "Safety Manager",
  department: "Safety",
  role: "safety_admin" as const,
  status: "active" as const,
  isActive: true,
  lastLoginAt: new Date("2024-01-01"),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  createdBy: null,
};

const mockCourse = {
  id: "course-1",
  slug: "safety-basics",
  title: "Safety Basics",
  version: "1.0",
  isPublished: true,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

const mockEnrollment = {
  id: "enrollment-1",
  userId: "user-1",
  courseId: "course-1",
  plantId: "plant-1",
  status: "enrolled" as const,
  enrolledAt: new Date("2024-01-01"),
  completedAt: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

const mockProgress = {
  id: "progress-1",
  userId: "user-1",
  courseId: "course-1",
  plantId: "plant-1",
  progressPercent: 50,
  lastActiveAt: new Date("2024-01-01"),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

const mockActivityEvent = {
  id: "event-1",
  userId: "user-1",
  courseId: "course-1",
  plantId: "plant-1",
  eventType: "course_started",
  meta: { section: "introduction" },
  occurredAt: new Date("2024-01-01"),
  createdAt: new Date("2024-01-01"),
};

describe("Safety Mapper Integration Tests", () => {
  let safetyMapperSystem: SafetyMapperSystem;

  beforeEach(() => {
    // Create safety mapper system with test configuration
    safetyMapperSystem = createSafetyMapperSystem(
      {
        userRole: "safety_admin",
        userPlantId: "plant-1",
        requesterUserId: "user-1",
        includeInactive: false,
        enforcePlantIsolation: true,
        enableAuditTrail: true,
      },
      {
        plants: new Map([["plant-1", mockPlant]]),
        users: new Map([["user-1", mockProfile]]),
        courses: new Map([["course-1", mockCourse]]),
        enrollments: new Map([["enrollment-1", mockEnrollment]]),
        progress: new Map([["progress-1", mockProgress]]),
        activityEvents: new Map([["event-1", mockActivityEvent]]),
      }
    );
  });

  describe("Auth Integration Compatibility", () => {
    it("should maintain auth user mapping functionality", () => {
      const mockAuthUser = {
        id: "user-1",
        email: "john.doe@example.com",
        email_confirmed_at: "2024-01-01T00:00:00Z",
        phone: null,
        phone_confirmed_at: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        last_sign_in_at: "2024-01-01T00:00:00Z",
        app_metadata: {},
        user_metadata: {},
        identities: [],
      };

      const authContext = AuthIntegrationMappers.mapAuthUserToCompleteContext(
        mockAuthUser,
        mockProfile,
        mockPlant,
        "safety_admin"
      );

      expect(authContext.authUser).toEqual(mockAuthUser);
      expect(authContext.profile).toEqual(mockProfile);
      expect(authContext.plant).toEqual(mockPlant);
      expect(authContext.role).toBe("safety_admin");
      expect(authContext.permissions.canManageAllPlants).toBe(true);
    });

    it("should maintain auth profile API response mapping", () => {
      const mockAuthUser = {
        id: "user-1",
        email: "john.doe@example.com",
        email_confirmed_at: "2024-01-01T00:00:00Z",
        phone: null,
        phone_confirmed_at: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        last_sign_in_at: "2024-01-01T00:00:00Z",
        app_metadata: {},
        user_metadata: {},
        identities: [],
      };

      const authContext = AuthIntegrationMappers.mapAuthUserToCompleteContext(
        mockAuthUser,
        mockProfile,
        mockPlant,
        "safety_admin"
      );

      const apiResponse =
        AuthIntegrationMappers.mapAuthProfileToApiResponse(authContext);

      expect(apiResponse.id).toBe("user-1");
      expect(apiResponse.email).toBe("john.doe@example.com");
      expect(apiResponse.firstName).toBe("John");
      expect(apiResponse.lastName).toBe("Doe");
      expect(apiResponse.role).toBe("safety_admin");
      expect(apiResponse.plant.id).toBe("plant-1");
      expect(apiResponse.permissions.canManageAllPlants).toBe(true);
    });

    it("should maintain auth validation functionality", () => {
      const mockAuthUser = {
        id: "user-1",
        email: "john.doe@example.com",
        email_confirmed_at: "2024-01-01T00:00:00Z",
        phone: null,
        phone_confirmed_at: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        last_sign_in_at: "2024-01-01T00:00:00Z",
        app_metadata: {},
        user_metadata: {},
        identities: [],
      };

      const validationResult =
        AuthIntegrationMappers.validateAuthForSafetyTraining(
          mockAuthUser,
          mockProfile,
          mockPlant,
          "safety_admin",
          "plant-1"
        );

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.user).toBeDefined();
      expect(validationResult.plantAccess?.canAccess).toBe(true);
    });
  });

  describe("Plant-Based Multi-Tenancy", () => {
    it("should enforce plant isolation for safety_admin", () => {
      const result = safetyMapperSystem.mapPlant(mockPlant, "read");

      expect(result.data.id).toBe("plant-1");
      expect(result.metadata.plantIsolation.isIsolated).toBe(true);
      expect(result.metadata.accessControl.hasAccess).toBe(true);
    });

    it("should enforce plant isolation for plant_manager", () => {
      const plantManagerSystem = createSafetyMapperSystem({
        userRole: "plant_manager",
        userPlantId: "plant-1",
        requesterUserId: "user-1",
        enforcePlantIsolation: true,
      });

      const result = plantManagerSystem.mapPlant(mockPlant, "read");

      expect(result.data.id).toBe("plant-1");
      expect(result.metadata.plantIsolation.isIsolated).toBe(true);
      expect(result.metadata.accessControl.hasAccess).toBe(true);
    });

    it("should deny access for cross-plant requests by non-admin", () => {
      const crossPlantSystem = createSafetyMapperSystem({
        userRole: "plant_manager",
        userPlantId: "plant-2", // Different plant
        requesterUserId: "user-1",
        enforcePlantIsolation: true,
      });

      const result = crossPlantSystem.mapPlant(mockPlant, "read");

      expect(result.metadata.accessControl.hasAccess).toBe(false);
      expect(result.metadata.accessControl.reason).toContain(
        "does not have access"
      );
    });

    it("should validate plant data isolation", () => {
      const entities = [mockEnrollment, mockProgress, mockActivityEvent];
      const result = PlantScopedMappers.validatePlantDataIsolation(
        entities,
        "plant-1",
        "test-entities"
      );

      expect(result.isIsolated).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe("Role-Based Access Control", () => {
    it("should validate role-based operations", () => {
      const createUserResult = safetyMapperSystem.validateOperation(
        "create",
        "user"
      );
      expect(createUserResult.canPerform).toBe(true);

      const deleteUserResult = safetyMapperSystem.validateOperation(
        "delete",
        "user"
      );
      expect(deleteUserResult.canPerform).toBe(true);

      const exportDataResult = safetyMapperSystem.validateOperation(
        "export",
        "reports"
      );
      expect(exportDataResult.canPerform).toBe(true);
    });

    it("should restrict operations for lower-level roles", () => {
      const employeeSystem = createSafetyMapperSystem({
        userRole: "employee",
        userPlantId: "plant-1",
        requesterUserId: "user-1",
      });

      const createUserResult = employeeSystem.validateOperation(
        "create",
        "user"
      );
      expect(createUserResult.canPerform).toBe(false);

      const deleteUserResult = employeeSystem.validateOperation(
        "delete",
        "user"
      );
      expect(deleteUserResult.canPerform).toBe(false);

      const exportDataResult = employeeSystem.validateOperation(
        "export",
        "reports"
      );
      expect(exportDataResult.canPerform).toBe(false);
    });

    it("should provide correct role permissions", () => {
      const permissions = safetyMapperSystem.getRolePermissions();

      expect(permissions.canManageAllPlants).toBe(true);
      expect(permissions.canManageUsers).toBe(true);
      expect(permissions.canManageCourses).toBe(true);
      expect(permissions.canViewAllData).toBe(true);
      expect(permissions.canManageAdminRoles).toBe(true);
    });

    it("should filter fields by role visibility", () => {
      const userData = {
        id: "user-1",
        authUserId: "auth-1",
        plantId: "plant-1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        jobTitle: "Manager",
        department: "Safety",
        role: "safety_admin",
        status: "active",
        isActive: true,
        lastLoginAt: "2024-01-01T00:00:00Z",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin",
      };

      const filteredData = safetyMapperSystem.filterFieldsByRole(
        userData,
        RoleBasedMappers.USER_PROFILE_FIELD_VISIBILITY
      );

      // Safety admin should see all fields
      expect(filteredData.id).toBeDefined();
      expect(filteredData.authUserId).toBeDefined();
      expect(filteredData.plantId).toBeDefined();
      expect(filteredData.firstName).toBeDefined();
      expect(filteredData.lastName).toBeDefined();
      expect(filteredData.email).toBeDefined();
      expect(filteredData.phone).toBeDefined();
      expect(filteredData.jobTitle).toBeDefined();
      expect(filteredData.department).toBeDefined();
      expect(filteredData.role).toBeDefined();
      expect(filteredData.status).toBeDefined();
      expect(filteredData.isActive).toBeDefined();
      expect(filteredData.lastLoginAt).toBeDefined();
      expect(filteredData.createdAt).toBeDefined();
      expect(filteredData.updatedAt).toBeDefined();
      expect(filteredData.createdBy).toBeDefined();
    });
  });

  describe("Training Workflow Mappers", () => {
    it("should map enrollment to workflow status", () => {
      const workflowStatus = EnrollmentMappers.mapEnrollmentToWorkflowStatus(
        mockEnrollment,
        {
          id: "user-1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
        {
          id: "course-1",
          title: "Safety Basics",
          duration: 60,
        },
        mockPlant,
        {
          percentage: 50,
          currentSection: "introduction",
          timeSpent: 30,
          lastActiveAt: new Date("2024-01-01"),
        }
      );

      expect(workflowStatus.enrollment.id).toBe("enrollment-1");
      expect(workflowStatus.user.firstName).toBe("John");
      expect(workflowStatus.course.title).toBe("Safety Basics");
      expect(workflowStatus.plant.id).toBe("plant-1");
      expect(workflowStatus.progress?.percentage).toBe(50);
      expect(workflowStatus.nextSteps).toContain("Continue training");
    });

    it("should map progress to completion tracking", () => {
      const completionTracking =
        ProgressMappers.mapProgressToCompletionTracking(
          {
            id: "enrollment-1",
            userId: "user-1",
            courseId: "course-1",
            enrolledAt: new Date("2024-01-01"),
          },
          mockProgress,
          [
            {
              id: "milestone-1",
              title: "Introduction Complete",
              completedAt: new Date("2024-01-01"),
              score: 85,
            },
          ],
          {
            id: "cert-1",
            issuedAt: new Date("2024-01-01"),
            expiresAt: new Date("2025-01-01"),
            downloadUrl: "https://example.com/cert.pdf",
          },
          {
            id: "user-1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
          },
          {
            id: "course-1",
            title: "Safety Basics",
          },
          mockPlant
        );

      expect(completionTracking.enrollment.id).toBe("enrollment-1");
      expect(completionTracking.progress.id).toBe("progress-1");
      expect(completionTracking.milestones).toHaveLength(1);
      expect(completionTracking.certificate?.id).toBe("cert-1");
      expect(completionTracking.nextSteps).toContain("Review certificate");
    });
  });

  describe("Compliance Tracking Mappers", () => {
    it("should map compliance records", () => {
      const complianceRecord = ComplianceMappers.mapToComplianceRecord(
        mockEnrollment,
        mockProgress,
        mockProfile,
        mockCourse,
        mockPlant,
        true
      );

      expect(complianceRecord.userId).toBe("user-1");
      expect(complianceRecord.userName).toBe("John Doe");
      expect(complianceRecord.plantId).toBe("plant-1");
      expect(complianceRecord.courseId).toBe("course-1");
      expect(complianceRecord.status).toBe("non_compliant"); // Not completed yet
      expect(complianceRecord.isRequired).toBe(true);
    });

    it("should create compliance summary", () => {
      const complianceRecords = [
        ComplianceMappers.mapToComplianceRecord(
          mockEnrollment,
          mockProgress,
          mockProfile,
          mockCourse,
          mockPlant,
          true
        ),
      ];

      const summary = ComplianceMappers.mapPlantDataToComplianceSummary(
        mockPlant,
        complianceRecords
      );

      expect(summary.plant.id).toBe("plant-1");
      expect(summary.summary.totalUsers).toBe(1);
      expect(summary.byCourse).toHaveLength(1);
      expect(summary.byCourse[0].courseId).toBe("course-1");
    });

    it("should create audit trail entries", () => {
      const auditTrail = ComplianceMappers.mapActivityEventsToAuditTrail(
        [mockActivityEvent],
        new Map([["user-1", mockProfile]]),
        new Map([["plant-1", mockPlant]])
      );

      expect(auditTrail).toHaveLength(1);
      expect(auditTrail[0].userId).toBe("user-1");
      expect(auditTrail[0].userName).toBe("John Doe");
      expect(auditTrail[0].action).toBe("course_started");
      expect(auditTrail[0].plantId).toBe("plant-1");
      expect(auditTrail[0].plantName).toBe("Test Plant");
    });
  });

  describe("Safety Mapper System Integration", () => {
    it("should create plant-scoped response", () => {
      const response = safetyMapperSystem.createPlantScopedResponse(
        { test: "data" },
        mockPlant
      );

      expect(response.data.data).toEqual({ test: "data" });
      expect(response.data.plant.id).toBe("plant-1");
      expect(response.data.user?.role).toBe("safety_admin");
      expect(response.metadata.plantIsolation.isIsolated).toBe(true);
      expect(response.metadata.accessControl.hasAccess).toBe(true);
    });

    it("should map multiple entities with plant isolation", () => {
      const entities = [mockEnrollment, mockProgress];
      const result = safetyMapperSystem.mapMultipleEntities(
        entities,
        entity => ({ id: entity.id, plantId: entity.plantId }),
        "test-entities"
      );

      expect(result.data).toHaveLength(2);
      expect(result.metadata.plantIsolation.isIsolated).toBe(true);
      expect(result.metadata.accessControl.hasAccess).toBe(true);
    });

    it("should provide safety mapper utilities", () => {
      const plantContext = SafetyMapperUtils.createPlantScopedContext(
        "plant-1",
        "safety_admin",
        "plant-1"
      );

      expect(plantContext.plantId).toBe("plant-1");
      expect(plantContext.includeInactive).toBe(true);

      const plantAccess = SafetyMapperUtils.validatePlantAccess(
        "safety_admin",
        "plant-1",
        "plant-1"
      );

      expect(plantAccess.hasAccess).toBe(true);
    });
  });

  describe("Constants and Configuration", () => {
    it("should provide safety mapper constants", () => {
      expect(SAFETY_MAPPER_CONSTANTS.DEFAULT_PAGE_SIZE).toBe(20);
      expect(SAFETY_MAPPER_CONSTANTS.MAX_PAGE_SIZE).toBe(100);
      expect(SAFETY_MAPPER_CONSTANTS.DEFAULT_SORT_ORDER).toBe("desc");
      expect(SAFETY_MAPPER_CONSTANTS.SUPPORTED_OPERATIONS).toContain("read");
      expect(SAFETY_MAPPER_CONSTANTS.SUPPORTED_RESOURCES).toContain("plants");
      expect(SAFETY_MAPPER_CONSTANTS.ROLE_HIERARCHY).toBeDefined();
      expect(
        SAFETY_MAPPER_CONSTANTS.FIELD_VISIBILITY.USER_PROFILE
      ).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid plant access gracefully", () => {
      const invalidSystem = createSafetyMapperSystem({
        userRole: "employee",
        userPlantId: "plant-2",
        requesterUserId: "user-1",
      });

      expect(() => {
        invalidSystem.createPlantScopedResponse({ test: "data" }, mockPlant);
      }).toThrow("User does not have access to this plant");
    });

    it("should handle missing context data gracefully", () => {
      const minimalSystem = createSafetyMapperSystem({
        userRole: "safety_admin",
        userPlantId: "plant-1",
        requesterUserId: "user-1",
      });

      const result = minimalSystem.mapUserProfile(mockProfile);

      expect(result.data.id).toBe("user-1");
      expect(result.metadata.accessControl.hasAccess).toBe(true);
    });
  });
});
