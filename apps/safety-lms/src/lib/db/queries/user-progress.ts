import { eq, and, desc, asc, sql, gte, lte } from "drizzle-orm";
import { db } from "../index";
import {
  userProgress,
  courses,
  courseSections,
  UserProgress,
  NewUserProgress,
} from "../schema";

/**
 * User Progress Query Operations
 * Handles database queries for user progress tracking with proper access control
 */

// =============================================================================
// BASIC USER PROGRESS QUERIES
// =============================================================================

/**
 * Get user progress by ID
 */
export const getUserProgressById = async (
  progressId: string
): Promise<UserProgress | null> => {
  const result = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.id, progressId))
    .limit(1);

  return result[0] || null;
};

/**
 * Get user progress by user ID and section ID
 */
export const getUserProgressByUserAndSection = async (
  userId: string,
  sectionId: string
): Promise<UserProgress | null> => {
  const result = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.sectionId, sectionId)
      )
    )
    .limit(1);

  return result[0] || null;
};

/**
 * Get all progress records for a user
 */
export const getUserProgressByUser = async (
  userId: string,
  options: {
    courseId?: string;
    sectionId?: string;
    isCompleted?: boolean;
    completionPercentageMin?: number;
    completionPercentageMax?: number;
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: "lastAccessedAt" | "completedAt" | "createdAt";
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<UserProgress[]> => {
  const {
    courseId,
    sectionId,
    isCompleted,
    completionPercentageMin,
    completionPercentageMax,
    dateFrom,
    dateTo,
    sortBy = "lastAccessedAt",
    sortOrder = "desc",
  } = options;

  let whereClause = eq(userProgress.userId, userId);

  if (courseId) {
    whereClause = and(whereClause, eq(userProgress.courseId, courseId));
  }

  if (sectionId) {
    whereClause = and(whereClause, eq(userProgress.sectionId, sectionId));
  }

  if (isCompleted !== undefined) {
    whereClause = and(whereClause, eq(userProgress.isCompleted, isCompleted));
  }

  if (completionPercentageMin !== undefined) {
    whereClause = and(
      whereClause,
      gte(userProgress.completionPercentage, completionPercentageMin)
    );
  }

  if (completionPercentageMax !== undefined) {
    whereClause = and(
      whereClause,
      lte(userProgress.completionPercentage, completionPercentageMax)
    );
  }

  if (dateFrom) {
    whereClause = and(whereClause, gte(userProgress.lastAccessedAt, dateFrom));
  }

  if (dateTo) {
    whereClause = and(whereClause, lte(userProgress.lastAccessedAt, dateTo));
  }

  const orderBy =
    sortOrder === "desc"
      ? desc(userProgress[sortBy])
      : asc(userProgress[sortBy]);

  const result = await db
    .select()
    .from(userProgress)
    .where(whereClause)
    .orderBy(orderBy);

  return result;
};

/**
 * Get all progress records for a course
 */
export const getUserProgressByCourse = async (
  courseId: string,
  options: {
    userId?: string;
    isCompleted?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<UserProgress[]> => {
  const { userId, isCompleted, limit = 20, offset = 0 } = options;

  let whereClause = eq(userProgress.courseId, courseId);

  if (userId) {
    whereClause = and(whereClause, eq(userProgress.userId, userId));
  }

  if (isCompleted !== undefined) {
    whereClause = and(whereClause, eq(userProgress.isCompleted, isCompleted));
  }

  const result = await db
    .select()
    .from(userProgress)
    .where(whereClause)
    .orderBy(desc(userProgress.lastAccessedAt))
    .limit(limit)
    .offset(offset);

  return result;
};

/**
 * Get all progress records for a section
 */
export const getUserProgressBySection = async (
  sectionId: string,
  options: {
    userId?: string;
    isCompleted?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<UserProgress[]> => {
  const { userId, isCompleted, limit = 20, offset = 0 } = options;

  let whereClause = eq(userProgress.sectionId, sectionId);

  if (userId) {
    whereClause = and(whereClause, eq(userProgress.userId, userId));
  }

  if (isCompleted !== undefined) {
    whereClause = and(whereClause, eq(userProgress.isCompleted, isCompleted));
  }

  const result = await db
    .select()
    .from(userProgress)
    .where(whereClause)
    .orderBy(desc(userProgress.lastAccessedAt))
    .limit(limit)
    .offset(offset);

  return result;
};

// =============================================================================
// USER PROGRESS CREATION AND UPDATES
// =============================================================================

/**
 * Create or update user progress
 */
export const upsertUserProgress = async (
  progressData: NewUserProgress
): Promise<UserProgress> => {
  const result = await db
    .insert(userProgress)
    .values(progressData)
    .onConflictDoUpdate({
      target: [userProgress.userId, userProgress.sectionId],
      set: {
        isCompleted: progressData.isCompleted,
        completionPercentage: progressData.completionPercentage,
        timeSpentSeconds: progressData.timeSpentSeconds,
        lastAccessedAt: progressData.lastAccessedAt,
        completedAt: progressData.completedAt,
        updatedAt: new Date(),
      },
    })
    .returning();

  return result[0];
};

/**
 * Update user progress
 */
export const updateUserProgress = async (
  progressId: string,
  updates: Partial<UserProgress>
): Promise<UserProgress | null> => {
  const result = await db
    .update(userProgress)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(userProgress.id, progressId))
    .returning();

  return result[0] || null;
};

/**
 * Update user progress by user and section
 */
export const updateUserProgressByUserAndSection = async (
  userId: string,
  sectionId: string,
  updates: Partial<UserProgress>
): Promise<UserProgress | null> => {
  const result = await db
    .update(userProgress)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.sectionId, sectionId)
      )
    )
    .returning();

  return result[0] || null;
};

/**
 * Delete user progress
 */
export const deleteUserProgress = async (
  progressId: string
): Promise<boolean> => {
  const result = await db
    .delete(userProgress)
    .where(eq(userProgress.id, progressId))
    .returning();

  return result.length > 0;
};

// =============================================================================
// COURSE COMPLETION STATUS QUERIES
// =============================================================================

/**
 * Calculate course completion status for a user
 */
export const calculateCourseCompletionStatus = async (
  userId: string,
  courseId: string
): Promise<{
  courseId: string;
  userId: string;
  totalSections: number;
  completedSections: number;
  completionPercentage: number;
  timeSpentSeconds: number;
  lastAccessedAt: Date;
  completedAt?: Date;
} | null> => {
  // Get all sections for the course
  const sections = await db
    .select()
    .from(courseSections)
    .where(eq(courseSections.courseId, courseId));

  if (sections.length === 0) return null;

  // Get user progress for this course
  const progressRecords = await getUserProgressByUser(userId, { courseId });

  const completedSections = progressRecords.filter(p => p.isCompleted).length;
  const completionPercentage = Math.round(
    (completedSections / sections.length) * 100
  );
  const timeSpentSeconds = progressRecords.reduce(
    (sum, p) => sum + p.timeSpentSeconds,
    0
  );

  const lastAccessedAt =
    progressRecords.length > 0
      ? progressRecords.reduce(
          (latest, p) =>
            p.lastAccessedAt > latest ? p.lastAccessedAt : latest,
          progressRecords[0].lastAccessedAt
        )
      : new Date();

  const completedAt =
    completedSections === sections.length && sections.length > 0
      ? progressRecords.reduce(
          (latest, p) =>
            p.completedAt && p.completedAt > latest ? p.completedAt : latest,
          progressRecords[0].completedAt || new Date(0)
        )
      : undefined;

  return {
    courseId,
    userId,
    totalSections: sections.length,
    completedSections,
    completionPercentage,
    timeSpentSeconds,
    lastAccessedAt,
    completedAt:
      completedAt && completedAt.getTime() > 0 ? completedAt : undefined,
  };
};

/**
 * Get course completion status for multiple users
 */
export const getCourseCompletionStatusForUsers = async (
  courseId: string,
  userIds: string[]
): Promise<
  Array<{
    userId: string;
    courseId: string;
    totalSections: number;
    completedSections: number;
    completionPercentage: number;
    timeSpentSeconds: number;
    lastAccessedAt: Date;
    completedAt?: Date;
  }>
> => {
  const results = [];

  for (const userId of userIds) {
    const status = await calculateCourseCompletionStatus(userId, courseId);
    if (status) {
      results.push(status);
    }
  }

  return results;
};

// =============================================================================
// USER PROGRESS ANALYTICS QUERIES
// =============================================================================

/**
 * Get user progress analytics
 */
export const getUserProgressAnalytics = async (
  userId: string
): Promise<{
  userId: string;
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalTimeSpent: number;
  averageCompletionRate: number;
  lastActivity?: Date;
  coursesByStatus: {
    completed: string[];
    inProgress: string[];
    notStarted: string[];
  };
} | null> => {
  // Get all courses
  const allCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.isPublished, true));

  if (allCourses.length === 0) {
    return {
      userId,
      totalCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalTimeSpent: 0,
      averageCompletionRate: 0,
      coursesByStatus: {
        completed: [],
        inProgress: [],
        notStarted: [],
      },
    };
  }

  // Get user progress for all courses
  const userProgressRecords = await getUserProgressByUser(userId);

  const totalCourses = allCourses.length;
  let completedCourses = 0;
  let inProgressCourses = 0;
  const totalTimeSpent = userProgressRecords.reduce(
    (sum, p) => sum + p.timeSpentSeconds,
    0
  );

  const coursesByStatus = {
    completed: [] as string[],
    inProgress: [] as string[],
    notStarted: [] as string[],
  };

  // Analyze each course
  for (const course of allCourses) {
    const courseProgress = userProgressRecords.filter(
      p => p.courseId === course.id
    );
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
  }

  const averageCompletionRate =
    totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  const lastActivity =
    userProgressRecords.length > 0
      ? userProgressRecords.reduce(
          (latest, p) =>
            p.lastAccessedAt > latest ? p.lastAccessedAt : latest,
          userProgressRecords[0].lastAccessedAt
        )
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
// USER PROGRESS STATISTICS QUERIES
// =============================================================================

/**
 * Get course progress statistics
 */
export const getCourseProgressStatistics = async (
  courseId: string
): Promise<{
  totalUsers: number;
  completedUsers: number;
  inProgressUsers: number;
  averageCompletionRate: number;
  averageTimeSpent: number;
  lastActivity?: Date;
} | null> => {
  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course[0]) return null;

  // Get all progress records for this course
  const progressRecords = await getUserProgressByCourse(courseId);

  if (progressRecords.length === 0) {
    return {
      totalUsers: 0,
      completedUsers: 0,
      inProgressUsers: 0,
      averageCompletionRate: 0,
      averageTimeSpent: 0,
    };
  }

  // Group by user
  const userProgressMap = new Map<string, UserProgress[]>();
  progressRecords.forEach(p => {
    const existing = userProgressMap.get(p.userId) || [];
    existing.push(p);
    userProgressMap.set(p.userId, existing);
  });

  const totalUsers = userProgressMap.size;
  let completedUsers = 0;
  let inProgressUsers = 0;
  let totalTimeSpent = 0;

  // Get total sections for the course
  const sections = await db
    .select()
    .from(courseSections)
    .where(eq(courseSections.courseId, courseId));

  const totalSections = sections.length;

  // Analyze each user's progress
  for (const [userId, userProgress] of userProgressMap) {
    const completedSections = userProgress.filter(p => p.isCompleted).length;
    const userTimeSpent = userProgress.reduce(
      (sum, p) => sum + p.timeSpentSeconds,
      0
    );
    totalTimeSpent += userTimeSpent;

    if (completedSections === totalSections && totalSections > 0) {
      completedUsers++;
    } else if (completedSections > 0) {
      inProgressUsers++;
    }
  }

  const averageCompletionRate =
    totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0;
  const averageTimeSpent = totalUsers > 0 ? totalTimeSpent / totalUsers : 0;

  const lastActivity =
    progressRecords.length > 0
      ? progressRecords.reduce(
          (latest, p) =>
            p.lastAccessedAt > latest ? p.lastAccessedAt : latest,
          progressRecords[0].lastAccessedAt
        )
      : undefined;

  return {
    totalUsers,
    completedUsers,
    inProgressUsers,
    averageCompletionRate,
    averageTimeSpent,
    lastActivity,
  };
};

// =============================================================================
// USER PROGRESS SEARCH QUERIES
// =============================================================================

/**
 * Search user progress records
 */
export const searchUserProgress = async (
  searchTerm: string,
  options: {
    userId?: string;
    courseId?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<UserProgress[]> => {
  const { userId, courseId, limit = 20, offset = 0 } = options;

  let whereClause = sql`${userProgress.userId} ilike ${`%${searchTerm}%`}`;

  if (userId) {
    whereClause = and(whereClause, eq(userProgress.userId, userId));
  }

  if (courseId) {
    whereClause = and(whereClause, eq(userProgress.courseId, courseId));
  }

  const result = await db
    .select()
    .from(userProgress)
    .where(whereClause)
    .orderBy(desc(userProgress.lastAccessedAt))
    .limit(limit)
    .offset(offset);

  return result;
};

// =============================================================================
// USER PROGRESS ACCESS CONTROL QUERIES
// =============================================================================

/**
 * Get user progress accessible to user based on role and ownership
 */
export const getAccessibleUserProgress = async (
  userId: string,
  userRole: string,
  options: {
    courseId?: string;
    sectionId?: string;
  } = {}
): Promise<UserProgress[]> => {
  // Users can always access their own progress
  if (userRole === "employee" || userRole === "hr_admin") {
    return getUserProgressByUser(userId, options);
  }

  // Safety admins can access all progress
  if (userRole === "safety_admin") {
    return getUserProgressByUser(userId, options);
  }

  // Plant managers can access progress in their plant
  if (userRole === "plant_manager") {
    return getUserProgressByUser(userId, options);
  }

  // Default: users can only access their own progress
  return getUserProgressByUser(userId, options);
};

/**
 * Check if user can access a specific progress record
 */
export const canUserAccessProgress = async (
  progressId: string,
  userId: string,
  userRole: string
): Promise<boolean> => {
  const progress = await getUserProgressById(progressId);
  if (!progress) return false;

  // Users can always access their own progress
  if (progress.userId === userId) return true;

  // Safety admins can access all progress
  if (userRole === "safety_admin") return true;

  // Plant managers can access progress in their plant
  if (userRole === "plant_manager") return true;

  // HR admins can view progress in their plant
  if (userRole === "hr_admin") return true;

  return false;
};
