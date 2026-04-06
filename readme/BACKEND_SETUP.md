# Backend Setup Guide

## Overview

The backend uses Supabase for database, authentication, and serverless functions.

## Prerequisites

- Supabase account (free tier available at https://supabase.com)
- Node.js/npm or Bun
- Supabase CLI

## Installation

### 1. Install Supabase CLI

```bash
npm install -g supabase
# or
brew install supabase/tap/supabase
```

### 2. Initialize Supabase Project

```bash
cd backend/supabase
supabase init
```

### 3. Link to Your Supabase Project

```bash
supabase link --project-ref your-project-ref
```

Get your project reference from the Supabase dashboard.

### 4. Set Environment Variables

Create `.env.local` in `backend/supabase/`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Get these values from:
1. Go to Supabase Dashboard
2. Project Settings > API
3. Copy the URL and keys

## Project Structure

```
backend/supabase/
├── functions/              # Edge Functions (serverless)
│   └── health-assistant/   # AI health assistant function
├── migrations/             # Database migrations
│   └── 20260226164740_*.sql
├── config.toml            # Supabase configuration
└── .env.local             # Environment variables (local only)
```

## Key Features

### Database (PostgreSQL)

Managed by Supabase with real-time capabilities.

#### Tables (based on migrations):
- Users profiles
- Medical history
- SOS alerts
- Warrior registrations
- Notifications

### Edge Functions

Serverless functions for backend logic:

- **health-assistant**: AI-powered health assistance

Deploy functions with:
```bash
supabase functions deploy
```

### Authentication

Handled by Supabase Auth with support for:
- Email/password
- OAuth providers
- Magic links

### Real-time Subscriptions

WebSocket-based real-time updates for:
- SOS alerts
- Notifications
- Health status updates

## Database Management

### Migrations

Create new migrations:
```bash
supabase migration new table_name
```

Apply migrations:
```bash
supabase db push
```

Pull remote schema:
```bash
supabase db pull
```

### Viewing Database

Connect to your database:
```bash
psql postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
```

Or use Supabase Dashboard > SQL Editor

## Edge Functions

### Development

```bash
supabase functions serve
```

### Deployment

```bash
supabase functions deploy [function-name]
```

### Example Function Structure

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  return new Response(JSON.stringify({ message: "Hello" }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

## Common Tasks

### View Logs

```bash
supabase functions logs [function-name]
```

### Update Schema

1. Make changes in Supabase Dashboard
2. Pull schema: `supabase db pull`
3. This creates a migration file

### Reset Database

```bash
supabase db reset
```

⚠️ **Warning**: This deletes all data!

## Environment Variables

### Development (.env.local)

```env
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Production

Set via Supabase Dashboard > Settings > Environment

## API Integration

Frontend connects to backend via:

```typescript
import { createClient } from "@supabase/supabase-js"

const client = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)
```

## Security

- Row Level Security (RLS) policies protect data
- Service role key is for admin operations only
- Anon key for client-side operations
- Never expose service role key in frontend

## Troubleshooting

### Connection Issues

```bash
supabase status
```

### Database Connection Error

1. Check `.env.local` values
2. Verify project is active in dashboard
3. Check network connectivity

### Migration Failed

```bash
supabase migration list
supabase migration resolve [migration-name]
```

### Function Deploy Failed

```bash
supabase functions list
supabase functions delete [function-name]
supabase functions deploy
```

## Deployment

### To Production

1. Ensure all migrations are applied
2. Deploy functions:
   ```bash
   supabase functions deploy
   ```
3. Update frontend environment variables
4. Test integration

### Database Backups

Supabase automatically backs up daily.

Manual backup:
```bash
supabase db dump
```

## Monitoring

- Go to Supabase Dashboard
- Check:
  - Function logs
  - Database performance
  - API usage
  - Error rates

## Cost Optimization

- Use indexing on frequently queried columns
- Implement pagination for large result sets
- Cache data with React Query
- Archive old data

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Deno Documentation](https://deno.land/docs)
- [Edge Functions Best Practices](https://supabase.com/docs/guides/functions)
