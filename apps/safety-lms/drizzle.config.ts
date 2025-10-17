import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Preserve existing Supabase auth tables and safety training tables
  introspect: {
    casing: "camel",
  },
  // Only generate migrations for new tables, don't modify existing ones
  migrations: {
    prefix: "timestamp",
  },
  // Verbose logging for development
  verbose: true,
  strict: true,
} satisfies Config;
