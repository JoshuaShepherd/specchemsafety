import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; sectionId: string }> }
) {
  try {
    const supabase = await createClient();
    const { slug, sectionId } = await params;

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

    // Verify the section belongs to this course
    const { data: section, error: sectionError } = await supabase
      .from("course_sections")
      .select("id")
      .eq("id", sectionId)
      .eq("course_id", course.id)
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }

    // Get content blocks for this section
    const { data: contentBlocks, error: contentBlocksError } = await supabase
      .from("content_blocks")
      .select("*")
      .eq("section_id", sectionId)
      .order("order_index", { ascending: true });

    if (contentBlocksError) {
      console.error("Error fetching content blocks:", contentBlocksError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch content blocks" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contentBlocks || [],
    });
  } catch (error) {
    console.error("Error in content blocks API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
