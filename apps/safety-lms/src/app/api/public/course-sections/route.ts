import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Create Supabase client (no auth required for public content)
    const supabase = await createServerSupabaseClient();

    // Get course sections for the specified course
    const { data: sections, error } = await supabase
      .from("course_sections")
      .select("*")
      .eq("course_id", courseId)
      .eq("is_published", true) // Only published sections
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching public course sections:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch course sections" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sections || [],
    });
  } catch (error) {
    console.error("Public course sections API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
