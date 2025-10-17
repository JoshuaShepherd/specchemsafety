import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, serverAuth } from "@/lib/supabase/server";
import {
  createStrictApiResponse,
  createStrictApiErrorResponse,
  CURRENT_API_VERSION,
  StrictPaginationSchema,
} from "@/lib/types/api-contracts";
import { z } from "zod";

// Plant creation schema
const createPlantSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  is_active: z.boolean().default(true),
});

// Plant update schema
const updatePlantSchema = createPlantSchema.partial();

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { user } = await serverAuth.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHENTICATION_ERROR",
          "Authentication required",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const includeInactive = searchParams.get("includeInactive") === "true";

    // Validate pagination
    const pagination = StrictPaginationSchema.parse({
      page,
      limit,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    });

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Build query
    let query = supabase.from("plants").select(`
        *,
        profiles:profiles!plant_id (
          id,
          first_name,
          last_name,
          email,
          role
        )
      `);

    // Filter out inactive plants unless specifically requested
    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    // Get total count
    const { count } = await supabase
      .from("plants")
      .select("*", { count: "exact", head: true });

    // Get plants with pagination
    const { data: plants, error } = await query
      .select("*")
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(
        (pagination.page - 1) * pagination.limit,
        pagination.page * pagination.limit - 1
      );

    if (error) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          "Failed to fetch plants",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 500 }
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pagination.limit);

    // Return success response with pagination
    return NextResponse.json({
      success: true,
      data: plants || [],
      version: CURRENT_API_VERSION,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Plants GET API error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "VALIDATION_ERROR",
          "Invalid query parameters",
          [
            {
              message: error.message,
              code: "VALIDATION_ERROR",
            },
          ],
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 400 }
      );
    }

    return NextResponse.json(
      createStrictApiErrorResponse(
        "INTERNAL_ERROR",
        "An unexpected error occurred",
        undefined,
        CURRENT_API_VERSION,
        {
          requestId: crypto.randomUUID(),
          path: request.nextUrl.pathname,
          method: request.method,
        }
      ),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, profile } = await serverAuth.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHENTICATION_ERROR",
          "Authentication required",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 401 }
      );
    }

    // Check if user has permission to create plants (admin only)
    if (profile?.role !== "admin") {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHORIZATION_ERROR",
          "Only administrators can create plants",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validatedData = createPlantSchema.parse(body);

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Check if plant with same name already exists
    const { data: existingPlant } = await supabase
      .from("plants")
      .select("id")
      .eq("name", validatedData.name)
      .eq("is_active", true)
      .single();

    if (existingPlant) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "DUPLICATE",
          "A plant with this name already exists",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 409 }
      );
    }

    // Create plant
    const { data: plant, error } = await supabase
      .from("plants")
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "SYSTEM_ERROR",
          "Failed to create plant",
          undefined,
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      createStrictApiResponse(plant, CURRENT_API_VERSION, {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Plants POST API error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "VALIDATION_ERROR",
          "Invalid request data",
          [
            {
              message: error.message,
              code: "VALIDATION_ERROR",
            },
          ],
          CURRENT_API_VERSION,
          {
            requestId: crypto.randomUUID(),
            path: request.nextUrl.pathname,
            method: request.method,
          }
        ),
        { status: 400 }
      );
    }

    return NextResponse.json(
      createStrictApiErrorResponse(
        "INTERNAL_ERROR",
        "An unexpected error occurred",
        undefined,
        CURRENT_API_VERSION,
        {
          requestId: crypto.randomUUID(),
          path: request.nextUrl.pathname,
          method: request.method,
        }
      ),
      { status: 500 }
    );
  }
}
