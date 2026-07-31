# Analysis Report: Requirement 3 (Email Pipeline) & Requirement 4 (Admin Auth & Session Persistence)

**Author:** Explorer Subagent  
**Project:** Senza Luce Safaris (`c:\WORKSPACE\ARAFAT\senzalucesafaris`)  
**Date:** 2026-07-31  

---

## 1. Executive Summary

This report provides a comprehensive read-only audit and fix strategy for **Requirement 3 (R3: Email Pipeline Audit & Fix)** and **Requirement 4 (R4: Production Admin Login & Auth Session Persistence)**.

Key findings:
- **R3 (Email Pipeline):** The primary email delivery logic is in `src/lib/email/sender.ts`, utilizing a dual-strategy (SMTP via `nodemailer` with fallback to Resend API). Triggers exist across bookings, tour requests, transfer requests, custom enquiries, newsletter, reviews, and security alerts. However:
  1. `POST /api/enquiries` creates a database inquiry and admin notification but does **not** invoke customer or admin emails.
  2. Resend API calls fail if the sender domain (`@senzalucesafari.com`) is not verified in Resend and no fallback sender (e.g. `onboarding@resend.dev` or `RESEND_FROM_EMAIL`) is configured.
  3. In development mode (`NODE_ENV === 'development'`), missing or invalid SMTP/Resend credentials can result in failed email promises instead of logging the email payload gracefully.
- **R4 (Admin Auth & Session Persistence):** The admin authentication relies on a custom `admin_session` cookie signed with HMAC-SHA256 (`src/lib/admin-auth.ts`).
  1. Cookie `domain` attribute is currently omitted (`undefined`). In production setups with apex vs subdomain (`senzalucesafari.com` vs `www.senzalucesafari.com`), cookies set on one host are not shared with the other.
  2. Next.js middleware is located in a folder (`src/middleware/rbac.ts`) instead of a root file (`src/middleware.ts`). Next.js only executes middleware defined as a single file `src/middleware.ts` or `middleware.ts`.
  3. Clearing stale Supabase auth tokens on custom admin login prevents `@supabase/ssr` refresh token errors.

---

## 2. Requirement 3 (R3): Email Pipeline Audit

### 2.1 Architecture & Sender Logic (`src/lib/email/sender.ts`)
- **Primary Delivery:** SMTP connection via Nodemailer (`src/lib/integrations/smtp.ts`). Configuration is fetched dynamically from Prisma `AppSettings` (`smtpHost`, `smtpPort`, `smtpUsername`, `smtpPassword`) or environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
- **Fallback Delivery:** If SMTP fails or is not configured and `RESEND_API_KEY` is present, `sendEmail` falls back to `resend.emails.send()`.
- **Sender Categories:**
  - `auth`: `process.env.EMAIL_FROM || 'info@senzalucesafari.com'`
  - `bookings`: `process.env.EMAIL_BOOKINGS || 'bookings@senzalucesafari.com'`
  - `contact`: `process.env.EMAIL_CONTACT || 'contact@senzalucesafari.com'`
  - `support`: `process.env.EMAIL_SUPPORT || 'support@senzalucesafari.com'`
  - `general`: `process.env.EMAIL_GENERAL || 'hello@senzalucesafari.com'`

### 2.2 Trigger Audit Across API Routes

| Endpoint | Trigger Function(s) | Status | Notes |
|---|---|---|---|
| `POST /api/bookings` | `sendBookingConfirmationEmail`, `sendBookingAdminNotificationEmail` | ✅ Configured | Non-blocking fire-and-forget `.catch()` |
| `POST /api/tours/book` | `sendTourBookingAdminNotification`, `sendTourBookingCustomerConfirmation` | ✅ Configured | Wrapped in `Promise.allSettled` |
| `POST /api/transfers/submit` | `sendTransferAdminNotification`, `sendTransferCustomerConfirmation` | ✅ Configured | Wrapped in `Promise.allSettled` |
| `POST /api/enquiry/submit` | `sendAdminNotificationEmail`, `sendCustomerConfirmationEmail` | ✅ Configured | Wrapped in `Promise.allSettled` |
| `POST /api/enquiries` | None | ⚠️ **Missing** | Creates DB record & admin notification, but **no emails sent** |
| `POST /api/newsletter/subscribe` | `sendNewsletterWelcomeEmail` | ✅ Configured | Fire-and-forget `.catch()` |
| `POST /api/reviews` | `sendReviewAcknowledgmentEmail` | ✅ Configured | Sent if `customerEmail` provided |
| `POST /api/reviews/[id]/approve` | `sendReviewApprovedEmail` | ✅ Configured | Triggered on admin review approval |
| `POST /api/reviews/[id]/reject` | `sendReviewRejectedEmail` | ✅ Configured | Triggered on admin review rejection |
| `POST /api/admin/mfa-setup` & `mfa-disable` | `sendSecurityNotificationEmail` | ✅ Configured | Security alerts sent to admin |
| `POST /api/admin/request-reset` | Direct Nodemailer | ℹ️ Legacy | Sends password reset email if SMTP exists |
| `POST /api/settings/smtp-test` | `verifySmtpConnection` | ✅ Configured | Verifies SMTP host/auth in settings |

### 2.3 Resend & Environment Variable Gaps
1. **Resend Sender Domain Restriction:**
   - Resend API returns `403 Forbidden` / `domain_not_verified` when sending from unverified custom domains (e.g., `@senzalucesafari.com`).
   - If `RESEND_FROM_EMAIL` is set in `.env` (e.g. `onboarding@resend.dev`), Resend fallback can use it when sending test emails.
2. **Development Mode Fallback:**
   - If `process.env.NODE_ENV === 'development'` and neither SMTP nor Resend can send the email, `sender.ts` should log the email details (`to`, `subject`, `category`, `html` preview) to logger/console and return `{ success: true, id: 'dev-mock-id' }` to avoid breaking local test flows.
3. **`POST /api/enquiries` Gap:**
   - Standardize `POST /api/enquiries` to send `sendAdminNotificationEmail` and `sendCustomerConfirmationEmail` similar to `POST /api/enquiry/submit`.

---

## 3. Requirement 4 (R4): Production Admin Login & Auth Session Persistence

### 3.1 Session Mechanism (`src/lib/admin-auth.ts`)
- **Session Token:** HMAC-SHA256 signed string (`${userId}.${signature}`) generated using `SESSION_SIGNING_SECRET` or `NEXTAUTH_SECRET`.
- **Cookie Name:** `admin_session`.
- **Max Age:** 24 hours (`SESSION_MAX_AGE = 86400`).
- **CSRF Tokens:** `csrf_token` (readable by JS) and `csrf_secret` (httpOnly).

### 3.2 Audit of Cookie Settings & Domain Behavior

Current cookie settings in `setSessionOnResponse()`:
```ts
response.cookies.set('admin_session', signedValue, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 86400,
  path: '/',
  // domain is missing!
});
```

#### Domain Behavior Issue (`www.senzalucesafari.com`):
- When `domain` is omitted, browsers bind the cookie strictly to the origin hostname (e.g. `senzalucesafari.com`).
- If an admin logs in at `senzalucesafari.com` and navigates to `www.senzalucesafari.com` (or vice-versa), the browser will **not** send the `admin_session` cookie.
- **Fix:** Support `COOKIE_DOMAIN` env var (e.g. `process.env.COOKIE_DOMAIN || undefined`). If `COOKIE_DOMAIN=.senzalucesafari.com` is configured in production, the browser shares the session cookie between both apex (`senzalucesafari.com`) and `www` (`www.senzalucesafari.com`).

### 3.3 Next.js Middleware File Structure Issue
- **Observation:** Middleware is stored in `src/middleware/rbac.ts` (a subfolder).
- **Next.js Rule:** Next.js **only** executes middleware when defined in a top-level file: `src/middleware.ts` or `middleware.ts`.
- **Fix:** Create `src/middleware.ts` at the root of `src/` that exports a standard `middleware(request: NextRequest)` function. It should execute session validation and RBAC checks for `/admin/*` routes (excluding `/admin/login` and static assets).

### 3.4 Login Page & Supabase Auth Coexistence (`src/app/admin/login/page.tsx`)
- On successful admin login via `/api/admin/login`, clear any stale Supabase auth session tokens from browser cookies (`supabase.auth.signOut({ scope: 'local' })`) to prevent `@supabase/ssr` from attempting to refresh invalid tokens during subsequent navigation.

---

## 4. Summary of Proposed Fix Strategies

### R3 Fix Strategy:
1. Update `src/lib/email/sender.ts`:
   - Support `RESEND_FROM_EMAIL` override for Resend delivery.
   - Add dev-mode logging fallback: if `NODE_ENV === 'development'` and no delivery provider succeeds, log the email payload to `logger.info('[Email Dev Mode] Mock email sent', ...)` and return `{ success: true, id: 'dev-mock-id' }`.
2. Update `src/app/api/enquiries/route.ts`:
   - Import and invoke `sendAdminNotificationEmail` and `sendCustomerConfirmationEmail` inside `POST /api/enquiries`.

### R4 Fix Strategy:
1. Update `src/lib/admin-auth.ts`:
   - Support optional `COOKIE_DOMAIN` in cookie option settings for `setSession`, `setSessionOnResponse`, `destroySession`, and `clearSessionOnResponse`.
2. Create `src/middleware.ts`:
   - Implement root Next.js middleware routing for `/admin/*` protected paths.
3. Update `src/app/admin/login/page.tsx`:
   - Ensure local Supabase auth cleanup on successful login.

---
