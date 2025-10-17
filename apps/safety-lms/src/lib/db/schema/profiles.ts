import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { plants } from "./plants";

// Enums
export const userStatusEnum = pgEnum("user_status", ["active", "suspended"]);

// Profiles table - extends Supabase auth.users
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // References auth.users.id
  plantId: uuid("plant_id")
    .notNull()
    .references(() => plants.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  jobTitle: text("job_title"),
  status: userStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  plant: one(plants, {
    fields: [profiles.plantId],
    references: [plants.id],
  }),
}));

// Type exports
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
