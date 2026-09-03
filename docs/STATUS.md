# Current Project Status

Snapshot: 2026-09-02

## State

**The career-discovery and written-practice frontend is live on GitHub Pages.
The LiveKit voice integration is implemented on `feat/livekit-interview`, and
its credentialed token Worker is deployed and responding correctly. A real
voice session remains unavailable until the endpoint is connected to the Pages
build and the feature branch is released.**

Pull request #2 is updated against current `main` and reports mergeable.

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
- Deployed the credentialed token Worker at
  `https://byu-is-career-compass-livekit-token.nola4211-career-compass.workers.dev`.

## Verification status

- Clean install, lint, TypeScript, Node 22 static export, artifact layout,
  static HTTP routes, and Worker dry-run passed.
- Disposable-key local tests passed for CORS, invalid input, a ten-minute
  microphone-only token, fixed agent dispatch, normalized metadata, and all
  eight career IDs.
- The deployed Worker returned 204 for an allowed preflight, 403 for a foreign
  origin, 400 for an invalid career, and 201 with a server URL and participant
  token for a valid request.
- Formatting check reports 95 existing files would change; no repo-wide format
  rewrite was made.
- No real LiveKit session, avatar, or LiveKit-enabled Pages deployment is
  claimed. See `docs/VERIFICATION.md` for exact evidence.

## Blockers requiring owner access

1. Add the deployed Worker URL as the GitHub Actions repository variable
   `VITE_LIVEKIT_TOKEN_ENDPOINT`.
2. Confirm `career-interviewer` is active, then test a real browser/device
   session after the feature branch is merged and Pages redeploys.

## Next action

Complete the owner-access configuration, merge pull request #2, and run the
first real voice session before marking LiveKit production-ready.
