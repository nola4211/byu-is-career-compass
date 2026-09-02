# Verification Reference

Last updated: 2026-09-02

## Current baseline

The repository was inspected through the GitHub integration at main commit
`7cc52e6e9aa6e89a00a08f823ecea68b4fd29327`. The source is not checked out in
the writable Codex workspace, so application commands and visual tests have not
been run in this session.

| Check | Exact command or action | Last result | Last checked |
| --- | --- | --- | --- |
| Repository inventory | Read recursive `main` tree and task-relevant files through GitHub | Passed; routes, data, UI components, and build configuration were available | 2026-09-02 |
| Install/setup | `npm ci` | Not run; no local source checkout | 2026-09-02 |
| Lint | `npm run lint` | Not run; script resolves to `oxlint` | 2026-09-02 |
| Formatter | `npm run format` | Not run; script resolves to `oxfmt` | 2026-09-02 |
| Production build | `npm run build` | Not run; script resolves to `vinext build` | 2026-09-02 |
| Local preview | `npm run dev` | Not run; script resolves to `vinext dev` | 2026-09-02 |
| Production server | `npm run start` | Not run; script resolves to `wrangler dev --config dist/server/wrangler.json` | 2026-09-02 |
| Automated tests | No test script found in `package.json` | Unavailable in inspected baseline | 2026-09-02 |
| Visual/accessibility review | Desktop/mobile keyboard and interaction pass | Not run | 2026-09-02 |
| LiveKit voice session | Start, speak, interrupt, reconnect, end | Not available; integration absent | 2026-09-02 |
| Avatar session | Join, synchronized playback, timeout fallback, disclosure | Not available; integration absent | 2026-09-02 |
| Documentation links | Resolve relative Markdown links locally and verify the repository-only `CAREERS.md` target through GitHub | Passed; every proposed target was found | 2026-09-02 |
| GitHub publication | Create `docs/agent-coordination-livekit` from `main` and publish the documentation commit | Passed; branch is available for pull-request review | 2026-09-02 |

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

