## 2026-07-31T05:07:20Z
You are a Worker subagent for Senza Luce Safaris.
Your assigned working directory is: `c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\worker_m2_m5_m6`
Project root: `c:\WORKSPACE\ARAFAT\senzalucesafaris`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your assignments:
1. **M2 (Hydration Fix on `/safaris-tours`)**:
   - Read `c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\explorer_r2_r5\analysis.md`.
   - Update `src/components/ui/tour-comparison.tsx`: Add `hydrated` state flag to `useTourComparison()` and defer reading `localStorage` until after component mounts (matching `useFavourites` pattern).
   - Update `src/components/ui/tour-card.tsx`: Ensure `price.toLocaleString('en-US')` and `perDayPrice.toLocaleString('en-US')` use explicit `'en-US'` locale.

2. **M5 (Service Worker & Caching Audit)**:
   - Update `public/sw.js`:
     - Change static unhashed media assets strategy (`/images/`, `/fonts/`, `/icons/`) to Stale-While-Revalidate instead of pure Cache-First.
     - Remove automatic `self.skipWaiting()` call in `install` event to allow controlled updates via `PWARegistration.tsx`.
   - Update `next.config.ts`:
     - Add explicit `Cache-Control` headers for `/_next/static/(.*)` (`public, max-age=31536000, immutable`) and `/api/(.*)` (`no-store, max-age=0, must-revalidate`).

3. **M6 (Endpoint `/api/health/version`)**:
   - Read `c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\explorer_r1_r6\analysis.md`.
   - Create `src/app/api/health/version/route.ts` returning JSON with `{ status, version, commit, shortCommit, branch, environment, timestamp }` wrapped with `withApiResilience`. Ensure dynamic mode (`export const dynamic = 'force-dynamic'`).

Instructions:
- Implement all changes cleanly.
- Run `npm run build` or typecheck/unit tests using tools to verify build succeeds without errors.
- Document exact code changes, test execution commands, and output in `c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\worker_m2_m5_m6\handoff.md`.
- Send a summary message back to parent orchestrator (`aac53527-55de-4ef8-9967-4957744e1fde`) when complete.
