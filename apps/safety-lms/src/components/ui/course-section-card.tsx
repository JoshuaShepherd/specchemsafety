import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseSection } from "@/lib/types/lms-content";

interface CourseSectionCardProps {
  section: CourseSection;
  onSectionClick?: (section: CourseSection) => void;
}

export function CourseSectionCard({
  section,
  onSectionClick,
}: CourseSectionCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSectionClick?.(section)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{section.title}</CardTitle>
          <Badge variant={section.isPublished ? "default" : "secondary"}>
            {section.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
        <CardDescription>Section Key: {section.sectionKey}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Order: {section.orderIndex}</span>
          {section.iconName && <span>Icon: {section.iconName}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
