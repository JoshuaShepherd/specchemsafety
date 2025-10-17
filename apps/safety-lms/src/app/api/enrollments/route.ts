import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, serverAuth } from "@/lib/supabase/server";
import {
  createStrictApiResponse,
  createStrictApiErrorResponse,
  CURRENT_API_VERSION,
  StrictPaginationSchema,
} from "@/lib/types/api-contracts";
import { z } from "zod";

// Enrollment creation schema
const createEnrollmentSchema = z.object({
  user_id: z.string().uuid("Invalid user ID"),
  course_id: z.string().uuid("Invalid course ID"),
  enrolled_at: z.string().datetime().optional(),
  progress_percentage: z.number().min(0).max(100).default(0),
  is_active: z.boolean().default(true),
});

// Enrollment update schema
const updateEnrollmentSchema = z.object({
  completed_at: z.string().datetime().optional(),
  progress_percentage: z.number().min(0).max(100).optional(),
  is_active: z.boolean().optional(),
});

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

    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "enrolled_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    // Validate pagination
    const pagination = StrictPaginationSchema.parse({
      page,
      limit,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    });

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Build query
    let query = supabase.from("enrollments").select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          email
        ),
        courses:course_id (
          title,
          description,
          duration_minutes
        )
      `);

    // Apply filters based on user role
    if (profile?.role === "user") {
      // Regular users can only see their own enrollments
      query = query.eq("user_id", user.id);
    } else if (profile?.role === "manager") {
      // Managers can see enrollments for their plant
      if (profile.plant_id) {
        query = query.eq("profiles.plant_id", profile.plant_id);
      }
    }
    // Admins can see all enrollments

    // Apply additional filters
    if (userId) {
      query = query.eq("user_id", userId);
    }
    if (courseId) {
      query = query.eq("course_id", courseId);
    }

    // Get total count
    const { count } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true });

    // Get enrollments with pagination
    const { data: enrollments, error } = await query
      .select("*")
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(
        (pagination.page - 1) * pagination.limit,
        pagination.page * pagination.limit - 1
      );

    if (error) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          "Failed to fetch enrollments",
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

    const total = count || 0;
    const totalPages = Math.ceil(total / pagination.limit);

    // Return success response with pagination
    return NextResponse.json({
      success: true,
      data: enrollments || [],
      version: CURRENT_API_VERSION,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Enrollments GET API error:", error);

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

    // Check if user has permission to create enrollments
    if (profile?.role !== "admin" && profile?.role !== "manager") {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHORIZATION_ERROR",
          "Insufficient permissions to create enrollments",
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
    const validatedData = createEnrollmentSchema.parse(body);

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Check if enrollment already exists
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", validatedData.user_id)
      .eq("course_id", validatedData.course_id)
      .eq("is_active", true)
      .single();

    if (existingEnrollment) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "DUPLICATE",
          "User is already enrolled in this course",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 409 }
      );
    }

    // Create enrollment
    const { data: enrollment, error } = await supabase
      .from("enrollments")
      .insert([
        {
          ...validatedData,
          enrolled_at: validatedData.enrolled_at || new Date().toISOString(),
        },
      ])
      .select(
        `
        *,
        profiles:user_id (
          first_name,
          last_name,
          email
        ),
        courses:course_id (
          title,
          description,
          duration_minutes
        )
      `
      )
      .single();

    if (error) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          "Failed to create enrollment",
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
      createStrictApiResponse(enrollment, CURRENT_API_VERSION, {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollments POST API error:", error);

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
