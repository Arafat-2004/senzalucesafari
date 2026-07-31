# Orchestrator Context & Active State

## Mission & Scope
Execute Tasks 1 through 7 for Senza Luce Safaris production recovery:
- Task 1: Push pending commits to both remotes (`origin main`, `backup-singular main`).
- Task 2: Test Production Admin Login endpoint via HTTP POST.
- Task 3: Audit `src/app/safaris-tours/tours-content.tsx` lines 1-150 for hydration issues and fix if needed.
- Task 4: Verify `/api/health/version` endpoint on live site returns 200 JSON with gitSha.
- Task 5: Check `sw.js` Cache-Control header on live site for `no-store`.
- Task 6: Complete `parity_matrix.md` with full feature status.
- Task 7: Fix any code-fixable issues from Tasks 2-5, commit, and push to both remotes.

## Key Rules & Constraints
- Must push to BOTH remotes (`git push origin main` and `git push backup-singular main`) after any commit.
- Do NOT redo already completed tasks (Prisma engine, Newsletter fix, favourite-button hydration fix, /api/health/version route creation, sw.js v6 bump, playwright-report untracking).
- All implementation and execution work MUST be performed by subagents.
