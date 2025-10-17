"use client";

import { useUser } from "@/hooks/useUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function ProgressPage() {
  const { user, profile, isAuthenticated } = useUser();

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we load your progress.
          </p>
        </div>
      </div>
    );
  }

  // Mock progress data - in real app this would come from API
  const mockProgress = [
    {
      id: "1",
      courseTitle: "Workplace Safety Fundamentals",
      progress: 75,
      status: "in_progress",
      enrolledAt: "2024-01-15",
      lastActiveAt: "2024-01-20",
      estimatedCompletion: "2024-01-25",
    },
    {
      id: "2",
      courseTitle: "Chemical Handling Procedures",
      progress: 100,
      status: "completed",
      enrolledAt: "2024-01-10",
      completedAt: "2024-01-18",
    },
    {
      id: "3",
      courseTitle: "Emergency Response Training",
      progress: 0,
      status: "not_started",
      enrolledAt: "2024-01-20",
    },
  ];

  const totalCourses = mockProgress.length;
  const completedCourses = mockProgress.filter(
    c => c.status === "completed"
  ).length;
  const inProgressCourses = mockProgress.filter(
    c => c.status === "in_progress"
  ).length;
  const averageProgress = Math.round(
    mockProgress.reduce((sum, c) => sum + c.progress, 0) / totalCourses
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="default" className="bg-blue-500">
            In Progress
          </Badge>
        );
      case "not_started":
        return <Badge variant="secondary">Not Started</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "not_started":
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Learning Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your safety training progress and completion status
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">Enrolled courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalCourses > 0
                  ? Math.round((completedCourses / totalCourses) * 100)
                  : 0}
                % completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inProgressCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently learning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Progress
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageProgress}%</div>
              <p className="text-xs text-muted-foreground">
                Overall completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Course Progress
          </h2>

          {mockProgress.map(course => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(course.status)}
                    <div>
                      <CardTitle className="text-lg">
                        {course.courseTitle}
                      </CardTitle>
                      <CardDescription>
                        Enrolled on{" "}
                        {new Date(course.enrolledAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(course.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Last Active:</span>{" "}
                      {course.lastActiveAt
                        ? new Date(course.lastActiveAt).toLocaleDateString()
                        : "Never"}
                    </div>
                    {course.status === "completed" && course.completedAt && (
                      <div>
                        <span className="font-medium">Completed:</span>{" "}
                        {new Date(course.completedAt).toLocaleDateString()}
                      </div>
                    )}
                    {course.status === "in_progress" &&
                      course.estimatedCompletion && (
                        <div>
                          <span className="font-medium">
                            Estimated Completion:
                          </span>{" "}
                          {new Date(
                            course.estimatedCompletion
                          ).toLocaleDateString()}
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockProgress.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No courses enrolled
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                You haven&apos;t enrolled in any courses yet. Browse available
                courses to get started.
              </p>
              <a
                href="/courses"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Browse Courses
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
