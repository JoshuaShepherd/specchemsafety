"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export interface KnowledgeCheckProgress {
  sectionId: string;
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  isCompleted: boolean;
  lastAttemptAt?: string;
}

export function useKnowledgeCheckProgress(sectionId: string) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<KnowledgeCheckProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id || !sectionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get quiz questions for this section
        const questionsResponse = await fetch(`/api/quiz-questions?sectionId=${sectionId}`);
        if (!questionsResponse.ok) {
          throw new Error("Failed to fetch quiz questions");
        }
        const questionsData = await questionsResponse.json();
        
        if (!questionsData.success || !questionsData.data) {
          setProgress({
            sectionId,
            totalQuestions: 0,
            completedQuestions: 0,
            correctAnswers: 0,
            isCompleted: false,
          });
          setLoading(false);
          return;
        }

        const questions = questionsData.data;
        const totalQuestions = questions.length;

        // Get quiz attempts for this user and section
        const attemptsResponse = await fetch(`/api/quiz-attempts`);
        if (!attemptsResponse.ok) {
          console.error("Failed to fetch quiz attempts:", attemptsResponse.status, attemptsResponse.statusText);
          // Don't throw error, just set empty attempts
          setProgress({
            sectionId,
            totalQuestions,
            completedQuestions: 0,
            correctAnswers: 0,
            isCompleted: false,
          });
          setLoading(false);
          return;
        }
        const attemptsData = await attemptsResponse.json();

        if (!attemptsData.success || !attemptsData.data) {
          console.log("No quiz attempts found for user");
          setProgress({
            sectionId,
            totalQuestions,
            completedQuestions: 0,
            correctAnswers: 0,
            isCompleted: false,
          });
          setLoading(false);
          return;
        }

        const attempts = attemptsData.data;
        const questionIds = questions.map((q: any) => q.id);

        // Find the latest attempt for each question
        const latestAttempts = new Map();
        attempts.forEach((attempt: any) => {
          if (questionIds.includes(attempt.quizQuestionId)) {
            const existing = latestAttempts.get(attempt.quizQuestionId);
            if (!existing || new Date(attempt.attemptedAt) > new Date(existing.attemptedAt)) {
              latestAttempts.set(attempt.quizQuestionId, attempt);
            }
          }
        });

        const completedQuestions = latestAttempts.size;
        const correctAnswers = Array.from(latestAttempts.values()).filter(
          (attempt: any) => attempt.isCorrect
        ).length;

        // Get the most recent attempt timestamp
        const lastAttemptAt = Array.from(latestAttempts.values())
          .sort((a: any, b: any) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())[0]?.attemptedAt;

        setProgress({
          sectionId,
          totalQuestions,
          completedQuestions,
          correctAnswers,
          isCompleted: completedQuestions === totalQuestions && totalQuestions > 0,
          lastAttemptAt,
        });
      } catch (err) {
        console.error("Error fetching knowledge check progress:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch progress"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id, sectionId]);

  const updateProgress = async () => {
    // Refetch progress after a Knowledge Check is completed
    if (user?.id && sectionId) {
      setLoading(true);
      // Re-run the useEffect logic
      const fetchProgress = async () => {
        try {
          // Get quiz questions for this section
          const questionsResponse = await fetch(`/api/quiz-questions?sectionId=${sectionId}`);
          if (!questionsResponse.ok) return;
          const questionsData = await questionsResponse.json();
          
          if (!questionsData.success || !questionsData.data) return;

          const questions = questionsData.data;
          const totalQuestions = questions.length;

          // Get quiz attempts for this user and section
          const attemptsResponse = await fetch(`/api/quiz-attempts`);
          if (!attemptsResponse.ok) {
            console.error("Failed to fetch quiz attempts in updateProgress:", attemptsResponse.status);
            return;
          }
          const attemptsData = await attemptsResponse.json();

          if (!attemptsData.success || !attemptsData.data) {
            console.log("No quiz attempts found for user in updateProgress");
            return;
          }

          const attempts = attemptsData.data;
          const questionIds = questions.map((q: any) => q.id);

          // Find the latest attempt for each question
          const latestAttempts = new Map();
          attempts.forEach((attempt: any) => {
            if (questionIds.includes(attempt.quizQuestionId)) {
              const existing = latestAttempts.get(attempt.quizQuestionId);
              if (!existing || new Date(attempt.attemptedAt) > new Date(existing.attemptedAt)) {
                latestAttempts.set(attempt.quizQuestionId, attempt);
              }
            }
          });

          const completedQuestions = latestAttempts.size;
          const correctAnswers = Array.from(latestAttempts.values()).filter(
            (attempt: any) => attempt.isCorrect
          ).length;

          // Get the most recent attempt timestamp
          const lastAttemptAt = Array.from(latestAttempts.values())
            .sort((a: any, b: any) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())[0]?.attemptedAt;

          setProgress({
            sectionId,
            totalQuestions,
            completedQuestions,
            correctAnswers,
            isCompleted: completedQuestions === totalQuestions && totalQuestions > 0,
            lastAttemptAt,
          });
        } catch (err) {
          console.error("Error updating progress:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProgress();
    }
  };

  return {
    progress,
    loading,
    error,
    updateProgress,
    refetch: updateProgress,
  };
}
