# Agent Implementation Guide - Senza Luce Safaris

## Implemented Features

### 1. Admin Settings System (/admin/settings)
- **General**: site title, URL, theme, timezone, currency, primary color
- **Environment**: selector (dev/staging/production), allowed domains
- **Security**: MFA toggle, session expiration, password policy
- **Roles & Permissions**: CRUD operations with visual matrix
- **Integrations**: SMTP (host/port/username/password), Webhook (URL/secret), Analytics (ID/enabled) with test buttons
- **Feature Flags**: Tours, Bookings, Destinations, Blog, Newsletter, Reviews
- **Data Governance**: retention days, backups toggle
- **Audit Trail**: recent changes display

### 2. Public Website Features
- **Tour Compare**: Add up to 4 tours for side-by-side comparison
- **Shareable URLs**: `?compare=id1,id2,...` for sharing compare selections
- **Toast Notifications**: Variant-aware (success/info/warning/error)
- **SEO**: JSON-LD on tours listing and detail pages

### 3. API Endpoints
- `GET/PATCH /api/settings` - Settings management
- `GET /api/settings/history` - Audit trail
- `GET/POST /api/settings/roles` - Role management
- `PATCH/DELETE /api/settings/roles/:id` - Role operations
- `POST /api/settings/smtp-test` - SMTP test
- `POST /api/settings/webhook-test` - Webhook test
- `GET /api/tours/ids` - Tours by IDs for compare

### 4. Database (Prisma)
- `AppSettings` - Central configuration
- `SettingsAudit` - Audit trail
- `Role` - RBAC roles
- `Theme` enum - LIGHT/DARK/SYSTEM

### 5. Testing
- Unit tests: `src/__tests__/toast.test.ts`
- Integration: `src/__tests__/admin-settings.test.tsx`
- E2E: `src/__tests__/e2e/` (Playwright)

## Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init-settings

# Start development
npm run dev
```

## Access Points
- Admin Settings: `/admin/settings`
- Admin Dashboard: `/admin/dashboard`
- Tours: `/safaris-tours`

## Environment Variables
Ensure `DATABASE_URL` and `DIRECT_URL` are configured in your environment for database connectivity.

## Fixes Applied

### Session 1 (DB & CMS Resilience)
- **Integrations persistence**: Added `smtpHost`, `smtpPort`, `smtpUsername`, `smtpPassword`, `webhookUrl`, `webhookSecret`, `analyticsId`, `analyticsEnabled` to Prisma `AppSettings` model and API Zod schema
- **SSL connection**: Fixed `src/lib/prisma.ts` to properly pass SSL settings (`rejectUnauthorized: false, require: true`) to `pg` pool for Supabase connections
- **Migration support**: Added `directUrl` to Prisma datasource to bypass PgBouncer for schema migrations
- **Label associations**: Added `htmlFor`/`id` pairs to settings form fields for accessibility
- **Try-catch resilience**: Wrapped every Prisma query in `tours.ts`, `destinations.ts`, `blogs.ts`, `accommodations.ts`, `reviews.ts`, `newsletter.ts`, `bookings.ts` to return fallback values instead of throwing
- **Newsletter DB typo fix**: Fixed `networking.ts` → `newsletter.ts` import path
- **Supabase Auth error message**: Login page shows descriptive message for `TypeError: "Failed to fetch"`
- **Test message fix**: Corrected toast expectation in `admin-settings.test.tsx`

### Session 2 (Auth & Image Performance)
- **Invalid Refresh Token**: Added `supabase.auth.signOut({ scope: 'local' })` after custom `admin_session` cookie is set (`src/app/admin/login/page.tsx:95,103`) — clears stale Supabase auth tokens from browser cookies so `@supabase/ssr` client doesn't try to auto-refresh invalid tokens on subsequent page loads
- **Missing `sizes` prop**: Added `sizes` to all 12 `fill` Image occurrences across 9 files (hero, grid cards, gallery, comparison, etc.) to fix Next.js performance warnings

### Session 3 (Runtime Fixes)
- **`roles.map is not a function`**: Fixed response unwrapping in `src/app/admin/settings/page.tsx` — the `/api/settings/roles` endpoints return `{ success: true, data: roles[] }` but the client was treating the whole response as the array. Fixed three places: GET initial fetch (`data?.data ?? []`), POST new role (`r.data`), PATCH update role (`updated.data`)

### Session 4 (Edge Case Handlers)
- **`e.key is undefined` in useHotkey**: Added optional chaining (`e.key?.toLowerCase()`) in `src/hooks/use-hotkey.ts:23` to handle IME composition and synthetic events where `key` is undefined
- **Non-JSON response in SessionCheck**: Added `response.ok` guard before `response.json()` in `src/components/system/SessionCheck.tsx:19` — prevents `SyntaxError` when auth-check API returns HTML "Internal Server Error" page instead of JSON (e.g., during DB outage)
- **Missing key prop in AccommodationSection**: Changed `<> </>` to `null` in `src/components/destinations/AccommodationSection.tsx:34` to fix React warning when `typeOrder.map()` returns an element without a `key`

### Session 5 (Static Data Fallback for DB Outages)
- **Static data fallback**: All 5 content DB modules (destinations, tours, accommodations, blogs, reviews) import static data from `src/data/*.ts` and return it in catch blocks when the database is unreachable — public site now renders full content even when Supabase DB is paused/hibernating
- **Faster failover**: Reduced `connectionTimeoutMillis` from 60s → 10s, `statement_timeout` from 60s → 30s, retries from 5 → 2 — failover to static data completes in seconds instead of minutes
- **Build resilience**: 136/136 pages build successfully with full content from static data when DB is unreachable