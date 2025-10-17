import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const slug = searchParams.get("slug");

    // Create Supabase client (no auth required for public content)
    const supabase = await createServerSupabaseClient();

    let query = supabase.from("courses").select("*").eq("is_published", true); // Only published courses

    // Filter by slug if provided
    if (slug) {
      query = query.eq("slug", slug);
    }

    // Get courses
    const { data: courses, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching public courses:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch courses" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: courses || [],
    });
  } catch (error) {
    console.error("Public courses API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
