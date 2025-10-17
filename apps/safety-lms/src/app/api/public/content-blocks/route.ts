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

    // Get content blocks for the specified section
    const { data: contentBlocks, error } = await supabase
      .from("content_blocks")
      .select("*")
      .eq("section_id", sectionId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching public content blocks:", error);
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
    console.error("Public content blocks API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
