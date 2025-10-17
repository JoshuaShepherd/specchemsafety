# Safety Database Setup Instructions

## Environment Configuration

To use Drizzle ORM with the Safety database, you need to create a `.env.local` file in the `apps/crm/` directory with the following content:

```bash
# Supabase Safety Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://radbukphijxenmgiljtu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZGJ1a3BoaWp4ZW5tZ2lsanR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDY1MzAsImV4cCI6MjA3NDgyMjUzMH0.TBOPPqBODsJSGeJkMI7mctVd2oPWMKAcsI74HGFRaJQ

# Database URL for Drizzle ORM
# You need to get the actual password from Supabase dashboard > Settings > Database
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.radbukphijxenmgiljtu.supabase.co:5432/postgres

# Development
NODE_ENV=development
```

## Getting the Database Password

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select the "Safety" project (radbukphijxenmgiljtu)
3. Go to Settings > Database
4. Copy the connection string and extract the password
5. Replace `[YOUR_PASSWORD]` in the DATABASE_URL with the actual password

## Testing the Setup

Once you've created the `.env.local` file, run:

```bash
cd apps/crm
npx tsx src/lib/db/test-connection.ts
```

This will test that Drizzle ORM can connect to the Safety database without interfering with existing authentication or Safety training data.

## Available Commands

- `pnpm db:generate` - Generate migration files
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio for database exploration
- `pnpm db:migrate` - Apply migrations to database
- `pnpm db:introspect` - Introspect existing database schema

## Important Notes

- **Never modify** existing Supabase auth tables
- **Never modify** existing Safety training tables
- The Safety database already contains:
  - 11 plants
  - 3 courses
  - 2 enrollments
  - 2 progress records
  - 2 admin roles
  - User profiles linked to auth.users
