import { z } from "zod";
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

// =============================================================================
// RESULT TYPE SYSTEM FOR ERROR HANDLING
// =============================================================================

/**
 * Result types provide type-safe error handling without exceptions,
 * ensuring all errors are handled explicitly and preventing runtime crashes.
 */

// =============================================================================
// CORE RESULT TYPE
// =============================================================================

/**
 * The Result type represents the outcome of an operation that can either
 * succeed with data or fail with an error.
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Type guard to check if a Result is successful
 */
export const isSuccess = <T, E>(
  result: Result<T, E>
): result is { success: true; data: T } => result.success;

/**
 * Type guard to check if a Result is an error
 */
export const isError = <T, E>(
  result: Result<T, E>
): result is { success: false; error: E } => !result.success;

/**
 * Creates a successful Result
 */
export const success = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});

/**
 * Creates an error Result
 */
export const error = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
});

// =============================================================================
// STRICT ERROR TYPES
// =============================================================================

/**
 * Validation error codes for compile-time safety
 */
export const ValidationErrorCode = z
  .enum([
    "REQUIRED",
    "INVALID_FORMAT",
    "TOO_LONG",
    "TOO_SHORT",
    "OUT_OF_RANGE",
    "ACCESS_DENIED",
    "NOT_FOUND",
    "DUPLICATE",
    "INVALID_STATE",
    "COMPLIANCE_VIOLATION",
    "INVALID_UUID",
    "INVALID_EMAIL",
    "INVALID_PHONE",
    "INVALID_DATE",
    "INVALID_URL",
    "INVALID_NUMBER",
    "INVALID_ENUM",
    "INVALID_JSON",
    "INVALID_ARRAY",
    "INVALID_OBJECT",
    "MISSING_FIELD",
    "EXTRA_FIELD",
    "INVALID_LENGTH",
    "INVALID_PATTERN",
    "INVALID_TYPE",
    "INVALID_VALUE",
  ])
  .brand<"ValidationErrorCode">();

export type ValidationErrorCode = z.infer<typeof ValidationErrorCode>;

/**
 * Business error codes for domain-specific operations
 */
export const BusinessErrorCode = z
  .enum([
    "TERRITORY_ACCESS_DENIED",
    "PLANT_ACCESS_DENIED",
    "ROLE_INSUFFICIENT",
    "PERMISSION_DENIED",
    "DATA_NOT_FOUND",
    "OPERATION_NOT_ALLOWED",
    "INVALID_CONTEXT",
    "INVALID_SCOPE",
    "DUPLICATE_ENTITY",
    "CONSTRAINT_VIOLATION",
    "BUSINESS_RULE_VIOLATION",
    "WORKFLOW_VIOLATION",
    "STATE_TRANSITION_INVALID",
    "DEPENDENCY_NOT_MET",
    "QUOTA_EXCEEDED",
    "RATE_LIMIT_EXCEEDED",
    "SERVICE_UNAVAILABLE",
    "TIMEOUT",
    "CONCURRENT_MODIFICATION",
    "OPTIMISTIC_LOCK_FAILED",
  ])
  .brand<"BusinessErrorCode">();

export type BusinessErrorCode = z.infer<typeof BusinessErrorCode>;

/**
 * System error codes for infrastructure issues
 */
export const SystemErrorCode = z
  .enum([
    "DATABASE_ERROR",
    "NETWORK_ERROR",
    "AUTHENTICATION_ERROR",
    "AUTHORIZATION_ERROR",
    "CONFIGURATION_ERROR",
    "SERIALIZATION_ERROR",
    "DESERIALIZATION_ERROR",
    "VALIDATION_ERROR",
    "PARSING_ERROR",
    "ENCRYPTION_ERROR",
    "DECRYPTION_ERROR",
    "FILE_SYSTEM_ERROR",
    "MEMORY_ERROR",
    "CPU_ERROR",
    "DISK_ERROR",
    "INTERNAL_ERROR",
    "UNKNOWN_ERROR",
  ])
  .brand<"SystemErrorCode">();

export type SystemErrorCode = z.infer<typeof SystemErrorCode>;

// =============================================================================
// STRICT ERROR SCHEMAS
// =============================================================================

/**
 * Validation error schema with branded types
 */
export const ValidationErrorSchema = z
  .object({
    code: ValidationErrorCode,
    message: z.string().min(1),
    field: z.string().optional(),
    value: z.unknown().optional(),
    path: z.array(z.string()).optional(),
    context: z.record(z.string(), z.unknown()).optional(),
  })
  .brand<"ValidationError">();

export type ValidationError = z.infer<typeof ValidationErrorSchema>;

/**
 * Business error schema with branded types
 */
export const BusinessErrorSchema = z
  .object({
    code: BusinessErrorCode,
    message: z.string().min(1),
    context: z.object({
      userId: UserIdSchema.optional(),
      territoryId: TerritoryIdSchema.optional(),
      plantId: PlantIdSchema.optional(),
      accountId: AccountIdSchema.optional(),
      contactId: ContactIdSchema.optional(),
      opportunityId: OpportunityIdSchema.optional(),
      operation: z.string(),
      resource: z.string().optional(),
      action: z.string().optional(),
    }),
    details: z.array(ValidationErrorSchema).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .brand<"BusinessError">();

export type BusinessError = z.infer<typeof BusinessErrorSchema>;

/**
 * System error schema with branded types
 */
export const SystemErrorSchema = z
  .object({
    code: SystemErrorCode,
    message: z.string().min(1),
    stack: z.string().optional(),
    timestamp: z.string().datetime(),
    requestId: z.string().optional(),
    userId: UserIdSchema.optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .brand<"SystemError">();

export type SystemError = z.infer<typeof SystemErrorSchema>;

// =============================================================================
// ERROR FACTORY FUNCTIONS
// =============================================================================

/**
 * Creates a validation error with type safety
 */
export const createValidationError = (
  code: ValidationErrorCode,
  message: string,
  options?: {
    field?: string;
    value?: unknown;
    path?: string[];
    context?: Record<string, unknown>;
  }
): ValidationError => {
  return ValidationErrorSchema.parse({
    code,
    message,
    field: options?.field,
    value: options?.value,
    path: options?.path,
    context: options?.context,
  });
};

/**
 * Creates a business error with type safety
 */
export const createBusinessError = (
  code: BusinessErrorCode,
  message: string,
  context: {
    userId?: UserId;
    territoryId?: TerritoryId;
    plantId?: PlantId;
    accountId?: AccountId;
    contactId?: ContactId;
    opportunityId?: OpportunityId;
    operation: string;
    resource?: string;
    action?: string;
  },
  options?: {
    details?: ValidationError[];
    metadata?: Record<string, unknown>;
  }
): BusinessError => {
  return BusinessErrorSchema.parse({
    code,
    message,
    context,
    details: options?.details,
    metadata: options?.metadata,
  });
};

/**
 * Creates a system error with type safety
 */
export const createSystemError = (
  code: SystemErrorCode,
  message: string,
  options?: {
    stack?: string;
    requestId?: string;
    userId?: UserId;
    metadata?: Record<string, unknown>;
  }
): SystemError => {
  return SystemErrorSchema.parse({
    code,
    message,
    stack: options?.stack,
    timestamp: new Date().toISOString(),
    requestId: options?.requestId,
    userId: options?.userId,
    metadata: options?.metadata,
  });
};

// =============================================================================
// RESULT UTILITIES
// =============================================================================

/**
 * Maps a successful Result to a new type
 */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> => {
  if (isSuccess(result)) {
    return success(fn(result.data));
  }
  return result;
};

/**
 * Maps an error Result to a new error type
 */
export const mapError = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> => {
  if (isError(result)) {
    return error(fn(result.error));
  }
  return result;
};

/**
 * Chains Results together
 */
export const chain = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> => {
  if (isSuccess(result)) {
    return fn(result.data);
  }
  return result;
};

/**
 * Unwraps a Result, throwing if it's an error
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isSuccess(result)) {
    return result.data;
  }
  throw result.error;
};

/**
 * Unwraps a Result with a default value for errors
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  if (isSuccess(result)) {
    return result.data;
  }
  return defaultValue;
};

/**
 * Unwraps a Result with a function for errors
 */
export const unwrapOrElse = <T, E>(
  result: Result<T, E>,
  fn: (error: E) => T
): T => {
  if (isSuccess(result)) {
    return result.data;
  }
  return fn(result.error);
};

/**
 * Converts a Promise to a Result
 */
export const fromPromise = async <T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> => {
  try {
    const data = await promise;
    return success(data);
  } catch (error) {
    return error(error as E);
  }
};

/**
 * Converts a function that might throw to a Result
 */
export const fromThrowable = <T, E = Error>(fn: () => T): Result<T, E> => {
  try {
    const data = fn();
    return success(data);
  } catch (error) {
    return error(error as E);
  }
};

/**
 * Converts an async function that might throw to a Result
 */
export const fromAsyncThrowable = async <T, E = Error>(
  fn: () => Promise<T>
): Promise<Result<T, E>> => {
  try {
    const data = await fn();
    return success(data);
  } catch (error) {
    return error(error as E);
  }
};

// =============================================================================
// RESULT COLLECTION UTILITIES
// =============================================================================

/**
 * Combines multiple Results into a single Result
 */
export const combine = <T extends readonly unknown[], E>(results: {
  [K in keyof T]: Result<T[K], E>;
}): Result<T, E> => {
  const data: any[] = [];

  for (const result of results) {
    if (isError(result)) {
      return result;
    }
    data.push(result.data);
  }

  return success(data as unknown as T);
};

/**
 * Combines multiple Results into a single Result with early exit
 */
export const combineWithEarlyExit = <T extends readonly unknown[], E>(results: {
  [K in keyof T]: Result<T[K], E>;
}): Result<T, E> => {
  const data: any[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (isError(result)) {
      return result;
    }
    data.push(result.data);
  }

  return success(data as unknown as T);
};

/**
 * Filters successful Results from an array
 */
export const filterSuccess = <T, E>(results: Result<T, E>[]): T[] => {
  return results.filter(isSuccess).map(result => result.data);
};

/**
 * Filters error Results from an array
 */
export const filterErrors = <T, E>(results: Result<T, E>[]): E[] => {
  return results.filter(isError).map(result => result.error);
};

/**
 * Partitions Results into successes and errors
 */
export const partition = <T, E>(results: Result<T, E>[]): [T[], E[]] => {
  const successes: T[] = [];
  const errors: E[] = [];

  for (const result of results) {
    if (isSuccess(result)) {
      successes.push(result.data);
    } else {
      errors.push(result.error);
    }
  }

  return [successes, errors];
};

// =============================================================================
// RESULT VALIDATION UTILITIES
// =============================================================================

/**
 * Validates a Result using a schema
 */
export const validateResult = <T, E>(
  result: Result<T, E>,
  schema: z.ZodSchema<T>
): Result<T, E | ValidationError> => {
  if (isError(result)) {
    return result;
  }

  try {
    const validated = schema.parse(result.data);
    return success(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = createValidationError(
        "VALIDATION_ERROR" as ValidationErrorCode,
        "Schema validation failed",
        {
          field: error.issues[0]?.path.join("."),
          value: error.issues[0]?.input,
          path: error.issues[0]?.path.map(String),
          context: { zodErrors: error.issues },
        }
      );
      return { success: false, error: validationError };
    }
    return error(error as E);
  }
};

/**
 * Validates a Result using a branded type schema
 */
export const validateBrandedResult = <T, E>(
  result: Result<T, E>,
  schema: z.ZodType<T>
): Result<T, E | ValidationError> => {
  return validateResult(result, schema);
};

// =============================================================================
// RESULT TRANSFORMATION UTILITIES
// =============================================================================

/**
 * Transforms a Result using a schema
 */
export const transformResult = <T, U, E>(
  result: Result<T, E>,
  schema: z.ZodSchema<U>
): Result<U, E | ValidationError> => {
  if (isError(result)) {
    return result;
  }

  try {
    const transformed = schema.parse(result.data);
    return success(transformed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = createValidationError(
        "VALIDATION_ERROR" as ValidationErrorCode,
        "Schema transformation failed",
        {
          field: error.issues[0]?.path.join("."),
          value: error.issues[0]?.input,
          path: error.issues[0]?.path.map(String),
          context: { zodErrors: error.issues },
        }
      );
      return { success: false, error: validationError };
    }
    return error(error as E);
  }
};

/**
 * Transforms a Result using a branded type schema
 */
export const transformBrandedResult = <T, U, E>(
  result: Result<T, E>,
  schema: z.ZodSchema<U>
): Result<U, E | ValidationError> => {
  return transformResult(result, schema);
};

// =============================================================================
// RESULT DEBUGGING UTILITIES
// =============================================================================

/**
 * Logs a Result for debugging purposes
 */
export const logResult = <T, E>(
  result: Result<T, E>,
  label?: string
): Result<T, E> => {
  const prefix = label ? `[${label}]` : "[Result]";

  if (isSuccess(result)) {
    console.log(`${prefix} Success:`, result.data);
  } else {
    console.error(`${prefix} Error:`, result.error);
  }

  return result;
};

/**
 * Logs only successful Results
 */
export const logSuccess = <T, E>(
  result: Result<T, E>,
  label?: string
): Result<T, E> => {
  if (isSuccess(result)) {
    const prefix = label ? `[${label}]` : "[Result]";
    console.log(`${prefix} Success:`, result.data);
  }
  return result;
};

/**
 * Logs only error Results
 */
export const logError = <T, E>(
  result: Result<T, E>,
  label?: string
): Result<T, E> => {
  if (isError(result)) {
    const prefix = label ? `[${label}]` : "[Result]";
    console.error(`${prefix} Error:`, result.error);
  }
  return result;
};

// =============================================================================
// RESULT PERFORMANCE UTILITIES
// =============================================================================

/**
 * Measures the execution time of a Result operation
 */
export const measureResult = <T, E>(
  result: Result<T, E>,
  label?: string
): Result<T, E> => {
  const prefix = label ? `[${label}]` : "[Result]";
  const start = performance.now();

  if (isSuccess(result)) {
    const end = performance.now();
    console.log(`${prefix} Success in ${end - start}ms`);
  } else {
    const end = performance.now();
    console.error(`${prefix} Error in ${end - start}ms`);
  }

  return result;
};

/**
 * Creates a Result with performance measurement
 */
export const withPerformanceMeasurement = <T, E>(
  fn: () => Result<T, E>,
  label?: string
): Result<T, E> => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  const prefix = label ? `[${label}]` : "[Result]";
  const duration = end - start;

  if (isSuccess(result)) {
    console.log(`${prefix} Success in ${duration}ms`);
  } else {
    console.error(`${prefix} Error in ${duration}ms`);
  }

  return result;
};
