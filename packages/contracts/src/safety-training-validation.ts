// =============================================================================
// SAFETY TRAINING API VALIDATION MIDDLEWARE
// =============================================================================

/**
 * Comprehensive validation middleware for Safety Training API contracts
 * with plant-scoped access control and role-based permissions.
 */

import { z } from "zod";

// Generic request/response interfaces to replace Next.js specific types
interface GenericRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  json(): Promise<unknown>;
  nextUrl: {
    pathname: string;
    searchParams: URLSearchParams;
  };
}

interface GenericResponse {
  json(data: unknown, options?: { status?: number }): Response;
}
import {
  SafetyTrainingApiEndpoints,
  SafetyTrainingEndpointNames,
  EndpointParams,
  EndpointQuery,
  EndpointBody,
  EndpointResponse,
} from "./safety-training-endpoints";
import {
  SafetyTrainingErrorResponseSchema,
  SafetyTrainingErrorCode,
} from "./safety-training-contracts";

// =============================================================================
// VALIDATION MIDDLEWARE TYPES
// =============================================================================

/**
 * Validation context for Safety Training API
 */
export interface SafetyTrainingValidationContext {
  userId: string;
  plantId?: string;
  permissions: string[];
  adminRoles: string[];
  requestId: string;
  timestamp: string;
}

/**
 * Validation result for API requests
 */
export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
  context: SafetyTrainingValidationContext;
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

/**
 * Middleware configuration
 */
export interface SafetyTrainingMiddlewareConfig {
  enableLogging?: boolean;
  enableMetrics?: boolean;
  strictMode?: boolean;
  customValidators?: Record<string, (value: unknown) => boolean>;
}

// =============================================================================
// VALIDATION MIDDLEWARE CLASS
// =============================================================================

/**
 * Safety Training API validation middleware
 */
export class SafetyTrainingValidationMiddleware {
  private config: SafetyTrainingMiddlewareConfig;

  constructor(config: SafetyTrainingMiddlewareConfig = {}) {
    this.config = {
      enableLogging: true,
      enableMetrics: false,
      strictMode: true,
      customValidators: {},
      ...config,
    };
  }

  /**
   * Validate API request parameters
   */
  async validateRequest<T extends SafetyTrainingEndpointNames>(
    endpoint: T,
    request: GenericRequest,
    context: Partial<SafetyTrainingValidationContext>
  ): Promise<
    ValidationResult<{
      params: EndpointParams<T>;
      query: EndpointQuery<T>;
      body: EndpointBody<T>;
    }>
  > {
    const requestId = this.generateRequestId();
    const timestamp = new Date().toISOString();

    const validationContext: SafetyTrainingValidationContext = {
      userId: context.userId || "",
      plantId: context.plantId,
      permissions: context.permissions || [],
      adminRoles: context.adminRoles || [],
      requestId,
      timestamp,
    };

    const errors: ValidationError[] = [];

    try {
      // Validate endpoint exists
      const endpointConfig = SafetyTrainingApiEndpoints[endpoint];
      if (!endpointConfig) {
        errors.push({
          field: "endpoint",
          message: `Unknown endpoint: ${endpoint}`,
          code: "UNKNOWN_ENDPOINT",
        });
        return { success: false, errors, context: validationContext };
      }

      // Extract and validate path parameters
      const params = this.extractPathParams(request, endpointConfig);
      if ("params" in endpointConfig && endpointConfig.params) {
        const paramResult = this.validateSchema(
          params,
          endpointConfig.params as z.ZodType<unknown>
        );
        if (!paramResult.success) {
          errors.push(...paramResult.errors);
        }
      }

      // Extract and validate query parameters
      const query = this.extractQueryParams(request);
      if ("query" in endpointConfig && endpointConfig.query) {
        const queryResult = this.validateSchema(
          query,
          endpointConfig.query as z.ZodType<unknown>
        );
        if (!queryResult.success) {
          errors.push(...queryResult.errors);
        }
      }

      // Extract and validate request body
      let body: unknown;
      if (
        "body" in endpointConfig &&
        endpointConfig.body &&
        ["POST", "PUT", "PATCH"].includes(endpointConfig.method)
      ) {
        try {
          body = await request.json();
        } catch (error) {
          // Log the actual error for debugging but don't expose it to client
          console.error("JSON parsing error:", error);
          errors.push({
            field: "body",
            message: "Invalid JSON in request body",
            code: "INVALID_JSON",
          });
        }

        if (body !== undefined) {
          const bodyResult = this.validateSchema(
            body,
            endpointConfig.body as z.ZodType<unknown>
          );
          if (!bodyResult.success) {
            errors.push(...bodyResult.errors);
          }
        }
      }

      // Validate plant access
      if (
        "params" in endpointConfig &&
        endpointConfig.params &&
        "plantId" in endpointConfig.params.shape &&
        validationContext.plantId
      ) {
        const plantAccessResult = this.validatePlantAccess(
          validationContext,
          validationContext.plantId
        );
        if (!plantAccessResult.success) {
          errors.push(...plantAccessResult.errors);
        }
      }

      // Validate permissions
      const permissionResult = this.validatePermissions(validationContext, [
        ...(endpointConfig.permissions || []),
      ]);
      if (!permissionResult.success) {
        errors.push(...permissionResult.errors);
      }

      if (errors.length > 0) {
        return { success: false, errors, context: validationContext };
      }

      return {
        success: true,
        data: {
          params: params as EndpointParams<T>,
          query: query as EndpointQuery<T>,
          body: body as EndpointBody<T>,
        },
        errors: [],
        context: validationContext,
      };
    } catch (error) {
      this.logError("Validation error", error, validationContext);

      errors.push({
        field: "validation",
        message: "Internal validation error",
        code: "INTERNAL_ERROR",
      });

      return { success: false, errors, context: validationContext };
    }
  }

  /**
   * Validate API response
   */
  validateResponse<T extends SafetyTrainingEndpointNames>(
    endpoint: T,
    response: unknown,
    context: SafetyTrainingValidationContext
  ): ValidationResult<EndpointResponse<T>> {
    const errors: ValidationError[] = [];

    try {
      const endpointConfig = SafetyTrainingApiEndpoints[endpoint];
      if (!endpointConfig) {
        errors.push({
          field: "endpoint",
          message: `Unknown endpoint: ${endpoint}`,
          code: "UNKNOWN_ENDPOINT",
        });
        return { success: false, errors, context };
      }

      const responseResult = this.validateSchema(
        response,
        endpointConfig.response as z.ZodType<unknown>
      );
      if (!responseResult.success) {
        errors.push(...responseResult.errors);
      }

      if (errors.length > 0) {
        return { success: false, errors, context };
      }

      return {
        success: true,
        data: response as EndpointResponse<T>,
        errors: [],
        context,
      };
    } catch (error) {
      this.logError("Response validation error", error, context);

      errors.push({
        field: "response",
        message: "Internal response validation error",
        code: "INTERNAL_ERROR",
      });

      return { success: false, errors, context };
    }
  }

  /**
   * Create error response
   */
  createErrorResponse(
    code: SafetyTrainingErrorCode,
    message: string,
    details: ValidationError[] = [],
    context: SafetyTrainingValidationContext
  ): GenericResponse {
    const errorResponse = SafetyTrainingErrorResponseSchema.parse({
      success: false,
      error: {
        code,
        message,
        details: details.map(d => ({
          field: d.field,
          message: d.message,
          code: d.code,
        })),
        requestId: context.requestId,
        timestamp: context.timestamp,
        plantId: context.plantId,
        userId: context.userId,
      },
      version: "1.0",
    });

    // Return the parsed error response
    return {
      json: (data: unknown, options?: { status?: number }) => {
        return new Response(JSON.stringify(data || errorResponse), {
          status: options?.status || this.getHttpStatus(code),
          headers: { "Content-Type": "application/json" },
        });
      },
    };
  }

  /**
   * Create success response
   */
  createSuccessResponse<T>(
    data: T,
    context: SafetyTrainingValidationContext,
    metadata?: { pagination?: unknown }
  ): GenericResponse {
    const successResponse = {
      success: true,
      data,
      version: "1.0" as const,
      metadata: {
        timestamp: context.timestamp,
        requestId: context.requestId,
        ...metadata,
      },
    };

    // Return the success response
    return {
      json: (data: unknown, options?: { status?: number }) => {
        return new Response(JSON.stringify(data || successResponse), {
          status: options?.status || 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    };
  }

  // =============================================================================
  // PRIVATE VALIDATION METHODS
  // =============================================================================

  /**
   * Validate schema against data
   */
  private validateSchema<T>(
    data: unknown,
    schema: z.ZodType<T>
  ): { success: boolean; data?: T; errors: ValidationError[] } {
    try {
      const result = schema.safeParse(data);

      if (result.success) {
        return { success: true, data: result.data, errors: [] };
      }

      const errors: ValidationError[] = result.error.issues.map(
        (error: z.ZodIssue) => ({
          field: error.path.join("."),
          message: error.message,
          code: error.code,
          value: error.input,
        })
      );

      return { success: false, errors };
    } catch (error: unknown) {
      // Log the actual error for debugging
      console.error("Schema validation error:", error);
      return {
        success: false,
        errors: [
          {
            field: "schema",
            message: "Schema validation failed",
            code: "SCHEMA_ERROR",
          },
        ],
      };
    }
  }

  /**
   * Extract path parameters from request
   */
  private extractPathParams(
    request: GenericRequest,
    endpointConfig: { path: string }
  ): Record<string, unknown> {
    const params: Record<string, unknown> = {};

    // Extract from URL path segments
    const pathSegments = request.nextUrl.pathname.split("/");
    const endpointSegments = endpointConfig.path.split("/");

    endpointSegments.forEach((segment: string, index: number) => {
      if (segment.startsWith(":")) {
        const paramName = segment.slice(1);
        params[paramName] = pathSegments[index];
      }
    });

    return params;
  }

  /**
   * Extract query parameters from request
   */
  private extractQueryParams(request: GenericRequest): Record<string, unknown> {
    const params: Record<string, unknown> = {};

    request.nextUrl.searchParams.forEach((value, key) => {
      // Try to parse as number if it looks like one
      if (!isNaN(Number(value)) && value.trim() !== "") {
        params[key] = Number(value);
      }
      // Try to parse as boolean
      else if (value === "true" || value === "false") {
        params[key] = value === "true";
      }
      // Keep as string
      else {
        params[key] = value;
      }
    });

    return params;
  }

  /**
   * Validate plant access
   */
  private validatePlantAccess(
    context: SafetyTrainingValidationContext,
    plantId: string
  ): { success: boolean; errors: ValidationError[] } {
    const errors: ValidationError[] = [];

    // Check if user has access to the plant
    if (!context.permissions.includes(`plants:${plantId}:read`)) {
      errors.push({
        field: "plantId",
        message: "Access denied to plant",
        code: "PLANT_ACCESS_DENIED",
        value: plantId,
      });
    }

    return { success: errors.length === 0, errors };
  }

  /**
   * Validate user permissions
   */
  private validatePermissions(
    context: SafetyTrainingValidationContext,
    requiredPermissions: string[]
  ): { success: boolean; errors: ValidationError[] } {
    const errors: ValidationError[] = [];

    for (const permission of requiredPermissions) {
      if (!context.permissions.includes(permission)) {
        errors.push({
          field: "permissions",
          message: `Missing required permission: ${permission}`,
          code: "AUTHORIZATION_ERROR",
          value: permission,
        });
      }
    }

    return { success: errors.length === 0, errors };
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get HTTP status code for error
   */
  private getHttpStatus(code: SafetyTrainingErrorCode): number {
    const statusMap: Record<SafetyTrainingErrorCode, number> = {
      PLANT_NOT_FOUND: 404,
      PLANT_ACCESS_DENIED: 403,
      COURSE_NOT_FOUND: 404,
      COURSE_ACCESS_DENIED: 403,
      ENROLLMENT_NOT_FOUND: 404,
      ENROLLMENT_ALREADY_EXISTS: 409,
      ENROLLMENT_EXPIRED: 410,
      PROGRESS_NOT_FOUND: 404,
      PROGRESS_ACCESS_DENIED: 403,
      ACTIVITY_EVENT_NOT_FOUND: 404,
      QUESTION_EVENT_NOT_FOUND: 404,
      ADMIN_ROLE_NOT_FOUND: 404,
      ADMIN_ROLE_ACCESS_DENIED: 403,
      USER_NOT_AUTHORIZED: 401,
      PLANT_MISMATCH: 400,
      INVALID_PROGRESS_UPDATE: 400,
      COURSE_COMPLETION_FAILED: 400,
      CERTIFICATE_GENERATION_FAILED: 500,
      VALIDATION_ERROR: 400,
      BUSINESS_ERROR: 400,
      SYSTEM_ERROR: 500,
    };

    return statusMap[code] || 500;
  }

  /**
   * Log error with context
   */
  private logError(
    message: string,
    error: unknown,
    context: SafetyTrainingValidationContext
  ): void {
    if (this.config.enableLogging) {
      console.error(`[${context.requestId}] ${message}:`, {
        error: error instanceof Error ? error.message : error,
        context: {
          userId: context.userId,
          plantId: context.plantId,
          timestamp: context.timestamp,
        },
      });
    }
  }
}

// =============================================================================
// VALIDATION MIDDLEWARE FACTORY
// =============================================================================

/**
 * Create validation middleware instance
 */
export const createSafetyTrainingValidationMiddleware = (
  config?: SafetyTrainingMiddlewareConfig
): SafetyTrainingValidationMiddleware => {
  return new SafetyTrainingValidationMiddleware(config);
};

/**
 * Default validation middleware instance
 */
export const safetyTrainingValidation =
  createSafetyTrainingValidationMiddleware();

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate plant ID format
 */
export const validatePlantId = (plantId: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(plantId);
};

/**
 * Validate user ID format
 */
export const validateUserId = (userId: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
};

/**
 * Validate course ID format
 */
export const validateCourseId = (courseId: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(courseId);
};

/**
 * Validate enrollment ID format
 */
export const validateEnrollmentId = (enrollmentId: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(enrollmentId);
};

/**
 * Validate progress percentage
 */
export const validateProgressPercent = (percent: number): boolean => {
  return Number.isFinite(percent) && percent >= 0 && percent <= 100;
};

/**
 * Validate duration in minutes
 */
export const validateDuration = (duration: number): boolean => {
  return Number.isInteger(duration) && duration > 0 && duration <= 1440; // Max 24 hours
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate datetime format
 */
export const validateDateTime = (dateTime: string): boolean => {
  const date = new Date(dateTime);
  return !isNaN(date.getTime());
};

/**
 * Validate pagination parameters
 */
export const validatePagination = (page: number, limit: number): boolean => {
  return (
    Number.isInteger(page) &&
    page >= 1 &&
    Number.isInteger(limit) &&
    limit >= 1 &&
    limit <= 100
  );
};

/**
 * Validate sort order
 */
export const validateSortOrder = (sortOrder: string): boolean => {
  return ["asc", "desc"].includes(sortOrder.toLowerCase());
};

/**
 * Validate course type
 */
export const validateCourseType = (courseType: string): boolean => {
  const validTypes = [
    "safety_orientation",
    "hazard_communication",
    "emergency_response",
    "equipment_operation",
    "compliance_training",
    "certification",
    "refresher",
    "custom",
  ];
  return validTypes.includes(courseType);
};

/**
 * Validate enrollment status
 */
export const validateEnrollmentStatus = (status: string): boolean => {
  const validStatuses = [
    "enrolled",
    "in_progress",
    "completed",
    "failed",
    "expired",
    "cancelled",
  ];
  return validStatuses.includes(status);
};

/**
 * Validate progress status
 */
export const validateProgressStatus = (status: string): boolean => {
  const validStatuses = [
    "not_started",
    "in_progress",
    "completed",
    "paused",
    "failed",
  ];
  return validStatuses.includes(status);
};

/**
 * Validate admin role type
 */
export const validateAdminRoleType = (roleType: string): boolean => {
  const validTypes = [
    "plant_admin",
    "course_admin",
    "instructor",
    "supervisor",
    "compliance_officer",
  ];
  return validTypes.includes(roleType);
};
