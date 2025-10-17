import { Enrollment, NewEnrollment } from "../db/schema/enrollments";
import {
  Enrollment as EnrollmentSchema,
  CreateEnrollment,
  UpdateEnrollment,
} from "../validations/safety-business";

// Re-export EnrollmentSchema for use in other modules
export type { EnrollmentSchema };
import { mapPlantToApiResponse } from "./plant-mappers";

/**
 * Enrollment Data Mappers
 * Handles transformation between enrollment database entities and API responses
 * Includes training workflow and progress tracking integration
 */

// =============================================================================
// ENROLLMENT DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps enrollment database entity to API response
 */
export const mapEnrollmentToApiResponse = (
  enrollment: Enrollment,
  user?: { id: string; firstName: string; lastName: string; email: string },
  course?: { id: string; title: string },
  plant?: { id: string; name: string; isActive: boolean }
): EnrollmentSchema => ({
  id: enrollment.id,
  userId: enrollment.userId,
  courseId: enrollment.courseId,
  plantId: enrollment.plantId,
  status: enrollment.status,
  enrolledAt: enrollment.enrolledAt.toISOString(),
  startedAt: undefined, // Not in current schema
  completedAt: enrollment.completedAt?.toISOString(),
  expiresAt: undefined, // Not in current schema
  score: undefined, // Not in current schema
  attempts: 0, // Default - not in current schema
  notes: undefined, // Not in current schema
  isActive: true, // Default
  createdAt: enrollment.createdAt.toISOString(),
  updatedAt: enrollment.updatedAt.toISOString(),
});

/**
 * Maps multiple enrollments to API responses
 */
export const mapEnrollmentsToApiResponses = (
  enrollments: Enrollment[],
  users?: Map<
    string,
    { id: string; firstName: string; lastName: string; email: string }
  >,
  courses?: Map<string, { id: string; title: string }>,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): EnrollmentSchema[] =>
  enrollments.map(enrollment => {
    const user = users?.get(enrollment.userId);
    const course = courses?.get(enrollment.courseId);
    const plant = plants?.get(enrollment.plantId);
    return mapEnrollmentToApiResponse(enrollment, user, course, plant);
  });

// =============================================================================
// API REQUEST → ENROLLMENT DATABASE MAPPERS
// =============================================================================

/**
 * Maps create enrollment API request to database entity
 */
export const mapCreateEnrollmentRequestToDb = (
  request: CreateEnrollment
): NewEnrollment => ({
  userId: request.userId,
  courseId: request.courseId,
  plantId: request.plantId,
  status: mapApiStatusToDbStatus(request.status || "enrolled"),
  enrolledAt: request.enrolledAt ? new Date(request.enrolledAt) : new Date(),
  completedAt: request.completedAt ? new Date(request.completedAt) : undefined,
});

/**
 * Maps API enrollment status to database enrollment status
 */
const mapApiStatusToDbStatus = (apiStatus: string): "enrolled" | "in_progress" | "completed" => {
  switch (apiStatus) {
    case "enrolled":
    case "in_progress":
    case "completed":
      return apiStatus as "enrolled" | "in_progress" | "completed";
    case "failed":
    case "dropped":
    case "expired":
      return "completed"; // Map these to completed for now
    default:
      return "enrolled";
  }
};

/**
 * Maps update enrollment API request to database entity
 */
export const mapUpdateEnrollmentRequestToDb = (
  request: UpdateEnrollment,
  existingEnrollment: Enrollment
): Partial<Enrollment> => ({
  ...existingEnrollment,
  status: request.status ? mapApiStatusToDbStatus(request.status) : existingEnrollment.status,
  completedAt: request.completedAt
    ? new Date(request.completedAt)
    : existingEnrollment.completedAt,
  updatedAt: new Date(),
});

// =============================================================================
// TRAINING WORKFLOW MAPPERS
// =============================================================================

/**
 * Training workflow status
 */
export interface TrainingWorkflowStatus {
  enrollment: EnrollmentSchema;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    duration?: number;
  };
  plant: {
    id: string;
    name: string;
  };
  progress?: {
    percentage: number;
    currentSection?: string;
    timeSpent: number;
    lastActiveAt: string;
  };
  nextSteps?: string[];
  isOverdue?: boolean;
  daysUntilExpiration?: number;
}

/**
 * Maps enrollment to training workflow status
 */
export const mapEnrollmentToWorkflowStatus = (
  enrollment: Enrollment,
  user: { id: string; firstName: string; lastName: string; email: string },
  course: { id: string; title: string; duration?: number },
  plant: { id: string; name: string; isActive: boolean },
  progress?: {
    percentage: number;
    currentSection?: string;
    timeSpent: number;
    lastActiveAt: Date;
  },
  expiresAt?: Date
): TrainingWorkflowStatus => {
  const isOverdue = expiresAt ? new Date() > expiresAt : false;
  const daysUntilExpiration = expiresAt
    ? Math.ceil(
        (expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    : undefined;

  const nextSteps: string[] = [];
  if (enrollment.status === "enrolled") {
    nextSteps.push("Start the course");
  } else if (enrollment.status === "in_progress") {
    nextSteps.push("Continue training");
    if (progress?.currentSection) {
      nextSteps.push(`Complete section: ${progress.currentSection}`);
    }
  } else if (enrollment.status === "completed") {
    nextSteps.push("Review certificate");
  }

  if (isOverdue) {
    nextSteps.push("Training is overdue - contact supervisor");
  } else if (daysUntilExpiration && daysUntilExpiration <= 30) {
    nextSteps.push("Training expires soon - complete before deadline");
  }

  return {
    enrollment: mapEnrollmentToApiResponse(enrollment, user, course, plant),
    user,
    course,
    plant: { id: plant.id, name: plant.name },
    progress: progress
      ? {
          percentage: progress.percentage,
          currentSection: progress.currentSection,
          timeSpent: progress.timeSpent,
          lastActiveAt: progress.lastActiveAt.toISOString(),
        }
      : undefined,
    nextSteps,
    isOverdue,
    daysUntilExpiration,
  };
};

// =============================================================================
// PLANT-SCOPED ENROLLMENT MAPPERS
// =============================================================================

/**
 * Plant-scoped enrollment list response
 */
export interface PlantScopedEnrollmentResponse {
  enrollments: EnrollmentSchema[];
  plant: {
    id: string;
    name: string;
    isActive: boolean;
  };
  statistics: {
    total: number;
    enrolled: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
  pagination?: {
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Maps enrollments to plant-scoped response
 */
export const mapEnrollmentsToPlantScopedResponse = (
  enrollments: Enrollment[],
  plant: { id: string; name: string; isActive: boolean },
  statistics: {
    total: number;
    enrolled: number;
    inProgress: number;
    completed: number;
    overdue: number;
  },
  users?: Map<
    string,
    { id: string; firstName: string; lastName: string; email: string }
  >,
  courses?: Map<string, { id: string; title: string }>,
  pagination?: {
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
): PlantScopedEnrollmentResponse => ({
  enrollments: mapEnrollmentsToApiResponses(
    enrollments,
    users,
    courses,
    new Map([[plant.id, plant]])
  ),
  plant,
  statistics,
  pagination,
});

// =============================================================================
// ROLE-BASED ENROLLMENT ACCESS MAPPERS
// =============================================================================

/**
 * Enrollment access validation result
 */
export interface EnrollmentAccessResult {
  hasAccess: boolean;
  enrollment?: EnrollmentSchema;
  reason?: string;
  permissions?: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canManageProgress: boolean;
  };
}

/**
 * Validates and maps enrollment access based on user role and plant
 */
export const validateAndMapEnrollmentAccess = (
  enrollment: Enrollment,
  userRole: string,
  userPlantId: string,
  requesterUserId?: string,
  user?: { id: string; firstName: string; lastName: string; email: string },
  course?: { id: string; title: string },
  plant?: { id: string; name: string; isActive: boolean }
): EnrollmentAccessResult => {
  // Safety admins can access all enrollments
  if (userRole === "safety_admin") {
    return {
      hasAccess: true,
      enrollment: mapEnrollmentToApiResponse(enrollment, user, course, plant),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canManageProgress: true,
      },
    };
  }

  // Plant managers can access enrollments in their plant
  if (userRole === "plant_manager" && enrollment.plantId === userPlantId) {
    return {
      hasAccess: true,
      enrollment: mapEnrollmentToApiResponse(enrollment, user, course, plant),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canManageProgress: true,
      },
    };
  }

  // HR admins can manage enrollments in their plant
  if (userRole === "hr_admin" && enrollment.plantId === userPlantId) {
    return {
      hasAccess: true,
      enrollment: mapEnrollmentToApiResponse(enrollment, user, course, plant),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canManageProgress: false,
      },
    };
  }

  // Safety instructors can view enrollments and manage progress in their plant
  if (userRole === "safety_instructor" && enrollment.plantId === userPlantId) {
    return {
      hasAccess: true,
      enrollment: mapEnrollmentToApiResponse(enrollment, user, course, plant),
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canManageProgress: true,
      },
    };
  }

  // Users can view their own enrollments
  if (enrollment.userId === requesterUserId) {
    return {
      hasAccess: true,
      enrollment: mapEnrollmentToApiResponse(enrollment, user, course, plant),
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canManageProgress: true, // Users can update their own progress
      },
    };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to this enrollment",
  };
};

/**
 * Filters enrollments based on user access permissions
 */
export const filterEnrollmentsByAccess = (
  enrollments: Enrollment[],
  userRole: string,
  userPlantId: string,
  requesterUserId?: string,
  users?: Map<
    string,
    { id: string; firstName: string; lastName: string; email: string }
  >,
  courses?: Map<string, { id: string; title: string }>,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): EnrollmentAccessResult[] => {
  return enrollments
    .map(enrollment => {
      const user = users?.get(enrollment.userId);
      const course = courses?.get(enrollment.courseId);
      const plant = plants?.get(enrollment.plantId);
      return validateAndMapEnrollmentAccess(
        enrollment,
        userRole,
        userPlantId,
        requesterUserId,
        user,
        course,
        plant
      );
    })
    .filter(result => result.hasAccess);
};

// =============================================================================
// ENROLLMENT SEARCH AND FILTERING MAPPERS
// =============================================================================

/**
 * Enrollment search criteria
 */
export interface EnrollmentSearchCriteria {
  query?: string;
  status?: string;
  userId?: string;
  courseId?: string;
  plantId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  isOverdue?: boolean;
}

/**
 * Maps search criteria to database query filters
 */
export const mapEnrollmentSearchCriteriaToDbFilters = (
  criteria: EnrollmentSearchCriteria,
  userRole: string,
  userPlantId: string
): {
  where: any;
  plantScope: string[];
} => {
  const where: any = {};
  let plantScope: string[] = [];

  // Apply plant scoping based on role
  if (userRole === "safety_admin") {
    // Safety admins can search across all plants
    plantScope = criteria.plantId ? [criteria.plantId] : [];
  } else {
    // Other roles are limited to their plant
    plantScope = [userPlantId];
  }

  if (plantScope.length > 0) {
    where.plantId = { in: plantScope };
  }

  // Apply other filters
  if (criteria.status) {
    where.status = criteria.status;
  }

  if (criteria.userId) {
    where.userId = criteria.userId;
  }

  if (criteria.courseId) {
    where.courseId = criteria.courseId;
  }

  if (criteria.dateRange) {
    where.enrolledAt = {
      gte: new Date(criteria.dateRange.start),
      lte: new Date(criteria.dateRange.end),
    };
  }

  return { where, plantScope };
};

// =============================================================================
// BULK ENROLLMENT MAPPERS
// =============================================================================

/**
 * Bulk enrollment request
 */
export interface BulkEnrollmentRequest {
  userIds: string[];
  courseId: string;
  plantId: string;
  enrolledAt?: string;
  expiresAt?: string;
  notes?: string;
}

/**
 * Maps bulk enrollment request to individual enrollment entities
 */
export const mapBulkEnrollmentRequestToDb = (
  request: BulkEnrollmentRequest
): NewEnrollment[] => {
  return request.userIds.map(userId => ({
    userId,
    courseId: request.courseId,
    plantId: request.plantId,
    status: "enrolled",
    enrolledAt: request.enrolledAt ? new Date(request.enrolledAt) : new Date(),
  }));
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// All types are exported as interfaces above
