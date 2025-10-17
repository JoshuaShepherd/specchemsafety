import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, serverAuth } from "@/lib/supabase/server";
import {
  createStrictApiResponse,
  createStrictApiErrorResponse,
  CURRENT_API_VERSION,
} from "@/lib/types/api-contracts";
import { z } from "zod";

// Progress update schema
const updateProgressSchema = z.object({
  enrollment_id: z.string().uuid("Invalid enrollment ID"),
  progress_percentage: z.number().min(0).max(100),
  completed_at: z.string().datetime().optional(),
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
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Build query
    let query = supabase.from("enrollments").select(`
        id,
        user_id,
        course_id,
        enrolled_at,
        completed_at,
        progress_percentage,
        is_active,
        profiles:user_id (
          first_name,
          last_name,
          email,
          plant_id
        ),
        courses:course_id (
          title,
          description,
          duration_minutes
        )
      `);

    // Apply filters based on user role
    if (profile?.role === "user") {
      // Regular users can only see their own progress
      query = query.eq("user_id", user.id);
    } else if (profile?.role === "manager") {
      // Managers can see progress for their plant
      if (profile.plant_id) {
        query = query.eq("profiles.plant_id", profile.plant_id);
      }
    }
    // Admins can see all progress

    // Apply additional filters
    if (userId) {
      query = query.eq("user_id", userId);
    }
    if (courseId) {
      query = query.eq("course_id", courseId);
    }

    // Get progress data
    const { data: progress, error } = await query
      .eq("is_active", true)
      .order("enrolled_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          "Failed to fetch progress data",
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

    // Calculate summary statistics
    const summary = {
      total_enrollments: progress?.length || 0,
      completed_courses: progress?.filter(p => p.completed_at).length || 0,
      in_progress_courses:
        progress?.filter(p => !p.completed_at && p.progress_percentage > 0)
          .length || 0,
      not_started_courses:
        progress?.filter(p => p.progress_percentage === 0).length || 0,
      average_progress:
        progress?.length > 0
          ? Math.round(
              progress.reduce((sum, p) => sum + p.progress_percentage, 0) /
                progress.length
            )
          : 0,
    };

    // Return success response
    return NextResponse.json(
      createStrictApiResponse(
        {
          progress: progress || [],
          summary,
        },
        CURRENT_API_VERSION,
        {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        }
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Progress GET API error:", error);

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

export async function PUT(request: NextRequest) {
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

    const body = await request.json();

    // Validate request body
    const validatedData = updateProgressSchema.parse(body);

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Get enrollment to check permissions
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        profiles:user_id (
          first_name,
          last_name,
          email,
          plant_id
        )
      `
      )
      .eq("id", validatedData.enrollment_id)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "NOT_FOUND",
          "Enrollment not found",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 404 }
      );
    }

    // Check permissions
    const canUpdate =
      profile?.role === "admin" ||
      profile?.role === "manager" ||
      (profile?.role === "user" && enrollment.user_id === user.id);

    if (!canUpdate) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHORIZATION_ERROR",
          "Insufficient permissions to update this progress",
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

    // Prepare update data
    const updateData: any = {
      progress_percentage: validatedData.progress_percentage,
    };

    // If progress is 100%, mark as completed
    if (validatedData.progress_percentage === 100 && !enrollment.completed_at) {
      updateData.completed_at =
        validatedData.completed_at || new Date().toISOString();
    }

    // Update progress
    const { data: updatedEnrollment, error } = await supabase
      .from("enrollments")
      .update(updateData)
      .eq("id", validatedData.enrollment_id)
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
          "Failed to update progress",
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
      createStrictApiResponse(updatedEnrollment, CURRENT_API_VERSION, {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Progress PUT API error:", error);

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
