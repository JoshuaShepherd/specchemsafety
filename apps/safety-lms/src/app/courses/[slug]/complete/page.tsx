"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Award,
  Download,
  ArrowRight,
  Home,
  BookOpen,
  Clock,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";

export default function CourseCompletePage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.slug as string;
  const { courses } = useCourses();
  const { user, profile } = useAuth();

  const course = courses.find(c => c.slug === courseSlug);

  const handleDownloadCertificate = () => {
    // TODO: Implement certificate download
    console.log("Download certificate for course:", courseSlug);
  };

  const handleViewCourses = () => {
    router.push("/courses");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
          <Button onClick={() => router.push("/courses")}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>

          {/* Main Message */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Congratulations!
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            You have successfully completed
          </p>
          <h2 className="text-2xl font-semibold text-primary mb-6">
            {course.title}
          </h2>
        </div>

        {/* Completion Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Course Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {course.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Plant</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.plant_id || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Completed</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificate Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificate of Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-2">
                  Download your official certificate of completion
                </p>
                <p className="text-sm text-muted-foreground">
                  This certificate verifies your successful completion of the
                  course and can be used for compliance records.
                </p>
              </div>
              <Button
                onClick={handleDownloadCertificate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Learning Objectives Review */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What You Learned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.objectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{objective}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Congratulations on completing this important safety training!
                Here are some recommended next steps:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Apply the knowledge and skills learned in your daily work
                    activities
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Keep your certificate in your personal training records
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Review the material periodically to maintain your knowledge
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Consider taking additional safety training courses
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleViewCourses}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            View More Courses
          </Button>

          <Button
            onClick={handleGoToDashboard}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
