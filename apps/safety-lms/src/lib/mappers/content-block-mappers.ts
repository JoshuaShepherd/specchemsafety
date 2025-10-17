import { ContentBlock, NewContentBlock } from "../db/schema/content-blocks";
import { CourseSection } from "../db/schema/course-sections";
import {
  ContentBlock as ContentBlockSchema,
  CreateContentBlockRequest,
  UpdateContentBlockRequest,
  ContentBlockType,
} from "@specchem/contracts";

/**
 * Content Block Data Mappers
 * Handles transformation between content block database entities and API responses
 */

// =============================================================================
// CONTENT BLOCK DATABASE → API RESPONSE MAPPERS
// =============================================================================

/**
 * Maps content block database entity to API response
 */
export const mapContentBlockToApiResponse = (
  block: ContentBlock
): ContentBlockSchema => ({
  id: block.id,
  sectionId: block.sectionId,
  blockType: block.blockType as ContentBlockType,
  orderIndex: block.orderIndex,
  content: block.content,
  metadata: block.metadata,
  createdAt: block.createdAt.toISOString(),
  updatedAt: block.updatedAt.toISOString(),
});

/**
 * Maps multiple content blocks to API responses
 */
export const mapContentBlocksToApiResponses = (
  blocks: ContentBlock[]
): ContentBlockSchema[] => blocks.map(mapContentBlockToApiResponse);

// =============================================================================
// API REQUEST → CONTENT BLOCK DATABASE MAPPERS
// =============================================================================

/**
 * Maps create content block API request to database entity
 */
export const mapCreateContentBlockRequestToDb = (
  request: CreateContentBlockRequest,
  sectionId: string
): NewContentBlock => ({
  sectionId,
  blockType: request.blockType,
  orderIndex: request.orderIndex,
  content: request.content,
  metadata: request.metadata,
});

/**
 * Maps update content block API request to database entity
 */
export const mapUpdateContentBlockRequestToDb = (
  request: UpdateContentBlockRequest,
  existingBlock: ContentBlock
): Partial<ContentBlock> => ({
  ...existingBlock,
  blockType: request.blockType ?? existingBlock.blockType,
  orderIndex: request.orderIndex ?? existingBlock.orderIndex,
  content: request.content ?? existingBlock.content,
  metadata: request.metadata ?? existingBlock.metadata,
  updatedAt: new Date(),
});

// =============================================================================
// CONTENT BLOCK TYPE-SPECIFIC MAPPERS
// =============================================================================

/**
 * Content block type-specific content structure
 */
export interface ContentBlockContent {
  title?: string;
  subtitle?: string;
  content?: string;
  text?: string;
  image?: {
    url: string;
    alt: string;
    caption?: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
  list?: {
    type: "ordered" | "unordered";
    items: string[];
  };
  grid?: {
    columns: number;
    items: Array<{
      title: string;
      content: string;
      image?: string;
    }>;
  };
  callout?: {
    type: "info" | "warning" | "success" | "error";
    title: string;
    content: string;
  };
  quote?: {
    text: string;
    author?: string;
    source?: string;
  };
  video?: {
    url: string;
    title: string;
    duration?: number;
    thumbnail?: string;
  };
  audio?: {
    url: string;
    title: string;
    duration?: number;
  };
}

/**
 * Validates content block content based on block type
 */
export const validateContentBlockContent = (
  blockType: ContentBlockType,
  content: Record<string, unknown>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  switch (blockType) {
    case "hero":
      if (!content.title) errors.push("Hero blocks require a title");
      break;

    case "text":
      if (!content.content && !content.text) {
        errors.push("Text blocks require content or text");
      }
      break;

    case "image":
      if (!content.image?.url) {
        errors.push("Image blocks require an image URL");
      }
      break;

    case "table":
      if (!content.table?.headers || !content.table?.rows) {
        errors.push("Table blocks require headers and rows");
      }
      break;

    case "list":
      if (!content.list?.items || !Array.isArray(content.list.items)) {
        errors.push("List blocks require items array");
      }
      break;

    case "callout":
      if (!content.callout?.type || !content.callout?.content) {
        errors.push("Callout blocks require type and content");
      }
      break;

    case "quote":
      if (!content.quote?.text) {
        errors.push("Quote blocks require text");
      }
      break;

    case "video":
      if (!content.video?.url) {
        errors.push("Video blocks require a video URL");
      }
      break;

    case "audio":
      if (!content.audio?.url) {
        errors.push("Audio blocks require an audio URL");
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Normalizes content block content based on block type
 */
export const normalizeContentBlockContent = (
  blockType: ContentBlockType,
  content: Record<string, unknown>
): Record<string, unknown> => {
  const normalized = { ...content };

  switch (blockType) {
    case "hero":
      // Ensure hero has required fields
      if (!normalized.title) normalized.title = "";
      if (!normalized.subtitle) normalized.subtitle = "";
      break;

    case "text":
      // Normalize text content
      if (normalized.text && !normalized.content) {
        normalized.content = normalized.text;
      }
      break;

    case "image":
      // Ensure image has required structure
      if (typeof normalized.image === "string") {
        normalized.image = {
          url: normalized.image,
          alt: "",
        };
      }
      break;

    case "table":
      // Ensure table has proper structure
      if (!normalized.table) {
        normalized.table = {
          headers: [],
          rows: [],
        };
      }
      break;

    case "list":
      // Ensure list has proper structure
      if (!normalized.list) {
        normalized.list = {
          type: "unordered",
          items: [],
        };
      }
      break;

    case "callout":
      // Ensure callout has proper structure
      if (!normalized.callout) {
        normalized.callout = {
          type: "info",
          title: "",
          content: "",
        };
      }
      break;

    case "quote":
      // Ensure quote has proper structure
      if (!normalized.quote) {
        normalized.quote = {
          text: "",
        };
      }
      break;

    case "video":
      // Ensure video has proper structure
      if (!normalized.video) {
        normalized.video = {
          url: "",
          title: "",
        };
      }
      break;

    case "audio":
      // Ensure audio has proper structure
      if (!normalized.audio) {
        normalized.audio = {
          url: "",
          title: "",
        };
      }
      break;
  }

  return normalized;
};

// =============================================================================
// CONTENT BLOCK ORDERING MAPPERS
// =============================================================================

/**
 * Content block ordering result
 */
export interface ContentBlockOrderingResult {
  blocks: ContentBlockSchema[];
  reordered: boolean;
  conflicts: Array<{
    blockId: string;
    conflict: string;
  }>;
}

/**
 * Validates and applies content block ordering
 */
export const validateAndApplyContentBlockOrdering = (
  blocks: ContentBlock[],
  newOrder: Array<{ blockId: string; orderIndex: number }>
): ContentBlockOrderingResult => {
  const blockMap = new Map(blocks.map(b => [b.id, b]));
  const conflicts: Array<{ blockId: string; conflict: string }> = [];
  const reorderedBlocks: ContentBlock[] = [];

  // Check for conflicts
  const usedIndices = new Set<number>();
  for (const orderItem of newOrder) {
    const block = blockMap.get(orderItem.blockId);
    if (!block) {
      conflicts.push({
        blockId: orderItem.blockId,
        conflict: "Content block not found",
      });
      continue;
    }

    if (usedIndices.has(orderItem.orderIndex)) {
      conflicts.push({
        blockId: orderItem.blockId,
        conflict: "Duplicate order index",
      });
    } else {
      usedIndices.add(orderItem.orderIndex);
      reorderedBlocks.push({
        ...block,
        orderIndex: orderItem.orderIndex,
        updatedAt: new Date(),
      });
    }
  }

  return {
    blocks: mapContentBlocksToApiResponses(reorderedBlocks),
    reordered: conflicts.length === 0,
    conflicts,
  };
};

// =============================================================================
// CONTENT BLOCK ACCESS VALIDATION MAPPERS
// =============================================================================

/**
 * Content block access validation result
 */
export interface ContentBlockAccessResult {
  hasAccess: boolean;
  block?: ContentBlockSchema;
  reason?: string;
  permissions?: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

/**
 * Validates content block access based on user role and section access
 */
export const validateContentBlockAccess = (
  block: ContentBlock,
  userRole: string,
  sectionAccess: boolean
): ContentBlockAccessResult => {
  if (!sectionAccess) {
    return {
      hasAccess: false,
      reason: "User does not have access to the section",
    };
  }

  // Safety admins can access all content blocks
  if (userRole === "safety_admin") {
    return {
      hasAccess: true,
      block: mapContentBlockToApiResponse(block),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
      },
    };
  }

  // Plant managers can access content blocks in their plant
  if (userRole === "plant_manager") {
    return {
      hasAccess: true,
      block: mapContentBlockToApiResponse(block),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
      },
    };
  }

  // Safety instructors can manage content blocks in their plant
  if (userRole === "safety_instructor") {
    return {
      hasAccess: true,
      block: mapContentBlockToApiResponse(block),
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: false,
      },
    };
  }

  // HR admins can view content blocks in their plant
  if (userRole === "hr_admin") {
    return {
      hasAccess: true,
      block: mapContentBlockToApiResponse(block),
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
      },
    };
  }

  // Employees can view content blocks (access controlled by section)
  if (userRole === "employee") {
    return {
      hasAccess: true,
      block: mapContentBlockToApiResponse(block),
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
      },
    };
  }

  return {
    hasAccess: false,
    reason: "User does not have access to this content block",
  };
};

// =============================================================================
// CONTENT BLOCK FILTERING MAPPERS
// =============================================================================

/**
 * Content block filtering criteria
 */
export interface ContentBlockFilterCriteria {
  blockType?: ContentBlockType;
  sectionId?: string;
  hasContent?: boolean;
  hasMetadata?: boolean;
}

/**
 * Maps filtering criteria to database query filters
 */
export const mapContentBlockFilterCriteriaToDbFilters = (
  criteria: ContentBlockFilterCriteria
): any => {
  const where: any = {};

  if (criteria.blockType) {
    where.blockType = criteria.blockType;
  }

  if (criteria.sectionId) {
    where.sectionId = criteria.sectionId;
  }

  if (criteria.hasContent !== undefined) {
    if (criteria.hasContent) {
      where.content = { not: null };
    } else {
      where.content = null;
    }
  }

  if (criteria.hasMetadata !== undefined) {
    if (criteria.hasMetadata) {
      where.metadata = { not: null };
    } else {
      where.metadata = null;
    }
  }

  return where;
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type {
  ContentBlockContent,
  ContentBlockOrderingResult,
  ContentBlockAccessResult,
  ContentBlockFilterCriteria,
};
