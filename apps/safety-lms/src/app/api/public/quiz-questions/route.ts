import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const sectionId = searchParams.get("sectionId");

    if (!sectionId) {
      return NextResponse.json(
        { success: false, error: "Section ID is required" },
        { status: 400 }
      );
    }

    // Create Supabase client (no auth required for public content)
    const supabase = await createServerSupabaseClient();

    // Get quiz questions for the specified section
    const { data: quizQuestions, error } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("section_id", sectionId)
      .eq("is_published", true) // Only published questions
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching public quiz questions:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch quiz questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quizQuestions || [],
    });
  } catch (error) {
    console.error("Public quiz questions API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
