# Agent Operating Guide

This file is the entry point for every human or AI agent working on BYU IS
Career Compass. Read it before making changes.

## Mission

Help students explore BYU Information Systems career paths and practice for
related interviews through small, traceable, verified changes. Preserve working
behavior, keep career claims tied to their sources, and leave enough context for
the next contributor to continue without reconstructing the session.

## Required reading

1. `AGENTS.md` (this file)
2. `docs/README.md`
3. `docs/PROJECT_CONTEXT.md`
4. `docs/STATUS.md`
5. `CAREERS.md` before changing career facts, labels, scoring, or prompts
6. `docs/AGENT_HANDOFF.md` when work is unfinished or changing owners

Then read only the task-relevant references linked from the documentation index.

## Source-of-truth order

When information conflicts, trust sources in this order:

1. The current user's explicit request and scope
2. The current repository and reproducible command or runtime output
3. Tests, build configuration, and observed application behavior
4. The career-content rules and citations in `CAREERS.md`
5. Accepted decisions in `docs/DECISIONS.md`
6. Other project documentation
7. Assumptions or prior-agent summaries

Never promote an assumption to a fact. Label statements as **Verified**,
**Reported**, **Proposed**, or **Unknown** when their status matters.

## Project guardrails

- `CAREERS.md` governs claims in `data/careers.ts`. Add a verified source there
  before adding a new BYU-specific claim to the application.
- Program-wide placement and salary figures must not be presented as outcomes
  for an individual career path.
- Treat `traits` and quiz weights as team-authored recommendation logic, not BYU
  research or a validated career assessment.
- Do not expose LiveKit, model-provider, or avatar-provider secrets to client
  components. Secrets belong in server-only environment variables.
- Do not imply that a typed response, microphone stream, transcript, recording,
  or analytics event is private unless the implemented data flow proves it.
- Preserve the eight `CareerId` values unless a coordinated data migration is
  explicitly approved; URLs and interview selection depend on them.

## Change rules

- Stay inside the requested scope and preserve unrelated work.
- Inspect before editing and prefer the smallest reversible change.
- Work on a focused branch and use a pull request for shared changes unless the
  repository owner explicitly requests a direct update.
- Never add credentials, access tokens, private keys, or personal student data.
- Do not claim a command, test, UI flow, or deployment passed unless it was run
  in the current environment and its result was observed.
- Ask before destructive, irreversible, production, billing, publication, or
  external-message actions unless the user already authorized that exact action.

## Known commands

These commands are declared in `package.json`; their current results are tracked
in `docs/VERIFICATION.md`.

```bash
npm ci
npm run dev
npm run lint
npm run format
npm run build
npm run start
```

The repository requires Node.js 22.13.0 or newer.

## Documentation duties

For any material change:

- Update `docs/STATUS.md` with the result, verification, and next action.
- Update `docs/TASKS.md` when ownership, priority, dependencies, or task state
  changes.
- Update `docs/ARCHITECTURE.md` only when verified structure or data flow changes.
- Record reproducible check results in `docs/VERIFICATION.md`.
- Add to `docs/DECISIONS.md` only for a durable choice with meaningful tradeoffs.
- Leave `docs/AGENT_HANDOFF.md` ready for the next contributor when work remains.

Documentation must describe the repository as it exists, not as an agent hopes
it will exist. Replace stale status instead of accumulating contradictions.

## Completion standard

A task is complete only when the requested artifact exists, relevant checks have
run or are explicitly marked unavailable, and the handoff states what changed,
what was verified, what was not verified, and the next action or blocker.

