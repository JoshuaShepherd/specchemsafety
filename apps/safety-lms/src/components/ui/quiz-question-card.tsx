import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizQuestion } from "@/lib/types/lms-content";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  onQuestionClick?: (question: QuizQuestion) => void;
}

export function QuizQuestionCard({
  question,
  onQuestionClick,
}: QuizQuestionCardProps) {
  const getQuestionTypeColor = (questionType: string) => {
    switch (questionType) {
      case "true-false":
        return "bg-green-100 text-green-800";
      case "multiple-choice":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onQuestionClick?.(question)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{question.questionKey}</CardTitle>
          <Badge className={getQuestionTypeColor(question.questionType)}>
            {question.questionType}
          </Badge>
        </div>
        <CardDescription>Order: {question.orderIndex}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium">Question:</p>
          <p className="text-sm text-muted-foreground">
            {question.questionText}
          </p>

          {question.options && (
            <div>
              <p className="text-sm font-medium">Options:</p>
              <p className="text-sm text-muted-foreground">
                {JSON.stringify(question.options).substring(0, 100)}...
              </p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium">Correct Answer:</p>
            <p className="text-sm text-muted-foreground">
              {JSON.stringify(question.correctAnswer).substring(0, 100)}...
            </p>
          </div>

          {question.explanation && (
            <div>
              <p className="text-sm font-medium">Explanation:</p>
              <p className="text-sm text-muted-foreground">
                {question.explanation}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Published: {question.isPublished ? "Yes" : "No"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
