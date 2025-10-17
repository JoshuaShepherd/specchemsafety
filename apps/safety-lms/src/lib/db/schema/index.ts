// Safety Training Schema Index
// This file exports all safety training-related tables while preserving existing Supabase auth tables

// Core Safety Training Tables (existing)
export * from "./profiles";
export * from "./plants";
export * from "./courses";
export * from "./enrollments";
export * from "./progress";
export * from "./activity-events";
export * from "./question-events";
export * from "./admin-roles";
export * from "./audit-log";

// New Safety Business Tables (CRM-focused for safety operations)
export * from "./territories";
export * from "./user-profiles";
export * from "./accounts";
export * from "./branches";
export * from "./contacts";
export * from "./activity-logs";
export * from "./opportunities";
export * from "./sales-facts";
export * from "./products";
export * from "./projects";

// LMS Content Tables (new)
export * from "./course-sections";
export * from "./content-blocks";
export * from "./quiz-questions";
export * from "./course-translations";
export * from "./section-translations";
export * from "./content-block-translations";
export * from "./quiz-question-translations";
export * from "./user-progress";
export * from "./quiz-attempts";
export * from "./content-interactions";

// Relations for type-safe joins
// Relations are defined in individual schema files

// Re-export any existing tables that might be needed
// Note: We don't modify existing Supabase auth tables (users, sessions, etc.)
