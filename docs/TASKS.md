# Task Tracker

Last updated: 2026-09-02

This is the cross-contributor work queue. A task has one owner at a time, a
testable completion condition, and direct evidence before it is marked done.

## Active queue

| ID | Priority | Task | Owner | State | Dependencies | Acceptance criteria | Evidence or next check |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GH-001 | High | Move the frontend to GitHub Pages | Codex | Done | None | Static export is deployed from `main` and the public URL passes smoke tests | PR #3; workflow `33702333157`; live URL verified |
| DOC-001 | High | Publish the coordination pack in the GitHub repository | Codex | Done | None | Documentation is incorporated with the hosting migration | Merged into `deploy/github-pages` |
| QA-001 | High | Establish the application verification baseline | Codex | Done | Node.js 22.13+ | Install, lint, build, and representative browser flows have recorded results | `docs/VERIFICATION.md` |
| LK-001 | High | Confirm LiveKit deployment inputs and privacy policy | Unassigned | Ready | Product owner and LiveKit owner | Agent name, project URL, authentication, recording, transcript retention, and deletion choices are documented without secrets | Record decisions; never commit keys |
| LK-002 | High | Add a protected LiveKit token endpoint | Unassigned | Blocked | LK-001 and runtime compatibility check | Endpoint returns short-lived credentials, dispatches the selected agent, validates allow-listed metadata, and keeps secrets server-only | Add route tests and rejected-input checks |
| LK-003 | High | Replace or extend text practice with a voice session UI | Unassigned | Blocked | LK-002 | Student can start/end, grant microphone access, see connection/listening/thinking/speaking/error states, and fall back to text | Test all eight career query values plus denied permission and disconnect |
| LK-004 | High | Make the agent career-aware | Unassigned | Blocked | LK-003 | Stable career ID and interview mode reach the agent as validated metadata and shape questions without exposing arbitrary prompt text | Verify in LiveKit session events/logs |
| AV-001 | Medium | Select and prototype a virtual-avatar provider | Unassigned | Blocked | Reliable voice flow, budget, disclosure and vendor review | Avatar publishes synchronized video, AI disclosure is visible, startup timeout is handled, and voice-only fallback works | Compare latency, browser support, cost, and failure behavior |
| QA-002 | Medium | Add automated coverage for discovery and interview flows | Unassigned | Ready | Test framework decision | Career validation, scoring, question cycling, and feedback rules have repeatable tests | No test framework currently found |
| DATA-001 | Medium | Resolve career-content gaps | Unassigned | Ready | Verified BYU sources or advisor confirmation | New facts are first documented in `CAREERS.md`, then reflected in `data/careers.ts` | ERP, track details, and unsourced empty fields remain gaps |

Allowed states: `Ready`, `In progress`, `Blocked`, `In review`, and `Done`.

## Coordination rules

- Claim a task by adding one owner and changing its state to `In progress`.
- Split work that would make multiple contributors edit the same file at once.
- Record dependencies before starting work that cannot complete independently.
- Mark `Done` only when acceptance criteria and evidence are satisfied.
- Never place credentials or student data in this tracker.

## New task template

```text
| ID | Priority | Task | Owner | State | Dependencies | Acceptance criteria | Evidence or next check |
```

