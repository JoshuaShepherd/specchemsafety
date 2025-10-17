/**
 * Safety Business RLS Integration Verification
 *
 * This script verifies that RLS policies work correctly with Drizzle ORM
 * and provides integration testing for the Safety business system.
 */

import { db } from "../index";
import { sql } from "drizzle-orm";
import { territories, userProfiles, accounts } from "../schema";

export interface RLSVerificationResult {
  testName: string;
  passed: boolean;
  details: string;
  error?: string;
}

export class RLSIntegrationVerifier {
  private testUserId: string | null = null;

  /**
   * Set the current user context for testing
   */
  async setUserContext(userId: string): Promise<void> {
    // this.testUserId = userId; // Unused variable
    await db.execute(sql`SELECT set_test_user(${userId})`);
  }

  /**
   * Verify territory-based access control
   */
  async verifyTerritoryAccess(): Promise<RLSVerificationResult[]> {
    const results: RLSVerificationResult[] = [];

    try {
      // Test 1: North manager should only see North territory accounts
      await this.setUserContext("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
      const northAccounts = await db.execute(
        sql`SELECT COUNT(*) as count FROM accounts`
      );

      results.push({
        testName: "North Manager Territory Access",
        passed:
          (northAccounts[0] as any).count >= 2 &&
          (northAccounts[0] as any).count <= 2,
        details: `North manager can see ${(northAccounts[0] as any).count} accounts (expected 2)`,
      });

      // Test 2: South rep should only see South territory accounts
      await this.setUserContext("ffffffff-ffff-ffff-ffff-ffffffffffff");
      const southAccounts = await db.execute(
        sql`SELECT COUNT(*) as count FROM accounts`
      );

      results.push({
        testName: "South Rep Territory Access",
        passed:
          (southAccounts[0] as any).count >= 2 &&
          (southAccounts[0] as any).count <= 2,
        details: `South rep can see ${(southAccounts[0] as any).count} accounts (expected 2)`,
      });

      // Test 3: Admin should see all accounts
      await this.setUserContext("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
      const adminAccounts = await db.execute(
        sql`SELECT COUNT(*) as count FROM accounts`
      );

      results.push({
        testName: "Admin Cross-Territory Access",
        passed: (adminAccounts[0] as any).count >= 5,
        details: `Admin can see ${(adminAccounts[0] as any).count} accounts (expected ≥5)`,
      });
    } catch (error) {
      results.push({
        testName: "Territory Access Test",
        passed: false,
        details: "Failed to execute territory access tests",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return results;
  }

  /**
   * Verify role-based access control
   */
  async verifyRoleBasedAccess(): Promise<RLSVerificationResult[]> {
    const results: RLSVerificationResult[] = [];

    try {
      // Test 1: Employee should not be able to create accounts
      await this.setUserContext("dddddddd-dddd-dddd-dddd-dddddddddddd");
      let employeeCanCreate = false;

      try {
        await db.execute(sql`
          INSERT INTO accounts (territory_id, owner_id, name, account_number, type, created_by)
          VALUES ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Employee Test', 'EMP-001', 'safety_equipment_customer', 'dddddddd-dddd-dddd-dddd-dddddddddddd')
        `);
        employeeCanCreate = true;
      } catch (error) {
        employeeCanCreate = false;
      }

      results.push({
        testName: "Employee Account Creation Restriction",
        passed: !employeeCanCreate,
        details: `Employee can create accounts: ${employeeCanCreate} (should be false)`,
      });

      // Test 2: Rep should be able to create accounts
      await this.setUserContext("cccccccc-cccc-cccc-cccc-cccccccccccc");
      let repCanCreate = false;

      try {
        await db.execute(sql`
          INSERT INTO accounts (territory_id, owner_id, name, account_number, type, created_by)
          VALUES ('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Rep Test', 'REP-001', 'safety_equipment_customer', 'cccccccc-cccc-cccc-cccc-cccccccccccc')
        `);
        repCanCreate = true;

        // Cleanup
        await db.execute(
          sql`DELETE FROM accounts WHERE account_number = 'REP-001'`
        );
      } catch (error) {
        repCanCreate = false;
      }

      results.push({
        testName: "Rep Account Creation Permission",
        passed: repCanCreate,
        details: `Rep can create accounts: ${repCanCreate} (should be true)`,
      });

      // Test 3: Manager should be able to create accounts
      await this.setUserContext("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
      let managerCanCreate = false;

      try {
        await db.execute(sql`
          INSERT INTO accounts (territory_id, owner_id, name, account_number, type, created_by)
          VALUES ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Manager Test', 'MGR-001', 'safety_equipment_customer', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
        `);
        managerCanCreate = true;

        // Cleanup
        await db.execute(
          sql`DELETE FROM accounts WHERE account_number = 'MGR-001'`
        );
      } catch (error) {
        managerCanCreate = false;
      }

      results.push({
        testName: "Manager Account Creation Permission",
        passed: managerCanCreate,
        details: `Manager can create accounts: ${managerCanCreate} (should be true)`,
      });
    } catch (error) {
      results.push({
        testName: "Role-Based Access Test",
        passed: false,
        details: "Failed to execute role-based access tests",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return results;
  }

  /**
   * Verify owner-based access control
   */
  async verifyOwnerBasedAccess(): Promise<RLSVerificationResult[]> {
    const results: RLSVerificationResult[] = [];

    try {
      // Test 1: Owner can update their accounts
      await this.setUserContext("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
      let ownerCanUpdate = false;

      try {
        await db.execute(sql`
          UPDATE accounts 
          SET name = 'Updated by Owner'
          WHERE id = 'account-north-1'
        `);
        ownerCanUpdate = true;

        // Restore original name
        await db.execute(sql`
          UPDATE accounts 
          SET name = 'North Manufacturing'
          WHERE id = 'account-north-1'
        `);
      } catch (error) {
        ownerCanUpdate = false;
      }

      results.push({
        testName: "Owner Update Permission",
        passed: ownerCanUpdate,
        details: `Owner can update their accounts: ${ownerCanUpdate} (should be true)`,
      });

      // Test 2: Non-owner cannot update accounts
      await this.setUserContext("dddddddd-dddd-dddd-dddd-dddddddddddd");
      let nonOwnerCanUpdate = false;

      try {
        await db.execute(sql`
          UPDATE accounts 
          SET name = 'Hacked by Non-Owner'
          WHERE id = 'account-north-1'
        `);
        nonOwnerCanUpdate = true;
      } catch (error) {
        nonOwnerCanUpdate = false;
      }

      results.push({
        testName: "Non-Owner Update Restriction",
        passed: !nonOwnerCanUpdate,
        details: `Non-owner can update accounts: ${nonOwnerCanUpdate} (should be false)`,
      });
    } catch (error) {
      results.push({
        testName: "Owner-Based Access Test",
        passed: false,
        details: "Failed to execute owner-based access tests",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return results;
  }

  /**
   * Verify Drizzle ORM integration
   */
  async verifyDrizzleIntegration(): Promise<RLSVerificationResult[]> {
    const results: RLSVerificationResult[] = [];

    try {
      // Test 1: Drizzle select queries work with RLS
      await this.setUserContext("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

      const drizzleQuery = await db.execute(sql`
        SELECT id, name, account_number, type, status 
        FROM accounts 
        WHERE is_active = true
        ORDER BY name
      `);

      results.push({
        testName: "Drizzle Select Query with RLS",
        passed: drizzleQuery.length > 0,
        details: `Drizzle query returned ${drizzleQuery.length} records`,
      });

      // Test 2: Drizzle insert queries work with RLS
      await this.setUserContext("cccccccc-cccc-cccc-cccc-cccccccccccc");

      let drizzleInsertWorked = false;
      try {
        const insertResult = await db.execute(sql`
          INSERT INTO accounts (territory_id, owner_id, name, account_number, type, created_by)
          VALUES ('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Drizzle Test Account', 'DRIZZLE-001', 'safety_equipment_customer', 'cccccccc-cccc-cccc-cccc-cccccccccccc')
          RETURNING id
        `);

        drizzleInsertWorked = insertResult.length > 0;

        // Cleanup
        await db.execute(
          sql`DELETE FROM accounts WHERE account_number = 'DRIZZLE-001'`
        );
      } catch (error) {
        drizzleInsertWorked = false;
      }

      results.push({
        testName: "Drizzle Insert Query with RLS",
        passed: drizzleInsertWorked,
        details: `Drizzle insert query succeeded: ${drizzleInsertWorked}`,
      });

      // Test 3: Drizzle update queries work with RLS
      await this.setUserContext("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

      let drizzleUpdateWorked = false;
      try {
        const updateResult = await db.execute(sql`
          UPDATE accounts 
          SET name = 'Updated via Drizzle'
          WHERE id = 'account-north-1'
          RETURNING id, name
        `);

        drizzleUpdateWorked = updateResult.length > 0;

        // Restore original name
        await db.execute(sql`
          UPDATE accounts 
          SET name = 'North Manufacturing'
          WHERE id = 'account-north-1'
        `);
      } catch (error) {
        drizzleUpdateWorked = false;
      }

      results.push({
        testName: "Drizzle Update Query with RLS",
        passed: drizzleUpdateWorked,
        details: `Drizzle update query succeeded: ${drizzleUpdateWorked}`,
      });
    } catch (error) {
      results.push({
        testName: "Drizzle Integration Test",
        passed: false,
        details: "Failed to execute Drizzle integration tests",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return results;
  }

  /**
   * Verify cross-territory isolation
   */
  async verifyCrossTerritoryIsolation(): Promise<RLSVerificationResult[]> {
    const results: RLSVerificationResult[] = [];

    try {
      // Test 1: North user cannot see South data
      await this.setUserContext("cccccccc-cccc-cccc-cccc-cccccccccccc");

      const northUserSouthData = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM accounts a 
        JOIN territories t ON a.territory_id = t.id 
        WHERE t.code = 'SOUTH'
      `);

      results.push({
        testName: "North User South Data Isolation",
        passed: (northUserSouthData[0] as any).count === 0,
        details: `North user can see ${(northUserSouthData[0] as any).count} South accounts (should be 0)`,
      });

      // Test 2: South user cannot see North data
      await this.setUserContext("ffffffff-ffff-ffff-ffff-ffffffffffff");

      const southUserNorthData = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM accounts a 
        JOIN territories t ON a.territory_id = t.id 
        WHERE t.code = 'NORTH'
      `);

      results.push({
        testName: "South User North Data Isolation",
        passed: (southUserNorthData[0] as any).count === 0,
        details: `South user can see ${(southUserNorthData[0] as any).count} North accounts (should be 0)`,
      });

      // Test 3: Admin can see all data
      await this.setUserContext("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");

      const adminAllData = await db.execute(sql`
        SELECT COUNT(*) as count FROM accounts
      `);

      results.push({
        testName: "Admin Cross-Territory Access",
        passed: (adminAllData[0] as any).count >= 5,
        details: `Admin can see ${(adminAllData[0] as any).count} accounts across all territories`,
      });
    } catch (error) {
      results.push({
        testName: "Cross-Territory Isolation Test",
        passed: false,
        details: "Failed to execute cross-territory isolation tests",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return results;
  }

  /**
   * Run all verification tests
   */
  async runAllVerifications(): Promise<RLSVerificationResult[]> {
    const allResults: RLSVerificationResult[] = [];

    console.log("🔍 Running Safety Business RLS Integration Verification...\n");

    // Setup test data
    try {
      await db.execute(sql`SELECT setup_test_territories()`);
      await db.execute(sql`SELECT setup_test_users()`);
      await db.execute(sql`SELECT setup_test_accounts()`);
      console.log("✅ Test data setup completed\n");
    } catch (error) {
      console.error("❌ Failed to setup test data:", error);
      return [
        {
          testName: "Test Data Setup",
          passed: false,
          details: "Failed to setup test data",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      ];
    }

    // Run all verification tests
    const testSuites = [
      {
        name: "Territory Access Control",
        fn: () => this.verifyTerritoryAccess(),
      },
      {
        name: "Role-Based Access Control",
        fn: () => this.verifyRoleBasedAccess(),
      },
      {
        name: "Owner-Based Access Control",
        fn: () => this.verifyOwnerBasedAccess(),
      },
      {
        name: "Drizzle ORM Integration",
        fn: () => this.verifyDrizzleIntegration(),
      },
      {
        name: "Cross-Territory Isolation",
        fn: () => this.verifyCrossTerritoryIsolation(),
      },
    ];

    for (const suite of testSuites) {
      console.log(`🧪 Running ${suite.name} tests...`);
      try {
        const results = await suite.fn();
        allResults.push(...results);

        const passed = results.filter(r => r.passed).length;
        const total = results.length;
        console.log(`   ${passed}/${total} tests passed\n`);
      } catch (error) {
        console.error(`   ❌ Failed to run ${suite.name}:`, error);
        allResults.push({
          testName: suite.name,
          passed: false,
          details: `Failed to run ${suite.name} test suite`,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Cleanup test data
    try {
      await db.execute(sql`SELECT cleanup_test_data()`);
      console.log("🧹 Test data cleanup completed\n");
    } catch (error) {
      console.error("⚠️  Failed to cleanup test data:", error);
    }

    return allResults;
  }

  /**
   * Generate verification report
   */
  generateReport(results: RLSVerificationResult[]): void {
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const failed = results.filter(r => !r.passed);

    console.log("📊 RLS Integration Verification Report");
    console.log("=====================================\n");
    console.log(
      `Overall Result: ${passed}/${total} tests passed (${Math.round((passed / total) * 100)}%)\n`
    );

    if (failed.length > 0) {
      console.log("❌ Failed Tests:");
      failed.forEach(test => {
        console.log(`   • ${test.testName}: ${test.details}`);
        if (test.error) {
          console.log(`     Error: ${test.error}`);
        }
      });
      console.log("");
    }

    console.log("✅ All Tests:");
    results.forEach(test => {
      const status = test.passed ? "✅" : "❌";
      console.log(`   ${status} ${test.testName}: ${test.details}`);
    });

    console.log("\n🎯 Summary:");
    if (passed === total) {
      console.log(
        "   🎉 All RLS integration tests passed! Safety business RLS is ready for production."
      );
    } else {
      console.log(
        `   ⚠️  ${failed.length} test(s) failed. Please review and fix issues before production deployment.`
      );
    }
  }
}

/**
 * Main verification function
 */
export async function verifyRLSIntegration(): Promise<RLSVerificationResult[]> {
  const verifier = new RLSIntegrationVerifier();
  const results = await verifier.runAllVerifications();
  verifier.generateReport(results);
  return results;
}

/**
 * Quick verification function for CI/CD
 */
export async function quickRLSVerification(): Promise<boolean> {
  try {
    const results = await verifyRLSIntegration();
    const allPassed = results.every(r => r.passed);

    if (allPassed) {
      console.log("✅ Quick RLS verification passed");
    } else {
      console.log("❌ Quick RLS verification failed");
    }

    return allPassed;
  } catch (error) {
    console.error("❌ RLS verification error:", error);
    return false;
  }
}

// Export for use in tests
// export { RLSIntegrationVerifier }; // Already exported above
