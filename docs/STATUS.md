# Current Project Status

Snapshot: 2026-10-10. This is the review branch, not a deployed replacement.

## Deployed frontend

Main remains `f7ac294941c4e56af44b4b949b935c6b543aabe2` from PR #9.
[Pages run 34398273576](https://github.com/nola4211/byu-is-career-compass/actions/runs/34398273576) passed at that revision. Prior public browser review covered first-click interview navigation, voice pre-join disclosure/consent, written self-review and a phone-sized layout. Real voice acceptance is unverified.

## Prepared on the review branch

- Bound token bodies to 8,192 bytes; handle bad JSON/media types/UTF-8/streams.
- Default to written practice; gate live entry and direct component mounting behind an exact frontend true opt-in. Pages explicitly sets false.
- Require exact `LIVEKIT_INTERVIEWS_ENABLED=true` before body parsing or token signing. Missing/mistyped flags deny access; Worker config explicitly sets false.
- Seventeen tests cover the real Worker and server-rendered frontend/component using disposable configuration and rejecting provider mocks. No paid service is contacted.
- Retain prior scoped dependency patches, friendly unavailable handling and non-deploying PR verification.

Cameron requests no demo usage charges and reports owning LiveKit; a partner likely controls Cloudflare. These source changes do not close the existing public token endpoint or active rooms. No credentials, provider settings or session records have been accessed or changed.

## Verification and next action

The updated seventeen-test suite, lint and TypeScript passed locally with Node 24.16.0. Worker dry-run and bounded local written-practice browser checks passed. The Node 24 build exported all three routes but exited 1 with a Windows libuv assertion; separate Pages preparation passed. Exact-head clean Node 22 PR CI is pending. See VERIFICATION.md for the scope and limits. Prior branch baseline/clean CI passed eleven tests; do not use that run as evidence for the new changes.

Dependency audit at the prior lockfile remains 22 affected packages (0 critical, 16 high, 5 moderate, 1 low); remaining tooling upgrades are open. The Cloudflare owner must separately deploy a paused Worker or disable token issuance and verify denial without creating a voice session. The LiveKit owner must check other dispatch paths and existing sessions. Keep voice paused; future live testing requires separate budget/privacy/admission approval.
