# Current Project Status

Snapshot: 2026-09-02

Checked against: local branch `feat/livekit-interview`, based on documentation
branch `docs/agent-coordination-livekit`

## State

**The interview page now contains a voice-first LiveKit client and keeps the
existing written exercise as a fallback. The secure production credentials and
a real provider session still need to be configured and verified. An avatar is
supported by the UI when the agent publishes video, but no avatar provider is
configured.**

## Verified

- The main route implements a timed five-answer career journey across eight
  stable career IDs.
- The interview route supports career selection, two question modes, live voice
  practice, and the original typed-response self-review.
- `app/api/livekit-token/route.ts` issues ten-minute, microphone-only participant
  tokens from server-only credentials, generates room and participant IDs on the
  server, validates career/mode metadata, and fixes agent dispatch to
  `career-interviewer`.
- `components/interview/live-interview.tsx` requests microphone access only
  after the student starts, renders agent states and ephemeral transcript
  messages, supports mute/end actions, and displays an explicit AI/data-use
  acknowledgement.
- The page renders an agent video track when one exists and otherwise preserves
  the voice-only presentation.
- The project uses React 19, TypeScript, Vinext, Vite, Tailwind CSS, OpenAI Sites,
  and Cloudflare tooling.
- `package.json` requires Node.js 22.13.0 or newer and declares `dev`, `build`,
  `start`, `lint`, and `format` scripts.
- `CAREERS.md` governs career-content sourcing and known evidence gaps.
- The LiveKit project URL is
  `wss://is-core-case-2026-zat9gox0.livekit.cloud`; the configured agent name is
  `career-interviewer`.
- The implementation is published for review in GitHub pull request 2 from
  `feat/livekit-interview`, based on the latest observed `main` commit.

## Verification completed

- Dependency installation and the production build pass locally.
- Focused lint for every changed TypeScript/TSX integration file passes.
- The local interview URL returns HTTP 200.
- With disposable local credentials, the token endpoint returned HTTP 201,
  normalized metadata, enforced a ten-minute lifetime, dispatched only
  `career-interviewer`, and granted microphone-only publication.
- Invalid metadata returned HTTP 400 and an untrusted origin returned HTTP 403.
- Token requests for all eight supported career IDs returned HTTP 201 in the
  disposable local verification.
- The full repository lint and TypeScript checks still fail only on pre-existing
  files; see `docs/VERIFICATION.md`.

## Remaining gaps

- A real microphone-to-agent session has not been run because production
  `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` values are intentionally absent.
- The checked-in OpenAI Sites project ID returned `project_not_found` in the
  current connected workspace, so a hosted version could not be saved or
  deployed from this environment.
- The token route does not yet have user authentication or durable abuse/rate
  controls. Origin validation alone is not sufficient protection for an open
  public release.
- Browser visual, keyboard, microphone-denial, reconnect, interruption, and real
  agent behavior across all eight careers remain unverified.
- Transcript/recording retention policy and avatar provider selection remain
  product decisions. The web application itself does not persist transcripts.

## Next actions

1. Add the LiveKit key and secret to the hosting environment without exposing
   them to client code, then set the production allowed origin.
2. Confirm that `career-interviewer` is fully deployed and accepts the documented
   metadata fields.
3. Run one real desktop and mobile voice session, including interruption, mute,
   end, denial, timeout, and written fallback.
4. Add authentication or an approved rate/abuse-control boundary before broad
   public release.
5. Choose an avatar provider only after the real voice flow is reliable.

