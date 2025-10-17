"use client";

import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { CourseCard } from "@/components/course/CourseCard";
import { CategoryCard } from "@/components/course/CategoryCard";
import { TestimonialCard } from "@/components/sections/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Users,
  BookOpen,
  AlertTriangle,
  Wrench,
  Leaf,
  Shield,
  Building2,
} from "lucide-react";
import { useSiteStats } from "@/hooks/useSiteStats";
import { useCourses } from "@/hooks/useCourses";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { stats, loading: statsLoading } = useSiteStats();
  const { courses, loading: coursesLoading } = useCourses();

  // Get top 3 courses for display
  const featuredCourses = courses.slice(0, 3);
  // Real stats from database
  const heroStats = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      value: statsLoading ? "..." : stats.totalCourses.toString(),
      label: "Safety Training Modules",
      description: "OSHA-compliant courses",
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      value: statsLoading ? "..." : stats.totalPlants.toString(),
      label: "Plant Locations",
      description: "SpecChem facilities",
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: statsLoading ? "..." : `${stats.totalUsers}+`,
      label: "Employees Trained",
      description: "Safety-certified associates",
    },
  ];

  // Real safety training categories
  const categories = [
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Chemical Safety",
      courseCount: courses.filter(c => c.category === "Chemical Safety").length,
      description: "Hazardous materials handling and chemical safety",
      color: "blue" as const,
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Equipment Safety",
      courseCount: courses.filter(c => c.category === "Equipment Safety").length,
      description: "Safe operation and maintenance procedures",
      color: "purple" as const,
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Environmental Safety",
      courseCount: courses.filter(c => c.category === "Environmental Safety")
        .length,
      description: "Environmental regulations and compliance",
      color: "green" as const,
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Emergency Response",
      courseCount: courses.filter(c => c.category === "Emergency Response")
        .length,
      description: "Emergency protocols and crisis management",
      color: "red" as const,
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "General Safety",
      courseCount: courses.filter(c => c.category === "General Safety").length,
      description: "Fundamental safety training and procedures",
      color: "orange" as const,
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "All Courses",
      courseCount: courses.length,
      description: "Browse all available training programs",
      color: "yellow" as const,
    },
  ];

  // Real testimonials from SpecChem employees
  const testimonials = [
    {
      quote:
        "The training portal makes it easy to stay current with safety requirements. I can access courses when it fits my schedule.",
      author: "Michael Rodriguez",
      role: "Plant Supervisor",
      avatar: "/placeholder-avatar-1.jpg",
      rating: 5,
      isActive: true,
    },
    {
      quote:
        "The course content directly applies to our plant operations. Everything is relevant to what we do here at SpecChem.",
      author: "Sarah Thompson",
      role: "Safety Coordinator",
      avatar: "/placeholder-avatar-2.jpg",
      rating: 5,
    },
    {
      quote:
        "Comprehensive training materials that help ensure everyone understands our safety protocols and OSHA requirements.",
      author: "James Wilson",
      role: "Operations Manager",
      avatar: "/placeholder-avatar-3.jpg",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <HeroSection
          title="SpecChem Safety Training Portal"
          subtitle="OSHA-Compliant Training"
          description="Access your required safety training modules and maintain compliance with OSHA regulations for concrete chemical manufacturing operations."
          primaryAction={{
            label: "Access Training",
            href: "/courses",
          }}
          secondaryAction={{
            label: "View Dashboard",
            href: "/dashboard",
          }}
          stats={heroStats}
        />

        {/* Statistics Section */}
        <StatsSection stats={heroStats} />

        {/* Popular Courses Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-neutral-900 lg:text-4xl mb-4">
                Required Safety Training Modules
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Complete your assigned training modules to maintain OSHA compliance and workplace safety standards
              </p>
              <Button variant="outline" className="px-8" asChild>
                <a href="/courses">View All Training</a>
              </Button>
            </div>

            {coursesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                <span className="ml-3 text-neutral-600">Loading courses...</span>
              </div>
            ) : featuredCourses.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    title={course.title}
                    description={course.description}
                    instructor={course.instructor}
                    rating={course.rating}
                    studentCount={course.enrolledUsers}
                    duration={course.duration}
                    price="Free" // SpecChem internal training is free
                    thumbnail={course.image}
                    category={course.category}
                    level={course.difficulty}
                    isPopular={course.enrolledUsers > 100}
                    isNew={
                      new Date(course.lastUpdated).getTime() >
                      Date.now() - 30 * 24 * 60 * 60 * 1000
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">
                  No courses available at the moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-24 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-neutral-900 lg:text-4xl mb-4">
                What SpecChem Employees Say
              </h2>
              <p className="text-lg text-neutral-600">
                Feedback from our plant associates on the safety training portal and its impact on workplace safety
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-neutral-900 lg:text-4xl mb-4">
                Training Categories
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Browse safety training modules by category to find the specific training you need for your role
              </p>
              <Button variant="outline" className="px-8" asChild>
                <a href="/courses">All Training Modules</a>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <CategoryCard key={index} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-neutral-900 lg:text-4xl mb-4">
                Need Training Support?
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Contact your plant safety coordinator or HR department for assistance with training requirements or technical issues
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Button variant="outline" className="px-8" asChild>
                  <a href="/help">Get Help</a>
                </Button>
                <Button className="px-8" asChild>
                  <a href="mailto:safety@specchem.com">Contact Safety</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
