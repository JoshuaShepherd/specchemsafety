import { NextRequest, NextResponse } from "next/server";
import { serverAuth } from "@/lib/supabase/server";
import {
  createStrictApiResponse,
  createStrictApiErrorResponse,
  CURRENT_API_VERSION,
} from "@/lib/types/api-contracts";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user } = await serverAuth.getCurrentUser();
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

    const body = await request.json();
    const { quizQuestionId, userAnswer, isCorrect, timeSpent } = body;

    if (!quizQuestionId || !userAnswer || isCorrect === undefined) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "VALIDATION_ERROR",
          "Missing required fields",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 400 }
      );
    }

    // Import the database instance
    const { db } = await import("@/lib/db");
    const { quizAttempts } = await import("@/lib/db/schema/quiz-attempts");

    // Record quiz attempt
    const [attempt] = await db
      .insert(quizAttempts)
      .values({
        userId: user.id,
        quizQuestionId: quizQuestionId,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        timeSpentSeconds: timeSpent || 0,
        attemptedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      createStrictApiResponse(attempt, CURRENT_API_VERSION, {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Quiz attempts POST API error:", error);
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

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { user } = await serverAuth.getCurrentUser();
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
    const quizQuestionId = searchParams.get("quizQuestionId");
    const userId = searchParams.get("userId");

    // Import the database instance
    const { db } = await import("@/lib/db");
    const { quizAttempts } = await import("@/lib/db/schema/quiz-attempts");
    const { eq, and, desc } = await import("drizzle-orm");

    // Build query conditions - always filter by user
    const conditions = [eq(quizAttempts.userId, user.id)];
    
    // If userId is provided in query params, use that instead (for admin access)
    if (userId && userId !== user.id) {
      // For now, only allow users to see their own attempts
      // TODO: Add admin role check here if needed
      conditions[0] = eq(quizAttempts.userId, user.id);
    }
    
    if (quizQuestionId) {
      conditions.push(eq(quizAttempts.quizQuestionId, quizQuestionId));
    }

    // Fetch quiz attempts using direct select syntax
    const attempts = await db
      .select()
      .from(quizAttempts)
      .where(and(...conditions))
      .orderBy(desc(quizAttempts.attemptedAt));

    return NextResponse.json(
      createStrictApiResponse(attempts, CURRENT_API_VERSION, {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Quiz attempts GET API error:", error);
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
