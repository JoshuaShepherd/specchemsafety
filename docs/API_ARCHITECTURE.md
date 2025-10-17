# API Architecture - SpecChem Safety LMS

## Overview

The Safety LMS uses **Next.js Route Handlers** (App Router) for its API layer. All APIs follow REST principles with consistent patterns for authentication, validation, error handling, and response formatting.

## API Layer Structure

```
API Request Flow:
─────────────────────────────────────────────────────────────
Client → Middleware → Route Handler → Service → Mapper → Query → DB
         (Auth)       (Validation)    (Logic)  (Transform) (SQL)
```

### Layer Responsibilities

1. **Middleware** (`middleware.ts`)
   - Authenticates all requests
   - Refreshes Supabase sessions
   - Redirects unauthenticated users
   - Runs before every route

2. **Route Handlers** (`src/app/api/**/route.ts`)
   - HTTP method handling (GET, POST, PUT, DELETE)
   - Request parsing
   - Input validation with Zod
   - Authorization checks
   - Response formatting

3. **Service Layer** (`src/lib/services/`)
   - Business logic orchestration
   - Multi-step operations
   - Cross-cutting concerns
   - Error handling

4. **Mapper Layer** (`src/lib/mappers/`)
   - Transform API DTOs to database types
   - Transform database types to API responses
   - Apply business rules
   - Enforce data shapes

5. **Query Layer** (`src/lib/db/queries/`)
   - Type-safe database operations
   - Reusable query functions
   - Complex joins and aggregations
   - Transaction management

## API Endpoint Patterns

### Standard CRUD Pattern

Every entity follows this pattern:

```
GET    /api/[entity]           # List all (with pagination)
GET    /api/[entity]/[id]      # Get single by ID
POST   /api/[entity]           # Create new
PUT    /api/[entity]/[id]      # Update existing (full)
PATCH  /api/[entity]/[id]      # Update existing (partial)
DELETE /api/[entity]/[id]      # Delete
```

### Public vs Protected Endpoints

**Public** (no auth required):
- `/api/public/*` - Read-only access to published content

**Protected** (auth required):
- All other `/api/*` endpoints
- Authorization varies by role

## Request/Response Patterns

### Success Response Format

```typescript
{
  success: true,
  data: T | T[],                    // Single item or array
  pagination?: {                    // Only for list endpoints
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean
  },
  metadata?: {
    timestamp: string,
    requestId: string
  }
}
```

### Error Response Format

```typescript
{
  success: false,
  error: string,                    // User-friendly message
  code: ErrorCode,                  // Machine-readable code
  details?: ValidationError[],      // For validation errors
  metadata: {
    timestamp: string,
    requestId: string,
    path: string,
    method: string
  }
}
```

### Standard Error Codes

```typescript
// Authentication & Authorization
"AUTHENTICATION_ERROR"      // Not authenticated
"AUTHORIZATION_ERROR"       // Not authorized
"SESSION_EXPIRED"          // Session expired

// Validation
"VALIDATION_ERROR"         // Input validation failed
"INVALID_REQUEST"          // Malformed request

// Resources
"NOT_FOUND"               // Resource not found
"ALREADY_EXISTS"          // Duplicate resource
"CONFLICT"                // State conflict

// System
"SYSTEM_ERROR"            // Database error
"INTERNAL_ERROR"          // Unexpected error
"SERVICE_UNAVAILABLE"     // Service down
```

## API Endpoints Reference

### Authentication APIs

#### `POST /api/auth/login`
**Purpose:** Authenticate user and create session

**Request:**
```typescript
{
  email: string,
  password: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    user: {
      id: string,
      email: string,
      firstName: string,
      lastName: string,
      role: string
    },
    session: {
      accessToken: string,
      refreshToken: string,
      expiresAt: string
    }
  }
}
```

**Status Codes:**
- `200 OK` - Login successful
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Validation error

---

#### `POST /api/auth/logout`
**Purpose:** End user session

**Response:**
```typescript
{
  success: true,
  message: "Logged out successfully"
}
```

---

#### `GET /api/auth/session`
**Purpose:** Get current session info

**Response:**
```typescript
{
  success: true,
  data: {
    user: User,
    profile: Profile
  }
}
```

---

### Course APIs

#### `GET /api/courses`
**Purpose:** List all courses

**Query Parameters:**
```typescript
{
  page?: number,          // Default: 1
  limit?: number,         // Default: 20
  sortBy?: string,        // Default: "created_at"
  sortOrder?: "asc"|"desc" // Default: "desc"
}
```

**Response:**
```typescript
{
  success: true,
  data: Course[],
  pagination: PaginationInfo
}
```

**Authorization:** Authenticated users

---

#### `POST /api/courses`
**Purpose:** Create new course

**Request:**
```typescript
{
  title: string,
  slug: string,
  version?: string,
  isPublished?: boolean
}
```

**Response:**
```typescript
{
  success: true,
  data: Course
}
```

**Authorization:** Admin only

**Validation:**
- `title`: 1-200 characters
- `slug`: URL-safe, unique
- `version`: Semver format

---

#### `GET /api/courses/[slug]`
**Purpose:** Get course details

**Response:**
```typescript
{
  success: true,
  data: Course
}
```

---

#### `GET /api/courses/[slug]/sections`
**Purpose:** Get course sections with content

**Response:**
```typescript
{
  success: true,
  data: {
    course: Course,
    sections: CourseSection[]
  }
}
```

---

### Course Section APIs

#### `GET /api/course-sections`
**Purpose:** List course sections

**Query Parameters:**
```typescript
{
  courseId?: string,
  includeUnpublished?: boolean,
  page?: number,
  limit?: number
}
```

**Response:**
```typescript
{
  success: true,
  data: CourseSection[],
  pagination: PaginationInfo
}
```

---

#### `POST /api/course-sections`
**Purpose:** Create new section

**Request:**
```typescript
{
  courseId: string,
  sectionKey: string,
  title: string,
  orderIndex: number,
  iconName?: string,
  isPublished?: boolean
}
```

**Authorization:** Admin only

---

### Content Block APIs

#### `GET /api/content-blocks`
**Purpose:** List content blocks

**Query Parameters:**
```typescript
{
  sectionId?: string,
  blockType?: ContentBlockType,
  page?: number,
  limit?: number
}
```

---

#### `POST /api/content-blocks`
**Purpose:** Create new content block

**Request:**
```typescript
{
  sectionId: string,
  blockType: ContentBlockType,
  orderIndex: number,
  content: Record<string, any>,  // Type-specific
  metadata?: Record<string, any>
}
```

**Content Validation:**
Each block type has specific required fields:

```typescript
// Hero block
content: {
  title: string,
  subtitle?: string,
  badges?: string[]
}

// Text block
content: {
  text: string,
  format?: "plain" | "markdown" | "html"
}

// Callout block
content: {
  type: "info" | "warning" | "error" | "success" | "tip",
  title: string,
  content: string
}

// Image block
content: {
  src: string,
  alt: string,
  caption?: string
}
```

**Authorization:** Admin only

---

### Quiz APIs

#### `GET /api/quiz-questions`
**Purpose:** List quiz questions

**Query Parameters:**
```typescript
{
  sectionId?: string,
  questionType?: "true_false" | "multiple_choice"
}
```

---

#### `POST /api/quiz-questions`
**Purpose:** Create quiz question

**Request:**
```typescript
{
  sectionId: string,
  questionKey: string,
  questionType: "true_false" | "multiple_choice",
  questionText: string,
  orderIndex: number,
  options: QuestionOptions,
  correctAnswer: CorrectAnswer,
  explanation: string,
  points?: number,
  isRequired?: boolean
}
```

**Authorization:** Admin only

---

#### `POST /api/quiz-attempts`
**Purpose:** Submit quiz answer

**Request:**
```typescript
{
  questionId: string,
  userAnswer: any,  // Format depends on question type
  attemptedAt: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    isCorrect: boolean,
    pointsEarned: number,
    explanation: string,
    correctAnswer: any  // Only shown after submission
  }
}
```

---

### Progress Tracking APIs

#### `GET /api/user-progress`
**Purpose:** Get user's course progress

**Query Parameters:**
```typescript
{
  userId?: string,      // Defaults to current user
  courseId?: string,    // Filter by course
  sectionId?: string    // Filter by section
}
```

**Response:**
```typescript
{
  success: true,
  data: UserProgress[]
}
```

---

#### `POST /api/user-progress`
**Purpose:** Update progress

**Request:**
```typescript
{
  sectionId: string,
  status: "not_started" | "in_progress" | "completed",
  timeSpentSeconds: number,
  completedAt?: string
}
```

**Response:**
```typescript
{
  success: true,
  data: UserProgress
}
```

**Authorization:** Can only update own progress (employees) or any user (admins)

---

### Enrollment APIs

#### `GET /api/enrollments`
**Purpose:** List user enrollments

**Response:**
```typescript
{
  success: true,
  data: Enrollment[]
}
```

---

#### `POST /api/enrollments`
**Purpose:** Enroll user in course

**Request:**
```typescript
{
  userId: string,
  courseId: string,
  plantId: string
}
```

**Authorization:** Manager or Admin

---

### Dashboard & Stats APIs

#### `GET /api/stats/dashboard`
**Purpose:** Get dashboard statistics

**Response:**
```typescript
{
  success: true,
  data: {
    totalCourses: number,
    activeCourses: number,
    totalEnrollments: number,
    completedCourses: number,
    averageProgress: number,
    recentActivity: Activity[]
  }
}
```

---

#### `GET /api/stats/site`
**Purpose:** Get site-wide statistics (Admin only)

**Response:**
```typescript
{
  success: true,
  data: {
    totalUsers: number,
    totalCourses: number,
    totalEnrollments: number,
    completionRate: number,
    averageTimePerCourse: number
  }
}
```

---

### Report APIs

#### `GET /api/reports`
**Purpose:** Generate reports

**Query Parameters:**
```typescript
{
  reportType: "progress" | "completion" | "quiz_performance",
  startDate?: string,
  endDate?: string,
  plantId?: string,
  courseId?: string
}
```

**Authorization:** Manager or Admin

---

## Public APIs

Public APIs don't require authentication and only return published content.

### `GET /api/public/courses`
**Purpose:** List published courses

**Response:**
```typescript
{
  success: true,
  data: Course[]
}
```

---

### `GET /api/public/courses/[slug]`
**Purpose:** Get published course details

---

### `GET /api/public/course-sections`
**Purpose:** Get published course sections

---

### `GET /api/public/content-blocks`
**Purpose:** Get published content blocks

---

### `GET /api/public/quiz-questions`
**Purpose:** Get published quiz questions

---

## Authentication Flow

### 1. Login
```typescript
POST /api/auth/login
→ Supabase Auth validates credentials
→ Create session
→ Set auth cookies
→ Return user + session info
```

### 2. Authenticated Request
```typescript
GET /api/courses
→ middleware.ts intercepts
→ Reads auth cookies
→ Validates session with Supabase
→ Refreshes if needed
→ Allows request to proceed
→ Route handler gets authenticated user
```

### 3. Authorization Check
```typescript
// In route handler
const { user, profile } = await serverAuth.getCurrentUser();

if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

if (profile.role !== "admin") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// Proceed with operation
```

---

## Validation Patterns

### Input Validation

```typescript
import { z } from "zod";
import { createCourseSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with Zod
    const validatedData = createCourseSchema.parse(body);
    
    // validatedData is now type-safe
    const course = await createCourse(validatedData);
    
    return NextResponse.json({
      success: true,
      data: course
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Validation error",
        details: error.errors
      }, { status: 400 });
    }
    
    // Handle other errors
  }
}
```

### Query Parameter Validation

```typescript
const { searchParams } = request.nextUrl;

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});

const { page, limit } = paginationSchema.parse({
  page: searchParams.get("page"),
  limit: searchParams.get("limit")
});
```

---

## Error Handling Pattern

### Standard Error Handler

```typescript
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const { user } = await serverAuth.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        createErrorResponse("AUTHENTICATION_ERROR", "Unauthorized"),
        { status: 401 }
      );
    }

    // Business logic
    const data = await fetchData();
    
    // Success response
    return NextResponse.json({
      success: true,
      data
    });
    
  } catch (error) {
    console.error("API Error:", error);
    
    // Validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        createErrorResponse("VALIDATION_ERROR", "Invalid input", error.errors),
        { status: 400 }
      );
    }
    
    // Database errors
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        createErrorResponse("SYSTEM_ERROR", "Database error"),
        { status: 500 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Unexpected error"),
      { status: 500 }
    );
  }
}
```

---

## Pagination Implementation

### Query Pattern

```typescript
import { eq, sql } from "drizzle-orm";

async function getCoursesPaginated(page: number, limit: number) {
  // Get total count
  const [{ count }] = await db
    .select({ count: sql`count(*)` })
    .from(courses);
    
  const total = Number(count);
  const totalPages = Math.ceil(total / limit);
  
  // Get page of data
  const data = await db
    .select()
    .from(courses)
    .limit(limit)
    .offset((page - 1) * limit);
    
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}
```

### API Response

```typescript
const result = await getCoursesPaginated(page, limit);

return NextResponse.json({
  success: true,
  data: result.data,
  pagination: result.pagination
});
```

---

## CORS & Security Headers

### CORS Configuration
Currently restricted to same-origin. For cross-origin access, configure in `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
        { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" }
      ]
    }
  ];
}
```

### Security Headers
Automatically added by Next.js:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## Rate Limiting

**Current Status:** Not implemented

**Recommended Implementation:**
- Use Vercel Edge Config for distributed rate limiting
- Limit by IP address or user ID
- Different limits for different endpoints
- Return `429 Too Many Requests` when exceeded

---

## Caching Strategy

### Server-Side Caching
Use Next.js cache control:

```typescript
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const data = await fetchData();
  return NextResponse.json(data);
}
```

### Client-Side Caching
Use SWR or React Query for automatic caching and revalidation.

---

## API Versioning

**Current:** All APIs are v1 (implicit)

**Future:** When breaking changes needed:
- Add version to URL: `/api/v2/courses`
- Maintain v1 for backward compatibility
- Document migration path
- Set deprecation timeline

---

## Testing APIs

### Manual Testing
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get courses (with session cookie)
curl http://localhost:3000/api/courses \
  -H "Cookie: sb-access-token=..."
```

### Automated Testing
Use Vitest or Jest with supertest:

```typescript
import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/courses', () => {
  it('returns courses for authenticated user', async () => {
    const request = new NextRequest('http://localhost:3000/api/courses');
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
```

---

## Best Practices

### DO
✅ Always check authentication  
✅ Validate all inputs with Zod  
✅ Use consistent response format  
✅ Log errors with context  
✅ Return appropriate status codes  
✅ Use TypeScript types everywhere  
✅ Implement pagination for lists  
✅ Handle errors gracefully  

### DON'T
❌ Expose sensitive data in responses  
❌ Trust client-side data without validation  
❌ Return stack traces to clients  
❌ Bypass RLS policies  
❌ Use raw SQL (use Drizzle ORM)  
❌ Forget to handle edge cases  
❌ Return different formats for same endpoint  
❌ Skip authorization checks  

---

For implementation examples, see:
- Route handlers: `apps/safety-lms/src/app/api/`
- Validation schemas: `apps/safety-lms/src/lib/validations/`
- Query functions: `apps/safety-lms/src/lib/db/queries/`
- Mappers: `apps/safety-lms/src/lib/mappers/`

