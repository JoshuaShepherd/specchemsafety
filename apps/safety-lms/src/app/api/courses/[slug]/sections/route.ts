import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const { slug } = await params;

    // First, get the course by slug
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", slug)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // Get sections for this course
    const { data: sections, error: sectionsError } = await supabase
      .from("course_sections")
      .select("*")
      .eq("course_id", course.id)
      .order("order_index", { ascending: true });

    if (sectionsError) {
      console.error("Error fetching sections:", sectionsError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch sections" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sections || [],
    });
  } catch (error) {
    console.error("Error in sections API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}


