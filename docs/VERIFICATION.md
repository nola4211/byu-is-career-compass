# Verification Reference

Last updated: 2026-09-02

## Feature-branch checks

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
| Format check | `npx oxfmt --check .` | Did not pass; 95 existing files would be rewritten, so no repo-wide format mutation was made |
| Real LiveKit session | Browser with deployed Worker and real credentials | Pending owner configuration |
| Avatar session | Real provider/agent video track | Not implemented |

## Verified on the GitHub Pages migration before this merge

The `main` migration recorded passing `npm ci`, lint, static export, artifact
layout, quiz completion, direct career link, written self-review, repository-path
assets, and a 390-by-844 mobile-width check. These results are historical
evidence, not a claim that the merged LiveKit branch has passed them unchanged.

## Notes

- Dependency installation currently reports 10 audit findings. No automatic
  force fix was applied because that could introduce unrelated breaking changes.
- With the host's Node.js 24.16.0, Vinext completed the export but then exited 1
  with a Windows libuv shutdown assertion. The exact build script passed under
  Node.js 22.22.1, matching the GitHub Actions `node-version: 22` configuration.
- The client build reports a chunk-size warning after adding LiveKit; it does not
  fail the build.
- A configured production build must not contain API keys or test credentials.
- A local fake-key token test verifies token shape and grants, not connection to
  LiveKit Cloud.
