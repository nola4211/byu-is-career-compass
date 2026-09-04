# Current Project Status

Snapshot: 2026-09-03

## State

**The LiveKit frontend, credentialed token Worker, session-lifecycle fix, and
matching `career-interviewer` Agent Builder deployment are live. LiveKit Cloud
shows the agent running in production with the expected explicit dispatch
name. A successful microphone-to-agent conversation is not yet claimed.**

**A focused navigation fix is in review on
`fix/interview-prep-navigation`.** The deployed site reproduces a Vinext
client-router failure where a normal left-click on an interview link is
cancelled even though opening the same URL in a new tab works. The fix uses
native anchors for static cross-route navigation. Lint, TypeScript, the static
export, and a local browser click-through passed.

## Production frontend

- Pull request #3 was squash-merged to `main` as `d702da4`.
- GitHub Pages workflow run `33702333157` succeeded.
- `https://nola4211.github.io/byu-is-career-compass/` and its interview route
  were recorded as HTTP 200 and browser-verified.
- Pull request #2 was squash-merged to `main` as `e753a13`.
- GitHub Pages workflow run `33713674323` succeeded with the configured public
  token endpoint embedded in the interview-page JavaScript.
- Pull request #5 was squash-merged to `main` as `90cb244`.
- GitHub Pages workflow run `33715049992` succeeded with the session-lifecycle
  fix.

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
- Deployed Agent Builder version `RzHQfERQN9jP` to production. LiveKit Cloud
  reports agent ID `CA_RfBuCqhsQZYt`, dispatch name `career-interviewer`, status
  `running`, and 100% uptime at the verification point.

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
  changing session object. The stable-`end` callback fix is merged and deployed;
  the refreshed public page remains ready without repeating that error.
- The Agent Builder prompt, greeting, five metadata variables, model pipeline,
  production version, and exact explicit dispatch name were browser-verified.
- Formatting check reports 95 existing files would change; no repo-wide format
  rewrite was made.
- No successful real microphone conversation or avatar session is claimed. See
  `docs/VERIFICATION.md` for exact evidence.

## Blockers requiring owner access

1. Run a real desktop microphone conversation and verify that the agent joins,
   receives the session metadata, speaks, transcribes, and ends normally.
2. Confirm provider retention, recording, deletion, and cost policies before
   calling the feature production-ready.
3. Repeat the accepted flow on mobile and cover denial/disconnect cases.

## Next action

Merge and deploy the interview-navigation fix, then confirm the production
Interview prep link opens on the first left-click. The separate LiveKit next
action remains a successful real voice session with session-log inspection.
