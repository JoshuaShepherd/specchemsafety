import { NextRequest, NextResponse } from "next/server";
import { serverAuth } from "@/lib/supabase/server";
import {
  getSectionTranslation,
  getContentBlockTranslationsByIds,
  getQuizQuestionTranslationsByIds,
  getContentBlocksBySectionId,
  getCourseSectionById,
} from "@/lib/db/queries";
import { quizQuestions } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

/**
 * GET /api/translations/section/[sectionId]
 * Get translations for a specific section including content blocks and quiz questions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sectionId: string } }
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

    const { sectionId } = params;
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") as "en" | "es" | "fr" | "de" | null;

    if (!language) {
      return NextResponse.json(
        { success: false, error: "Language parameter is required" },
        { status: 400 }
      );
    }

    // Verify section exists
    const section = await getCourseSectionById(sectionId);
    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }

    // Get section translation
    const sectionTranslation = await getSectionTranslation(sectionId, language);

    // Get content blocks for this section
    const contentBlocks = await getContentBlocksBySectionId(sectionId);
    const contentBlockIds = contentBlocks.map((block) => block.id);

    // Get content block translations
    const contentBlockTranslations = await getContentBlockTranslationsByIds(
      contentBlockIds,
      language
    );

    // Get quiz questions for this section
    const quizQuestionsData = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.sectionId, sectionId));

    const quizQuestionIds = quizQuestionsData.map((q) => q.id);

    // Get quiz question translations
    const quizQuestionTranslations = await getQuizQuestionTranslationsByIds(
      quizQuestionIds,
      language
    );

    return NextResponse.json({
      success: true,
      data: {
        sectionId,
        language,
        section: sectionTranslation || null,
        contentBlocks: contentBlockTranslations,
        quizQuestions: quizQuestionTranslations,
      },
    });
  } catch (error) {
    console.error("Error fetching section translations:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

