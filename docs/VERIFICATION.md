# Verification Reference

Last updated: 2026-09-02

## Current baseline

The source was checked out on local branch `feat/livekit-interview`. Commands
below were run on Windows with Node.js 24.16.0, which satisfies the repository's
Node.js 22.13.0 minimum. No real provider credentials were used.

| Check | Exact command or action | Last result | Last checked |
| --- | --- | --- | --- |
| Repository inventory | Local Git checkout plus task-relevant file inspection | Passed | 2026-09-02 |
| Install/setup | `npm ci` | Passed outside the restricted network sandbox; 553 packages installed | 2026-09-02 |
| Lock/audit consistency | `npm install --package-lock-only --ignore-scripts --offline` | Passed; lock was up to date and npm reported 0 vulnerabilities across 575 audited packages | 2026-09-02 |
| Focused lint | `npx oxlint app/interview/page.tsx app/api/livekit-token/route.ts components/interview/live-interview.tsx lib/interview-session.ts` | Passed with no findings | 2026-09-02 |
| Full lint | `npm run lint` | Failed on 22 pre-existing errors in `app/page.tsx`, `hooks/use-mobile.ts`, and `components/ui/*`; no changed integration file appeared | 2026-09-02 |
| TypeScript | `npx tsc --noEmit` | Failed on two pre-existing `Button asChild` errors in `app/page.tsx`; no changed integration file appeared | 2026-09-02 |
| Formatter | `npm run format` | Not run because the script performs a repository-wide rewrite and unrelated formatting was outside this change's scope | 2026-09-02 |
| Production build | `npm run build` | Passed; routes `/`, `/interview`, and `/api/livekit-token` built | 2026-09-02 |
| Local preview | `npm run dev`, then HTTP GET `/interview?career=dataAnalytics` | Passed; dev server started at `http://localhost:3000` and route returned 200 | 2026-09-02 |
| Production server | `npm run start`, then HTTP GET `/interview?career=dataAnalytics` and valid token POST without credentials | Passed outside the restricted sandbox; server started at `http://127.0.0.1:8787`, page returned 200, and token route returned its expected 503 configuration error | 2026-09-02 |
| Token happy path | POST standardized request with disposable local signing values | Passed; returned 201, configured LiveKit URL, randomized room/identity, 600-second token, fixed `career-interviewer` dispatch, normalized metadata, and microphone-only publication | 2026-09-02 |
| Career allow-list | POST token request for each of the eight `CAREER_IDS` in technical mode | Passed; all eight returned 201 with disposable signing values | 2026-09-02 |
| Token rejection | POST invalid career metadata; POST from untrusted origin | Passed; returned 400 and 403 respectively | 2026-09-02 |
| Disposable-secret scan | Search source and build output for the disposable signing values | Passed; neither value was found after the final build | 2026-09-02 |
| Automated tests | No test script found in `package.json` | Unavailable in inspected baseline | 2026-09-02 |
| Visual/accessibility review | Desktop/mobile keyboard and interaction pass | Not run; local preview-opening capability was unavailable in this environment | 2026-09-02 |
| LiveKit voice session | Start, speak, interrupt, reconnect, end | Blocked on real hosted credentials and confirmed agent deployment | 2026-09-02 |
| Avatar session | Join, synchronized playback, timeout fallback, disclosure | Not available; the frontend is video-track ready but no provider is configured | 2026-09-02 |
| Sites project access | Resolve the checked-in `.openai/hosting.json` project through Sites | Blocked; the connector returned `project_not_found` (404) in the current workspace, so no version or production deployment was created | 2026-09-02 |
| Documentation links | Resolve relative Markdown links locally and verify the repository-only `CAREERS.md` target through GitHub | Passed; every proposed target was found | 2026-09-02 |
| GitHub documentation publication | Create `docs/agent-coordination-livekit` from `main` and open PR 1 | Passed | 2026-09-02 |

## Expected UI regression checks

- `/` starts the journey and reaches a ranked result after five answers.
- A timed-out question advances without scoring and can reappear later.
- Each career tab displays matching copy, sources, accent, and interview link.
- `/interview?career=<CareerId>` accepts all eight IDs and defaults safely for an
  invalid ID.
- Behavioral and career-specific modes reset the question and draft state.
- Self-review is disabled for an empty answer and produces three notes for a
  non-empty answer.
- Layout remains usable at desktop and narrow-mobile widths.
- Keyboard focus is visible and reduced-motion preferences are respected.

## Evidence rules

- Derive commands from checked-in configuration.
- Record the exact command or manual action, date, environment, and outcome.
- For failures, preserve the meaningful error and separate application failures
  from environment or access failures.
- A successful build is not proof that the UI or a live media flow is correct.
- Never carry a previous `Passed` result forward after relevant changes without
  rerunning it.

## Result template

```text
Date:
Change or task ID:
Environment:
Command or manual check:
Result: Passed | Failed | Blocked
Evidence or relevant output:
Unverified areas:
```

