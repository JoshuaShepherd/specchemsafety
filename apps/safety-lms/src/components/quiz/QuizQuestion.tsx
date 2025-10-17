"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { QuizQuestion as QuizQuestionType } from "@/lib/types/lms-content";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onPrevious?: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  userAnswer?: string;
  showFeedback?: boolean;
  isCorrect?: boolean;
  explanation?: string;
}

export function QuizQuestion({
  question,
  onAnswer,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  userAnswer,
  showFeedback,
  isCorrect,
  explanation,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(
    userAnswer || ""
  );
  const [submitted, setSubmitted] = useState(showFeedback || false);

  // Parse options from JSON string if it's a string
  const options = typeof question.options === 'string' ? JSON.parse(question.options) : question.options;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (!submitted) {
      onAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer && !submitted) {
      setSubmitted(true);
    }
  };

  const handleNext = () => {
    if (submitted) {
      onNext();
    } else if (selectedAnswer) {
      handleSubmit();
    }
  };

  const handleRetry = () => {
    setSelectedAnswer("");
    setSubmitted(false);
  };

  const getOptionLabel = (key: string, value: string) => {
    if (question.questionType === "true-false") {
      return value;
    }
    return `${key.toUpperCase()}. ${value}`;
  };

  const getFeedbackIcon = () => {
    if (submitted && isCorrect !== undefined) {
      return isCorrect ? (
        <CheckCircle className="h-6 w-6 text-green-500" />
      ) : (
        <XCircle className="h-6 w-6 text-red-500" />
      );
    }
    return null;
  };

  const getFeedbackColor = () => {
    if (submitted && isCorrect !== undefined) {
      return isCorrect
        ? "border-green-200 bg-green-50 dark:bg-green-900/20"
        : "border-red-200 bg-red-50 dark:bg-red-900/20";
    }
    return "border-border";
  };

  return (
    <Card className={`mb-6 transition-colors ${getFeedbackColor()}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-relaxed">
              {question.questionText}
            </CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Question {question.orderIndex}
              </span>
              {getFeedbackIcon()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Answer Options */}
        <div className="space-y-3">
          <RadioGroup
            value={selectedAnswer}
            onValueChange={handleAnswerSelect}
            disabled={submitted}
            className="space-y-3"
          >
            {Object.entries(options).map(([key, value]) => {
              const isSelected = selectedAnswer === key;
              const isCorrectAnswer = key === question.correctAnswer;

              let optionClasses =
                "flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer";

              if (submitted) {
                if (isCorrectAnswer) {
                  optionClasses +=
                    " border-green-300 bg-green-50 dark:bg-green-900/20";
                } else if (isSelected && !isCorrectAnswer) {
                  optionClasses +=
                    " border-red-300 bg-red-50 dark:bg-red-900/20";
                } else {
                  optionClasses +=
                    " border-gray-200 bg-gray-50 dark:bg-gray-900/20";
                }
              } else if (isSelected) {
                optionClasses += " border-primary bg-primary/5";
              } else {
                optionClasses += " border-border hover:border-primary/50";
              }

              return (
                <div key={key} className={optionClasses}>
                  <RadioGroupItem
                    value={key}
                    id={key}
                    className="flex-shrink-0"
                  />
                  <Label
                    htmlFor={key}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {getOptionLabel(key, String(value))}
                  </Label>
                  {submitted && isCorrectAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                  {submitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {/* Feedback Section */}
        {submitted && (
          <div className="space-y-4">
            {/* Correct Answer Indicator */}
            <div
              className={`p-4 rounded-lg ${isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span
                  className={`font-medium ${isCorrect ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}
                >
                  {isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>

              {!isCorrect && (
                <p className="text-sm text-muted-foreground mb-2">
                  The correct answer is:{" "}
                  <span className="font-medium">
                    {getOptionLabel(
                      String(question.correctAnswer),
                      String(options[String(question.correctAnswer)])
                    )}
                  </span>
                </p>
              )}
            </div>

            {/* Explanation */}
            {explanation && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Explanation
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {hasPrevious && onPrevious && (
              <Button
                variant="outline"
                onClick={onPrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            )}

            {submitted && !isCorrect && (
              <Button
                variant="outline"
                onClick={handleRetry}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!submitted ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="flex items-center gap-2"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!hasNext}
                className="flex items-center gap-2"
              >
                {hasNext ? (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  "Complete Quiz"
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Quiz Progress Component
interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  correctAnswers: number;
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
  correctAnswers,
}: QuizProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100;
  const score =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Quiz Progress</span>
        <span className="text-sm text-muted-foreground">
          {currentQuestion} of {totalQuestions} questions
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Progress: {Math.round(progress)}%
        </span>
        {currentQuestion > 0 && (
          <span className="text-muted-foreground">
            Score: {correctAnswers}/{currentQuestion} ({Math.round(score)}%)
          </span>
        )}
      </div>
    </div>
  );
}

// Quiz Results Component
interface QuizResultsProps {
  totalQuestions: number;
  correctAnswers: number;
  onRetake: () => void;
  onContinue: () => void;
  passingScore?: number;
}

export function QuizResults({
  totalQuestions,
  correctAnswers,
  onRetake,
  onContinue,
  passingScore = 80,
}: QuizResultsProps) {
  const score = (correctAnswers / totalQuestions) * 100;
  const passed = score >= passingScore;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-center">Quiz Complete</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold mb-4 ${
              passed
                ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {Math.round(score)}%
          </div>

          <h3
            className={`text-xl font-semibold mb-2 ${passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {passed ? "Congratulations!" : "Keep Learning!"}
          </h3>

          <p className="text-muted-foreground">
            You answered {correctAnswers} out of {totalQuestions} questions
            correctly.
          </p>

          {!passed && (
            <p className="text-sm text-muted-foreground mt-2">
              You need {passingScore}% to pass. Review the material and try
              again.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          {!passed && (
            <Button
              variant="outline"
              onClick={onRetake}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
          )}

          <Button onClick={onContinue} className="flex items-center gap-2">
            {passed ? "Continue to Next Section" : "Review Material"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
