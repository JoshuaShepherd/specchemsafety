"use client";

import { useState, useEffect } from "react";

export interface CourseSection {
  id: string;
  courseId: string;
  sectionKey: string;
  title: string;
  orderIndex: number;
  iconName: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useCourseSections(courseSlug: string) {
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      if (!courseSlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/courses/${courseSlug}/sections`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch sections: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch sections");
        }

        setSections(data.data || []);
      } catch (err) {
        console.error("Error fetching course sections:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch sections"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseSlug]);

  return { sections, loading, error };
}
