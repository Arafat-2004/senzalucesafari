# Original User Request

## 2026-07-31T05:15:36Z

<USER_REQUEST>
You are leading a multi-agent production recovery team for Senza Luce Safaris.

Project: Resolve all remaining production parity issues between the local dev server and the live site https://www.senzalucesafari.com

Working directory: c:\WORKSPACE\ARAFAT\senzalucesafaris
Integrity mode: development

## Critical Remotes
ALWAYS push to BOTH remotes after any commit:
- `git push origin main` → https://github.com/Arafat-2004/senzalucesafaris.git (dev mirror)
- `git push backup-singular main` → https://github.com/Arafat-2004/senzalucesafari.git (PRODUCTION — Vercel watches this)

## Already Done — DO NOT REDO
1. Prisma RHEL engine + path override for Vercel production runtime ✅
2. Newsletter email delivery confirmed working on live site ✅
3. `favourite-button.tsx` suppressHydrationWarning added ✅
4. `/api/health/version` route created ✅
5. Service worker cache version bumped to v6 ✅
6. `playwright-report/index.html` removed from git tracking ✅
7. All pushed to both remotes at commit `1809902` ✅

## Your Tasks

### Task 1 — Push pending commits to both remotes
Run: `git push origin main` then `git push backup-singular main`
Confirm both succeed.

### Task 2 — Test Production Admin Login
Using PowerShell Invoke-WebRequest OR Chrome DevTools MCP, POST to https://www.senzalucesafari.com/api/admin/login with body `{"email":"info@senzalucesafari.com","password":"SenzaAdmin@2025"}`. Check the HTTP status and response body. If it returns 503 with "SESSION_SIGNING_SECRET not configured", that means the env var is missing from Vercel — document this finding in parity_matrix.md but do NOT fix it in code (it requires adding it to Vercel dashboard env vars). If it returns 401 "Invalid credentials", that means auth works but password is wrong.

### Task 3 — Check /safaris-tours for Remaining Hydration Issues
Read `src/app/safaris-tours/tours-content.tsx` lines 1-150 carefully. Look for:
- Any client-side state (useState, useSearchParams, localStorage reads) that affects className or element presence on initial render
- The compare-selection toggle button: does its className depend on client state at mount?
- Any conditional rendering that differs between server and client first render
If issues are found, apply suppressHydrationWarning or defer rendering to after mount using a `mounted` state pattern. Commit and push to both remotes.

### Task 4 — Verify Version Endpoint Live
Wait for the Vercel build triggered by commit `1809902` to complete (may take 2-3 min), then run:
`Invoke-WebRequest -Uri 'https://www.senzalucesafari.com/api/health/version' -UseBasicParsing | Select-Object StatusCode,Content`
If it returns JSON (not HTML), record the gitSha. If it still returns HTML 404, the build may not have deployed yet — wait and retry.

### Task 5 — Check sw.js Cache-Control Header on Production
Run: `Invoke-WebRequest -Uri 'https://www.senzalucesafari.com/sw.js' -Method Head -UseBasicParsing | Select-Object -ExpandProperty Headers`
Verify Cache-Control contains 'no-store'.

### Task 6 — Complete Parity Matrix
Create or update `c:\WORKSPACE\ARAFAT\senzalucesafaris\parity_matrix.md` with a table:
| Feature | Local Dev | Vercel Preview | Production (www) | Notes |
|---------|-----------|----------------|------------------|-------|
For each of: Homepage load, /safaris-tours (hydration errors?), Tour detail page, Admin login, Newsletter subscription, Booking form, /api/health/version.
Fill in: ✅ Working / ❌ Broken / ⚠️ Partial / 🔄 Not tested.

### Task 7 — Fix any issues found in Tasks 2-5
For any broken item that can be fixed in code (NOT Vercel env var configuration), make the fix, commit, and push to both remotes.

## When Done
Report back with:
1. Completed parity matrix table
2. List of all commits made and what they fixed
3. Any items that require manual action in Vercel dashboard (e.g., env vars)
4. Current production admin login status
</USER_REQUEST>
