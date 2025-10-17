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

// Course section creation schema
const createCourseSectionSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
  sectionKey: z
    .string()
    .min(1, "Section key is required")
    .max(100, "Section key too long"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  orderIndex: z.number().int().min(0, "Order index must be non-negative"),
  iconName: z.string().optional(),
  isPublished: z.boolean().default(false),
});

// Course section update schema
const updateCourseSectionSchema = createCourseSectionSchema
  .partial()
  .omit({ courseId: true });

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
    const courseId = searchParams.get("courseId");

    // Validate pagination
    const pagination = StrictPaginationSchema.parse({
      page,
      limit,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    });

    // Get course sections
    const result = await lmsContentService.getCourseSections({
      pagination,
      courseId: courseId || undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          "Failed to fetch course sections",
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
    console.error("Course sections GET API error:", error);

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

    // Check if user has permission to create course sections
    if (profile?.role !== "admin" && profile?.role !== "manager") {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHORIZATION_ERROR",
          "Insufficient permissions to create course sections",
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
    const validatedData = createCourseSectionSchema.parse(body);

    // Create course section
    const result = await lmsContentService.createCourseSection(validatedData);

    if (!result.success) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          result.error || "Failed to create course section",
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
    console.error("Course sections POST API error:", error);

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
