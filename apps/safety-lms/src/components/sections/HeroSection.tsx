import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroIllustrationPlaceholder } from "@/components/ui/ImagePlaceholder";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  illustration?: string; // Placeholder for hero illustration
  stats?: Array<{
    value: string;
    label: string;
    icon: React.ReactNode;
  }>;
}

export function HeroSection({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  illustration,
  stats,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 py-20 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-200 opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary-200 opacity-20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4 animate-fade-in">
              <Badge variant="secondary" className="w-fit">
                {subtitle}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 lg:text-6xl animate-slide-up">
                {title}
              </h1>
              <p
                className="text-lg text-neutral-600 lg:text-xl animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                {description}
              </p>
            </div>

            <div
              className="flex flex-col gap-4 sm:flex-row animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button size="lg" className="text-lg px-8 py-6">
                {primaryAction.label}
              </Button>
              {secondaryAction && (
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary-600 lg:text-3xl">
                      {stat.value}
                    </div>
                    <div className="text-sm text-neutral-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Illustration */}
          <div className="flex items-center justify-center animate-scale-in">
            <div className="relative">
              {/* Placeholder for hero illustration */}
              <HeroIllustrationPlaceholder />

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-accent-orange-500 animate-bounce" />
              <div
                className="absolute -bottom-4 -left-4 h-6 w-6 rounded-full bg-accent-green-500 animate-bounce"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
