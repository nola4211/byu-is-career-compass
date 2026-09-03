# Current Project Status

Snapshot: 2026-09-02

## State

**The GitHub Pages frontend and live-interview code are integrated on
`feat/livekit-interview`. A real voice session remains unavailable until the
external token Worker is deployed with owner-provided LiveKit credentials and
its public URL is added to the Pages build.**

## Completed in the branch

- Preserved Vinext static export and GitHub Pages deployment from `main`.
- Added a live/written practice selector without removing the existing written
  self-review flow.
- Added LiveKit session lifecycle, explicit microphone start, mute/end controls,
  agent-state UI, transcript display, error handling, and written fallback.
- Added server-side metadata validation shared by the frontend and Worker.
- Added a separately deployable Cloudflare Worker that creates ten-minute,
  microphone-only LiveKit participant tokens and dispatches only the fixed
  `career-interviewer` agent.
- Added a video-track render path so a future LiveKit avatar participant can be
  displayed while retaining a voice visualization fallback.
- Added GitHub Actions support for the public
  `VITE_LIVEKIT_TOKEN_ENDPOINT` repository variable.

## Verification status

- Clean install, lint, TypeScript, Node 22 static export, artifact layout,
  static HTTP routes, and Worker dry-run passed.
- Local disposable-key tests passed for CORS, invalid input, a ten-minute
  microphone-only token, fixed agent dispatch, normalized metadata, and all
  eight career IDs.
- Formatting check reports 95 existing files would change; no repo-wide format
  rewrite was made.
- No real LiveKit token, voice session, avatar, Worker deployment, or production
  deployment is claimed. See `docs/VERIFICATION.md` for exact evidence.

## Blockers requiring owner access

1. Add `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` to the Worker environment.
2. Authenticate the Cloudflare CLI/account and deploy the Worker.
3. Add the resulting Worker URL as the GitHub Actions repository variable
   `VITE_LIVEKIT_TOKEN_ENDPOINT`.
4. Confirm the `career-interviewer` LiveKit deployment is active, then run a
   real browser/device session.

## Next action

Update pull request #2, then complete the owner-access steps above before
merging for a production voice test.
