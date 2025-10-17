import { Progress, NewProgress } from "../db/schema/progress";
import {
  Progress as ProgressSchema,
  CreateProgress,
  UpdateProgress,
} from "../validations/safety-business";

// Re-export ProgressSchema for use in other modules
export type { ProgressSchema };
import { mapPlantToApiResponse } from "./plant-mappers";

/**
 * Progress Data Mappers
 * Handles transformation between progress database entities and API responses
 * Includes completion tracking and performance metrics
 */

// =============================================================================
// PROGRESS DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps progress database entity to API response
 */
export const mapProgressToApiResponse = (
  progress: Progress,
  user?: { id: string; firstName: string; lastName: string; email: string },
  course?: { id: string; title: string },
  plant?: { id: string; name: string; isActive: boolean }
): ProgressSchema => ({
  id: progress.id,
  enrollmentId: "", // Not in current schema, would need to be added
  userId: progress.userId,
  courseId: progress.courseId,
  plantId: progress.plantId,
  status: getProgressStatus(progress.progressPercent),
  progressPercentage: progress.progressPercent,
  timeSpent: 0, // Not in current schema, would need to be added
  lastAccessedAt: progress.lastActiveAt.toISOString(),
  completedAt:
    progress.progressPercent === 100
      ? progress.lastActiveAt.toISOString()
      : undefined,
  score: undefined, // Not in current schema
  notes: undefined, // Not in current schema
  isActive: true, // Default
  createdAt: progress.createdAt.toISOString(),
  updatedAt: progress.updatedAt.toISOString(),
});

/**
 * Helper function to determine progress status based on percentage
 */
const getProgressStatus = (
  progressPercent: number
): "not_started" | "in_progress" | "completed" | "failed" => {
  if (progressPercent === 0) return "not_started";
  if (progressPercent === 100) return "completed";
  return "in_progress";
};

/**
 * Maps multiple progress records to API responses
 */
export const mapProgressToApiResponses = (
  progressRecords: Progress[],
  users?: Map<
    string,
    { id: string; firstName: string; lastName: string; email: string }
  >,
  courses?: Map<string, { id: string; title: string }>,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): ProgressSchema[] =>
  progressRecords.map(progress => {
    const user = users?.get(progress.userId);
    const course = courses?.get(progress.courseId);
    const plant = plants?.get(progress.plantId);
    return mapProgressToApiResponse(progress, user, course, plant);
  });

// =============================================================================
// API REQUEST → PROGRESS DATABASE MAPPERS
// =============================================================================

/**
 * Maps create progress API request to database entity
 */
export const mapCreateProgressRequestToDb = (
  request: CreateProgress
): NewProgress => ({
  userId: request.userId,
  courseId: request.courseId,
  plantId: request.plantId,
  progressPercent: request.progressPercentage || 0,
  currentSection: undefined, // Not in current schema
  lastActiveAt: request.lastAccessedAt
    ? new Date(request.lastAccessedAt)
    : new Date(),
});

/**
 * Maps update progress API request to database entity
 */
export const mapUpdateProgressRequestToDb = (
  request: UpdateProgress,
  existingProgress: Progress
): Partial<Progress> => ({
  ...existingProgress,
  progressPercent:
    request.progressPercentage ?? existingProgress.progressPercent,
  currentSection: undefined, // Would need to be added to schema
  lastActiveAt: request.lastAccessedAt
    ? new Date(request.lastAccessedAt)
    : existingProgress.lastActiveAt,
  updatedAt: new Date(),
});

// =============================================================================
// PROGRESS TRACKING AND ANALYTICS MAPPERS
// =============================================================================

/**
 * Progress analytics summary
 */
export interface ProgressAnalytics {
  plant: {
    id: string;
    name: string;
    isActive: boolean;
  };
  summary: {
    totalUsers: number;
    activeUsers: number;
    completedUsers: number;
    averageProgress: number;
    averageCompletionTime: number; // in minutes
  };
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
  lastUpdated: string;
}

/**
 * Maps progress data to analytics summary
 */
export const mapProgressToAnalytics = (
  plant: { id: string; name: string; isActive: boolean },
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
): ProgressAnalytics => ({
  plant,
  summary: progressData,
  courseBreakdown: progressData.courseBreakdown,
  timeDistribution: progressData.timeDistribution,
  lastUpdated: new Date().toISOString(),
});

// =============================================================================
// PLANT-SCOPED PROGRESS MAPPERS
// =============================================================================

/**
 * Plant-scoped progress list response
 */
export interface PlantScopedProgressResponse {
  progress: ProgressSchema[];
  plant: {
    id: string;
    name: string;
    isActive: boolean;
  };
  statistics: {
    total: number;
    notStarted: number;
    inProgress: number;
    completed: number;
    averageProgress: number;
  };
  pagination?: {
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Maps progress records to plant-scoped response
 */
export const mapProgressToPlantScopedResponse = (
  progressRecords: Progress[],
  plant: { id: string; name: string; isActive: boolean },
  statistics: {
    total: number;
    notStarted: number;
    inProgress: number;
    completed: number;
    averageProgress: number;
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
): PlantScopedProgressResponse => ({
  progress: mapProgressToApiResponses(
    progressRecords,
    users,
    courses,
    new Map([[plant.id, plant]])
  ),
  plant,
  statistics,
  pagination,
});

// =============================================================================
// ROLE-BASED PROGRESS ACCESS MAPPERS
// =============================================================================

/**
 * Progress access validation result
 */
export interface ProgressAccessResult {
  hasAccess: boolean;
  progress?: ProgressSchema;
  reason?: string;
  permissions?: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canViewDetails: boolean;
  };
}

/**
 * Validates and maps progress access based on user role and plant
 */
export const validateAndMapProgressAccess = (
  progress: Progress,
  userRole: string,
  userPlantId: string,
  requesterUserId?: string,
  user?: { id: string; firstName: string; lastName: string; email: string },
  course?: { id: string; title: string },
  plant?: { id: string; name: string; isActive: boolean }
): ProgressAccessResult => {
  // Safety admins can access all progress
  if (userRole === "safety_admin") {
    return {
      hasAccess: true,
      progress: mapProgressToApiResponse(progress, user, course, plant),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canViewDetails: true,
      },
    };
  }

  // Plant managers can access progress in their plant
  if (userRole === "plant_manager" && progress.plantId === userPlantId) {
    return {
      hasAccess: true,
      progress: mapProgressToApiResponse(progress, user, course, plant),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: false,
        canViewDetails: true,
      },
    };
  }

  // HR admins can view progress in their plant
  if (userRole === "hr_admin" && progress.plantId === userPlantId) {
    return {
      hasAccess: true,
      progress: mapProgressToApiResponse(progress, user, course, plant),
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canViewDetails: true,
      },
    };
  }

  // Safety instructors can view and manage progress in their plant
  if (userRole === "safety_instructor" && progress.plantId === userPlantId) {
    return {
      hasAccess: true,
      progress: mapProgressToApiResponse(progress, user, course, plant),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: false,
        canViewDetails: true,
      },
    };
  }

  // Users can view and edit their own progress
  if (progress.userId === requesterUserId) {
    return {
      hasAccess: true,
      progress: mapProgressToApiResponse(progress, user, course, plant),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: false,
        canViewDetails: true,
      },
    };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to this progress data",
  };
};

/**
 * Filters progress records based on user access permissions
 */
export const filterProgressByAccess = (
  progressRecords: Progress[],
  userRole: string,
  userPlantId: string,
  requesterUserId?: string,
  users?: Map<
    string,
    { id: string; firstName: string; lastName: string; email: string }
  >,
  courses?: Map<string, { id: string; title: string }>,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): ProgressAccessResult[] => {
  return progressRecords
    .map(progress => {
      const user = users?.get(progress.userId);
      const course = courses?.get(progress.courseId);
      const plant = plants?.get(progress.plantId);
      return validateAndMapProgressAccess(
        progress,
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
// PROGRESS SEARCH AND FILTERING MAPPERS
// =============================================================================

/**
 * Progress search criteria
 */
export interface ProgressSearchCriteria {
  query?: string;
  status?: string;
  userId?: string;
  courseId?: string;
  plantId?: string;
  minProgress?: number;
  maxProgress?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Maps search criteria to database query filters
 */
export const mapProgressSearchCriteriaToDbFilters = (
  criteria: ProgressSearchCriteria,
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
    switch (criteria.status) {
      case "not_started":
        where.progressPercent = 0;
        break;
      case "in_progress":
        where.progressPercent = { gt: 0, lt: 100 };
        break;
      case "completed":
        where.progressPercent = 100;
        break;
    }
  }

  if (criteria.userId) {
    where.userId = criteria.userId;
  }

  if (criteria.courseId) {
    where.courseId = criteria.courseId;
  }

  if (criteria.minProgress !== undefined) {
    where.progressPercent = {
      ...where.progressPercent,
      gte: criteria.minProgress,
    };
  }

  if (criteria.maxProgress !== undefined) {
    where.progressPercent = {
      ...where.progressPercent,
      lte: criteria.maxProgress,
    };
  }

  if (criteria.dateRange) {
    where.lastActiveAt = {
      gte: new Date(criteria.dateRange.start),
      lte: new Date(criteria.dateRange.end),
    };
  }

  return { where, plantScope };
};

// =============================================================================
// COMPLETION TRACKING MAPPERS
// =============================================================================

/**
 * Completion tracking summary
 */
export interface CompletionTracking {
  enrollment: {
    id: string;
    userId: string;
    courseId: string;
    enrolledAt: string;
  };
  progress: ProgressSchema;
  milestones: Array<{
    id: string;
    title: string;
    completedAt: string;
    score?: number;
  }>;
  certificate?: {
    id: string;
    issuedAt: string;
    expiresAt?: string;
    downloadUrl?: string;
  };
  nextSteps?: string[];
}

/**
 * Maps progress to completion tracking
 */
export const mapProgressToCompletionTracking = (
  enrollment: {
    id: string;
    userId: string;
    courseId: string;
    enrolledAt: Date;
  },
  progress: Progress,
  milestones: Array<{
    id: string;
    title: string;
    completedAt: Date;
    score?: number;
  }>,
  certificate?: {
    id: string;
    issuedAt: Date;
    expiresAt?: Date;
    downloadUrl?: string;
  },
  user?: { id: string; firstName: string; lastName: string; email: string },
  course?: { id: string; title: string },
  plant?: { id: string; name: string; isActive: boolean }
): CompletionTracking => {
  const nextSteps: string[] = [];

  if (progress.progressPercent < 100) {
    nextSteps.push("Continue training to completion");
  } else {
    nextSteps.push("Review certificate");
    if (certificate?.expiresAt && new Date() > certificate.expiresAt) {
      nextSteps.push("Certificate has expired - retake training");
    } else if (certificate?.expiresAt) {
      const daysUntilExpiry = Math.ceil(
        (certificate.expiresAt.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysUntilExpiry <= 30) {
        nextSteps.push("Certificate expires soon - plan renewal");
      }
    }
  }

  return {
    enrollment: {
      id: enrollment.id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      enrolledAt: enrollment.enrolledAt.toISOString(),
    },
    progress: mapProgressToApiResponse(progress, user, course, plant),
    milestones: milestones.map(milestone => ({
      ...milestone,
      completedAt: milestone.completedAt.toISOString(),
    })),
    certificate: certificate
      ? {
          ...certificate,
          issuedAt: certificate.issuedAt.toISOString(),
          expiresAt: certificate.expiresAt?.toISOString(),
        }
      : undefined,
    nextSteps,
  };
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// All types are exported as interfaces above
