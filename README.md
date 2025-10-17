# SpecChem Safety LMS v2

> **Production Learning Management System for HazMat and OSHA Safety Training**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Private-red)]()

## 🎯 Overview

The SpecChem Safety LMS is a comprehensive, production-ready Learning Management System designed specifically for industrial safety training, including HazMat and OSHA compliance courses. Built with modern web technologies and enterprise-grade security.

### Key Features

- 🏭 **Multi-tenant Architecture** - Plant-based data isolation with RLS
- 👥 **Role-based Access Control** - Employee, Manager, and Admin roles
- 📚 **Rich Course Content** - 12 content block types with interactive elements
- ✅ **Quiz System** - Multiple choice and true/false with instant feedback
- 📊 **Progress Tracking** - Section-level progress with time tracking
- 🌍 **Internationalization** - Multi-language support (EN, ES)
- 🔐 **Enterprise Security** - Supabase Auth with RLS policies
- 📱 **Responsive Design** - Mobile-first with Tailwind CSS
- ♿ **Accessibility** - WCAG compliant with shadcn/ui components

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.17.0 or higher
- **pnpm**: 8.0.0 or higher
- **Git**: Latest version
- **Supabase Account**: Active project

### Installation

```bash
# Clone the repository
git clone https://github.com/Josh-SpecChem/specchem-safety-lms-v2.git
cd specchem-safety-lms-v2

# Install dependencies
pnpm install

# Set up environment variables
cd apps/safety-lms
cp env.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

Visit http://localhost:3000 to see your application.

## 📁 Project Structure

```
specchem-safety-lms-v2/
├── apps/
│   └── safety-lms/              # Main Next.js application
│       ├── src/
│       │   ├── app/             # Next.js App Router pages
│       │   ├── components/      # React components
│       │   ├── hooks/           # Custom React hooks
│       │   └── lib/
│       │       ├── db/          # Database schema & queries
│       │       ├── mappers/     # Type transformations
│       │       ├── validations/ # Zod schemas
│       │       └── supabase/    # Supabase client
│       ├── drizzle/             # Database migrations
│       └── public/              # Static assets
├── packages/
│   ├── contracts/               # API contracts & OpenAPI
│   ├── db/                      # Shared database schema
│   ├── shared/                  # Shared utilities
│   └── ui/                      # Shared UI components
├── docs/                        # Documentation
└── DEPLOYMENT_GUIDE.md         # Deployment instructions
```

## 🏗️ Architecture

This application follows a **5-Layer Architecture** pattern:

1. **Schema Layer** (`src/lib/db/schema/`) - Drizzle ORM table definitions
2. **Query Layer** (`src/lib/db/queries/`) - Database operations
3. **Mapper Layer** (`src/lib/mappers/`) - Type transformations
4. **Validation Layer** (`src/lib/validations/`) - Zod schemas
5. **API/Service Layer** (`src/app/api/`) - Business logic

### Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.5 (App Router + Turbopack) |
| Language | TypeScript 5.9 (strict mode) |
| Database | PostgreSQL via Supabase |
| ORM | Drizzle ORM 0.44+ |
| Authentication | Supabase Auth |
| Validation | Zod 4+ |
| UI Framework | React 19 |
| Styling | Tailwind CSS 4 |
| Component Library | shadcn/ui + Radix UI |
| State Management | React Hooks |
| Package Manager | pnpm (monorepo) |
| Deployment | Vercel |

## 🔒 Security

- **Authentication**: Supabase Auth with secure session management
- **Authorization**: Role-based access control (RBAC)
- **Data Isolation**: Row Level Security (RLS) policies
- **Input Validation**: Zod schemas on all inputs
- **SQL Injection Prevention**: Drizzle ORM with prepared statements
- **XSS Protection**: React's built-in escaping + CSP headers
- **HTTPS**: Enforced in production
- **Environment Variables**: Secure storage in Vercel

## 📚 Documentation

- [📖 Project Overview](./docs/PROJECT_OVERVIEW.md)
- [💻 Development Guide](./docs/DEVELOPMENT_GUIDE.md)
- [🗄️ Database Schema](./docs/DATABASE_SCHEMA.md)
- [🔌 API Architecture](./docs/API_ARCHITECTURE.md)
- [🚀 Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [🔐 RLS Verification](./docs/RLS_VERIFICATION_REPORT.md)

## 🛠️ Development

### Available Commands

```bash
# Development
pnpm dev                    # Start dev server with Turbopack
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
pnpm lint:fix              # Fix ESLint errors
pnpm type-check            # TypeScript type checking

# Database
pnpm db:generate           # Generate migrations
pnpm db:migrate            # Run migrations
pnpm db:studio             # Open Drizzle Studio
pnpm db:push               # Push schema changes
pnpm db:introspect         # Introspect database

# Testing (future)
pnpm test                  # Run tests
pnpm test:watch            # Run tests in watch mode
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Install Git** (if not already installed):
   - Download from https://git-scm.com/download/win
   - Follow installation wizard

2. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/Josh-SpecChem/specchem-safety-lms-v2.git
   git push -u origin main
   ```

3. **Deploy to Vercel**:
   - Visit https://vercel.com/new
   - Import your GitHub repository
   - Set root directory to `apps/safety-lms`
   - Add environment variables
   - Deploy!

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## 🤝 Contributing

This is a private, production application for SpecChem, LLC. Internal contributions should follow these guidelines:

1. Create a feature branch from `main`
2. Follow the established architecture patterns
3. Write TypeScript with strict mode
4. Add Zod validation for all inputs
5. Test thoroughly before merging
6. Update documentation as needed

### Code Quality Standards

- ✅ TypeScript strict mode (no `any`)
- ✅ ESLint rules compliance
- ✅ Consistent formatting
- ✅ Proper error handling
- ✅ Security best practices
- ✅ Accessibility standards

## 📊 Database

### Schema Management

- **ORM**: Drizzle ORM with PostgreSQL
- **Migrations**: Auto-generated, version-controlled
- **RLS**: Row Level Security enabled on all tables
- **Multi-tenancy**: Plant-based data isolation

### Key Tables

- `profiles` - User profiles with role and plant assignment
- `courses` - Course metadata and configuration
- `course_sections` - Course content organization
- `content_blocks` - Rich content with 12 block types
- `quiz_questions` - Assessment questions
- `user_progress` - Section-level progress tracking
- `enrollments` - Course enrollment management

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
- Clear `.next` directory: `rm -rf apps/safety-lms/.next`
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Check Node version: `node --version` (should be ≥18.17.0)

**Database Connection:**
- Verify Supabase credentials in `.env.local`
- Check Supabase project status (not paused)
- Ensure RLS policies are active

**Type Errors:**
- Run `pnpm type-check` to identify issues
- Regenerate types after schema changes
- Check imports and exports

## 📝 License

**Private & Proprietary**

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

© 2025 SpecChem, LLC. All rights reserved.

## 👥 Team

**Maintainer**: Josh Shepherd (jshepherd@specchemllc.com)  
**Company**: SpecChem, LLC  
**Project**: Safety Training LMS v2

## 🔗 Links

- [Supabase Dashboard](https://supabase.com/dashboard/project/radbukphijxenmgiljtu)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

---

**Status**: 🟢 Production Ready  
**Version**: 2.0.0  
**Last Updated**: October 17, 2025


