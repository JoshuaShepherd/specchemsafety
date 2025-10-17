import { Profile } from "../db/schema/profiles";
import { Course } from "../db/schema/courses";
import { Enrollment } from "../db/schema/enrollments";
import { Progress } from "../db/schema/progress";
import { ActivityEvent } from "../db/schema/activity-events";
import { QuestionEvent } from "../db/schema/question-events";

/**
 * Compliance Tracking and Audit Trail Mappers
 * Handles compliance monitoring, reporting, and audit trail generation
 * Provides comprehensive tracking for safety training requirements
 */

// =============================================================================
// COMPLIANCE TRACKING MAPPERS
// =============================================================================

/**
 * Compliance status types
 */
export type ComplianceStatus =
  | "compliant"
  | "non_compliant"
  | "overdue"
  | "expiring"
  | "unknown";

/**
 * Individual compliance record
 */
export interface ComplianceRecord {
  userId: string;
  userName: string;
  userEmail: string;
  department?: string;
  jobTitle?: string;
  plantId: string;
  plantName: string;
  courseId: string;
  courseName: string;
  enrollmentId: string;
  status: ComplianceStatus;
  enrolledAt: string;
  completedAt?: string;
  expiresAt?: string;
  daysUntilExpiration?: number;
  daysOverdue?: number;
  score?: number;
  attempts: number;
  lastActivity?: string;
  isRequired: boolean;
}

/**
 * Maps enrollment and progress data to compliance record
 */
export const mapToComplianceRecord = (
  enrollment: Enrollment,
  progress?: Progress,
  user?: Profile,
  course?: Course,
  plant?: { id: string; name: string; isActive: boolean },
  isRequired: boolean = false
): ComplianceRecord => {
  const now = new Date();
  const enrolledAt = enrollment.enrolledAt;
  const completedAt = enrollment.completedAt;

  // Calculate compliance status
  let status: ComplianceStatus = "unknown";
  let daysUntilExpiration: number | undefined;
  let daysOverdue: number | undefined;

  if (enrollment.status === "completed") {
    status = "compliant";
  } else if (enrollment.status === "in_progress") {
    status = "non_compliant";
  } else if (enrollment.status === "enrolled") {
    status = "non_compliant";
  }

  // Calculate expiration (would need expiresAt field in enrollment schema)
  // For now, we'll use a placeholder
  const expiresAt = undefined; // Would be enrollment.expiresAt

  if (expiresAt) {
    const expirationDate = new Date(expiresAt);
    const daysDiff = Math.ceil(
      (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff < 0) {
      status = "overdue";
      daysOverdue = Math.abs(daysDiff);
    } else if (daysDiff <= 30) {
      status = "expiring";
      daysUntilExpiration = daysDiff;
    } else if (status === "compliant") {
      daysUntilExpiration = daysDiff;
    }
  }

  return {
    userId: enrollment.userId,
    userName: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
    userEmail: user?.email || "unknown@example.com",
    department: undefined, // Not in current schema
    jobTitle: user?.jobTitle,
    plantId: enrollment.plantId,
    plantName: plant?.name || "Unknown Plant",
    courseId: enrollment.courseId,
    courseName: course?.title || "Unknown Course",
    enrollmentId: enrollment.id,
    status,
    enrolledAt: enrolledAt.toISOString(),
    completedAt: completedAt?.toISOString(),
    expiresAt: expiresAt,
    daysUntilExpiration,
    daysOverdue,
    score: undefined, // Not in current schema
    attempts: 0, // Not in current schema
    lastActivity: progress?.lastActiveAt.toISOString(),
    isRequired,
  };
};

/**
 * Plant-level compliance summary
 */
export interface PlantComplianceSummary {
  plant: {
    id: string;
    name: string;
    isActive: boolean;
  };
  summary: {
    totalUsers: number;
    compliantUsers: number;
    nonCompliantUsers: number;
    overdueUsers: number;
    expiringUsers: number;
    overallComplianceRate: number;
  };
  byCourse: Array<{
    courseId: string;
    courseName: string;
    totalEnrollments: number;
    completed: number;
    overdue: number;
    expiring: number;
    complianceRate: number;
  }>;
  byDepartment?: Array<{
    department: string;
    totalUsers: number;
    compliantUsers: number;
    complianceRate: number;
  }>;
  lastUpdated: string;
}

/**
 * Maps plant data to compliance summary
 */
export const mapPlantDataToComplianceSummary = (
  plant: { id: string; name: string; isActive: boolean },
  complianceRecords: ComplianceRecord[]
): PlantComplianceSummary => {
  const plantRecords = complianceRecords.filter(
    record => record.plantId === plant.id
  );

  // Calculate summary statistics
  const uniqueUsers = new Set(plantRecords.map(record => record.userId));
  const totalUsers = uniqueUsers.size;

  const compliantUsers = new Set(
    plantRecords
      .filter(record => record.status === "compliant")
      .map(record => record.userId)
  ).size;

  const nonCompliantUsers = new Set(
    plantRecords
      .filter(record => record.status === "non_compliant")
      .map(record => record.userId)
  ).size;

  const overdueUsers = new Set(
    plantRecords
      .filter(record => record.status === "overdue")
      .map(record => record.userId)
  ).size;

  const expiringUsers = new Set(
    plantRecords
      .filter(record => record.status === "expiring")
      .map(record => record.userId)
  ).size;

  const overallComplianceRate =
    totalUsers > 0 ? (compliantUsers / totalUsers) * 100 : 0;

  // Group by course
  const courseGroups = plantRecords.reduce(
    (acc, record) => {
      if (!acc[record.courseId]) {
        acc[record.courseId] = {
          courseId: record.courseId,
          courseName: record.courseName,
          totalEnrollments: 0,
          completed: 0,
          overdue: 0,
          expiring: 0,
        };
      }

      acc[record.courseId].totalEnrollments++;

      switch (record.status) {
        case "compliant":
          acc[record.courseId].completed++;
          break;
        case "overdue":
          acc[record.courseId].overdue++;
          break;
        case "expiring":
          acc[record.courseId].expiring++;
          break;
      }

      return acc;
    },
    {} as Record<string, any>
  );

  const byCourse = Object.values(courseGroups).map((course: any) => ({
    ...course,
    complianceRate:
      course.totalEnrollments > 0
        ? (course.completed / course.totalEnrollments) * 100
        : 0,
  }));

  return {
    plant,
    summary: {
      totalUsers,
      compliantUsers,
      nonCompliantUsers,
      overdueUsers,
      expiringUsers,
      overallComplianceRate,
    },
    byCourse,
    lastUpdated: new Date().toISOString(),
  };
};

// =============================================================================
// AUDIT TRAIL MAPPERS
// =============================================================================

/**
 * Audit trail entry
 */
export interface ComplianceAuditTrailEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  plantId: string;
  plantName: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

/**
 * Maps activity events to audit trail entries
 */
export const mapComplianceActivityEventsToAuditTrail = (
  events: ActivityEvent[],
  users?: Map<string, Profile>,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): ComplianceAuditTrailEntry[] => {
  return events.map(event => {
    const user = users?.get(event.userId);
    const plant = plants?.get(event.plantId);

    return {
      id: event.id,
      timestamp: event.occurredAt.toISOString(),
      userId: event.userId,
      userName: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
      userEmail: user?.email || "unknown@example.com",
      action: event.eventType,
      resource: "course",
      resourceId: event.courseId,
      plantId: event.plantId,
      plantName: plant?.name || "Unknown Plant",
      details: event.meta || {},
    };
  });
};

/**
 * Question event audit trail entry
 */
export interface QuestionAuditTrailEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  plantId: string;
  plantName: string;
  questionId: string;
  sectionKey: string;
  isCorrect: boolean;
  attemptIndex: number;
  timeSpent?: number;
  userAnswer?: string;
  correctAnswer?: string;
  metadata?: Record<string, any>;
}

/**
 * Maps question events to audit trail entries
 */
export const mapQuestionEventsToAuditTrail = (
  events: QuestionEvent[],
  users?: Map<string, Profile>,
  courses?: Map<string, Course>,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): QuestionAuditTrailEntry[] => {
  return events.map(event => {
    const user = users?.get(event.userId);
    const course = courses?.get(event.courseId);
    const plant = plants?.get(event.plantId);

    return {
      id: event.id,
      timestamp: event.answeredAt.toISOString(),
      userId: event.userId,
      userName: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
      courseId: event.courseId,
      courseName: course?.title || "Unknown Course",
      plantId: event.plantId,
      plantName: plant?.name || "Unknown Plant",
      questionId: event.questionKey,
      sectionKey: event.sectionKey,
      isCorrect: event.isCorrect,
      attemptIndex: event.attemptIndex,
      metadata: event.responseMeta || {},
    };
  });
};

// =============================================================================
// COMPLIANCE REPORTING MAPPERS
// =============================================================================

/**
 * Compliance report types
 */
export type ComplianceReportType =
  | "overall_summary"
  | "plant_summary"
  | "course_summary"
  | "user_summary"
  | "overdue_training"
  | "expiring_training"
  | "completion_rates"
  | "audit_trail";

/**
 * Compliance report configuration
 */
export interface ComplianceReportConfig {
  type: ComplianceReportType;
  plantId?: string;
  courseId?: string;
  userId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeDetails?: boolean;
  groupBy?: "plant" | "course" | "user" | "department" | "date";
}

/**
 * Compliance report result
 */
export interface ComplianceReportResult {
  config: ComplianceReportConfig;
  generatedAt: string;
  generatedBy: string;
  data: any;
  summary?: {
    totalRecords: number;
    filteredRecords: number;
    complianceRate?: number;
    averageScore?: number;
  };
  metadata?: Record<string, any>;
}

/**
 * Maps compliance data to report format
 */
export const mapComplianceDataToReport = (
  config: ComplianceReportConfig,
  complianceRecords: ComplianceRecord[],
  generatedBy: string,
  additionalData?: any
): ComplianceReportResult => {
  let filteredRecords = complianceRecords;

  // Apply filters based on config
  if (config.plantId) {
    filteredRecords = filteredRecords.filter(
      record => record.plantId === config.plantId
    );
  }

  if (config.courseId) {
    filteredRecords = filteredRecords.filter(
      record => record.courseId === config.courseId
    );
  }

  if (config.userId) {
    filteredRecords = filteredRecords.filter(
      record => record.userId === config.userId
    );
  }

  if (config.dateRange) {
    filteredRecords = filteredRecords.filter(record => {
      const recordDate = new Date(record.enrolledAt);
      return (
        recordDate >= config.dateRange!.start &&
        recordDate <= config.dateRange!.end
      );
    });
  }

  // Calculate summary statistics
  const totalRecords = complianceRecords.length;
  const filteredCount = filteredRecords.length;

  const compliantRecords = filteredRecords.filter(
    record => record.status === "compliant"
  );
  const complianceRate =
    filteredCount > 0 ? (compliantRecords.length / filteredCount) * 100 : 0;

  const scores = filteredRecords
    .map(record => record.score)
    .filter(score => score !== undefined) as number[];
  const averageScore =
    scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : undefined;

  return {
    config,
    generatedAt: new Date().toISOString(),
    generatedBy,
    data: filteredRecords,
    summary: {
      totalRecords,
      filteredRecords: filteredCount,
      complianceRate,
      averageScore,
    },
    metadata: additionalData,
  };
};

// =============================================================================
// EXPIRATION AND RENEWAL MAPPERS
// =============================================================================

/**
 * Training expiration alert
 */
export interface ExpirationAlert {
  id: string;
  type: "expiring" | "expired" | "overdue";
  severity: "low" | "medium" | "high" | "critical";
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  plantId: string;
  plantName: string;
  enrollmentId: string;
  expiresAt: string;
  daysUntilExpiration?: number;
  daysOverdue?: number;
  isRequired: boolean;
  createdAt: string;
}

/**
 * Maps compliance records to expiration alerts
 */
export const mapComplianceRecordsToExpirationAlerts = (
  complianceRecords: ComplianceRecord[]
): ExpirationAlert[] => {
  const alerts: ExpirationAlert[] = [];

  complianceRecords.forEach(record => {
    if (record.status === "expiring" || record.status === "overdue") {
      const severity =
        record.status === "overdue"
          ? record.daysOverdue! > 30
            ? "critical"
            : "high"
          : record.daysUntilExpiration! <= 7
            ? "high"
            : "medium";

      alerts.push({
        id: `${record.enrollmentId}-expiration`,
        type: record.status === "overdue" ? "expired" : "expiring",
        severity,
        userId: record.userId,
        userName: record.userName,
        userEmail: record.userEmail,
        courseId: record.courseId,
        courseName: record.courseName,
        plantId: record.plantId,
        plantName: record.plantName,
        enrollmentId: record.enrollmentId,
        expiresAt: record.expiresAt || "",
        daysUntilExpiration: record.daysUntilExpiration,
        daysOverdue: record.daysOverdue,
        isRequired: record.isRequired,
        createdAt: new Date().toISOString(),
      });
    }
  });

  return alerts;
};

// =============================================================================
// COMPLIANCE DASHBOARD MAPPERS
// =============================================================================

/**
 * Compliance dashboard data
 */
export interface ComplianceDashboard {
  overview: {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    overallComplianceRate: number;
    overdueCount: number;
    expiringCount: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    userId: string;
    userName: string;
  }>;
  topCourses: Array<{
    courseId: string;
    courseName: string;
    enrollmentCount: number;
    completionRate: number;
    averageScore?: number;
  }>;
  complianceTrends: Array<{
    date: string;
    compliant: number;
    nonCompliant: number;
    overdue: number;
  }>;
  plantSummary: Array<{
    plantId: string;
    plantName: string;
    userCount: number;
    complianceRate: number;
    overdueCount: number;
  }>;
  lastUpdated: string;
}

/**
 * Maps compliance data to dashboard format
 */
export const mapComplianceDataToDashboard = (
  complianceRecords: ComplianceRecord[],
  recentActivity: ActivityEvent[],
  users?: Map<string, Profile>
): ComplianceDashboard => {
  const uniqueUsers = new Set(complianceRecords.map(record => record.userId));
  const uniqueCourses = new Set(
    complianceRecords.map(record => record.courseId)
  );
  const totalEnrollments = complianceRecords.length;

  const compliantUsers = new Set(
    complianceRecords
      .filter(record => record.status === "compliant")
      .map(record => record.userId)
  ).size;

  const overdueCount = complianceRecords.filter(
    record => record.status === "overdue"
  ).length;
  const expiringCount = complianceRecords.filter(
    record => record.status === "expiring"
  ).length;
  const overallComplianceRate =
    uniqueUsers.size > 0 ? (compliantUsers / uniqueUsers.size) * 100 : 0;

  // Recent activity
  const recentActivityMapped = recentActivity.slice(0, 10).map(event => {
    const user = users?.get(event.userId);
    return {
      id: event.id,
      type: event.eventType,
      description: `${event.eventType.replace("_", " ")}`,
      timestamp: event.occurredAt.toISOString(),
      userId: event.userId,
      userName: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
    };
  });

  // Top courses
  const courseStats = complianceRecords.reduce(
    (acc, record) => {
      if (!acc[record.courseId]) {
        acc[record.courseId] = {
          courseId: record.courseId,
          courseName: record.courseName,
          enrollmentCount: 0,
          completedCount: 0,
          totalScore: 0,
          scoreCount: 0,
        };
      }

      acc[record.courseId].enrollmentCount++;

      if (record.status === "compliant") {
        acc[record.courseId].completedCount++;
      }

      if (record.score !== undefined) {
        acc[record.courseId].totalScore += record.score;
        acc[record.courseId].scoreCount++;
      }

      return acc;
    },
    {} as Record<string, any>
  );

  const topCourses = Object.values(courseStats)
    .map((course: any) => ({
      courseId: course.courseId,
      courseName: course.courseName,
      enrollmentCount: course.enrollmentCount,
      completionRate: (course.completedCount / course.enrollmentCount) * 100,
      averageScore:
        course.scoreCount > 0
          ? course.totalScore / course.scoreCount
          : undefined,
    }))
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, 5);

  // Plant summary
  const plantStats = complianceRecords.reduce(
    (acc, record) => {
      if (!acc[record.plantId]) {
        acc[record.plantId] = {
          plantId: record.plantId,
          plantName: record.plantName,
          users: new Set(),
          compliantUsers: new Set(),
          overdueCount: 0,
        };
      }

      acc[record.plantId].users.add(record.userId);

      if (record.status === "compliant") {
        acc[record.plantId].compliantUsers.add(record.userId);
      }

      if (record.status === "overdue") {
        acc[record.plantId].overdueCount++;
      }

      return acc;
    },
    {} as Record<string, any>
  );

  const plantSummary = Object.values(plantStats).map((plant: any) => ({
    plantId: plant.plantId,
    plantName: plant.plantName,
    userCount: plant.users.size,
    complianceRate:
      plant.users.size > 0
        ? (plant.compliantUsers.size / plant.users.size) * 100
        : 0,
    overdueCount: plant.overdueCount,
  }));

  return {
    overview: {
      totalUsers: uniqueUsers.size,
      totalCourses: uniqueCourses.size,
      totalEnrollments,
      overallComplianceRate,
      overdueCount,
      expiringCount,
    },
    recentActivity: recentActivityMapped,
    topCourses,
    complianceTrends: [], // Would need historical data
    plantSummary,
    lastUpdated: new Date().toISOString(),
  };
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// All types are exported above where they are declared
