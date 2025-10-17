"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  PlayCircle,
  CheckCircle,
  ArrowLeft,
  Globe,
  Shield,
  AlertTriangle,
  Wrench,
  Leaf,
  FileText,
  Loader2,
  Target,
  Award,
} from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useCourseTranslation } from "@/hooks/useTranslations";
import { LanguageSwitcher } from "@/components/course/language-switcher";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { courses, loading, error } = useCourses();
  const { getCourseStatus } = useUserProgress();

  const slug = params.slug as string;
  const currentLang = (searchParams.get("lang") || "en") as "en" | "es" | "fr" | "de";

  // Find the course by slug
  const course = courses.find(c => c.slug === slug);

  // Get translation data
  const {
    translation: courseTranslation,
    availableLanguages,
    loading: translationLoading,
  } = useCourseTranslation(course?.id || "", currentLang);

  // Get user's progress for this course
  const userStatus = course ? getCourseStatus(course.id) : null;

  // Use translated content when available
  const displayTitle = courseTranslation?.title || course?.title;
  const displayDescription = courseTranslation?.description || course?.description;

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading course...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Course</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.push("/courses")}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Course Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The course you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push("/courses")}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Chemical Safety":
        return AlertTriangle;
      case "Equipment Safety":
        return Wrench;
      case "Environmental Safety":
        return Leaf;
      case "Emergency Response":
        return Shield;
      default:
        return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const CategoryIcon = getCategoryIcon(course.category);

  return (
    <div className="space-y-section-normal">
      {/* Header */}
      <div className="flex items-center gap-inline-normal">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-inline-tight"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <div className="space-y-3 mb-2">
            <div className="flex items-center justify-between gap-inline-tight">
              <div className="flex items-center gap-inline-tight">
                <CategoryIcon className="h-5 w-5 text-primary" />
                <Badge className={getDifficultyColor(course.difficulty)}>
                  {course.difficulty}
                </Badge>
              </div>
              {availableLanguages.length > 1 && course?.id && (
                <LanguageSwitcher
                  availableLanguages={availableLanguages}
                  currentLanguage={currentLang}
                />
              )}
            </div>
            {currentLang !== "en" && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                <Globe className="h-3 w-3 mr-1" />
                Español
              </Badge>
            )}
          </div>
          <h1 className="heading-1">{displayTitle}</h1>
          <p className="body-large text-muted-foreground mt-2">
            {displayDescription}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-relaxed">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-section-tight">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-inline-tight">
                <BookOpen className="h-5 w-5" />
                Course Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-component-normal">
              <div className="grid grid-cols-2 gap-component-normal">
                <div className="flex items-center gap-inline-relaxed">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {course.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-inline-relaxed">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Enrolled</p>
                    <p className="text-sm text-muted-foreground">
                      {course.enrolledUsers} students
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-inline-relaxed">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <div>
                    <p className="text-sm font-medium">Rating</p>
                    <p className="text-sm text-muted-foreground">
                      {course.rating}/5.0
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-inline-relaxed">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Instructor</p>
                    <p className="text-sm text-muted-foreground">
                      {course.instructor}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-component-normal border-t">
                <p className="text-sm text-muted-foreground">
                  Last updated: {course.lastUpdated}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-inline-tight">
                <Target className="h-5 w-5" />
                Learning Objectives
              </CardTitle>
              <CardDescription>
                What you&apos;ll learn in this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-stack-tight">
                {course.objectives.map((objective, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-inline-relaxed"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                Detailed curriculum and learning modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-component-normal">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Module 1: Introduction</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Overview of {course.category.toLowerCase()} fundamentals and
                    key concepts.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    15 minutes
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Module 2: Core Concepts</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Deep dive into the main principles and practices.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    45 minutes
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">
                    Module 3: Practical Applications
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Real-world scenarios and hands-on exercises.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    60 minutes
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Module 4: Assessment</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Knowledge check and certification requirements.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    30 minutes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-section-tight">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-component-normal">
              {userStatus && userStatus.progressPercent > 0 ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{userStatus.progressPercent}%</span>
                    </div>
                    <Progress
                      value={userStatus.progressPercent}
                      className="h-2"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        userStatus.status === "completed"
                          ? "bg-green-500"
                          : userStatus.status === "in_progress"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                      }`}
                    />
                    Status: {userStatus.status.replace("_", " ")}
                  </div>
                  {userStatus.progress?.lastAccessedAt && (
                    <div className="text-xs text-muted-foreground">
                      Last active:{" "}
                      {new Date(
                        userStatus.progress.lastAccessedAt
                      ).toLocaleDateString()}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    You haven&apos;t started this course yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-component-normal">
              <Button
                className="w-full flex items-center gap-inline-tight"
                size="lg"
                onClick={() => {
                  const langParam = currentLang !== "en" ? `?lang=${currentLang}` : "";
                  router.push(`/courses/${course.slug}/learn${langParam}`);
                }}
              >
                {userStatus?.status === "completed" ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Review Course
                  </>
                ) : userStatus?.status === "in_progress" ? (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    Continue Learning
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    Start Course
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground space-y-stack-tight">
                <p>• Self-paced learning</p>
                <p>• Certificate of completion</p>
                <p>• Mobile-friendly</p>
                <p>• {course.language} language support</p>
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {course.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-stack-tight">
                  {course.prerequisites.map((prereq, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-inline-tight text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {prereq}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
