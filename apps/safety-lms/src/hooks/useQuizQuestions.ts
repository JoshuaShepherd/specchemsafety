"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { QuizQuestion } from "@/lib/types/lms-content";

export function useQuizQuestions(sectionId?: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
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

        const response = await fetch(`/api/quiz-questions?${params}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch quiz questions: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch quiz questions");
        }

        setQuestions(data.data || []);
      } catch (err) {
        console.error("Error fetching quiz questions:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch quiz questions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user, sectionId]);

  const createQuestion = async (
    questionData: Omit<QuizQuestion, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/quiz-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create quiz question: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create quiz question");
      }

      // Refresh questions
      setQuestions(prev => [...prev, data.data]);
      return data.data;
    } catch (err) {
      console.error("Error creating quiz question:", err);
      throw err;
    }
  };

  return {
    questions,
    loading,
    error,
    createQuestion,
    refetch: () => {
      if (user) {
        setLoading(true);
        setError(null);
      }
    },
  };
}
