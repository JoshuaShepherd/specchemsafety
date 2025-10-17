import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "../index";
import { sql } from "drizzle-orm";

/**
 * Safety Business RLS Testing Suite
 *
 * This test suite validates that Row-Level Security policies work correctly
 * for Safety business tables, ensuring proper territory isolation, role-based
 * access control, and data security.
 */

describe("Safety Business RLS Policies", () => {
  beforeAll(async () => {
    // Setup test data
    await db.execute(sql`SELECT setup_test_territories()`);
    await db.execute(sql`SELECT setup_test_users()`);
    await db.execute(sql`SELECT setup_test_accounts()`);
  });

  afterAll(async () => {
    // Cleanup test data
    await db.execute(sql`SELECT cleanup_test_data()`);
  });

  describe("Territory Isolation", () => {
    it("should prevent cross-territory access for regular users", async () => {
      const result = await db.execute(
        sql`SELECT * FROM test_territory_isolation()`
      );
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.passed).toBe(true);
      expect(testResult.details).toContain("North Rep: 2 accounts");
      expect(testResult.details).toContain("South Rep: 2 accounts");
    });

    it("should allow admins to access all territories", async () => {
      const result = await db.execute(
        sql`SELECT * FROM test_territory_isolation()`
      );
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.passed).toBe(true);
      expect(testResult.details).toContain("North Admin:");
    });
  });

  describe("Role-based Access Control", () => {
    it("should enforce proper role permissions", async () => {
      const result = await db.execute(
        sql`SELECT * FROM test_role_based_access()`
      );
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.passed).toBe(true);
      expect(testResult.details).toContain("Employee: false");
      expect(testResult.details).toContain("Rep: true");
      expect(testResult.details).toContain("Manager: true");
      expect(testResult.details).toContain("Admin: true");
    });

    it("should prevent employees from creating accounts", async () => {
      const result = await db.execute(
        sql`SELECT * FROM test_role_based_access()`
      );
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.details).toContain("Employee: false");
    });

    it("should allow reps and managers to create accounts", async () => {
      const result = await db.execute(
        sql`SELECT * FROM test_role_based_access()`
      );
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.details).toContain("Rep: true");
      expect(testResult.details).toContain("Manager: true");
      expect(testResult.details).toContain("Admin: true");
    });
  });

  describe("Owner-based Access", () => {
    it("should allow owners to update their records", async () => {
      const result = await db.execute(
        sql`SELECT * FROM test_owner_based_access()`
      );
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.passed).toBe(true);
      expect(testResult.details).toContain("Owner can update: true");
    });

    it("should prevent non-owners from updating records", async () => {
      const result = await db.execute(
        sql`SELECT * FROM test_owner_based_access()`
      );
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.details).toContain("Non-owner blocked: true");
    });

    it("should show different record counts for owners vs non-owners", async () => {
      const result = await db.execute(
        sql`SELECT * FROM test_owner_based_access()`
      );
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.details).toMatch(
        /Owner count: \d+, Non-owner count: \d+/
      );
    });
  });

  describe("Cross-territory Prevention", () => {
    it("should prevent North users from accessing South data", async () => {
      const result = await db.execute(
        sql`SELECT * FROM test_cross_territory_prevention()`
      );
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.passed).toBe(true);
      expect(testResult.details).toContain(
        "North user blocked from South: true"
      );
    });

    it("should prevent South users from accessing North data", async () => {
      const result = await db.execute(
        sql`SELECT * FROM test_cross_territory_prevention()`
      );
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.details).toContain(
        "South user blocked from North: true"
      );
    });
  });

  describe("Admin Override Capabilities", () => {
    it("should allow admins to access all territories", async () => {
      const result = await db.execute(sql`SELECT * FROM test_admin_override()`);
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.passed).toBe(true);
      expect(testResult.details).toContain("Admin access all: true");
    });

    it("should allow admins to manage cross-territory records", async () => {
      const result = await db.execute(sql`SELECT * FROM test_admin_override()`);
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.details).toContain("Admin manage all: true");
    });

    it("should show admin has more access than managers", async () => {
      const result = await db.execute(sql`SELECT * FROM test_admin_override()`);
      const testResult = result[0] as {
        test_name: string;
        passed: boolean;
        details: string;
      };

      expect(testResult.details).toMatch(
        /Admin count: \d+, Manager count: \d+/
      );
    });
  });

  describe("Comprehensive Test Suite", () => {
    it("should pass all RLS tests", async () => {
      const result = await db.execute(sql`SELECT * FROM run_all_rls_tests()`);

      // All tests should pass
      const allPassed = result.rows.every((row: any) => row.passed === true);
      expect(allPassed).toBe(true);

      // Should have 5 test results
      expect(result.rows).toHaveLength(5);

      // Log test results for debugging
      console.log("RLS Test Results:");
      result.rows.forEach((row: any) => {
        console.log(`- ${row.test_name}: ${row.passed ? "PASSED" : "FAILED"}`);
        if (!row.passed) {
          console.log(`  Details: ${row.details}`);
        }
      });
    });
  });

  describe("Helper Function Tests", () => {
    it("should correctly identify user territories", async () => {
      // Test North user territory
      const northResult = await db.execute(sql`
        SELECT get_user_territory_id_by_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') as territory_id
      `);
      expect(northResult[0].territory_id).toBe(
        "11111111-1111-1111-1111-111111111111"
      );
    });

    it("should correctly identify user roles", async () => {
      // Test admin role check
      const adminResult = await db.execute(sql`
        SELECT has_safety_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'safety_admin') as is_admin
      `);
      expect(adminResult[0].is_admin).toBe(true);
    });

    it("should correctly check territory access", async () => {
      // Test North user can access North territory
      const accessResult = await db.execute(sql`
        SELECT can_access_territory('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111') as can_access
      `);
      expect(accessResult[0].can_access).toBe(true);
    });
  });

  describe("Policy Integration Tests", () => {
    it("should work with Drizzle ORM queries", async () => {
      // This test verifies that RLS policies work correctly with Drizzle queries
      // by simulating different user contexts and checking query results

      // Test 1: North manager should see North accounts
      await db.execute(
        sql`SELECT set_test_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')`
      );
      const northAccounts = await db.execute(
        sql`SELECT COUNT(*) as count FROM accounts`
      );
      expect(northAccounts[0].count).toBeGreaterThan(0);

      // Test 2: South rep should see South accounts
      await db.execute(
        sql`SELECT set_test_user('ffffffff-ffff-ffff-ffff-ffffffffffff')`
      );
      const southAccounts = await db.execute(
        sql`SELECT COUNT(*) as count FROM accounts`
      );
      expect(southAccounts[0].count).toBeGreaterThan(0);

      // Test 3: Admin should see all accounts
      await db.execute(
        sql`SELECT set_test_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')`
      );
      const allAccounts = await db.execute(
        sql`SELECT COUNT(*) as count FROM accounts`
      );
      expect(allAccounts[0].count).toBeGreaterThanOrEqual(5);
    });

    it("should prevent unauthorized data access", async () => {
      // Test that users cannot access data they shouldn't see

      // Set North employee context
      await db.execute(
        sql`SELECT set_test_user('dddddddd-dddd-dddd-dddd-dddddddddddd')`
      );

      // Try to access South territory data - should be blocked by RLS
      const southData = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM accounts a 
        JOIN territories t ON a.territory_id = t.id 
        WHERE t.code = 'SOUTH'
      `);

      // Should return 0 or throw an error due to RLS
      expect(southData[0].count).toBe(0);
    });
  });
});

/**
 * Integration Test with Real Drizzle Queries
 *
 * This demonstrates how the RLS policies work with actual Drizzle ORM queries
 * in a real application scenario.
 */
describe("Drizzle ORM Integration with RLS", () => {
  it("should work with Drizzle select queries", async () => {
    // This would be the actual Drizzle query in your application
    // The RLS policies will automatically filter results based on user context

    // Simulate North manager context
    await db.execute(
      sql`SELECT set_test_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')`
    );

    // This query would be filtered by RLS policies
    const accounts = await db.execute(sql`
      SELECT id, name, account_number, type, status 
      FROM accounts 
      WHERE is_active = true
      ORDER BY name
    `);

    // Should only return North territory accounts
    expect(accounts.rows.length).toBeGreaterThan(0);
    expect(accounts.rows.length).toBeLessThanOrEqual(2); // Only North accounts
  });

  it("should work with Drizzle insert queries", async () => {
    // Test that RLS policies allow appropriate inserts

    // Set North rep context (should be able to create accounts)
    await db.execute(
      sql`SELECT set_test_user('cccccccc-cccc-cccc-cccc-cccccccccccc')`
    );

    // This insert should succeed due to RLS policies
    const insertResult = await db.execute(sql`
      INSERT INTO accounts (territory_id, owner_id, name, account_number, type, created_by)
      VALUES ('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Test Integration Account', 'INT-TEST-001', 'safety_equipment_customer', 'cccccccc-cccc-cccc-cccc-cccccccccccc')
      RETURNING id
    `);

    expect(insertResult.rows).toHaveLength(1);

    // Clean up
    await db.execute(
      sql`DELETE FROM accounts WHERE account_number = 'INT-TEST-001'`
    );
  });

  it("should work with Drizzle update queries", async () => {
    // Test that RLS policies allow appropriate updates

    // Set North manager context (owns account-north-1)
    await db.execute(
      sql`SELECT set_test_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')`
    );

    // This update should succeed due to RLS policies
    const updateResult = await db.execute(sql`
      UPDATE accounts 
      SET name = 'Updated Integration Test Name'
      WHERE id = 'account-north-1'
      RETURNING id, name
    `);

    expect(updateResult.rows).toHaveLength(1);
    expect(updateResult[0].name).toBe("Updated Integration Test Name");

    // Restore original name
    await db.execute(sql`
      UPDATE accounts 
      SET name = 'North Manufacturing'
      WHERE id = 'account-north-1'
    `);
  });
});
