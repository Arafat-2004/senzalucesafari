## Senzaluce Safaris - Full Project Audit Report

**Date:** June 5, 2026  
**Auditor:** QoderWork automated review

---

### Architecture Overview

The project is a Next.js 16 (canary) application using the App Router, Prisma ORM with PostgreSQL (Supabase), Tailwind CSS v4, shadcn/ui components, and Framer Motion for animations. It includes a comprehensive admin panel with RBAC, MFA support, and full CRUD for tours, bookings, destinations, accommodations, vehicles, blog, reviews, inquiries, newsletters, FAQs, and guides.

The codebase is well-structured with clear separation between public pages, admin pages, API routes, shared components, and utility libraries. Security measures include bcrypt password hashing, rate limiting (via Upstash Redis), CSRF tokens, security event logging, and account lockout after failed attempts.

---

### Critical Issues

**C1. CSRF Token Validation is Fundamentally Broken** (`src/lib/security.ts:106-145`)  
The `setSession()` function in `admin-auth.ts` generates two independent random tokens for the CSRF secret and public cookies. The `validateCsrfToken()` function compares the submitted token against both, but since the secret and public tokens are unrelated random strings, meaningful CSRF validation can never succeed. This means CSRF protection is effectively non-functional.

**C2. Session Cookie Stores Plain User ID** (`src/lib/admin-auth.ts:234-252`)  
The session cookie stores the raw `userId` UUID without signing or encryption. Anyone who obtains or guesses a valid user ID can forge a session cookie and gain admin access. Sessions should use signed tokens (e.g., JWT or HMAC-signed values).

**C3. Rate Limiting Completely Disabled Without Redis** (`src/lib/security.ts:61-77`)  
When `UPSTASH_REDIS_REST_URL` is not configured (common in development/staging), all rate limiting is silently bypassed. Auth, booking, and enquiry endpoints become unprotected against brute-force attacks.

---

### High-Priority Issues

**H1. Reviews POST Uses `tourId` Field as Slug** (`src/app/api/reviews/route.ts:44`)  
The API receives a field named `tourId` but queries the database using `where: { slug: data.tourId }`. This misleading naming will cause failures if an actual UUID is passed instead of a slug.

**H2. Bookings API Missing Content-Type Validation** (`src/app/api/bookings/route.ts:63`)  
The `request.json()` call will throw an unhandled error if the request body is not valid JSON or if the Content-Type header is wrong, resulting in a generic 500 error instead of a helpful 400 response.

**H3. Prisma Extension Return Path Issue** (`src/lib/prisma.ts:73-109`)  
The retry loop in the Prisma `$extends` query middleware may not return a value if the retry count is exhausted without a definitive throw. The function implicitly returns `undefined` in edge cases, which would cause downstream "undefined is not an object" errors.

**H4. Excessive Pool Logging in Production** (`src/lib/prisma.ts:48-54`)  
Every PostgreSQL pool connect/remove event is logged at `warn` level. In production with high connection churn, this will generate massive log noise and potentially impact performance.

**H5. Admin Sidebar Hydration Mismatch Risk** (`src/app/admin/layout.tsx:256-262`)  
The sidebar collapse state reads from `localStorage` during initial state setup. While wrapped in a `typeof window !== 'undefined'` check, it may cause a brief flash or hydration mismatch on the client side.

**H6. JSON-LD Fallback URL** (`src/app/safaris-tours/page.tsx:43`)  
Uses `process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'` as fallback. If the env var is not set, structured data will contain `example.com` URLs, which could hurt SEO.

---

### Medium-Priority Issues

**M1. No Client-Side Form Validation on Booking/Review Forms**  
The booking API and review API have solid Zod validation server-side, but the client forms don't validate before submission. Users only see errors after a round-trip to the server, resulting in poor UX.

**M2. Footer Links to Non-Existent Pages** (`src/components/layout/footer.tsx`)  
The footer links to `/support` which may not have a proper implementation, and `/vehicles` appears in both Column 2 and Column 3 (duplicate link).

**M3. Favicon Size Mismatch** (`src/app/layout.tsx:113-117`)  
Uses `icon-72x72.png` for both 32x32 and 16x16 favicon sizes, and references `icon-144x144.png` and `icon-192x192.png` which need to be verified as existing.

**M4. Review GET Endpoint Missing tourId UUID Validation** (`src/app/api/reviews/route.ts:103`)  
The `tourId` query parameter is used directly in a Prisma query without UUID format validation, which could cause cryptic database errors.

**M5. `getClientIp` Awaited as Async** (`src/app/api/reviews/route.ts:23`)  
`getClientIp()` is a synchronous function but is called with `await`. This works but indicates confusion about the function signature.

**M6. Tour Card `min-h` on Title** (`src/components/ui/tour-card.tsx:126`)  
The tour card title has `min-h-[2.5rem]` which may cause alignment issues when tour names are very short (single word).

**M7. Admin User Avatar Shows Hardcoded "A"** (`src/app/admin/layout.tsx:349`)  
The user avatar in the admin header always shows "A" regardless of the logged-in user's actual name.

**M8. Missing `key` Prop in Star Rating Map** (`src/components/ui/tour-card.tsx:154-161`)  
The star rating rendering uses `[...Array(5)].map((_, i)` with `key={i}` which works but is an anti-pattern since array indices are used as keys.

---

### Low-Priority Issues

**L1. Tailwind Config Redundancy** (`tailwind.config.ts`)  
Defines custom color tokens (brand, status, text, bg, border) that may overlap with the CSS variable-based theme from globals.css. Some components use `brand-green` while others use `primary`, leading to inconsistency.

**L2. `optimizePackageImports` in Experimental** (`next.config.ts:135`)  
The `experimental.optimizePackageImports` flag is stable in Next.js 15+. This should be moved to the top-level config.

**L3. Duplicate ErrorBoundary Components**  
Both `src/components/ErrorBoundary.tsx` and `src/components/error-boundary.tsx` exist. One should be removed.

**L4. `sanitizeHtml` Regex Complexity** (`src/lib/security.ts:87-100`)  
The HTML sanitization function uses a complex regex loop that may not properly handle nested tags or edge cases. Consider using a dedicated library like DOMPurify.

**L5. `chrome-devtools-mcp` in Dependencies** (`package.json:55`)  
This development/debugging tool should be in `devDependencies`, not `dependencies`.

---

### Positive Observations

- Excellent use of server-side price calculation in the booking API (prevents client-side price manipulation)
- Comprehensive Zod validation on API inputs
- Proper rate limiting architecture (when Redis is configured)
- Well-organized RBAC system with granular permissions
- Good use of Prisma query extension for automatic retries on transient errors
- Strong security headers in production (HSTS, CSP, X-Frame-Options)
- Proper lazy loading with dynamic imports on the homepage
- Good accessibility practices (skip links, aria labels, semantic HTML)
- Comprehensive audit logging for admin actions
- Well-structured admin sidebar with collapse/mobile support
