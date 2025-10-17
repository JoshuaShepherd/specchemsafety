import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createStrictApiResponse,
  createStrictApiErrorResponse,
  CURRENT_API_VERSION,
} from "@/lib/types/api-contracts";

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHENTICATION_ERROR",
          "No authenticated user",
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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHENTICATION_ERROR",
          "User profile not found",
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

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHENTICATION_ERROR",
          "Session error",
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

    // Return success response
    return NextResponse.json(
      createStrictApiResponse(
        {
          user: {
            id: user.id,
            email: user.email,
            role: profile.role,
          },
          profile: {
            id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            role: profile.role,
            plant_id: profile.plant_id,
          },
          session: session
            ? {
                access_token: session.access_token,
                refresh_token: session.refresh_token,
                expires_at: session.expires_at,
              }
            : null,
        },
        CURRENT_API_VERSION,
        {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        }
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Session API error:", error);

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
