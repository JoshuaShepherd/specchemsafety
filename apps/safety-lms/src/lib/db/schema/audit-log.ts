import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Audit Log table - tracks all database changes for compliance
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  tableName: text("table_name").notNull(),
  operation: text("operation").notNull(),
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  userId: uuid("user_id").references(() => profiles.id),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
});

// Relations
export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(profiles, {
    fields: [auditLog.userId],
    references: [profiles.id],
  }),
}));

// Type exports
export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;

// Import other tables for relations (circular import handling)
import { profiles } from "./profiles";
