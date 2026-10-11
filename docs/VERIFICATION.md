# Verification Reference

Last updated: 2026-10-10

## Build tooling update (2026-10-10)

The review branch upgrades Vinext to 1.1.0, its required RSC companion to 0.5.36, and Wrangler to 4.149.0. It removes the unused shadcn generator executable and its transitive toolchain while retaining the exact original stylesheet and MIT notice in `vendor/shadcn/`. `@shadcn/react`, which is actually imported by a component, remains installed. The Satori-only override selects the official same-series `fflate@0.7.5` patch instead of its exact vulnerable 0.7.3 pin. No forced framework downgrade or disabled peer checks are used.

The refreshed complete npm audit is six high entries, zero critical/moderate/low. All six trace to the [unpatched braces pattern-walker issue](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) through Vinext's CommonJS/dynamic-import/glob build chain. This is six propagated package entries, not six independent application bugs. The static Pages artifact does not execute that build chain or accept visitor-supplied build patterns. Build only trusted source/inputs and keep development tooling private. This is a bounded exposure assessment, not dependency clearance; track an upstream fix. The [fflate patch advisory](https://github.com/advisories/GHSA-px8p-9vwx-vf98) lists 0.7.5 as patched.

Local Node 24.16.0 lint, TypeScript and all 17 actual-source tests passed. The complete production build and Pages preparation now exit successfully, replacing the prior Windows shutdown failure. It exports all three routes. The local updated static interview page was checked for written-first/disabled live entry, fictional self-review, next-question clearing, career-specific/Cybersecurity reset, and a 390×844 viewport with client/scroll widths both 375 px; captured errors/warnings were empty. Worker dry-run with metrics disabled passed at 150.22 KiB / 30.94 KiB gzip and explicit false flag, with nothing deployed. Large-chunk and ineffective-import build warnings remain; no native performance improvement is claimed.

The prior paused-policy commit `325c5ed4c68d2cde3fe92c3d8a5387b5b921b064` passed clean 17-test/full-build Node 22 CI in run 38097021835. Clean exact-head CI for this additional tooling update is pending publication. No production frontend/Worker rollout, microphone, provider session, billing, credential or account setting changed.

## Historical initial portfolio/security review (2026-10-09)

| Check | Observed result and limit |
| --- | --- |
| Dependency install | Initial clean `npm ci --ignore-scripts`, then locked targeted-patch install passed in the isolated copy. PR workflow also checks a clean lock install. |
| Lint and TypeScript | `npm run lint` and `node node_modules/typescript/bin/tsc --noEmit` passed. |
| Worker regression tests | `npm test`: 11 passed. Actual Worker/metadata source and real SDK use disposable local signing keys; no live service is contacted. |
| Selected-file formatting | oxfmt ran successfully on only the Worker and new test file, exercising the patched tinypool consumer. |
| Static build | `npm run build` passed under Node 24.16.0, exporting three routes and preparing Pages. Initial sandboxed package resolution was blocked; the isolated build passed with filesystem access. |
| Worker bundle | `node node_modules/wrangler/bin/wrangler.js deploy --config wrangler.livekit.jsonc --dry-run --outdir .wrangler/portfolio-dry-run` passed: 150.07 KiB / 30.91 KiB gzip. Metrics disabled; nothing deployed. |
| Advisory report | Initial: 28 affected packages (3 critical). Patched: 22 (0 critical, 16 high, 5 moderate, 1 low). Remaining upgrades and exposure limits are in SECURITY_REVIEW.md. |
| Public frontend | PR #9 is merged; Pages run 34398273576 passed at f7ac294. Current visitor browser verified first-click navigation, water pre-join disclosure, disabled Start before acknowledgment, fictional written self-review, and phone-sized layout; reviewed logs had no errors. |
| Live acceptance | No microphone, active-agent speech, transcript, mute/end, denied-device path, provider logs, retention, billing control, or native-device check was performed. |

The sections below preserve dated September evidence; they are historical observations, not current runtime claims.

## Focused water interview UI checks

| Check | Exact command or action | Result |
| --- | --- | --- |
| Rebase integrity | Rebase PR #9 onto `origin/main` at `52a465d` and preserve the native-anchor interview return link | Passed; PR #9 reports mergeable with head `de3d647` |
| Diff whitespace | `git diff --check` | Passed; only Windows LF-to-CRLF notices were emitted |
| Lint | `npm run lint` | Passed |
| TypeScript | `npx tsc --noEmit` | Passed |
| Static export | Run Vinext build with Node.js 22.22.1 | Passed; three routes were prerendered, including `/interview` |
| Pages artifact | Run `scripts/prepare-pages.mjs` with Node.js 22.22.1 | Passed |
| Built feature markers | Search `dist/client` for `water-presence` and `Transcript` | Passed; the water CSS and interview JavaScript were present |
| Real microphone behavior | Speak with the deployed agent and compare listening/speaking motion | Not run; PR #9 is not deployed and a real microphone session still requires owner testing |
| Browser visual and responsive QA | Inspect active session, transcript drawer, and reduced-motion behavior in supported browsers | Not run in this change |

## Interview-navigation fix checks

| Check | Exact command or action | Result |
| --- | --- | --- |
| Production reproduction | Left-click the `Interview prep` link on the deployed home page, then inspect its URL and hit target | Reproduced; the anchor received focus but navigation was cancelled, while its correct `/byu-is-career-compass/interview` URL remained available to open in a new tab |
| Lint | Run `node_modules/.bin/oxlint` after replacing Vinext `Link` components with native anchors | Passed with no output |
| TypeScript | Run `node_modules/.bin/tsc --noEmit` | Passed with no output |
| Static export | Run `node_modules/.bin/vinext build`, then `node scripts/prepare-pages.mjs` | Passed; `/` and `/interview` were prerendered and the Pages artifact was prepared |
| Local browser navigation | Serve the prepared artifact at the repository base path, left-click `Open Analytics interview practice`, then left-click `Career Compass` | Passed; navigation reached `/byu-is-career-compass/interview/?career=dataAnalytics` on the first click and returned home on the first click |
| Production deployment and navigation | Merge PR #7 as `fc6e17d`, observe Pages workflow `33823461636`, then left-click the deployed `Interview prep` link | Passed; the workflow completed successfully in 46 seconds and the first click reached `/byu-is-career-compass/interview` |

## LiveKit feature-branch checks

| Check | Exact command or action | Result |
| --- | --- | --- |
| Lockfile resolution | `npm install --package-lock-only --ignore-scripts` | Passed; post-merge lockfile generated |
| Clean install | `npm ci` with Node.js 24.16.0 | Passed; 571 packages installed from the lockfile |
| Lint | `npm run lint` | Passed |
| TypeScript | `npx tsc --noEmit` | Passed |
| Static export | Exact `npm run build` script invoked with Node.js 22.22.1 | Passed; `/`, `/interview`, and `404` emitted |
| Artifact layout | Inspect `dist/client` | Passed; interview directory route and `.nojekyll` exist |
| Configured endpoint build | Search generated chunks for disposable endpoint | Passed; the public endpoint was embedded |
| Static preview | Request `/` and `/interview/?career=cybersecurity` | Passed; both returned HTTP 200 |
| Worker bundle | `npx wrangler deploy --config wrangler.livekit.jsonc --dry-run` | Passed; 148.44 KiB upload, 30.51 KiB gzip; nothing published |
| Worker preflight/input/token tests | Local Worker plus HTTP requests | Passed; 204 preflight, 403 foreign origin, 400 invalid career, and 201 valid token |
| Token claims | Decode disposable local token | Passed; 600 seconds, random room/identity, microphone-only publish, fixed `career-interviewer` dispatch, derived metadata |
| Career allow-list | Request a disposable token for every `CAREER_IDS` value | Passed; all eight returned 201 |
| Secret scan | Search tracked source and built artifact for disposable values/non-empty credentials | Passed; zero hits and `.dev.vars` removed |
| Production Worker deploy | `npm run livekit:deploy`, followed by owner-entered Wrangler secrets | Passed; Worker version `2c9318c2-ed99-4c34-bffb-d91a8f2e291d` published at the recorded `workers.dev` endpoint |
| Production Worker HTTP checks | Send allowed preflight, foreign-origin, invalid-career, and valid token requests | Passed; returned 204, 403, 400, and 201 respectively; valid response contained a server URL and participant token |
| LiveKit-enabled Pages deploy | Workflow run `33713674323`, HTTP request, and deployed asset inspection | Passed; workflow succeeded, interview route returned 200, and its JavaScript contains the Worker endpoint and fixed agent name |
| First production browser attempt | Start a live interview in Chrome and inspect the page, console, and LiveKit Sessions | Did not pass; token fetch and signaling started, but the room disconnected before establishment and LiveKit recorded zero sessions |
| Session lifecycle fix | Inspect `useSession` stability, narrow cleanup dependency to `session.end`, run `npm run lint` and `npx tsc --noEmit`, merge PR #5, observe Pages workflow `33715049992`, and reload production | Passed; fix is merged and deployed, and the refreshed page remains ready without repeating the immediate cleanup error |
| LiveKit agent configuration | Inspect the matching Agent Builder configuration | Passed; instructions, greeting, five metadata variables, Deepgram STT, Gemma LLM, Cartesia TTS, and `career-interviewer` dispatch name are configured and saved |
| LiveKit agent deployment | Deploy from Agent Builder and inspect the production agent record | Passed; build completed in 29.5 seconds, version `RzHQfERQN9jP` is in production, and agent `CA_RfBuCqhsQZYt` reports `running`, `career-interviewer`, and 100% uptime at the verification point |
| Format check | `npx oxfmt --check .` | Did not pass; 95 existing files would be rewritten, so no repo-wide format mutation was made |
| Real LiveKit session | Browser with deployed Worker, Pages build, lifecycle fix, and active agent | Pending microphone conversation and session-log inspection |
| Avatar session | Real provider/agent video track | Not implemented |

## Current GitHub Pages evidence from `main`

| Check | Exact command or action | Result |
| --- | --- | --- |
| Pages workflow | Observe `Deploy GitHub Pages` run `33702333157` | Passed after Pages was enabled and the failed deployment job was rerun |
| Lifecycle-fix Pages workflow | Observe `Deploy GitHub Pages` run `33715049992` | Passed after PR #5 merged to `main` |
| Production URL | Open home and Cybersecurity interview URLs | Passed; both returned HTTP 200 and the home page rendered in a browser |
| Pre-integration browser baseline | Quiz, career query, written feedback, assets, and 390-by-844 layout | Passed before LiveKit branch merge |

## Notes

- Dependency installation reports 10 audit findings. No force fix was applied
  because it could introduce unrelated breaking changes.
- With the host's Node.js 24.16.0, Vinext completed the export but exited 1 with
  a Windows libuv shutdown assertion. The exact script passed under Node.js
  22.22.1, matching GitHub Actions `node-version: 22`.
- The client build reports a chunk-size warning after adding LiveKit; it does not
  fail the build.
- A local fake-key token test verifies token shape and grants, not connection to
  LiveKit Cloud.


## Written-first and paused-provider review, 2026-10-10

These observations concern the updated review source only. Main and the existing token Worker remain unchanged.

| Check | Observed result |
| --- | --- |
| Actual-source tests | Passed: 12 Worker tests plus 5 frontend/component rendering tests, 17 total; disposable configuration and rejecting provider mocks only |
| Lint and TypeScript | Passed locally with Node 24.16.0 |
| Worker dry-run | Passed with local log path and metrics disabled; 150.22 KiB, 30.94 KiB gzip; explicit false enable flag; nothing deployed |
| Local build command | Exported all three routes, then exited 1 with the Windows Node 24 libuv shutdown assertion; the command is not counted as passed |
| Pages preparation | Passed as a separate invocation after the export; used only for the bounded local browser check |
| Local browser | Written mode opened by default; live entry disabled; fictional answer produced self-review; next question cleared answer; career-specific mode and Cybersecurity selection reset to question 1 and matching prompt |
| Responsive browser | At a requested 390 by 844 viewport, document client and scroll widths were both 375 px; live entry remained disabled; no page horizontal overflow |
| Browser console | No captured error logs during the above workflow; local root favicon request returned 404 in the static helper log |
| Clean PR CI | Paused-policy commit 325c5ed passed clean 17-test/full-build Node 22 run 38097021835; the later tooling update has separate pending CI |
| Provider and deployment acceptance | Not performed: no microphone, room, token POST, paid usage, credential, billing, retention or provider setting was accessed or changed |

Screenshot evidence is retained privately as `outputs/career-compass-paused-demo.jpg` in the migration workspace. The static helper was stopped after verification. This check does not prove the existing public Worker is paused. Its owner must deploy the updated gate with false or disable issuance, and the LiveKit owner must check existing rooms and alternate dispatch paths.
