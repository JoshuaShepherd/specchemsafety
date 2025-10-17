import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db } from "../index";
import {
  courseSections,
  courses,
  contentBlocks,
  quizQuestions,
  CourseSection,
  NewCourseSection,
} from "../schema";

/**
 * Course Section Query Operations
 * Handles database queries for course sections with proper access control
 */

// =============================================================================
// BASIC COURSE SECTION QUERIES
// =============================================================================

/**
 * Get course section by ID
 */
export const getCourseSectionById = async (
  sectionId: string
): Promise<CourseSection | null> => {
  const result = await db
    .select()
    .from(courseSections)
    .where(eq(courseSections.id, sectionId))
    .limit(1);

  return result[0] || null;
};

/**
 * Get course section by course ID and section key
 */
export const getCourseSectionByKey = async (
  courseId: string,
  sectionKey: string
): Promise<CourseSection | null> => {
  const result = await db
    .select()
    .from(courseSections)
    .where(
      and(
        eq(courseSections.courseId, courseId),
        eq(courseSections.sectionKey, sectionKey)
      )
    )
    .limit(1);

  return result[0] || null;
};

/**
 * Get all sections for a course
 */
export const getCourseSectionsByCourseId = async (
  courseId: string,
  options: {
    includeUnpublished?: boolean;
    sortBy?: "orderIndex" | "title" | "createdAt";
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<CourseSection[]> => {
  const {
    includeUnpublished = false,
    sortBy = "orderIndex",
    sortOrder = "asc",
  } = options;

  let whereClause = eq(courseSections.courseId, courseId);

  if (!includeUnpublished) {
    whereClause = and(whereClause, eq(courseSections.isPublished, true));
  }

  const orderBy =
    sortOrder === "desc"
      ? desc(courseSections[sortBy])
      : asc(courseSections[sortBy]);

  const result = await db
    .select()
    .from(courseSections)
    .where(whereClause)
    .orderBy(orderBy);

  return result;
};

/**
 * Get course sections with content blocks and quiz questions
 */
export const getCourseSectionWithContent = async (
  sectionId: string
): Promise<{
  section: CourseSection;
  contentBlocks: any[];
  quizQuestions: any[];
} | null> => {
  const section = await getCourseSectionById(sectionId);
  if (!section) return null;

  // Get content blocks
  const blocks = await db
    .select()
    .from(contentBlocks)
    .where(eq(contentBlocks.sectionId, sectionId))
    .orderBy(asc(contentBlocks.orderIndex));

  // Get quiz questions
  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.sectionId, sectionId))
    .orderBy(asc(quizQuestions.orderIndex));

  return {
    section,
    contentBlocks: blocks,
    quizQuestions: questions,
  };
};

// =============================================================================
// COURSE SECTION CREATION AND UPDATES
// =============================================================================

/**
 * Create a new course section
 */
export const createCourseSection = async (
  sectionData: NewCourseSection
): Promise<CourseSection> => {
  const result = await db
    .insert(courseSections)
    .values(sectionData)
    .returning();

  return result[0];
};

/**
 * Update course section
 */
export const updateCourseSection = async (
  sectionId: string,
  updates: Partial<CourseSection>
): Promise<CourseSection | null> => {
  const result = await db
    .update(courseSections)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(courseSections.id, sectionId))
    .returning();

  return result[0] || null;
};

/**
 * Delete course section
 */
export const deleteCourseSection = async (
  sectionId: string
): Promise<boolean> => {
  const result = await db
    .delete(courseSections)
    .where(eq(courseSections.id, sectionId))
    .returning();

  return result.length > 0;
};

// =============================================================================
// COURSE SECTION ORDERING OPERATIONS
// =============================================================================

/**
 * Update section order
 */
export const updateSectionOrder = async (
  sectionId: string,
  newOrderIndex: number
): Promise<CourseSection | null> => {
  const result = await db
    .update(courseSections)
    .set({
      orderIndex: newOrderIndex,
      updatedAt: new Date(),
    })
    .where(eq(courseSections.id, sectionId))
    .returning();

  return result[0] || null;
};

/**
 * Reorder multiple sections
 */
export const reorderSections = async (
  courseId: string,
  sectionOrders: Array<{ sectionId: string; orderIndex: number }>
): Promise<CourseSection[]> => {
  const results: CourseSection[] = [];

  for (const order of sectionOrders) {
    const result = await updateSectionOrder(order.sectionId, order.orderIndex);
    if (result) {
      results.push(result);
    }
  }

  return results;
};

/**
 * Get next available order index for a course
 */
export const getNextSectionOrderIndex = async (
  courseId: string
): Promise<number> => {
  const result = await db
    .select({ maxOrder: sql<number>`max(${courseSections.orderIndex})` })
    .from(courseSections)
    .where(eq(courseSections.courseId, courseId));

  return (result[0]?.maxOrder || 0) + 1;
};

// =============================================================================
// COURSE SECTION VALIDATION QUERIES
// =============================================================================

/**
 * Check if section key is unique within a course
 */
export const isSectionKeyUnique = async (
  courseId: string,
  sectionKey: string,
  excludeSectionId?: string
): Promise<boolean> => {
  let whereClause = and(
    eq(courseSections.courseId, courseId),
    eq(courseSections.sectionKey, sectionKey)
  );

  if (excludeSectionId) {
    whereClause = and(
      whereClause,
      sql`${courseSections.id} != ${excludeSectionId}`
    );
  }

  const result = await db
    .select({ id: courseSections.id })
    .from(courseSections)
    .where(whereClause)
    .limit(1);

  return result.length === 0;
};

/**
 * Check if order index is unique within a course
 */
export const isOrderIndexUnique = async (
  courseId: string,
  orderIndex: number,
  excludeSectionId?: string
): Promise<boolean> => {
  let whereClause = and(
    eq(courseSections.courseId, courseId),
    eq(courseSections.orderIndex, orderIndex)
  );

  if (excludeSectionId) {
    whereClause = and(
      whereClause,
      sql`${courseSections.id} != ${excludeSectionId}`
    );
  }

  const result = await db
    .select({ id: courseSections.id })
    .from(courseSections)
    .where(whereClause)
    .limit(1);

  return result.length === 0;
};

// =============================================================================
// COURSE SECTION STATISTICS QUERIES
// =============================================================================

/**
 * Get section statistics
 */
export const getSectionStatistics = async (
  sectionId: string
): Promise<{
  contentBlocksCount: number;
  quizQuestionsCount: number;
  publishedContentBlocks: number;
  publishedQuizQuestions: number;
} | null> => {
  const section = await getCourseSectionById(sectionId);
  if (!section) return null;

  // Count content blocks
  const contentBlocksResult = await db
    .select({
      total: sql<number>`count(*)`,
      published: sql<number>`count(*) filter (where ${contentBlocks.sectionId} = ${sectionId})`,
    })
    .from(contentBlocks)
    .where(eq(contentBlocks.sectionId, sectionId));

  // Count quiz questions
  const quizQuestionsResult = await db
    .select({
      total: sql<number>`count(*)`,
      published: sql<number>`count(*) filter (where ${quizQuestions.isPublished} = true)`,
    })
    .from(quizQuestions)
    .where(eq(quizQuestions.sectionId, sectionId));

  return {
    contentBlocksCount: contentBlocksResult[0]?.total || 0,
    quizQuestionsCount: quizQuestionsResult[0]?.total || 0,
    publishedContentBlocks: contentBlocksResult[0]?.published || 0,
    publishedQuizQuestions: quizQuestionsResult[0]?.published || 0,
  };
};

// =============================================================================
// COURSE SECTION SEARCH QUERIES
// =============================================================================

/**
 * Search course sections
 */
export const searchCourseSections = async (
  courseId: string,
  searchTerm: string,
  options: {
    includeUnpublished?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<CourseSection[]> => {
  const { includeUnpublished = false, limit = 20, offset = 0 } = options;

  let whereClause = and(
    eq(courseSections.courseId, courseId),
    sql`${courseSections.title} ilike ${`%${searchTerm}%`}`
  );

  if (!includeUnpublished) {
    whereClause = and(whereClause, eq(courseSections.isPublished, true));
  }

  const result = await db
    .select()
    .from(courseSections)
    .where(whereClause)
    .orderBy(asc(courseSections.orderIndex))
    .limit(limit)
    .offset(offset);

  return result;
};

// =============================================================================
// COURSE SECTION ACCESS CONTROL QUERIES
// =============================================================================

/**
 * Get sections accessible to user based on role and course access
 */
export const getAccessibleCourseSections = async (
  courseId: string,
  userRole: string,
  options: {
    includeUnpublished?: boolean;
  } = {}
): Promise<CourseSection[]> => {
  const { includeUnpublished = false } = options;

  // Safety admins can access all sections
  if (userRole === "safety_admin") {
    return getCourseSectionsByCourseId(courseId, { includeUnpublished: true });
  }

  // Other roles can only access published sections unless explicitly allowed
  return getCourseSectionsByCourseId(courseId, { includeUnpublished });
};

/**
 * Check if user can access a specific section
 */
export const canUserAccessSection = async (
  sectionId: string,
  userRole: string
): Promise<boolean> => {
  const section = await getCourseSectionById(sectionId);
  if (!section) return false;

  // Safety admins can access all sections
  if (userRole === "safety_admin") return true;

  // Other roles can only access published sections
  return section.isPublished;
};
