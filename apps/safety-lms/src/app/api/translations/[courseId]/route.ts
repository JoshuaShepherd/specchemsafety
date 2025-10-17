import { NextRequest, NextResponse } from "next/server";
import { serverAuth } from "@/lib/supabase/server";
import {
  getCourseTranslation,
  getAvailableCourseLanguages,
} from "@/lib/db/queries";

/**
 * GET /api/translations/[courseId]
 * Get available translations for a course
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    // Temporarily remove auth requirement for testing
    // const { user } = await serverAuth.getCurrentUser();
    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const { courseId } = await params;
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") as "en" | "es" | "fr" | "de" | null;

    // If specific language requested
    if (language) {
      const translation = await getCourseTranslation(courseId, language);
      
      if (!translation) {
        return NextResponse.json(
          { success: false, error: "Translation not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: translation,
      });
    }

    // Otherwise, return available languages
    const availableLanguages = await getAvailableCourseLanguages(courseId);

    return NextResponse.json({
      success: true,
      data: {
        availableLanguages,
      },
    });
  } catch (error) {
    console.error("Error fetching course translations:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

