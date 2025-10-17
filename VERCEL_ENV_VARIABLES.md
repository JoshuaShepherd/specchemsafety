# SpecChem Safety LMS - Vercel Environment Variables

## How to Set Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below
4. Select the appropriate environment(s): Production, Preview, Development

---

## Required Environment Variables

### Supabase Configuration

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://radbukphijxenmgiljtu.supabase.co` | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Get from Supabase Dashboard → Settings → API | Anonymous/public key (safe for client) |

### Database Configuration

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.radbukphijxenmgiljtu:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres` | Database connection string (use session pooler) |

**To get your database password:**
1. Go to https://supabase.com/dashboard/project/radbukphijxenmgiljtu/settings/database
2. Find "Database password" section
3. Copy the password
4. Replace `[PASSWORD]` in the DATABASE_URL

### Application Configuration

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Your Vercel deployment URL |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Same as APP_URL |
| `NEXTAUTH_SECRET` | Generate new | Run: `openssl rand -base64 32` |

---

## Optional But Recommended

### Admin Access

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Get from Supabase Dashboard → Settings → API | ⚠️ Secret! For server-side admin operations only |

### Build Configuration

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NODE_VERSION` | `18.17.0` | Node.js version for builds |

---

## Optional for Production Enhancements

### Error Monitoring (Sentry)

```bash
SENTRY_DSN=[your-sentry-dsn]
SENTRY_ORG=[your-org]
SENTRY_PROJECT=[your-project]
```

### Rate Limiting (Upstash Redis)

```bash
UPSTASH_REDIS_REST_URL=[your-redis-url]
UPSTASH_REDIS_REST_TOKEN=[your-redis-token]
```

### Email Service (SMTP)

```bash
SMTP_HOST=[your-smtp-host]
SMTP_PORT=587
SMTP_USER=[your-smtp-user]
SMTP_PASSWORD=[your-smtp-password]
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

### Analytics

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=[your-ga-id]
```

---

## Quick Copy-Paste Format

For quick setup, copy this format and fill in the values:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://radbukphijxenmgiljtu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZGJ1a3BoaWp4ZW5tZ2lsanR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDY1MzAsImV4cCI6MjA3NDgyMjUzMH0.TBOPPqBODsJSGeJkMI7mctVd2oPWMKAcsI74HGFRaJQ
DATABASE_URL=postgresql://postgres.radbukphijxenmgiljtu:OzsfCLvrHDp0MciK@aws-1-us-east-2.pooler.supabase.com:5432/postgres
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=[GENERATE_WITH_openssl_rand_base64_32]

# Optional but recommended
NODE_VERSION=18.17.0
```

---

## Environment-Specific Settings

### Production Only
- Set `NODE_ENV=production`
- Use production database
- Enable error monitoring
- Use strong `NEXTAUTH_SECRET`

### Preview Deployments
- Can use same database or separate preview database
- Set `NODE_ENV=preview` or `production`
- Useful for testing before merging to main

### Development
- Not typically used (use `.env.local` for local dev)
- Can set if using Vercel for development deployments

---

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is unique and randomly generated
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is kept secret (never expose to client)
- [ ] `DATABASE_URL` uses secure password
- [ ] All sensitive keys are marked as "Sensitive" in Vercel (hidden by default)
- [ ] Preview deployments use separate database or have proper data isolation

---

## After Setting Variables

1. **Trigger a new deployment** (Vercel will use the new environment variables)
2. **Test the deployment** to ensure everything works
3. **Check logs** in Vercel Dashboard → Deployments → [Your Deployment] → Function Logs

---

## Troubleshooting

### "Database connection failed"
- Verify `DATABASE_URL` is correct
- Check database password is accurate
- Ensure Supabase project is not paused
- Try using direct connection instead of pooler

### "Invalid Supabase credentials"
- Verify `NEXT_PUBLIC_SUPABASE_URL` matches your project
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Keys can be found at: https://supabase.com/dashboard/project/radbukphijxenmgiljtu/settings/api

### "Authentication errors"
- Ensure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your deployment URL
- Check that `NEXT_PUBLIC_APP_URL` is correct

---

**Last Updated:** October 17, 2025

