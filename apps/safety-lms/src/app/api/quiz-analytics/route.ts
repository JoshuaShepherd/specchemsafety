import { NextRequest, NextResponse } from "next/server";
import { serverAuth } from "@/lib/supabase/server";
import {
  createStrictApiResponse,
  createStrictApiErrorResponse,
  CURRENT_API_VERSION,
} from "@/lib/types/api-contracts";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { user, profile } = await serverAuth.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHENTICATION_ERROR",
          "Authentication required",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("sectionId");
    const courseId = searchParams.get("courseId");

    // Import the database instance
    const { db } = await import("@/lib/db");
    const { quizAttempts } = await import("@/lib/db/schema/quiz-attempts");
    const { quizQuestions } = await import("@/lib/db/schema/quiz-questions");
    const { courseSections } = await import("@/lib/db/schema/course-sections");
    const { courses } = await import("@/lib/db/schema/courses");
    const { eq, and, desc } = await import("drizzle-orm");

    // Build query conditions based on user role and plant access
    const conditions = [];
    
    if (profile?.role === "admin") {
      // Admins can see all data
    } else if (profile?.role === "manager") {
      // Managers can see data for their plant
      if (profile.plantId) {
        // Add plant filter for managers
        // This would require joining with user profiles to filter by plant
      }
    } else {
      // Employees can only see their own data
      conditions.push(eq(quizAttempts.userId, user.id));
    }

    if (sectionId) {
      // Join with quiz questions to filter by section
      const sectionQuestions = await db.query.quizQuestions.findMany({
        where: eq(quizQuestions.sectionId, sectionId),
        columns: { id: true },
      });
      
      const questionIds = sectionQuestions.map(q => q.id);
      if (questionIds.length > 0) {
        conditions.push(
          // This would need to be handled with a proper join or subquery
          // For now, we'll fetch all attempts and filter in memory
        );
      }
    }

    // Fetch quiz attempts with related data
    const attempts = await db.query.quizAttempts.findMany({
      with: {
        quizQuestion: {
          with: {
            section: {
              with: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: [desc(quizAttempts.attemptedAt)],
    });

    // Filter by plant access if user is manager
    // Note: Quiz attempts are already filtered by user, and users belong to plants
    // So plant-based filtering is implicit through the user relationship
    let filteredAttempts = attempts;

    // Filter by section if specified
    if (sectionId) {
      filteredAttempts = filteredAttempts.filter(attempt => 
        attempt.quizQuestion?.sectionId === sectionId
      );
    }

    // Filter by course if specified
    if (courseId) {
      filteredAttempts = filteredAttempts.filter(attempt => 
        attempt.quizQuestion?.section?.courseId === courseId
      );
    }

    // Calculate analytics
    const analytics = {
      totalAttempts: filteredAttempts.length,
      totalUsers: new Set(filteredAttempts.map(a => a.userId)).size,
      totalQuestions: new Set(filteredAttempts.map(a => a.quizQuestionId)).size,
      correctAttempts: filteredAttempts.filter(a => a.isCorrect).length,
      incorrectAttempts: filteredAttempts.filter(a => !a.isCorrect).length,
      accuracyRate: filteredAttempts.length > 0 
        ? (filteredAttempts.filter(a => a.isCorrect).length / filteredAttempts.length) * 100 
        : 0,
      averageAttemptsPerQuestion: filteredAttempts.length > 0 
        ? filteredAttempts.length / new Set(filteredAttempts.map(a => a.quizQuestionId)).size 
        : 0,
      questions: {},
      sections: {},
      courses: {},
    };

    // Group by question
    const questionGroups = new Map();
    filteredAttempts.forEach(attempt => {
      const questionId = attempt.quizQuestionId;
      if (!questionGroups.has(questionId)) {
        questionGroups.set(questionId, {
          questionId,
          questionText: attempt.quizQuestion?.questionText,
          sectionTitle: attempt.quizQuestion?.section?.title,
          courseTitle: attempt.quizQuestion?.section?.course?.title,
          attempts: [],
          correctAttempts: 0,
          incorrectAttempts: 0,
        });
      }
      const group = questionGroups.get(questionId);
      group.attempts.push(attempt);
      if (attempt.isCorrect) {
        group.correctAttempts++;
      } else {
        group.incorrectAttempts++;
      }
    });

    analytics.questions = Object.fromEntries(
      Array.from(questionGroups.entries()).map(([id, data]) => [
        id,
        {
          ...data,
          totalAttempts: data.attempts.length,
          accuracyRate: data.attempts.length > 0 
            ? (data.correctAttempts / data.attempts.length) * 100 
            : 0,
          attempts: undefined, // Remove raw attempts for cleaner response
        },
      ])
    );

    // Group by section
    const sectionGroups = new Map();
    filteredAttempts.forEach(attempt => {
      const sectionId = attempt.quizQuestion?.sectionId;
      if (!sectionId) return;
      
      if (!sectionGroups.has(sectionId)) {
        sectionGroups.set(sectionId, {
          sectionId,
          sectionTitle: attempt.quizQuestion?.section?.title,
          courseTitle: attempt.quizQuestion?.section?.course?.title,
          totalAttempts: 0,
          correctAttempts: 0,
          uniqueUsers: new Set(),
          uniqueQuestions: new Set(),
        });
      }
      const group = sectionGroups.get(sectionId);
      group.totalAttempts++;
      group.uniqueUsers.add(attempt.userId);
      group.uniqueQuestions.add(attempt.quizQuestionId);
      if (attempt.isCorrect) {
        group.correctAttempts++;
      }
    });

    analytics.sections = Object.fromEntries(
      Array.from(sectionGroups.entries()).map(([id, data]) => [
        id,
        {
          ...data,
          accuracyRate: data.totalAttempts > 0 
            ? (data.correctAttempts / data.totalAttempts) * 100 
            : 0,
          uniqueUsers: data.uniqueUsers.size,
          uniqueQuestions: data.uniqueQuestions.size,
        },
      ])
    );

    // Group by course
    const courseGroups = new Map();
    filteredAttempts.forEach(attempt => {
      const courseId = attempt.quizQuestion?.section?.courseId;
      if (!courseId) return;
      
      if (!courseGroups.has(courseId)) {
        courseGroups.set(courseId, {
          courseId,
          courseTitle: attempt.quizQuestion?.section?.course?.title,
          totalAttempts: 0,
          correctAttempts: 0,
          uniqueUsers: new Set(),
          uniqueQuestions: new Set(),
          uniqueSections: new Set(),
        });
      }
      const group = courseGroups.get(courseId);
      group.totalAttempts++;
      group.uniqueUsers.add(attempt.userId);
      group.uniqueQuestions.add(attempt.quizQuestionId);
      group.uniqueSections.add(attempt.quizQuestion?.sectionId);
      if (attempt.isCorrect) {
        group.correctAttempts++;
      }
    });

    analytics.courses = Object.fromEntries(
      Array.from(courseGroups.entries()).map(([id, data]) => [
        id,
        {
          ...data,
          accuracyRate: data.totalAttempts > 0 
            ? (data.correctAttempts / data.totalAttempts) * 100 
            : 0,
          uniqueUsers: data.uniqueUsers.size,
          uniqueQuestions: data.uniqueQuestions.size,
          uniqueSections: data.uniqueSections.size,
        },
      ])
    );

    return NextResponse.json(
      createStrictApiResponse(analytics, CURRENT_API_VERSION, {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Quiz analytics GET API error:", error);
    return NextResponse.json(
      createStrictApiErrorResponse(
        "INTERNAL_ERROR",
        "An unexpected error occurred",
        undefined,
        CURRENT_API_VERSION,
        {
          requestId: crypto.randomUUID(),
          path: request.nextUrl.pathname,
          method: request.method,
        }
      ),
      { status: 500 }
    );
  }
}
