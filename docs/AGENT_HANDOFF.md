# Agent Handoff

Updated: 2026-09-02

## Objective

Complete the LiveKit voice interview on the GitHub Pages site without exposing
secrets, while retaining written practice and preparing the UI for an avatar.

## Current production result

- PR #3 was squash-merged to `main` as `d702da4`.
- PR #2 was squash-merged to `main` as `e753a13`.
- GitHub Pages deploys through GitHub Actions.
- LiveKit-enabled workflow run `33713674323` succeeded.
- The current site and configured interview bundle are verified at
  `https://nola4211.github.io/byu-is-career-compass/`.

## Completed and deployed

- Merged the current GitHub Pages/static-export architecture.
- Integrated LiveKit session UI and written fallback into `/interview`.
- Added shared career/mode metadata validation.
- Added a separately deployable Cloudflare token Worker.
- Added Worker examples/scripts and Pages endpoint-variable wiring.
- Added an avatar video-track slot with a voice visualization fallback.
- Passed the local checks recorded in `docs/VERIFICATION.md`.
- Deployed and production-smoke-tested the credentialed Worker at
  `https://byu-is-career-compass-livekit-token.nola4211-career-compass.workers.dev`.

## Current fix

- The first Chrome test fetched a token and began LiveKit signaling, but the
  room disconnected before establishment and no LiveKit session was recorded.
- Browser logs and `useSession` behavior showed the cleanup effect ran whenever
  the changing session object re-rendered.
- `fix/livekit-session-lifecycle` depends on the stable `session.end` callback
  instead; lint and TypeScript pass, with production retesting still required.
- The matching builder is named `career-interviewer`, but LiveKit Cloud shows
  both Agent Builder records as `deploying` / `Not deployed yet`; neither has a
  deployed agent name or version.

## Next owner-access steps

1. Merge and deploy the session-lifecycle fix.
2. Deploy the existing `career-interviewer` Agent Builder configuration.
3. Test a live session on desktop and mobile.

## Guardrails

- Never put provider secrets in GitHub Pages variables, source, logs, or pull
  request text.
- Do not claim recordings or transcripts are private or unretained until the
  provider configuration proves it.
- Keep the eight `CareerId` values and `CAREERS.md` evidence policy stable.
- Do not select or purchase an avatar provider without owner approval.
