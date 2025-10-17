"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CourseNavigation,
  type CourseModule,
} from "@/components/navigation/course-navigation";
import {
  PlayCircle,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  Globe,
} from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useCourseSections } from "@/hooks/useCourseSections";
import { ContentBlockRenderer } from "@/components/content/ContentBlockRenderer";
import { useCourseLearning } from "@/hooks/useCourseLearning";
import { useSectionTranslation, useCourseTranslation } from "@/hooks/useTranslations";
import { LanguageSwitcher } from "@/components/course/language-switcher";

export default function SectionLearningPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { courses, loading: coursesLoading } = useCourses();

  const slug = params.slug as string;
  const sectionId = params.sectionId as string;
  const currentLang = (searchParams.get("lang") || "en") as "en" | "es" | "fr" | "de";
  
  const course = courses.find(c => c.slug === slug);
  
  // Get translation data
  const {
    translation: courseTranslation,
    availableLanguages,
  } = useCourseTranslation(course?.id || "", currentLang);
  
  
  const {
    translationData: sectionTranslation,
    loading: translationLoading,
  } = useSectionTranslation(sectionId, currentLang);
  
  const { sections, loading: sectionsLoading, error: sectionsError } = useCourseSections(slug);
  const { 
    contentBlocks, 
    loading: contentLoading, 
    error: contentError 
  } = useCourseLearning(slug, sectionId);
  
  // Find current section
  const currentSection = sections.find(s => s.id === sectionId);
  const currentIndex = sections.findIndex(s => s.id === sectionId);
  
  // Use translated title when available
  const displaySectionTitle = sectionTranslation?.section?.title || currentSection?.title;
  
  // Convert database sections to CourseModule format
  const modules: CourseModule[] = React.useMemo(() => {
    return sections.map((section, index) => ({
      id: section.id,
      title: section.title,
      description: `Section ${index + 1} of the ${course?.title || 'course'}`,
      duration: "30 minutes", // Default duration
      type: "reading" as const,
      status: index < currentIndex ? "completed" : index === currentIndex ? "in_progress" : "available",
      progress: index < currentIndex ? 100 : index === currentIndex ? 0 : 0,
      href: `/courses/${slug}/learn/${section.id}`,
    }));
  }, [sections, course, slug, currentIndex]);

  // Calculate overall progress
  const overallProgress = React.useMemo(() => {
    if (modules.length === 0) return 0;
    
    const completedModules = modules.filter(
      m => m.status === "completed"
    ).length;
    const inProgressModules = modules.filter(
      m => m.status === "in_progress"
    ).length;
    const totalModules = modules.length;

    const completedProgress = (completedModules / totalModules) * 100;
    const inProgressProgress = (inProgressModules / totalModules) * 50; // Assume 50% for in-progress

    return completedProgress + inProgressProgress;
  }, [modules]);

  // Loading state
  if (coursesLoading || sectionsLoading || contentLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-3 text-neutral-600">Loading course content...</span>
      </div>
    );
  }

  // Error state
  if (sectionsError || contentError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-100">
          Error Loading Course
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          {sectionsError || contentError}
        </p>
        <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-100">
          Course Not Found
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
      </div>
    );
  }

  // Section not found
  if (!currentSection) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-100">
          Section Not Found
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          The section you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push(`/courses/${slug}/learn`)}>Back to Course</Button>
      </div>
    );
  }

  // No content blocks available
  if (contentBlocks.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-neutral-100">
          Content Coming Soon
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          This section doesn't have any content yet. Content is being prepared.
        </p>
        <Button onClick={() => router.push(`/courses/${slug}/learn`)}>Back to Course</Button>
      </div>
    );
  }

  const nextSection = sections[currentIndex + 1];
  const prevSection = sections[currentIndex - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Course Navigation Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <CourseNavigation
            courseTitle={course.title}
            modules={modules}
            currentModuleId={currentSection.id}
            overallProgress={overallProgress}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-8">
        {/* Course Header */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const langParam = currentLang !== "en" ? `?lang=${currentLang}` : "";
                router.push(`/courses/${slug}/learn${langParam}`);
              }}
              className="flex items-center gap-2"
            >
                <ArrowLeft className="h-4 w-4" />
                {currentLang === "es" ? "Volver al Curso" : "Back to Course"}
            </Button>
            {availableLanguages.length > 1 && course?.id && (
              <LanguageSwitcher
                availableLanguages={availableLanguages}
                currentLanguage={currentLang}
              />
            )}
          </div>
          {currentLang !== "en" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Viendo en Español
                </p>
                <p className="text-xs text-blue-700">
                  Puedes cambiar el idioma en cualquier momento usando el selector arriba
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Current Section Content */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <PlayCircle className="h-6 w-6 text-primary-600" />
                <div>
                  <CardTitle className="text-neutral-900 dark:text-neutral-100">
                    {displaySectionTitle}
                  </CardTitle>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {currentLang === "es" ? `Sección ${currentIndex + 1} de ${sections.length} • Lectura • 30 minutos` : `Section ${currentIndex + 1} of ${sections.length} • Reading • 30 minutes`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <Clock className="h-4 w-4" />
                <span>{currentLang === "es" ? "30 minutos restantes" : "30 minutes remaining"}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  {currentLang === "es" ? "Progreso de Sección" : "Section Progress"}
                </span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  0%
                </span>
              </div>
              <Progress value={0} className="h-2" />
            </div>

            {/* Content Blocks */}
            <div className="space-y-6">
              {contentBlocks.map((block, index) => (
                <ContentBlockRenderer
                  key={block.id}
                  block={block}
                  sectionId={sectionId}
                  language={currentLang}
                  translation={sectionTranslation?.contentBlocks[block.id]}
                  onInteraction={(interaction) => {
                    // Handle content interactions if needed
                    console.log('Content interaction:', interaction);
                  }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <Button
                variant="outline"
                disabled={!prevSection}
                onClick={() => {
                  if (prevSection) {
                    const langParam = currentLang !== "en" ? `?lang=${currentLang}` : "";
                    router.push(`/courses/${slug}/learn/${prevSection.id}${langParam}`);
                  }
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {currentLang === "es" ? "Sección Anterior" : "Previous Section"}
              </Button>

              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Take Notes
                </Button>
                <Button 
                  onClick={() => {
                    const langParam = currentLang !== "en" ? `?lang=${currentLang}` : "";
                    if (nextSection) {
                      router.push(`/courses/${slug}/learn/${nextSection.id}${langParam}`);
                    } else {
                      router.push(`/courses/${slug}${langParam}`);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  {nextSection ? (currentLang === "es" ? 'Siguiente Sección' : 'Next Section') : (currentLang === "es" ? 'Completar Curso' : 'Complete Course')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
