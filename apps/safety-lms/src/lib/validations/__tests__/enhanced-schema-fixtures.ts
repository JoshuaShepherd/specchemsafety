import { z } from "zod";
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

// =============================================================================
// TEST FIXTURES FOR ENHANCED SCHEMAS
// =============================================================================

/**
 * Comprehensive test fixtures for all Safety System validation schemas
 * Includes fixtures for both individual schemas and complex integrated scenarios
 */

// =============================================================================
// BASE TEST DATA
// =============================================================================

const baseTimestamp = "2024-01-01T00:00:00.000Z";
const baseUserId = "123e4567-e89b-12d3-a456-426614174000";
const baseTerritoryId = "123e4567-e89b-12d3-a456-426614174001";
const basePlantId = "123e4567-e89b-12d3-a456-426614174002";
const baseAccountId = "123e4567-e89b-12d3-a456-426614174003";
const baseContactId = "123e4567-e89b-12d3-a456-426614174004";
const baseOpportunityId = "123e4567-e89b-12d3-a456-426614174005";

// =============================================================================
// ENHANCED AUTH USER FIXTURES
// =============================================================================

export const enhancedAuthUserFixtures = {
  // Safety Admin with full access
  safetyAdmin: {
    id: baseUserId,
    email: "admin@safety.com",
    firstName: "Safety",
    lastName: "Admin",
    role: "safety_admin" as const,
    systems: ["training", "business"] as const,

    // Training context
    plantId: basePlantId,
    plant: {
      id: basePlantId,
      name: "Main Manufacturing Plant",
      isActive: true,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    },

    // Business context
    territoryId: baseTerritoryId,
    territory: {
      id: baseTerritoryId,
      name: "North America",
      region: "Americas",
      description: "North American territory",
      isActive: true,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    },

    permissions: {
      training: {
        canManageAllPlants: true,
        canManageUsers: true,
        canManageCourses: true,
        canViewAllData: true,
        canManageAdminRoles: true,
        canViewComplianceReports: true,
        canManageEnrollments: true,
        canViewProgress: true,
      },
      business: {
        canManageAllTerritories: true,
        canManageAllAccounts: true,
        canManageAllOpportunities: true,
        canViewAllSales: true,
        canManageAllUsers: true,
        canViewAllReports: true,
        canManageProducts: true,
        canManageProjects: true,
      },
      crossSystem: {
        canAccessBothSystems: true,
        canViewCrossSystemReports: true,
        canManageSystemIntegrations: true,
      },
    },

    session: {
      accessToken: "access_token_123",
      refreshToken: "refresh_token_123",
      expiresAt: "2024-01-02T00:00:00.000Z",
      lastActivityAt: baseTimestamp,
    },

    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    lastLoginAt: baseTimestamp,
  },

  // Sales Manager with territory access
  salesManager: {
    id: "123e4567-e89b-12d3-a456-426614174010",
    email: "manager@sales.com",
    firstName: "Sales",
    lastName: "Manager",
    role: "sales_manager" as const,
    systems: ["business"] as const,

    territoryId: baseTerritoryId,
    territory: {
      id: baseTerritoryId,
      name: "North America",
      region: "Americas",
      description: "North American territory",
      isActive: true,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    },

    permissions: {
      training: {
        canManageAllPlants: false,
        canManageUsers: false,
        canManageCourses: false,
        canViewAllData: false,
        canManageAdminRoles: false,
        canViewComplianceReports: false,
        canManageEnrollments: false,
        canViewProgress: false,
      },
      business: {
        canManageAllTerritories: false,
        canManageAllAccounts: true,
        canManageAllOpportunities: true,
        canViewAllSales: true,
        canManageAllUsers: false,
        canViewAllReports: true,
        canManageProducts: true,
        canManageProjects: true,
      },
      crossSystem: {
        canAccessBothSystems: false,
        canViewCrossSystemReports: false,
        canManageSystemIntegrations: false,
      },
    },

    session: {
      accessToken: "access_token_456",
      refreshToken: "refresh_token_456",
      expiresAt: "2024-01-02T00:00:00.000Z",
      lastActivityAt: baseTimestamp,
    },

    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    lastLoginAt: baseTimestamp,
  },

  // Safety Instructor with plant access
  safetyInstructor: {
    id: "123e4567-e89b-12d3-a456-426614174020",
    email: "instructor@safety.com",
    firstName: "Safety",
    lastName: "Instructor",
    role: "safety_instructor" as const,
    systems: ["training"] as const,

    plantId: basePlantId,
    plant: {
      id: basePlantId,
      name: "Main Manufacturing Plant",
      isActive: true,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    },

    permissions: {
      training: {
        canManageAllPlants: false,
        canManageUsers: false,
        canManageCourses: true,
        canViewAllData: false,
        canManageAdminRoles: false,
        canViewComplianceReports: false,
        canManageEnrollments: true,
        canViewProgress: true,
      },
      business: {
        canManageAllTerritories: false,
        canManageAllAccounts: false,
        canManageAllOpportunities: false,
        canViewAllSales: false,
        canManageAllUsers: false,
        canViewAllReports: false,
        canManageProducts: false,
        canManageProjects: false,
      },
      crossSystem: {
        canAccessBothSystems: false,
        canViewCrossSystemReports: false,
        canManageSystemIntegrations: false,
      },
    },

    session: {
      accessToken: "access_token_789",
      refreshToken: "refresh_token_789",
      expiresAt: "2024-01-02T00:00:00.000Z",
      lastActivityAt: baseTimestamp,
    },

    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    lastLoginAt: baseTimestamp,
  },
};

// =============================================================================
// ENHANCED TERRITORY FIXTURES
// =============================================================================

export const enhancedTerritoryFixtures = {
  northAmerica: {
    id: baseTerritoryId,
    name: "North America",
    region: "Americas",
    description: "North American territory covering US, Canada, and Mexico",
    isActive: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,

    plants: [
      {
        id: basePlantId,
        name: "Main Manufacturing Plant",
        isActive: true,
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp,
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174030",
        name: "Secondary Plant",
        isActive: true,
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp,
      },
    ],
    plantCount: 2,

    metrics: {
      totalAccounts: 150,
      totalOpportunities: 75,
      totalRevenue: "2500000.00",
      activeUsers: 25,
      complianceScore: 95,
    },

    settings: {
      timezone: "America/New_York",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      complianceStandards: ["OSHA", "ISO 45001", "CSA Z1000"],
    },
  },

  europe: {
    id: "123e4567-e89b-12d3-a456-426614174040",
    name: "Europe",
    region: "EMEA",
    description: "European territory covering EU and UK",
    isActive: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,

    plants: [],
    plantCount: 0,

    metrics: {
      totalAccounts: 80,
      totalOpportunities: 40,
      totalRevenue: "1800000.00",
      activeUsers: 15,
      complianceScore: 98,
    },

    settings: {
      timezone: "Europe/London",
      currency: "EUR",
      dateFormat: "DD/MM/YYYY",
      complianceStandards: ["ISO 45001", "EU-OSHA", "BS OHSAS 18001"],
    },
  },
};

// =============================================================================
// ENHANCED PLANT FIXTURES
// =============================================================================

export const enhancedPlantFixtures = {
  mainPlant: {
    id: basePlantId,
    name: "Main Manufacturing Plant",
    isActive: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,

    territoryId: baseTerritoryId,
    territory: enhancedTerritoryFixtures.northAmerica,

    metrics: {
      totalUsers: 150,
      totalCourses: 25,
      totalEnrollments: 300,
      completionRate: 85,
      complianceScore: 92,
    },

    settings: {
      timezone: "America/Chicago",
      workingHours: {
        start: "07:00",
        end: "16:00",
        timezone: "America/Chicago",
      },
      safetyStandards: ["OSHA", "ISO 45001", "Company Standards"],
    },
  },

  secondaryPlant: {
    id: "123e4567-e89b-12d3-a456-426614174030",
    name: "Secondary Plant",
    isActive: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,

    territoryId: baseTerritoryId,
    territory: enhancedTerritoryFixtures.northAmerica,

    metrics: {
      totalUsers: 75,
      totalCourses: 15,
      totalEnrollments: 150,
      completionRate: 78,
      complianceScore: 88,
    },

    settings: {
      timezone: "America/Los_Angeles",
      workingHours: {
        start: "06:00",
        end: "15:00",
        timezone: "America/Los_Angeles",
      },
      safetyStandards: ["OSHA", "Company Standards"],
    },
  },
};

// =============================================================================
// ENHANCED ACCOUNT FIXTURES
// =============================================================================

export const enhancedAccountFixtures = {
  manufacturingCorp: {
    id: baseAccountId,
    territoryId: baseTerritoryId,
    ownerId: baseUserId,
    name: "ABC Manufacturing Corp",
    accountNumber: "ACC-001",
    type: "safety_equipment_customer" as const,
    status: "active" as const,
    industry: "manufacturing" as const,
    website: "https://abcmanufacturing.com",
    phone: "+1-555-987-6543",
    email: "contact@abcmanufacturing.com",
    description: "Leading manufacturer of automotive parts with 3 facilities",
    annualRevenue: "15000000.00",
    employeeCount: "201-500" as const,
    safetyComplianceLevel: "OSHA Compliant" as const,
    billingAddress: "123 Industrial Blvd, Detroit, MI 48201",
    shippingAddress: "123 Industrial Blvd, Detroit, MI 48201",
    isActive: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    createdBy: baseUserId,

    // Training system integration
    plants: [enhancedPlantFixtures.mainPlant],
    plantCount: 1,

    // Enhanced compliance tracking
    compliance: {
      oshaCompliance: true,
      iso45001Compliance: true,
      customCompliance: false,
      lastAuditDate: "2023-12-01T00:00:00.000Z",
      nextAuditDate: "2024-12-01T00:00:00.000Z",
      complianceScore: 95,
    },

    // Training metrics
    trainingMetrics: {
      totalEmployees: 450,
      trainedEmployees: 380,
      trainingCompletionRate: 84,
      overdueTrainings: 12,
      upcomingRenewals: 25,
    },

    // Enhanced business metrics
    businessMetrics: {
      totalOpportunities: 8,
      openOpportunities: 3,
      totalRevenue: "750000.00",
      lastActivityDate: "2024-01-15T10:30:00.000Z",
      relationshipScore: 92,
    },
  },

  constructionCompany: {
    id: "123e4567-e89b-12d3-a456-426614174050",
    territoryId: baseTerritoryId,
    ownerId: baseUserId,
    name: "XYZ Construction Company",
    accountNumber: "ACC-002",
    type: "training_client" as const,
    status: "active" as const,
    industry: "construction" as const,
    website: "https://xyzconstruction.com",
    phone: "+1-555-123-4567",
    email: "safety@xyzconstruction.com",
    description:
      "Commercial construction company specializing in industrial projects",
    annualRevenue: "8500000.00",
    employeeCount: "51-200" as const,
    safetyComplianceLevel: "ISO 45001" as const,
    billingAddress: "456 Construction Way, Chicago, IL 60601",
    shippingAddress: "456 Construction Way, Chicago, IL 60601",
    isActive: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    createdBy: baseUserId,

    plants: [],
    plantCount: 0,

    compliance: {
      oshaCompliance: true,
      iso45001Compliance: true,
      customCompliance: false,
      lastAuditDate: "2023-11-15T00:00:00.000Z",
      nextAuditDate: "2024-11-15T00:00:00.000Z",
      complianceScore: 98,
    },

    trainingMetrics: {
      totalEmployees: 180,
      trainedEmployees: 165,
      trainingCompletionRate: 92,
      overdueTrainings: 5,
      upcomingRenewals: 15,
    },

    businessMetrics: {
      totalOpportunities: 5,
      openOpportunities: 2,
      totalRevenue: "420000.00",
      lastActivityDate: "2024-01-10T14:20:00.000Z",
      relationshipScore: 88,
    },
  },
};

// =============================================================================
// ENHANCED CONTACT FIXTURES
// =============================================================================

export const enhancedContactFixtures = {
  safetyDirector: {
    id: baseContactId,
    accountId: baseAccountId,
    ownerId: baseUserId,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@abcmanufacturing.com",
    phone: "+1-555-987-6544",
    mobile: "+1-555-987-6545",
    jobTitle: "Safety Director",
    department: "Safety",
    role: "decision_maker" as const,
    status: "active" as const,
    isPrimary: true,
    safetyCertifications: "OSHA 30, CSP, ASP",
    notes:
      "Primary safety contact for all equipment purchases and training decisions",
    isActive: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    createdBy: baseUserId,

    // Training system integration
    plantId: basePlantId,
    plant: enhancedPlantFixtures.mainPlant,

    // Enhanced safety profile
    safetyProfile: {
      certifications: [
        {
          name: "OSHA 30-Hour Construction Safety",
          issuedDate: "2023-01-15T00:00:00.000Z",
          expiryDate: "2026-01-15T00:00:00.000Z",
          issuingAuthority: "OSHA Training Institute",
          isActive: true,
        },
        {
          name: "Certified Safety Professional (CSP)",
          issuedDate: "2022-06-01T00:00:00.000Z",
          expiryDate: "2027-06-01T00:00:00.000Z",
          issuingAuthority: "Board of Certified Safety Professionals",
          isActive: true,
        },
      ],

      trainingHistory: [
        {
          courseId: "123e4567-e89b-12d3-a456-426614174060",
          courseName: "Fall Protection Systems",
          completedDate: "2023-11-20T00:00:00.000Z",
          score: 95,
          certificateNumber: "FP-2023-001",
        },
        {
          courseId: "123e4567-e89b-12d3-a456-426614174061",
          courseName: "Hazard Communication",
          completedDate: "2023-10-15T00:00:00.000Z",
          score: 88,
          certificateNumber: "HZ-2023-002",
        },
      ],

      upcomingTrainings: [
        {
          courseId: "123e4567-e89b-12d3-a456-426614174062",
          courseName: "Confined Space Entry",
          scheduledDate: "2024-02-15T09:00:00.000Z",
          isRequired: true,
        },
      ],
    },

    // Enhanced communication preferences
    communicationPreferences: {
      preferredMethod: "email" as const,
      preferredTime: "09:00-17:00",
      timezone: "America/New_York",
      language: "en",
      optOutMarketing: false,
    },
  },

  hrManager: {
    id: "123e4567-e89b-12d3-a456-426614174070",
    accountId: baseAccountId,
    ownerId: baseUserId,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@abcmanufacturing.com",
    phone: "+1-555-987-6546",
    mobile: "+1-555-987-6547",
    jobTitle: "HR Manager",
    department: "Human Resources",
    role: "influencer" as const,
    status: "active" as const,
    isPrimary: false,
    safetyCertifications: "OSHA 10, PHR",
    notes: "Coordinates employee training schedules and compliance tracking",
    isActive: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    createdBy: baseUserId,

    plantId: basePlantId,
    plant: enhancedPlantFixtures.mainPlant,

    safetyProfile: {
      certifications: [
        {
          name: "OSHA 10-Hour General Industry",
          issuedDate: "2023-03-10T00:00:00.000Z",
          expiryDate: "2026-03-10T00:00:00.000Z",
          issuingAuthority: "OSHA Training Institute",
          isActive: true,
        },
      ],

      trainingHistory: [
        {
          courseId: "123e4567-e89b-12d3-a456-426614174063",
          courseName: "Workplace Safety Fundamentals",
          completedDate: "2023-09-15T00:00:00.000Z",
          score: 92,
          certificateNumber: "WS-2023-003",
        },
      ],

      upcomingTrainings: [],
    },

    communicationPreferences: {
      preferredMethod: "phone" as const,
      preferredTime: "08:00-16:00",
      timezone: "America/New_York",
      language: "en",
      optOutMarketing: true,
    },
  },
};

// =============================================================================
// ENHANCED OPPORTUNITY FIXTURES
// =============================================================================

export const enhancedOpportunityFixtures = {
  equipmentUpgrade: {
    id: baseOpportunityId,
    accountId: baseAccountId,
    contactId: baseContactId,
    ownerId: baseUserId,
    name: "Safety Equipment Upgrade Project",
    description:
      "Complete upgrade of safety equipment across all 3 manufacturing facilities",
    type: "safety_equipment_sale" as const,
    stage: "proposal" as const,
    status: "open" as const,
    source: "referral" as const,
    probability: "75" as const,
    amount: "250000.00",
    closeDate: "2024-06-30T00:00:00.000Z",
    nextSteps:
      "Prepare detailed proposal with equipment specifications and pricing",
    safetyRequirements:
      "OSHA compliant equipment for manufacturing environment",
    complianceNotes:
      "Must meet current OSHA standards and company safety policies",
    notes: "High priority project for Q2. Customer has budget approved.",
    isActive: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    createdBy: baseUserId,

    // Training system integration
    trainingRequirements: {
      requiredCourses: [
        {
          courseId: "123e4567-e89b-12d3-a456-426614174080",
          courseName: "Equipment Operation Training",
          isRequired: true,
          estimatedCost: "5000.00",
        },
        {
          courseId: "123e4567-e89b-12d3-a456-426614174081",
          courseName: "Maintenance Procedures",
          isRequired: true,
          estimatedCost: "3000.00",
        },
      ],

      trainingBudget: "8000.00",
      trainingTimeline: {
        startDate: "2024-07-01T00:00:00.000Z",
        endDate: "2024-08-31T00:00:00.000Z",
        isFlexible: true,
      },
    },

    // Enhanced compliance tracking
    complianceRequirements: {
      standards: ["OSHA", "ISO 45001", "Company Standards"],
      auditRequired: true,
      auditDate: "2024-05-15T00:00:00.000Z",
      complianceDeadline: "2024-06-15T00:00:00.000Z",
    },

    // Enhanced opportunity metrics
    opportunityMetrics: {
      daysInStage: 15,
      stageHistory: [
        {
          stage: "prospecting",
          enteredAt: "2023-12-01T00:00:00.000Z",
          exitedAt: "2024-01-01T00:00:00.000Z",
          duration: 31,
        },
        {
          stage: "qualification",
          enteredAt: "2024-01-01T00:00:00.000Z",
          exitedAt: "2024-01-15T00:00:00.000Z",
          duration: 14,
        },
        {
          stage: "proposal",
          enteredAt: "2024-01-15T00:00:00.000Z",
          exitedAt: undefined,
          duration: undefined,
        },
      ],

      activityCount: 12,
      lastActivityDate: "2024-01-20T14:30:00.000Z",
      stakeholderCount: 5,
    },
  },

  trainingProgram: {
    id: "123e4567-e89b-12d3-a456-426614174090",
    accountId: "123e4567-e89b-12d3-a456-426614174050", // Construction company
    contactId: "123e4567-e89b-12d3-a456-426614174070",
    ownerId: baseUserId,
    name: "Comprehensive Safety Training Program",
    description:
      "Complete safety training program for all construction workers",
    type: "training_service" as const,
    stage: "needs_analysis" as const,
    status: "open" as const,
    source: "website" as const,
    probability: "60" as const,
    amount: "125000.00",
    closeDate: "2024-04-30T00:00:00.000Z",
    nextSteps:
      "Conduct needs analysis and develop customized training curriculum",
    safetyRequirements:
      "OSHA 10 and 30 hour courses, plus specialized construction safety",
    complianceNotes:
      "Must meet OSHA construction standards and state requirements",
    notes:
      "Large training program covering 180 employees across multiple sites",
    isActive: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    createdBy: baseUserId,

    trainingRequirements: {
      requiredCourses: [
        {
          courseId: "123e4567-e89b-12d3-a456-426614174082",
          courseName: "OSHA 10-Hour Construction Safety",
          isRequired: true,
          estimatedCost: "15000.00",
        },
        {
          courseId: "123e4567-e89b-12d3-a456-426614174083",
          courseName: "OSHA 30-Hour Construction Safety",
          isRequired: true,
          estimatedCost: "25000.00",
        },
        {
          courseId: "123e4567-e89b-12d3-a456-426614174084",
          courseName: "Fall Protection Training",
          isRequired: true,
          estimatedCost: "8000.00",
        },
      ],

      trainingBudget: "48000.00",
      trainingTimeline: {
        startDate: "2024-05-01T00:00:00.000Z",
        endDate: "2024-07-31T00:00:00.000Z",
        isFlexible: false,
      },
    },

    complianceRequirements: {
      standards: ["OSHA", "State Construction Safety Standards"],
      auditRequired: false,
      auditDate: undefined,
      complianceDeadline: "2024-04-15T00:00:00.000Z",
    },

    opportunityMetrics: {
      daysInStage: 8,
      stageHistory: [
        {
          stage: "prospecting",
          enteredAt: "2024-01-01T00:00:00.000Z",
          exitedAt: "2024-01-10T00:00:00.000Z",
          duration: 9,
        },
        {
          stage: "qualification",
          enteredAt: "2024-01-10T00:00:00.000Z",
          exitedAt: "2024-01-15T00:00:00.000Z",
          duration: 5,
        },
        {
          stage: "needs_analysis",
          enteredAt: "2024-01-15T00:00:00.000Z",
          exitedAt: undefined,
          duration: undefined,
        },
      ],

      activityCount: 6,
      lastActivityDate: "2024-01-18T11:00:00.000Z",
      stakeholderCount: 3,
    },
  },
};

// =============================================================================
// ENHANCED ACTIVITY LOG FIXTURES
// =============================================================================

export const enhancedActivityLogFixtures = {
  accountCreated: {
    id: "123e4567-e89b-12d3-a456-426614174100",
    system: "business" as const,
    entityType: "account" as const,
    entityId: baseAccountId,
    type: "account_created" as const,
    subject: "New Account Created",
    description:
      "ABC Manufacturing Corp account was created and assigned to North America territory",

    metadata: {
      businessData: {
        territoryId: baseTerritoryId,
        amount: undefined,
        stage: undefined,
        source: undefined,
      },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: {
        latitude: 42.3314,
        longitude: -83.0458,
        city: "Detroit",
        country: "US",
      },
    },

    userId: baseUserId,
    userRole: "sales_manager",
    userTerritoryId: baseTerritoryId,
    userPlantId: undefined,

    occurredAt: baseTimestamp,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,

    isActive: true,
    isPublic: true,
    requiresFollowUp: false,
  },

  trainingCompleted: {
    id: "123e4567-e89b-12d3-a456-426614174110",
    system: "training" as const,
    entityType: "enrollment" as const,
    entityId: "123e4567-e89b-12d3-a456-426614174120",
    type: "training_completed" as const,
    subject: "Training Course Completed",
    description:
      "Jane Smith completed OSHA 30-Hour Construction Safety training with score of 95%",

    metadata: {
      trainingData: {
        courseId: "123e4567-e89b-12d3-a456-426614174060",
        plantId: basePlantId,
        enrollmentId: "123e4567-e89b-12d3-a456-426614174120",
        progressPercent: 100,
        score: 95,
      },
      ipAddress: "192.168.1.101",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      location: {
        latitude: 41.8781,
        longitude: -87.6298,
        city: "Chicago",
        country: "US",
      },
    },

    userId: "123e4567-e89b-12d3-a456-426614174020", // Safety instructor
    userRole: "safety_instructor",
    userTerritoryId: undefined,
    userPlantId: basePlantId,

    occurredAt: "2024-01-15T16:30:00.000Z",
    createdAt: "2024-01-15T16:30:00.000Z",
    updatedAt: "2024-01-15T16:30:00.000Z",

    isActive: true,
    isPublic: false,
    requiresFollowUp: true,
  },

  crossSystemIntegration: {
    id: "123e4567-e89b-12d3-a456-426614174130",
    system: "both" as const,
    entityType: "account" as const,
    entityId: baseAccountId,
    type: "integration_event" as const,
    subject: "Cross-System Data Sync",
    description:
      "Account data synchronized between training and business systems",

    metadata: {
      trainingData: {
        courseId: undefined,
        plantId: basePlantId,
        enrollmentId: undefined,
        progressPercent: undefined,
        score: undefined,
      },
      businessData: {
        opportunityId: baseOpportunityId,
        territoryId: baseTerritoryId,
        amount: "250000.00",
        stage: "proposal",
        source: "referral",
      },
      ipAddress: "192.168.1.102",
      userAgent: "SafetySystem/1.0.0",
      location: undefined,
    },

    userId: baseUserId,
    userRole: "safety_admin",
    userTerritoryId: baseTerritoryId,
    userPlantId: basePlantId,

    occurredAt: "2024-01-20T12:00:00.000Z",
    createdAt: "2024-01-20T12:00:00.000Z",
    updatedAt: "2024-01-20T12:00:00.000Z",

    isActive: true,
    isPublic: false,
    requiresFollowUp: false,
  },
};

// =============================================================================
// API RESPONSE FIXTURES
// =============================================================================

export const apiResponseFixtures = {
  accountResponse: {
    success: true,
    data: enhancedAccountFixtures.manufacturingCorp,
    message: "Account retrieved successfully",
    timestamp: baseTimestamp,
  },

  contactResponse: {
    success: true,
    data: enhancedContactFixtures.safetyDirector,
    message: "Contact retrieved successfully",
    timestamp: baseTimestamp,
  },

  opportunityResponse: {
    success: true,
    data: enhancedOpportunityFixtures.equipmentUpgrade,
    message: "Opportunity retrieved successfully",
    timestamp: baseTimestamp,
  },

  paginatedAccountsResponse: {
    success: true,
    data: [
      enhancedAccountFixtures.manufacturingCorp,
      enhancedAccountFixtures.constructionCompany,
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
    message: "Accounts retrieved successfully",
    timestamp: baseTimestamp,
  },

  errorResponse: {
    success: false,
    error: {
      code: "TERRITORY_ACCESS_DENIED" as const,
      message:
        "Access denied: User does not have permission to access this territory",
      details: [
        {
          field: "territoryId",
          message: "User territory does not match requested territory",
          code: "TERRITORY_ACCESS_DENIED",
          value: baseTerritoryId,
        },
      ],
      context: {
        system: "business" as const,
        operation: "read",
        resource: "accounts",
        userId: "123e4567-e89b-12d3-a456-426614174010",
        territoryId: baseTerritoryId,
        plantId: undefined,
      },
      tracking: {
        errorId: "123e4567-e89b-12d3-a456-426614174140",
        correlationId: "123e4567-e89b-12d3-a456-426614174141",
        requestId: "123e4567-e89b-12d3-a456-426614174142",
      },
    },
    metadata: {
      retryable: false,
      retryAfter: undefined,
      suggestedActions: ["Contact administrator for territory access"],
      documentation: "https://docs.safety.com/access-control",
    },
    timestamp: baseTimestamp,
  },
};

// =============================================================================
// FORM DATA FIXTURES
// =============================================================================

export const formDataFixtures = {
  accountForm: {
    name: "Test Manufacturing Company",
    accountNumber: "ACC-TEST-001",
    type: "safety_equipment_customer" as const,
    status: "active" as const,
    industry: "manufacturing" as const,
    website: "https://testmanufacturing.com",
    phone: "+1-555-123-4567",
    email: "contact@testmanufacturing.com",
    description: "Test manufacturing company for validation testing",
    annualRevenue: "5000000.00",
    employeeCount: "51-200" as const,
    safetyComplianceLevel: "OSHA Compliant" as const,
    billingAddress: "123 Test Street, Test City, TC 12345",
    shippingAddress: "123 Test Street, Test City, TC 12345",
    territoryId: baseTerritoryId,
    ownerId: baseUserId,
  },

  contactForm: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@testmanufacturing.com",
    phone: "+1-555-987-6543",
    mobile: "+1-555-987-6544",
    jobTitle: "Safety Manager",
    department: "Safety",
    role: "decision_maker" as const,
    status: "active" as const,
    isPrimary: true,
    safetyCertifications: "OSHA 30, CSP",
    notes: "Primary safety contact for equipment purchases",
    accountId: baseAccountId,
    branchId: undefined,
    ownerId: baseUserId,
  },

  opportunityForm: {
    name: "Safety Equipment Purchase",
    description: "Purchase of new safety equipment for manufacturing facility",
    type: "safety_equipment_sale" as const,
    stage: "prospecting" as const,
    status: "open" as const,
    source: "website" as const,
    probability: "25" as const,
    amount: "75000.00",
    closeDate: "2024-03-31T00:00:00.000Z",
    nextSteps: "Schedule initial meeting with safety team",
    safetyRequirements: "OSHA compliant equipment for manufacturing",
    complianceNotes: "Must meet current safety standards",
    notes: "Initial opportunity for new customer",
    accountId: baseAccountId,
    contactId: baseContactId,
    ownerId: baseUserId,
  },
};

// =============================================================================
// VALIDATION TEST UTILITIES
// =============================================================================

/**
 * Test utilities for validating schemas with fixtures
 */
export const validationTestUtils = {
  /**
   * Validates a schema with a fixture and returns detailed results
   */
  validateFixture: <T>(schema: z.ZodSchema<T>, fixture: unknown) => {
    const result = schema.safeParse(fixture);
    return {
      success: result.success,
      data: result.success ? result.data : undefined,
      errors: result.success ? undefined : result.error.errors,
      errorCount: result.success ? 0 : result.error.errors.length,
    };
  },

  /**
   * Validates multiple fixtures against a schema
   */
  validateFixtures: <T>(
    schema: z.ZodSchema<T>,
    fixtures: Record<string, unknown>
  ) => {
    const results: Record<
      string,
      ReturnType<typeof validationTestUtils.validateFixture>
    > = {};

    for (const [key, fixture] of Object.entries(fixtures)) {
      results[key] = validationTestUtils.validateFixture(schema, fixture);
    }

    return results;
  },

  /**
   * Generates test cases for schema validation
   */
  generateTestCases: <T>(
    schema: z.ZodSchema<T>,
    validFixtures: unknown[],
    invalidFixtures: unknown[]
  ) => {
    return {
      valid: validFixtures.map((fixture, index) => ({
        name: `should validate valid fixture ${index + 1}`,
        fixture,
        expectedSuccess: true,
      })),
      invalid: invalidFixtures.map((fixture, index) => ({
        name: `should reject invalid fixture ${index + 1}`,
        fixture,
        expectedSuccess: false,
      })),
    };
  },
};

// =============================================================================
// EXPORT ALL FIXTURES
// =============================================================================

export const allFixtures = {
  enhancedAuthUser: enhancedAuthUserFixtures,
  enhancedTerritory: enhancedTerritoryFixtures,
  enhancedPlant: enhancedPlantFixtures,
  enhancedAccount: enhancedAccountFixtures,
  enhancedContact: enhancedContactFixtures,
  enhancedOpportunity: enhancedOpportunityFixtures,
  enhancedActivityLog: enhancedActivityLogFixtures,
  apiResponse: apiResponseFixtures,
  formData: formDataFixtures,
  validationTestUtils,
};

export default allFixtures;
