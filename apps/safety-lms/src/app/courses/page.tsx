"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  PlayCircle,
  CheckCircle,
  Search,
  Filter,
  Award,
  Globe,
  Shield,
  AlertTriangle,
  Wrench,
  Leaf,
  FileText,
  Loader2,
} from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useRouter } from "next/navigation";

// Categories configuration
const categories = [
  { id: "all", name: "All Categories", icon: BookOpen },
  { id: "Chemical Safety", name: "Chemical Safety", icon: AlertTriangle },
  { id: "Equipment Safety", name: "Equipment Safety", icon: Wrench },
  { id: "Environmental Safety", name: "Environmental Safety", icon: Leaf },
  { id: "Emergency Response", name: "Emergency Response", icon: Shield },
  { id: "General Safety", name: "General Safety", icon: FileText },
];

const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const languages = ["All Languages", "English", "Spanish"];

export default function CoursesPage() {
  const { courses, loading, error } = useCourses();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedDifficulty, setSelectedDifficulty] =
    React.useState("All Levels");
  const [selectedLanguage, setSelectedLanguage] =
    React.useState("All Languages");

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Safety Training Courses
            </h1>
            <p className="text-neutral-600 mt-2">
              Comprehensive safety training programs for industrial excellence
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
            <span className="text-neutral-600">Loading courses...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Safety Training Courses
            </h1>
            <p className="text-neutral-600 mt-2">
              Comprehensive safety training programs for industrial excellence
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2 text-neutral-900">
            Error Loading Courses
          </h3>
          <p className="text-neutral-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All Levels" ||
      course.difficulty === selectedDifficulty;
    const matchesLanguage =
      selectedLanguage === "All Languages" ||
      course.language === selectedLanguage;

    return (
      matchesSearch && matchesCategory && matchesDifficulty && matchesLanguage
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent-green-500";
      case "in_progress":
        return "bg-primary-500";
      case "not_started":
        return "bg-neutral-300";
      default:
        return "bg-neutral-300";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-accent-green-100 text-accent-green-800";
      case "Intermediate":
        return "bg-accent-yellow-100 text-accent-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(cat => cat.name === category);
    return categoryObj ? categoryObj.icon : BookOpen;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Safety Training Courses
          </h1>
          <p className="text-neutral-600 mt-2">
            Comprehensive safety training programs for industrial excellence
          </p>
        </div>
        <Button className="flex items-center gap-2" variant="outline">
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedDifficulty}
          onValueChange={setSelectedDifficulty}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(language => (
              <SelectItem key={language} value={language}>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {language}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">Sort by:</span>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const CategoryIcon = getCategoryIcon(course.category);

          return (
            <Card
              key={course.id}
              className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              onClick={() => router.push(`/courses/${course.slug}`)}
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <CategoryIcon className="h-16 w-16 text-primary-600" />
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-white/90"
                    >
                      <Globe className="h-3 w-3" />
                      {course.language}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(course.status)}`}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 text-neutral-600">
                      {course.description}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrolledUsers}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent-yellow-500 text-accent-yellow-500" />
                      {course.rating}
                    </div>
                  </div>

                  {course.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Progress</span>
                        <span className="text-neutral-900 font-medium">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  {course.prerequisites.length > 0 && (
                    <div className="text-sm">
                      <p className="text-neutral-600 mb-1">Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {course.prerequisites.map((prereq, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-neutral-500">
                      <p>Instructor: {course.instructor}</p>
                    </div>
                    <Button
                      variant={
                        course.status === "completed" ? "outline" : "default"
                      }
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={e => {
                        e.stopPropagation();
                        router.push(`/courses/${course.slug}`);
                      }}
                    >
                      {course.status === "completed" ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Review
                        </>
                      ) : course.status === "in_progress" ? (
                        <>
                          <PlayCircle className="h-4 w-4" />
                          Continue
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2 text-neutral-900">
            No courses found
          </h3>
          <p className="text-neutral-600">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
}
