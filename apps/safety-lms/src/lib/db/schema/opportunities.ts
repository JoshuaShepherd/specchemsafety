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
import { contacts } from "./contacts";
import { userProfiles } from "./user-profiles";

// Enums
export const opportunityStageEnum = pgEnum("opportunity_stage", [
  "prospecting",
  "qualification",
  "needs_analysis",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
]);

export const opportunityStatusEnum = pgEnum("opportunity_status", [
  "open",
  "closed",
  "cancelled",
]);

export const opportunitySourceEnum = pgEnum("opportunity_source", [
  "inbound",
  "outbound",
  "referral",
  "website",
  "trade_show",
  "safety_conference",
  "cold_call",
  "other",
]);

export const opportunityTypeEnum = pgEnum("opportunity_type", [
  "safety_equipment",
  "safety_training",
  "safety_consulting",
  "safety_audit",
  "compliance_services",
  "maintenance_contract",
  "other",
]);

export const probabilityEnum = pgEnum("probability", [
  "10",
  "20",
  "30",
  "40",
  "50",
  "60",
  "70",
  "80",
  "90",
  "100",
]);

// Opportunities table - safety equipment and services sales pipeline
export const opportunities = pgTable(
  "opportunities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id),
    contactId: uuid("contact_id").references(() => contacts.id), // Primary contact for this opportunity
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userProfiles.id),
    name: text("name").notNull(),
    description: text("description"),
    type: opportunityTypeEnum("type").notNull(),
    stage: opportunityStageEnum("stage").default("prospecting").notNull(),
    status: opportunityStatusEnum("status").default("open").notNull(),
    source: opportunitySourceEnum("source"),
    probability: probabilityEnum("probability").default("10").notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }), // Expected deal value
    closeDate: timestamp("close_date"), // Expected close date
    actualCloseDate: timestamp("actual_close_date"), // Actual close date
    lostReason: text("lost_reason"), // Reason if opportunity was lost
    nextSteps: text("next_steps"), // Next actions
    safetyRequirements: text("safety_requirements"), // Specific safety needs
    complianceNotes: text("compliance_notes"), // Compliance-related notes
    notes: text("notes"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => userProfiles.id),
  },
  table => ({
    accountIdIdx: index("opportunities_account_id_idx").on(table.accountId),
    contactIdIdx: index("opportunities_contact_id_idx").on(table.contactId),
    ownerIdIdx: index("opportunities_owner_id_idx").on(table.ownerId),
    nameIdx: index("opportunities_name_idx").on(table.name),
    typeIdx: index("opportunities_type_idx").on(table.type),
    stageIdx: index("opportunities_stage_idx").on(table.stage),
    statusIdx: index("opportunities_status_idx").on(table.status),
    sourceIdx: index("opportunities_source_idx").on(table.source),
    probabilityIdx: index("opportunities_probability_idx").on(
      table.probability
    ),
    closeDateIdx: index("opportunities_close_date_idx").on(table.closeDate),
    activeIdx: index("opportunities_active_idx").on(table.isActive),
  })
);

// Type exports
export type Opportunity = typeof opportunities.$inferSelect;
export type NewOpportunity = typeof opportunities.$inferInsert;
