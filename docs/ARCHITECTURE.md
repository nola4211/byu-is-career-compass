# Architecture Reference

Last reviewed: 2026-09-02

Checked against: `nola4211/byu-is-career-compass` at main commit
`7cc52e6e9aa6e89a00a08f823ecea68b4fd29327`

## Verified system map

The repository is a TypeScript and React 19 application using the Next.js App
Router programming model through Vinext. Vite builds the application for a
Cloudflare-based OpenAI Sites runtime. There is no application backend route,
database binding, object-storage binding, authentication layer, or LiveKit SDK
in the inspected tree.

| Path | Responsibility | Important dependencies or constraints |
| --- | --- | --- |
| `app/layout.tsx` | Root HTML, Geist fonts, metadata, and global stylesheet | Applies to every route |
| `app/page.tsx` | Career-discovery quiz, ranking, explorer, and navigation to interview prep | Client component; all state is in memory |
| `app/interview/page.tsx` | Text-only interview questions and heuristic self-review | Client component; reads `career` query parameter |
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

### Interview flow

URL `career` value -> allow-list validation against `CAREER_IDS` -> question list
derived from `data/careers.ts` -> typed textarea response -> local `useMemo`
heuristics -> feedback displayed in the page.

The response remains in React state and is cleared when the user changes career,
mode, or question. No transcript or recording code exists.

### Host tool integration

`app/page.tsx` conditionally registers an `open_career_exploration` tool when the
host supplies `document.modelContext.registerTool`. The tool selects a supported
career and scrolls the visible page. It does not itself call an external API.

## Proposed LiveKit boundary

The live interview is not implemented. The proposed boundary is:

1. A server-only token endpoint validates the request and creates short-lived
   LiveKit connection credentials with agent dispatch information.
2. The `/interview` client starts and ends a LiveKit session, publishes the
   student's microphone, and renders connection/agent state.
3. The deployed agent receives only allow-listed session metadata such as the
   stable career ID, display name, question mode, and optional difficulty.
4. The agent publishes speech and transcript/state events back to the room.
5. If enabled, an avatar worker publishes synchronized audio and video as a
   separate room participant; the frontend renders the resulting video track.

Keep `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, and any avatar-provider key on the
server. Never include them in a client component, public environment variable,
repository file, log, or handoff.

See `LIVE_INTERVIEW_PLAN.md` for phases and acceptance criteria.

## Architecture risks and unknowns

- The current Vinext/OpenAI Sites runtime must be verified to support the chosen
  server token-route implementation before coding it.
- There are no automated tests in the inspected tree.
- No error-reporting, analytics, or consent flow is present.
- LiveKit session retention, transcript handling, and recording defaults have
  not been selected or verified for this product.
- An avatar increases latency, cost, failure modes, and disclosure obligations;
  voice-only must remain a usable fallback.

