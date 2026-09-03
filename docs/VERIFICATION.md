# Verification Reference

Last updated: 2026-09-02

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
| Session lifecycle fix | Inspect `useSession` stability, narrow cleanup dependency to `session.end`, run `npm run lint` and `npx tsc --noEmit` | Passed locally; production redeploy and microphone test pending |
| LiveKit agent deployment | Inspect Agents list and matching `career-interviewer` builder configuration | Pending; two Agent Builder records show `deploying` / `Not deployed yet`, with no deployed name or version |
| Format check | `npx oxfmt --check .` | Did not pass; 95 existing files would be rewritten, so no repo-wide format mutation was made |
| Real LiveKit session | Browser with deployed Worker and real credentials | Pending Pages variable, feature release, and microphone test |
| Avatar session | Real provider/agent video track | Not implemented |

## Current GitHub Pages evidence from `main`

| Check | Exact command or action | Result |
| --- | --- | --- |
| Pages workflow | Observe `Deploy GitHub Pages` run `33702333157` | Passed after Pages was enabled and the failed deployment job was rerun |
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
