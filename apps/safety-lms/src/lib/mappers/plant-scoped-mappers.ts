import { Plant } from "../db/schema/plants";
import { Profile } from "../db/schema/profiles";
import { Course } from "../db/schema/courses";
import { Enrollment } from "../db/schema/enrollments";
import { Progress } from "../db/schema/progress";
import { ActivityEvent } from "../db/schema/activity-events";
import { QuestionEvent } from "../db/schema/question-events";

/**
 * Plant-Scoped Data Mappers
 * Handles plant-based multi-tenancy filtering and data isolation
 * Ensures all operations are properly scoped to plant boundaries
 */

// =============================================================================
// PLANT-SCOPED QUERY FILTERING
// =============================================================================

/**
 * Plant-scoped query filters
 */
export interface PlantScopedFilters {
  plantId?: string | string[];
  includeInactive?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Maps plant scope to database query filters
 */
export const mapPlantScopeToDbFilters = (
  userRole: string,
  userPlantId: string,
  requestedPlantId?: string
): PlantScopedFilters => {
  // Safety admins can access all plants
  if (userRole === "safety_admin") {
    return {
      plantId: requestedPlantId || undefined,
      includeInactive: true,
    };
  }

  // All other roles are limited to their plant
  return {
    plantId: userPlantId,
    includeInactive: false,
  };
};

/**
 * Validates plant access for a specific operation
 */
export const validatePlantAccess = (
  userRole: string,
  userPlantId: string,
  targetPlantId: string
): { hasAccess: boolean; reason?: string } => {
  // Safety admins can access all plants
  if (userRole === "safety_admin") {
    return { hasAccess: true };
  }

  // All other roles can only access their own plant
  if (userPlantId === targetPlantId) {
    return { hasAccess: true };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to this plant",
  };
};

// =============================================================================
// PLANT-SCOPED ENTITY FILTERING
// =============================================================================

/**
 * Filters entities by plant access
 */
export const filterEntitiesByPlantAccess = <T extends { plantId: string }>(
  entities: T[],
  userRole: string,
  userPlantId: string
): T[] => {
  if (userRole === "safety_admin") {
    return entities; // Safety admins can see all entities
  }

  return entities.filter(entity => entity.plantId === userPlantId);
};

/**
 * Filters profiles by plant access
 */
export const filterProfilesByPlantAccess = (
  profiles: Profile[],
  userRole: string,
  userPlantId: string
): Profile[] => {
  if (userRole === "safety_admin") {
    return profiles; // Safety admins can see all profiles
  }

  return profiles.filter(profile => profile.plantId === userPlantId);
};

/**
 * Filters courses by plant access (note: courses don't have plantId in current schema)
 */
export const filterCoursesByPlantAccess = (
  courses: Course[],
  userRole: string,
  userPlantId: string
): Course[] => {
  // Since courses don't have plantId in current schema, we return all for now
  // This would need to be updated when plantId is added to courses schema
  return courses;
};

/**
 * Filters enrollments by plant access
 */
export const filterEnrollmentsByPlantAccess = (
  enrollments: Enrollment[],
  userRole: string,
  userPlantId: string
): Enrollment[] => {
  if (userRole === "safety_admin") {
    return enrollments; // Safety admins can see all enrollments
  }

  return enrollments.filter(enrollment => enrollment.plantId === userPlantId);
};

/**
 * Filters progress by plant access
 */
export const filterProgressByPlantAccess = (
  progressRecords: Progress[],
  userRole: string,
  userPlantId: string
): Progress[] => {
  if (userRole === "safety_admin") {
    return progressRecords; // Safety admins can see all progress
  }

  return progressRecords.filter(progress => progress.plantId === userPlantId);
};

/**
 * Filters activity events by plant access
 */
export const filterActivityEventsByPlantAccess = (
  events: ActivityEvent[],
  userRole: string,
  userPlantId: string
): ActivityEvent[] => {
  if (userRole === "safety_admin") {
    return events; // Safety admins can see all events
  }

  return events.filter(event => event.plantId === userPlantId);
};

/**
 * Filters question events by plant access
 */
export const filterQuestionEventsByPlantAccess = (
  events: QuestionEvent[],
  userRole: string,
  userPlantId: string
): QuestionEvent[] => {
  if (userRole === "safety_admin") {
    return events; // Safety admins can see all events
  }

  return events.filter(event => event.plantId === userPlantId);
};

// =============================================================================
// PLANT-SCOPED AGGREGATION MAPPERS
// =============================================================================

/**
 * Plant-scoped statistics
 */
export interface PlantScopedStatistics {
  plant: {
    id: string;
    name: string;
    isActive: boolean;
  };
  users: {
    total: number;
    active: number;
    byRole: Record<string, number>;
  };
  courses: {
    total: number;
    active: number;
    byType: Record<string, number>;
  };
  enrollments: {
    total: number;
    byStatus: Record<string, number>;
    completed: number;
    inProgress: number;
  };
  compliance: {
    complianceRate: number;
    overdue: number;
    expiring: number;
  };
  lastUpdated: string;
}

/**
 * Maps plant-scoped data to statistics
 */
export const mapPlantScopedDataToStatistics = (
  plant: Plant,
  data: {
    profiles: Profile[];
    courses: Course[];
    enrollments: Enrollment[];
    progress: Progress[];
  }
): PlantScopedStatistics => {
  // User statistics
  const activeProfiles = data.profiles.filter(p => p.status === "active");
  const usersByRole = data.profiles.reduce(
    (acc, profile) => {
      const role = "employee"; // Default role since it's not in current schema
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Course statistics
  const activeCourses = data.courses.filter(c => c.isPublished);
  const coursesByType = data.courses.reduce(
    (acc, course) => {
      const type = "safety_training"; // Default type since it's not in current schema
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Enrollment statistics
  const enrollmentsByStatus = data.enrollments.reduce(
    (acc, enrollment) => {
      acc[enrollment.status] = (acc[enrollment.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Compliance statistics
  const completedEnrollments = data.enrollments.filter(
    e => e.status === "completed"
  );
  const completedProgress = data.progress.filter(
    p => p.progressPercent === 100
  );
  const complianceRate =
    data.enrollments.length > 0
      ? (completedEnrollments.length / data.enrollments.length) * 100
      : 0;

  return {
    plant: {
      id: plant.id,
      name: plant.name,
      isActive: plant.isActive,
    },
    users: {
      total: data.profiles.length,
      active: activeProfiles.length,
      byRole: usersByRole,
    },
    courses: {
      total: data.courses.length,
      active: activeCourses.length,
      byType: coursesByType,
    },
    enrollments: {
      total: data.enrollments.length,
      byStatus: enrollmentsByStatus,
      completed: completedEnrollments.length,
      inProgress: data.enrollments.filter(e => e.status === "in_progress")
        .length,
    },
    compliance: {
      complianceRate,
      overdue: 0, // Would need to calculate based on expiration dates
      expiring: 0, // Would need to calculate based on expiration dates
    },
    lastUpdated: new Date().toISOString(),
  };
};

// =============================================================================
// CROSS-PLANT ADMIN MAPPERS
// =============================================================================

/**
 * Cross-plant admin view
 */
export interface CrossPlantAdminView {
  plants: Array<{
    id: string;
    name: string;
    isActive: boolean;
    userCount: number;
    courseCount: number;
    enrollmentCount: number;
    complianceRate: number;
    lastActivity?: string;
  }>;
  summary: {
    totalPlants: number;
    activePlants: number;
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    overallComplianceRate: number;
  };
  lastUpdated: string;
}

/**
 * Maps cross-plant data for safety admin view
 */
export const mapCrossPlantDataToAdminView = (
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
): CrossPlantAdminView => {
  const plantViews = plants.map(plant => {
    const data = plantData.get(plant.id) || {
      userCount: 0,
      courseCount: 0,
      enrollmentCount: 0,
      complianceRate: 0,
    };

    return {
      id: plant.id,
      name: plant.name,
      isActive: plant.isActive,
      userCount: data.userCount,
      courseCount: data.courseCount,
      enrollmentCount: data.enrollmentCount,
      complianceRate: data.complianceRate,
      lastActivity: data.lastActivity?.toISOString(),
    };
  });

  const activePlants = plants.filter(p => p.isActive);
  const totalUsers = Array.from(plantData.values()).reduce(
    (sum, data) => sum + data.userCount,
    0
  );
  const totalCourses = Array.from(plantData.values()).reduce(
    (sum, data) => sum + data.courseCount,
    0
  );
  const totalEnrollments = Array.from(plantData.values()).reduce(
    (sum, data) => sum + data.enrollmentCount,
    0
  );
  const overallComplianceRate =
    totalEnrollments > 0
      ? Array.from(plantData.values()).reduce(
          (sum, data) => sum + data.complianceRate * data.enrollmentCount,
          0
        ) / totalEnrollments
      : 0;

  return {
    plants: plantViews,
    summary: {
      totalPlants: plants.length,
      activePlants: activePlants.length,
      totalUsers,
      totalCourses,
      totalEnrollments,
      overallComplianceRate,
    },
    lastUpdated: new Date().toISOString(),
  };
};

// =============================================================================
// PLANT-SCOPED PAGINATION MAPPERS
// =============================================================================

/**
 * Plant-scoped pagination context
 */
export interface PlantScopedPagination {
  plantId: string;
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalPages: number;
}

/**
 * Maps pagination parameters with plant scoping
 */
export const mapPlantScopedPagination = (
  plantId: string,
  page: number,
  limit: number,
  total: number
): PlantScopedPagination => {
  const totalPages = Math.ceil(total / limit);

  return {
    plantId,
    page,
    limit,
    total,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    totalPages,
  };
};

// =============================================================================
// PLANT-SCOPED SEARCH MAPPERS
// =============================================================================

/**
 * Plant-scoped search context
 */
export interface PlantScopedSearchContext {
  query: string;
  plantId: string;
  userRole: string;
  userPlantId: string;
  filters: Record<string, any>;
  pagination: PlantScopedPagination;
}

/**
 * Maps search request to plant-scoped context
 */
export const mapSearchRequestToPlantScopedContext = (
  query: string,
  plantId: string,
  userRole: string,
  userPlantId: string,
  page: number = 1,
  limit: number = 20,
  additionalFilters: Record<string, any> = {}
): PlantScopedSearchContext => {
  const plantAccess = validatePlantAccess(userRole, userPlantId, plantId);

  if (!plantAccess.hasAccess) {
    throw new Error(plantAccess.reason);
  }

  const effectivePlantId = userRole === "safety_admin" ? plantId : userPlantId;

  return {
    query,
    plantId: effectivePlantId,
    userRole,
    userPlantId,
    filters: {
      ...additionalFilters,
      plantId: effectivePlantId,
    },
    pagination: mapPlantScopedPagination(effectivePlantId, page, limit, 0), // Total will be updated later
  };
};

// =============================================================================
// PLANT DATA ISOLATION VALIDATORS
// =============================================================================

/**
 * Plant data isolation validation result
 */
export interface PlantIsolationResult {
  isIsolated: boolean;
  violations: Array<{
    entityType: string;
    entityId: string;
    expectedPlantId: string;
    actualPlantId: string;
  }>;
}

/**
 * Validates that data is properly isolated by plant
 */
export const validatePlantDataIsolation = <
  T extends { id: string; plantId: string },
>(
  entities: T[],
  expectedPlantId: string,
  entityType: string
): PlantIsolationResult => {
  const violations = entities
    .filter(entity => entity.plantId !== expectedPlantId)
    .map(entity => ({
      entityType,
      entityId: entity.id,
      expectedPlantId,
      actualPlantId: entity.plantId,
    }));

  return {
    isIsolated: violations.length === 0,
    violations,
  };
};

/**
 * Validates multiple entity types for plant isolation
 */
export const validateMultiEntityPlantIsolation = (
  plantId: string,
  entities: {
    profiles?: Profile[];
    courses?: Course[];
    enrollments?: Enrollment[];
    progress?: Progress[];
    activityEvents?: ActivityEvent[];
    questionEvents?: QuestionEvent[];
  }
): PlantIsolationResult => {
  const allViolations: PlantIsolationResult["violations"] = [];

  // Note: Some entities don't have plantId in current schema
  if (entities.profiles) {
    const profileResult = validatePlantDataIsolation(
      entities.profiles,
      plantId,
      "profiles"
    );
    allViolations.push(...profileResult.violations);
  }

  if (entities.enrollments) {
    const enrollmentResult = validatePlantDataIsolation(
      entities.enrollments,
      plantId,
      "enrollments"
    );
    allViolations.push(...enrollmentResult.violations);
  }

  if (entities.progress) {
    const progressResult = validatePlantDataIsolation(
      entities.progress,
      plantId,
      "progress"
    );
    allViolations.push(...progressResult.violations);
  }

  if (entities.activityEvents) {
    const eventResult = validatePlantDataIsolation(
      entities.activityEvents,
      plantId,
      "activityEvents"
    );
    allViolations.push(...eventResult.violations);
  }

  if (entities.questionEvents) {
    const questionResult = validatePlantDataIsolation(
      entities.questionEvents,
      plantId,
      "questionEvents"
    );
    allViolations.push(...questionResult.violations);
  }

  return {
    isIsolated: allViolations.length === 0,
    violations: allViolations,
  };
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// All types are exported as interfaces above
