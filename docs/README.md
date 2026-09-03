# Project Documentation

This directory is the shared coordination layer for BYU IS Career Compass.
Durable facts, current work, and proposed integrations are kept separate so that
an old handoff does not become an accidental requirement.

| File | Purpose | Update when |
| --- | --- | --- |
| [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) | Product purpose, users, boundaries, and current behavior | Product scope or evidence changes |
| [`STATUS.md`](STATUS.md) | Current snapshot, blockers, and next actions | At the end of material work |
| [`TASKS.md`](TASKS.md) | Priorities, owners, dependencies, and acceptance criteria | Task state or ownership changes |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Verified components, file map, and data flows | Structure or integration behavior changes |
| [`LIVE_INTERVIEW_PLAN.md`](LIVE_INTERVIEW_PLAN.md) | LiveKit voice implementation and avatar rollout plan | The integration design or rollout changes |
| [`WORKFLOW.md`](WORKFLOW.md) | How contributors inspect, change, verify, and hand off work | Development or release procedures change |
| [`VERIFICATION.md`](VERIFICATION.md) | Commands, observed results, and verification gaps | Checks are discovered or run |
| [`DECISIONS.md`](DECISIONS.md) | Durable decisions and rationale | A consequential choice is accepted or superseded |
| [`AGENT_HANDOFF.md`](AGENT_HANDOFF.md) | Short continuation brief for unfinished work | Ownership changes or work pauses |

The root [`../AGENTS.md`](../AGENTS.md) contains mandatory operating rules.
Career content is governed by [`../CAREERS.md`](../CAREERS.md).

## Writing conventions

- Use exact repository paths and commands.
- Attach a date (`YYYY-MM-DD`) to time-sensitive claims.
- Prefer short statements backed by observable evidence.
- Mark missing knowledge as **Unknown** rather than guessing.
- Mark designs that are not implemented as **Proposed**.
- Replace stale status; preserve history only when it explains a decision.

