# Project Context

Last reviewed: 2026-09-02

Checked against: `nola4211/byu-is-career-compass` at main commit
`7cc52e6e9aa6e89a00a08f823ecea68b4fd29327`

## Product definition

**Verified:** BYU IS Career Compass is a client-rendered web experience that
helps students compare eight BYU-connected Information Systems career paths,
receive a lightweight quiz match, and practice written answers to behavioral or
career-specific interview questions.

**Reported goal:** Extend the existing interview page into a live, spoken mock
interview powered by the user's deployed LiveKit agent, with an optional
talking-avatar video experience.

| Question | Current answer |
| --- | --- |
| Primary users | Students exploring or preparing for BYU Information Systems careers |
| Main entry point | `app/page.tsx` at `/` |
| Interview entry point | `app/interview/page.tsx` at `/interview?career=<CareerId>` |
| Supported career paths | Eight stable IDs defined in `data/careers.ts` |
| Authentication | None found |
| Persistence | None found; current quiz and interview state are in React memory |
| External application APIs | None found in the inspected source |
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
2. The student chooses behavioral or career-specific mode.
3. The student types a response to one of three questions.
4. Local heuristics check word count, sequencing words, and concrete context.
5. The response can be revised or the student can advance to the next question.

**Verified limitation:** Despite the on-page `not recorded` label, the current
feature does not open a microphone or recording session at all. It is text-only
and does not use an AI feedback service.

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
- Student authentication, transcript retention, analytics, consent language,
  age requirements, and data-deletion policy for a live interview are
  **Unknown**.
- The deployed LiveKit agent name, LiveKit project URL, deployment target, and
  avatar provider/account IDs are not present in the repository.
- Production ownership and budget limits for LiveKit, model inference, and an
  avatar provider are **Unknown**.

Resolve these unknowns before describing the live feature as production-ready.
See `LIVE_INTERVIEW_PLAN.md` for the proposed technical sequence.

