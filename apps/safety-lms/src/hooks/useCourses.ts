"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useUserProgress } from "./useUserProgress";

// Database course type (minimal schema)
export interface DatabaseCourse {
  id: string;
  slug: string;
  title: string;
  version: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// UI course type (enhanced for display)
export interface UICourse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  enrolledUsers: number;
  progress: number;
  status: "not_started" | "in_progress" | "completed";
  language: "English" | "Spanish";
  instructor: string;
  lastUpdated: string;
  prerequisites: string[];
  objectives: string[];
  image: string;
  slug: string;
}

// Map database course to UI course with sensible defaults
const mapDatabaseCourseToUI = (
  dbCourse: DatabaseCourse,
  userStatus?: { status: string; progressPercent: number }
): UICourse => {
  // Determine language based on title content
  const isSpanish =
    dbCourse.title.toLowerCase().includes("capacitación") ||
    dbCourse.title.toLowerCase().includes("específica");

  // Determine category based on title content
  const getCategory = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("hazmat") || lowerTitle.includes("chemical")) {
      return "Chemical Safety";
    }
    if (lowerTitle.includes("equipment") || lowerTitle.includes("ppe")) {
      return "Equipment Safety";
    }
    if (
      lowerTitle.includes("environmental") ||
      lowerTitle.includes("compliance")
    ) {
      return "Environmental Safety";
    }
    if (lowerTitle.includes("emergency") || lowerTitle.includes("response")) {
      return "Emergency Response";
    }
    return "General Safety";
  };

  // Generate description based on title and category
  const getDescription = (title: string, category: string): string => {
    const categoryDescriptions: Record<string, string> = {
      "Chemical Safety": isSpanish
        ? "Capacitación integral sobre manejo de materiales peligrosos y procedimientos de seguridad química."
        : "Comprehensive training on hazardous materials handling and chemical safety procedures.",
      "Equipment Safety": isSpanish
        ? "Capacitación esencial para la operación y mantenimiento seguros de equipos industriales."
        : "Essential training for safe operation and maintenance of industrial equipment.",
      "Environmental Safety": isSpanish
        ? "Comprensión de regulaciones ambientales y requisitos de cumplimiento para operaciones industriales."
        : "Understanding environmental regulations and compliance requirements for industrial operations.",
      "Emergency Response": isSpanish
        ? "Capacitación crítica para situaciones de emergencia y procedimientos de gestión de crisis."
        : "Critical training for emergency situations and crisis management procedures.",
      "General Safety": isSpanish
        ? "Capacitación general en seguridad y procedimientos de protección personal."
        : "General safety training and personal protection procedures.",
    };

    return (
      categoryDescriptions[category] ||
      (isSpanish
        ? "Capacitación especializada en seguridad industrial y cumplimiento normativo."
        : "Specialized training in industrial safety and regulatory compliance.")
    );
  };

  // Generate objectives based on category
  const getObjectives = (category: string, isSpanish: boolean): string[] => {
    const objectives: Record<string, string[]> = {
      "Chemical Safety": isSpanish
        ? [
            "Identificación de peligros químicos",
            "Procedimientos de manejo seguro",
            "Protocolos de respuesta de emergencia",
            "Evaluaciones de riesgo químico",
          ]
        : [
            "Chemical hazard identification",
            "Safe handling procedures",
            "Emergency response protocols",
            "Chemical risk assessments",
          ],
      "Equipment Safety": isSpanish
        ? [
            "Procedimientos de operación de equipos",
            "Protocolos de mantenimiento seguro",
            "Procedimientos de bloqueo/etiquetado",
            "Listas de verificación de inspección",
          ]
        : [
            "Equipment operation procedures",
            "Safe maintenance protocols",
            "Lockout/tagout procedures",
            "Equipment inspection checklists",
          ],
      "Environmental Safety": isSpanish
        ? [
            "Resumen de regulaciones ambientales",
            "Procedimientos de gestión de residuos",
            "Estrategias de prevención de contaminación",
            "Requisitos de reporte de cumplimiento",
          ]
        : [
            "Environmental regulations overview",
            "Waste management procedures",
            "Pollution prevention strategies",
            "Compliance reporting requirements",
          ],
      "Emergency Response": isSpanish
        ? [
            "Protocolos de respuesta de emergencia",
            "Procedimientos de comunicación de crisis",
            "Planificación y ejecución de evacuación",
            "Evaluación post-emergencia",
          ]
        : [
            "Emergency response protocols",
            "Crisis communication procedures",
            "Evacuation planning and execution",
            "Post-emergency assessment",
          ],
      "General Safety": isSpanish
        ? [
            "Identificación de peligros generales",
            "Procedimientos de seguridad básicos",
            "Uso de equipos de protección personal",
            "Protocolos de reporte de incidentes",
          ]
        : [
            "General hazard identification",
            "Basic safety procedures",
            "Personal protective equipment usage",
            "Incident reporting protocols",
          ],
    };

    return (
      objectives[category] ||
      (isSpanish
        ? [
            "Capacitación en seguridad industrial",
            "Procedimientos de cumplimiento",
            "Protocolos de seguridad",
          ]
        : [
            "Industrial safety training",
            "Compliance procedures",
            "Safety protocols",
          ])
    );
  };

  const category = getCategory(dbCourse.title);
  const description = getDescription(dbCourse.title, category);
  const objectives = getObjectives(category, isSpanish);

  return {
    id: dbCourse.id,
    title: dbCourse.title,
    description,
    category,
    duration: "2 hours", // Default duration
    difficulty: "Intermediate" as const, // Default difficulty
    rating: 4.5, // Default rating
    enrolledUsers: Math.floor(Math.random() * 200) + 50, // Simulated enrollment
    progress: userStatus?.progressPercent || 0, // Real progress data
    status:
      (userStatus?.status as "not_started" | "in_progress" | "completed") ||
      "not_started", // Real status
    language: isSpanish ? "Spanish" : "English",
    instructor: isSpanish ? "Dra. Maria Gonzalez" : "Dr. Sarah Johnson",
    lastUpdated: new Date(dbCourse.updatedAt).toLocaleDateString(),
    prerequisites: [], // No prerequisites for now
    objectives,
    image: "/api/placeholder/300/200",
    slug: dbCourse.slug,
  };
};

export function useCourses() {
  const { user, profile } = useAuth();
  const { getCourseStatus, loading: progressLoading } = useUserProgress();
  const [courses, setCourses] = useState<UICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/public/courses");

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch courses");
      }

      // Filter out the RLS test course and map to UI format
      const dbCourses = data.data.filter(
        (course: DatabaseCourse) => course.slug !== "rls-test-course"
      );

      const uiCourses = dbCourses.map(dbCourse => {
        const userStatus = getCourseStatus(dbCourse.id);
        return mapDatabaseCourseToUI(dbCourse, {
          status: userStatus.status,
          progressPercent: userStatus.progressPercent,
        });
      });
      setCourses(uiCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, [user, getCourseStatus]);

  useEffect(() => {
    fetchCourses();
  }, [user, getCourseStatus]);

  const refetch = () => {
    if (user) {
      fetchCourses();
    }
  };

  return {
    courses,
    loading: loading || progressLoading,
    error,
    refetch,
  };
}
