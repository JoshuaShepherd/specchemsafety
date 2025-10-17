import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { accounts } from "./accounts";

// Branches table - physical locations for safety operations
export const branches = pgTable(
  "branches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id),
    name: text("name").notNull(),
    branchCode: text("branch_code"), // Internal code for the branch
    address: text("address").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    postalCode: text("postal_code").notNull(),
    country: text("country").default("US").notNull(),
    phone: text("phone"),
    email: text("email"),
    contactPerson: text("contact_person"),
    safetyManager: text("safety_manager"), // Primary safety contact
    isPrimary: boolean("is_primary").default(false).notNull(), // Primary branch for the account
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    accountIdIdx: index("branches_account_id_idx").on(table.accountId),
    nameIdx: index("branches_name_idx").on(table.name),
    branchCodeIdx: index("branches_branch_code_idx").on(table.branchCode),
    cityIdx: index("branches_city_idx").on(table.city),
    stateIdx: index("branches_state_idx").on(table.state),
    primaryIdx: index("branches_primary_idx").on(table.isPrimary),
    activeIdx: index("branches_active_idx").on(table.isActive),
  })
);

// Type exports
export type Branch = typeof branches.$inferSelect;
export type NewBranch = typeof branches.$inferInsert;
