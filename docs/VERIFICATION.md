# Verification Reference

Last updated: 2026-09-03

## Interview-navigation fix checks

| Check | Exact command or action | Result |
| --- | --- | --- |
| Production reproduction | Left-click the `Interview prep` link on the deployed home page, then inspect its URL and hit target | Reproduced; the anchor received focus but navigation was cancelled, while its correct `/byu-is-career-compass/interview` URL remained available to open in a new tab |
| Lint | Run `node_modules/.bin/oxlint` after replacing Vinext `Link` components with native anchors | Passed with no output |
| TypeScript | Run `node_modules/.bin/tsc --noEmit` | Passed with no output |
| Static export | Run `node_modules/.bin/vinext build`, then `node scripts/prepare-pages.mjs` | Passed; `/` and `/interview` were prerendered and the Pages artifact was prepared |
| Local browser navigation | Serve the prepared artifact at the repository base path, left-click `Open Analytics interview practice`, then left-click `Career Compass` | Passed; navigation reached `/byu-is-career-compass/interview/?career=dataAnalytics` on the first click and returned home on the first click |

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
