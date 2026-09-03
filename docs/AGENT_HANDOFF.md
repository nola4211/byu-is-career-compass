# Agent Handoff

Updated: 2026-09-02

## Objective

Complete the live LiveKit voice interview on the GitHub Pages site without
exposing secrets, while retaining written practice and preparing the UI for a
later avatar.

## Completed in `feat/livekit-interview`

- Merged the GitHub Pages/static-export architecture from `main`.
- Integrated LiveKit session UI and written fallback into `/interview`.
- Added shared career/mode metadata validation.
- Added a separately deployable Cloudflare token Worker.
- Added Worker examples/scripts and Pages endpoint-variable wiring.
- Added an avatar video-track slot with a voice-only visualization fallback.

## Current verification

See `docs/VERIFICATION.md`. Real provider and production checks are pending and
must not be reported as passed.

## Next owner-access steps

1. In the intended Cloudflare account, set Worker secrets
   `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`.
2. Run `npm run livekit:deploy` and record the HTTPS Worker URL.
3. Add that URL to the GitHub repository Actions variable
   `VITE_LIVEKIT_TOKEN_ENDPOINT`.
4. Confirm the LiveKit deployment name is exactly `career-interviewer` and is
   active.
5. Merge the feature pull request, observe the Pages workflow, and test a live
   session on desktop and mobile.

## Guardrails

- Never put provider secrets in GitHub Pages variables, `.env.example`, source,
  logs, or pull-request text.
- Do not claim recordings or transcripts are private or unretained until the
  provider configuration proves it.
- Keep the eight `CareerId` values and `CAREERS.md` evidence policy stable.
- Do not select or purchase an avatar provider without owner approval.

