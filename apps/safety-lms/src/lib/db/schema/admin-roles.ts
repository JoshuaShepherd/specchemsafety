import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const adminRoleEnum = pgEnum("admin_role", [
  "hr_admin",
  "dev_admin",
  "plant_manager",
]);

// Admin Roles table - manages user administrative permissions
export const adminRoles = pgTable("admin_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id),
  role: adminRoleEnum("role").notNull(),
  plantId: uuid("plant_id").references(() => plants.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const adminRolesRelations = relations(adminRoles, ({ one }) => ({
  user: one(profiles, {
    fields: [adminRoles.userId],
    references: [profiles.id],
  }),
  plant: one(plants, {
    fields: [adminRoles.plantId],
    references: [plants.id],
  }),
}));

// Type exports
export type AdminRole = typeof adminRoles.$inferSelect;
export type NewAdminRole = typeof adminRoles.$inferInsert;

// Import other tables for relations (circular import handling)
import { profiles } from "./profiles";
import { plants } from "./plants";
