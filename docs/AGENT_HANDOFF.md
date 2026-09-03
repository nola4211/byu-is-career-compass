# Agent Handoff

Updated: 2026-09-02

## Objective

Complete the LiveKit voice interview on the GitHub Pages site without exposing
secrets, while retaining written practice and preparing the UI for an avatar.

## Current production result

- PR #3 was squash-merged to `main` as `d702da4`.
- GitHub Pages deploys through GitHub Actions.
- Workflow run `33702333157` succeeded.
- The current non-LiveKit site is verified at
  `https://nola4211.github.io/byu-is-career-compass/`.

## Completed in `feat/livekit-interview`

- Merged the current GitHub Pages/static-export architecture.
- Integrated LiveKit session UI and written fallback into `/interview`.
- Added shared career/mode metadata validation.
- Added a separately deployable Cloudflare token Worker.
- Added Worker examples/scripts and Pages endpoint-variable wiring.
- Added an avatar video-track slot with a voice visualization fallback.
- Passed the local checks recorded in `docs/VERIFICATION.md`.

## Next owner-access steps

1. In the intended Cloudflare account, set Worker secrets
   `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`.
2. Run `npm run livekit:deploy` and record the HTTPS Worker URL.
3. Add that URL to the GitHub Actions repository variable
   `VITE_LIVEKIT_TOKEN_ENDPOINT`.
4. Confirm the LiveKit deployment name is exactly `career-interviewer` and is
   active.
5. Merge pull request #2, observe the Pages workflow, and test a live session on
   desktop and mobile.

## Guardrails

- Never put provider secrets in GitHub Pages variables, source, logs, or pull
  request text.
- Do not claim recordings or transcripts are private or unretained until the
  provider configuration proves it.
- Keep the eight `CareerId` values and `CAREERS.md` evidence policy stable.
- Do not select or purchase an avatar provider without owner approval.

