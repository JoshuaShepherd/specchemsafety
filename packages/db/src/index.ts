// =============================================================================
// DATABASE PACKAGE EXPORTS
// =============================================================================

/**
 * Database package exports for the Safety System.
 * This provides comprehensive database schema, types, and utilities.
 */

// =============================================================================
// SCHEMA EXPORTS
// =============================================================================

// Core Safety Training Tables (existing)
export * from "./schema/profiles";
export * from "./schema/plants";
export * from "./schema/courses";
export * from "./schema/enrollments";
export * from "./schema/progress";
export * from "./schema/activity-events";
export * from "./schema/question-events";
export * from "./schema/admin-roles";
export * from "./schema/audit-log";

// New Safety Business Tables (CRM-focused for safety operations)
export * from "./schema/territories";
export * from "./schema/user-profiles";
export * from "./schema/accounts";
export * from "./schema/branches";
export * from "./schema/contacts";
export * from "./schema/activity-logs";
export * from "./schema/opportunities";
export * from "./schema/sales-facts";
export * from "./schema/products";
export * from "./schema/projects";

// Relations are defined in individual schema files

// =============================================================================
// PACKAGE METADATA
// =============================================================================

export const PACKAGE_VERSION = "1.0.0";
export const PACKAGE_NAME = "@specchem/db";
export const PACKAGE_DESCRIPTION =
  "Database schema and types for Safety System";

/**
 * Package metadata
 */
export const PACKAGE_METADATA = {
  name: PACKAGE_NAME,
  version: PACKAGE_VERSION,
  description: PACKAGE_DESCRIPTION,
  features: [
    "Complete Safety Training Schema",
    "Safety Business CRM Schema",
    "TypeScript Type Safety",
    "Drizzle ORM Integration",
    "Comprehensive Relations",
    "Enterprise-Grade Indexes",
    "Audit Trail Support",
    "Territory-Based Access Control",
  ],
  schema: {
    coreTables: 9,
    businessTables: 10,
    totalTables: 19,
    enums: 26,
    relations: 19,
    indexes: 100,
  },
  compatibility: {
    drizzle: "0.29+",
    postgresql: "15+",
    typescript: "5.0+",
  },
} as const;
