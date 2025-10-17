import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createStrictApiResponse,
  createStrictApiErrorResponse,
  CURRENT_API_VERSION,
} from "@/lib/types/api-contracts";

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Sign out with Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        createStrictApiErrorResponse(
          "AUTHENTICATION_ERROR",
          error.message,
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
      createStrictApiResponse(
        {
          message: "Successfully signed out",
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
    console.error("Logout API error:", error);

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
