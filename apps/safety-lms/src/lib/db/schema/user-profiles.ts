import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { territories } from "./territories";
import { userStatusEnum } from "./profiles";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "safety_admin",
  "safety_manager",
  "safety_coordinator",
  "safety_instructor",
  "safety_rep",
  "plant_manager",
  "hr_admin",
  "employee",
]);

// userStatusEnum is exported from profiles.ts to avoid duplication

// User Profiles table - extends Supabase auth.users for safety operations
export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").primaryKey(), // References auth.users.id
    authUserId: uuid("auth_user_id").notNull().unique(), // Direct reference to auth.users.id
    territoryId: uuid("territory_id")
      .notNull()
      .references(() => territories.id),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    jobTitle: text("job_title"),
    department: text("department"),
    role: userRoleEnum("role").default("employee").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdBy: uuid("created_by"), // References another user_profiles.id
  },
  table => ({
    authUserIdIdx: index("user_profiles_auth_user_id_idx").on(table.authUserId),
    territoryIdIdx: index("user_profiles_territory_id_idx").on(
      table.territoryId
    ),
    emailIdx: index("user_profiles_email_idx").on(table.email),
    roleIdx: index("user_profiles_role_idx").on(table.role),
    statusIdx: index("user_profiles_status_idx").on(table.status),
    activeIdx: index("user_profiles_active_idx").on(table.isActive),
  })
);

// Type exports
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
