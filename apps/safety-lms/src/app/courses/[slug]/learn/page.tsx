import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AlertCircle, BookOpen } from "lucide-react";

export default async function CourseLearningPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const supabase = await createClient();
  const { slug } = await params;

  // Fetch course details
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title")
    .eq("slug", slug)
    .single();

  if (courseError || !course) {
    console.error("Error fetching course:", courseError);
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-100">
          Error Loading Course
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          {courseError?.message || "Course not found or an unexpected error occurred."}
        </p>
      </div>
    );
  }

  // Fetch sections for the course
  const { data: sections, error: sectionsError } = await supabase
    .from("course_sections")
    .select("id, title, order_index")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  if (sectionsError) {
    console.error("Error fetching sections:", sectionsError);
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-100">
          Error Loading Sections
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          {sectionsError.message || "An unexpected error occurred while loading sections."}
        </p>
      </div>
    );
  }

  // If no sections, display a message
  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-100">
          Course Content Coming Soon
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          This course doesn't have any sections yet. Content is being prepared.
        </p>
      </div>
    );
  }

  // Redirect to the first section
  redirect(`/courses/${slug}/learn/${sections[0].id}`);
}