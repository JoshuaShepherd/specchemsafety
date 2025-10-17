"use client";

import { useUser } from "@/hooks/useUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  Calendar,
  Plus,
  Search,
  Filter,
} from "lucide-react";

export default function EnrollmentsPage() {
  const { user, profile, isAuthenticated, getPermissions } = useUser();

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we load enrollments.
          </p>
        </div>
      </div>
    );
  }

  const permissions = getPermissions();

  // Check if user has permission to view enrollments
  if (!permissions?.canManageEnrollments) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to view enrollments.
          </p>
        </div>
      </div>
    );
  }

  // Mock enrollment data - in real app this would come from API
  const mockEnrollments = [
    {
      id: "1",
      userName: "John Smith",
      userEmail: "john.smith@specchem.com",
      courseTitle: "Workplace Safety Fundamentals",
      plantName: "Houston Plant",
      status: "enrolled",
      enrolledAt: "2024-01-15",
      progress: 75,
    },
    {
      id: "2",
      userName: "Sarah Johnson",
      userEmail: "sarah.johnson@specchem.com",
      courseTitle: "Chemical Handling Procedures",
      plantName: "Houston Plant",
      status: "completed",
      enrolledAt: "2024-01-10",
      completedAt: "2024-01-18",
      progress: 100,
    },
    {
      id: "3",
      userName: "Mike Wilson",
      userEmail: "mike.wilson@specchem.com",
      courseTitle: "Emergency Response Training",
      plantName: "Dallas Plant",
      status: "in_progress",
      enrolledAt: "2024-01-20",
      progress: 45,
    },
  ];

  const totalEnrollments = mockEnrollments.length;
  const completedEnrollments = mockEnrollments.filter(
    e => e.status === "completed"
  ).length;
  const inProgressEnrollments = mockEnrollments.filter(
    e => e.status === "in_progress"
  ).length;
  const enrolledCount = mockEnrollments.filter(
    e => e.status === "enrolled"
  ).length;

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
      case "enrolled":
        return <Badge variant="secondary">Enrolled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Course Enrollments
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage user enrollments and track training progress
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Enrollment
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Enrollments
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">All enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedEnrollments}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalEnrollments > 0
                  ? Math.round((completedEnrollments / totalEnrollments) * 100)
                  : 0}
                % completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inProgressEnrollments}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently learning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCount}</div>
              <p className="text-xs text-muted-foreground">Not started yet</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search enrollments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Enrollments List */}
        <div className="space-y-4">
          {mockEnrollments.map(enrollment => (
            <Card key={enrollment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {enrollment.userName}
                      </CardTitle>
                      <CardDescription>{enrollment.userEmail}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(enrollment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {enrollment.courseTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">Course</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {enrollment.plantName}
                      </p>
                      <p className="text-xs text-muted-foreground">Plant</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Enrolled</p>
                    </div>
                  </div>
                </div>

                {enrollment.status === "completed" &&
                  enrollment.completedAt && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        <strong>Completed:</strong>{" "}
                        {new Date(enrollment.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                {(enrollment.status === "in_progress" ||
                  enrollment.status === "enrolled") && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockEnrollments.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No enrollments found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                There are no course enrollments to display. Create a new
                enrollment to get started.
              </p>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Enrollment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
