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
import { branches } from "./branches";
import { userProfiles } from "./user-profiles";

// Enums
export const contactRoleEnum = pgEnum("contact_role", [
  "safety_manager",
  "safety_coordinator",
  "safety_instructor",
  "hr_manager",
  "plant_manager",
  "purchasing_manager",
  "decision_maker",
  "influencer",
  "user",
  "other",
]);

export const contactStatusEnum = pgEnum("contact_status", [
  "active",
  "inactive",
  "do_not_contact",
]);

// Contacts table - individual people in safety operations
export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id),
    branchId: uuid("branch_id").references(() => branches.id), // Optional - may not be assigned to specific branch
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userProfiles.id),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    mobile: text("mobile"),
    jobTitle: text("job_title"),
    department: text("department"),
    role: contactRoleEnum("role").default("user").notNull(),
    status: contactStatusEnum("status").default("active").notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(), // Primary contact for the account
    safetyCertifications: text("safety_certifications"), // e.g., "OSHA 30", "CSP", "ASP"
    notes: text("notes"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => userProfiles.id),
  },
  table => ({
    accountIdIdx: index("contacts_account_id_idx").on(table.accountId),
    branchIdIdx: index("contacts_branch_id_idx").on(table.branchId),
    ownerIdIdx: index("contacts_owner_id_idx").on(table.ownerId),
    emailIdx: index("contacts_email_idx").on(table.email),
    nameIdx: index("contacts_name_idx").on(table.firstName, table.lastName),
    roleIdx: index("contacts_role_idx").on(table.role),
    statusIdx: index("contacts_status_idx").on(table.status),
    primaryIdx: index("contacts_primary_idx").on(table.isPrimary),
    activeIdx: index("contacts_active_idx").on(table.isActive),
  })
);

// Type exports
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
