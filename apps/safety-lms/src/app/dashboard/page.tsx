"use client";

import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/useDashboardStats";
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
  BookOpen,
  BarChart3,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Shield,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const {
    user,
    profile,
    isAuthenticated,
    getFullName,
    getRole,
    getPermissions,
    getPlantName,
  } = useUser();
  const { signOut } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Loading...
          </h1>
          <p className="text-neutral-600">
            Please wait while we load your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const permissions = getPermissions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600 mt-2">
            Welcome back, {getFullName()}!
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-2">
          {getRole()?.charAt(0).toUpperCase() + getRole()?.slice(1)}
        </Badge>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-3 text-neutral-600">Loading statistics...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">
                Total Enrollments
              </CardTitle>
              <BookOpen className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900">
                {stats.totalEnrollments}
              </div>
              <p className="text-xs text-neutral-500">
                Active course enrollments
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-accent-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900">
                {stats.completedCourses}
              </div>
              <p className="text-xs text-neutral-500">Courses finished</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">
                In Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-accent-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900">
                {stats.inProgressCourses}
              </div>
              <p className="text-xs text-neutral-500">Active learning</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">
                Certificates
              </CardTitle>
              <Shield className="h-4 w-4 text-secondary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900">
                {stats.certificates}
              </div>
              <p className="text-xs text-neutral-500">Safety certifications</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Info Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-900">
            Account Information
          </CardTitle>
          <CardDescription>Your profile and account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500">Name</p>
                <p className="text-neutral-900 font-medium">{getFullName()}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="text-neutral-900 font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500">Role</p>
                <p className="text-neutral-900 font-medium capitalize">
                  {getRole()}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Plant</p>
                <p className="text-neutral-900 font-medium">
                  {getPlantName()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Card */}
      {permissions && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">
              Your Permissions
            </CardTitle>
            <CardDescription>Access levels and capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${permissions.canManageUsers ? "bg-accent-green-500" : "bg-neutral-300"}`}
                ></div>
                <span className="text-neutral-900">Manage Users</span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${permissions.canManageCourses ? "bg-accent-green-500" : "bg-neutral-300"}`}
                ></div>
                <span className="text-neutral-900">Manage Courses</span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${permissions.canManagePlants ? "bg-accent-green-500" : "bg-neutral-300"}`}
                ></div>
                <span className="text-neutral-900">Manage Plants</span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${permissions.canViewReports ? "bg-accent-green-500" : "bg-neutral-300"}`}
                ></div>
                <span className="text-neutral-900">View Reports</span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${permissions.canManageEnrollments ? "bg-accent-green-500" : "bg-neutral-300"}`}
                ></div>
                <span className="text-neutral-900">Manage Enrollments</span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${permissions.canViewAllData ? "bg-accent-green-500" : "bg-neutral-300"}`}
                ></div>
                <span className="text-neutral-900">View All Data</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-900">
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and navigation shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              asChild
              className="h-20 flex-col space-y-2 bg-primary-500 hover:bg-primary-600"
            >
              <a href="/courses">
                <BookOpen className="h-6 w-6" />
                <span className="font-medium">View Courses</span>
              </a>
            </Button>

            {permissions?.canViewReports && (
              <Button
                asChild
                className="h-20 flex-col space-y-2 bg-accent-green-500 hover:bg-accent-green-600"
              >
                <a href="/reports">
                  <BarChart3 className="h-6 w-6" />
                  <span className="font-medium">View Reports</span>
                </a>
              </Button>
            )}

            {permissions?.canManageUsers && (
              <Button
                asChild
                className="h-20 flex-col space-y-2 bg-secondary-600 hover:bg-secondary-700"
              >
                <a href="/users">
                  <Users className="h-6 w-6" />
                  <span className="font-medium">Manage Users</span>
                </a>
              </Button>
            )}

            {permissions?.canManagePlants && (
              <Button
                asChild
                className="h-20 flex-col space-y-2 bg-accent-orange-500 hover:bg-accent-orange-600"
              >
                <a href="/plants">
                  <Building2 className="h-6 w-6" />
                  <span className="font-medium">Manage Plants</span>
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
