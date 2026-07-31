# Original User Request

## 2026-07-31T08:16:29Z

<USER_REQUEST>
You are the Project Orchestrator for the Senza Luce Safaris production recovery effort.

Your objective is to execute and manage the completion of Tasks 1 through 7 as described in `c:\WORKSPACE\ARAFAT\senzalucesafaris\ORIGINAL_REQUEST.md`.

Working directory for your metadata: `c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\orchestrator`
Project root: `c:\WORKSPACE\ARAFAT\senzalucesafaris`

Critical Rules:
1. ALWAYS push to BOTH remotes after any commit:
   - `git push origin main` -> https://github.com/Arafat-2004/senzalucesafaris.git (dev mirror)
   - `git push backup-singular main` -> https://github.com/Arafat-2004/senzalucesafari.git (PRODUCTION — Vercel watches this)
2. Do NOT redo already completed tasks:
   - Prisma RHEL engine + path override for Vercel production runtime
   - Newsletter email delivery confirmed working on live site
   - favourite-button.tsx suppressHydrationWarning added
   - /api/health/version route created
   - Service worker cache version bumped to v6
   - playwright-report/index.html removed from git tracking
   - (All pushed to both remotes at commit 1809902)

Tasks to complete:
Task 1: Push pending commits to both remotes (`git push origin main` then `git push backup-singular main`). Confirm both succeed.
Task 2: Test Production Admin Login by sending POST request to https://www.senzalucesafari.com/api/admin/login with body `{"email":"info@senzalucesafari.com","password":"SenzaAdmin@2025"}`. Check status code and response body. If 503 ("SESSION_SIGNING_SECRET not configured"), document in parity_matrix.md (do NOT fix in code as it's a Vercel env var). If 401 ("Invalid credentials"), record finding.
Task 3: Check `src/app/safaris-tours/tours-content.tsx` lines 1-150 for hydration issues (client state affecting initial markup/classNames, compare selection toggle button, conditional rendering). If issues found, apply fixes (`suppressHydrationWarning` or mounted pattern), commit, and push to BOTH remotes.
Task 4: Verify live `/api/health/version` endpoint returns JSON with StatusCode 200 and gitSha. Retry if Vercel build is still deploying.
Task 5: Check `sw.js` Cache-Control header on production (`https://www.senzalucesafari.com/sw.js`) to verify it contains `no-store`.
Task 6: Complete `c:\WORKSPACE\ARAFAT\senzalucesafaris\parity_matrix.md` with full feature status table.
Task 7: Fix any code-fixable issues found in Tasks 2-5, commit, and push to BOTH remotes.

Maintain `.agents/orchestrator/plan.md`, `.agents/orchestrator/progress.md`, and `.agents/orchestrator/context.md`.
When all tasks are complete, report back to me (the Sentinel) with:
1. Completed parity matrix table
2. List of all commits made and what they fixed
3. Any items requiring manual action in Vercel dashboard
4. Current production admin login status
And declare completion so victory audit can begin.
</USER_REQUEST>
