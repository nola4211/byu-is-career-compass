# Project Context

Last reviewed: 2026-09-02

## Product definition

**Verified:** BYU IS Career Compass is a client-rendered web experience that
helps students compare eight BYU-connected Information Systems career paths,
receive a lightweight quiz match, and practice behavioral or career-specific
interview answers.

**Implemented, pending deployment configuration:** The interview page supports
a live spoken practice session with the `career-interviewer` LiveKit agent. A
written self-review exercise remains available when voice is unavailable or the
student prefers not to use a microphone.

| Question | Current answer |
| --- | --- |
| Primary users | Students exploring or preparing for BYU Information Systems careers |
| Main entry point | `app/page.tsx` at `/` |
| Interview entry point | `app/interview/page.tsx` at `/interview?career=<CareerId>` |
| Supported career paths | Eight stable IDs defined in `data/careers.ts` |
| Authentication | None found |
| Application persistence | None; quiz and practice-page state remain in React memory |
| Frontend hosting | Vinext static export published to GitHub Pages |
| Public URL | `https://nola4211.github.io/byu-is-career-compass/` |
| Live token service | Cloudflare Worker in `services/livekit-token-worker/`; deployment pending |

## Current user journeys

### Career discovery

1. A student completes a five-answer quiz on `/`.
2. Weights from `data/questions.ts` rank the eight career IDs.
3. The student reviews the highest match and can compare all career summaries.
4. The student opens interview practice with the selected career in the URL.

The quiz is team-authored recommendation logic, not a validated assessment.

### Interview practice

1. The page allow-lists the requested career and defaults to `dataAnalytics`.
2. The student chooses behavioral or career-specific questions and live or
   written practice.
3. Live practice shows an AI disclosure and requests microphone access only
   after an explicit Start action.
4. The browser requests a short-lived room token from the configured external
   Worker. The Worker validates career and mode, derives display metadata, and
   dispatches the fixed LiveKit agent.
5. The student can see agent state and ephemeral transcript messages, mute, end
   the session, or return to written practice.
6. If the build has no public token endpoint, the live panel explains that
   setup is pending and keeps written practice usable.

Written responses use only local heuristics and remain labeled self-review.
The frontend does not persist transcripts or recordings in application code.
Provider-side retention and recording settings are still **Unknown** and must
be confirmed before calling the feature production-ready.

## Content boundary

`CAREERS.md` governs career claims. Add verified BYU sources there before
changing related claims in `data/careers.ts`. Program-wide statistics must not
be presented as individual-career outcomes.

## Known external configuration

- LiveKit URL: `wss://is-core-case-2026-zat9gox0.livekit.cloud`
- Agent dispatch name: `career-interviewer`
- Public token endpoint build variable: `VITE_LIVEKIT_TOKEN_ENDPOINT`
- Server-only Worker secrets: `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`

Never commit provider credentials or expose them through a client environment
variable. See `LIVE_INTERVIEW_PLAN.md` for rollout and avatar work.

## Product and compliance unknowns

- Formal BYU brand approval or sponsorship is **Unknown**.
- Supported browser/device and accessibility acceptance criteria are **Unknown**.
- LiveKit/model-provider transcript, audio, and analytics retention are **Unknown**.
- Student authentication, deletion policy, session cost limits, and production
  ownership are **Unknown**.
- No avatar provider or budget is approved.

