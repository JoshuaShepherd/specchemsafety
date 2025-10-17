import { ActivityEvent, NewActivityEvent } from "../db/schema/activity-events";
import { QuestionEvent, NewQuestionEvent } from "../db/schema/question-events";
import {
  ActivityEvent as ActivityEventSchema,
  CreateActivityEvent,
  UpdateActivityEvent,
} from "../validations/safety-business";

// Re-export ActivityEventSchema for use in other modules
export type { ActivityEventSchema };
import {
  QuestionEvent as QuestionEventSchema,
  CreateQuestionEvent,
  UpdateQuestionEvent,
} from "../validations/safety-business";
import { mapPlantToApiResponse } from "./plant-mappers";

/**
 * Activity Event Data Mappers
 * Handles transformation between activity and question event database entities and API responses
 * Includes audit trail and compliance tracking functionality
 */

// =============================================================================
// ACTIVITY EVENT DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps activity event database entity to API response
 */
// Map database event types to API event types
const mapEventType = (eventType: string): ActivityEventSchema["type"] => {
  switch (eventType) {
    case "view_section":
      return "other";
    case "start_course":
      return "course_started";
    case "complete_course":
      return "course_completed";
    default:
      return "other";
  }
};

// Map API event types to database event types
const mapApiEventTypeToDb = (apiType: ActivityEventSchema["type"]): "view_section" | "start_course" | "complete_course" => {
  switch (apiType) {
    case "course_started":
      return "start_course";
    case "course_completed":
      return "complete_course";
    case "other":
    default:
      return "view_section";
  }
};

export const mapActivityEventToApiResponse = (
  event: ActivityEvent,
  user?: { id: string; firstName: string; lastName: string; email: string },
  course?: { id: string; title: string },
  plant?: { id: string; name: string; isActive: boolean }
): ActivityEventSchema => ({
  id: event.id,
  userId: event.userId,
  courseId: event.courseId,
  enrollmentId: undefined, // Not in current schema
  plantId: event.plantId,
  type: mapEventType(event.eventType),
  description: undefined, // Not in current schema
  metadata: event.meta ? JSON.stringify(event.meta) : undefined,
  occurredAt: event.occurredAt.toISOString(),
  isActive: true, // Default
  createdAt: event.createdAt.toISOString(),
  updatedAt: undefined, // Not in current schema
});

/**
 * Maps multiple activity events to API responses
 */
export const mapActivityEventsToApiResponses = (
  events: ActivityEvent[],
  users?: Map<
    string,
    { id: string; firstName: string; lastName: string; email: string }
  >,
  courses?: Map<string, { id: string; title: string }>,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): ActivityEventSchema[] =>
  events.map(event => {
    const user = users?.get(event.userId);
    const course = courses?.get(event.courseId);
    const plant = plants?.get(event.plantId);
    return mapActivityEventToApiResponse(event, user, course, plant);
  });

// =============================================================================
// QUESTION EVENT DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps question event database entity to API response
 */
export const mapQuestionEventToApiResponse = (
  event: QuestionEvent,
  user?: { id: string; firstName: string; lastName: string; email: string },
  course?: { id: string; title: string },
  plant?: { id: string; name: string; isActive: boolean }
): QuestionEventSchema => ({
  id: event.id,
  userId: event.userId,
  courseId: event.courseId,
  enrollmentId: undefined, // Not in current schema
  plantId: event.plantId,
  questionId: event.questionKey, // Mapping questionKey to questionId
  type: "question_answered", // Default type - would need to be added to schema
  result: event.isCorrect ? "correct" : "incorrect",
  userAnswer: undefined, // Not in current schema
  correctAnswer: undefined, // Not in current schema
  timeSpent: undefined, // Not in current schema
  metadata: event.responseMeta ? JSON.stringify(event.responseMeta) : undefined,
  occurredAt: event.answeredAt.toISOString(),
  isActive: true, // Default
  createdAt: event.createdAt.toISOString(),
  updatedAt: undefined, // Not in current schema
});

/**
 * Maps multiple question events to API responses
 */
export const mapQuestionEventsToApiResponses = (
  events: QuestionEvent[],
  users?: Map<
    string,
    { id: string; firstName: string; lastName: string; email: string }
  >,
  courses?: Map<string, { id: string; title: string }>,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): QuestionEventSchema[] =>
  events.map(event => {
    const user = users?.get(event.userId);
    const course = courses?.get(event.courseId);
    const plant = plants?.get(event.plantId);
    return mapQuestionEventToApiResponse(event, user, course, plant);
  });

// =============================================================================
// API REQUEST → EVENT DATABASE MAPPERS
// =============================================================================

/**
 * Maps create activity event API request to database entity
 */
export const mapCreateActivityEventRequestToDb = (
  request: CreateActivityEvent
): NewActivityEvent => ({
  userId: request.userId,
  courseId: request.courseId || "",
  plantId: request.plantId,
  eventType: mapApiEventTypeToDb(request.type),
  meta: request.metadata ? JSON.parse(request.metadata) : null,
  occurredAt: request.occurredAt ? new Date(request.occurredAt) : new Date(),
});

/**
 * Maps create question event API request to database entity
 */
export const mapCreateQuestionEventRequestToDb = (
  request: CreateQuestionEvent
): NewQuestionEvent => ({
  userId: request.userId,
  courseId: request.courseId,
  plantId: request.plantId,
  sectionKey: "", // Would need to be provided in request
  questionKey: request.questionId,
  isCorrect: request.result === "correct",
  attemptIndex: 1, // Default
  responseMeta: request.metadata ? JSON.parse(request.metadata) : null,
  answeredAt: request.occurredAt ? new Date(request.occurredAt) : new Date(),
});

// =============================================================================
// AUDIT TRAIL MAPPERS
// =============================================================================

/**
 * Audit trail entry
 */
export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  plantId: string;
  plantName: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Maps activity events to audit trail entries
 */
export const mapActivityEventsToAuditTrail = (
  events: ActivityEvent[],
  users?: Map<
    string,
    { id: string; firstName: string; lastName: string; email: string }
  >,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): AuditTrailEntry[] => {
  return events.map(event => {
    const user = users?.get(event.userId);
    const plant = plants?.get(event.plantId);

    return {
      id: event.id,
      timestamp: event.occurredAt.toISOString(),
      userId: event.userId,
      userName: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
      action: event.eventType,
      resource: "course",
      resourceId: event.courseId,
      plantId: event.plantId,
      plantName: plant?.name || "Unknown Plant",
      details: event.meta || {},
    };
  });
};

// =============================================================================
// COMPLIANCE TRACKING MAPPERS
// =============================================================================

/**
 * Compliance tracking summary
 */
export interface ComplianceTracking {
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
    complianceRate: number;
  };
  courseCompliance: Array<{
    courseId: string;
    courseTitle: string;
    required: boolean;
    totalAssigned: number;
    completed: number;
    overdue: number;
    complianceRate: number;
  }>;
  userCompliance: Array<{
    userId: string;
    userName: string;
    department?: string;
    jobTitle?: string;
    totalRequired: number;
    completed: number;
    overdue: number;
    complianceStatus: "compliant" | "non_compliant" | "overdue";
    lastActivity?: string;
  }>;
  lastUpdated: string;
}

/**
 * Maps activity data to compliance tracking summary
 */
export const mapActivityToComplianceTracking = (
  plant: { id: string; name: string; isActive: boolean },
  complianceData: {
    totalUsers: number;
    compliantUsers: number;
    nonCompliantUsers: number;
    overdueUsers: number;
    courseCompliance: Array<{
      courseId: string;
      courseTitle: string;
      required: boolean;
      totalAssigned: number;
      completed: number;
      overdue: number;
    }>;
    userCompliance: Array<{
      userId: string;
      userName: string;
      department?: string;
      jobTitle?: string;
      totalRequired: number;
      completed: number;
      overdue: number;
      lastActivity?: Date;
    }>;
  }
): ComplianceTracking => ({
  plant,
  summary: {
    ...complianceData,
    complianceRate:
      complianceData.totalUsers > 0
        ? (complianceData.compliantUsers / complianceData.totalUsers) * 100
        : 0,
  },
  courseCompliance: complianceData.courseCompliance.map(course => ({
    ...course,
    complianceRate:
      course.totalAssigned > 0
        ? (course.completed / course.totalAssigned) * 100
        : 0,
  })),
  userCompliance: complianceData.userCompliance.map(user => ({
    ...user,
    complianceStatus:
      user.overdue > 0
        ? "overdue"
        : user.completed === user.totalRequired
          ? "compliant"
          : "non_compliant",
    lastActivity: user.lastActivity?.toISOString(),
  })),
  lastUpdated: new Date().toISOString(),
});

// =============================================================================
// PLANT-SCOPED EVENT MAPPERS
// =============================================================================

/**
 * Plant-scoped event list response
 */
export interface PlantScopedEventResponse {
  events: ActivityEventSchema[];
  plant: {
    id: string;
    name: string;
    isActive: boolean;
  };
  statistics: {
    total: number;
    byType: Record<string, number>;
    byUser: Array<{
      userId: string;
      userName: string;
      eventCount: number;
      lastActivity: string;
    }>;
  };
  pagination?: {
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Maps activity events to plant-scoped response
 */
export const mapActivityEventsToPlantScopedResponse = (
  events: ActivityEvent[],
  plant: { id: string; name: string; isActive: boolean },
  statistics: {
    total: number;
    byType: Record<string, number>;
    byUser: Array<{
      userId: string;
      userName: string;
      eventCount: number;
      lastActivity: Date;
    }>;
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
): PlantScopedEventResponse => ({
  events: mapActivityEventsToApiResponses(
    events,
    users,
    courses,
    new Map([[plant.id, plant]])
  ),
  plant,
  statistics: {
    ...statistics,
    byUser: statistics.byUser.map(user => ({
      ...user,
      lastActivity: user.lastActivity.toISOString(),
    })),
  },
  pagination,
});

// =============================================================================
// ROLE-BASED EVENT ACCESS MAPPERS
// =============================================================================

/**
 * Event access validation result
 */
export interface EventAccessResult {
  hasAccess: boolean;
  events?: ActivityEventSchema[];
  reason?: string;
  permissions?: {
    canView: boolean;
    canCreate: boolean;
    canViewAuditTrail: boolean;
    canViewCompliance: boolean;
  };
}

/**
 * Validates and maps event access based on user role and plant
 */
export const validateAndMapEventAccess = (
  events: ActivityEvent[],
  userRole: string,
  userPlantId: string,
  users?: Map<
    string,
    { id: string; firstName: string; lastName: string; email: string }
  >,
  courses?: Map<string, { id: string; title: string }>,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): EventAccessResult => {
  // Safety admins can access all events
  if (userRole === "safety_admin") {
    return {
      hasAccess: true,
      events: mapActivityEventsToApiResponses(events, users, courses, plants),
      permissions: {
        canView: true,
        canCreate: true,
        canViewAuditTrail: true,
        canViewCompliance: true,
      },
    };
  }

  // Plant managers can access events in their plant
  if (userRole === "plant_manager") {
    const plantEvents = events.filter(event => event.plantId === userPlantId);
    return {
      hasAccess: true,
      events: mapActivityEventsToApiResponses(
        plantEvents,
        users,
        courses,
        plants
      ),
      permissions: {
        canView: true,
        canCreate: true,
        canViewAuditTrail: true,
        canViewCompliance: true,
      },
    };
  }

  // HR admins can view events and compliance in their plant
  if (userRole === "hr_admin") {
    const plantEvents = events.filter(event => event.plantId === userPlantId);
    return {
      hasAccess: true,
      events: mapActivityEventsToApiResponses(
        plantEvents,
        users,
        courses,
        plants
      ),
      permissions: {
        canView: true,
        canCreate: false,
        canViewAuditTrail: false,
        canViewCompliance: true,
      },
    };
  }

  // Safety instructors can view events in their plant
  if (userRole === "safety_instructor") {
    const plantEvents = events.filter(event => event.plantId === userPlantId);
    return {
      hasAccess: true,
      events: mapActivityEventsToApiResponses(
        plantEvents,
        users,
        courses,
        plants
      ),
      permissions: {
        canView: true,
        canCreate: true,
        canViewAuditTrail: false,
        canViewCompliance: false,
      },
    };
  }

  // Employees can view their own events
  const userEvents = events.filter(event => event.userId === userPlantId); // Would need actual user ID
  if (userEvents.length > 0) {
    return {
      hasAccess: true,
      events: mapActivityEventsToApiResponses(
        userEvents,
        users,
        courses,
        plants
      ),
      permissions: {
        canView: true,
        canCreate: false,
        canViewAuditTrail: false,
        canViewCompliance: false,
      },
    };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to view these events",
  };
};

// =============================================================================
// EVENT SEARCH AND FILTERING MAPPERS
// =============================================================================

/**
 * Event search criteria
 */
export interface EventSearchCriteria {
  query?: string;
  type?: string;
  userId?: string;
  courseId?: string;
  plantId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  includeMetadata?: boolean;
}

/**
 * Maps search criteria to database query filters
 */
export const mapEventSearchCriteriaToDbFilters = (
  criteria: EventSearchCriteria,
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
  if (criteria.type) {
    where.eventType = criteria.type;
  }

  if (criteria.userId) {
    where.userId = criteria.userId;
  }

  if (criteria.courseId) {
    where.courseId = criteria.courseId;
  }

  if (criteria.dateRange) {
    where.occurredAt = {
      gte: new Date(criteria.dateRange.start),
      lte: new Date(criteria.dateRange.end),
    };
  }

  return { where, plantScope };
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// All types are exported as interfaces above
