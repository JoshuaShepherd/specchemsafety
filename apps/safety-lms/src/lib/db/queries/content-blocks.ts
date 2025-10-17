import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db } from "../index";
import {
  contentBlocks,
  courseSections,
  ContentBlock,
  NewContentBlock,
  ContentBlockType,
} from "../schema";

/**
 * Content Block Query Operations
 * Handles database queries for content blocks with proper access control
 */

// =============================================================================
// BASIC CONTENT BLOCK QUERIES
// =============================================================================

/**
 * Get content block by ID
 */
export const getContentBlockById = async (
  blockId: string
): Promise<ContentBlock | null> => {
  const result = await db
    .select()
    .from(contentBlocks)
    .where(eq(contentBlocks.id, blockId))
    .limit(1);

  return result[0] || null;
};

/**
 * Get all content blocks for a section
 */
export const getContentBlocksBySectionId = async (
  sectionId: string,
  options: {
    blockType?: ContentBlockType;
    sortBy?: "orderIndex" | "blockType" | "createdAt";
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<ContentBlock[]> => {
  const { blockType, sortBy = "orderIndex", sortOrder = "asc" } = options;

  let whereClause = eq(contentBlocks.sectionId, sectionId);

  if (blockType) {
    whereClause = and(whereClause, eq(contentBlocks.blockType, blockType));
  }

  const orderBy =
    sortOrder === "desc"
      ? desc(contentBlocks[sortBy])
      : asc(contentBlocks[sortBy]);

  const result = await db
    .select()
    .from(contentBlocks)
    .where(whereClause)
    .orderBy(orderBy);

  return result;
};

/**
 * Get content blocks by type across all sections
 */
export const getContentBlocksByType = async (
  blockType: ContentBlockType,
  options: {
    limit?: number;
    offset?: number;
  } = {}
): Promise<ContentBlock[]> => {
  const { limit = 20, offset = 0 } = options;

  const result = await db
    .select()
    .from(contentBlocks)
    .where(eq(contentBlocks.blockType, blockType))
    .orderBy(asc(contentBlocks.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
};

// =============================================================================
// CONTENT BLOCK CREATION AND UPDATES
// =============================================================================

/**
 * Create a new content block
 */
export const createContentBlock = async (
  blockData: NewContentBlock
): Promise<ContentBlock> => {
  const result = await db.insert(contentBlocks).values(blockData).returning();

  return result[0];
};

/**
 * Update content block
 */
export const updateContentBlock = async (
  blockId: string,
  updates: Partial<ContentBlock>
): Promise<ContentBlock | null> => {
  const result = await db
    .update(contentBlocks)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(contentBlocks.id, blockId))
    .returning();

  return result[0] || null;
};

/**
 * Delete content block
 */
export const deleteContentBlock = async (blockId: string): Promise<boolean> => {
  const result = await db
    .delete(contentBlocks)
    .where(eq(contentBlocks.id, blockId))
    .returning();

  return result.length > 0;
};

// =============================================================================
// CONTENT BLOCK ORDERING OPERATIONS
// =============================================================================

/**
 * Update content block order
 */
export const updateContentBlockOrder = async (
  blockId: string,
  newOrderIndex: number
): Promise<ContentBlock | null> => {
  const result = await db
    .update(contentBlocks)
    .set({
      orderIndex: newOrderIndex,
      updatedAt: new Date(),
    })
    .where(eq(contentBlocks.id, blockId))
    .returning();

  return result[0] || null;
};

/**
 * Reorder multiple content blocks
 */
export const reorderContentBlocks = async (
  sectionId: string,
  blockOrders: Array<{ blockId: string; orderIndex: number }>
): Promise<ContentBlock[]> => {
  const results: ContentBlock[] = [];

  for (const order of blockOrders) {
    const result = await updateContentBlockOrder(
      order.blockId,
      order.orderIndex
    );
    if (result) {
      results.push(result);
    }
  }

  return results;
};

/**
 * Get next available order index for a section
 */
export const getNextContentBlockOrderIndex = async (
  sectionId: string
): Promise<number> => {
  const result = await db
    .select({ maxOrder: sql<number>`max(${contentBlocks.orderIndex})` })
    .from(contentBlocks)
    .where(eq(contentBlocks.sectionId, sectionId));

  return (result[0]?.maxOrder || 0) + 1;
};

// =============================================================================
// CONTENT BLOCK VALIDATION QUERIES
// =============================================================================

/**
 * Check if order index is unique within a section
 */
export const isContentBlockOrderIndexUnique = async (
  sectionId: string,
  orderIndex: number,
  excludeBlockId?: string
): Promise<boolean> => {
  let whereClause = and(
    eq(contentBlocks.sectionId, sectionId),
    eq(contentBlocks.orderIndex, orderIndex)
  );

  if (excludeBlockId) {
    whereClause = and(
      whereClause,
      sql`${contentBlocks.id} != ${excludeBlockId}`
    );
  }

  const result = await db
    .select({ id: contentBlocks.id })
    .from(contentBlocks)
    .where(whereClause)
    .limit(1);

  return result.length === 0;
};

/**
 * Validate content block content based on block type
 */
export const validateContentBlockContent = async (
  blockType: ContentBlockType,
  content: Record<string, unknown>
): Promise<{ isValid: boolean; errors: string[] }> => {
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

// =============================================================================
// CONTENT BLOCK STATISTICS QUERIES
// =============================================================================

/**
 * Get content block statistics for a section
 */
export const getContentBlockStatistics = async (
  sectionId: string
): Promise<{
  totalBlocks: number;
  blocksByType: Record<ContentBlockType, number>;
  blocksWithMetadata: number;
  blocksWithoutMetadata: number;
} | null> => {
  // Get total count
  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(contentBlocks)
    .where(eq(contentBlocks.sectionId, sectionId));

  // Get count by type
  const typeResult = await db
    .select({
      blockType: contentBlocks.blockType,
      count: sql<number>`count(*)`,
    })
    .from(contentBlocks)
    .where(eq(contentBlocks.sectionId, sectionId))
    .groupBy(contentBlocks.blockType);

  // Get blocks with/without metadata
  const metadataResult = await db
    .select({
      withMetadata: sql<number>`count(*) filter (where ${contentBlocks.metadata} is not null)`,
      withoutMetadata: sql<number>`count(*) filter (where ${contentBlocks.metadata} is null)`,
    })
    .from(contentBlocks)
    .where(eq(contentBlocks.sectionId, sectionId));

  const blocksByType = typeResult.reduce(
    (acc, row) => {
      acc[row.blockType] = row.count;
      return acc;
    },
    {} as Record<ContentBlockType, number>
  );

  return {
    totalBlocks: totalResult[0]?.count || 0,
    blocksByType,
    blocksWithMetadata: metadataResult[0]?.withMetadata || 0,
    blocksWithoutMetadata: metadataResult[0]?.withoutMetadata || 0,
  };
};

// =============================================================================
// CONTENT BLOCK SEARCH QUERIES
// =============================================================================

/**
 * Search content blocks by content
 */
export const searchContentBlocks = async (
  sectionId: string,
  searchTerm: string,
  options: {
    blockType?: ContentBlockType;
    limit?: number;
    offset?: number;
  } = {}
): Promise<ContentBlock[]> => {
  const { blockType, limit = 20, offset = 0 } = options;

  let whereClause = and(
    eq(contentBlocks.sectionId, sectionId),
    sql`${contentBlocks.content}::text ilike ${`%${searchTerm}%`}`
  );

  if (blockType) {
    whereClause = and(whereClause, eq(contentBlocks.blockType, blockType));
  }

  const result = await db
    .select()
    .from(contentBlocks)
    .where(whereClause)
    .orderBy(asc(contentBlocks.orderIndex))
    .limit(limit)
    .offset(offset);

  return result;
};

/**
 * Search content blocks across all sections
 */
export const searchAllContentBlocks = async (
  searchTerm: string,
  options: {
    blockType?: ContentBlockType;
    limit?: number;
    offset?: number;
  } = {}
): Promise<ContentBlock[]> => {
  const { blockType, limit = 20, offset = 0 } = options;

  let whereClause = sql`${contentBlocks.content}::text ilike ${`%${searchTerm}%`}`;

  if (blockType) {
    whereClause = and(whereClause, eq(contentBlocks.blockType, blockType));
  }

  const result = await db
    .select()
    .from(contentBlocks)
    .where(whereClause)
    .orderBy(asc(contentBlocks.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
};

// =============================================================================
// CONTENT BLOCK ACCESS CONTROL QUERIES
// =============================================================================

/**
 * Get content blocks accessible to user based on role and section access
 */
export const getAccessibleContentBlocks = async (
  sectionId: string,
  userRole: string,
  options: {
    blockType?: ContentBlockType;
  } = {}
): Promise<ContentBlock[]> => {
  // All roles can access content blocks if they have section access
  // Access control is handled at the section level
  return getContentBlocksBySectionId(sectionId, options);
};

/**
 * Check if user can access a specific content block
 */
export const canUserAccessContentBlock = async (
  blockId: string,
  userRole: string
): Promise<boolean> => {
  const block = await getContentBlockById(blockId);
  if (!block) return false;

  // Access control is handled at the section level
  // If user can access the section, they can access the content blocks
  return true;
};

// =============================================================================
// CONTENT BLOCK BULK OPERATIONS
// =============================================================================

/**
 * Bulk create content blocks
 */
export const bulkCreateContentBlocks = async (
  blocksData: NewContentBlock[]
): Promise<ContentBlock[]> => {
  const result = await db.insert(contentBlocks).values(blocksData).returning();

  return result;
};

/**
 * Bulk update content blocks
 */
export const bulkUpdateContentBlocks = async (
  updates: Array<{ id: string; updates: Partial<ContentBlock> }>
): Promise<ContentBlock[]> => {
  const results: ContentBlock[] = [];

  for (const update of updates) {
    const result = await updateContentBlock(update.id, update.updates);
    if (result) {
      results.push(result);
    }
  }

  return results;
};

/**
 * Bulk delete content blocks
 */
export const bulkDeleteContentBlocks = async (
  blockIds: string[]
): Promise<number> => {
  const result = await db
    .delete(contentBlocks)
    .where(sql`${contentBlocks.id} = any(${blockIds})`)
    .returning();

  return result.length;
};
