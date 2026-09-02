# Decision Log

Record only decisions that constrain future work. Status values are **Proposed**,
**Accepted**, **Superseded**, or **Rejected**.

## D-001: Use Markdown as the cross-contributor coordination layer

- Date: 2026-09-02
- Status: Accepted
- Context: The user requested durable references so contributors and agents can
  collaborate without rebuilding project context.
- Decision: Use root `AGENTS.md` for mandatory rules and separate context,
  status, tasks, architecture, integration planning, verification, decisions,
  workflow, and handoff files under `docs/`.
- Consequences: Contributors have a predictable entry point and must keep
  time-sensitive status current.
- Evidence or related files: `AGENTS.md`, `docs/README.md`

## D-002: Treat CAREERS.md as the career-content source of truth

- Date: 2026-09-02
- Status: Accepted
- Context: The repository contains career facts, program-wide statistics, quiz
  constructs, and known evidence gaps that must not be conflated.
- Decision: Add verified BYU sources to `CAREERS.md` before changing related
  claims in `data/careers.ts`. Do not present program-wide outcomes as
  career-specific.
- Consequences: Some fields intentionally remain empty until research is
  complete. Quiz traits and weights remain clearly team-authored.
- Evidence or related files: `CAREERS.md`, `data/careers.ts`

## D-003: Use the GitHub repository as the shared project record

- Date: 2026-09-02
- Status: Accepted
- Context: The earlier Live Share view and the Codex writable mirror did not
  expose the same source. The user identified
  `nola4211/byu-is-career-compass` as the repository used with collaborators.
- Decision: Keep coordination documents beside the application in that
  repository and exchange material changes through focused branches and pull
  requests.
- Consequences: A local or Live Share-only note is not a durable handoff until it
  is represented in the repository. GitHub write access is required to publish.
- Evidence or related files: User direction on 2026-09-02; `docs/STATUS.md`

## D-004: Deliver LiveKit in a voice-first sequence

- Date: 2026-09-02
- Status: Proposed
- Context: The user has configured an Agent Builder voice agent and wants to
  connect it to the existing interview page, then add a talking avatar. The
  current page is text-only, and Agent Builder does not implement virtual
  avatars.
- Decision: First add a protected token endpoint and reliable voice session UI.
  Convert or extend the deployed agent with the Agents SDK for an avatar only
  after the voice path passes failure-state and privacy checks.
- Alternatives considered: Ship voice and avatar together; embed a separate
  avatar outside the LiveKit room; retain only text practice.
- Consequences: The project gets a testable milestone and voice-only fallback.
  The avatar remains a separate provider, cost, latency, and disclosure decision.
- Evidence or related files: `docs/LIVE_INTERVIEW_PLAN.md`

## Entry template

```text
## D-NNN: Short decision title

- Date: YYYY-MM-DD
- Status: Proposed | Accepted | Superseded | Rejected
- Context:
- Decision:
- Alternatives considered:
- Consequences:
- Evidence or related files:
```

