import { Star } from "lucide-react";
import { TestimonialAvatarPlaceholder } from "@/components/ui/ImagePlaceholder";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar: string; // Placeholder for user avatar
  rating: number;
  isActive?: boolean;
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  rating,
  isActive = false,
}: TestimonialCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-8 transition-all duration-300 ${
        isActive
          ? "bg-primary-600 text-white shadow-xl scale-105"
          : "bg-white text-neutral-900 shadow-lg hover:shadow-xl hover:-translate-y-1"
      }`}
    >
      {/* Quote */}
      <div className="mb-6">
        <div className="text-2xl font-bold mb-4">{quote}</div>
        <p
          className={`text-lg ${isActive ? "text-primary-100" : "text-neutral-600"}`}
        >
          {quote}
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center space-x-4">
        {/* Placeholder for user avatar */}
        <TestimonialAvatarPlaceholder name={author} />
        <div className="flex-1">
          <div
            className={`font-semibold ${isActive ? "text-white" : "text-neutral-900"}`}
          >
            {author}
          </div>
          <div
            className={`text-sm ${isActive ? "text-primary-200" : "text-neutral-600"}`}
          >
            {role}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating
                  ? "fill-accent-yellow-500 text-accent-yellow-500"
                  : isActive
                    ? "text-primary-300"
                    : "text-neutral-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
