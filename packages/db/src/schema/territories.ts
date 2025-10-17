import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

// Territories table - regional foundation for safety operations
export const territories = pgTable(
  "territories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    code: text("code").notNull().unique(), // e.g., "NORTH", "SOUTH", "EAST", "WEST"
    description: text("description"),
    region: text("region"), // e.g., "North America", "Europe", "Asia-Pacific"
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    nameIdx: index("territories_name_idx").on(table.name),
    codeIdx: index("territories_code_idx").on(table.code),
    regionIdx: index("territories_region_idx").on(table.region),
    activeIdx: index("territories_active_idx").on(table.isActive),
  })
);

// Type exports
export type Territory = typeof territories.$inferSelect;
export type NewTerritory = typeof territories.$inferInsert;
