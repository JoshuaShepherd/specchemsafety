import { Course, NewCourse } from "../db/schema/courses";
import {
  Course as CourseSchema,
  CreateCourse,
  UpdateCourse,
} from "../validations/safety-business";

// Re-export CourseSchema for use in other modules
export type { CourseSchema };
import { mapPlantToApiResponse } from "./plant-mappers";

/**
 * Course Data Mappers
 * Handles transformation between course database entities and API responses
 * Includes plant-based scoping and role-based access control
 */

// =============================================================================
// COURSE DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps course database entity to API response
 * Note: Current schema is minimal, will need to be extended
 */
export const mapCourseToApiResponse = (
  course: Course,
  plant?: { id: string; name: string; isActive: boolean }
): CourseSchema => ({
  id: course.id,
  plantId: plant?.id || "", // Not in current schema, would need to be added
  name: course.title, // Mapping title to name
  description: undefined, // Not in current schema
  type: "safety_training", // Default type - would need to be added to schema
  status: course.isPublished ? "active" : "draft",
  difficultyLevel: "beginner", // Default - would need to be added to schema
  duration: undefined, // Not in current schema
  isRequired: false, // Default - would need to be added to schema
  completionCriteria: undefined, // Not in current schema
  prerequisites: undefined, // Not in current schema
  isActive: course.isPublished,
  createdAt: course.createdAt.toISOString(),
  updatedAt: course.updatedAt.toISOString(),
});

/**
 * Maps multiple courses to API responses
 */
export const mapCoursesToApiResponses = (
  courses: Course[],
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): CourseSchema[] =>
  courses.map(course => {
    const plant = plants?.get(""); // Would need plantId in course schema
    return mapCourseToApiResponse(course, plant);
  });

// =============================================================================
// API REQUEST → COURSE DATABASE MAPPERS
// =============================================================================

/**
 * Maps create course API request to database entity
 */
export const mapCreateCourseRequestToDb = (
  request: CreateCourse
): NewCourse => ({
  slug: request.name.toLowerCase().replace(/\s+/g, "-"), // Generate slug from name
  title: request.name,
  version: "1.0",
  isPublished: request.status === "active",
});

/**
 * Maps update course API request to database entity
 */
export const mapUpdateCourseRequestToDb = (
  request: UpdateCourse,
  existingCourse: Course
): Partial<Course> => ({
  ...existingCourse,
  title: request.name ?? existingCourse.title,
  isPublished: request.status === "active" ? true : existingCourse.isPublished,
  updatedAt: new Date(),
});

// =============================================================================
// PLANT-SCOPED COURSE MAPPERS
// =============================================================================

/**
 * Plant-scoped course list response
 */
export interface PlantScopedCourseResponse {
  courses: CourseSchema[];
  plant: {
    id: string;
    name: string;
    isActive: boolean;
  };
  total: number;
  pagination?: {
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Maps courses to plant-scoped response
 */
export const mapCoursesToPlantScopedResponse = (
  courses: Course[],
  plant: { id: string; name: string; isActive: boolean },
  total: number,
  pagination?: {
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
): PlantScopedCourseResponse => ({
  courses: mapCoursesToApiResponses(courses, new Map([[plant.id, plant]])),
  plant,
  total,
  pagination,
});

// =============================================================================
// ROLE-BASED COURSE ACCESS MAPPERS
// =============================================================================

/**
 * Course access validation result
 */
export interface CourseAccessResult {
  hasAccess: boolean;
  course?: CourseSchema;
  reason?: string;
  permissions?: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canManageEnrollments: boolean;
  };
}

/**
 * Validates and maps course access based on user role and plant
 */
export const validateAndMapCourseAccess = (
  course: Course,
  userRole: string,
  userPlantId: string,
  plant?: { id: string; name: string; isActive: boolean }
): CourseAccessResult => {
  // Safety admins can access all courses
  if (userRole === "safety_admin") {
    return {
      hasAccess: true,
      course: mapCourseToApiResponse(course, plant),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canManageEnrollments: true,
      },
    };
  }

  // Plant managers can access courses in their plant
  if (userRole === "plant_manager" && plant?.id === userPlantId) {
    return {
      hasAccess: true,
      course: mapCourseToApiResponse(course, plant),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canManageEnrollments: true,
      },
    };
  }

  // Safety instructors can manage courses in their plant
  if (userRole === "safety_instructor" && plant?.id === userPlantId) {
    return {
      hasAccess: true,
      course: mapCourseToApiResponse(course, plant),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: false,
        canManageEnrollments: false,
      },
    };
  }

  // HR admins can view courses and manage enrollments in their plant
  if (userRole === "hr_admin" && plant?.id === userPlantId) {
    return {
      hasAccess: true,
      course: mapCourseToApiResponse(course, plant),
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canManageEnrollments: true,
      },
    };
  }

  // Employees can view courses in their plant
  if (userRole === "employee" && plant?.id === userPlantId) {
    return {
      hasAccess: true,
      course: mapCourseToApiResponse(course, plant),
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canManageEnrollments: false,
      },
    };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to this course",
  };
};

/**
 * Filters courses based on user access permissions
 */
export const filterCoursesByAccess = (
  courses: Course[],
  userRole: string,
  userPlantId: string,
  plants?: Map<string, { id: string; name: string; isActive: boolean }>
): CourseAccessResult[] => {
  return courses
    .map(course => {
      const plant = plants?.get(""); // Would need plantId in course schema
      return validateAndMapCourseAccess(course, userRole, userPlantId, plant);
    })
    .filter(result => result.hasAccess);
};

// =============================================================================
// COURSE SEARCH AND FILTERING MAPPERS
// =============================================================================

/**
 * Course search criteria
 */
export interface CourseSearchCriteria {
  query?: string;
  type?: string;
  status?: string;
  difficultyLevel?: string;
  isRequired?: boolean;
  plantId?: string;
}

/**
 * Maps search criteria to database query filters
 */
export const mapCourseSearchCriteriaToDbFilters = (
  criteria: CourseSearchCriteria,
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

  // Apply other filters (would need to be added to schema)
  if (criteria.query) {
    where.or = [
      { title: { contains: criteria.query } },
      { slug: { contains: criteria.query } },
    ];
  }

  if (criteria.status) {
    where.isPublished = criteria.status === "active";
  }

  return { where, plantScope };
};

// =============================================================================
// COURSE STATISTICS MAPPERS
// =============================================================================

/**
 * Course statistics
 */
export interface CourseStatistics {
  course: CourseSchema;
  totalEnrollments: number;
  completedEnrollments: number;
  inProgressEnrollments: number;
  averageScore?: number;
  averageCompletionTime?: number; // in minutes
  lastActivity?: string;
}

/**
 * Maps course to statistics response
 */
export const mapCourseToStatistics = (
  course: Course,
  stats: {
    totalEnrollments: number;
    completedEnrollments: number;
    inProgressEnrollments: number;
    averageScore?: number;
    averageCompletionTime?: number;
    lastActivity?: Date;
  },
  plant?: { id: string; name: string; isActive: boolean }
): CourseStatistics => ({
  course: mapCourseToApiResponse(course, plant),
  totalEnrollments: stats.totalEnrollments,
  completedEnrollments: stats.completedEnrollments,
  inProgressEnrollments: stats.inProgressEnrollments,
  averageScore: stats.averageScore,
  averageCompletionTime: stats.averageCompletionTime,
  lastActivity: stats.lastActivity?.toISOString(),
});

// =============================================================================
// COURSE CONTENT MAPPERS
// =============================================================================

/**
 * Course content structure
 */
export interface CourseContent {
  course: CourseSchema;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    order: number;
    duration?: number;
    questions?: Array<{
      id: string;
      question: string;
      type: "multiple_choice" | "true_false" | "text";
      options?: string[];
      correctAnswer: string;
      explanation?: string;
    }>;
  }>;
}

/**
 * Maps course to content response (would need content schema)
 */
export const mapCourseToContent = (
  course: Course,
  content?: any, // Would need proper content schema
  plant?: { id: string; name: string; isActive: boolean }
): CourseContent => ({
  course: mapCourseToApiResponse(course, plant),
  sections: content?.sections || [],
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// All types are exported as interfaces above
