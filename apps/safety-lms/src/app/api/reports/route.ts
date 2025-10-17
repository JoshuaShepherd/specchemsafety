import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, serverAuth } from "@/lib/supabase/server";
import {
  createStrictApiResponse,
  createStrictApiErrorResponse,
  CURRENT_API_VERSION,
} from "@/lib/types/api-contracts";
import { z } from "zod";

// Report query schema
const reportQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  plantId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  reportType: z
    .enum(["compliance", "progress", "enrollment", "completion"])
    .default("compliance"),
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

    // Check if user has permission to view reports
    if (profile?.role !== "admin" && profile?.role !== "manager") {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHORIZATION_ERROR",
          "Insufficient permissions to view reports",
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

    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const queryParams = {
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      plantId: searchParams.get("plantId") || undefined,
      courseId: searchParams.get("courseId") || undefined,
      userId: searchParams.get("userId") || undefined,
      reportType: searchParams.get("reportType") || "compliance",
    };

    // Validate query parameters
    const validatedParams = reportQuerySchema.parse(queryParams);

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Build base query for enrollments with related data
    let baseQuery = supabase.from("enrollments").select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name,
          email,
          role,
          plant_id,
          plants:plant_id (
            id,
            name
          )
        ),
        courses:course_id (
          id,
          title,
          description,
          duration_minutes
        )
      `);

    // Apply filters based on user role
    if (profile?.role === "manager" && profile.plant_id) {
      // Managers can only see reports for their plant
      baseQuery = baseQuery.eq("profiles.plant_id", profile.plant_id);
    }

    // Apply additional filters
    if (validatedParams.plantId) {
      baseQuery = baseQuery.eq("profiles.plant_id", validatedParams.plantId);
    }
    if (validatedParams.courseId) {
      baseQuery = baseQuery.eq("course_id", validatedParams.courseId);
    }
    if (validatedParams.userId) {
      baseQuery = baseQuery.eq("user_id", validatedParams.userId);
    }
    if (validatedParams.startDate) {
      baseQuery = baseQuery.gte("enrolled_at", validatedParams.startDate);
    }
    if (validatedParams.endDate) {
      baseQuery = baseQuery.lte("enrolled_at", validatedParams.endDate);
    }

    // Get enrollment data
    const { data: enrollments, error } = await baseQuery.eq("is_active", true);

    if (error) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          "Failed to fetch report data",
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

    // Generate report based on type
    let reportData: any = {};

    switch (validatedParams.reportType) {
      case "compliance":
        reportData = generateComplianceReport(enrollments || []);
        break;
      case "progress":
        reportData = generateProgressReport(enrollments || []);
        break;
      case "enrollment":
        reportData = generateEnrollmentReport(enrollments || []);
        break;
      case "completion":
        reportData = generateCompletionReport(enrollments || []);
        break;
      default:
        reportData = generateComplianceReport(enrollments || []);
    }

    // Return success response
    return NextResponse.json(
      createStrictApiResponse(
        {
          reportType: validatedParams.reportType,
          generatedAt: new Date().toISOString(),
          filters: validatedParams,
          data: reportData,
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
    console.error("Reports GET API error:", error);

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

// Helper functions to generate different types of reports
function generateComplianceReport(enrollments: any[]) {
  const totalEnrollments = enrollments.length;
  const completedEnrollments = enrollments.filter(e => e.completed_at).length;
  const inProgressEnrollments = enrollments.filter(
    e => !e.completed_at && e.progress_percentage > 0
  ).length;
  const notStartedEnrollments = enrollments.filter(
    e => e.progress_percentage === 0
  ).length;

  // Group by plant
  const plantCompliance = enrollments.reduce((acc, enrollment) => {
    const plantId = enrollment.profiles?.plant_id || "unassigned";
    const plantName = enrollment.profiles?.plants?.name || "Unassigned";

    if (!acc[plantId]) {
      acc[plantId] = {
        plantId,
        plantName,
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        complianceRate: 0,
      };
    }

    acc[plantId].total++;
    if (enrollment.completed_at) {
      acc[plantId].completed++;
    } else if (enrollment.progress_percentage > 0) {
      acc[plantId].inProgress++;
    } else {
      acc[plantId].notStarted++;
    }

    acc[plantId].complianceRate = Math.round(
      (acc[plantId].completed / acc[plantId].total) * 100
    );

    return acc;
  }, {});

  return {
    summary: {
      totalEnrollments,
      completedEnrollments,
      inProgressEnrollments,
      notStartedEnrollments,
      overallComplianceRate:
        totalEnrollments > 0
          ? Math.round((completedEnrollments / totalEnrollments) * 100)
          : 0,
    },
    plantCompliance: Object.values(plantCompliance),
  };
}

function generateProgressReport(enrollments: any[]) {
  const progressData = enrollments.map(enrollment => ({
    userId: enrollment.user_id,
    userName: `${enrollment.profiles?.first_name} ${enrollment.profiles?.last_name}`,
    userEmail: enrollment.profiles?.email,
    plantName: enrollment.profiles?.plants?.name || "Unassigned",
    courseTitle: enrollment.courses?.title,
    enrolledAt: enrollment.enrolled_at,
    progressPercentage: enrollment.progress_percentage,
    completedAt: enrollment.completed_at,
    isCompleted: !!enrollment.completed_at,
  }));

  return {
    progressData,
    averageProgress:
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) /
              enrollments.length
          )
        : 0,
  };
}

function generateEnrollmentReport(enrollments: any[]) {
  // Group by month
  const monthlyEnrollments = enrollments.reduce((acc, enrollment) => {
    const month = new Date(enrollment.enrolled_at)
      .toISOString()
      .substring(0, 7); // YYYY-MM

    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month]++;

    return acc;
  }, {});

  // Group by course
  const courseEnrollments = enrollments.reduce((acc, enrollment) => {
    const courseId = enrollment.course_id;
    const courseTitle = enrollment.courses?.title;

    if (!acc[courseId]) {
      acc[courseId] = {
        courseId,
        courseTitle,
        count: 0,
      };
    }
    acc[courseId].count++;

    return acc;
  }, {});

  return {
    monthlyEnrollments: Object.entries(monthlyEnrollments).map(
      ([month, count]) => ({
        month,
        count,
      })
    ),
    courseEnrollments: Object.values(courseEnrollments),
  };
}

function generateCompletionReport(enrollments: any[]) {
  const completedEnrollments = enrollments.filter(e => e.completed_at);

  // Group by course
  const courseCompletions = completedEnrollments.reduce((acc, enrollment) => {
    const courseId = enrollment.course_id;
    const courseTitle = enrollment.courses?.title;

    if (!acc[courseId]) {
      acc[courseId] = {
        courseId,
        courseTitle,
        completions: 0,
        averageCompletionTime: 0,
      };
    }
    acc[courseId].completions++;

    // Calculate completion time in days
    const enrolledDate = new Date(enrollment.enrolled_at);
    const completedDate = new Date(enrollment.completed_at);
    const completionTimeDays = Math.ceil(
      (completedDate.getTime() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    acc[courseId].averageCompletionTime = Math.round(
      (acc[courseId].averageCompletionTime * (acc[courseId].completions - 1) +
        completionTimeDays) /
        acc[courseId].completions
    );

    return acc;
  }, {});

  return {
    totalCompletions: completedEnrollments.length,
    courseCompletions: Object.values(courseCompletions),
  };
}
