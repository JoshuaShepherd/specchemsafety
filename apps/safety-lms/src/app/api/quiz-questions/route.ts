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

// Quiz question creation schema
const createQuizQuestionSchema = z.object({
  sectionId: z.string().uuid("Invalid section ID"),
  questionKey: z
    .string()
    .min(1, "Question key is required")
    .max(100, "Question key too long"),
  questionType: z.enum(["true-false", "multiple-choice"]),
  questionText: z
    .string()
    .min(1, "Question text is required")
    .max(1000, "Question text too long"),
  options: z.record(z.string(), z.any()).optional(), // JSONB options
  correctAnswer: z.record(z.string(), z.any()), // JSONB correct answer
  explanation: z.string().optional(),
  orderIndex: z
    .number()
    .int()
    .min(0, "Order index must be non-negative")
    .default(0),
  isPublished: z.boolean().default(false),
});

// Quiz question update schema
const updateQuizQuestionSchema = createQuizQuestionSchema
  .partial()
  .omit({ sectionId: true });

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
    const sortBy = searchParams.get("sortBy") || "order_index";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const sectionId = searchParams.get("sectionId");

    // Validate pagination
    const pagination = StrictPaginationSchema.parse({
      page,
      limit,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    });

    // Get quiz questions
    const result = await lmsContentService.getQuizQuestions({
      pagination,
      sectionId: sectionId || undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          result.error || "Failed to fetch quiz questions",
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
    console.error("Quiz questions GET API error:", error);

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

    // Check if user has permission to create quiz questions
    if (profile?.role !== "admin" && profile?.role !== "manager") {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHORIZATION_ERROR",
          "Insufficient permissions to create quiz questions",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validatedData = createQuizQuestionSchema.parse(body);

    // Create quiz question
    const result = await lmsContentService.createQuizQuestion(validatedData);

    if (!result.success) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          "Failed to create quiz question",
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
    console.error("Quiz questions POST API error:", error);

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
