// =============================================================================
// SAFETY TRAINING OPENAPI SPECIFICATIONS (MINIMAL VERSION)
// =============================================================================

/**
 * Minimal OpenAPI specifications for Safety Training API endpoints
 * This is a simplified version that compiles without type issues
 */

import { z } from "zod";

// =============================================================================
// BASIC OPENAPI SCHEMA GENERATORS
// =============================================================================

/**
 * OpenAPI schema definition
 */
export interface OpenApiSchema {
  type: string;
  description?: string;
  properties?: Record<string, OpenApiSchema>;
  items?: OpenApiSchema;
  required?: string[];
}

/**
 * Convert Zod schema to basic OpenAPI schema
 */
export const zodToOpenApi = (schema: z.ZodTypeAny): OpenApiSchema => {
  // Simple fallback implementation - schema parameter is used for future implementation
  return {
    type: "string",
    description: `Schema type: ${(schema._def as any).typeName || "unknown"}`,
  };
};

/**
 * OpenAPI specification structure
 */
export interface OpenApiSpec {
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
  };
  security: Array<Record<string, unknown[]>>;
}

/**
 * Generate OpenAPI specification for Safety Training API
 */
export const generateSafetyTrainingOpenApi = (): OpenApiSpec => {
  return {
    openapi: "3.0.0",
    info: {
      title: "Safety Training API",
      version: "1.0.0",
      description:
        "API for Safety Training management with plant-scoped access control",
    },
    servers: [
      {
        url: "/api/safety-training",
        description: "Safety Training API endpoints",
      },
    ],
    paths: {
      "/plants": {
        get: {
          summary: "List plants",
          description: "Get list of plants accessible to the user",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            isActive: { type: "boolean" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };
};

// =============================================================================
// EXPORTS
// =============================================================================

export { generateSafetyTrainingOpenApi as default };
