// =============================================================================
// SAFETY TRAINING OPENAPI SPECIFICATIONS
// =============================================================================

/**
 * Comprehensive OpenAPI specifications for Safety Training API endpoints
 * with plant-scoped access, role-based permissions, and auth integration.
 */

import { z } from "zod";

// =============================================================================
// OPENAPI SCHEMA GENERATORS
// =============================================================================

/**
 * OpenAPI schema definition for complex schemas
 */
export interface OpenApiSchema {
  type: string;
  format?: string;
  description?: string;
  properties?: Record<string, OpenApiSchema>;
  items?: OpenApiSchema;
  required?: string[];
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  enum?: string[];
  pattern?: string;
  additionalProperties?: boolean;
}

/**
 * Zod check type definition
 */
export interface ZodCheck {
  kind: string;
  value?: unknown;
  message?: string;
}

/**
 * OpenAPI specification structure for full API
 */
export interface OpenApiSpecification {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, Record<string, unknown>>;
  components: {
    securitySchemes: Record<string, unknown>;
    schemas: Record<string, OpenApiSchema>;
  };
  security: Array<Record<string, unknown[]>>;
}

/**
 * Convert Zod schema to OpenAPI schema
 */
export const zodToOpenApi = (schema: z.ZodTypeAny): OpenApiSchema => {
  if (schema instanceof z.ZodString) {
    const result: OpenApiSchema = { type: "string" };
    if (schema._def.checks) {
      schema._def.checks.forEach((check: ZodCheck) => {
        switch (check.kind) {
          case "min":
            result.minLength = check.value;
            break;
          case "max":
            result.maxLength = check.value;
            break;
          case "email":
            result.format = "email";
            break;
          case "url":
            result.format = "url";
            break;
          case "datetime":
            result.format = "date-time";
            break;
          case "uuid":
            result.format = "uuid";
            break;
        }
      });
    }
    return result;
  }

  if (schema instanceof z.ZodNumber) {
    const result: OpenApiSchema = { type: "number" };
    if (schema._def.checks) {
      schema._def.checks.forEach((check: ZodCheck) => {
        switch (check.kind) {
          case "min":
            result.minimum = check.value;
            break;
          case "max":
            result.maximum = check.value;
            break;
          case "int":
            result.type = "integer";
            break;
        }
      });
    }
    return result;
  }

  if (schema instanceof z.ZodBoolean) {
    return { type: "boolean" };
  }

  if (schema instanceof z.ZodArray) {
    return {
      type: "array",
      items: zodToOpenApi(schema._def.type),
    };
  }

  if (schema instanceof z.ZodObject) {
    const properties: Record<string, OpenApiSchema> = {};
    const required: string[] = [];

    Object.entries(schema._def.shape).forEach(([key, value]) => {
      properties[key] = zodToOpenApi(value as z.ZodTypeAny);
      if (!(value as z.ZodTypeAny).isOptional()) {
        required.push(key);
      }
    });

    return {
      type: "object",
      properties,
      required: required.length > 0 ? required : undefined,
      additionalProperties: false,
    };
  }

  if (schema instanceof z.ZodEnum) {
    return {
      type: "string",
      enum: Object.values(schema._def.values),
    };
  }

  if (schema instanceof z.ZodLiteral) {
    return { const: schema._def.value };
  }

  if (schema instanceof z.ZodUnion) {
    return {
      oneOf: schema._def.options.map((option: z.ZodTypeAny) =>
        zodToOpenApi(option)
      ),
    };
  }

  if (schema instanceof z.ZodOptional) {
    return zodToOpenApi(schema._def.innerType);
  }

  if (schema instanceof z.ZodDefault) {
    const baseSchema = zodToOpenApi(schema._def.innerType);
    return {
      ...baseSchema,
      default: schema._def.defaultValue,
    };
  }

  if (schema instanceof z.ZodRecord) {
    return {
      type: "object",
      additionalProperties: zodToOpenApi(schema._def.valueType),
    };
  }

  return { type: "object" };
};

// =============================================================================
// OPENAPI SPECIFICATION
// =============================================================================

/**
 * Complete OpenAPI specification for Safety Training API
 */
export const SafetyTrainingOpenApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Safety Training API",
    description: `
      Comprehensive Safety Training API with plant-scoped data access,
      role-based permissions, and integration with existing auth endpoints.
      
      ## Key Features
      - **Plant-scoped Multi-tenancy**: All operations are scoped to specific plants
      - **Role-based Access Control**: Granular permissions for different user roles
      - **Auth Integration**: Seamless integration with existing authentication system
      - **Comprehensive Tracking**: Course progress, activity events, and question responses
      - **Bulk Operations**: Efficient bulk enrollment and management operations
      - **File Upload**: Course material and document management
      
      ## Authentication
      All endpoints require authentication via the existing auth system.
      Include the access token in the Authorization header:
      \`Authorization: Bearer <access_token>\`
      
      ## Plant Scoping
      All Safety Training operations are scoped to specific plants.
      Users can only access data for plants they have permissions for.
      
      ## Error Handling
      All endpoints return consistent error responses with specific error codes
      for different failure scenarios.
    `,
    version: "1.0.0",
    contact: {
      name: "Safety Training API Support",
      email: "support@safety-training.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "https://api.safety-training.com",
      description: "Production server",
    },
    {
      url: "https://staging-api.safety-training.com",
      description: "Staging server",
    },
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token from the authentication system",
      },
    },
    schemas: {
      // Error schemas
      Error: {
        type: "object",
        required: ["success", "error", "version"],
        properties: {
          success: { type: "boolean", const: false },
          error: {
            type: "object",
            required: ["code", "message", "timestamp"],
            properties: {
              code: {
                type: "string",
                enum: [
                  "PLANT_NOT_FOUND",
                  "PLANT_ACCESS_DENIED",
                  "COURSE_NOT_FOUND",
                  "COURSE_ACCESS_DENIED",
                  "ENROLLMENT_NOT_FOUND",
                  "ENROLLMENT_ALREADY_EXISTS",
                  "ENROLLMENT_EXPIRED",
                  "PROGRESS_NOT_FOUND",
                  "PROGRESS_ACCESS_DENIED",
                  "ACTIVITY_EVENT_NOT_FOUND",
                  "QUESTION_EVENT_NOT_FOUND",
                  "ADMIN_ROLE_NOT_FOUND",
                  "ADMIN_ROLE_ACCESS_DENIED",
                  "USER_NOT_AUTHORIZED",
                  "PLANT_MISMATCH",
                  "INVALID_PROGRESS_UPDATE",
                  "COURSE_COMPLETION_FAILED",
                  "CERTIFICATE_GENERATION_FAILED",
                  "VALIDATION_ERROR",
                  "BUSINESS_ERROR",
                  "SYSTEM_ERROR",
                ],
              },
              message: { type: "string" },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string" },
                    message: { type: "string" },
                    code: { type: "string" },
                  },
                },
              },
              requestId: { type: "string" },
              timestamp: { type: "string", format: "date-time" },
              path: { type: "string" },
              method: { type: "string" },
              plantId: { type: "string", format: "uuid" },
              userId: { type: "string", format: "uuid" },
            },
          },
          version: { type: "string", const: "1.0" },
        },
      },

      // Plant schemas
      Plant: {
        type: "object",
        required: ["id", "name", "isActive", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", minLength: 1, maxLength: 100 },
          code: { type: "string", minLength: 1, maxLength: 20 },
          description: { type: "string", maxLength: 500 },
          location: { type: "string", maxLength: 200 },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        additionalProperties: false,
      },

      CreatePlantRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100 },
          code: { type: "string", minLength: 1, maxLength: 20 },
          description: { type: "string", maxLength: 500 },
          location: { type: "string", maxLength: 200 },
        },
        additionalProperties: false,
      },

      UpdatePlantRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100 },
          code: { type: "string", minLength: 1, maxLength: 20 },
          description: { type: "string", maxLength: 500 },
          location: { type: "string", maxLength: 200 },
        },
        additionalProperties: false,
      },

      PlantResponse: {
        type: "object",
        required: ["success", "data", "version"],
        properties: {
          success: { type: "boolean", const: true },
          data: { $ref: "#/components/schemas/Plant" },
          version: { type: "string", const: "1.0" },
          metadata: {
            type: "object",
            properties: {
              timestamp: { type: "string", format: "date-time" },
              requestId: { type: "string" },
            },
          },
        },
        additionalProperties: false,
      },

      PaginatedPlantResponse: {
        type: "object",
        required: ["success", "data", "pagination", "version"],
        properties: {
          success: { type: "boolean", const: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Plant" },
          },
          pagination: {
            type: "object",
            required: [
              "page",
              "limit",
              "total",
              "totalPages",
              "hasNext",
              "hasPrev",
            ],
            properties: {
              page: { type: "integer", minimum: 1 },
              limit: { type: "integer", minimum: 1, maximum: 100 },
              total: { type: "integer", minimum: 0 },
              totalPages: { type: "integer", minimum: 0 },
              hasNext: { type: "boolean" },
              hasPrev: { type: "boolean" },
            },
          },
          version: { type: "string", const: "1.0" },
          metadata: {
            type: "object",
            properties: {
              timestamp: { type: "string", format: "date-time" },
              requestId: { type: "string" },
            },
          },
        },
        additionalProperties: false,
      },

      // Course schemas
      Course: {
        type: "object",
        required: [
          "id",
          "plantId",
          "name",
          "type",
          "status",
          "duration",
          "isActive",
          "createdAt",
          "updatedAt",
          "createdBy",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          plantId: { type: "string", format: "uuid" },
          name: { type: "string", minLength: 1, maxLength: 200 },
          description: { type: "string", maxLength: 2000 },
          type: {
            type: "string",
            enum: [
              "safety_orientation",
              "hazard_communication",
              "emergency_response",
              "equipment_operation",
              "compliance_training",
              "certification",
              "refresher",
              "custom",
            ],
          },
          status: {
            type: "string",
            enum: ["draft", "active", "inactive", "archived"],
          },
          duration: { type: "integer", minimum: 1 },
          prerequisites: {
            type: "array",
            items: { type: "string", format: "uuid" },
          },
          learningObjectives: {
            type: "array",
            items: { type: "string" },
          },
          materials: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["video", "document", "quiz", "interactive", "other"],
                },
                url: { type: "string", format: "uri" },
                title: { type: "string" },
                description: { type: "string" },
              },
            },
          },
          passingScore: { type: "number", minimum: 0, maximum: 100 },
          certificateValidDays: { type: "integer", minimum: 1 },
          isRequired: { type: "boolean" },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          createdBy: { type: "string", format: "uuid" },
        },
        additionalProperties: false,
      },

      CreateCourseRequest: {
        type: "object",
        required: ["plantId", "name", "type", "duration"],
        properties: {
          plantId: { type: "string", format: "uuid" },
          name: { type: "string", minLength: 1, maxLength: 200 },
          description: { type: "string", maxLength: 2000 },
          type: {
            type: "string",
            enum: [
              "safety_orientation",
              "hazard_communication",
              "emergency_response",
              "equipment_operation",
              "compliance_training",
              "certification",
              "refresher",
              "custom",
            ],
          },
          duration: { type: "integer", minimum: 1 },
          prerequisites: {
            type: "array",
            items: { type: "string", format: "uuid" },
          },
          learningObjectives: {
            type: "array",
            items: { type: "string" },
          },
          materials: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["video", "document", "quiz", "interactive", "other"],
                },
                url: { type: "string", format: "uri" },
                title: { type: "string" },
                description: { type: "string" },
              },
            },
          },
          passingScore: { type: "number", minimum: 0, maximum: 100 },
          certificateValidDays: { type: "integer", minimum: 1 },
          isRequired: { type: "boolean" },
        },
        additionalProperties: false,
      },

      // Enrollment schemas
      Enrollment: {
        type: "object",
        required: [
          "id",
          "courseId",
          "plantId",
          "userId",
          "status",
          "enrolledAt",
          "isActive",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          courseId: { type: "string", format: "uuid" },
          plantId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          status: {
            type: "string",
            enum: [
              "enrolled",
              "in_progress",
              "completed",
              "failed",
              "expired",
              "cancelled",
            ],
          },
          enrolledAt: { type: "string", format: "date-time" },
          startedAt: { type: "string", format: "date-time" },
          completedAt: { type: "string", format: "date-time" },
          expiresAt: { type: "string", format: "date-time" },
          assignedBy: { type: "string", format: "uuid" },
          notes: { type: "string", maxLength: 1000 },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        additionalProperties: false,
      },

      CreateEnrollmentRequest: {
        type: "object",
        required: ["courseId", "plantId", "userId"],
        properties: {
          courseId: { type: "string", format: "uuid" },
          plantId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          expiresAt: { type: "string", format: "date-time" },
          assignedBy: { type: "string", format: "uuid" },
          notes: { type: "string", maxLength: 1000 },
        },
        additionalProperties: false,
      },

      BulkEnrollmentRequest: {
        type: "object",
        required: ["plantId", "courseId", "userIds"],
        properties: {
          plantId: { type: "string", format: "uuid" },
          courseId: { type: "string", format: "uuid" },
          userIds: {
            type: "array",
            items: { type: "string", format: "uuid" },
            minItems: 1,
            maxItems: 100,
          },
          expiresAt: { type: "string", format: "date-time" },
          assignedBy: { type: "string", format: "uuid" },
          notes: { type: "string", maxLength: 1000 },
        },
        additionalProperties: false,
      },

      BulkEnrollmentResponse: {
        type: "object",
        required: ["success", "data", "version"],
        properties: {
          success: { type: "boolean", const: true },
          data: {
            type: "object",
            required: [
              "created",
              "failed",
              "total",
              "successCount",
              "failureCount",
            ],
            properties: {
              created: {
                type: "array",
                items: { $ref: "#/components/schemas/Enrollment" },
              },
              failed: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    userId: { type: "string", format: "uuid" },
                    error: { type: "string" },
                  },
                },
              },
              total: { type: "integer" },
              successCount: { type: "integer" },
              failureCount: { type: "integer" },
            },
          },
          version: { type: "string", const: "1.0" },
          metadata: {
            type: "object",
            properties: {
              timestamp: { type: "string", format: "date-time" },
              requestId: { type: "string" },
            },
          },
        },
        additionalProperties: false,
      },

      // Progress schemas
      Progress: {
        type: "object",
        required: [
          "id",
          "enrollmentId",
          "courseId",
          "plantId",
          "userId",
          "status",
          "progressPercent",
          "timeSpent",
          "isActive",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          enrollmentId: { type: "string", format: "uuid" },
          courseId: { type: "string", format: "uuid" },
          plantId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          status: {
            type: "string",
            enum: [
              "not_started",
              "in_progress",
              "completed",
              "paused",
              "failed",
            ],
          },
          progressPercent: { type: "number", minimum: 0, maximum: 100 },
          currentSection: { type: "string" },
          timeSpent: { type: "integer", minimum: 0 },
          lastAccessedAt: { type: "string", format: "date-time" },
          completedSections: {
            type: "array",
            items: { type: "string" },
          },
          quizScores: {
            type: "array",
            items: {
              type: "object",
              properties: {
                sectionKey: { type: "string" },
                score: { type: "number", minimum: 0, maximum: 100 },
                attempts: { type: "integer", minimum: 1 },
                completedAt: { type: "string", format: "date-time" },
              },
            },
          },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        additionalProperties: false,
      },

      // Activity Event schemas
      ActivityEvent: {
        type: "object",
        required: [
          "id",
          "enrollmentId",
          "courseId",
          "plantId",
          "userId",
          "eventType",
          "occurredAt",
          "createdAt",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          enrollmentId: { type: "string", format: "uuid" },
          courseId: { type: "string", format: "uuid" },
          plantId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          eventType: {
            type: "string",
            enum: [
              "course_started",
              "course_completed",
              "section_started",
              "section_completed",
              "quiz_started",
              "quiz_completed",
              "video_watched",
              "document_viewed",
              "certificate_earned",
              "enrollment_created",
              "enrollment_cancelled",
            ],
          },
          sectionKey: { type: "string" },
          meta: { type: "object" },
          occurredAt: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
        },
        additionalProperties: false,
      },

      // Admin Role schemas
      AdminRole: {
        type: "object",
        required: [
          "id",
          "plantId",
          "userId",
          "roleType",
          "permissions",
          "isActive",
          "assignedAt",
          "assignedBy",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          plantId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          roleType: {
            type: "string",
            enum: [
              "plant_admin",
              "course_admin",
              "instructor",
              "supervisor",
              "compliance_officer",
            ],
          },
          permissions: {
            type: "array",
            items: { type: "string" },
          },
          isActive: { type: "boolean" },
          assignedAt: { type: "string", format: "date-time" },
          assignedBy: { type: "string", format: "uuid" },
          expiresAt: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        additionalProperties: false,
      },

      // Integration schemas
      SafetyTrainingUserContext: {
        type: "object",
        required: ["user", "plantAccess", "session"],
        properties: {
          user: {
            type: "object",
            required: [
              "id",
              "authUserId",
              "email",
              "firstName",
              "lastName",
              "role",
            ],
            properties: {
              id: { type: "string", format: "uuid" },
              authUserId: { type: "string", format: "uuid" },
              email: { type: "string", format: "email" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              role: { type: "string" },
              territoryId: { type: "string", format: "uuid" },
            },
          },
          plantAccess: {
            type: "array",
            items: {
              type: "object",
              required: ["plantId", "plantName", "permissions", "adminRoles"],
              properties: {
                plantId: { type: "string", format: "uuid" },
                plantName: { type: "string" },
                permissions: {
                  type: "array",
                  items: { type: "string" },
                },
                adminRoles: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "plant_admin",
                      "course_admin",
                      "instructor",
                      "supervisor",
                      "compliance_officer",
                    ],
                  },
                },
              },
            },
          },
          session: {
            type: "object",
            required: ["accessToken", "refreshToken", "expiresAt"],
            properties: {
              accessToken: { type: "string" },
              refreshToken: { type: "string" },
              expiresAt: { type: "string", format: "date-time" },
            },
          },
        },
        additionalProperties: false,
      },

      PlantUserPermissions: {
        type: "object",
        required: [
          "userId",
          "plantId",
          "canViewCourses",
          "canCreateCourses",
          "canEditCourses",
          "canDeleteCourses",
          "canViewEnrollments",
          "canCreateEnrollments",
          "canEditEnrollments",
          "canViewProgress",
          "canEditProgress",
          "canViewReports",
          "canManageUsers",
          "adminRoles",
        ],
        properties: {
          userId: { type: "string", format: "uuid" },
          plantId: { type: "string", format: "uuid" },
          canViewCourses: { type: "boolean" },
          canCreateCourses: { type: "boolean" },
          canEditCourses: { type: "boolean" },
          canDeleteCourses: { type: "boolean" },
          canViewEnrollments: { type: "boolean" },
          canCreateEnrollments: { type: "boolean" },
          canEditEnrollments: { type: "boolean" },
          canViewProgress: { type: "boolean" },
          canEditProgress: { type: "boolean" },
          canViewReports: { type: "boolean" },
          canManageUsers: { type: "boolean" },
          adminRoles: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "plant_admin",
                "course_admin",
                "instructor",
                "supervisor",
                "compliance_officer",
              ],
            },
          },
        },
        additionalProperties: false,
      },
    },
    responses: {
      ErrorResponse: {
        description: "Error response",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      UnauthorizedError: {
        description: "Authentication required",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: {
              success: false,
              error: {
                code: "AUTHENTICATION_ERROR",
                message: "Authentication required",
                timestamp: "2024-01-01T00:00:00Z",
              },
              version: "1.0",
            },
          },
        },
      },
      ForbiddenError: {
        description: "Insufficient permissions",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: {
              success: false,
              error: {
                code: "AUTHORIZATION_ERROR",
                message: "Insufficient permissions for this operation",
                timestamp: "2024-01-01T00:00:00Z",
              },
              version: "1.0",
            },
          },
        },
      },
      NotFoundError: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: {
              success: false,
              error: {
                code: "PLANT_NOT_FOUND",
                message: "Plant not found",
                timestamp: "2024-01-01T00:00:00Z",
              },
              version: "1.0",
            },
          },
        },
      },
      ValidationError: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: {
              success: false,
              error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request data",
                details: [
                  {
                    field: "name",
                    message: "Name is required",
                  },
                ],
                timestamp: "2024-01-01T00:00:00Z",
              },
              version: "1.0",
            },
          },
        },
      },
    },
    parameters: {
      PlantId: {
        name: "plantId",
        in: "path",
        required: true,
        description: "Plant ID",
        schema: { type: "string", format: "uuid" },
      },
      CourseId: {
        name: "courseId",
        in: "path",
        required: true,
        description: "Course ID",
        schema: { type: "string", format: "uuid" },
      },
      EnrollmentId: {
        name: "enrollmentId",
        in: "path",
        required: true,
        description: "Enrollment ID",
        schema: { type: "string", format: "uuid" },
      },
      ProgressId: {
        name: "progressId",
        in: "path",
        required: true,
        description: "Progress ID",
        schema: { type: "string", format: "uuid" },
      },
      UserId: {
        name: "userId",
        in: "path",
        required: true,
        description: "User ID",
        schema: { type: "string", format: "uuid" },
      },
      AdminRoleId: {
        name: "adminRoleId",
        in: "path",
        required: true,
        description: "Admin Role ID",
        schema: { type: "string", format: "uuid" },
      },
      Page: {
        name: "page",
        in: "query",
        description: "Page number",
        schema: { type: "integer", minimum: 1, default: 1 },
      },
      Limit: {
        name: "limit",
        in: "query",
        description: "Number of items per page",
        schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
      SortBy: {
        name: "sortBy",
        in: "query",
        description: "Field to sort by",
        schema: { type: "string" },
      },
      SortOrder: {
        name: "sortOrder",
        in: "query",
        description: "Sort order",
        schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
      },
    },
  },
  tags: [
    {
      name: "Plants",
      description: "Plant management operations",
    },
    {
      name: "Courses",
      description: "Course management operations",
    },
    {
      name: "Enrollments",
      description: "Enrollment management operations",
    },
    {
      name: "Progress",
      description: "Progress tracking operations",
    },
    {
      name: "Activity",
      description: "Activity and event tracking operations",
    },
    {
      name: "Admin Roles",
      description: "Admin role management operations",
    },
    {
      name: "Users",
      description: "User-specific operations",
    },
    {
      name: "Integration",
      description: "Auth integration and context operations",
    },
    {
      name: "Files",
      description: "File upload operations",
    },
  ],
};

// =============================================================================
// OPENAPI SPECIFICATION UTILITIES
// =============================================================================

/**
 * Generate OpenAPI specification from endpoint definitions
 */
export const generateOpenApiSpec = (): typeof SafetyTrainingOpenApiSpec => {
  // This would be expanded to dynamically generate the paths section
  // from the SafetyTrainingApiEndpoints definitions
  return SafetyTrainingOpenApiSpec;
};

/**
 * Export OpenAPI specification as JSON
 */
export const exportOpenApiSpec = (): string => {
  return JSON.stringify(SafetyTrainingOpenApiSpec, null, 2);
};

/**
 * Validate OpenAPI specification
 */
export const validateOpenApiSpec = (
  spec: OpenApiSpecification
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Basic validation checks
  if (!spec.openapi) {
    errors.push("Missing openapi version");
  }

  if (!spec.info) {
    errors.push("Missing info section");
  }

  if (!spec.paths) {
    errors.push("Missing paths section");
  }

  if (!spec.components) {
    errors.push("Missing components section");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
