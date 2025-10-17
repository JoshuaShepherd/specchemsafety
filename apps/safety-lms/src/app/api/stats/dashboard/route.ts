import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    // Get user's enrollments count
    const { count: enrollmentsCount, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id);

    if (enrollmentsError) {
      console.error("Error fetching enrollments:", enrollmentsError);
    }

    // Get completed courses count
    const { count: completedCount, error: completedError } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("status", "completed");

    if (completedError) {
      console.error("Error fetching completed courses:", completedError);
    }

    // Get in-progress courses count
    const { count: inProgressCount, error: inProgressError } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("status", "in_progress");

    if (inProgressError) {
      console.error("Error fetching in-progress courses:", inProgressError);
    }

    // Calculate certificates (completed courses)
    const certificatesCount = completedCount || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalEnrollments: enrollmentsCount || 0,
        completedCourses: completedCount || 0,
        inProgressCourses: inProgressCount || 0,
        certificates: certificatesCount,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}


