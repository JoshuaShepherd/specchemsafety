// Safety Training Data Mappers
// Centralized mapper system for plant-based multi-tenancy and role-based access control

// Individual mapper modules - using explicit exports to avoid conflicts
export * from "./plant-mappers";
export * from "./user-mappers";
export * from "./course-mappers";
export * from "./enrollment-mappers";
export * from "./progress-mappers";

// LMS Content mappers - new structured content system
export * from "./course-section-mappers";
export * from "./content-block-mappers";
export * from "./quiz-question-mappers";
export * from "./user-progress-mappers";

// Activity mappers - explicit exports to avoid AuditTrailEntry conflict
export {
  mapActivityEventToApiResponse,
  mapActivityEventsToApiResponses,
  mapQuestionEventToApiResponse,
  mapQuestionEventsToApiResponses,
  mapCreateActivityEventRequestToDb,
  mapCreateQuestionEventRequestToDb,
  mapActivityEventsToAuditTrail,
  mapActivityToComplianceTracking,
  mapActivityEventsToPlantScopedResponse,
  validateAndMapEventAccess,
  mapEventSearchCriteriaToDbFilters,
} from "./activity-mappers";

// Rename conflicting type exports
export type {
  AuditTrailEntry as ActivityAuditTrailEntry,
  EventSearchCriteria as ActivityEventSearchCriteria,
  ComplianceTracking as ActivityComplianceTracking,
  PlantScopedEventResponse as ActivityPlantScopedEventResponse,
  EventAccessResult as ActivityEventAccessResult,
} from "./activity-mappers";

export * from "./auth-integration-mappers";
export * from "./plant-scoped-mappers";
export * from "./role-based-mappers";

// Compliance mappers - explicit exports to avoid AuditTrailEntry conflict
export type {
  ComplianceStatus,
  ComplianceRecord,
  PlantComplianceSummary,
  ComplianceReportType,
  ComplianceReportConfig,
  ComplianceReportResult,
  ExpirationAlert,
} from "./compliance-mappers";

export {
  mapToComplianceRecord,
  mapPlantDataToComplianceSummary,
  mapComplianceDataToReport,
  mapComplianceActivityEventsToAuditTrail,
  mapQuestionEventsToAuditTrail as mapComplianceQuestionEventsToAuditTrail,
} from "./compliance-mappers";

// Rename conflicting type exports
export type {
  ComplianceAuditTrailEntry,
  QuestionAuditTrailEntry as ComplianceQuestionAuditTrailEntry,
} from "./compliance-mappers";

// Centralized safety mapper system
export * from "./safety-mapper-system";
