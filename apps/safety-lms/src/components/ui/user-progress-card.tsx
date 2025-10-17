import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserProgress } from "@/lib/types/lms-content";

interface UserProgressCardProps {
  progress: UserProgress;
  onProgressClick?: (progress: UserProgress) => void;
}

export function UserProgressCard({
  progress,
  onProgressClick,
}: UserProgressCardProps) {
  const getCompletionColor = (isCompleted: boolean) => {
    return isCompleted
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onProgressClick?.(progress)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Progress</CardTitle>
          <Badge className={getCompletionColor(progress.isCompleted)}>
            {progress.isCompleted ? "Completed" : "In Progress"}
          </Badge>
        </div>
        <CardDescription>User: {progress.userId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm font-medium mb-1">
              <span>Completion</span>
              <span>{progress.completionPercentage}%</span>
            </div>
            <Progress value={progress.completionPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Time Spent</p>
              <p className="text-muted-foreground">
                {formatTimeSpent(progress.timeSpentSeconds)}
              </p>
            </div>
            <div>
              <p className="font-medium">Last Accessed</p>
              <p className="text-muted-foreground">
                {new Date(progress.lastAccessedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {progress.completedAt && (
            <div>
              <p className="text-sm font-medium">Completed At</p>
              <p className="text-sm text-muted-foreground">
                {new Date(progress.completedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
