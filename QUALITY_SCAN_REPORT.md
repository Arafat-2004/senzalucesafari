## Full Project Quality Scan Report

**Project:** Senza Luce Safaris  
**Stack:** Next.js 16.2.2 / React 19 / TypeScript / Prisma 7 / Supabase (PostgreSQL) / Tailwind CSS 4  
**Scan Date:** April 15, 2026  
**Overall Health:** FAILING BUILD - Critical issues must be resolved before deployment

---

### 1. Build Status: FAILED

The production build (`next build`) fails due to TypeScript type errors in the destinations feature. The build compiles successfully in ~17 seconds but then fails the type-checking step.

**15 TypeScript errors** found across 2 files:

**`src/app/destinations/[slug]/page.tsx`** (8 errors):
- Line 195: `sampleItineraries` does not exist on type `Destination`
- Line 210, 214: `byAir`, `byRoad` do not exist on the `gettingThere` array type
- Line 219: `transferTime` does not exist on the `gettingThere` array type
- Line 239: `gallery` does not exist on type `Destination`
- Line 261, 263: `localTribes` is possibly undefined (not null-checked)
- Line 304: `string[] | undefined` assigned to `string[]`

**`src/data/destinations.ts`** (7 errors):
- Lines 86, 221, 351, 473, 583, 699, 791: Object literals use `byAir` property that does not exist in the type definition

**Root cause:** The `Destination` type interface is out of sync with the actual data. The type defines `gettingThere` as an array of `{ method, details, duration? }` but the data uses a structured object with `byAir`, `byRoad`, and `transferTime` properties.

---

### 2. Security Vulnerabilities: 10 Found

| Severity | Package | Issue |
|----------|---------|-------|
| **HIGH** | `next@16.2.2` | Denial of Service with Server Components (fix: update to 16.2.3) |
| **HIGH** | `serialize-javascript <=7.0.4` | RCE via RegExp.flags and CPU exhaustion DoS (via next-pwa) |
| **HIGH** | 4 more via `serialize-javascript` chain | Through `rollup-plugin-terser` > `workbox-build` > `next-pwa` |
| MODERATE | `@hono/node-server` | Middleware bypass via repeated slashes (via prisma) |
| MODERATE | `hono <=4.12.11` | Cookie validation bypass, IP matching issues, path traversal |

**Key concern:** The `next-pwa` package pulls in a deeply vulnerable dependency chain (`serialize-javascript` with RCE risk). This package appears outdated and may need replacement.

**Additional security note:** `NODE_TLS_REJECT_UNAUTHORIZED=0` is set in the environment, disabling SSL certificate verification globally. This should be removed from production.

---

### 3. ESLint Analysis: 72 Issues

| Category | Count | Severity |
|----------|-------|----------|
| `@typescript-eslint/no-explicit-any` | 14 | Error |
| `react/no-unescaped-entities` | 30 | Error |
| `@typescript-eslint/no-unused-vars` | 26 | Warning |
| `@next/next/no-img-element` | 2 | Warning |
| `react-hooks/exhaustive-deps` | 1 | Warning |

**Most impacted files:**
- `src/app/privacy/page.tsx` - 12 unescaped entity errors
- `src/app/blog/[slug]/page.tsx` - 8 `any` type errors + 2 unused vars
- `src/app/safaris-tours/[slug]/page.tsx` - 8 unused import warnings

---

### 4. Critical Data Inconsistencies

**Phone numbers vary across the codebase:**
- `src/constants/index.ts`: `+255 123 456 789` (PLACEHOLDER)
- `src/data/company.ts`: `+255629123246` (real)
- `src/components/layout/header.tsx`: `+255629123246` (hardcoded)
- `src/app/support/page.tsx`: `+255 123 456 789` (uses placeholder!)

**Email domains differ:**
- Most files: `info@senzalucesafaris.com`
- `src/components/layout/header.tsx`: `info@senzaluce-safaris.com` (with hyphen - likely a bug)

**Placeholder content in production code:**
- `src/app/vehicles/components/video-gallery.tsx`: All 4 YouTube embeds point to Rick Roll URLs (`dQw4w9WgXcQ`) with "Replace with actual video" comments

---

### 5. Database & Prisma Issues

**No Migration Files Exist.** The `prisma/migrations/` directory is empty. The schema is not version-controlled, making reproducible deployments impossible.

**Missing Database Indexes:**
- `TourDestination.destinationId` - critical for destination-based tour queries
- `Booking.tourId`, `Booking.vehicleId`, `Booking.guideId` - foreign keys without indexes
- Composite index `Review(isApproved, isFeatured)` for featured review queries

**Seed Script Bug:** `seedReviews()` uses `create` instead of `upsert`. Running the seed twice creates duplicate reviews. All other seed functions correctly use `upsert`.

**Redundant Schema Fields on Review model:**
- `comment` AND `content` (both `@db.Text`, same data)
- `customerName` AND `author` (same name value)
- `helpful` AND `helpfulCount` (same concept, `helpful` is never written to)

**No Caching Layer:** Zero use of `unstable_cache`, `revalidate`, or React `cache()` across the entire codebase. Every page render hits the database directly for what is mostly static content (tours, destinations, blog posts).

---

### 6. Code Quality Findings

**Oversized Components:**
- `src/components/ui/enquiry-form.tsx` - 950 lines
- `src/components/ui/booking-modal.tsx` - 676 lines
- `src/app/vehicles/page.tsx` - 732 lines
- `src/app/safaris-tours/tours-content.tsx` - 660 lines

**Console Statements in Production Code:** 7 instances that should be removed or environment-gated:
- `use-analytics.ts` (line 9): unconditional `console.log`
- `use-geolocation.ts` (line 48): `console.log` on geocoding failure
- `performance-monitor.ts` (lines 78-80): 3 Web Vitals `console.log` calls
- `hero-section.tsx` (line 28): `console.log` on video autoplay failure
- `PWARegistration.tsx` (lines 21, 38): service worker `console.log`

**Image Optimization Gaps:** 5 files use raw `<img>` tags instead of Next.js `<Image>`:
- `tour-detail-tabs.tsx` (2 instances)
- `accommodations-section.tsx`
- `comparison-bar.tsx`
- `tour-comparison.tsx`

**CSS Font Import Bypass:** `src/app/globals.css` imports Google Fonts via `@import url(...)` which creates a render-blocking request. The project already uses `next/font` for Geist fonts, so Poppins/Inter should be migrated to `next/font` as well.

**Duplicate Data Sources:** `COMPANY` in `src/constants/index.ts` and `companyInfo` in `src/data/company.ts` serve the same purpose with conflicting values.

**5+ Overlapping Migration Scripts** at the project root (`run-migration.js`, `migrate-tours.ts`, `migrate-tours-prisma.js`, `migrate-all-data.js`, `scripts/migrate-source-to-supabase.ts`) using mixed approaches (raw SQL vs Prisma). These should be consolidated or removed.

---

### 7. Accessibility

**Good practices already in place:**
- Skip-to-content link in layout
- Semantic HTML (`<main>`, `<nav>`, `<header>`, `<footer>`)
- aria-labels on 28+ interactive elements
- All images have alt text

**Gaps:**
- Home hero `<video>` has no `<track>` element for captions
- Potential contrast issues with dynamic opacity over background images

---

### 8. Performance Configuration

**Well configured:**
- Image optimization with AVIF/WebP formats
- Package import optimization (lucide-react, radix, framer-motion)
- Static asset caching headers (1 year immutable)
- Compression enabled, `poweredByHeader` disabled

**Needs attention:**
- No ISR/revalidation on any pages for static content
- Render-blocking CSS font import
- `optimizeCss` experimental flag enabled (may have stability issues)

---

### Priority Action Items

**P0 - Build Blockers (must fix to deploy):**
1. Fix `Destination` type to include `sampleItineraries`, `gallery`, and restructure `gettingThere` type
2. Add null checks for `localTribes` in destinations page

**P1 - Security:**
3. Update `next` to >=16.2.3 (DoS fix)
4. Evaluate replacing `next-pwa` (pulls in vulnerable `serialize-javascript` chain)
5. Remove `NODE_TLS_REJECT_UNAUTHORIZED=0` from production environment

**P2 - Data Integrity:**
6. Fix inconsistent phone numbers - consolidate into single source of truth
7. Fix header email domain (`senzaluce-safaris.com` vs `senzalucesafaris.com`)
8. Replace placeholder YouTube URLs in video gallery
9. Fix `seedReviews()` to use `upsert` instead of `create`

**P3 - Performance & Quality:**
10. Add ISR `revalidate` or `unstable_cache` to database queries
11. Generate Prisma migration files (`prisma migrate dev`)
12. Add missing database indexes
13. Migrate CSS `@import` fonts to `next/font`
14. Replace raw `<img>` tags with Next.js `<Image>`
15. Remove duplicate data sources and migration scripts
