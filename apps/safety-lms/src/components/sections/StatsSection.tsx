import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  description?: string;
}

function StatCard({ icon, value, label, description }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center space-x-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200">
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-3xl font-bold text-neutral-900 lg:text-4xl">
            {value}
          </div>
          <div className="text-sm font-medium text-neutral-600">{label}</div>
          {description && (
            <div className="text-xs text-neutral-500 mt-1">{description}</div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatsSectionProps {
  stats: Array<{
    icon: React.ReactNode;
    value: string;
    label: string;
    description?: string;
  }>;
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
