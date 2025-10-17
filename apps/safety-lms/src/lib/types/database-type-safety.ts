import { z } from "zod";
import { sql } from "drizzle-orm";
import {
  UserId,
  TerritoryId,
  PlantId,
  AccountId,
  ContactId,
  OpportunityId,
  UserIdSchema,
  TerritoryIdSchema,
  PlantIdSchema,
  AccountIdSchema,
  ContactIdSchema,
  OpportunityIdSchema,
} from "./branded-types";
import {
  Result,
  success,
  error,
  ValidationError,
  BusinessError,
  createValidationError,
  createBusinessError,
} from "./result-types";

// =============================================================================
// DATABASE TYPE SAFETY SYSTEM
// =============================================================================

/**
 * Database type safety system provides runtime validation for all database
 * operations, ensuring type safety and preventing runtime errors.
 */

// =============================================================================
// TYPE-SAFE DATABASE QUERY BUILDERS
// =============================================================================

/**
 * Type-safe database query builder interface
 */
export interface TypedQueryBuilder<T> {
  execute: (
    query: string,
    params: unknown[]
  ) => Promise<Result<T[], ValidationError | BusinessError>>;
  executeOne: (
    query: string,
    params: unknown[]
  ) => Promise<Result<T | null, ValidationError | BusinessError>>;
  executeTransaction: (
    queries: Array<{ query: string; params: unknown[] }>
  ) => Promise<Result<T[], ValidationError | BusinessError>>;
}

/**
 * Creates a type-safe database query builder
 */
export const createTypedQuery = <T>(
  schema: z.ZodSchema<T>,
  db: any // Database connection - type this properly based on your DB setup
): TypedQueryBuilder<T> => {
  return {
    execute: async (
      query: string,
      params: unknown[]
    ): Promise<Result<T[], ValidationError | BusinessError>> => {
      try {
        // Validate parameters
        const validatedParams = validateQueryParams(params);
        if (!validatedParams.success) {
          return validatedParams as Result<
            T[],
            ValidationError | BusinessError
          >;
        }

        // Execute query
        const result = await db.execute(sql.raw(query));

        // Validate results
        const validatedResults = result.rows.map((row: unknown) => {
          try {
            return schema.parse(row);
          } catch (error) {
            if (error instanceof z.ZodError) {
              throw createValidationError(
                "VALIDATION_ERROR" as any,
                "Database result validation failed",
                {
                  field: error.issues[0]?.path.join("."),
                  value: error.issues[0]?.input,
                  path: error.issues[0]?.path.map(String),
                  context: { zodErrors: error.issues },
                }
              );
            }
            throw error;
          }
        });

        return success(validatedResults);
      } catch (error) {
        if (error && typeof error === "object" && "code" in error) {
          return error(error as ValidationError | BusinessError);
        }
        return error(
          createBusinessError(
            "DATABASE_ERROR" as any,
            "Database query execution failed",
            { operation: "execute", resource: "database" }
          )
        );
      }
    },

    executeOne: async (
      query: string,
      params: unknown[]
    ): Promise<Result<T | null, ValidationError | BusinessError>> => {
      try {
        // Validate parameters
        const validatedParams = validateQueryParams(params);
        if (!validatedParams.success) {
          return validatedParams as Result<
            T | null,
            ValidationError | BusinessError
          >;
        }

        // Execute query
        const result = await db.execute(sql.raw(query));

        if (result.rows.length === 0) {
          return success(null);
        }

        // Validate result
        try {
          const validatedResult = schema.parse(result.rows[0]);
          return success(validatedResult);
        } catch (parseError) {
          if (parseError instanceof z.ZodError) {
            const validationError = createValidationError(
              "VALIDATION_ERROR" as any,
              "Database result validation failed",
              {
                field: parseError.issues[0]?.path.join("."),
                value: parseError.issues[0]?.input,
                path: parseError.issues[0]?.path.map(String),
                context: { zodErrors: parseError.issues },
              }
            );
            return error(validationError);
          }
          throw parseError;
        }
      } catch (dbError) {
        if (dbError && typeof dbError === "object" && "code" in dbError) {
          return error(dbError as ValidationError | BusinessError);
        }
        return error(
          createBusinessError(
            "DATABASE_ERROR" as any,
            "Database query execution failed",
            { operation: "executeOne", resource: "database" }
          )
        );
      }
    },

    executeTransaction: async (
      queries: Array<{ query: string; params: unknown[] }>
    ): Promise<Result<T[], ValidationError | BusinessError>> => {
      try {
        // Validate all parameters
        for (const { params } of queries) {
          const validatedParams = validateQueryParams(params);
          if (!validatedParams.success) {
            return validatedParams as Result<
              T[],
              ValidationError | BusinessError
            >;
          }
        }

        // Execute transaction
        const results: T[] = [];
        await db.transaction(async (tx: any) => {
          for (const { query, params } of queries) {
            const result = await tx.execute(sql.raw(query), params);
            const validatedResults = result.rows.map((row: unknown) => {
              try {
                return schema.parse(row);
              } catch (error) {
                if (error instanceof z.ZodError) {
                  throw createValidationError(
                    "VALIDATION_ERROR" as any,
                    "Database transaction result validation failed",
                    {
                      field: error.issues[0]?.path.join("."),
                      value: error.issues[0]?.input,
                      path: error.issues[0]?.path.map(String),
                      context: { zodErrors: error.issues },
                    }
                  );
                }
                throw error;
              }
            });
            results.push(...validatedResults);
          }
        });

        return success(results);
      } catch (error) {
        if (error && typeof error === "object" && "code" in error) {
          return error(error as ValidationError | BusinessError);
        }
        return error(
          createBusinessError(
            "DATABASE_ERROR" as any,
            "Database transaction execution failed",
            { operation: "executeTransaction", resource: "database" }
          )
        );
      }
    },
  };
};

// =============================================================================
// QUERY PARAMETER VALIDATION
// =============================================================================

/**
 * Validates query parameters for type safety
 */
export const validateQueryParams = (
  params: unknown[]
): Result<unknown[], ValidationError> => {
  try {
    // Basic validation - ensure all parameters are serializable
    const validatedParams = params.map(param => {
      if (param === null || param === undefined) {
        return param;
      }

      // Check for branded types
      if (typeof param === "string") {
        // Validate UUID format for potential branded types
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(param)) {
          return param;
        }
      }

      // Check for other serializable types
      if (
        typeof param === "string" ||
        typeof param === "number" ||
        typeof param === "boolean"
      ) {
        return param;
      }

      // Check for Date objects
      if (param instanceof Date) {
        return param.toISOString();
      }

      // Check for arrays
      if (Array.isArray(param)) {
        return param
          .map(validateQueryParams)
          .map(result => (result.success ? result.data : result));
      }

      // Check for objects
      if (typeof param === "object") {
        try {
          JSON.stringify(param);
          return param;
        } catch {
          throw new Error(`Non-serializable object parameter: ${typeof param}`);
        }
      }

      throw new Error(`Invalid parameter type: ${typeof param}`);
    });

    return success(validatedParams);
  } catch (error) {
    return error(
      createValidationError(
        "INVALID_FORMAT" as any,
        "Query parameter validation failed",
        {
          value: params,
          context: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        }
      )
    );
  }
};

// =============================================================================
// RUNTIME VALIDATION FOR BUSINESS OPERATIONS
// =============================================================================

/**
 * Validates business operations with type safety
 */
export const validateBusinessOperation = <T>(
  operation: string,
  schema: z.ZodSchema<T>,
  data: unknown,
  context: {
    userId?: UserId;
    territoryId?: TerritoryId;
    plantId?: PlantId;
    accountId?: AccountId;
    contactId?: ContactId;
    opportunityId?: OpportunityId;
  }
): Result<T, ValidationError | BusinessError> => {
  try {
    // Validate data
    const validatedData = schema.parse(data);

    // Validate context
    const contextValidation = validateOperationContext(operation, context);
    if (!contextValidation.success) {
      return contextValidation as Result<T, ValidationError | BusinessError>;
    }

    return success(validatedData);
  } catch (parseError) {
    if (parseError instanceof z.ZodError) {
      const validationError = createValidationError(
        "VALIDATION_ERROR" as any,
        "Business operation validation failed",
        {
          field: parseError.issues[0]?.path.join("."),
          value: parseError.issues[0]?.input,
          path: parseError.issues[0]?.path.map(String),
          context: {
            operation,
            zodErrors: parseError.issues,
            userContext: context,
          },
        }
      );
      return error(validationError);
    }

    return error(
      createBusinessError(
        "BUSINESS_RULE_VIOLATION" as any,
        "Business operation validation failed",
        {
          operation,
          resource: "business_operation",
          ...context,
        }
      )
    );
  }
};

/**
 * Validates operation context
 */
export const validateOperationContext = (
  operation: string,
  context: {
    userId?: UserId;
    territoryId?: TerritoryId;
    plantId?: PlantId;
    accountId?: AccountId;
    contactId?: ContactId;
    opportunityId?: OpportunityId;
  }
): Result<void, ValidationError | BusinessError> => {
  try {
    // Validate required context fields based on operation
    switch (operation) {
      case "create_account":
      case "update_account":
      case "delete_account":
        if (!context.userId || !context.territoryId) {
          return error(
            createValidationError(
              "REQUIRED" as any,
              "User ID and Territory ID are required for account operations",
              { field: "context", value: context }
            )
          );
        }
        break;

      case "create_contact":
      case "update_contact":
      case "delete_contact":
        if (!context.userId || !context.accountId) {
          return error(
            createValidationError(
              "REQUIRED" as any,
              "User ID and Account ID are required for contact operations",
              { field: "context", value: context }
            )
          );
        }
        break;

      case "create_opportunity":
      case "update_opportunity":
      case "delete_opportunity":
        if (!context.userId || !context.accountId) {
          return error(
            createValidationError(
              "REQUIRED" as any,
              "User ID and Account ID are required for opportunity operations",
              { field: "context", value: context }
            )
          );
        }
        break;

      case "create_course":
      case "update_course":
      case "delete_course":
        if (!context.userId || !context.plantId) {
          return error(
            createValidationError(
              "REQUIRED" as any,
              "User ID and Plant ID are required for course operations",
              { field: "context", value: context }
            )
          );
        }
        break;

      case "create_enrollment":
      case "update_enrollment":
      case "delete_enrollment":
        if (!context.userId || !context.plantId) {
          return error(
            createValidationError(
              "REQUIRED" as any,
              "User ID and Plant ID are required for enrollment operations",
              { field: "context", value: context }
            )
          );
        }
        break;

      default:
        if (!context.userId) {
          return error(
            createValidationError(
              "REQUIRED" as any,
              "User ID is required for all operations",
              { field: "context", value: context }
            )
          );
        }
    }

    return success(undefined);
  } catch (error) {
    return error(
      createBusinessError(
        "INVALID_CONTEXT" as any,
        "Operation context validation failed",
        { operation, resource: "context" }
      )
    );
  }
};

// =============================================================================
// TYPE-SAFE DATABASE SCHEMA VALIDATION
// =============================================================================

/**
 * Validates database schema compliance
 */
export const validateDatabaseSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Result<T, ValidationError> => {
  try {
    const validatedData = schema.parse(data);
    return success(validatedData);
  } catch (parseError) {
    if (parseError instanceof z.ZodError) {
      const validationError = createValidationError(
        "VALIDATION_ERROR" as any,
        "Database schema validation failed",
        {
          field: parseError.issues[0]?.path.join("."),
          value: parseError.issues[0]?.input,
          path: parseError.issues[0]?.path.map(String),
          context: { zodErrors: parseError.issues },
        }
      );
      return error(validationError);
    }

    return error(
      createValidationError(
        "VALIDATION_ERROR" as any,
        "Database schema validation failed",
        {
          value: data,
          context: {
            error:
              parseError instanceof Error
                ? parseError.message
                : "Unknown error",
          },
        }
      )
    );
  }
};

// =============================================================================
// TYPE-SAFE DATABASE MIGRATION VALIDATION
// =============================================================================

/**
 * Validates database migrations for type safety
 */
export const validateDatabaseMigration = (migration: {
  name: string;
  up: string;
  down: string;
  schema?: z.ZodSchema<any>;
}): Result<void, ValidationError | BusinessError> => {
  try {
    // Validate migration name
    if (!migration.name || typeof migration.name !== "string") {
      return error(
        createValidationError("REQUIRED" as any, "Migration name is required", {
          field: "name",
          value: migration.name,
        })
      );
    }

    // Validate migration SQL
    if (!migration.up || typeof migration.up !== "string") {
      return error(
        createValidationError(
          "REQUIRED" as any,
          "Migration up SQL is required",
          { field: "up", value: migration.up }
        )
      );
    }

    if (!migration.down || typeof migration.down !== "string") {
      return error(
        createValidationError(
          "REQUIRED" as any,
          "Migration down SQL is required",
          { field: "down", value: migration.down }
        )
      );
    }

    // Validate schema if provided
    if (migration.schema) {
      try {
        // Test schema with empty object to ensure it's valid
        migration.schema.parse({});
      } catch (parseError) {
        if (parseError instanceof z.ZodError) {
          return error(
            createValidationError(
              "VALIDATION_ERROR" as any,
              "Migration schema validation failed",
              {
                field: "schema",
                value: migration.schema,
                context: { zodErrors: parseError.issues },
              }
            )
          );
        }
      }
    }

    return success(undefined);
  } catch (error) {
    return error(
      createBusinessError(
        "VALIDATION_ERROR" as any,
        "Migration validation failed",
        { operation: "validate_migration", resource: "migration" }
      )
    );
  }
};

// =============================================================================
// TYPE-SAFE DATABASE CONNECTION VALIDATION
// =============================================================================

/**
 * Validates database connection for type safety
 */
export const validateDatabaseConnection = async (
  db: any
): Promise<Result<void, ValidationError | BusinessError>> => {
  try {
    // Test basic connection
    await db.execute(sql`SELECT 1`);

    // Test transaction support
    await db.transaction(async (tx: any) => {
      await tx.execute(sql`SELECT 1`);
    });

    return success(undefined);
  } catch (error) {
    return error(
      createBusinessError(
        "DATABASE_ERROR" as any,
        "Database connection validation failed",
        { operation: "validate_connection", resource: "database" }
      )
    );
  }
};

// =============================================================================
// TYPE-SAFE DATABASE PERFORMANCE MONITORING
// =============================================================================

/**
 * Monitors database performance with type safety
 */
export const monitorDatabasePerformance = <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<Result<T, ValidationError | BusinessError>> => {
  const start = performance.now();

  return fn()
    .then(result => {
      const end = performance.now();
      const duration = end - start;

      // Log performance metrics
      console.log(
        `Database operation '${operation}' completed in ${duration}ms`
      );

      // Check for performance issues
      if (duration > 1000) {
        console.warn(
          `Slow database operation detected: '${operation}' took ${duration}ms`
        );
      }

      return success(result);
    })
    .catch(error => {
      const end = performance.now();
      const duration = end - start;

      console.error(
        `Database operation '${operation}' failed after ${duration}ms:`,
        error
      );

      return error(
        createBusinessError(
          "DATABASE_ERROR" as any,
          `Database operation '${operation}' failed`,
          { operation, resource: "database" }
        )
      );
    });
};

// =============================================================================
// TYPE-SAFE DATABASE CACHING
// =============================================================================

/**
 * Type-safe database caching system
 */
export class TypedDatabaseCache<T> {
  private cache = new Map<
    string,
    { data: T; timestamp: number; ttl: number }
  >();

  constructor(private defaultTtl: number = 300000) {} // 5 minutes default

  set(key: string, data: T, ttl?: number): void {
    const expirationTime = Date.now() + (ttl || this.defaultTtl);
    this.cache.set(key, { data, timestamp: Date.now(), ttl: expirationTime });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// =============================================================================
// TYPE-SAFE DATABASE UTILITIES
// =============================================================================

/**
 * Type-safe database utility functions
 */
export const databaseUtils = {
  /**
   * Escapes SQL identifiers
   */
  escapeIdentifier: (identifier: string): string => {
    return `"${identifier.replace(/"/g, '""')}"`;
  },

  /**
   * Escapes SQL values
   */
  escapeValue: (value: unknown): string => {
    if (value === null || value === undefined) {
      return "NULL";
    }

    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }

    if (value instanceof Date) {
      return `'${value.toISOString()}'`;
    }

    if (Array.isArray(value)) {
      return `(${value.map(databaseUtils.escapeValue).join(", ")})`;
    }

    if (typeof value === "object") {
      return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
    }

    return "NULL";
  },

  /**
   * Builds type-safe WHERE clauses
   */
  buildWhereClause: (conditions: Record<string, unknown>): string => {
    const clauses = Object.entries(conditions)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${databaseUtils.escapeIdentifier(key)} = ${databaseUtils.escapeValue(value)}`
      );

    return clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  },

  /**
   * Builds type-safe ORDER BY clauses
   */
  buildOrderByClause: (
    orderBy: { field: string; direction: "asc" | "desc" }[]
  ): string => {
    if (orderBy.length === 0) {
      return "";
    }

    const clauses = orderBy.map(
      ({ field, direction }) =>
        `${databaseUtils.escapeIdentifier(field)} ${direction.toUpperCase()}`
    );

    return `ORDER BY ${clauses.join(", ")}`;
  },

  /**
   * Builds type-safe LIMIT clauses
   */
  buildLimitClause: (limit: number, offset?: number): string => {
    if (offset !== undefined) {
      return `LIMIT ${limit} OFFSET ${offset}`;
    }
    return `LIMIT ${limit}`;
  },
};
