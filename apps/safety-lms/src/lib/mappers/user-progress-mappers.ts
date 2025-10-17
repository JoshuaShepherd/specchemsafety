import { UserProgress, NewUserProgress } from "../db/schema/user-progress";
import { CourseSection } from "../db/schema/course-sections";
import { Course } from "../db/schema/courses";
import {
  UserProgress as UserProgressSchema,
  UpdateUserProgressRequest,
  CourseCompletionStatusResponse,
} from "@specchem/contracts";

/**
 * User Progress Data Mappers
 * Handles transformation between user progress database entities and API responses
 */

// =============================================================================
// USER PROGRESS DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps user progress database entity to API response
 */
export const mapUserProgressToApiResponse = (
  progress: UserProgress
): UserProgressSchema => ({
  id: progress.id,
  userId: progress.userId,
  courseId: progress.courseId,
  sectionId: progress.sectionId,
  isCompleted: progress.isCompleted,
  completionPercentage: progress.completionPercentage,
  timeSpentSeconds: progress.timeSpentSeconds,
  lastAccessedAt: progress.lastAccessedAt.toISOString(),
  completedAt: progress.completedAt?.toISOString(),
  createdAt: progress.createdAt.toISOString(),
  updatedAt: progress.updatedAt.toISOString(),
});

/**
 * Maps multiple user progress records to API responses
 */
export const mapUserProgressToApiResponses = (
  progressRecords: UserProgress[]
): UserProgressSchema[] => progressRecords.map(mapUserProgressToApiResponse);

// =============================================================================
// API REQUEST → USER PROGRESS DATABASE MAPPERS
// =============================================================================

/**
 * Maps update user progress API request to database entity
 */
export const mapUpdateUserProgressRequestToDb = (
  request: UpdateUserProgressRequest,
  userId: string,
  existingProgress?: UserProgress
): Partial<UserProgress> => {
  const now = new Date();

  return {
    ...existingProgress,
    userId,
    courseId: request.courseId,
    sectionId: request.sectionId,
    isCompleted: request.isCompleted ?? existingProgress?.isCompleted ?? false,
    completionPercentage:
      request.completionPercentage ??
      existingProgress?.completionPercentage ??
      0,
    timeSpentSeconds:
      request.timeSpentSeconds ?? existingProgress?.timeSpentSeconds ?? 0,
    lastAccessedAt: now,
    completedAt: request.isCompleted ? now : existingProgress?.completedAt,
    updatedAt: now,
  };
};

/**
 * Creates new user progress record
 */
export const mapCreateUserProgressRequestToDb = (
  request: UpdateUserProgressRequest,
  userId: string
): NewUserProgress => {
  const now = new Date();

  return {
    userId,
    courseId: request.courseId,
    sectionId: request.sectionId,
    isCompleted: request.isCompleted ?? false,
    completionPercentage: request.completionPercentage ?? 0,
    timeSpentSeconds: request.timeSpentSeconds ?? 0,
    lastAccessedAt: now,
    completedAt: request.isCompleted ? now : undefined,
  };
};

// =============================================================================
// COURSE COMPLETION STATUS MAPPERS
// =============================================================================

/**
 * Course completion status data
 */
export interface CourseCompletionStatusData {
  courseId: string;
  userId: string;
  totalSections: number;
  completedSections: number;
  completionPercentage: number;
  timeSpentSeconds: number;
  lastAccessedAt: Date;
  completedAt?: Date;
}

/**
 * Maps course completion status to API response
 */
export const mapCourseCompletionStatusToApiResponse = (
  status: CourseCompletionStatusData
): CourseCompletionStatusResponse["data"] => ({
  courseId: status.courseId,
  userId: status.userId,
  totalSections: status.totalSections,
  completedSections: status.completedSections,
  completionPercentage: status.completionPercentage,
  timeSpentSeconds: status.timeSpentSeconds,
  lastAccessedAt: status.lastAccessedAt.toISOString(),
  completedAt: status.completedAt?.toISOString(),
});

/**
 * Calculates course completion status from progress records
 */
export const calculateCourseCompletionStatus = (
  progressRecords: UserProgress[],
  courseId: string,
  userId: string,
  totalSections: number
): CourseCompletionStatusData => {
  const courseProgress = progressRecords.filter(
    p => p.courseId === courseId && p.userId === userId
  );

  const completedSections = courseProgress.filter(p => p.isCompleted).length;
  const completionPercentage =
    totalSections > 0
      ? Math.round((completedSections / totalSections) * 100)
      : 0;
  const timeSpentSeconds = courseProgress.reduce(
    (sum, p) => sum + p.timeSpentSeconds,
    0
  );

  const lastAccessedAt =
    courseProgress.length > 0
      ? courseProgress.reduce(
          (latest, p) =>
            p.lastAccessedAt > latest ? p.lastAccessedAt : latest,
          courseProgress[0].lastAccessedAt
        )
      : new Date();

  const completedAt =
    completedSections === totalSections && totalSections > 0
      ? courseProgress.reduce(
          (latest, p) =>
            p.completedAt && p.completedAt > latest ? p.completedAt : latest,
          courseProgress[0].completedAt || new Date(0)
        )
      : undefined;

  return {
    courseId,
    userId,
    totalSections,
    completedSections,
    completionPercentage,
    timeSpentSeconds,
    lastAccessedAt,
    completedAt:
      completedAt && completedAt.getTime() > 0 ? completedAt : undefined,
  };
};

// =============================================================================
// PROGRESS TRACKING MAPPERS
// =============================================================================

/**
 * Progress tracking event data
 */
export interface ProgressTrackingEvent {
  userId: string;
  courseId: string;
  sectionId: string;
  eventType: "started" | "progressed" | "completed" | "paused" | "resumed";
  completionPercentage: number;
  timeSpentSeconds: number;
  metadata?: Record<string, unknown>;
}

/**
 * Maps progress tracking event to user progress update
 */
export const mapProgressTrackingEventToProgressUpdate = (
  event: ProgressTrackingEvent,
  existingProgress?: UserProgress
): Partial<UserProgress> => {
  const now = new Date();
  const isCompleted =
    event.eventType === "completed" || event.completionPercentage >= 100;

  return {
    ...existingProgress,
    userId: event.userId,
    courseId: event.courseId,
    sectionId: event.sectionId,
    isCompleted,
    completionPercentage: Math.min(event.completionPercentage, 100),
    timeSpentSeconds: event.timeSpentSeconds,
    lastAccessedAt: now,
    completedAt: isCompleted ? now : existingProgress?.completedAt,
    updatedAt: now,
  };
};

// =============================================================================
// PROGRESS ANALYTICS MAPPERS
// =============================================================================

/**
 * User progress analytics data
 */
export interface UserProgressAnalytics {
  userId: string;
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalTimeSpent: number;
  averageCompletionRate: number;
  lastActivity?: string;
  coursesByStatus: {
    completed: string[];
    inProgress: string[];
    notStarted: string[];
  };
}

/**
 * Maps user progress records to analytics data
 */
export const mapUserProgressToAnalytics = (
  progressRecords: UserProgress[],
  userId: string,
  allCourses: Course[]
): UserProgressAnalytics => {
  const userProgress = progressRecords.filter(p => p.userId === userId);

  // Group progress by course
  const courseProgressMap = new Map<string, UserProgress[]>();
  userProgress.forEach(p => {
    const existing = courseProgressMap.get(p.courseId) || [];
    existing.push(p);
    courseProgressMap.set(p.courseId, existing);
  });

  const totalCourses = allCourses.length;
  let completedCourses = 0;
  let inProgressCourses = 0;
  const totalTimeSpent = userProgress.reduce(
    (sum, p) => sum + p.timeSpentSeconds,
    0
  );

  const coursesByStatus = {
    completed: [] as string[],
    inProgress: [] as string[],
    notStarted: [] as string[],
  };

  // Analyze each course
  allCourses.forEach(course => {
    const courseProgress = courseProgressMap.get(course.id) || [];
    const completedSections = courseProgress.filter(p => p.isCompleted).length;
    const totalSections = courseProgress.length;

    if (totalSections === 0) {
      coursesByStatus.notStarted.push(course.id);
    } else if (completedSections === totalSections && totalSections > 0) {
      completedCourses++;
      coursesByStatus.completed.push(course.id);
    } else {
      inProgressCourses++;
      coursesByStatus.inProgress.push(course.id);
    }
  });

  const averageCompletionRate =
    totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  const lastActivity =
    userProgress.length > 0
      ? userProgress
          .reduce(
            (latest, p) =>
              p.lastAccessedAt > latest ? p.lastAccessedAt : latest,
            userProgress[0].lastAccessedAt
          )
          .toISOString()
      : undefined;

  return {
    userId,
    totalCourses,
    completedCourses,
    inProgressCourses,
    totalTimeSpent,
    averageCompletionRate,
    lastActivity,
    coursesByStatus,
  };
};

// =============================================================================
// PROGRESS FILTERING MAPPERS
// =============================================================================

/**
 * User progress filtering criteria
 */
export interface UserProgressFilterCriteria {
  userId?: string;
  courseId?: string;
  sectionId?: string;
  isCompleted?: boolean;
  completionPercentageMin?: number;
  completionPercentageMax?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Maps filtering criteria to database query filters
 */
export const mapUserProgressFilterCriteriaToDbFilters = (
  criteria: UserProgressFilterCriteria
): any => {
  const where: any = {};

  if (criteria.userId) {
    where.userId = criteria.userId;
  }

  if (criteria.courseId) {
    where.courseId = criteria.courseId;
  }

  if (criteria.sectionId) {
    where.sectionId = criteria.sectionId;
  }

  if (criteria.isCompleted !== undefined) {
    where.isCompleted = criteria.isCompleted;
  }

  if (
    criteria.completionPercentageMin !== undefined ||
    criteria.completionPercentageMax !== undefined
  ) {
    where.completionPercentage = {};
    if (criteria.completionPercentageMin !== undefined) {
      where.completionPercentage.gte = criteria.completionPercentageMin;
    }
    if (criteria.completionPercentageMax !== undefined) {
      where.completionPercentage.lte = criteria.completionPercentageMax;
    }
  }

  if (criteria.dateFrom || criteria.dateTo) {
    where.lastAccessedAt = {};
    if (criteria.dateFrom) {
      where.lastAccessedAt.gte = criteria.dateFrom;
    }
    if (criteria.dateTo) {
      where.lastAccessedAt.lte = criteria.dateTo;
    }
  }

  return where;
};

// =============================================================================
// PROGRESS ACCESS VALIDATION MAPPERS
// =============================================================================

/**
 * User progress access validation result
 */
export interface UserProgressAccessResult {
  hasAccess: boolean;
  progress?: UserProgressSchema;
  reason?: string;
  permissions?: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

/**
 * Validates user progress access based on user role and ownership
 */
export const validateUserProgressAccess = (
  progress: UserProgress,
  userId: string,
  userRole: string
): UserProgressAccessResult => {
  // Users can always access their own progress
  if (progress.userId === userId) {
    return {
      hasAccess: true,
      progress: mapUserProgressToApiResponse(progress),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: false,
      },
    };
  }

  // Safety admins can access all progress
  if (userRole === "safety_admin") {
    return {
      hasAccess: true,
      progress: mapUserProgressToApiResponse(progress),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
      },
    };
  }

  // Plant managers can access progress in their plant
  if (userRole === "plant_manager") {
    return {
      hasAccess: true,
      progress: mapUserProgressToApiResponse(progress),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
      },
    };
  }

  // HR admins can view progress in their plant
  if (userRole === "hr_admin") {
    return {
      hasAccess: true,
      progress: mapUserProgressToApiResponse(progress),
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
      },
    };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to this progress record",
  };
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type {
  CourseCompletionStatusData,
  ProgressTrackingEvent,
  UserProgressAnalytics,
  UserProgressFilterCriteria,
  UserProgressAccessResult,
};
