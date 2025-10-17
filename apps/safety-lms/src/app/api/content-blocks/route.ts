import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const sectionId = searchParams.get("sectionId");

    if (!sectionId) {
      return NextResponse.json(
        { success: false, error: "Section ID is required" },
        { status: 400 }
      );
    }

    // Fetch content blocks for the section
    const { data: contentBlocks, error } = await supabase
      .from("content_blocks")
      .select("*")
      .eq("section_id", sectionId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching content blocks:", error);
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
    console.error("Content blocks API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const { section_id, block_type, content, metadata, order_index } = body;

    if (!section_id || !block_type || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create content block
    const { data: contentBlock, error } = await supabase
      .from("content_blocks")
      .insert({
        section_id,
        block_type,
        content,
        metadata: metadata || {},
        order_index: order_index || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating content block:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create content block" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contentBlock,
    });
  } catch (error) {
    console.error("Content blocks API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
