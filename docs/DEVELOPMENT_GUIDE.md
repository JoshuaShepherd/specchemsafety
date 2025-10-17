# Development Guide - SpecChem Safety LMS

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- PostgreSQL (via Supabase)
- Git

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd specchem-safety-lms-v2-main
   pnpm install
   ```

2. **Configure Environment**
   
   Create `apps/safety-lms/.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://radbukphijxenmgiljtu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   DATABASE_URL=postgresql://postgres:password@db.radbukphijxenmgiljtu.supabase.co:5432/postgres
   NODE_ENV=development
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # Or from root: cd apps/safety-lms && npm run dev
   ```

4. **Access Application**
   - Local: http://localhost:3000
   - Login with existing user credentials

## Architecture Patterns

### The 5-Layer Pattern

Every feature follows this layered architecture:

```
┌─────────────────────────────────────┐
│   1. SCHEMA LAYER (Drizzle ORM)    │  Database table definitions
├─────────────────────────────────────┤
│   2. QUERY LAYER (Query functions) │  Reusable database operations
├─────────────────────────────────────┤
│   3. MAPPER LAYER (Transformers)   │  Convert between DB & API types
├─────────────────────────────────────┤
│   4. VALIDATION LAYER (Zod)        │  Input/output validation
├─────────────────────────────────────┤
│   5. API/SERVICE LAYER              │  Business logic & HTTP handling
└─────────────────────────────────────┘
```

### Example: Adding a New Feature

Let's add a "Course Categories" feature:

#### Step 1: Define Schema
**File**: `apps/safety-lms/src/lib/db/schema/course-categories.ts`

```typescript
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courses } from "./courses";

export const courseCategories = pgTable("course_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courseCategoriesRelations = relations(courseCategories, ({ many }) => ({
  courses: many(courses),
}));

export type CourseCategory = typeof courseCategories.$inferSelect;
export type NewCourseCategory = typeof courseCategories.$inferInsert;
```

Don't forget to export from `schema/index.ts`:
```typescript
export * from "./course-categories";
```

#### Step 2: Create Query Functions
**File**: `apps/safety-lms/src/lib/db/queries/course-categories.ts`

```typescript
import { db } from "../index";
import { courseCategories } from "../schema";
import { eq } from "drizzle-orm";

export async function getAllCategories() {
  return await db.select().from(courseCategories).orderBy(courseCategories.name);
}

export async function getCategoryById(id: string) {
  const result = await db.select()
    .from(courseCategories)
    .where(eq(courseCategories.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getCategoryBySlug(slug: string) {
  const result = await db.select()
    .from(courseCategories)
    .where(eq(courseCategories.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function createCategory(data: NewCourseCategory) {
  const result = await db.insert(courseCategories)
    .values(data)
    .returning();
  return result[0];
}

export async function updateCategory(id: string, data: Partial<CourseCategory>) {
  const result = await db.update(courseCategories)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courseCategories.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteCategory(id: string) {
  await db.delete(courseCategories)
    .where(eq(courseCategories.id, id));
  return true;
}
```

Export from `queries/index.ts`:
```typescript
export * from "./course-categories";
```

#### Step 3: Define Validation Schemas
**File**: `apps/safety-lms/src/lib/validations/course-category.ts`

```typescript
import { z } from "zod";

export const courseCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createCourseCategorySchema = courseCategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCourseCategorySchema = createCourseCategorySchema.partial();

export type CourseCategoryDTO = z.infer<typeof courseCategorySchema>;
export type CreateCourseCategoryDTO = z.infer<typeof createCourseCategorySchema>;
export type UpdateCourseCategoryDTO = z.infer<typeof updateCourseCategorySchema>;
```

Export from `validations/index.ts`:
```typescript
export * from "./course-category";
```

#### Step 4: Create Mappers
**File**: `apps/safety-lms/src/lib/mappers/course-category-mappers.ts`

```typescript
import { CourseCategory, NewCourseCategory } from "@/lib/db/schema";
import { CourseCategoryDTO, CreateCourseCategoryDTO } from "@/lib/validations";

export function mapCourseCategoryToDTO(category: CourseCategory): CourseCategoryDTO {
  return {
    id: category.id,
    name: category.name,
    description: category.description || undefined,
    slug: category.slug,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export function mapCreateDTOToDb(dto: CreateCourseCategoryDTO): NewCourseCategory {
  return {
    name: dto.name,
    description: dto.description || null,
    slug: dto.slug,
  };
}
```

Export from `mappers/index.ts`:
```typescript
export * from "./course-category-mappers";
```

#### Step 5: Create API Route
**File**: `apps/safety-lms/src/app/api/course-categories/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { serverAuth } from "@/lib/supabase/server";
import { createCourseCategorySchema } from "@/lib/validations";
import { getAllCategories, createCategory } from "@/lib/db/queries";
import { mapCourseCategoryToDTO, mapCreateDTOToDb } from "@/lib/mappers";

export async function GET(request: NextRequest) {
  try {
    const { user } = await serverAuth.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const categories = await getAllCategories();
    const dtos = categories.map(mapCourseCategoryToDTO);

    return NextResponse.json({
      success: true,
      data: dtos,
    });
  } catch (error) {
    console.error("GET /api/course-categories error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, profile } = await serverAuth.getCurrentUser();
    if (!user || profile?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createCourseCategorySchema.parse(body);

    const dbData = mapCreateDTOToDb(validatedData);
    const category = await createCategory(dbData);
    const dto = mapCourseCategoryToDTO(category);

    return NextResponse.json({
      success: true,
      data: dto,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("POST /api/course-categories error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### Step 6: Create React Hook
**File**: `apps/safety-lms/src/hooks/useCourseCategories.ts`

```typescript
"use client";

import { useState, useEffect } from "react";
import { CourseCategoryDTO } from "@/lib/validations";

export function useCourseCategories() {
  const [categories, setCategories] = useState<CourseCategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await fetch("/api/course-categories");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }

        setCategories(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
```

#### Step 7: Use in Component
**File**: `apps/safety-lms/src/app/courses/page.tsx`

```typescript
"use client";

import { useCourseCategories } from "@/hooks/useCourseCategories";

export default function CoursesPage() {
  const { categories, loading, error } = useCourseCategories();

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Course Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### Step 8: Generate and Apply Migration

```bash
# Generate migration from schema changes
pnpm db:generate

# Review the generated SQL in drizzle/
# Then apply the migration
pnpm db:migrate
```

## Common Development Tasks

### Adding a New API Endpoint

1. Create route file in `src/app/api/[name]/route.ts`
2. Export `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` functions
3. Always check authentication with `serverAuth.getCurrentUser()`
4. Validate input with Zod schemas
5. Use query functions from `queries/` layer
6. Transform data with mappers from `mappers/` layer
7. Return consistent response format

### Adding a New Component

1. Create in `src/components/[category]/[ComponentName].tsx`
2. Use TypeScript with proper types
3. Use Tailwind classes for styling
4. Import shadcn/ui components from `@/components/ui`
5. Make it responsive (mobile-first)
6. Add dark mode support via `dark:` classes

### Adding a New Hook

1. Create in `src/hooks/use[HookName].ts`
2. Use "use client" directive
3. Return object with: `{ data, loading, error, refetch }`
4. Handle authentication errors
5. Implement proper error handling

### Modifying Database Schema

1. Update schema file in `src/lib/db/schema/`
2. Update related query functions
3. Update validation schemas
4. Update mappers
5. Run `pnpm db:generate` to create migration
6. Review generated SQL
7. Run `pnpm db:migrate` to apply

## Code Style Guidelines

### TypeScript
- Use strict mode
- Prefer interfaces for objects
- Use `type` for unions and primitives
- Export types alongside implementations
- Use `satisfies` for type assertions

### React
- Prefer function components
- Use hooks for state and side effects
- Server components by default
- Client components only when needed ("use client")
- Proper loading and error states

### Naming Conventions
- **Files**: kebab-case (`user-profile.ts`)
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`getUserById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `CreateUserRequest`)

### API Response Format
Always return this shape:
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
  };
}
```

### Database Query Patterns

**Get by ID:**
```typescript
const result = await db.select()
  .from(table)
  .where(eq(table.id, id))
  .limit(1);
return result[0] || null;
```

**Get with relations:**
```typescript
const result = await db.query.table.findFirst({
  where: eq(table.id, id),
  with: {
    relatedTable: true,
  },
});
```

**Pagination:**
```typescript
const items = await db.select()
  .from(table)
  .limit(limit)
  .offset((page - 1) * limit);

const [{ count }] = await db.select({ count: sql`count(*)` })
  .from(table);
```

## Testing

### Manual Testing
1. Run `npm run dev`
2. Test in browser at http://localhost:3000
3. Check console for errors
4. Test mobile view in DevTools
5. Test dark mode toggle

### Database Testing
1. Use Drizzle Studio: `pnpm db:studio`
2. Inspect tables and data
3. Test queries manually
4. Check foreign key constraints

## Debugging Tips

### Server Errors
- Check terminal output
- Look for stack traces
- Check Supabase logs
- Verify environment variables

### Client Errors
- Check browser console
- Use React DevTools
- Check Network tab
- Verify API responses

### Database Errors
- Open Drizzle Studio
- Check table structures
- Verify RLS policies in Supabase
- Check foreign key constraints

### Authentication Issues
- Verify Supabase credentials
- Check middleware.ts
- Inspect cookies in DevTools
- Check serverAuth.getCurrentUser() calls

## Performance Best Practices

### Server Components
- Fetch data in Server Components
- Reduce client-side JavaScript
- Use streaming with Suspense
- Implement proper caching

### Database
- Use indexes on frequently queried columns
- Avoid N+1 queries (use joins)
- Implement pagination
- Use Drizzle's type-safe queries

### Client Side
- Lazy load components
- Implement loading states
- Debounce user inputs
- Use React.memo strategically

## Security Checklist

- [ ] All inputs validated with Zod
- [ ] Authentication checked in all API routes
- [ ] Authorization verified for sensitive operations
- [ ] RLS policies active on all tables
- [ ] No sensitive data in client-side code
- [ ] Environment variables secured
- [ ] SQL injection prevented (Drizzle handles this)
- [ ] XSS prevented (React escapes by default)

## Deployment

### Pre-Deployment
1. Run `pnpm lint` (fix all errors)
2. Run `pnpm type-check` (fix all errors)
3. Test all critical paths manually
4. Verify environment variables
5. Check database migrations are applied

### Vercel Deployment
1. Push to main branch
2. Vercel auto-deploys
3. Check build logs
4. Verify environment variables in Vercel dashboard
5. Test production URL

### Database Migrations
1. Migrations auto-run on deploy
2. Verify in Supabase dashboard
3. Check for migration errors
4. Rollback if needed

## Troubleshooting

### Build Fails
- Check TypeScript errors: `pnpm type-check`
- Check linting errors: `pnpm lint`
- Clear `.next` folder and rebuild
- Check for missing dependencies

### Database Connection Fails
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Verify IP is allowed (if IP restrictions enabled)
- Check database password

### Authentication Not Working
- Verify Supabase keys are correct
- Check middleware configuration
- Clear browser cookies
- Check Supabase auth settings

### Styles Not Loading
- Clear `.next` folder
- Check Tailwind config
- Verify globals.css imports
- Check for CSS conflicts

---

**Happy Coding!** 🚀

For questions, refer to:
- `PROJECT_OVERVIEW.md` - High-level architecture
- `DATABASE_SCHEMA.md` - Database structure
- `API_ARCHITECTURE.md` - API patterns

