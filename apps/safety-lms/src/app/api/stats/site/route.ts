import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get total courses count
    const { count: coursesCount, error: coursesError } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true);

    if (coursesError) {
      console.error("Error fetching courses count:", coursesError);
    }

    // Get total users count (profiles)
    const { count: usersCount, error: usersError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (usersError) {
      console.error("Error fetching users count:", usersError);
    }

    // Get total enrollments count
    const { count: enrollmentsCount, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true });

    if (enrollmentsError) {
      console.error("Error fetching enrollments count:", enrollmentsError);
    }

    // Get plants count
    const { count: plantsCount, error: plantsError } = await supabase
      .from("plants")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    if (plantsError) {
      console.error("Error fetching plants count:", plantsError);
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCourses: coursesCount || 0,
        totalUsers: usersCount || 0,
        totalEnrollments: enrollmentsCount || 0,
        totalPlants: plantsCount || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching site stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}


