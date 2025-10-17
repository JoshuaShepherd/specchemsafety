import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, serverAuth } from "@/lib/supabase/server";
import {
  createStrictApiResponse,
  createStrictApiErrorResponse,
  CURRENT_API_VERSION,
  StrictPaginationSchema,
} from "@/lib/types/api-contracts";
import { z } from "zod";
import { lmsContentService } from "@/lib/services/lms-content-service";

// User progress creation schema
const createUserProgressSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  courseId: z.string().uuid("Invalid course ID"),
  sectionId: z.string().uuid("Invalid section ID"),
  isCompleted: z.boolean().default(false),
  completionPercentage: z.number().int().min(0).max(100).default(0),
  timeSpentSeconds: z.number().int().min(0).default(0),
  lastAccessedAt: z.date().optional(),
  completedAt: z.date().optional(),
});

// User progress update schema
const updateUserProgressSchema = createUserProgressSchema
  .partial()
  .omit({ userId: true, courseId: true, sectionId: true });

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

    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "last_accessed_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");
    const sectionId = searchParams.get("sectionId");

    // Validate pagination
    const pagination = StrictPaginationSchema.parse({
      page,
      limit,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    });

    // Get user progress
    const result = await lmsContentService.getUserProgress({
      pagination,
      userId: userId || undefined,
      courseId: courseId || undefined,
      sectionId: sectionId || undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          "Failed to fetch user progress",
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

    // Return success response with pagination
    return NextResponse.json(
      {
        success: true,
        data: result.data || [],
        version: CURRENT_API_VERSION,
        pagination: result.pagination,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User progress GET API error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "VALIDATION_ERROR",
          "Invalid query parameters",
          [
            {
              message: error.message,
              code: "VALIDATION_ERROR",
            },
          ],
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

    // Validate request body
    const validatedData = createUserProgressSchema.parse(body);

    // Create user progress
    const result = await lmsContentService.createUserProgress(validatedData);

    if (!result.success) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          result.error || "Failed to create user progress",
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

    // Return success response
    return NextResponse.json(
      createStrictApiResponse(result.data, CURRENT_API_VERSION, {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("User progress POST API error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "VALIDATION_ERROR",
          "Invalid request data",
          [
            {
              message: error.message,
              code: "VALIDATION_ERROR",
            },
          ],
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
