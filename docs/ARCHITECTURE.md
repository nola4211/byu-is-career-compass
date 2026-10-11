# Architecture Reference

Last reviewed: 2026-10-10 (review branch; source changes unmerged)

## System map

The project has two deployment units:

1. A React 19/Vinext static frontend exported to `dist/client` and published by
   GitHub Pages.
2. A separate Cloudflare Worker that signs short-lived LiveKit tokens. Secrets
   remain in the Worker environment and never enter the static bundle.

| Path | Responsibility | Constraint |
| --- | --- | --- |
| `app/page.tsx` | Career quiz, ranking, and interview navigation | Client state only |
| `app/interview/page.tsx` | Career query validation and live/written composition | Static route; no server API |
| `components/interview/live-interview.tsx` | LiveKit session, media, transcript, state, controls, fallback | Requires explicit frontend opt-in before session construction |
| `lib/live-interview-policy.ts` | Exact-string opt-in and frontend endpoint gate | Shared fail-closed policy; no secrets |
| `lib/interview-session.ts` | Stable ID/mode allow-lists and normalized metadata | Shared with Worker; no secrets |
| `services/livekit-token-worker/src/index.ts` | Origin/input validation, token signing, room/identity creation, agent dispatch | Server-only secrets |
| `wrangler.livekit.jsonc` | Worker build/deploy configuration and non-secret defaults | Secrets must be added separately |
| `.github/workflows/deploy-pages.yml` | Lint, static build, and Pages deployment | Reads endpoint variable; explicitly disables public voice opt-in |
| `next.config.ts` | Static export and repository asset prefix | Prefix is `/byu-is-career-compass` in production |
| `scripts/prepare-pages.mjs` | Normalizes the static artifact for GitHub Pages | Runs after `vinext build` |
| `data/careers.ts` | Eight stable career IDs and presentation data | Governed by `CAREERS.md` |

## Discovery flow

`data/questions.ts` -> in-memory React scoring -> ranked `CareerId` ->
`/interview?career=<CareerId>`.

No application server receives or persists discovery answers.

## Written-first public demo

The interview route initially renders written self-review, even with an enabled
voice endpoint. The live choice is disabled unless the explicit frontend opt-in
and endpoint are both configured. The live component repeats that gate before
constructing the LiveKit session. Written responses use local heuristics.

## Live interview flow (only after explicit future opt-in)

1. The interview page allow-lists `careerId` and `mode` and creates display
   metadata; arbitrary prompts, agent names, room names, and identities are not
   accepted from the browser.
2. LiveKit's standardized token client posts agent metadata to
   `VITE_LIVEKIT_TOKEN_ENDPOINT`.
3. The Worker enforces one configured browser origin, reads at most 8,192 UTF-8
   bytes, validates the JSON object shape, and parses metadata with
   `lib/interview-session.ts`. The Worker requires
   `LIVEKIT_INTERVIEWS_ENABLED=true`; any other or missing value returns 503
   before body parsing/token signing. Deployed config explicitly uses false.
   Active rooms are unaffected. The existing service still needs owner rollout.
4. The Worker generates random room/participant identifiers and a ten-minute
   token with room join, subscribe, data, and microphone-only publish grants.
5. The token embeds dispatch for the fixed `career-interviewer` agent.
6. The client joins, publishes microphone audio only after a student action,
   renders agent audio/state/transcript, and displays an agent camera track if
   one is later published.

The current frontend does not store transcripts or recordings. This does not
establish what LiveKit or downstream model providers retain.

## Environment boundary

Public static-build value:

- `VITE_LIVEKIT_TOKEN_ENDPOINT`
- `VITE_LIVE_INTERVIEWS_ENABLED` (explicit opt-in; Pages workflow sets false)

Worker-only values:

- `LIVEKIT_URL`
- `LIVEKIT_INTERVIEWS_ENABLED` (exact true required; config sets false)
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `LIVEKIT_AGENT_NAME`
- `LIVEKIT_ALLOWED_ORIGIN`

Only the endpoint and LiveKit WebSocket URL are public connection information.
API credentials and future avatar/model keys must remain server-side.

## Known risks

- The static frontend and Worker must be deployed independently and configured
  with matching origins.
- No user authentication or per-student rate limit is implemented; the Worker
  restricts origin, request shape, token lifetime, and token capabilities but
  origin checks are not a substitute for authentication.
- Real provider retention, recording behavior, reconnect behavior, device
  support, cost, and accessibility remain to be verified.
- Avatar video adds a provider, latency, cost, and failure boundary; voice and
  written fallbacks must remain usable.


## Reviewed build-tool boundary (2026-10-10)

The review branch uses Vinext 1.1.0 with RSC plugin 0.5.36 and Wrangler 4.149.0. `app/globals.css` imports the original shadcn stylesheet from `vendor/shadcn/tailwind.css`; its MIT notice and package/hash provenance are alongside it. The generator executable is not installed. This changes the build graph, not the application's role/session/data boundary. Pages remains a static artifact; the Worker deploy remains separate. Six propagated braces advisories remain in the trusted-source build chain and are documented in SECURITY_REVIEW.md.
