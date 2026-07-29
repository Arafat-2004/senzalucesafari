# Senza Luce Safaris


Senza Luce Safaris is a premium, enterprise-grade safari tourism platform for Tanzania, designed to offer high-performance page loads, immersive visual design, offline-resilient browsing, and a robust admin Content Management System (CMS).

Built on **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Prisma ORM**, and **Supabase (PostgreSQL)**.

---

## 🏛️ Architecture & System Design

The application follows a modern Server-First architecture utilizing Next.js App Router.

```mermaid
graph TD
    Client[Browser Client] -->|HTTP Request| Middleware[RBAC / Security Middleware]
    Middleware -->|Authorized| Pages[App Router Page.tsx]
    Pages -->|Server Side Rendering| DBResilience[Database Resilience Layer]
    DBResilience -->|Primary Query| Prisma[Prisma ORM Client]
    Prisma -->|Connection Pooler| Supabase[(Supabase PostgreSQL)]
    DBResilience -->|Database Timeout / Down| StaticFallback[Static JSON Fallback data/]
    Pages -->|Static Content| HTML[HTML & WebP Assets]
    Client -->|Client Interactions| ClientComp[Client Components]
    ClientComp -->|Server Actions / API| APIs[API Routes / actions.ts]
    APIs --> Prisma
```

### Key Architectural Pillars
1. **Server Components by Default**: Pages are rendered on the server to optimize First Contentful Paint (FCP) and SEO, while client interactivity is isolated inside `"use client"` components.
2. **Database Resilience & Failover**: All content modules (Tours, Destinations, Accommodations, Blogs, Reviews) wrap database queries in custom resilience boundaries. If the database is unreachable, paused, or slow, the application activates local static fallbacks in under 10 seconds.
3. **PWA & Offline Capability**: The application functions as an installable Progressive Web App (PWA) with background service workers (`sw.js`) and cache storage caching essential pages for offline reading.

---

## 💻 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.0-canary | Modern App Router, Server Actions, & Turbopack |
| **UI Library** | React 19.2.4 | Concurrent rendering, Server Actions hook integrations |
| **Styling** | Tailwind CSS v4 | Ultra-fast CSS compile speeds, CSS variables-based theme |
| **Database** | Supabase (PostgreSQL) | Reliable cloud database with PgBouncer connection pooler |
| **ORM** | Prisma 6.19 | Type-safe schema querying and automated migration tracking |
| **Authentication** | Supabase Auth + `@supabase/ssr` | Secure JWT cookies, refresh tokens, and local session guards |
| **Testing** | Jest + Playwright | Unit/Integration testing and E2E browser automation |
| **PWA** | Custom Service Worker | Offline fallback pages, manifest styling, caching |

---

## 📁 Folder Structure

```
senzalucesafaris/
├── .github/workflows/          # CI/CD pipelines (Lint, Typecheck, Test, Build, Deploy)
├── docs/                       # Development logs, reports, and architecture guides
├── prisma/                     # Database schema, migration scripts, and seeds
├── public/                     # Static assets, fonts, icons, PWA manifest & service worker
├── scripts/                    # Helper shell/node scripts for migrations & tests
├── src/
│   ├── app/                    # Next.js page routes, layouts, and API endpoints
│   │   ├── admin/              # Secured CMS dashboard pages
│   │   ├── api/                # Public and admin REST API endpoints
│   │   └── offline/            # Offline-only PWA fallback page
│   ├── components/             # Reusable visual components
│   │   ├── admin/              # Admin panel CMS widgets
│   │   ├── home/               # Landing page marketing sections
│   │   └── ui/                 # Basic design-system primitives
│   ├── data/                   # Static offline-fallback data
│   ├── hooks/                  # Custom client React hooks
│   ├── lib/                    # Shared utility classes, PDF builders, & clients
│   │   ├── email/              # Transactional email templates (Resend)
│   │   ├── reliability/        # DB timeout guards & connection check trackers
│   │   └── revenue/            # Pricing engines and adaptive adapters
│   ├── middleware/             # Role-based access control rules
│   └── types/                  # Shared TypeScript type definitions
└── package.json                # Project configurations & dependency versions
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
# ---- Database (Supabase PostgreSQL via Prisma) ----
# Connection pooling URL (PGBouncer port 6543)
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-1.eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
# Direct URL for migrations (Session port 5432)
DIRECT_URL="postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres"

# ---- Supabase ----
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1Ni..."

# ---- Security & MFA ----
MFA_ENCRYPTION_KEY="[Secure 32+ char key]"
SETTINGS_ENCRYPTION_KEY="[Secure key for settings encryption]"
SESSION_SIGNING_SECRET="[Secure key for signing session tokens]"

# ---- Email (Resend) ----
RESEND_API_KEY="re_..."
EMAIL_FROM="info@senzalucesafari.com"

# ---- Web Push ----
NEXT_PUBLIC_VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
VAPID_SUBJECT="mailto:admin@senzalucesafari.com"

# ---- App Settings ----
NEXT_PUBLIC_SITE_URL="https://www.senzalucesafari.com"
NEXT_PUBLIC_MEDIA_PROVIDER="supabase" # "supabase" or "cloudinary"
```

---

## 🛠️ Development & Local Setup

### 1. Initial Setup
```bash
# Clone the repository
git clone <repo-url> && cd senzalucesafaris

# Install exact lockfile dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### 2. Database Syncing
```bash
# Generate Prisma Client classes
npx prisma generate

# Apply migrations to local/remote database
npx prisma migrate dev

# Seed database with initial packages, FAQs, and admin user
npm run db:seed
```

### 3. Execution Commands
```bash
# Start development server
npm run dev

# Run ESLint validation
npm run lint

# Run TypeScript compilation audit
npm run typecheck

# Run Jest unit/integration tests
npm test
```

---

## 🚀 Production Deployment

The project is preconfigured to build and deploy to **Vercel** connected directly with **Supabase**.

### Build Phase
During deployment, Next.js generates static versions of pages. If the database is unreachable during the build phase, the build script dynamically falls back to static seed data, ensuring builds never fail due to database downtime.

### Production Deploy Command (Vercel Build Command)
```bash
npx prisma generate && npm run build
```

---

## 🔌 Database Resilience & Timeout Logic

To prevent blocking requests when database connections fail, the Prisma client singleton ([`prisma.ts`](file:///c:/WORKSPACE/ARAFAT/senzalucesafaris/src/lib/prisma.ts)) uses aggressive connection timeout limitations:
- **`connectionTimeoutMillis`**: Max 10 seconds.
- **`statement_timeout`**: Max 30 seconds.
- **Query Fallbacks**: All modules fetch data through resilient wrappers. If the database throws a timeout, the system switches to static files in `src/data/` immediately.

---

## 🛡️ Authentication & MFA

1. **Session Control**: Session cookie expiration limits are governed by the database `AppSettings`. If a session times out, the client automatically redirects to `/admin/login?reason=session_expired`.
2. **MFA Support**: Administrators can enforce Multi-Factor Authentication (TOTP). During login, if MFA is enabled, the user is prompted to submit a code from their authenticator app before cookies are issued.
3. **Role-Based Access**: The application maps pages to permissions using a visual matrix in Admin Settings. Unprivileged admin requests are blocked and redirected to the dashboard with an error banner.

---

## 🔧 Troubleshooting

### Invalid Refresh Token Loop
If stale browser cookies contain invalid auth tokens, Supabase may enter a login refresh loop. The login handler automatically wipes local Supabase cookies before starting a new session:
```typescript
supabase.auth.signOut({ scope: 'local' })
```

### Hydration Mismatch on Dates
Date string formatting can differ between the server timezone (UTC) and the client browser timezone. To avoid this, use the deterministic `formatDate()` utility which explicitly locks date outputs to a static locale (`en-GB`) and timezone (`UTC`).

---

## 📋 Deployment Checklist

- [ ] All environment variables are added in the Vercel dashboard.
- [ ] Direct database URL is configured to bypass PgBouncer for migrations.
- [ ] Database trigger functions are applied for auditing logs.
- [ ] Service worker registration is checked and active.
- [ ] Apple touch icon and PWA manifest files are valid and load without 404s.
- [ ] Robots.txt allows search engines to crawl public routes but blocks `/admin/` and `/api/`.
- [ ] Structured metadata (JSON-LD) is active on tours and destinations pages.
- [ ] ESLint output returns `0 problems` (ZERO warnings, ZERO errors).
- [ ] TypeScript checks output `TS: PASS`.
- [ ] Unit tests pass successfully.
