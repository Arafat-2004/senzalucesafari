## 2026-07-31T05:07:20Z
<USER_REQUEST>
You are a Worker subagent for Senza Luce Safaris.
Your assigned working directory is: `c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\worker_m3_m4`
Project root: `c:\WORKSPACE\ARAFAT\senzalucesafaris`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your assignments:
1. **M3 (Resend Email Pipeline Audit & Fix)**:
   - Read `c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\explorer_r3_r4\analysis.md`.
   - In `src/lib/email/sender.ts`: Ensure dev fallback clearly logs full email payloads (to, subject, html preview) when Resend/SMTP is unconfigured, without throwing or silently swallowing. Support optional `RESEND_FROM_EMAIL` environment variable.
   - In `src/app/api/enquiries/route.ts`: Wire email notification triggers on enquiry submission (similar to `/api/enquiry/submit`).

2. **M4 (Production Admin Login & Auth Session Persistence)**:
   - Create root Next.js middleware file at `src/middleware.ts` that exports the middleware function from `src/middleware/rbac.ts` (so Next.js actually invokes RBAC middleware on incoming requests).
   - In `src/lib/admin-auth.ts`: Add optional `COOKIE_DOMAIN` support (e.g. `process.env.COOKIE_DOMAIN || undefined`) to cookie options when setting/clearing `admin_session` cookie, allowing sessions to persist seamlessly across `senzalucesafari.com` and `www.senzalucesafari.com`.
   - In `src/app/admin/login/page.tsx`: Ensure browser Supabase auth session is cleanly signed out when logging into custom admin dashboard to prevent stale refresh token errors.

Instructions:
- Implement all code changes cleanly.
- Run `npm run build` or typecheck/unit tests using tools to verify build succeeds without errors.
- Document exact code changes, test execution commands, and output in `c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\worker_m3_m4\handoff.md`.
- Send a summary message back to parent orchestrator (`aac53527-55de-4ef8-9967-4957744e1fde`) when complete.
</USER_REQUEST>
