"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  CheckCircle,
  Lock,
  Clock,
  PlayCircle,
  ArrowRight,
  Bookmark,
  Target,
  Unlock,
} from "lucide-react";
import { useState } from "react";
import { CourseSection } from "@/hooks/useCourseSections";

interface CourseSidebarProps {
  sections: CourseSection[];
  currentSectionId?: string;
  completedSections: string[];
  onSectionSelect: (sectionIndex: number) => void;
  isSectionAccessible: (sectionIndex: number) => boolean;
  overallProgress: number;
  timeSpent: number;
  courseTitle: string;
}

export function CourseSidebar({
  sections,
  currentSectionId,
  completedSections,
  onSectionSelect,
  isSectionAccessible,
  overallProgress,
  timeSpent,
  courseTitle,
}: CourseSidebarProps) {
  const [demoMode, setDemoMode] = useState(false);

  // Override section accessibility in demo mode
  const isSectionAccessibleOverride = (index: number) => {
    if (demoMode) return true; // Unlock all sections in demo mode
    return isSectionAccessible(index);
  };
  const getSectionIcon = (iconName?: string) => {
    switch (iconName) {
      case "book-open":
        return BookOpen;
      case "package":
        return Bookmark;
      case "alert-triangle":
        return Target;
      case "shield-check":
        return CheckCircle;
      case "search":
        return BookOpen;
      case "tag":
        return Bookmark;
      case "lock":
        return Lock;
      case "check-circle":
        return CheckCircle;
      case "bookmark":
        return Bookmark;
      default:
        return BookOpen;
    }
  };

  const getSectionStatus = (section: CourseSection, index: number) => {
    if (completedSections.includes(section.id)) {
      return "completed";
    }
    if (section.id === currentSectionId) {
      return "current";
    }
    if (isSectionAccessible(index)) {
      return "accessible";
    }
    return "locked";
  };

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="w-80 space-y-6">
      {/* Course Progress Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Course Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Time spent: {formatTimeSpent(timeSpent)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            <span>
              {completedSections.length} of {sections.length} sections completed
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Demo Mode Toggle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Unlock className="h-5 w-5" />
            Demo Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="demo-mode"
              checked={demoMode}
              onCheckedChange={setDemoMode}
            />
            <Label htmlFor="demo-mode" className="text-sm">
              Unlock all sections for testing
            </Label>
          </div>
          {demoMode && (
            <p className="text-xs text-muted-foreground">
              Demo mode allows you to access all sections without completing
              prerequisites.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Course Content Navigation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Course Content</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {sections.map((section, index) => {
              const Icon = getSectionIcon((section as any).icon_name || section.iconName);
              const status = getSectionStatus(section, index);
              const isCurrent = section.id === currentSectionId;
              const isCompleted = completedSections.includes(section.id);
              const isAccessible = isSectionAccessibleOverride(index);

              let buttonClasses = "w-full justify-start text-left p-3 h-auto";
              let iconClasses = "h-4 w-4 mr-3 flex-shrink-0";
              let textClasses = "font-medium";
              let badgeClasses = "";

              if (status === "completed") {
                buttonClasses +=
                  " bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30";
                iconClasses += " text-green-600 dark:text-green-400";
                textClasses += " text-green-900 dark:text-green-100";
                badgeClasses =
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
              } else if (status === "current") {
                buttonClasses +=
                  " bg-primary/10 hover:bg-primary/20 border-primary/20";
                iconClasses += " text-primary";
                textClasses += " text-primary";
                badgeClasses = "bg-primary/20 text-primary";
              } else if (status === "accessible") {
                buttonClasses += " hover:bg-muted";
                iconClasses += " text-muted-foreground";
                textClasses += " text-foreground";
              } else {
                buttonClasses += " opacity-50 cursor-not-allowed";
                iconClasses += " text-muted-foreground";
                textClasses += " text-muted-foreground";
              }

              return (
                <div key={section.id} className="relative">
                  <Button
                    variant="ghost"
                    className={buttonClasses}
                    onClick={() => isAccessible && onSectionSelect(index)}
                    disabled={!isAccessible}
                  >
                    <div className="flex items-center w-full">
                      {isCompleted ? (
                        <CheckCircle
                          className={`${iconClasses} text-green-600 dark:text-green-400`}
                        />
                      ) : status === "locked" ? (
                        <Lock className={`${iconClasses}`} />
                      ) : (
                        <Icon className={iconClasses} />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${textClasses} truncate`}>
                            {section.title}
                          </span>
                          {isCurrent && (
                            <Badge variant="secondary" className={badgeClasses}>
                              Current
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="secondary" className={badgeClasses}>
                              Complete
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Section {index + 1}
                        </div>
                      </div>

                      {status === "accessible" && !isCurrent && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground ml-2" />
                      )}
                    </div>
                  </Button>

                  {/* Connection line to next section */}
                  {index < sections.length - 1 && (
                    <div className="absolute left-6 top-12 w-px h-4 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmark Current Section
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <Target className="h-4 w-4 mr-2" />
            View Learning Objectives
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <BookOpen className="h-4 w-4 mr-2" />
            Course Resources
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
