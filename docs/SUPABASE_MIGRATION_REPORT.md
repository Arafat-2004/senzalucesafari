# Supabase Migration Report

Date: 2026-04-14

## Status

Supabase migration completed and verified from local source modules into PostgreSQL.

## Source datasets migrated

- Tours: 33 records (`src/data/tours.ts`)
- Destinations: 5 records (`src/data/destinations.ts`)
- Accommodations: 9 records (`src/data/accommodations.ts`)
- Vehicles: 3 records (`src/app/vehicles/data.ts`)
- Blog posts: 6 records (`src/data/blogs.ts`)
- Reviews: 6 records (`src/data/sample-reviews.ts`)
- Tour-destination relations: 80 records

## Verification results

Independent SQL checks after migration:

- `tours`: 33
- `destinations`: 5
- `accommodations`: 9
- `vehicles`: 3
- `blog_posts`: 6
- `reviews`: 6
- `tour_destinations`: 80
- Orphan `reviews.tourId`: 0
- Orphan `tour_destinations` relations: 0

## Migration script

- Script: `scripts/migrate-source-to-supabase.ts`
- npm command: `npm run db:migrate:supabase`

This script performs:

- idempotent upserts (safe re-runs)
- relation inserts for `tour_destinations`
- post-run count parity checks
- referential integrity checks

## Supabase app connection template

Use these variables in your local environment:

```env
DATABASE_URL="postgresql://postgres.lmpvkxnudhyxjigugnzj:[YOUR-PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.lmpvkxnudhyxjigugnzj.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://lmpvkxnudhyxjigugnzj.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_[YOUR-PUBLISHABLE-KEY]"
SUPABASE_PROJECT_REF="lmpvkxnudhyxjigugnzj"
```

## Supabase CLI commands

```bash
supabase login
supabase init
supabase link --project-ref lmpvkxnudhyxjigugnzj
```

## Optional agent skills

Install Supabase agent skills:

```bash
npx skills add supabase/agent-skills
```

Note: this command is interactive and requires selecting the skills in the prompt.
