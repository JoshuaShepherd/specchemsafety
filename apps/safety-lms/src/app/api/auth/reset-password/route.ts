import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createStrictApiResponse,
  createStrictApiErrorResponse,
  CURRENT_API_VERSION,
} from "@/lib/types/api-contracts";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = resetPasswordSchema.parse(body);
    const { email } = validatedData;

    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Send password reset email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

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
        { status: 400 }
      );
    }

    // Return success response
    return NextResponse.json(
      createStrictApiResponse(
        {
          message: "Password reset email sent successfully",
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
    console.error("Password reset API error:", error);

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
