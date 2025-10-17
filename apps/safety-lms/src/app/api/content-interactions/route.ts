import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
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

    const body = await request.json();
    const { userId, contentBlockId, interactionType, metadata } = body;

    if (!userId || !contentBlockId || !interactionType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Record content interaction
    const { data: interaction, error } = await supabase
      .from("content_interactions")
      .insert({
        user_id: userId,
        content_block_id: contentBlockId,
        interaction_type: interactionType,
        metadata: metadata || {},
        interacted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error recording content interaction:", error);
      return NextResponse.json(
        { success: false, error: "Failed to record interaction" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: interaction,
    });
  } catch (error) {
    console.error("Content interactions API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const contentBlockId = searchParams.get("contentBlockId");

    let query = supabase.from("content_interactions").select("*");

    if (userId) {
      query = query.eq("user_id", userId);
    }
    if (contentBlockId) {
      query = query.eq("content_block_id", contentBlockId);
    }

    const { data: interactions, error } = await query.order("interacted_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching content interactions:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch interactions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: interactions || [],
    });
  } catch (error) {
    console.error("Content interactions API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
