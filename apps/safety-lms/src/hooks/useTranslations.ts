"use client";

import { useState, useEffect } from "react";

type LanguageCode = "en" | "es" | "fr" | "de";

interface CourseTranslation {
  title: string;
  description: string | null;
}

interface SectionTranslation {
  title: string;
}

interface TranslationData {
  sectionId: string;
  language: LanguageCode;
  section: SectionTranslation | null;
  contentBlocks: Record<string, { content: any }>;
  quizQuestions: Record<string, {
    questionText: string;
    options: any;
    correctAnswer: any;
    explanation: string | null;
  }>;
}

export function useCourseTranslation(courseId: string, language: LanguageCode = "en") {
  const [translation, setTranslation] = useState<CourseTranslation | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<LanguageCode[]>(["en"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (!courseId || courseId === "") {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // For now, hardcode Spanish as available for the HazMat course
        if (courseId === "6d533fa3-5305-4a34-a42c-17d58900f9d5") {
          setAvailableLanguages(["en", "es"]);
        } else {
          setAvailableLanguages(["en"]);
        }

        // If requesting non-English translation, fetch it
        if (language !== "en") {
          // For now, hardcode Spanish translation for HazMat course
          if (courseId === "6d533fa3-5305-4a34-a42c-17d58900f9d5" && language === "es") {
            setTranslation({
              title: "Capacitación Específica por Función - Materiales Peligrosos",
              description: "Manejo, Empaque y Envío de Materiales Regulados por DOT"
            });
          } else {
            const response = await fetch(`/api/translations/${courseId}?language=${language}`);
            const data = await response.json();

            if (data.success && data.data) {
              setTranslation(data.data);
            } else {
              setTranslation(null);
            }
          }
        } else {
          setTranslation(null);
        }
      } catch (err) {
        console.error("Error fetching course translation:", err);
        setError(err instanceof Error ? err.message : "Failed to load translation");
        setTranslation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslation();
  }, [courseId, language]);

  return {
    translation,
    availableLanguages,
    loading,
    error,
  };
}

export function useSectionTranslation(sectionId: string, language: LanguageCode = "en") {
  const [translationData, setTranslationData] = useState<TranslationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (!sectionId) {
        setTranslationData(null);
        return;
      }

      // For now, hardcode Spanish translations for HazMat course sections
      if (language === "es") {
        setLoading(true);
        setError(null);

        try {
          // Hardcode Spanish section translations
          const spanishTranslations: Record<string, any> = {
            "11111111-1111-1111-1111-111111111111": {
              sectionId,
              language,
              section: { title: "Introducción y Resumen" },
              contentBlocks: {
                "11111111-1111-1111-1111-111111111101": {
                  content: {
                    badge: "Capacitación Profesional SpecChem",
                    title: "Capacitación Específica por Función - Materiales Peligrosos",
                    subtitle: "Manejo, Empaque y Envío de Materiales Regulados por DOT"
                  }
                },
                "11111111-1111-1111-1111-111111111102": {
                  content: {
                    content: "Bienvenido a la Capacitación Específica por Función de SpecChem\n\nEste curso integral de capacitación cubre los requisitos y expectativas para el manejo, empaque y envío de materiales regulados por DOT en su trabajo en SpecChem."
                  }
                },
                "11111111-1111-1111-1111-111111111103": {
                  content: {
                    title: "Por Qué Importa Esta Capacitación",
                    content: "El Título 49 del Código de Regulaciones Federales requiere que cualquier asociado que empaque, maneje o transporte materiales peligrosos debe recibir capacitación cada tres años sobre los siguientes temas de materiales peligrosos:"
                  }
                },
                "11111111-1111-1111-1111-111111111104": {
                  content: {
                    items: [
                      { icon: "info", title: "Conciencia General", content: "Familiarización con varios aspectos involucrados con materiales peligrosos" },
                      { icon: "target", title: "Capacitación Específica por Función", content: "Cómo se manejan los materiales peligrosos en su trabajo específico" },
                      { icon: "shield", title: "Capacitación de Seguridad", content: "Manejo seguro de materiales peligrosos" },
                      { icon: "lock", title: "Conciencia de Seguridad", content: "Problemas de seguridad de HAZMAT" },
                      { icon: "shield-check", title: "Seguridad Profunda", content: "Capacitación detallada sobre mantener la seguridad al tratar con materiales peligrosos" }
                    ]
                  }
                },
                "11111111-1111-1111-1111-111111111105": {
                  content: {
                    content: "Resultados Clave de Aprendizaje\n\nHay seis cosas que debe obtener de esta capacitación:"
                  }
                },
                "11111111-1111-1111-1111-111111111106": {
                  content: {
                    type: "checklist",
                    items: [
                      "Un entendimiento básico de qué es el empaque calificado por UN",
                      "Cómo puede encontrar información sobre qué empaque usar para materiales específicos y cómo empaquetarlo",
                      "Un entendimiento básico de cómo marcar material peligroso para envío",
                      "Cómo localizar las etiquetas apropiadas para marcar empaque HAZ",
                      "Dónde encontrar información sobre el cierre apropiado requerido del empaque HAZ",
                      "Conciencia de la herramienta apropiada para usar al cerrar cubetas, tambores o contenedores, especialmente aquellos que contienen materiales regulados por DOT"
                    ]
                  }
                }
              },
              quizQuestions: {}
            }
          };

          const translation = spanishTranslations[sectionId];
          if (translation) {
            setTranslationData(translation);
          } else {
            setTranslationData(null);
          }
        } catch (err) {
          console.error("Error fetching section translation:", err);
          setError(err instanceof Error ? err.message : "Failed to load translation");
          setTranslationData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setTranslationData(null);
      }
    };

    fetchTranslation();
  }, [sectionId, language]);

  return {
    translationData,
    loading,
    error,
  };
}

export function useLanguagePreference() {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    // Try to get language from localStorage
    const saved = localStorage.getItem("preferredLanguage") as LanguageCode | null;
    if (saved && ["en", "es", "fr", "de"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  return {
    language,
    setLanguage,
  };
}

