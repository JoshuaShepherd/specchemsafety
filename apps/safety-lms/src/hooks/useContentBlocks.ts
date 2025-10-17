"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { ContentBlock } from "@/lib/types/lms-content";

export function useContentBlocks(sectionId?: string) {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (sectionId) {
          params.append("sectionId", sectionId);
        }

        const response = await fetch(`/api/content-blocks?${params}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch content blocks: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch content blocks");
        }

        setBlocks(data.data || []);
      } catch (err) {
        console.error("Error fetching content blocks:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch content blocks"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, [user, sectionId]);

  const createBlock = async (
    blockData: Omit<ContentBlock, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/content-blocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blockData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create content block: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create content block");
      }

      // Refresh blocks
      setBlocks(prev => [...prev, data.data]);
      return data.data;
    } catch (err) {
      console.error("Error creating content block:", err);
      throw err;
    }
  };

  return {
    blocks,
    loading,
    error,
    createBlock,
    refetch: () => {
      if (user) {
        setLoading(true);
        setError(null);
      }
    },
  };
}
