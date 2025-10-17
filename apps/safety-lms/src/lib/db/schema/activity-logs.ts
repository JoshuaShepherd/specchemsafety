import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { contacts } from "./contacts";
import { userProfiles } from "./user-profiles";

// Enums
export const activityTypeEnum = pgEnum("activity_type", [
  "safety_consultation",
  "equipment_demo",
  "training_session",
  "safety_audit",
  "compliance_review",
  "incident_follow_up",
  "proposal_presentation",
  "follow_up_call",
  "site_visit",
  "note",
  "task",
  "other",
]);

export const activityStatusEnum = pgEnum("activity_status", [
  "completed",
  "pending",
  "cancelled",
  "rescheduled",
]);

export const activityPriorityEnum = pgEnum("activity_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

// Activity Logs table - safety-related activities
export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id").references(() => accounts.id), // Optional - some activities may not be account-specific
    contactId: uuid("contact_id").references(() => contacts.id), // Optional - some activities may not be contact-specific
    userId: uuid("user_id")
      .notNull()
      .references(() => userProfiles.id),
    type: activityTypeEnum("type").notNull(),
    subject: text("subject").notNull(),
    description: text("description"),
    status: activityStatusEnum("status").default("completed").notNull(),
    priority: activityPriorityEnum("priority").default("medium").notNull(),
    scheduledAt: timestamp("scheduled_at"), // For future activities
    completedAt: timestamp("completed_at"), // When the activity was completed
    duration: text("duration"), // e.g., "30 minutes", "1 hour"
    outcome: text("outcome"), // Result of the activity
    nextSteps: text("next_steps"), // Follow-up actions
    safetyNotes: text("safety_notes"), // Safety-specific observations
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    accountIdIdx: index("activity_logs_account_id_idx").on(table.accountId),
    contactIdIdx: index("activity_logs_contact_id_idx").on(table.contactId),
    userIdIdx: index("activity_logs_user_id_idx").on(table.userId),
    typeIdx: index("activity_logs_type_idx").on(table.type),
    statusIdx: index("activity_logs_status_idx").on(table.status),
    priorityIdx: index("activity_logs_priority_idx").on(table.priority),
    scheduledAtIdx: index("activity_logs_scheduled_at_idx").on(
      table.scheduledAt
    ),
    completedAtIdx: index("activity_logs_completed_at_idx").on(
      table.completedAt
    ),
    activeIdx: index("activity_logs_active_idx").on(table.isActive),
  })
);

// Type exports
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
