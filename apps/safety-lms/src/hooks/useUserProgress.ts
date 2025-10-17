"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { UserProgress } from "@/lib/types/lms-content";

export function useUserProgress(courseId?: string, sectionId?: string) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (courseId) {
          params.append("courseId", courseId);
        }
        if (sectionId) {
          params.append("sectionId", sectionId);
        }

        const response = await fetch(`/api/user-progress?${params}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user progress: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch user progress");
        }

        setProgress(data.data || []);
      } catch (err) {
        console.error("Error fetching user progress:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch user progress"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, courseId, sectionId]);

  const createProgress = async (
    progressData: Omit<UserProgress, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/user-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(progressData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create user progress: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create user progress");
      }

      // Refresh progress
      setProgress(prev => [...prev, data.data]);
      return data.data;
    } catch (err) {
      console.error("Error creating user progress:", err);
      throw err;
    }
  };

  // Get course status for a specific course
  const getCourseStatus = useCallback((courseId: string): {
    status: "not_started" | "in_progress" | "completed";
    progressPercent: number;
    progress?: UserProgress;
  } => {
    // Find progress for this course
    const courseProgress = progress.find(p => p.courseId === courseId);
    
    if (!courseProgress) {
      return {
        status: "not_started",
        progressPercent: 0,
      };
    }
    
    // Determine status based on progress
    let status: "not_started" | "in_progress" | "completed" = "not_started";
    if (courseProgress.isCompleted) {
      status = "completed";
    } else if (courseProgress.completionPercentage > 0) {
      status = "in_progress";
    }
    
    return {
      status,
      progressPercent: courseProgress.completionPercentage || 0,
      progress: courseProgress,
    };
  }, [progress]);

  return {
    progress,
    loading,
    error,
    createProgress,
    getCourseStatus,
    refetch: () => {
      if (user) {
        setLoading(true);
        setError(null);
      }
    },
  };
}
