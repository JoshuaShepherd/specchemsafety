import { Plant, NewPlant } from "../db/schema/plants";
import {
  Plant as PlantSchema,
  CreatePlant,
  UpdatePlant,
} from "../validations/safety-business";

// Re-export PlantSchema for use in other modules
export type { PlantSchema };

/**
 * Plant Data Mappers
 * Handles transformation between plant database entities and API responses
 */

// =============================================================================
// PLANT DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps plant database entity to API response
 */
export const mapPlantToApiResponse = (plant: Plant): PlantSchema => ({
  id: plant.id,
  name: plant.name,
  isActive: plant.isActive,
  createdAt: plant.createdAt.toISOString(),
  updatedAt: plant.updatedAt.toISOString(),
});

/**
 * Maps multiple plant database entities to API responses
 */
export const mapPlantsToApiResponses = (plants: Plant[]): PlantSchema[] =>
  plants.map(mapPlantToApiResponse);

// =============================================================================
// API REQUEST → PLANT DATABASE MAPPERS
// =============================================================================

/**
 * Maps create plant API request to database entity
 */
export const mapCreatePlantRequestToDb = (request: CreatePlant): NewPlant => ({
  name: request.name,
  isActive: request.isActive ?? true,
});

/**
 * Maps update plant API request to database entity
 */
export const mapUpdatePlantRequestToDb = (
  request: UpdatePlant,
  existingPlant: Plant
): Partial<Plant> => ({
  ...existingPlant,
  name: request.name ?? existingPlant.name,
  isActive: request.isActive ?? existingPlant.isActive,
  updatedAt: new Date(),
});

// =============================================================================
// PLANT-SCOPED RESPONSE MAPPERS
// =============================================================================

/**
 * Plant-scoped response wrapper
 */
export interface PlantScopedResponse<T> {
  data: T;
  plant: PlantSchema;
  user?: {
    id: string;
    role: string;
    plantId: string;
  };
}

/**
 * Wraps any data with plant context for API responses
 */
export const wrapWithPlantContext = <T>(
  data: T,
  plant: Plant,
  user?: { id: string; role: string; plantId: string }
): PlantScopedResponse<T> => ({
  data,
  plant: mapPlantToApiResponse(plant),
  user,
});

// =============================================================================
// PLANT FILTERING AND VALIDATION MAPPERS
// =============================================================================

/**
 * Plant access validation result
 */
export interface PlantAccessResult {
  hasAccess: boolean;
  plant?: PlantSchema;
  reason?: string;
}

/**
 * Validates and maps plant access for user
 */
export const validateAndMapPlantAccess = (
  plant: Plant,
  userPlantId: string,
  userRole: string
): PlantAccessResult => {
  // Safety admins can access all plants
  if (userRole === "safety_admin") {
    return {
      hasAccess: true,
      plant: mapPlantToApiResponse(plant),
    };
  }

  // Other users can only access their own plant
  if (plant.id === userPlantId) {
    return {
      hasAccess: true,
      plant: mapPlantToApiResponse(plant),
    };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to this plant",
  };
};

/**
 * Filters plants based on user access
 */
export const filterPlantsByUserAccess = (
  plants: Plant[],
  userPlantId: string,
  userRole: string
): PlantSchema[] => {
  return plants
    .map(plant => validateAndMapPlantAccess(plant, userPlantId, userRole))
    .filter(result => result.hasAccess)
    .map(result => result.plant!);
};

// =============================================================================
// PLANT STATUS AND HEALTH MAPPERS
// =============================================================================

/**
 * Plant health status
 */
export interface PlantHealthStatus {
  plant: PlantSchema;
  isActive: boolean;
  userCount?: number;
  courseCount?: number;
  activeEnrollments?: number;
  lastActivity?: string;
}

/**
 * Maps plant to health status response
 */
export const mapPlantToHealthStatus = (
  plant: Plant,
  stats?: {
    userCount?: number;
    courseCount?: number;
    activeEnrollments?: number;
    lastActivity?: Date;
  }
): PlantHealthStatus => ({
  plant: mapPlantToApiResponse(plant),
  isActive: plant.isActive,
  userCount: stats?.userCount,
  courseCount: stats?.courseCount,
  activeEnrollments: stats?.activeEnrollments,
  lastActivity: stats?.lastActivity?.toISOString(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// All types are exported as interfaces above
