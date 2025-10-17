"use client";

import { useState, useEffect } from "react";

export interface ContentBlock {
  id: string;
  sectionId: string;
  blockType: string;
  orderIndex: number;
  content: any;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export function useCourseLearning(courseSlug: string, sectionId: string) {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentBlocks = async () => {
      if (!courseSlug || !sectionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/courses/${courseSlug}/sections/${sectionId}/content`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch content blocks: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch content blocks");
        }

        setContentBlocks(data.data || []);
      } catch (err) {
        console.error("Error fetching content blocks:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch content blocks"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContentBlocks();
  }, [courseSlug, sectionId]);

  return { contentBlocks, loading, error };
}