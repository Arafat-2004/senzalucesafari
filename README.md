# Senza Luce Safaris

Premium safari tourism website for Tanzania. Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase (PostgreSQL), and Prisma ORM.

## Brand Assets

Logo files are organized under `public/logos/` with variants for every context:

| Folder | Files | Usage |
|---|---|---|
| `primary/` | primary-logo.svg, dark-background.svg, light-background.svg | Main vertical logo |
| `horizontal/` | horizontal-logo.svg | Navigation bar, footer |
| `circular/` | circular-logo.svg | Hero section, admin dashboard |
| `monochrome/` | monochrome-black.svg, monochrome-white.svg | Print, single-color contexts |
| `icon/` | icon-mark.svg, favicon.svg | Browser tab, app icons |
| `social/` | social-profile-1080.svg, opengraph-1200x630.svg | Social media, OpenGraph |
| `app/` | app-icon-1024.svg | PWA / mobile app icon |

Brand color constants are defined in `src/lib/brand-colors.ts` and reusable logo components in `src/components/branding/logo-components.tsx`. See `LOGO_FOLDER_STRUCTURE.md` and `OPENCODE_LOGO_INTEGRATION_PROMPT.md` for full setup guides.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.2 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Framer Motion |
| Language | TypeScript (strict mode) |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma 7 |
| Hosting | Vercel |
| Analytics | Vercel Analytics + Speed Insights, Sentry |

## Project Structure

```
senzalucesafaris/
├── docs/                           # Project documentation & reports (143 files)
├── prisma/
│   └── schema.prisma               # Database schema (16 models)
├── public/                         # Static assets, PWA manifest, service worker
├── scripts/                        # DB migration & schema scripts
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (Header, Footer, ThemeProvider)
│   │   ├── page.tsx                # Homepage (11 sections, lazy-loaded)
│   │   ├── error.tsx               # Global error boundary
│   │   ├── loading.tsx             # Global loading state
│   │   ├── not-found.tsx           # 404 page
│   │   ├── globals.css             # Design system & theme variables
│   │   ├── image-styles.css        # Image display rules
│   │   ├── about/                  # About page
│   │   ├── accommodations/         # Accommodations (luxury/mid/budget)
│   │   ├── api/newsletter/         # Newsletter subscribe API route
│   │   ├── blog/                   # Blog listing + [slug] detail + category
│   │   ├── contact/                # Contact page + enquiry form
│   │   ├── destinations/           # Destinations listing + [slug] detail
│   │   ├── enquiry/                # Enquiry page
│   │   ├── faq/                    # FAQ with search + categories
│   │   ├── offline/                # PWA offline fallback
│   │   ├── privacy/                # Privacy policy
│   │   ├── safaris-tours/          # Tours listing + [slug] detail + booking
│   │   ├── sitemap.xml/            # Dynamic XML sitemap
│   │   ├── support/                # Support page
│   │   ├── terms/                  # Terms & conditions
│   │   └── vehicles/               # Vehicle fleet + configurator
│   ├── components/
│   │   ├── ui/                     # Reusable UI primitives (shadcn + custom)
│   │   ├── home/                   # Homepage section components
│   │   ├── layout/                 # Header, Footer
│   │   ├── tours/                  # Tour-specific components
│   │   ├── destinations/           # Destination-specific components
│   │   ├── ErrorBoundary.tsx       # Client error boundary
│   │   ├── NewsletterForm.tsx      # Newsletter subscription form
│   │   ├── PWARegistration.tsx     # Service worker registration
│   │   ├── ReviewSystem.tsx        # Review display system
│   │   └── SectionErrorBoundary.tsx
│   ├── constants/                  # App-wide constants & config
│   │   └── index.ts                # Routes, company info, breakpoints
│   ├── data/                       # Static data sources
│   │   ├── tours.ts                # Tour packages data
│   │   ├── destinations.ts         # Destination data
│   │   ├── accommodations.ts       # Accommodation data
│   │   ├── blogs.ts                # Blog articles
│   │   ├── company.ts              # Company info & testimonials
│   │   └── sample-reviews.ts       # Sample review data
│   ├── features/                   # Feature-based modules (extensible)
│   │   ├── booking/                # Booking feature module
│   │   ├── tours/                  # Tours feature module
│   │   ├── newsletter/             # Newsletter feature module
│   │   └── reviews/                # Reviews feature module
│   ├── generated/                  # Auto-generated code
│   │   └── prisma/                 # Prisma client (do not edit)
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-geolocation.ts
│   │   ├── use-media-query.ts
│   │   ├── use-reduced-motion.ts
│   │   └── use-toast.ts
│   ├── lib/                        # Core utilities & libraries
│   │   ├── animation/              # Animation barrel exports
│   │   │   └── index.ts
│   │   ├── supabase/               # Supabase client configuration
│   │   │   └── client.ts
│   │   ├── booking-pdf.ts          # PDF generation for booking inquiries
│   │   ├── env.ts                  # Type-safe env validation (Zod)
│   │   ├── motion-config.ts        # Animation timing & easing tokens
│   │   ├── motion-variants.ts      # Reusable Framer Motion variants
│   │   ├── multilingual-sitemap.ts # XML sitemap generator
│   │   ├── performance-monitor.ts  # Web Vitals monitoring
│   │   ├── pricing-engine.ts       # Safari pricing calculator
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── typography.ts           # Typography system tokens
│   │   └── utils.ts                # cn() and shared utilities
│   ├── tests/                      # Test files
│   │   ├── pricing-engine.test.ts
│   │   └── setup.ts
│   └── types/                      # Global TypeScript types
│       └── index.ts
├── .env.example                    # Environment template
├── .github/workflows/ci-cd.yml    # CI/CD pipeline
├── AGENTS.md                       # AI agent instructions
├── CLAUDE.md                       # Claude-specific instructions
├── Dockerfile                      # Docker production build
├── components.json                 # shadcn/ui configuration
├── eslint.config.mjs               # ESLint configuration
├── jest.config.js                  # Jest test configuration
├── next.config.ts                  # Next.js configuration
├── package.json
├── postcss.config.mjs              # PostCSS (Tailwind v4)
├── prisma.config.ts                # Prisma migration config
└── tsconfig.json                   # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (PostgreSQL)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url> && cd senzalucesafaris

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase credentials in .env

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to database (if first time)
npx prisma db push

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (all network interfaces) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma db push` | Push schema changes to database |

## Database & Resilience

The Prisma schema defines 17 models, including: Tour, TourPricing, Destination, TourDestination, Accommodation, Vehicle, Booking, Review, Guide, ContactInquiry, Newsletter, BlogPost, FAQ, Media, AppSettings, AdminRole, AdminUser, PageView, and AuditLogs.

- **Resilient Static Fallbacks**: All content modules (tours, destinations, accommodations, blogs, reviews) and global app settings implement automatic try/catch database recovery. If the database is paused or unreachable, they automatically fall back to static local data in `src/data/` within milliseconds to ensure zero-downtime availability.
- **Fast Failover timeouts**: Database pools use reduced timeout settings (10s connection timeout, 30s statement timeout, 2 retries) to enable rapid static fallback activation without blocking requests.

## Celebration & Announcement Banner

Senza Luce Safaris features a premium, animated, and dismissible **Celebration & Announcement Banner** at the very top of the public website.
- **Admin Controls**: Accessible via the **Announcement** tab in Admin Settings (`/admin/settings`). Allows editing banner text, action link, status, and theme style presets.
- **Theme Presets**: Includes custom styled variations for:
  - *Christmas*: Red/Gold festive gradient with animated gift icons.
  - *New Year's Eve*: Dark/Gold shimmering layout with sparkle animations.
  - *Public Holiday*: Royal indigo/pink warm layout.
  - *General*: Classic brand green.
- **Dismissal Persistence**: Uses `sessionStorage` with a hash of the banner content to ensure that once a user dismisses the banner, it remains closed for their session, but reappears if the admin updates the message.

## Key Architecture Decisions

- **App Router** — All pages use Next.js App Router with Server Components by default. Client components are explicitly marked with `"use client"`.
- **Local Dev Service Worker Control** — The root layout automatically unregisters active production service workers and clears client-side cache stores during development. This prevents hydration mismatches and loading stale/cached code in localhost.
- **shadcn/ui** — UI primitives come from shadcn/ui (base-nova style). Custom components build on top of these.
- **Tailwind CSS v4** — Using the PostCSS plugin approach. Theme is defined in `globals.css` with CSS custom properties.
- **Feature modules** — The `src/features/` directory is set up for migrating business logic into domain-specific modules as the codebase grows.
- **Animation system** — Centralized in `src/lib/motion-config.ts` and `src/lib/motion-variants.ts` with a barrel export at `src/lib/animation/`.

## Deployment

The project deploys to **Vercel** via the GitHub CI/CD pipeline (`.github/workflows/ci-cd.yml`). Push to `main` triggers production deployment; pull requests get preview deployments.

Docker deployment is also supported via the included `Dockerfile`.

## Documentation

Historical development reports, audit results, and implementation guides have been moved to the `docs/` directory for reference.
