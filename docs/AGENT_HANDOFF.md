# Agent Handoff

Updated: 2026-09-02

## Objective

Finish the hosted LiveKit voice-session setup and real-device validation for the
new `/interview` integration, then evaluate an optional avatar provider.

## Authorized scope completed

- Added the LiveKit client and server SDK dependencies.
- Added a server-only token endpoint with fixed agent dispatch, short token
  lifetime, randomized identifiers, origin validation, microphone-only publish
  permission, and metadata allow-listing.
- Added the live prejoin, explicit microphone start, interviewer state,
  transcript, mute/end, error, disclosure, and optional video-track UI.
- Preserved the written question and local self-review experience as a fallback.
- Added `.env.example` without credentials and updated architecture, status,
  tasks, verification, decision, and plan documentation.
- Did not commit a credential, configure production secrets, change billing,
  select an avatar vendor, or run a real student/provider session.

## Main files in this change set

- `app/api/livekit-token/route.ts`
- `app/interview/page.tsx`
- `components/interview/live-interview.tsx`
- `lib/interview-session.ts`
- `app/globals.css`
- `.env.example`
- `package.json` and `package-lock.json`
- Current coordination files under `docs/`

## Checks and results

- Production build and focused lint: passed.
- Local interview route: returned HTTP 200.
- Token happy path with disposable credentials: returned a ten-minute,
  microphone-only token for a randomized room and fixed `career-interviewer`
  dispatch; server-normalized metadata was present.
- Invalid career metadata and untrusted origin: rejected with HTTP 400 and 403.
- Full lint/TypeScript: failed only on documented pre-existing files.
- Exact commands and output summary: `docs/VERIFICATION.md`.

## Unverified or blocked

- Production LiveKit API key/secret are intentionally not in the repository or
  local handoff.
- The Sites connector returned `project_not_found` for the checked-in project ID
  in the current workspace; `.openai/hosting.json` was left unchanged.
- A real microphone/agent session, all eight careers, interruption, denial,
  timeout, reconnect, mobile layout, and keyboard access remain unverified.
- The token route still needs an approved authentication or durable abuse/rate
  control before broad public release.
- Provider-side transcript/recording retention policy is not confirmed.
- Avatar provider, account, budget, disclosure, and fallback behavior remain
  undecided.

## Best next action

Review GitHub pull request 2, restore access to the checked-in Sites project in
the connected workspace, configure the server-only variables from
`.env.example`, confirm the `career-interviewer` deployment is ready, and run a
real voice session. Inspect the token route and agent logs without copying
secrets into issues or chat.

## Do not change without explicit agreement

- The stable eight `CareerId` values and their source policy
- Program-wide statistics into career-specific claims
- Billing, retention, recording, or avatar-provider settings
- Secrets or personally identifying student information

