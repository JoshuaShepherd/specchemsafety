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

// Enums
export const productTypeEnum = pgEnum("product_type", [
  "safety_equipment",
  "ppe", // Personal Protective Equipment
  "safety_training",
  "safety_consulting",
  "safety_software",
  "safety_services",
  "maintenance_services",
  "other",
]);

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "inactive",
  "discontinued",
  "coming_soon",
]);

export const complianceStandardEnum = pgEnum("compliance_standard", [
  "osha",
  "ansi",
  "niosh",
  "iso_45001",
  "iso_14001",
  "custom",
  "other",
]);

// Products table - safety equipment and services catalog
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    territoryId: uuid("territory_id")
      .notNull()
      .references(() => territories.id),
    sku: text("sku").notNull().unique(), // Stock Keeping Unit
    name: text("name").notNull(),
    description: text("description"),
    type: productTypeEnum("type").notNull(),
    status: productStatusEnum("status").default("active").notNull(),
    category: text("category"), // e.g., "Head Protection", "Fall Protection", "Online Training"
    subcategory: text("subcategory"), // e.g., "Hard Hats", "Safety Harnesses", "OSHA 10-Hour"
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
    currency: text("currency").default("USD").notNull(),
    unitOfMeasure: text("unit_of_measure"), // e.g., "each", "hour", "license", "course"
    weight: decimal("weight", { precision: 8, scale: 2 }), // in pounds
    dimensions: text("dimensions"), // e.g., "12x8x4 inches"
    manufacturer: text("manufacturer"),
    model: text("model"),
    complianceStandards: text("compliance_standards"), // JSON array of compliance standards
    safetyFeatures: text("safety_features"), // Key safety features
    specifications: text("specifications"), // JSON string or detailed specs
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    territoryIdIdx: index("products_territory_id_idx").on(table.territoryId),
    skuIdx: index("products_sku_idx").on(table.sku),
    nameIdx: index("products_name_idx").on(table.name),
    typeIdx: index("products_type_idx").on(table.type),
    statusIdx: index("products_status_idx").on(table.status),
    categoryIdx: index("products_category_idx").on(table.category),
    subcategoryIdx: index("products_subcategory_idx").on(table.subcategory),
    activeIdx: index("products_active_idx").on(table.isActive),
  })
);

// Type exports
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
