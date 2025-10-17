# SpecChem Safety LMS - Documentation

## Quick Start

Welcome to the Safety LMS documentation! Start here:

1. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Understand what this system is and how it's built
2. **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Learn how to develop features and follow patterns
3. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Reference for all database tables and relationships
4. **[API_ARCHITECTURE.md](./API_ARCHITECTURE.md)** - API patterns, endpoints, and best practices

## Documentation Philosophy

This documentation is **minimal and essential**. Every document here:
- ✅ Reflects the **actual implementation** (not plans or ideas)
- ✅ Provides **practical, actionable information**
- ✅ Stays **up-to-date** with the codebase
- ✅ Follows **best practices for context coding in Cursor**

We removed all historical artifacts, planning documents, and outdated guides. What remains is the truth about the system as it exists today.

## For New Developers

**Read in this order:**

1. **PROJECT_OVERVIEW.md** (15 minutes)
   - Understand the tech stack
   - Learn the project structure
   - Grasp the core architecture

2. **DEVELOPMENT_GUIDE.md** (30 minutes)
   - See complete examples of adding features
   - Learn the 5-layer architecture pattern
   - Understand common development tasks

3. **DATABASE_SCHEMA.md** (20 minutes)
   - Reference when working with database
   - Understand relationships and constraints
   - Learn RLS and multi-tenancy patterns

4. **API_ARCHITECTURE.md** (20 minutes)
   - Reference when building APIs
   - Learn request/response patterns
   - Understand authentication flow

**Total reading time**: ~90 minutes to be fully productive

## For Experienced Developers

**Quick Reference:**
- Database Schema → `DATABASE_SCHEMA.md`
- API Endpoints → `API_ARCHITECTURE.md`
- Architecture Patterns → `DEVELOPMENT_GUIDE.md` (Examples section)
- Codebase Tour → `PROJECT_OVERVIEW.md` (Project Structure)

## Documentation Maintenance

### When to Update

Update docs when you:
- Add new database tables
- Create new API endpoints
- Change authentication/authorization
- Modify core architecture patterns
- Add new content block types

### What NOT to Document

Don't document:
- Implementation details (code is self-documenting)
- Temporary features or experiments
- Historical decisions or alternatives considered
- Step-by-step tutorials (examples are better)
- Obvious or self-explanatory code

### How to Update

1. Keep docs in sync with code changes
2. Update examples to reflect real patterns
3. Remove outdated information immediately
4. Use actual code snippets (not pseudocode)
5. Test that examples actually work

## Cursor AI Integration

This project has optimized Cursor rules:
- **Location**: `.cursor/rules/safety-lms-rules.mdc`
- **Purpose**: Guide AI to follow project-specific patterns
- **Scope**: Always applied to all files

The rules are based on the actual codebase and enforce:
- The 5-layer architecture pattern
- Authentication and authorization patterns
- Database query patterns with Drizzle
- Validation with Zod
- Consistent API response formats
- Multi-tenancy best practices

## Key Architectural Decisions

### Why 5 Layers?
- **Separation of concerns** - Each layer has one job
- **Type safety** - Transformations at boundaries
- **Testability** - Each layer can be tested independently
- **Maintainability** - Changes are isolated

### Why Drizzle ORM?
- **Type safety** - Full TypeScript integration
- **Performance** - Optimized SQL generation
- **Developer experience** - Excellent autocomplete
- **Migration management** - Built-in migration system

### Why Zod Validation?
- **Type inference** - Types derived from schemas
- **Runtime safety** - Validate at runtime
- **Comprehensive** - Rich validation rules
- **Composable** - Build complex schemas easily

### Why Server Components by Default?
- **Performance** - Less JavaScript sent to client
- **SEO** - Server-rendered content
- **Security** - Sensitive logic stays server-side
- **Data fetching** - Direct database access

## Support

### Getting Help

1. **Read the docs** (this folder)
2. **Check existing code** for similar patterns
3. **Use Drizzle Studio** to inspect database
4. **Check Supabase logs** for errors
5. **Ask team members** in Slack/Teams

### Common Issues

**Authentication errors:**
- Verify Supabase credentials in `.env.local`
- Check middleware configuration
- Inspect cookies in browser DevTools

**Type errors:**
- Run `pnpm type-check`
- Regenerate types after schema changes
- Check imports and exports

**Database errors:**
- Use Drizzle Studio to inspect data
- Check RLS policies in Supabase
- Verify foreign key constraints

**Build errors:**
- Clear `.next` folder
- Run `pnpm install` again
- Check for missing dependencies

## Contributing

### Before Making Changes

1. Read relevant documentation
2. Understand the 5-layer pattern
3. Look at similar existing code
4. Follow established conventions

### Making Changes

1. Update schema if needed
2. Add/update query functions
3. Create/update mappers
4. Define/update Zod schemas
5. Implement API routes
6. Update documentation if needed

### Code Review Checklist

- [ ] Follows 5-layer architecture
- [ ] Authentication is checked
- [ ] Input is validated with Zod
- [ ] Response format is consistent
- [ ] Multi-tenancy is respected
- [ ] TypeScript strict mode passes
- [ ] No linting errors
- [ ] Documentation updated (if needed)

## Project Status

**Current Version**: 2.0 (Complete rewrite)  
**Status**: Production  
**Last Documentation Update**: January 2025

### Completed Features
✅ Authentication with Supabase Auth  
✅ Course delivery with 12 content block types  
✅ Quiz system with immediate feedback  
✅ Section-level progress tracking  
✅ Dashboard with statistics  
✅ Mobile-responsive design  
✅ Dark mode support  
✅ Role-based access control  
✅ Plant-based multi-tenancy  

### In Progress
🚧 Content authoring UI  
🚧 Advanced reporting  
🚧 Certificate generation  

### Planned
📋 Offline capability  
📋 Push notifications  
📋 Advanced analytics  
📋 HR system integration  

---

**Remember**: These docs reflect the actual implementation, not aspirations. When code changes, update the docs.

