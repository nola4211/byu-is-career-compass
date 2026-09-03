# Task Tracker

Last updated: 2026-09-02

| ID | Priority | Task | Owner | State | Dependencies | Acceptance criteria | Evidence or next check |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GH-001 | High | Publish the frontend with GitHub Pages | Codex | Done | None | Static export is deployed from `main` and public smoke tests pass | PR #3; workflow `33702333157`; live URL verified |
| DOC-001 | High | Maintain the coordination pack | Codex | Done | None | Docs describe current architecture and handoff | Updated with LiveKit integration |
| QA-001 | High | Re-run the application baseline after the merge | Codex | Done | Resolved lockfile | Install, lint, typecheck, build, Worker bundle, and route checks are recorded | Passed checks and environment caveat in `docs/VERIFICATION.md` |
| LK-001 | High | Confirm production privacy and retention choices | Product owner | Ready | Provider settings | Recording, transcripts, analytics, disclosure, and deletion choices are documented | Do not promise privacy beyond verified behavior |
| LK-002 | High | Deploy the protected LiveKit token endpoint | Repository owner | In review | Cloudflare access and LiveKit secrets | Worker is deployed, rejects invalid input/origins, and returns short-lived scoped tokens | Local Worker passed; real deployment pending |
| LK-003 | High | Integrate the live voice session UI | Codex | In review | LK-002 for end-to-end test | Student can start/end, mute, see state/transcript/errors, and use written fallback | Code complete; real device test pending |
| LK-004 | High | Pass career-aware session metadata to the agent | Codex | In review | Active LiveKit deployment | All eight IDs and both modes are validated; derived metadata reaches agent | Local endpoint passed; verify in LiveKit logs |
| AV-001 | Medium | Select and prototype a virtual-avatar provider | Unassigned | Blocked | Reliable voice flow, budget, disclosure, vendor review | Synchronized video works with timeout and voice-only fallback | Frontend video-track slot is ready |
| QA-002 | Medium | Add automated product-flow coverage | Unassigned | Ready | Test framework decision | Career validation, scoring, question cycling, and LiveKit failure states have repeatable tests | No test framework currently found |
| DATA-001 | Medium | Resolve career-content gaps | Unassigned | Ready | Verified BYU sources | Facts enter `CAREERS.md` before `data/careers.ts` | Existing evidence rules remain in force |

Allowed states: `Ready`, `In progress`, `Blocked`, `In review`, and `Done`.

Never place credentials or student data in this tracker.

