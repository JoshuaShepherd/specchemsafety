# SpecChem Safety LMS - Project Overview

## What Is This?

The **SpecChem Safety LMS** is a modern Learning Management System specifically built for industrial safety training. It's a full-stack Next.js application that delivers HazMat and OSHA compliance training to plant associates and employees across multiple facilities.

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 with App Router & Turbopack
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: React hooks and server components
- **Forms**: React Hook Form + Zod validation

### Backend  
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM 0.44+
- **Authentication**: Supabase Auth
- **API**: Next.js Route Handlers (App Router)
- **Validation**: Zod 4+

### Development Tools
- **Package Manager**: pnpm (monorepo with workspaces)
- **Build Tool**: Turbopack (Next.js 15)
- **Linting**: ESLint 9
- **Type Checking**: TypeScript compiler

## Project Structure

```
specchem-safety-lms-v2-main/
├── apps/
│   └── safety-lms/              # Main Next.js application
│       ├── src/
│       │   ├── app/             # Next.js App Router pages & API routes
│       │   │   ├── api/         # Backend API endpoints
│       │   │   ├── auth/        # Authentication pages
│       │   │   ├── courses/     # Course pages
│       │   │   ├── dashboard/   # Dashboard pages
│       │   │   └── ...
│       │   ├── components/      # React components
│       │   │   ├── ui/          # shadcn/ui components
│       │   │   ├── course/      # Course-specific components
│       │   │   ├── content/     # Content rendering components
│       │   │   ├── quiz/        # Quiz components
│       │   │   └── ...
│       │   ├── hooks/           # Custom React hooks
│       │   └── lib/             # Core library code
│       │       ├── db/          # Database layer
│       │       │   ├── schema/  # Drizzle schema definitions
│       │       │   └── queries/ # Database query functions
│       │       ├── validations/ # Zod validation schemas
│       │       ├── mappers/     # Data transformation layer
│       │       ├── services/    # Business logic layer
│       │       ├── supabase/    # Supabase client utilities
│       │       └── types/       # TypeScript type definitions
│       ├── drizzle.config.ts    # Drizzle ORM configuration
│       ├── middleware.ts        # Next.js middleware (auth)
│       └── package.json
│
├── packages/
│   ├── contracts/               # Shared TypeScript contracts
│   ├── db/                      # Shared database schemas
│   ├── shared/                  # Shared utilities
│   └── ui/                      # Shared UI components
│
└── docs/                        # Documentation (you are here)
```

## Core Architecture

### Data Flow Pattern

```
User Request → Middleware (Auth) → API Route → Service Layer → Mapper → Query → Database
                                      ↓
                                  Validation (Zod)
```

### Key Architectural Layers

1. **Schema Layer** (`src/lib/db/schema/`)
   - Drizzle ORM table definitions
   - Type-safe database schema
   - Relations and constraints

2. **Query Layer** (`src/lib/db/queries/`)
   - Reusable database query functions
   - Type-safe query builders
   - Complex joins and aggregations

3. **Mapper Layer** (`src/lib/mappers/`)
   - Transform database types to API contracts
   - Transform API requests to database inserts
   - Enforce business rules and data shapes

4. **Validation Layer** (`src/lib/validations/`)
   - Zod schemas for all inputs
   - Request/response validation
   - Type inference from schemas

5. **Service Layer** (`src/lib/services/`)
   - Business logic orchestration
   - Multi-step operations
   - Cross-cutting concerns

6. **API Layer** (`src/app/api/`)
   - Next.js route handlers
   - Request/response handling
   - Authentication checks

7. **UI Layer** (`src/app/` + `src/components/`)
   - React Server Components
   - Client components for interactivity
   - shadcn/ui design system

## Database Architecture

### Core Entities

1. **Courses** - Training courses (HazMat, OSHA, etc.)
2. **Course Sections** - Chapters/modules within courses
3. **Content Blocks** - Structured content (text, images, videos, etc.)
4. **Quiz Questions** - Assessments with multiple-choice/true-false
5. **User Progress** - Tracking completion and time spent
6. **Profiles** - User information linked to Supabase Auth
7. **Plants** - Manufacturing facilities (multi-tenancy)
8. **Enrollments** - Course assignments to users

### Multi-Tenancy Model

The system uses **plant-based multi-tenancy**:
- Each user belongs to a plant
- Content and progress are scoped to plants
- RLS (Row Level Security) enforces data isolation

## Authentication & Authorization

### Authentication
- Powered by **Supabase Auth**
- Email/password authentication
- Session-based (JWT)
- Middleware protects all routes except `/auth/login`

### Authorization Roles
- **Employee** - Can take courses, view own progress
- **Manager** - Can view reports for their plant
- **Admin** - Full system access, content management

## Key Features

### 1. Course Delivery
- 12 content block types (hero, text, image, video, table, list, grid, callout, quote, divider, audio, card)
- Responsive content rendering
- Progress tracking per section
- Mobile-friendly interface

### 2. Quiz System
- True/False questions
- Multiple choice questions
- Immediate feedback
- Detailed explanations
- Pass/fail criteria

### 3. Progress Tracking
- Section-level completion
- Time spent tracking
- Overall course progress
- Completion certificates

### 4. User Management
- Profile management
- Plant assignment
- Role-based access
- Activity logging

### 5. Reporting & Analytics
- Dashboard statistics
- Course completion rates
- User progress reports
- Plant-level analytics

## Development Workflow

### Local Development
```bash
# Install dependencies
pnpm install

# Run development server
npm run dev

# Access at http://localhost:3000
```

### Database Commands
```bash
# Generate migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio

# Push schema directly (dev only)
pnpm db:push
```

### Code Quality
```bash
# Lint
pnpm lint

# Type check
pnpm type-check

# Lint and fix
pnpm lint:fix
```

## Environment Variables

Required in `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://radbukphijxenmgiljtu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Database (Drizzle)
DATABASE_URL=postgresql://postgres:password@db.radbukphijxenmgiljtu.supabase.co:5432/postgres

# Development
NODE_ENV=development
```

## Current Status

### ✅ Complete
- Full authentication system with Supabase
- Course delivery with 12 content block types
- Quiz system with immediate feedback
- User progress tracking
- Section navigation
- Dashboard with statistics
- Mobile-responsive design
- Dark mode support

### 🚧 In Progress
- Content authoring UI for admins
- Advanced reporting features
- Certificate generation system
- Multi-language support (English/Spanish content exists)

### 📋 Planned
- Offline capability
- Push notifications for course assignments
- Advanced analytics dashboard
- Integration with HR systems

## Important Notes

### Supabase Auth Preservation
- **NEVER modify** Supabase `auth.*` schema tables
- User profiles in `profiles` table link to `auth.users.id`
- RLS policies enforce security at database level

### Content Management
- Content blocks use JSONB for flexible structure
- Each content type has validation via Zod
- Content is versioned and can be published/unpublished

### Performance Considerations
- Server components load data server-side
- Client components for interactivity only
- Progressive enhancement approach
- Optimistic UI updates where appropriate

## Getting Help

### Key Files to Understand
1. `apps/safety-lms/src/lib/db/schema/index.ts` - All database tables
2. `apps/safety-lms/src/lib/validations/index.ts` - All validation schemas
3. `apps/safety-lms/src/app/api/` - API endpoint patterns
4. `apps/safety-lms/middleware.ts` - Authentication flow

### Common Tasks
- **Add new API endpoint**: Create route in `src/app/api/`
- **Add new database table**: Add schema in `src/lib/db/schema/`
- **Add new component**: Add in `src/components/`
- **Add new validation**: Add Zod schema in `src/lib/validations/`

### Debugging
- Check terminal for build errors
- Check browser console for client errors
- Check Supabase logs for database issues
- Use Drizzle Studio to inspect database

---

**Last Updated**: January 2025  
**Version**: 2.0 (Complete rewrite with Next.js 15)

