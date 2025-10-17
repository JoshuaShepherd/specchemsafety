/**
 * Database Connection Test Script
 *
 * This script tests that Drizzle ORM can connect to the existing Safety database
 * without interfering with existing authentication tables or Safety training data.
 *
 * Run with: npx tsx src/lib/db/test-connection.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

async function testDatabaseConnection() {
  console.log("🔍 Testing Drizzle ORM connection to Supabase database...\n");

  try {
    // Test 1: Basic connection
    console.log("1. Testing basic database connection...");
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log("✅ Database connection successful");
    console.log("   Result:", result[0]);

    // Test 2: Check existing Supabase auth tables
    console.log("\n2. Checking existing Supabase auth tables...");
    const authTables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'auth' 
      ORDER BY table_name
    `);
    console.log("✅ Found Supabase auth tables:");
    authTables.forEach((table: any) => {
      console.log(`   - auth.${table.table_name}`);
    });

    // Test 3: Check existing Safety training tables
    console.log("\n3. Checking existing Safety training tables...");
    const safetyTables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log("✅ Found existing Safety training tables:");
    safetyTables.forEach((table: any) => {
      console.log(`   - ${table.table_name}`);
    });

    // Test 4: Check table row counts
    console.log("\n4. Checking table row counts...");
    const tableCounts = await db.execute(sql`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as total_rows
      FROM pg_stat_user_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log("✅ Table row counts:");
    tableCounts.forEach((table: any) => {
      console.log(`   - ${table.tablename}: ${table.total_rows} rows`);
    });

    // Test 5: Test schema introspection
    console.log("\n5. Testing Drizzle schema introspection...");
    const schemaInfo = await db.execute(sql`
      SELECT 
        table_schema,
        table_name,
        column_name,
        data_type
      FROM information_schema.columns 
      WHERE table_schema IN ('auth', 'public')
      AND table_name IN ('users', 'profiles')
      ORDER BY table_schema, table_name, ordinal_position
    `);

    console.log("✅ Schema introspection successful");
    console.log("   Sample table structure:");
    schemaInfo.forEach((col: any) => {
      console.log(
        `   - ${col.table_schema}.${col.table_name}.${col.column_name} (${col.data_type})`
      );
    });

    console.log(
      "\n🎉 All tests passed! Drizzle ORM is ready for Safety database development."
    );
    console.log("\n📋 Next steps:");
    console.log("   1. Run 'pnpm db:generate' to create initial migration");
    console.log("   2. Run 'pnpm db:push' to sync schema changes");
    console.log("   3. Run 'pnpm db:studio' to explore the database");
  } catch (error) {
    console.error("❌ Database connection test failed:");
    console.error(error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection()
    .then(() => process.exit(0))
    .catch(error => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}

export { testDatabaseConnection };
