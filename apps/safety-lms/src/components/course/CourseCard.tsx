import { Star, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseThumbnailPlaceholder } from "@/components/ui/ImagePlaceholder";

interface CourseCardProps {
  title: string;
  description: string;
  instructor: string;
  rating: number;
  studentCount: number;
  duration: string;
  price: string;
  thumbnail: string; // Placeholder for course thumbnail
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  isNew?: boolean;
  isPopular?: boolean;
}

export function CourseCard({
  title,
  description,
  instructor,
  rating,
  studentCount,
  duration,
  price,
  thumbnail,
  category,
  level,
  isNew = false,
  isPopular = false,
}: CourseCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in">
      {/* Course Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {/* Placeholder for course thumbnail */}
        <CourseThumbnailPlaceholder courseType={category.toLowerCase()} />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isNew && (
            <Badge className="bg-accent-green-500 text-white">New</Badge>
          )}
          {isPopular && (
            <Badge className="bg-accent-orange-500 text-white">Popular</Badge>
          )}
        </div>

        {/* Level Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {level}
          </Badge>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="mb-4">
          <div className="text-xs font-medium text-primary-600 mb-2">
            {category}
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
            {description}
          </p>
        </div>

        {/* Instructor */}
        <div className="mb-4">
          <div className="text-sm text-neutral-500">Instructor</div>
          <div className="text-sm font-medium text-neutral-900">
            {instructor}
          </div>
        </div>

        {/* Course Stats */}
        <div className="mb-6 flex items-center justify-between text-sm text-neutral-600">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent-yellow-500 text-accent-yellow-500" />
            <span className="font-medium">{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{studentCount}+</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-neutral-900">{price}</div>
          <Button size="sm" className="px-6">
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}
