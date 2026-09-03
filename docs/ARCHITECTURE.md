# Architecture Reference

Last reviewed: 2026-09-02

Checked against: local branch `feat/livekit-interview`, based on documentation
branch `docs/agent-coordination-livekit`

## Verified system map

The repository is a TypeScript and React 19 application using the Next.js App
Router programming model through Vinext. Vite builds the application for a
Cloudflare-based OpenAI Sites runtime. The application now has one server route
for LiveKit tokens and the LiveKit client/server SDKs. There is still no database
binding, object-storage binding, or student authentication layer.

| Path | Responsibility | Important dependencies or constraints |
| --- | --- | --- |
| `app/layout.tsx` | Root HTML, Geist fonts, metadata, and global stylesheet | Applies to every route |
| `app/page.tsx` | Career-discovery quiz, ranking, explorer, and navigation to interview prep | Client component; all state is in memory |
| `app/interview/page.tsx` | Career/mode/format selection and written-practice fallback | Client component; reads `career` query parameter |
| `components/interview/live-interview.tsx` | Live session lifecycle, microphone controls, agent state, transcript, and optional video track | Client component; starts media only after user action |
| `app/api/livekit-token/route.ts` | Validated short-lived token generation and fixed agent dispatch | Server-only credentials; generated rooms; same-origin request boundary |
| `lib/interview-session.ts` | Shared interview-mode and metadata allow-list/normalization | Preserves the eight stable `CareerId` values |
| `app/globals.css` | Full site, journey, career, interview, responsive, and reduced-motion styling | Contains most product-specific presentation |
| `data/careers.ts` | Career IDs, sourced content, presentation accents, and program profile | Governed by `CAREERS.md` |
| `data/questions.ts` | Discovery questions and per-answer score weights | Team-authored recommendation logic |
| `components/ui/` | Reusable Shadcn/Base UI presentation components | Do not modify broadly for a page-only change |
| `CAREERS.md` | Career schema, source policy, confirmed facts, and gaps | Read before any career-content change |
| `vite.config.ts` | Vinext, OpenAI Sites, Tailwind, and Cloudflare Vite plugins | Uses `.openai/hosting.json`; optional D1/R2 bindings are null |
| `.openai/hosting.json` | OpenAI Sites project link and optional storage bindings | `d1` and `r2` are currently null |
| `package.json` | Node requirement, dependencies, and scripts | Requires Node.js 22.13.0 or newer |

## Current data flows

### Discovery flow

`data/questions.ts` -> React state in `app/page.tsx` -> weighted score per
`CareerId` -> ranked result -> `data/careers.ts` presentation ->
`/interview?career=<CareerId>`.

Nothing in this flow is sent to a server or persisted by application code.

### Written interview flow

URL `career` value -> allow-list validation against `CAREER_IDS` -> question list
derived from `data/careers.ts` -> typed textarea response -> local `useMemo`
heuristics -> feedback displayed in the page.

The written response remains in React state and is cleared when the user changes
career, mode, or question. It is not sent to the LiveKit token route.

### Live interview flow

`career` query value -> allow-list validation -> client prejoin acknowledgement
-> standardized request to `/api/livekit-token` -> server normalization ->
ten-minute microphone-only participant token with fixed agent dispatch ->
LiveKit room -> `career-interviewer` audio/state/transcript and optional video ->
ephemeral React rendering.

The server ignores client-provided room names, participant identities, job-title
claims, and agent names. It derives career display text from `data/careers.ts`.
The web application does not write transcripts or recordings to persistence.
Provider-side retention remains unverified.

### Host tool integration

`app/page.tsx` conditionally registers an `open_career_exploration` tool when the
host supplies `document.modelContext.registerTool`. The tool selects a supported
career and scrolls the visible page. It does not itself call an external API.

## LiveKit boundary

1. The browser can request only a supported career/mode session through the
   same-origin token route.
2. The server chooses the room, participant identity, ten-minute lifetime,
   microphone-only grant, normalized metadata, and fixed agent dispatch.
3. The browser publishes the student's microphone and renders LiveKit agent
   state, audio, transcript messages, and any agent camera track.
4. A future avatar worker may publish synchronized video to the same room; no
   provider is selected or configured yet.

Keep `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, and any avatar-provider key on the
server. Never include them in a client component, public environment variable,
repository file, log, or handoff.

See `LIVE_INTERVIEW_PLAN.md` for phases and acceptance criteria.

## Architecture risks and unknowns

- The Vinext/OpenAI Sites build and local runtime support the token route; the
  hosted runtime with real credentials is not yet verified.
- There are no automated tests in the inspected tree.
- There is an explicit prejoin AI/data acknowledgement, but no error-reporting,
  analytics, authentication, or durable rate limit.
- LiveKit session retention, transcript handling, and recording defaults have
  not been selected or verified for this product.
- An avatar increases latency, cost, failure modes, and disclosure obligations;
  voice-only must remain a usable fallback.

