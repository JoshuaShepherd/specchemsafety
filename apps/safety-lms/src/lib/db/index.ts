import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";

/**
 * Safety Training Database Connection Setup
 *
 * This connects to the existing Supabase Safety database using Drizzle ORM
 * while preserving all existing Supabase auth tables and safety training tables.
 *
 * Environment Variables Required:
 * - DATABASE_URL: PostgreSQL connection string from Supabase Safety project
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase anonymous key
 */
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Validate that we're connecting to the Safety database
if (!connectionString.includes("radbukphijxenmgiljtu")) {
  console.warn(
    "Warning: DATABASE_URL does not point to the Safety database (radbukphijxenmgiljtu)"
  );
}

const client = postgres(connectionString, {
  // Connection pool settings for better performance
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
  // Enable SSL for Supabase
  ssl: "require",
});

export const db = drizzle(client, {
  schema,
  // Enable logging in development
  logger: process.env.NODE_ENV === "development",
});

// Export schema for use in other parts of the application
export * from "./schema";
