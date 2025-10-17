import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
  decimal,
} from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { userProfiles } from "./user-profiles";

// Enums
export const projectTypeEnum = pgEnum("project_type", [
  "safety_audit",
  "safety_consulting",
  "safety_training",
  "safety_equipment_installation",
  "compliance_assessment",
  "safety_system_implementation",
  "incident_investigation",
  "safety_program_development",
  "other",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled",
]);

export const projectPriorityEnum = pgEnum("project_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

// Projects table - construction and safety projects
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userProfiles.id),
    name: text("name").notNull(),
    description: text("description"),
    type: projectTypeEnum("type").notNull(),
    status: projectStatusEnum("status").default("planning").notNull(),
    priority: projectPriorityEnum("priority").default("medium").notNull(),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    actualStartDate: timestamp("actual_start_date"),
    actualEndDate: timestamp("actual_end_date"),
    budget: decimal("budget", { precision: 15, scale: 2 }),
    actualCost: decimal("actual_cost", { precision: 15, scale: 2 }),
    currency: text("currency").default("USD").notNull(),
    location: text("location"), // Project site location
    safetyRequirements: text("safety_requirements"), // Specific safety requirements
    complianceStandards: text("compliance_standards"), // Applicable compliance standards
    deliverables: text("deliverables"), // Project deliverables
    notes: text("notes"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => userProfiles.id),
  },
  table => ({
    accountIdIdx: index("projects_account_id_idx").on(table.accountId),
    ownerIdIdx: index("projects_owner_id_idx").on(table.ownerId),
    nameIdx: index("projects_name_idx").on(table.name),
    typeIdx: index("projects_type_idx").on(table.type),
    statusIdx: index("projects_status_idx").on(table.status),
    priorityIdx: index("projects_priority_idx").on(table.priority),
    startDateIdx: index("projects_start_date_idx").on(table.startDate),
    endDateIdx: index("projects_end_date_idx").on(table.endDate),
    activeIdx: index("projects_active_idx").on(table.isActive),
  })
);

// Type exports
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
