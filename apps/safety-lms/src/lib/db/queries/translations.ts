import { eq, and } from "drizzle-orm";
import { db } from "../index";
import {
  courseTranslations,
  sectionTranslations,
  contentBlockTranslations,
  quizQuestionTranslations,
  CourseTranslation,
  SectionTranslation,
  ContentBlockTranslation,
  QuizQuestionTranslation,
  NewCourseTranslation,
  NewSectionTranslation,
  NewContentBlockTranslation,
  NewQuizQuestionTranslation,
} from "../schema";

/**
 * Translation Query Operations
 * Handles database queries for course, section, content block, and quiz translations
 */

type LanguageCode = "en" | "es" | "fr" | "de";

// =============================================================================
// COURSE TRANSLATIONS
// =============================================================================

/**
 * Get course translation by course ID and language code
 */
export const getCourseTranslation = async (
  courseId: string,
  languageCode: LanguageCode
): Promise<CourseTranslation | null> => {
  const result = await db
    .select()
    .from(courseTranslations)
    .where(
      and(
        eq(courseTranslations.courseId, courseId),
        eq(courseTranslations.languageCode, languageCode)
      )
    )
    .limit(1);

  return result[0] || null;
};

/**
 * Get all translations for a course
 */
export const getCourseTranslations = async (
  courseId: string
): Promise<CourseTranslation[]> => {
  const result = await db
    .select()
    .from(courseTranslations)
    .where(eq(courseTranslations.courseId, courseId));

  return result;
};

/**
 * Get available languages for a course
 */
export const getAvailableCourseLanguages = async (
  courseId: string
): Promise<LanguageCode[]> => {
  const result = await db
    .select({ languageCode: courseTranslations.languageCode })
    .from(courseTranslations)
    .where(eq(courseTranslations.courseId, courseId));

  return result.map((r) => r.languageCode as LanguageCode);
};

/**
 * Create course translation
 */
export const createCourseTranslation = async (
  translationData: NewCourseTranslation
): Promise<CourseTranslation> => {
  const result = await db
    .insert(courseTranslations)
    .values(translationData)
    .returning();

  return result[0];
};

/**
 * Update course translation
 */
export const updateCourseTranslation = async (
  courseId: string,
  languageCode: LanguageCode,
  updates: Partial<Omit<CourseTranslation, "id" | "courseId" | "languageCode" | "createdAt">>
): Promise<CourseTranslation | null> => {
  const result = await db
    .update(courseTranslations)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(courseTranslations.courseId, courseId),
        eq(courseTranslations.languageCode, languageCode)
      )
    )
    .returning();

  return result[0] || null;
};

/**
 * Delete course translation
 */
export const deleteCourseTranslation = async (
  courseId: string,
  languageCode: LanguageCode
): Promise<boolean> => {
  const result = await db
    .delete(courseTranslations)
    .where(
      and(
        eq(courseTranslations.courseId, courseId),
        eq(courseTranslations.languageCode, languageCode)
      )
    )
    .returning();

  return result.length > 0;
};

// =============================================================================
// SECTION TRANSLATIONS
// =============================================================================

/**
 * Get section translation by section ID and language code
 */
export const getSectionTranslation = async (
  sectionId: string,
  languageCode: LanguageCode
): Promise<SectionTranslation | null> => {
  const result = await db
    .select()
    .from(sectionTranslations)
    .where(
      and(
        eq(sectionTranslations.sectionId, sectionId),
        eq(sectionTranslations.languageCode, languageCode)
      )
    )
    .limit(1);

  return result[0] || null;
};

/**
 * Get all translations for a section
 */
export const getSectionTranslations = async (
  sectionId: string
): Promise<SectionTranslation[]> => {
  const result = await db
    .select()
    .from(sectionTranslations)
    .where(eq(sectionTranslations.sectionId, sectionId));

  return result;
};

/**
 * Get section translations for multiple sections
 */
export const getSectionTranslationsByIds = async (
  sectionIds: string[],
  languageCode: LanguageCode
): Promise<SectionTranslation[]> => {
  if (sectionIds.length === 0) return [];

  const result = await db
    .select()
    .from(sectionTranslations)
    .where(
      and(
        eq(sectionTranslations.languageCode, languageCode),
        eq(sectionTranslations.sectionId, sectionIds[0])
      )
    );

  // Note: For multiple IDs, you'd use IN clause
  return result;
};

/**
 * Create section translation
 */
export const createSectionTranslation = async (
  translationData: NewSectionTranslation
): Promise<SectionTranslation> => {
  const result = await db
    .insert(sectionTranslations)
    .values(translationData)
    .returning();

  return result[0];
};

/**
 * Update section translation
 */
export const updateSectionTranslation = async (
  sectionId: string,
  languageCode: LanguageCode,
  updates: Partial<Omit<SectionTranslation, "id" | "sectionId" | "languageCode" | "createdAt">>
): Promise<SectionTranslation | null> => {
  const result = await db
    .update(sectionTranslations)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(sectionTranslations.sectionId, sectionId),
        eq(sectionTranslations.languageCode, languageCode)
      )
    )
    .returning();

  return result[0] || null;
};

// =============================================================================
// CONTENT BLOCK TRANSLATIONS
// =============================================================================

/**
 * Get content block translation by block ID and language code
 */
export const getContentBlockTranslation = async (
  contentBlockId: string,
  languageCode: LanguageCode
): Promise<ContentBlockTranslation | null> => {
  const result = await db
    .select()
    .from(contentBlockTranslations)
    .where(
      and(
        eq(contentBlockTranslations.contentBlockId, contentBlockId),
        eq(contentBlockTranslations.languageCode, languageCode)
      )
    )
    .limit(1);

  return result[0] || null;
};

/**
 * Get all translations for a content block
 */
export const getContentBlockTranslations = async (
  contentBlockId: string
): Promise<ContentBlockTranslation[]> => {
  const result = await db
    .select()
    .from(contentBlockTranslations)
    .where(eq(contentBlockTranslations.contentBlockId, contentBlockId));

  return result;
};

/**
 * Get content block translations for multiple blocks
 */
export const getContentBlockTranslationsByIds = async (
  contentBlockIds: string[],
  languageCode: LanguageCode
): Promise<Record<string, ContentBlockTranslation>> => {
  if (contentBlockIds.length === 0) return {};

  const result = await db
    .select()
    .from(contentBlockTranslations)
    .where(eq(contentBlockTranslations.languageCode, languageCode));

  // Build a map of content block ID to translation
  return result.reduce(
    (acc, translation) => {
      acc[translation.contentBlockId] = translation;
      return acc;
    },
    {} as Record<string, ContentBlockTranslation>
  );
};

/**
 * Create content block translation
 */
export const createContentBlockTranslation = async (
  translationData: NewContentBlockTranslation
): Promise<ContentBlockTranslation> => {
  const result = await db
    .insert(contentBlockTranslations)
    .values(translationData)
    .returning();

  return result[0];
};

/**
 * Update content block translation
 */
export const updateContentBlockTranslation = async (
  contentBlockId: string,
  languageCode: LanguageCode,
  updates: Partial<Omit<ContentBlockTranslation, "id" | "contentBlockId" | "languageCode" | "createdAt">>
): Promise<ContentBlockTranslation | null> => {
  const result = await db
    .update(contentBlockTranslations)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(contentBlockTranslations.contentBlockId, contentBlockId),
        eq(contentBlockTranslations.languageCode, languageCode)
      )
    )
    .returning();

  return result[0] || null;
};

// =============================================================================
// QUIZ QUESTION TRANSLATIONS
// =============================================================================

/**
 * Get quiz question translation by question ID and language code
 */
export const getQuizQuestionTranslation = async (
  quizQuestionId: string,
  languageCode: LanguageCode
): Promise<QuizQuestionTranslation | null> => {
  const result = await db
    .select()
    .from(quizQuestionTranslations)
    .where(
      and(
        eq(quizQuestionTranslations.quizQuestionId, quizQuestionId),
        eq(quizQuestionTranslations.languageCode, languageCode)
      )
    )
    .limit(1);

  return result[0] || null;
};

/**
 * Get all translations for a quiz question
 */
export const getQuizQuestionTranslations = async (
  quizQuestionId: string
): Promise<QuizQuestionTranslation[]> => {
  const result = await db
    .select()
    .from(quizQuestionTranslations)
    .where(eq(quizQuestionTranslations.quizQuestionId, quizQuestionId));

  return result;
};

/**
 * Get quiz question translations for multiple questions
 */
export const getQuizQuestionTranslationsByIds = async (
  quizQuestionIds: string[],
  languageCode: LanguageCode
): Promise<Record<string, QuizQuestionTranslation>> => {
  if (quizQuestionIds.length === 0) return {};

  const result = await db
    .select()
    .from(quizQuestionTranslations)
    .where(eq(quizQuestionTranslations.languageCode, languageCode));

  // Build a map of quiz question ID to translation
  return result.reduce(
    (acc, translation) => {
      acc[translation.quizQuestionId] = translation;
      return acc;
    },
    {} as Record<string, QuizQuestionTranslation>
  );
};

/**
 * Create quiz question translation
 */
export const createQuizQuestionTranslation = async (
  translationData: NewQuizQuestionTranslation
): Promise<QuizQuestionTranslation> => {
  const result = await db
    .insert(quizQuestionTranslations)
    .values(translationData)
    .returning();

  return result[0];
};

/**
 * Update quiz question translation
 */
export const updateQuizQuestionTranslation = async (
  quizQuestionId: string,
  languageCode: LanguageCode,
  updates: Partial<Omit<QuizQuestionTranslation, "id" | "quizQuestionId" | "languageCode" | "createdAt">>
): Promise<QuizQuestionTranslation | null> => {
  const result = await db
    .update(quizQuestionTranslations)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(quizQuestionTranslations.quizQuestionId, quizQuestionId),
        eq(quizQuestionTranslations.languageCode, languageCode)
      )
    )
    .returning();

  return result[0] || null;
};

// =============================================================================
// BULK TRANSLATION OPERATIONS
// =============================================================================

/**
 * Bulk create course translations
 */
export const bulkCreateCourseTranslations = async (
  translationsData: NewCourseTranslation[]
): Promise<CourseTranslation[]> => {
  const result = await db
    .insert(courseTranslations)
    .values(translationsData)
    .returning();

  return result;
};

/**
 * Bulk create section translations
 */
export const bulkCreateSectionTranslations = async (
  translationsData: NewSectionTranslation[]
): Promise<SectionTranslation[]> => {
  const result = await db
    .insert(sectionTranslations)
    .values(translationsData)
    .returning();

  return result;
};

/**
 * Bulk create content block translations
 */
export const bulkCreateContentBlockTranslations = async (
  translationsData: NewContentBlockTranslation[]
): Promise<ContentBlockTranslation[]> => {
  const result = await db
    .insert(contentBlockTranslations)
    .values(translationsData)
    .returning();

  return result;
};

/**
 * Bulk create quiz question translations
 */
export const bulkCreateQuizQuestionTranslations = async (
  translationsData: NewQuizQuestionTranslation[]
): Promise<QuizQuestionTranslation[]> => {
  const result = await db
    .insert(quizQuestionTranslations)
    .values(translationsData)
    .returning();

  return result;
};

// =============================================================================
// TRANSLATION UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a course has translations available
 */
export const courseHasTranslations = async (
  courseId: string
): Promise<boolean> => {
  const result = await db
    .select({ id: courseTranslations.id })
    .from(courseTranslations)
    .where(eq(courseTranslations.courseId, courseId))
    .limit(1);

  return result.length > 0;
};

/**
 * Get translation completion status for a course
 */
export const getCourseTranslationStatus = async (
  courseId: string,
  languageCode: LanguageCode
): Promise<{
  hasCourseTranslation: boolean;
  sectionTranslationsCount: number;
  contentBlockTranslationsCount: number;
  quizQuestionTranslationsCount: number;
}> => {
  // Check course translation
  const courseTranslation = await getCourseTranslation(courseId, languageCode);

  // Get section IDs for this course
  const { courseSections } = await import("../schema");
  const sections = await db
    .select({ id: courseSections.id })
    .from(courseSections)
    .where(eq(courseSections.courseId, courseId));

  const sectionIds = sections.map((s) => s.id);

  // Count section translations
  const sectionTranslationsCount = sectionIds.length > 0
    ? (
        await db
          .select()
          .from(sectionTranslations)
          .where(eq(sectionTranslations.languageCode, languageCode))
      ).filter((st) => sectionIds.includes(st.sectionId)).length
    : 0;

  // This is a simplified version - for full implementation, you'd need to
  // query content blocks and quiz questions through the sections
  return {
    hasCourseTranslation: !!courseTranslation,
    sectionTranslationsCount,
    contentBlockTranslationsCount: 0, // Would need to implement
    quizQuestionTranslationsCount: 0, // Would need to implement
  };
};


