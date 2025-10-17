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
import { territories } from "./territories";
import { userProfiles } from "./user-profiles";

// Enums
export const accountTypeEnum = pgEnum("account_type", [
  "safety_equipment_customer",
  "training_client",
  "consulting_client",
  "maintenance_client",
  "partner",
  "vendor",
]);

export const accountStatusEnum = pgEnum("account_status", [
  "active",
  "inactive",
  "suspended",
  "closed",
]);

export const industryEnum = pgEnum("industry", [
  "manufacturing",
  "construction",
  "oil_gas",
  "chemical",
  "mining",
  "utilities",
  "transportation",
  "healthcare",
  "agriculture",
  "other",
]);

// Accounts table - safety equipment and service customers
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    territoryId: uuid("territory_id")
      .notNull()
      .references(() => territories.id),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userProfiles.id),
    name: text("name").notNull(),
    accountNumber: text("account_number").unique(),
    type: accountTypeEnum("type")
      .default("safety_equipment_customer")
      .notNull(),
    status: accountStatusEnum("status").default("active").notNull(),
    industry: industryEnum("industry"),
    website: text("website"),
    phone: text("phone"),
    email: text("email"),
    description: text("description"),
    annualRevenue: decimal("annual_revenue", { precision: 15, scale: 2 }),
    employeeCount: text("employee_count"), // e.g., "1-10", "11-50", "51-200", "201-500", "500+"
    safetyComplianceLevel: text("safety_compliance_level"), // e.g., "OSHA Compliant", "ISO 45001", "Custom"
    billingAddress: text("billing_address"),
    shippingAddress: text("shipping_address"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => userProfiles.id),
  },
  table => ({
    territoryIdIdx: index("accounts_territory_id_idx").on(table.territoryId),
    ownerIdIdx: index("accounts_owner_id_idx").on(table.ownerId),
    nameIdx: index("accounts_name_idx").on(table.name),
    accountNumberIdx: index("accounts_account_number_idx").on(
      table.accountNumber
    ),
    typeIdx: index("accounts_type_idx").on(table.type),
    statusIdx: index("accounts_status_idx").on(table.status),
    industryIdx: index("accounts_industry_idx").on(table.industry),
    activeIdx: index("accounts_active_idx").on(table.isActive),
  })
);

// Type exports
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
