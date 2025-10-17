import React from "react";
import { Image, ImageIcon, User, GraduationCap, BookOpen, Shield, AlertTriangle, Wrench, Leaf } from "lucide-react";

interface ImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
  alt: string;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
}

export function ImagePlaceholder({
  width = "100%",
  height = "100%",
  alt,
  className = "",
  icon,
  label,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100 flex items-center justify-center overflow-hidden ${className}`}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height 
      }}
    >
      {/* Template-style background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="relative z-10 text-center text-neutral-400">
        {icon ? (
          <div className="flex flex-col items-center gap-2">
            <div className="text-neutral-300">{icon}</div>
            {label && <div className="text-sm font-medium text-neutral-400">{label}</div>}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-12 w-12 text-neutral-300" />
            <div className="text-xs font-medium text-neutral-400">Image Coming Soon</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Specific placeholder components with professional template-style designs
export function HeroIllustrationPlaceholder() {
  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-50">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-16 w-16 text-primary-600" />
            </div>
          </div>
          <div className="text-sm font-medium text-neutral-500">Safety Training Hero Image</div>
          <div className="text-xs text-neutral-400 mt-1">Professional illustration coming soon</div>
        </div>
      </div>
    </div>
  );
}

export function CourseThumbnailPlaceholder({
  courseType,
}: {
  courseType: string;
}) {
  const iconMap = {
    'chemical safety': <AlertTriangle className="h-12 w-12" />,
    'equipment safety': <Wrench className="h-12 w-12" />,
    'environmental safety': <Leaf className="h-12 w-12" />,
    'emergency response': <Shield className="h-12 w-12" />,
    'general safety': <BookOpen className="h-12 w-12" />,
    'safety training': <Shield className="h-12 w-12" />,
    'compliance': <Shield className="h-12 w-12" />,
    'emergency': <Shield className="h-12 w-12" />,
    'default': <BookOpen className="h-12 w-12" />,
  };

  const icon = iconMap[courseType.toLowerCase() as keyof typeof iconMap] || iconMap.default;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-3 flex justify-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center shadow-sm border border-neutral-200">
              <div className="text-primary-600">{icon}</div>
            </div>
          </div>
          <div className="text-xs font-medium text-neutral-500">Course Image</div>
          <div className="text-xs text-neutral-400 mt-0.5">Coming Soon</div>
        </div>
      </div>
    </div>
  );
}

export function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center shadow-sm border-2 border-white">
      <span className="text-sm font-bold text-primary-700">{initials}</span>
    </div>
  );
}

export function TestimonialAvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative h-16 w-16 rounded-full overflow-hidden">
      {/* Background with pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-secondary-50 to-secondary-100" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center border-2 border-white shadow-md">
        <span className="text-lg font-bold text-primary-700">{initials}</span>
      </div>
    </div>
  );
}

export function CategoryIconPlaceholder({ category }: { category: string }) {
  return (
    <div className="relative h-16 w-16 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      <div className="relative z-10 h-full w-full flex items-center justify-center shadow-sm border border-neutral-200">
        <BookOpen className="h-8 w-8 text-primary-600" />
      </div>
    </div>
  );
}

export function StatsIconPlaceholder({ statType }: { statType: string }) {
  return (
    <div className="relative h-16 w-16 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <BookOpen className="h-8 w-8 text-primary-600" />
      </div>
    </div>
  );
}
