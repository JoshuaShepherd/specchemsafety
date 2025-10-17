import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { opportunities } from "./opportunities";
import { userProfiles } from "./user-profiles";

// Enums
export const salesFactTypeEnum = pgEnum("sales_fact_type", [
  "safety_equipment_revenue",
  "training_revenue",
  "consulting_revenue",
  "maintenance_revenue",
  "equipment_units_sold",
  "training_sessions_delivered",
  "consulting_hours",
  "contract_value",
  "renewal",
  "upsell",
  "cross_sell",
]);

export const periodTypeEnum = pgEnum("period_type", [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
]);

// Sales Facts table - historical data for safety business reporting
export const salesFacts = pgTable(
  "sales_facts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id),
    opportunityId: uuid("opportunity_id").references(() => opportunities.id), // Optional - may not be tied to specific opportunity
    userId: uuid("user_id")
      .notNull()
      .references(() => userProfiles.id),
    factType: salesFactTypeEnum("fact_type").notNull(),
    periodType: periodTypeEnum("period_type").notNull(),
    periodStart: timestamp("period_start").notNull(),
    periodEnd: timestamp("period_end").notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    quantity: integer("quantity"), // Number of units, sessions, hours, etc.
    currency: text("currency").default("USD").notNull(),
    description: text("description"),
    safetyCategory: text("safety_category"), // e.g., "PPE", "Training", "Consulting"
    complianceStandard: text("compliance_standard"), // e.g., "OSHA", "ISO 45001", "ANSI"
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    accountIdIdx: index("sales_facts_account_id_idx").on(table.accountId),
    opportunityIdIdx: index("sales_facts_opportunity_id_idx").on(
      table.opportunityId
    ),
    userIdIdx: index("sales_facts_user_id_idx").on(table.userId),
    factTypeIdx: index("sales_facts_fact_type_idx").on(table.factType),
    periodTypeIdx: index("sales_facts_period_type_idx").on(table.periodType),
    periodStartIdx: index("sales_facts_period_start_idx").on(table.periodStart),
    periodEndIdx: index("sales_facts_period_end_idx").on(table.periodEnd),
    safetyCategoryIdx: index("sales_facts_safety_category_idx").on(
      table.safetyCategory
    ),
    activeIdx: index("sales_facts_active_idx").on(table.isActive),
  })
);

// Type exports
export type SalesFact = typeof salesFacts.$inferSelect;
export type NewSalesFact = typeof salesFacts.$inferInsert;
