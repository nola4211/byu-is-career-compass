# Task Tracker

Last updated: 2026-10-10

| ID | Priority | Task | Owner | State | Dependencies | Acceptance criteria | Evidence or next check |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GH-001 | High | Publish the frontend with GitHub Pages | Codex | Done | None | Static export is deployed from `main` and public smoke tests pass | PR #3; workflow `33702333157`; live URL verified |
| DOC-001 | High | Maintain the coordination pack | Codex | Done | None | Docs describe current architecture and handoff | Updated with LiveKit integration |
| QA-001 | High | Re-run the application baseline after the merge | Codex | Done | Resolved lockfile | Install, lint, typecheck, build, Worker bundle, and route checks are recorded | Passed checks and environment caveat in `docs/VERIFICATION.md` |
| LK-001 | High | Confirm production privacy and retention choices | Product owner | Ready | Provider settings | Recording, transcripts, analytics, disclosure, and deletion choices are documented | Do not promise privacy beyond verified behavior |
| LK-002 | High | Deploy the scoped LiveKit token endpoint | Repository owner | Done | Cloudflare access and LiveKit secrets | Worker is deployed, rejects invalid input/origins, and returns short-lived scoped tokens | Historical deployment evidence; current source has no authentication, rate limiting, or admission quota; security review remains open |
| LK-003 | High | Integrate and accept the live voice session UI | Shared contributors | In progress | Real microphone test | Start/end, mute, state, transcript, fallback work in a real session | PR #9 merged; Pages 34398273576 passed; pre-join/written/phone-sized browser flows observed; microphone conversation remains unverified |
| LK-004 | High | Pass career-aware session metadata to the agent | Codex | In progress | Real microphone test | All eight IDs and both modes are validated; derived metadata reaches agent | Builder defines all five variables and the matching agent is running; verify received values in a real session |
| AV-001 | Medium | Select and prototype a virtual-avatar provider | Unassigned | Blocked | Reliable voice flow, budget, disclosure, vendor review | Synchronized video works with timeout and voice-only fallback | Frontend video-track slot is ready |
| QA-002 | Medium | Add automated product-flow coverage | Unassigned | Ready | Test framework decision | Career validation, scoring, question cycling, and LiveKit failure states have repeatable tests | No test framework currently found |
| QA-003 | High | Restore first-click navigation to interview practice | Codex | Done | None | Every home-page interview link and the interview-page return link navigate with one normal left-click | PR #7; Pages workflow `33823461636`; production first-click verified |
| UX-001 | High | Simplify the live interview presentation | Cameron Boyle with AI tools | In progress | Real microphone acceptance | Water presence and opt-in transcript respond correctly in a real session | PR #9 merged; pre-join UI observed; speaking/listening reaction and active transcript remain unverified |
| DATA-001 | Medium | Resolve career-content gaps | Unassigned | Ready | Verified BYU sources | Facts enter `CAREERS.md` before `data/careers.ts` | Existing evidence rules remain in force |

| SEC-001 | High | Bound token input and fail closed under zero-spending policy | Codex review branch | In review | Shared review and separate Cloudflare owner rollout | Written-first public UI, no paused session construction, exact server opt-in and disabled deploy configs | Updated 17 tests, lint and TypeScript passed; latest build/dry-run/browser/CI recorded in VERIFICATION.md |
| COST-001 | High | Disable existing public token issuance and check active/alternate sessions | Cloudflare owner; Cameron for LiveKit | Ready | Provider access and separate rollout | No new token available and no existing/alternate billable agent dispatch | Reported account ownership only; no provider setting changed. Keep voice paused, no paid test |
| SEC-002 | High | Add live-session admission, rate, duration, and cost controls | Service owner | Ready | Provider/account access and agreed policy | Unauthorized/excess requests rejected; active sessions terminate at a server boundary | Not implemented; origin and token expiry are insufficient |
| DEP-001 | High | Review remaining tooling advisories | Shared contributors | In progress | Upgrade compatibility checks | Audited graph and representative build/Worker checks recorded | Targeted patches reduce 28 affected packages to 22 and remove critical entries; no general clearance |

Allowed states: `Ready`, `In progress`, `Blocked`, `In review`, and `Done`.

Never place credentials or student data in this tracker.
