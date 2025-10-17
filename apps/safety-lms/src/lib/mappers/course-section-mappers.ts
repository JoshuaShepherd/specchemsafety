import { CourseSection, NewCourseSection } from "../db/schema/course-sections";
import { ContentBlock } from "../db/schema/content-blocks";
import { QuizQuestion } from "../db/schema/quiz-questions";
import {
  CourseSection as CourseSectionSchema,
  CreateCourseSectionRequest,
  UpdateCourseSectionRequest,
  SectionWithContentResponse,
} from "@specchem/contracts";

/**
 * Course Section Data Mappers
 * Handles transformation between course section database entities and API responses
 */

// =============================================================================
// COURSE SECTION DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps course section database entity to API response
 */
export const mapCourseSectionToApiResponse = (
  section: CourseSection
): CourseSectionSchema => ({
  id: section.id,
  courseId: section.courseId,
  sectionKey: section.sectionKey,
  title: section.title,
  orderIndex: section.orderIndex,
  iconName: section.iconName,
  isPublished: section.isPublished,
  createdAt: section.createdAt.toISOString(),
  updatedAt: section.updatedAt.toISOString(),
});

/**
 * Maps multiple course sections to API responses
 */
export const mapCourseSectionsToApiResponses = (
  sections: CourseSection[]
): CourseSectionSchema[] => sections.map(mapCourseSectionToApiResponse);

// =============================================================================
// API REQUEST → COURSE SECTION DATABASE MAPPERS
// =============================================================================

/**
 * Maps create course section API request to database entity
 */
export const mapCreateCourseSectionRequestToDb = (
  request: CreateCourseSectionRequest,
  courseId: string
): NewCourseSection => ({
  courseId,
  sectionKey: request.sectionKey,
  title: request.title,
  orderIndex: request.orderIndex,
  iconName: request.iconName,
  isPublished: request.isPublished,
});

/**
 * Maps update course section API request to database entity
 */
export const mapUpdateCourseSectionRequestToDb = (
  request: UpdateCourseSectionRequest,
  existingSection: CourseSection
): Partial<CourseSection> => ({
  ...existingSection,
  sectionKey: request.sectionKey ?? existingSection.sectionKey,
  title: request.title ?? existingSection.title,
  orderIndex: request.orderIndex ?? existingSection.orderIndex,
  iconName: request.iconName ?? existingSection.iconName,
  isPublished: request.isPublished ?? existingSection.isPublished,
  updatedAt: new Date(),
});

// =============================================================================
// SECTION WITH CONTENT MAPPERS
// =============================================================================

/**
 * Maps section with content blocks and quiz questions to API response
 */
export const mapSectionWithContentToApiResponse = (
  section: CourseSection,
  contentBlocks: ContentBlock[],
  quizQuestions: QuizQuestion[]
): SectionWithContentResponse["data"] => ({
  section: mapCourseSectionToApiResponse(section),
  contentBlocks: contentBlocks.map(mapContentBlockToApiResponse),
  quizQuestions: quizQuestions.map(mapQuizQuestionToApiResponse),
});

// =============================================================================
// HELPER MAPPERS FOR CONTENT BLOCKS AND QUIZ QUESTIONS
// =============================================================================

/**
 * Maps content block to API response (simplified for this context)
 */
const mapContentBlockToApiResponse = (block: ContentBlock) => ({
  id: block.id,
  sectionId: block.sectionId,
  blockType: block.blockType,
  orderIndex: block.orderIndex,
  content: block.content,
  metadata: block.metadata,
  createdAt: block.createdAt.toISOString(),
  updatedAt: block.updatedAt.toISOString(),
});

/**
 * Maps quiz question to API response (simplified for this context)
 */
const mapQuizQuestionToApiResponse = (question: QuizQuestion) => ({
  id: question.id,
  sectionId: question.sectionId,
  questionKey: question.questionKey,
  questionType: question.questionType,
  questionText: question.questionText,
  options: question.options,
  correctAnswer: question.correctAnswer,
  explanation: question.explanation,
  orderIndex: question.orderIndex,
  isPublished: question.isPublished,
  createdAt: question.createdAt.toISOString(),
  updatedAt: question.updatedAt.toISOString(),
});

// =============================================================================
// SECTION ORDERING MAPPERS
// =============================================================================

/**
 * Section ordering result
 */
export interface SectionOrderingResult {
  sections: CourseSectionSchema[];
  reordered: boolean;
  conflicts: Array<{
    sectionId: string;
    sectionKey: string;
    conflict: string;
  }>;
}

/**
 * Validates and applies section ordering
 */
export const validateAndApplySectionOrdering = (
  sections: CourseSection[],
  newOrder: Array<{ sectionId: string; orderIndex: number }>
): SectionOrderingResult => {
  const sectionMap = new Map(sections.map(s => [s.id, s]));
  const conflicts: Array<{
    sectionId: string;
    sectionKey: string;
    conflict: string;
  }> = [];
  const reorderedSections: CourseSection[] = [];

  // Check for conflicts
  const usedIndices = new Set<number>();
  for (const orderItem of newOrder) {
    const section = sectionMap.get(orderItem.sectionId);
    if (!section) {
      conflicts.push({
        sectionId: orderItem.sectionId,
        sectionKey: "",
        conflict: "Section not found",
      });
      continue;
    }

    if (usedIndices.has(orderItem.orderIndex)) {
      conflicts.push({
        sectionId: orderItem.sectionId,
        sectionKey: section.sectionKey,
        conflict: "Duplicate order index",
      });
    } else {
      usedIndices.add(orderItem.orderIndex);
      reorderedSections.push({
        ...section,
        orderIndex: orderItem.orderIndex,
        updatedAt: new Date(),
      });
    }
  }

  return {
    sections: mapCourseSectionsToApiResponses(reorderedSections),
    reordered: conflicts.length === 0,
    conflicts,
  };
};

// =============================================================================
// SECTION ACCESS VALIDATION MAPPERS
// =============================================================================

/**
 * Section access validation result
 */
export interface SectionAccessResult {
  hasAccess: boolean;
  section?: CourseSectionSchema;
  reason?: string;
  permissions?: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canManageContent: boolean;
  };
}

/**
 * Validates section access based on user role and course access
 */
export const validateSectionAccess = (
  section: CourseSection,
  userRole: string,
  courseAccess: boolean
): SectionAccessResult => {
  if (!courseAccess) {
    return {
      hasAccess: false,
      reason: "User does not have access to the course",
    };
  }

  // Safety admins can access all sections
  if (userRole === "safety_admin") {
    return {
      hasAccess: true,
      section: mapCourseSectionToApiResponse(section),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canManageContent: true,
      },
    };
  }

  // Plant managers can access sections in their plant
  if (userRole === "plant_manager") {
    return {
      hasAccess: true,
      section: mapCourseSectionToApiResponse(section),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canManageContent: true,
      },
    };
  }

  // Safety instructors can manage sections in their plant
  if (userRole === "safety_instructor") {
    return {
      hasAccess: true,
      section: mapCourseSectionToApiResponse(section),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: false,
        canManageContent: true,
      },
    };
  }

  // HR admins can view sections and manage content in their plant
  if (userRole === "hr_admin") {
    return {
      hasAccess: true,
      section: mapCourseSectionToApiResponse(section),
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canManageContent: true,
      },
    };
  }

  // Employees can view published sections
  if (userRole === "employee") {
    return {
      hasAccess: section.isPublished,
      section: section.isPublished
        ? mapCourseSectionToApiResponse(section)
        : undefined,
      permissions: {
        canView: section.isPublished,
        canEdit: false,
        canDelete: false,
        canManageContent: false,
      },
    };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to this section",
  };
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type { SectionOrderingResult, SectionAccessResult };
