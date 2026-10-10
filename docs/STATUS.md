# Current Project Status

Snapshot: 2026-10-09

## Deployed frontend

PR #9 merged on 2026-09-09 as `f7ac294941c4e56af44b4b949b935c6b543aabe2`.
[Pages run 34398273576](https://github.com/nola4211/byu-is-career-compass/actions/runs/34398273576) passed at that revision.
The [public site](https://nola4211.github.io/byu-is-career-compass/) currently shows the water presence and written fallback.
Current browser review verified first-click interview navigation, the pre-join AI disclosure and disabled Start button before acknowledgment, written self-review with a fictional answer, and a phone-sized pre-join layout. Reviewed flows reported no console errors.
No microphone session, provider dashboard, recording, or retention setting was accessed in this review. A successful real conversation is still unverified.

## Prepared on the review branch

- Bound token-request reading to 8,192 bytes and cancel oversized/failed streams; preserve UTF-8 across chunks.
- Reject malformed JSON structures and incorrect media types without an uncaught exception.
- Add the optional Worker-only `LIVEKIT_INTERVIEWS_ENABLED=false` pause for new tokens; unset preserves existing behavior. This does not end active rooms.
- Use a friendly unavailable-service message in the frontend.
- Patch React/React DOM/RSC to 19.2.8 and Vite to 8.0.16; scope tinypool 2.1.2 to oxfmt and pin proxy-addr 2.0.8/source-map-js 1.2.2.
- Add 11 Worker regression tests using the actual source and real SDK with disposable local signing keys; add a PR workflow that checks without deployment.

These changes are proposed for shared review. Production frontend, Worker, secrets, and provider settings have not been changed.

## Verification

On the isolated Windows copy with Node 24.16.0: lint, TypeScript, 11 tests, the three-route static build/Pages preparation, selected-file formatting, and Worker dry-run passed. The first sandboxed build was blocked while resolving installed dependencies; the isolated build passed with filesystem access.
The initial dependency audit listed 28 affected packages (3 critical, 19 high, 5 moderate, 1 low). After targeted patches: 22 (0 critical, 16 high, 5 moderate, 1 low). Further tooling upgrades remain review work; a clean audit or production security clearance is not claimed. See [security review](SECURITY_REVIEW.md) and [verification](VERIFICATION.md).

## Best next step

Review the source changes and PR checks. The service owner must plan the separate Worker/frontend rollout, implement admission/rate/cost controls, and confirm provider retention before promoting live voice practice. Use the shared-contribution case study and public written/pre-join experience in the portfolio meanwhile.
