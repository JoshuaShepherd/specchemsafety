/**
 * Centralized Safety Training Mapper System
 * Provides unified interface for all safety training data transformations
 * Integrates seamlessly with existing auth mappers while enforcing plant-based multi-tenancy
 */

import { Plant } from "../db/schema/plants";
import { Profile } from "../db/schema/profiles";
import { Course } from "../db/schema/courses";
import { Enrollment } from "../db/schema/enrollments";
import { Progress } from "../db/schema/progress";
import { ActivityEvent } from "../db/schema/activity-events";
import { QuestionEvent } from "../db/schema/question-events";

// Import all existing mappers
import * as PlantMappers from "./plant-mappers";
import * as UserMappers from "./user-mappers";
import * as CourseMappers from "./course-mappers";
import * as EnrollmentMappers from "./enrollment-mappers";
import * as ProgressMappers from "./progress-mappers";
import * as ActivityMappers from "./activity-mappers";
import * as PlantScopedMappers from "./plant-scoped-mappers";
import * as RoleBasedMappers from "./role-based-mappers";
import * as ComplianceMappers from "./compliance-mappers";

// =============================================================================
// SAFETY MAPPER SYSTEM INTERFACE
// =============================================================================

/**
 * Safety mapper system configuration
 */
export interface SafetyMapperConfig {
  userRole: string;
  userPlantId: string;
  requesterUserId?: string;
  includeInactive?: boolean;
  enforcePlantIsolation?: boolean;
  enableAuditTrail?: boolean;
}

/**
 * Safety mapper system context
 */
export interface SafetyMapperContext {
  config: SafetyMapperConfig;
  plants?: Map<string, Plant>;
  users?: Map<string, Profile>;
  courses?: Map<string, Course>;
  enrollments?: Map<string, Enrollment>;
  progress?: Map<string, Progress>;
  activityEvents?: Map<string, ActivityEvent>;
  questionEvents?: Map<string, QuestionEvent>;
}

/**
 * Safety mapper system result
 */
export interface SafetyMapperResult<T> {
  data: T;
  metadata: {
    plantIsolation: {
      isIsolated: boolean;
      violations: Array<{
        entityType: string;
        entityId: string;
        expectedPlantId: string;
        actualPlantId: string;
      }>;
    };
    accessControl: {
      hasAccess: boolean;
      reason?: string;
    };
    auditTrail?: {
      operation: string;
      timestamp: string;
      userId: string;
      plantId: string;
    };
  };
}

// =============================================================================
// CENTRALIZED SAFETY MAPPER SYSTEM
// =============================================================================

/**
 * Centralized Safety Mapper System Class
 */
export class SafetyMapperSystem {
  private context: SafetyMapperContext;

  constructor(context: SafetyMapperContext) {
    this.context = context;
  }

  /**
   * Maps plant data with safety context
   */
  mapPlant(
    plant: Plant,
    operation: "read" | "create" | "update" | "delete" = "read"
  ): SafetyMapperResult<PlantMappers.PlantSchema> {
    const { config } = this.context;

    // Validate plant access
    const plantAccess = PlantMappers.validateAndMapPlantAccess(
      plant,
      config.userPlantId,
      config.userRole
    );

    if (!plantAccess.hasAccess) {
      return {
        data: plantAccess.plant!,
        metadata: {
          plantIsolation: { isIsolated: true, violations: [] },
          accessControl: { hasAccess: false, reason: plantAccess.reason },
        },
      };
    }

    // Create audit trail if enabled
    const auditTrail = config.enableAuditTrail
      ? {
          operation,
          timestamp: new Date().toISOString(),
          userId: config.requesterUserId || "system",
          plantId: plant.id,
        }
      : undefined;

    return {
      data: plantAccess.plant!,
      metadata: {
        plantIsolation: { isIsolated: true, violations: [] },
        accessControl: { hasAccess: true },
        auditTrail,
      },
    };
  }

  /**
   * Maps user profile data with safety context
   */
  mapUserProfile(
    profile: Profile,
    operation: "read" | "create" | "update" | "delete" = "read"
  ): SafetyMapperResult<UserMappers.UserProfile> {
    const { config, plants } = this.context;

    // Get plant context
    const plant = plants?.get(profile.plantId);

    // Validate user access
    const userAccess = UserMappers.validateAndMapUserAccess(
      profile,
      config.userRole,
      config.userPlantId,
      plant
    );

    if (!userAccess.hasAccess) {
      return {
        data: userAccess.user!,
        metadata: {
          plantIsolation: { isIsolated: true, violations: [] },
          accessControl: { hasAccess: false, reason: userAccess.reason },
        },
      };
    }

    // Create audit trail if enabled
    const auditTrail = config.enableAuditTrail
      ? {
          operation,
          timestamp: new Date().toISOString(),
          userId: config.requesterUserId || "system",
          plantId: profile.plantId,
        }
      : undefined;

    return {
      data: userAccess.user!,
      metadata: {
        plantIsolation: { isIsolated: true, violations: [] },
        accessControl: { hasAccess: true },
        auditTrail,
      },
    };
  }

  /**
   * Maps course data with safety context
   */
  mapCourse(
    course: Course,
    operation: "read" | "create" | "update" | "delete" = "read"
  ): SafetyMapperResult<CourseMappers.CourseSchema> {
    const { config, plants } = this.context;

    // Get plant context (note: courses don't have plantId in current schema)
    const plant = plants?.get(""); // Would need plantId in course schema

    // Validate course access
    const courseAccess = CourseMappers.validateAndMapCourseAccess(
      course,
      config.userRole,
      config.userPlantId,
      plant
    );

    if (!courseAccess.hasAccess) {
      return {
        data: courseAccess.course!,
        metadata: {
          plantIsolation: { isIsolated: true, violations: [] },
          accessControl: { hasAccess: false, reason: courseAccess.reason },
        },
      };
    }

    // Create audit trail if enabled
    const auditTrail = config.enableAuditTrail
      ? {
          operation,
          timestamp: new Date().toISOString(),
          userId: config.requesterUserId || "system",
          plantId: config.userPlantId,
        }
      : undefined;

    return {
      data: courseAccess.course!,
      metadata: {
        plantIsolation: { isIsolated: true, violations: [] },
        accessControl: { hasAccess: true },
        auditTrail,
      },
    };
  }

  /**
   * Maps enrollment data with safety context
   */
  mapEnrollment(
    enrollment: Enrollment,
    operation: "read" | "create" | "update" | "delete" = "read"
  ): SafetyMapperResult<EnrollmentMappers.EnrollmentSchema> {
    const { config, users, courses, plants } = this.context;

    // Get related data
    const user = users?.get(enrollment.userId);
    const course = courses?.get(enrollment.courseId);
    const plant = plants?.get(enrollment.plantId);

    // Validate enrollment access
    const enrollmentAccess = EnrollmentMappers.validateAndMapEnrollmentAccess(
      enrollment,
      config.userRole,
      config.userPlantId,
      config.requesterUserId,
      user,
      course,
      plant
    );

    if (!enrollmentAccess.hasAccess) {
      return {
        data: enrollmentAccess.enrollment!,
        metadata: {
          plantIsolation: { isIsolated: true, violations: [] },
          accessControl: { hasAccess: false, reason: enrollmentAccess.reason },
        },
      };
    }

    // Create audit trail if enabled
    const auditTrail = config.enableAuditTrail
      ? {
          operation,
          timestamp: new Date().toISOString(),
          userId: config.requesterUserId || "system",
          plantId: enrollment.plantId,
        }
      : undefined;

    return {
      data: enrollmentAccess.enrollment!,
      metadata: {
        plantIsolation: { isIsolated: true, violations: [] },
        accessControl: { hasAccess: true },
        auditTrail,
      },
    };
  }

  /**
   * Maps progress data with safety context
   */
  mapProgress(
    progress: Progress,
    operation: "read" | "create" | "update" | "delete" = "read"
  ): SafetyMapperResult<ProgressMappers.ProgressSchema> {
    const { config, users, courses, plants } = this.context;

    // Get related data
    const user = users?.get(progress.userId);
    const course = courses?.get(progress.courseId);
    const plant = plants?.get(progress.plantId);

    // Validate progress access
    const progressAccess = ProgressMappers.validateAndMapProgressAccess(
      progress,
      config.userRole,
      config.userPlantId,
      config.requesterUserId,
      user,
      course,
      plant
    );

    if (!progressAccess.hasAccess) {
      return {
        data: progressAccess.progress!,
        metadata: {
          plantIsolation: { isIsolated: true, violations: [] },
          accessControl: { hasAccess: false, reason: progressAccess.reason },
        },
      };
    }

    // Create audit trail if enabled
    const auditTrail = config.enableAuditTrail
      ? {
          operation,
          timestamp: new Date().toISOString(),
          userId: config.requesterUserId || "system",
          plantId: progress.plantId,
        }
      : undefined;

    return {
      data: progressAccess.progress!,
      metadata: {
        plantIsolation: { isIsolated: true, violations: [] },
        accessControl: { hasAccess: true },
        auditTrail,
      },
    };
  }

  /**
   * Maps activity event data with safety context
   */
  mapActivityEvent(
    event: ActivityEvent,
    operation: "read" | "create" | "update" | "delete" = "read"
  ): SafetyMapperResult<ActivityMappers.ActivityEventSchema> {
    const { config, users, courses, plants } = this.context;

    // Get related data
    const user = users?.get(event.userId);
    const course = courses?.get(event.courseId);
    const plant = plants?.get(event.plantId);

    // Validate event access
    const eventAccess = ActivityMappers.validateAndMapEventAccess(
      [event],
      config.userRole,
      config.userPlantId,
      users,
      courses,
      plants
    );

    if (!eventAccess.hasAccess) {
      return {
        data: eventAccess.events![0],
        metadata: {
          plantIsolation: { isIsolated: true, violations: [] },
          accessControl: { hasAccess: false, reason: eventAccess.reason },
        },
      };
    }

    // Create audit trail if enabled
    const auditTrail = config.enableAuditTrail
      ? {
          operation,
          timestamp: new Date().toISOString(),
          userId: config.requesterUserId || "system",
          plantId: event.plantId,
        }
      : undefined;

    return {
      data: eventAccess.events![0],
      metadata: {
        plantIsolation: { isIsolated: true, violations: [] },
        accessControl: { hasAccess: true },
        auditTrail,
      },
    };
  }

  /**
   * Maps multiple entities with plant isolation validation
   */
  mapMultipleEntities<T extends { id: string; plantId: string }, R>(
    entities: T[],
    mapper: (entity: T) => R,
    entityType: string
  ): SafetyMapperResult<R[]> {
    const { config } = this.context;

    // Filter by plant access
    const filteredEntities = PlantScopedMappers.filterEntitiesByPlantAccess(
      entities,
      config.userRole,
      config.userPlantId
    );

    // Map entities
    const mappedEntities = filteredEntities.map(mapper);

    // Validate plant isolation if enabled
    let plantIsolation = { isIsolated: true, violations: [] };
    if (config.enforcePlantIsolation) {
      const isolationResult = PlantScopedMappers.validatePlantDataIsolation(
        filteredEntities,
        config.userPlantId,
        entityType
      );
      plantIsolation = isolationResult;
    }

    return {
      data: mappedEntities,
      metadata: {
        plantIsolation,
        accessControl: { hasAccess: true },
      },
    };
  }

  /**
   * Creates plant-scoped response with safety context
   */
  createPlantScopedResponse<T>(
    data: T,
    plant: Plant,
    additionalMetadata?: Record<string, unknown>
  ): SafetyMapperResult<PlantMappers.PlantScopedResponse<T>> {
    const { config } = this.context;

    // Validate plant access
    const plantAccess = PlantMappers.validateAndMapPlantAccess(
      plant,
      config.userPlantId,
      config.userRole
    );

    if (!plantAccess.hasAccess) {
      throw new Error(plantAccess.reason);
    }

    // Create plant-scoped response
    const response = PlantMappers.wrapWithPlantContext(data, plant, {
      id: config.requesterUserId || "system",
      role: config.userRole,
      plantId: config.userPlantId,
    });

    return {
      data: response,
      metadata: {
        plantIsolation: { isIsolated: true, violations: [] },
        accessControl: { hasAccess: true },
        ...additionalMetadata,
      },
    };
  }

  /**
   * Validates role-based operation
   */
  validateOperation(
    operation: string,
    resource: string,
    context?: Record<string, unknown>
  ): RoleBasedMappers.OperationValidationResult {
    return RoleBasedMappers.validateRoleBasedOperation(
      this.context.config.userRole,
      operation,
      resource,
      context
    );
  }

  /**
   * Gets role permissions
   */
  getRolePermissions(): RoleBasedMappers.RolePermissions {
    return RoleBasedMappers.getRolePermissions(
      this.context.config
        .userRole as keyof typeof RoleBasedMappers.ROLE_HIERARCHY
    );
  }

  /**
   * Filters fields by role visibility
   */
  filterFieldsByRole<T extends Record<string, unknown>>(
    obj: T,
    visibilityConfig: RoleBasedMappers.FieldVisibilityConfig,
    context?: Record<string, unknown>
  ): Partial<T> {
    return RoleBasedMappers.filterFieldsByRoleVisibility(
      obj,
      this.context.config.userRole,
      visibilityConfig,
      context
    );
  }
}

// =============================================================================
// SAFETY MAPPER SYSTEM FACTORY
// =============================================================================

/**
 * Creates a safety mapper system instance
 */
export const createSafetyMapperSystem = (
  config: SafetyMapperConfig,
  contextData?: Partial<SafetyMapperContext>
): SafetyMapperSystem => {
  const context: SafetyMapperContext = {
    config,
    ...contextData,
  };

  return new SafetyMapperSystem(context);
};

// =============================================================================
// SAFETY MAPPER SYSTEM UTILITIES
// =============================================================================

/**
 * Safety mapper system utilities
 */
export const SafetyMapperUtils = {
  /**
   * Creates plant-scoped context for API responses
   */
  createPlantScopedContext: (
    plantId: string,
    userRole: string,
    userPlantId: string
  ) => {
    return PlantScopedMappers.mapPlantScopeToDbFilters(
      userRole,
      userPlantId,
      plantId
    );
  },

  /**
   * Validates plant access for operation
   */
  validatePlantAccess: (
    userRole: string,
    userPlantId: string,
    targetPlantId: string
  ) => {
    return PlantScopedMappers.validatePlantAccess(
      userRole,
      userPlantId,
      targetPlantId
    );
  },

  /**
   * Creates compliance tracking summary
   */
  createComplianceSummary: (
    plant: Plant,
    complianceRecords: ComplianceMappers.ComplianceRecord[]
  ) => {
    return ComplianceMappers.mapPlantDataToComplianceSummary(
      plant,
      complianceRecords
    );
  },

  /**
   * Creates audit trail entries
   */
  createAuditTrail: (
    events: ActivityEvent[],
    users?: Map<string, Profile>,
    plants?: Map<string, Plant>
  ) => {
    return ComplianceMappers.mapComplianceActivityEventsToAuditTrail(
      events,
      users,
      plants
    );
  },

  /**
   * Creates cross-plant admin view
   */
  createCrossPlantAdminView: (
    plants: Plant[],
    plantData: Map<
      string,
      {
        userCount: number;
        courseCount: number;
        enrollmentCount: number;
        complianceRate: number;
        lastActivity?: Date;
      }
    >
  ) => {
    return PlantScopedMappers.mapCrossPlantDataToAdminView(plants, plantData);
  },

  /**
   * Creates training workflow status
   */
  createTrainingWorkflowStatus: (
    enrollment: Enrollment,
    user: Profile,
    course: Course,
    plant: Plant,
    progress?: any,
    expiresAt?: Date
  ) => {
    return EnrollmentMappers.mapEnrollmentToWorkflowStatus(
      enrollment,
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      {
        id: course.id,
        title: course.title,
      },
      plant,
      progress,
      expiresAt
    );
  },

  /**
   * Creates progress analytics
   */
  createProgressAnalytics: (
    plant: Plant,
    progressData: {
      totalUsers: number;
      activeUsers: number;
      completedUsers: number;
      averageProgress: number;
      averageCompletionTime: number;
      courseBreakdown: Array<{
        courseId: string;
        courseTitle: string;
        totalEnrollments: number;
        completedEnrollments: number;
        averageProgress: number;
        averageScore?: number;
      }>;
      timeDistribution: Array<{
        timeRange: string;
        userCount: number;
        completionRate: number;
      }>;
    }
  ) => {
    return ProgressMappers.mapProgressToAnalytics(plant, progressData);
  },

  /**
   * Creates course statistics
   */
  createCourseStatistics: (
    course: Course,
    stats: {
      totalEnrollments: number;
      completedEnrollments: number;
      inProgressEnrollments: number;
      averageScore?: number;
      averageCompletionTime?: number;
      lastActivity?: Date;
    },
    plant?: Plant
  ) => {
    return CourseMappers.mapCourseToStatistics(course, stats, plant);
  },
};

// =============================================================================
// SAFETY MAPPER SYSTEM CONSTANTS
// =============================================================================

/**
 * Safety mapper system constants
 */
export const SAFETY_MAPPER_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_SORT_ORDER: "desc" as const,
  SUPPORTED_OPERATIONS: ["read", "create", "update", "delete"] as const,
  SUPPORTED_RESOURCES: [
    "plants",
    "users",
    "courses",
    "enrollments",
    "progress",
    "activityEvents",
    "questionEvents",
  ] as const,
  ROLE_HIERARCHY: RoleBasedMappers.ROLE_HIERARCHY,
  FIELD_VISIBILITY: {
    USER_PROFILE: RoleBasedMappers.USER_PROFILE_FIELD_VISIBILITY,
    COURSE: RoleBasedMappers.COURSE_FIELD_VISIBILITY,
    ENROLLMENT: RoleBasedMappers.ENROLLMENT_FIELD_VISIBILITY,
  },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// All types are exported as interfaces above

// Re-export all mapper types for convenience
export * from "./plant-mappers";
export * from "./user-mappers";
export * from "./course-mappers";
export * from "./enrollment-mappers";
export * from "./progress-mappers";
export * from "./activity-mappers";
export * from "./auth-integration-mappers";
export * from "./plant-scoped-mappers";
export * from "./role-based-mappers";
export * from "./compliance-mappers";
