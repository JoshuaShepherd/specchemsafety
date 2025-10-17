import React from "react";

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  courseCount: number;
  description?: string;
  color: "blue" | "purple" | "orange" | "green" | "red" | "yellow";
}

const colorVariants = {
  blue: "from-primary-500 to-primary-600",
  purple: "from-secondary-500 to-secondary-600",
  orange: "from-accent-orange-500 to-accent-orange-600",
  green: "from-accent-green-500 to-accent-green-600",
  red: "from-semantic-error-500 to-semantic-error-600",
  yellow: "from-accent-yellow-500 to-accent-yellow-600",
};

export function CategoryCard({
  icon,
  title,
  courseCount,
  description,
  color,
}: CategoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up">
      <div className="flex items-start space-x-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${colorVariants[color]} text-white transition-transform group-hover:scale-110`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
            {title}
          </h3>
          <div className="text-sm text-neutral-600 mb-2">
            {courseCount}+ courses available
          </div>
          {description && (
            <p className="text-xs text-neutral-500 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
