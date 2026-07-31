# Orchestrator Execution Plan — Production Recovery (Tasks 1-7)

## Tasks & Status

| Task ID | Task Description | Strategy & Action | Status |
|---------|------------------|-------------------|--------|
| Task 1 | Push pending commits to both remotes | Dispatch Worker to run `git push origin main` and `git push backup-singular main` | IN_PROGRESS |
| Task 2 | Test Production Admin Login | Dispatch Explorer/Worker to send POST to `https://www.senzalucesafari.com/api/admin/login` | PLANNED |
| Task 3 | Hydration audit of `tours-content.tsx` (lines 1-150) | Dispatch Explorer/Worker to inspect client state, apply `suppressHydrationWarning` / mounted pattern if needed | PLANNED |
| Task 4 | Verify live `/api/health/version` endpoint | Dispatch Explorer/Worker to curl/Invoke-WebRequest live endpoint for 200 OK + gitSha | PLANNED |
| Task 5 | Verify `sw.js` Cache-Control header on production | Dispatch Explorer/Worker to check HTTP headers for `no-store` | PLANNED |
| Task 6 | Complete `parity_matrix.md` | Synthesize findings from Tasks 1-5 and write `parity_matrix.md` | PLANNED |
| Task 7 | Fix code-fixable issues, commit & push | If any issues found in Tasks 2-5, dispatch Worker to fix, commit, and push to both remotes | PLANNED |

## Subagent Delegation Plan
- Worker 1 (`teamwork_preview_worker`): Execute Task 1 (git push to both remotes), Task 2 (Admin login test), Task 4 (Health check live verification), Task 5 (`sw.js` header check).
- Explorer/Worker 2 (`teamwork_preview_worker`): Execute Task 3 (hydration audit/fix of `tours-content.tsx`), commit & push if changes made.
- Synthesis & Audit: Review worker outputs, write `parity_matrix.md` (Task 6), run reviewer/auditor, and report back to Sentinel.
