"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Lock,
  PlayCircle,
  Clock,
  FileText,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  type: "video" | "reading" | "quiz" | "assignment";
  status: "locked" | "available" | "in_progress" | "completed";
  progress?: number;
  href: string;
}

export interface CourseNavigationProps {
  courseTitle: string;
  modules: CourseModule[];
  currentModuleId?: string;
  overallProgress?: number;
  className?: string;
}

const getModuleIcon = (type: CourseModule["type"]) => {
  switch (type) {
    case "video":
      return PlayCircle;
    case "reading":
      return FileText;
    case "quiz":
      return FileText;
    case "assignment":
      return FileText;
    default:
      return FileText;
  }
};

const getStatusIcon = (status: CourseModule["status"]) => {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "locked":
      return Lock;
    default:
      return null;
  }
};

const getStatusColor = (status: CourseModule["status"]) => {
  switch (status) {
    case "completed":
      return "text-accent-green-600";
    case "in_progress":
      return "text-primary-600";
    case "locked":
      return "text-neutral-400";
    default:
      return "text-neutral-500";
  }
};

export function CourseNavigation({
  courseTitle,
  modules,
  currentModuleId,
  overallProgress = 0,
  className,
}: CourseNavigationProps) {
  const pathname = usePathname();
  const currentIndex = modules.findIndex(m => m.id === currentModuleId);

  const previousModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule =
    currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
          {courseTitle}
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
            <span>Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Module Navigation */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Course Modules
          </h3>
          <nav className="space-y-2">
            {modules.map((module, index) => {
              const Icon = getModuleIcon(module.type);
              const StatusIcon = getStatusIcon(module.status);
              const isActive = module.id === currentModuleId;
              const isDisabled = module.status === "locked";

              return (
                <div key={module.id} className="relative">
                  <Link
                    href={isDisabled ? "#" : module.href}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                      "hover:bg-neutral-50 dark:hover:bg-neutral-800",
                      isActive &&
                        "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800",
                      isDisabled && "cursor-not-allowed opacity-60"
                    )}
                    onClick={e => isDisabled && e.preventDefault()}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "flex-shrink-0 mt-0.5",
                          getStatusColor(module.status)
                        )}
                      >
                        {StatusIcon ? (
                          <StatusIcon className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                            {index + 1}
                          </span>
                          <p
                            className={cn(
                              "text-sm font-medium truncate",
                              isActive &&
                                "text-primary-600 dark:text-primary-400"
                            )}
                          >
                            {module.title}
                          </p>
                        </div>

                        {module.description && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-2">
                            {module.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                            {module.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {module.duration}
                              </div>
                            )}
                          </div>

                          {module.progress !== undefined &&
                            module.progress > 0 && (
                              <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                                {module.progress}%
                              </div>
                            )}
                        </div>

                        {module.progress !== undefined &&
                          module.progress > 0 &&
                          module.progress < 100 && (
                            <div className="mt-2">
                              <Progress
                                value={module.progress}
                                className="h-1"
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            variant="outline"
            size="sm"
            disabled={!previousModule || previousModule.status === "locked"}
            asChild={
              previousModule && previousModule.status !== "locked"
                ? true
                : false
            }
            className="flex items-center gap-2"
          >
            {previousModule && previousModule.status !== "locked" ? (
              <Link href={previousModule.href}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </>
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            disabled={!nextModule || nextModule.status === "locked"}
            asChild={
              nextModule && nextModule.status !== "locked" ? true : false
            }
            className="flex items-center gap-2"
          >
            {nextModule && nextModule.status !== "locked" ? (
              <Link href={nextModule.href}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
