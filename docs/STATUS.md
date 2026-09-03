# Current Project Status

Snapshot: 2026-09-02

## State

**The LiveKit integration and credentialed token Worker are deployed. The first
browser test reached the token endpoint and LiveKit signaling, but the frontend
ended the room during the connection-state render. The cause is fixed on
`fix/livekit-session-lifecycle`; a successful microphone-to-agent session is
not yet claimed. The matching `career-interviewer` Agent Builder configuration
also still shows `deploying` / `Not deployed yet` in LiveKit Cloud.**

Pull request #2 is updated against current `main` and reports mergeable.

## Production frontend

- Pull request #3 was squash-merged to `main` as `d702da4`.
- GitHub Pages workflow run `33702333157` succeeded.
- `https://nola4211.github.io/byu-is-career-compass/` and its interview route
  were recorded as HTTP 200 and browser-verified.
- Pull request #2 was squash-merged to `main` as `e753a13`.
- GitHub Pages workflow run `33713674323` succeeded with the configured public
  token endpoint embedded in the interview-page JavaScript.

## Completed on `main`

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
- The first production browser attempt requested a token and started LiveKit
  signaling, then disconnected before a room was established. Browser logs and
  the component source traced this to the cleanup effect depending on the
  changing session object. The focused fix depends only on the stable `end`
  callback; lint and TypeScript pass.
- Formatting check reports 95 existing files would change; no repo-wide format
  rewrite was made.
- No real LiveKit session, avatar, or LiveKit-enabled Pages deployment is
  claimed. See `docs/VERIFICATION.md` for exact evidence.

## Blockers requiring owner access

1. Merge and deploy the session-lifecycle fix.
2. Deploy the existing `career-interviewer` Agent Builder configuration.
3. Repeat the real browser/device session.

## Next action

Release the lifecycle fix and run the first successful real voice session
before marking LiveKit production-ready.
