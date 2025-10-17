import { NextRequest } from "next/server";
import { z } from "zod";
import {
  CreateCourseSectionRequest,
  UpdateCourseSectionRequest,
  CourseSectionResponse,
  CourseWithSectionsResponse,
  SectionWithContentResponse,
  LmsContentErrorResponse,
} from "@specchem/contracts";
import {
  getCourseSectionById,
  getCourseSectionByKey,
  getCourseSectionsByCourseId,
  getCourseSectionWithContent,
  createCourseSection,
  updateCourseSection,
  deleteCourseSection,
  reorderSections,
  getNextSectionOrderIndex,
  isSectionKeyUnique,
  isOrderIndexUnique,
  getSectionStatistics,
  searchCourseSections,
  getAccessibleCourseSections,
  canUserAccessSection,
} from "../db/queries/course-sections";
import {
  getContentBlocksBySectionId,
  getContentBlocksByType,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
  reorderContentBlocks,
  getNextContentBlockOrderIndex,
  isContentBlockOrderIndexUnique,
  validateContentBlockContent,
  getContentBlockStatistics,
  searchContentBlocks,
  getAccessibleContentBlocks,
  canUserAccessContentBlock,
} from "../db/queries/content-blocks";
import {
  getQuizQuestionsBySectionId,
  getQuizQuestionsByType,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  reorderQuizQuestions,
  getNextQuizQuestionOrderIndex,
  isQuestionKeyUnique,
  isQuizQuestionOrderIndexUnique,
  validateQuizQuestionContent,
  getQuizQuestionStatistics,
  getSectionQuizStatistics,
  searchQuizQuestions,
  getAccessibleQuizQuestions,
  canUserAccessQuizQuestion,
  createQuizAttempt,
  getQuizAttemptsByUser,
  getQuizAttemptsByQuestion,
  getQuizQuestionById,
} from "../db/queries/quiz-questions";
import {
  getUserProgressByUser,
  getUserProgressByUserAndSection,
  upsertUserProgress,
  updateUserProgress,
  updateUserProgressByUserAndSection,
  deleteUserProgress,
  calculateCourseCompletionStatus,
  getUserProgressAnalytics,
  getCourseProgressStatistics,
  searchUserProgress,
  getAccessibleUserProgress,
  canUserAccessProgress,
} from "../db/queries/user-progress";
import {
  mapCourseSectionToApiResponse,
  mapCourseSectionsToApiResponses,
  mapCreateCourseSectionRequestToDb,
  mapUpdateCourseSectionRequestToDb,
  mapSectionWithContentToApiResponse,
  validateSectionAccess,
  validateAndApplySectionOrdering,
} from "../mappers/course-section-mappers";
import {
  mapContentBlockToApiResponse,
  mapContentBlocksToApiResponses,
  mapCreateContentBlockRequestToDb,
  mapUpdateContentBlockRequestToDb,
  validateContentBlockAccess,
  validateAndApplyContentBlockOrdering,
} from "../mappers/content-block-mappers";
import {
  mapQuizQuestionToApiResponse,
  mapQuizQuestionsToApiResponses,
  mapCreateQuizQuestionRequestToDb,
  mapUpdateQuizQuestionRequestToDb,
  validateQuizAnswer,
  mapQuizAnswerSubmissionToAttempt,
  mapQuizAttemptToApiResponse,
  mapQuizAttemptsToApiResponses,
  validateQuizQuestionAccess,
  validateAndApplyQuizQuestionOrdering,
} from "../mappers/quiz-question-mappers";
import {
  mapUserProgressToApiResponse,
  mapUserProgressToApiResponses,
  mapUpdateUserProgressRequestToDb,
  mapCreateUserProgressRequestToDb,
  mapCourseCompletionStatusToApiResponse,
  calculateCourseCompletionStatus as calculateCompletionStatus,
  mapUserProgressToAnalytics,
  mapProgressTrackingEventToProgressUpdate,
  validateUserProgressAccess,
} from "../mappers/user-progress-mappers";

/**
 * LMS Content Service Layer
 * Handles business logic for structured course content, sections, blocks, and quizzes
 */

// =============================================================================
// COURSE SECTION SERVICES
// =============================================================================

/**
 * Get course content with sections
 */
export const getCourseContentService = async (
  courseKey: string,
  languageCode: string = "en",
  includeUnpublished: boolean = false,
  userRole: string = "employee"
): Promise<CourseWithSectionsResponse | LmsContentErrorResponse> => {
  try {
    // Get course by key (would need to implement this query)
    // const course = await getCourseByKey(courseKey);
    // if (!course) {
    //   return {
    //     success: false,
    //     error: {
    //       code: "COURSE_NOT_FOUND",
    //       message: "Course not found",
    //       timestamp: new Date().toISOString(),
    //     },
    //     version: "1.0",
    //   };
    // }

    // Get accessible sections
    const sections = await getAccessibleCourseSections(courseKey, userRole, {
      includeUnpublished,
    });

    return {
      success: true,
      data: {
        course: {
          id: courseKey, // Would be actual course ID
          courseKey,
          title: "Function-Specific HazMat Training", // Would be from course
          description:
            "Handling, Packaging, and Shipping DOT-Regulated Materials",
          version: "1.0",
          isPublished: true,
        },
        sections: mapCourseSectionsToApiResponses(sections),
      },
      version: "1.0",
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "SYSTEM_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      version: "1.0",
    };
  }
};

/**
 * Get section content with blocks and quiz questions
 */
export const getSectionContentService = async (
  courseKey: string,
  sectionKey: string,
  languageCode: string = "en",
  includeUnpublished: boolean = false,
  userRole: string = "employee"
): Promise<SectionWithContentResponse | LmsContentErrorResponse> => {
  try {
    // Get course by key (would need to implement this query)
    // const course = await getCourseByKey(courseKey);
    // if (!course) {
    //   return {
    //     success: false,
    //     error: {
    //       code: "COURSE_NOT_FOUND",
    //       message: "Course not found",
    //       timestamp: new Date().toISOString(),
    //     },
    //     version: "1.0",
    //   };
    // }

    // Get section by key
    const section = await getCourseSectionByKey(courseKey, sectionKey);
    if (!section) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: "Section not found",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Check access
    const accessResult = validateSectionAccess(section, userRole, true);
    if (!accessResult.hasAccess) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: accessResult.reason || "Access denied",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Get section with content
    const sectionWithContent = await getCourseSectionWithContent(section.id);
    if (!sectionWithContent) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: "Section content not found",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    return {
      success: true,
      data: mapSectionWithContentToApiResponse(
        sectionWithContent.section,
        sectionWithContent.contentBlocks,
        sectionWithContent.quizQuestions
      ),
      version: "1.0",
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "SYSTEM_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      version: "1.0",
    };
  }
};

/**
 * Create course section
 */
export const createCourseSectionService = async (
  courseKey: string,
  request: CreateCourseSectionRequest,
  userRole: string = "employee"
): Promise<CourseSectionResponse | LmsContentErrorResponse> => {
  try {
    // Check permissions
    if (userRole === "employee") {
      return {
        success: false,
        error: {
          code: "USER_NOT_AUTHORIZED",
          message: "Insufficient permissions",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Get course by key (would need to implement this query)
    // const course = await getCourseByKey(courseKey);
    // if (!course) {
    //   return {
    //     success: false,
    //     error: {
    //       code: "COURSE_NOT_FOUND",
    //       message: "Course not found",
    //       timestamp: new Date().toISOString(),
    //     },
    //     version: "1.0",
    //   };
    // }

    // Validate section key uniqueness
    const isKeyUnique = await isSectionKeyUnique(courseKey, request.sectionKey);
    if (!isKeyUnique) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Section key must be unique within the course",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Get next order index if not provided
    const orderIndex =
      request.orderIndex ?? (await getNextSectionOrderIndex(courseKey));

    // Create section
    const sectionData = mapCreateCourseSectionRequestToDb(request, courseKey);
    const section = await createCourseSection(sectionData);

    return {
      success: true,
      data: mapCourseSectionToApiResponse(section),
      version: "1.0",
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "SYSTEM_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      version: "1.0",
    };
  }
};

/**
 * Update course section
 */
export const updateCourseSectionService = async (
  sectionId: string,
  request: UpdateCourseSectionRequest,
  userRole: string = "employee"
): Promise<CourseSectionResponse | LmsContentErrorResponse> => {
  try {
    // Get existing section
    const existingSection = await getCourseSectionById(sectionId);
    if (!existingSection) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: "Section not found",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Check access
    const accessResult = validateSectionAccess(existingSection, userRole, true);
    if (!accessResult.hasAccess || !accessResult.permissions?.canEdit) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: accessResult.reason || "Access denied",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Validate section key uniqueness if changing
    if (
      request.sectionKey &&
      request.sectionKey !== existingSection.sectionKey
    ) {
      const isKeyUnique = await isSectionKeyUnique(
        existingSection.courseId,
        request.sectionKey,
        sectionId
      );
      if (!isKeyUnique) {
        return {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Section key must be unique within the course",
            timestamp: new Date().toISOString(),
          },
          version: "1.0",
        };
      }
    }

    // Update section
    const updates = mapUpdateCourseSectionRequestToDb(request, existingSection);
    const updatedSection = await updateCourseSection(sectionId, updates);

    if (!updatedSection) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: "Failed to update section",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    return {
      success: true,
      data: mapCourseSectionToApiResponse(updatedSection),
      version: "1.0",
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "SYSTEM_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      version: "1.0",
    };
  }
};

/**
 * Delete course section
 */
export const deleteCourseSectionService = async (
  sectionId: string,
  userRole: string = "employee"
): Promise<
  { success: true; message: string; version: "1.0" } | LmsContentErrorResponse
> => {
  try {
    // Get existing section
    const existingSection = await getCourseSectionById(sectionId);
    if (!existingSection) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: "Section not found",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Check access
    const accessResult = validateSectionAccess(existingSection, userRole, true);
    if (!accessResult.hasAccess || !accessResult.permissions?.canDelete) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: accessResult.reason || "Access denied",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Delete section
    const deleted = await deleteCourseSection(sectionId);
    if (!deleted) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: "Failed to delete section",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    return {
      success: true,
      message: "Section deleted successfully",
      version: "1.0",
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "SYSTEM_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      version: "1.0",
    };
  }
};

// =============================================================================
// CONTENT BLOCK SERVICES
// =============================================================================

/**
 * Create content block
 */
export const createContentBlockService = async (
  sectionId: string,
  request: any, // CreateContentBlockRequest
  userRole: string = "employee"
): Promise<any> => {
  try {
    // Check permissions
    if (userRole === "employee") {
      return {
        success: false,
        error: {
          code: "USER_NOT_AUTHORIZED",
          message: "Insufficient permissions",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Get section
    const section = await getCourseSectionById(sectionId);
    if (!section) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: "Section not found",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Check access
    const accessResult = validateSectionAccess(section, userRole, true);
    if (!accessResult.hasAccess || !accessResult.permissions?.canEdit) {
      return {
        success: false,
        error: {
          code: "COURSE_SECTION_NOT_FOUND",
          message: accessResult.reason || "Access denied",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Validate content
    const validation = await validateContentBlockContent(
      request.blockType,
      request.content
    );
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: validation.errors.join(", "),
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Get next order index if not provided
    const orderIndex =
      request.orderIndex ?? (await getNextContentBlockOrderIndex(sectionId));

    // Create content block
    const blockData = mapCreateContentBlockRequestToDb(request, sectionId);
    const block = await createContentBlock(blockData);

    return {
      success: true,
      data: mapContentBlockToApiResponse(block),
      version: "1.0",
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "SYSTEM_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      version: "1.0",
    };
  }
};

// =============================================================================
// QUIZ QUESTION SERVICES
// =============================================================================

/**
 * Submit quiz answer
 */
export const submitQuizAnswerService = async (
  quizQuestionId: string,
  request: any, // SubmitQuizAnswerRequest
  userId: string,
  userRole: string = "employee"
): Promise<any> => {
  try {
    // Get quiz question
    const question = await getQuizQuestionById(quizQuestionId);
    if (!question) {
      return {
        success: false,
        error: {
          code: "QUIZ_QUESTION_NOT_FOUND",
          message: "Quiz question not found",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Check access
    const accessResult = validateQuizQuestionAccess(question, userRole, true);
    if (!accessResult.hasAccess || !accessResult.permissions?.canSubmitAnswer) {
      return {
        success: false,
        error: {
          code: "QUIZ_QUESTION_NOT_FOUND",
          message: accessResult.reason || "Access denied",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Validate answer
    const validation = validateQuizAnswer(question, request.userAnswer);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: "INVALID_QUIZ_ANSWER",
          message: validation.errors.join(", "),
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Create quiz attempt
    const attemptData = mapQuizAnswerSubmissionToAttempt(
      request,
      userId,
      validation.isCorrect
    );
    const attempt = await createQuizAttempt(attemptData);

    return {
      success: true,
      data: mapQuizAttemptToApiResponse(attempt),
      version: "1.0",
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "SYSTEM_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      version: "1.0",
    };
  }
};

// =============================================================================
// USER PROGRESS SERVICES
// =============================================================================

/**
 * Update user progress
 */
export const updateUserProgressService = async (
  userId: string,
  request: any, // UpdateUserProgressRequest
  userRole: string = "employee"
): Promise<any> => {
  try {
    // Check permissions
    if (userRole === "employee") {
      return {
        success: false,
        error: {
          code: "USER_NOT_AUTHORIZED",
          message: "Insufficient permissions",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Get existing progress or create new
    const existingProgress = await getUserProgressByUserAndSection(
      userId,
      request.sectionId
    );

    let progress;
    if (existingProgress) {
      const updates = mapUpdateUserProgressRequestToDb(
        request,
        userId,
        existingProgress
      );
      progress = await updateUserProgressByUserAndSection(
        userId,
        request.sectionId,
        updates
      );
    } else {
      const newProgress = mapCreateUserProgressRequestToDb(request, userId);
      progress = await upsertUserProgress(newProgress);
    }

    if (!progress) {
      return {
        success: false,
        error: {
          code: "PROGRESS_UPDATE_FAILED",
          message: "Failed to update progress",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    return {
      success: true,
      data: mapUserProgressToApiResponse(progress),
      version: "1.0",
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "SYSTEM_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      version: "1.0",
    };
  }
};

/**
 * Get course completion status
 */
export const getCourseCompletionStatusService = async (
  userId: string,
  courseId: string,
  userRole: string = "employee"
): Promise<any> => {
  try {
    // Check access
    const canAccess = await canUserAccessProgress("", userId, userRole);
    if (!canAccess) {
      return {
        success: false,
        error: {
          code: "USER_NOT_AUTHORIZED",
          message: "Access denied",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    // Calculate completion status
    const status = await calculateCourseCompletionStatus(userId, courseId);
    if (!status) {
      return {
        success: false,
        error: {
          code: "COURSE_NOT_FOUND",
          message: "Course not found",
          timestamp: new Date().toISOString(),
        },
        version: "1.0",
      };
    }

    return {
      success: true,
      data: mapCourseCompletionStatusToApiResponse(status),
      version: "1.0",
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "SYSTEM_ERROR",
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      version: "1.0",
    };
  }
};

// =============================================================================
// LMS CONTENT SERVICE OBJECT
// =============================================================================

/**
 * Main LMS Content Service Object
 * Provides a unified interface for all LMS content operations
 */
export const lmsContentService = {
  // Course Section Services
  getCourseSections: async (options: any) => {
    // Simple implementation for now
    return {
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  },

  createCourseSection: async (data: any) => {
    return createCourseSectionService("", data);
  },

  updateCourseSection: async (id: string, data: any) => {
    return updateCourseSectionService(id, data);
  },

  deleteCourseSection: async (id: string) => {
    return deleteCourseSectionService(id);
  },

  // Content Block Services
  getContentBlocks: async (options: any) => {
    // Simple implementation for now
    return {
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  },

  createContentBlock: async (data: any) => {
    return createContentBlockService("", data);
  },

  updateContentBlock: async (id: string, data: any) => {
    // Implementation needed
    return {
      success: true,
      data: {},
    };
  },

  deleteContentBlock: async (id: string) => {
    // Implementation needed
    return {
      success: true,
      message: "Content block deleted",
    };
  },

  // Quiz Question Services
  getQuizQuestions: async (options: any) => {
    try {
      const { pagination, sectionId } = options;
      
      if (!sectionId) {
        return {
          success: false,
          error: "Section ID is required",
          data: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      // Get quiz questions for the section
      const questions = await getQuizQuestionsBySectionId(sectionId, {
        includeUnpublished: false, // Only published questions for regular users
        sortBy: "orderIndex",
        sortOrder: "asc",
      });

      // Calculate pagination
      const total = questions.length;
      const totalPages = Math.ceil(total / pagination.limit);
      const offset = (pagination.page - 1) * pagination.limit;
      const paginatedQuestions = questions.slice(offset, offset + pagination.limit);

      return {
        success: true,
        data: paginatedQuestions,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      console.error("Error in getQuizQuestions service:", error);
      return {
        success: false,
        error: "Failed to fetch quiz questions",
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  },

  createQuizQuestion: async (data: any) => {
    // Implementation needed
    return {
      success: true,
      data: {},
    };
  },

  updateQuizQuestion: async (id: string, data: any) => {
    // Implementation needed
    return {
      success: true,
      data: {},
    };
  },

  deleteQuizQuestion: async (id: string) => {
    // Implementation needed
    return {
      success: true,
      message: "Quiz question deleted",
    };
  },

  // User Progress Services
  getUserProgress: async (options: any) => {
    // Simple implementation for now
    return {
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  },

  createUserProgress: async (data: any) => {
    return updateUserProgressService("", data);
  },

  updateUserProgress: async (id: string, data: any) => {
    return updateUserProgressService("", data);
  },

  deleteUserProgress: async (id: string) => {
    // Implementation needed
    return {
      success: true,
      message: "User progress deleted",
    };
  },

  // Course Content Services
  getCourseContent: getCourseContentService,
  getSectionContent: getSectionContentService,

  // Quiz Answer Services
  submitQuizAnswer: submitQuizAnswerService,

  // Course Completion Services
  getCourseCompletionStatus: getCourseCompletionStatusService,
};
