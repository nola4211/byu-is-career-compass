# Current Project Status

Snapshot: 2026-09-02

## State

**The career-discovery and written-practice frontend is live on GitHub Pages.
The LiveKit voice integration is implemented on `feat/livekit-interview`; a
real voice session remains unavailable until its external token Worker is
deployed with owner-provided credentials and connected to the Pages build.**

## Production frontend

- Pull request #3 was squash-merged to `main` as `d702da4`.
- GitHub Pages workflow run `33702333157` succeeded.
- `https://nola4211.github.io/byu-is-career-compass/` and its interview route
  were recorded as HTTP 200 and browser-verified.

## Completed in the feature branch

- Preserved the Vinext static export and GitHub Pages deployment architecture.
- Added a live/written practice selector without removing written self-review.
- Added LiveKit session lifecycle, explicit microphone start, mute/end controls,
  agent-state UI, transcript display, error handling, and written fallback.
- Added server-side metadata validation shared by the frontend and Worker.
- Added a separately deployable Cloudflare Worker that creates ten-minute,
  microphone-only LiveKit participant tokens and dispatches only the fixed
  `career-interviewer` agent.
- Added an avatar video-track render path with a voice visualization fallback.
- Added GitHub Actions support for the public
  `VITE_LIVEKIT_TOKEN_ENDPOINT` repository variable.

## Verification status

- Clean install, lint, TypeScript, Node 22 static export, artifact layout,
  static HTTP routes, and Worker dry-run passed.
- Disposable-key local tests passed for CORS, invalid input, a ten-minute
  microphone-only token, fixed agent dispatch, normalized metadata, and all
  eight career IDs.
- Formatting check reports 95 existing files would change; no repo-wide format
  rewrite was made.
- No real LiveKit session, avatar, Worker deployment, or LiveKit-enabled Pages
  deployment is claimed. See `docs/VERIFICATION.md` for exact evidence.

## Blockers requiring owner access

1. Add `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` to the Worker environment.
2. Authenticate the Cloudflare CLI/account and deploy the Worker.
3. Add the resulting HTTPS URL as the GitHub Actions repository variable
   `VITE_LIVEKIT_TOKEN_ENDPOINT`.
4. Confirm `career-interviewer` is active, then test a real browser/device
   session after the feature branch is merged and Pages redeploys.

## Next action

Update pull request #2, complete the owner-access configuration, and run the
first real voice session before marking LiveKit production-ready.

