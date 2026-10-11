# Voice service and dependency review

Reviewed 2026-10-10. Changes are prepared for shared review; no production setting, credential, account, recording, or session record was accessed.

## Implemented on this branch

The Worker reads a maximum of 8,192 bytes, stops/cancels oversized streams, decodes split UTF-8 safely, and rejects invalid JSON shapes or media types. Previously a JSON `null` body could throw before a response, and the limit was applied to characters after reading the entire body. Twelve Worker tests exercise actual source and real SDK token signing with disposable keys, including all eight careers, both modes, and fail-closed opt-in. Five frontend rendering tests verify the paused/default paths. These are local request/grant/UI-render checks, not a Cloudflare or live-agent acceptance test.

## Zero-spending portfolio policy (2026-10-10)

Cameron requests no usage charges from portfolio demos. He reports controlling LiveKit; a partner likely controls Cloudflare. This is reported ownership, not a provider-dashboard verification.

The frontend defaults to written practice. Public Pages builds set `VITE_LIVE_INTERVIEWS_ENABLED=false`; endpoint presence cannot enable the live button or construct a session. Direct rendering of the live component also checks the opt-in before any LiveKit session/token-client hook runs. Both frontend and Worker accept only the exact string `true`; missing, false, or mistyped flags deny voice. `wrangler.livekit.jsonc` explicitly sets `LIVEKIT_INTERVIEWS_ENABLED=false`.

The separately deployed Worker returns 503 before reading the body or signing a token when its flag is not enabled. This supersedes the earlier optional-pause default. Seventeen tests cover the actual Worker plus server-rendered frontend/component paths with a configured disposable endpoint; paused paths make no session/token-client calls. No production or paid session is performed.

**Rollout required:** Source changes and a frontend merge do not disable the already deployed Worker. The Cloudflare owner must deploy this paused configuration or disable the endpoint, and verify a disposable request receives no token. The LiveKit owner must separately check/terminate any existing sessions or other dispatch paths before claiming provider usage has stopped. No owner account setting has been changed. A new-token pause does not end active rooms or itself establish a global spending cap.

## Controls still required before recommending an unrestricted voice demo

- Verify service ownership, recording/transcript retention, deletion, and the exact providers receiving audio and metadata. Existing disclosure remains; do not promise no retention.
- Add an authenticated or otherwise verified admission boundary, throttling, and per-user/concurrent/global session quotas. A matching Origin header is a browser policy signal, not proof of a permitted student.
- Enforce session duration and termination on the service side, and test the resulting billing stop. [LiveKit token expiry governs entry rather than an ongoing session cutoff](https://docs.livekit.io/frontends/reference/tokens-grants/).
- Use authoritative quota/budget accounting when a hard limit is required. [Cloudflare's rate-limiting binding is local to each location and eventually consistent](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/); it should not be represented as an exact global spending cap.
- Perform a consented disposable microphone session covering agent join, metadata, speech, transcription, mute/end, denied permission, disconnect, and provider-side termination before claiming live acceptance.

## Dependency findings before the tooling update

Initial locked graph: 28 affected packages, including three critical entries. Targeted changes reduce it to 22 affected packages: zero critical, 16 high, five moderate, one low. This count includes propagated dependency effects and is not 22 independent exploitable application defects.

| Change | Reason and verification |
| --- | --- |
| React/React DOM/RSC 19.2.8 | Keep the family aligned while addressing the [RSC server-function advisory](https://github.com/advisories/GHSA-wx67-qw84-cm4g). Static build passed; the Pages artifact has no RSC server. |
| Vite 8.0.16 | Patch the current 8.0 line for [Windows file-deny bypass](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) and [editor UNC-path handling](https://github.com/advisories/GHSA-v6wh-96g9-6wx3). Build passed. |
| oxfmt's tinypool override 2.1.2 | Address [worker-option prototype pollution](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3) and [run-option pollution](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) without a formatter migration. Selected-file formatting passed through the consuming CLI. |
| proxy-addr 2.0.8 | Address [mapped-IPv6 trust handling](https://github.com/advisories/GHSA-jqcg-44mw-7w3h). Locked build graph passed. |
| source-map-js 1.2.2 | Address [indexed-map processing](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). Static build passed. |

That earlier 22-entry snapshot is superseded by the October 10 tooling review below. The remaining six entries now trace only to the unpatched braces build chain; no forced downgrade was applied. The static hosted frontend runs no development server, formatter, or image optimizer. The independently deployed Worker and developer tools have different exposure boundaries; deployed Worker behavior/settings were not refreshed in this review. A full source-history credential scan, penetration test, dependency clearance, or provider-side security certification is not claimed.

## Build tooling update (2026-10-10)

The review branch upgrades Vinext to 1.1.0, its required RSC companion to 0.5.36, and Wrangler to 4.149.0. It removes the unused shadcn generator executable and its transitive toolchain while retaining the exact original stylesheet and MIT notice in `vendor/shadcn/`. `@shadcn/react`, which is actually imported by a component, remains installed. The Satori-only override selects the official same-series `fflate@0.7.5` patch instead of its exact vulnerable 0.7.3 pin. No forced framework downgrade or disabled peer checks are used.

The refreshed complete npm audit is six high entries, zero critical/moderate/low. All six trace to the [unpatched braces pattern-walker issue](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) through Vinext's CommonJS/dynamic-import/glob build chain. This is six propagated package entries, not six independent application bugs. The static Pages artifact does not execute that build chain or accept visitor-supplied build patterns. Build only trusted source/inputs and keep development tooling private. This is a bounded exposure assessment, not dependency clearance; track an upstream fix. The [fflate patch advisory](https://github.com/advisories/GHSA-px8p-9vwx-vf98) lists 0.7.5 as patched.

Local Node 24.16.0 lint, TypeScript and all 17 actual-source tests passed. The complete production build and Pages preparation now exit successfully, replacing the prior Windows shutdown failure. It exports all three routes. The local updated static interview page was checked for written-first/disabled live entry, fictional self-review, next-question clearing, career-specific/Cybersecurity reset, and a 390×844 viewport with client/scroll widths both 375 px; captured errors/warnings were empty. Worker dry-run with metrics disabled passed at 150.22 KiB / 30.94 KiB gzip and explicit false flag, with nothing deployed. Large-chunk and ineffective-import build warnings remain; no native performance improvement is claimed.

The prior paused-policy commit `325c5ed4c68d2cde3fe92c3d8a5387b5b921b064` passed clean 17-test/full-build Node 22 CI in run 38097021835. Clean exact-head CI for this additional tooling update is pending publication. No production frontend/Worker rollout, microphone, provider session, billing, credential or account setting changed.

## Rollout boundary

Review and merge through the shared repository's process after PR checks. A merge publishes the static frontend through the existing main-branch workflow; Worker deployment remains a separate owner-approved action. Deploy with the explicit false flag, verify new-token rejection without joining a room, and keep voice paused under the zero-spending policy. Future live promotion requires a separately approved budget plus admission/retention/duration controls. Keep credentials out of source and CI artifacts.
