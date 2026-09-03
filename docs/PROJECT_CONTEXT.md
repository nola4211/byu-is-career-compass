# Project Context

Last reviewed: 2026-09-02

Checked against: local branch `feat/livekit-interview`, based on documentation
branch `docs/agent-coordination-livekit`

## Product definition

**Verified:** BYU IS Career Compass helps students compare eight BYU-connected
Information Systems career paths, receive a lightweight quiz match, and choose
between a LiveKit-powered voice interview and written self-review practice.

**Reported goal:** Complete a reliable spoken mock-interview pilot with the
user's deployed LiveKit agent, then add an optional talking-avatar provider.

| Question | Current answer |
| --- | --- |
| Primary users | Students exploring or preparing for BYU Information Systems careers |
| Main entry point | `app/page.tsx` at `/` |
| Interview entry point | `app/interview/page.tsx` at `/interview?career=<CareerId>` |
| Supported career paths | Eight stable IDs defined in `data/careers.ts` |
| Authentication | No student authentication; the token route validates origin and allow-listed metadata |
| Persistence | None found; current quiz and interview state are in React memory |
| External application APIs | Server-only LiveKit token generation and browser LiveKit room connection |
| Deployment tooling | Vinext/Vite with OpenAI Sites and Cloudflare configuration |

## Current user journeys

### Career discovery

1. A student starts a five-answer quiz on `/`.
2. Each prompt gives two choices and ten seconds to respond. Timed-out questions
   move to the end without changing the score.
3. Weights from `data/questions.ts` rank all eight career IDs.
4. The student reviews the highest match and can compare all career summaries.
5. The student opens `/interview` with the selected career in the query string.

The quiz is recommendation logic authored by the project team. It is not shown
in the code or source notes as a validated assessment.

### Interview practice

1. The interview page validates the requested career ID and defaults to
   `dataAnalytics` if it is missing or invalid.
2. The student chooses behavioral or career-specific mode and live or written
   practice.
3. Live practice asks for a display name, practice company, and explicit AI/data
   acknowledgement before requesting microphone access.
4. The server validates the stable career ID and mode, creates a short-lived
   microphone-only LiveKit token, and dispatches `career-interviewer` with
   normalized metadata.
5. The student can see interviewer state, ephemeral transcript messages, mute,
   end, and switch to written practice.
6. Written practice retains the original three-question draft and local
   heuristic self-review flow.

**Verified limitation:** The implementation has been tested with disposable
token-signing values only. A real LiveKit media session and the deployed agent's
receipt of metadata remain unverified until hosting secrets are configured.

## Content boundary

`CAREERS.md` is the repository's source-of-truth policy for career claims. It
requires BYU-specific facts to be sourced before they enter `data/careers.ts`.
Program-wide placement statistics must remain program-wide. Empty arrays in a
career object represent known evidence gaps rather than permission to invent
content.

## Product and compliance unknowns

- Formal BYU brand approval or sponsorship is **Unknown**.
- Required browser/device support and accessibility acceptance criteria are
  **Unknown**.
- Student authentication, provider-side transcript retention, analytics, age
  requirements, and data-deletion policy for a live interview are **Unknown**.
- The browser disclosure is implemented, but formal legal/product approval of
  that wording is **Unknown**.
- The LiveKit project URL and agent name are recorded; deployed-version readiness
  and avatar provider/account IDs remain **Unknown**.
- Production ownership and budget limits for LiveKit, model inference, and an
  avatar provider are **Unknown**.

Resolve these unknowns before describing the live feature as production-ready.
See `LIVE_INTERVIEW_PLAN.md` for implemented and remaining integration phases.

