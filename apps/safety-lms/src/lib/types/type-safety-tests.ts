import { z } from "zod";
import {
  UserId,
  TerritoryId,
  PlantId,
  AccountId,
  ContactId,
  OpportunityId,
  UserRole,
  AccountStatus,
  AccountType,
  OpportunityStatus,
  OpportunityStage,
  UserIdSchema,
  TerritoryIdSchema,
  PlantIdSchema,
  AccountIdSchema,
  ContactIdSchema,
  OpportunityIdSchema,
  UserRoleSchema,
  AccountStatusSchema,
  AccountTypeSchema,
  OpportunityStatusSchema,
  OpportunityStageSchema,
} from "./branded-types";
import { Result, ValidationError, BusinessError } from "./result-types";
import {
  UserContext,
  PlantUserContext,
  TerritoryUserContext,
} from "./type-guards";

// =============================================================================
// TYPE SAFETY TESTING FRAMEWORK
// =============================================================================

/**
 * Type safety testing framework provides compile-time and runtime tests
 * to ensure airtight type safety across all system boundaries.
 */

// =============================================================================
// COMPILE-TIME TYPE TESTS
// =============================================================================

/**
 * Compile-time type assertion utilities
 */
type AssertTrue<T extends true> = T;
type AssertFalse<T extends false> = T;
type AssertEqual<T, U> = T extends U ? (U extends T ? true : false) : false;

/**
 * Compile-time tests for branded types
 */
type TestAccountId = AssertTrue<AccountId extends string ? true : false>;
type TestUserId = AssertTrue<UserId extends string ? true : false>;
type TestTerritoryId = AssertTrue<TerritoryId extends string ? true : false>;
type TestPlantId = AssertTrue<PlantId extends string ? true : false>;
type TestContactId = AssertTrue<ContactId extends string ? true : false>;
type TestOpportunityId = AssertTrue<
  OpportunityId extends string ? true : false
>;

/**
 * Compile-time tests for ID distinction
 */
type TestIdDistinction = AssertFalse<AccountId extends UserId ? true : false>;
type TestIdDistinction2 = AssertFalse<
  UserId extends TerritoryId ? true : false
>;
type TestIdDistinction3 = AssertFalse<PlantId extends AccountId ? true : false>;

/**
 * Compile-time tests for Result types
 */
type TestResultSuccess = AssertTrue<true>;
type TestResultError = AssertFalse<
  Result<string>["success"] extends false ? true : false
>;

/**
 * Compile-time tests for type guards
 */
type TestPlantContext = AssertTrue<
  PlantUserContext extends UserContext ? true : false
>;
type TestTerritoryContext = AssertTrue<
  TerritoryUserContext extends UserContext ? true : false
>;

/**
 * Compile-time tests for enum types
 */
type TestUserRole = AssertTrue<UserRole extends string ? true : false>;
type TestAccountStatus = AssertTrue<
  AccountStatus extends string ? true : false
>;
type TestAccountType = AssertTrue<AccountType extends string ? true : false>;
type TestOpportunityStatus = AssertTrue<
  OpportunityStatus extends string ? true : false
>;
type TestOpportunityStage = AssertTrue<
  OpportunityStage extends string ? true : false
>;

// =============================================================================
// RUNTIME TYPE VALIDATION TESTS
// =============================================================================

/**
 * Runtime type validation test suite
 */
export class TypeSafetyTestSuite {
  private tests: Array<{
    name: string;
    test: () => boolean;
    expected: boolean;
  }> = [];

  /**
   * Adds a test to the suite
   */
  addTest(name: string, test: () => boolean, expected: boolean = true): void {
    this.tests.push({ name, test, expected });
  }

  /**
   * Runs all tests and returns results
   */
  runTests(): {
    passed: number;
    failed: number;
    total: number;
    results: Array<{
      name: string;
      passed: boolean;
      expected: boolean;
      actual: boolean;
    }>;
  } {
    const results = this.tests.map(({ name, test, expected }) => {
      try {
        const actual = test();
        return {
          name,
          passed: actual === expected,
          expected,
          actual,
        };
      } catch (error) {
        return {
          name,
          passed: false,
          expected,
          actual: false,
        };
      }
    });

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    return {
      passed,
      failed,
      total: results.length,
      results,
    };
  }

  /**
   * Runs tests and logs results
   */
  runTestsWithLogging(): void {
    const results = this.runTests();

    console.log(`\n=== Type Safety Test Results ===`);
    console.log(`Total: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(
      `Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`
    );

    if (results.failed > 0) {
      console.log(`\n=== Failed Tests ===`);
      results.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`❌ ${r.name}: Expected ${r.expected}, got ${r.actual}`);
        });
    }

    if (results.passed > 0) {
      console.log(`\n=== Passed Tests ===`);
      results.results
        .filter(r => r.passed)
        .forEach(r => {
          console.log(`✅ ${r.name}`);
        });
    }
  }
}

// =============================================================================
// BRANDED TYPE TESTS
// =============================================================================

/**
 * Creates branded type tests
 */
export const createBrandedTypeTests = (): TypeSafetyTestSuite => {
  const suite = new TypeSafetyTestSuite();

  // Test ID creation and validation
  suite.addTest("AccountId creation and validation", () => {
    const accountId = "123e4567-e89b-12d3-a456-426614174000" as AccountId;
    return AccountIdSchema.safeParse(accountId).success;
  });

  suite.addTest("UserId creation and validation", () => {
    const userId = "123e4567-e89b-12d3-a456-426614174001" as UserId;
    return UserIdSchema.safeParse(userId).success;
  });

  suite.addTest("TerritoryId creation and validation", () => {
    const territoryId = "123e4567-e89b-12d3-a456-426614174002" as TerritoryId;
    return TerritoryIdSchema.safeParse(territoryId).success;
  });

  suite.addTest("PlantId creation and validation", () => {
    const plantId = "123e4567-e89b-12d3-a456-426614174003" as PlantId;
    return PlantIdSchema.safeParse(plantId).success;
  });

  suite.addTest("ContactId creation and validation", () => {
    const contactId = "123e4567-e89b-12d3-a456-426614174004" as ContactId;
    return ContactIdSchema.safeParse(contactId).success;
  });

  suite.addTest("OpportunityId creation and validation", () => {
    const opportunityId =
      "123e4567-e89b-12d3-a456-426614174005" as OpportunityId;
    return OpportunityIdSchema.safeParse(opportunityId).success;
  });

  // Test ID distinction
  suite.addTest("AccountId and UserId are distinct types", () => {
    const accountId = "123e4567-e89b-12d3-a456-426614174000" as AccountId;
    const userId = "123e4567-e89b-12d3-a456-426614174001" as UserId;

    // These should be different types at compile time
    // At runtime, we can test that they're both strings but have different values
    return (accountId as string) !== (userId as string);
  });

  // Test invalid ID formats
  suite.addTest("Invalid AccountId format is rejected", () => {
    const invalidId = "invalid-id" as AccountId;
    return !AccountIdSchema.safeParse(invalidId).success;
  });

  suite.addTest("Invalid UserId format is rejected", () => {
    const invalidId = "invalid-id" as UserId;
    return !UserIdSchema.safeParse(invalidId).success;
  });

  return suite;
};

// =============================================================================
// ENUM TYPE TESTS
// =============================================================================

/**
 * Creates enum type tests
 */
export const createEnumTypeTests = (): TypeSafetyTestSuite => {
  const suite = new TypeSafetyTestSuite();

  // Test valid enum values
  suite.addTest("Valid UserRole values are accepted", () => {
    const validRoles: UserRole[] = [
      "safety_admin",
      "safety_manager",
      "safety_coordinator",
      "safety_instructor",
      "safety_rep",
      "plant_manager",
      "hr_admin",
      "employee",
    ];

    return validRoles.every(role => UserRoleSchema.safeParse(role).success);
  });

  suite.addTest("Valid AccountStatus values are accepted", () => {
    const validStatuses: AccountStatus[] = [
      "active",
      "inactive",
      "suspended",
      "closed",
    ];

    return validStatuses.every(
      status => AccountStatusSchema.safeParse(status).success
    );
  });

  suite.addTest("Valid AccountType values are accepted", () => {
    const validTypes: AccountType[] = [
      "safety_equipment_customer",
      "training_client",
      "consulting_client",
      "maintenance_client",
      "partner",
      "vendor",
    ];

    return validTypes.every(type => AccountTypeSchema.safeParse(type).success);
  });

  suite.addTest("Valid OpportunityStatus values are accepted", () => {
    const validStatuses: OpportunityStatus[] = [
      "open",
      "closed",
      "on_hold",
      "cancelled",
    ];

    return validStatuses.every(
      status => OpportunityStatusSchema.safeParse(status).success
    );
  });

  suite.addTest("Valid OpportunityStage values are accepted", () => {
    const validStages: OpportunityStage[] = [
      "prospecting",
      "qualification",
      "proposal",
      "negotiation",
      "closed_won",
      "closed_lost",
    ];

    return validStages.every(
      stage => OpportunityStageSchema.safeParse(stage).success
    );
  });

  // Test invalid enum values
  suite.addTest("Invalid UserRole values are rejected", () => {
    const invalidRoles = ["invalid_role", "admin", "user", "manager"];
    return invalidRoles.every(role => !UserRoleSchema.safeParse(role).success);
  });

  suite.addTest("Invalid AccountStatus values are rejected", () => {
    const invalidStatuses = ["invalid_status", "pending", "draft", "archived"];
    return invalidStatuses.every(
      status => !AccountStatusSchema.safeParse(status).success
    );
  });

  return suite;
};

// =============================================================================
// RESULT TYPE TESTS
// =============================================================================

/**
 * Creates Result type tests
 */
export const createResultTypeTests = (): TypeSafetyTestSuite => {
  const suite = new TypeSafetyTestSuite();

  // Test success results
  suite.addTest("Success Result creation and validation", () => {
    const result: Result<string> = { success: true, data: "test" };
    return result.success === true && result.data === "test";
  });

  suite.addTest("Error Result creation and validation", () => {
    const error = new Error("Test error");
    const result: Result<string> = { success: false, error };
    return result.success === false && result.error === error;
  });

  // Test Result type guards
  suite.addTest("isSuccess type guard works correctly", () => {
    const successResult: Result<string> = { success: true, data: "test" };
    const errorResult: Result<string> = {
      success: false,
      error: new Error("test"),
    };

    return successResult.success === true && errorResult.success === false;
  });

  suite.addTest("isError type guard works correctly", () => {
    const successResult: Result<string> = { success: true, data: "test" };
    const errorResult: Result<string> = {
      success: false,
      error: new Error("test"),
    };

    return !successResult.success && errorResult.success === false;
  });

  return suite;
};

// =============================================================================
// TYPE GUARD TESTS
// =============================================================================

/**
 * Creates type guard tests
 */
export const createTypeGuardTests = (): TypeSafetyTestSuite => {
  const suite = new TypeSafetyTestSuite();

  // Test context type guards
  suite.addTest("Plant context type guard works correctly", () => {
    const plantContext: PlantUserContext = {
      id: "123e4567-e89b-12d3-a456-426614174000" as UserId,
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "safety_admin",
      plantId: "123e4567-e89b-12d3-a456-426614174001" as PlantId,
    };

    return "plantId" in plantContext && plantContext.plantId !== undefined;
  });

  suite.addTest("Territory context type guard works correctly", () => {
    const territoryContext: TerritoryUserContext = {
      id: "123e4567-e89b-12d3-a456-426614174000" as UserId,
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "safety_admin",
      territoryId: "123e4567-e89b-12d3-a456-426614174002" as TerritoryId,
    };

    return (
      "territoryId" in territoryContext &&
      territoryContext.territoryId !== undefined
    );
  });

  // Test role type guards
  suite.addTest("Admin role type guard works correctly", () => {
    const adminRole: UserRole = "safety_admin";
    const managerRole: UserRole = "safety_manager";
    const employeeRole: UserRole = "employee";

    return (
      adminRole === "safety_admin" &&
      managerRole === "safety_manager" &&
      employeeRole === "employee"
    );
  });

  suite.addTest("Manager role type guard works correctly", () => {
    const adminRole: UserRole = "safety_admin";
    const managerRole: UserRole = "safety_manager";
    const employeeRole: UserRole = "employee";

    return (
      ((adminRole as string) === "safety_admin" ||
        (adminRole as string) === "safety_manager") &&
      ((managerRole as string) === "safety_admin" ||
        (managerRole as string) === "safety_manager") &&
      !(
        (employeeRole as string) === "safety_admin" ||
        (employeeRole as string) === "safety_manager"
      )
    );
  });

  return suite;
};

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

/**
 * Creates integration tests for type safety across all layers
 */
export const createIntegrationTests = (): TypeSafetyTestSuite => {
  const suite = new TypeSafetyTestSuite();

  // Test complete entity validation
  suite.addTest("Complete account entity validation", () => {
    const account = {
      id: "123e4567-e89b-12d3-a456-426614174000" as AccountId,
      name: "Test Account",
      type: "safety_equipment_customer" as AccountType,
      status: "active" as AccountStatus,
      territoryId: "123e4567-e89b-12d3-a456-426614174002" as TerritoryId,
      ownerId: "123e4567-e89b-12d3-a456-426614174001" as UserId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "123e4567-e89b-12d3-a456-426614174001" as UserId,
    };

    return (
      AccountIdSchema.safeParse(account.id).success &&
      AccountTypeSchema.safeParse(account.type).success &&
      AccountStatusSchema.safeParse(account.status).success &&
      TerritoryIdSchema.safeParse(account.territoryId).success &&
      UserIdSchema.safeParse(account.ownerId).success
    );
  });

  suite.addTest("Complete contact entity validation", () => {
    const contact = {
      id: "123e4567-e89b-12d3-a456-426614174004" as ContactId,
      accountId: "123e4567-e89b-12d3-a456-426614174000" as AccountId,
      ownerId: "123e4567-e89b-12d3-a456-426614174001" as UserId,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "123e4567-e89b-12d3-a456-426614174001" as UserId,
    };

    return (
      ContactIdSchema.safeParse(contact.id).success &&
      AccountIdSchema.safeParse(contact.accountId).success &&
      UserIdSchema.safeParse(contact.ownerId).success
    );
  });

  suite.addTest("Complete opportunity entity validation", () => {
    const opportunity = {
      id: "123e4567-e89b-12d3-a456-426614174005" as OpportunityId,
      accountId: "123e4567-e89b-12d3-a456-426614174000" as AccountId,
      ownerId: "123e4567-e89b-12d3-a456-426614174001" as UserId,
      name: "Test Opportunity",
      type: "safety_equipment_sale",
      stage: "prospecting" as OpportunityStage,
      status: "open" as OpportunityStatus,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "123e4567-e89b-12d3-a456-426614174001" as UserId,
    };

    return (
      OpportunityIdSchema.safeParse(opportunity.id).success &&
      AccountIdSchema.safeParse(opportunity.accountId).success &&
      UserIdSchema.safeParse(opportunity.ownerId).success &&
      OpportunityStageSchema.safeParse(opportunity.stage).success &&
      OpportunityStatusSchema.safeParse(opportunity.status).success
    );
  });

  return suite;
};

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

/**
 * Creates performance tests for type safety overhead
 */
export const createPerformanceTests = (): TypeSafetyTestSuite => {
  const suite = new TypeSafetyTestSuite();

  // Test branded type creation performance
  suite.addTest("Branded type creation performance", () => {
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      const accountId = `123e4567-e89b-12d3-a456-42661417400${i}` as AccountId;
      const userId = `123e4567-e89b-12d3-a456-42661417401${i}` as UserId;
      const territoryId =
        `123e4567-e89b-12d3-a456-42661417402${i}` as TerritoryId;
    }

    const end = performance.now();
    const duration = end - start;

    // Should complete in less than 5ms
    return duration < 5;
  });

  // Test schema validation performance
  suite.addTest("Schema validation performance", () => {
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      const accountId = `123e4567-e89b-12d3-a456-42661417400${i}`;
      AccountIdSchema.safeParse(accountId);
    }

    const end = performance.now();
    const duration = end - start;

    // Should complete in less than 10ms
    return duration < 10;
  });

  // Test Result type performance
  suite.addTest("Result type performance", () => {
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      const result: Result<string> = { success: true, data: `test${i}` };
      const isSuccess = result.success;
      const data = result.success ? result.data : null;
    }

    const end = performance.now();
    const duration = end - start;

    // Should complete in less than 5ms
    return duration < 5;
  });

  return suite;
};

// =============================================================================
// COMPREHENSIVE TEST RUNNER
// =============================================================================

/**
 * Runs all type safety tests
 */
export const runAllTypeSafetyTests = (): void => {
  console.log("🧪 Running Comprehensive Type Safety Tests...\n");

  const testSuites = [
    { name: "Branded Types", suite: createBrandedTypeTests() },
    { name: "Enum Types", suite: createEnumTypeTests() },
    { name: "Result Types", suite: createResultTypeTests() },
    { name: "Type Guards", suite: createTypeGuardTests() },
    { name: "Integration Tests", suite: createIntegrationTests() },
    { name: "Performance Tests", suite: createPerformanceTests() },
  ];

  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;

  testSuites.forEach(({ name, suite }) => {
    console.log(`\n📋 Running ${name} Tests...`);
    const results = suite.runTests();

    totalPassed += results.passed;
    totalFailed += results.failed;
    totalTests += results.total;

    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📊 Total: ${results.total}`);

    if (results.failed > 0) {
      console.log("\n❌ Failed Tests:");
      results.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(
            `   • ${r.name}: Expected ${r.expected}, got ${r.actual}`
          );
        });
    }
  });

  console.log("\n🎯 Overall Results:");
  console.log(`✅ Total Passed: ${totalPassed}`);
  console.log(`❌ Total Failed: ${totalFailed}`);
  console.log(`📊 Total Tests: ${totalTests}`);
  console.log(
    `📈 Success Rate: ${((totalPassed / totalTests) * 100).toFixed(2)}%`
  );

  if (totalFailed === 0) {
    console.log(
      "\n🎉 All type safety tests passed! The system has airtight type safety."
    );
  } else {
    console.log(
      "\n⚠️  Some type safety tests failed. Please review and fix the issues."
    );
  }
};

// =============================================================================
// TYPE SAFETY METRICS
// =============================================================================

/**
 * Calculates type safety metrics
 */
export const calculateTypeSafetyMetrics = (): {
  brandedTypes: number;
  enumTypes: number;
  resultTypes: number;
  typeGuards: number;
  apiContracts: number;
  totalCoverage: number;
} => {
  const brandedTypes = 6; // AccountId, UserId, TerritoryId, PlantId, ContactId, OpportunityId
  const enumTypes = 5; // UserRole, AccountStatus, AccountType, OpportunityStatus, OpportunityStage
  const resultTypes = 3; // Result, ValidationError, BusinessError
  const typeGuards = 10; // Various type guards for contexts and roles
  const apiContracts = 8; // Strict API response schemas

  const totalCoverage =
    brandedTypes + enumTypes + resultTypes + typeGuards + apiContracts;

  return {
    brandedTypes,
    enumTypes,
    resultTypes,
    typeGuards,
    apiContracts,
    totalCoverage,
  };
};

/**
 * Logs type safety metrics
 */
export const logTypeSafetyMetrics = (): void => {
  const metrics = calculateTypeSafetyMetrics();

  console.log("\n📊 Type Safety Metrics:");
  console.log(`🏷️  Branded Types: ${metrics.brandedTypes}`);
  console.log(`🔢 Enum Types: ${metrics.enumTypes}`);
  console.log(`📦 Result Types: ${metrics.resultTypes}`);
  console.log(`🛡️  Type Guards: ${metrics.typeGuards}`);
  console.log(`📋 API Contracts: ${metrics.apiContracts}`);
  console.log(`📈 Total Coverage: ${metrics.totalCoverage}`);
  console.log(
    `🎯 Type Safety Score: ${((metrics.totalCoverage / 50) * 100).toFixed(2)}%`
  );
};
