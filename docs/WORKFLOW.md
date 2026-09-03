# Contributor Workflow

## 1. Orient

1. Read `AGENTS.md`, `docs/PROJECT_CONTEXT.md`, and `docs/STATUS.md`.
2. Read `CAREERS.md` before changing career content, labels, quiz logic, or
   interview prompts.
3. Pull current `main`, inspect repository status, and create a focused branch.
4. Read the user's request literally and identify the authorized files and
   external actions.
5. Separate verified facts, reported goals, proposals, and unknowns.

## 2. Plan

- State the outcome, files likely to change, and checks that will prove success.
- Note dependencies and claim the relevant row in `docs/TASKS.md`.
- Surface destructive, production, billing, privacy, or publication decisions
  before performing them.
- For LiveKit work, define the secret boundary and session-data policy first.

## 3. Implement

- Make the smallest focused edit and preserve unrelated work.
- Follow existing React, TypeScript, and styling patterns.
- Keep the stable `CareerId` allow-list between the URL, UI, token endpoint, and
  agent metadata. Do not send arbitrary client-provided instructions to the
  agent.
- Update `CAREERS.md` before code when introducing a new BYU-specific fact.
- Keep all LiveKit and avatar-provider secrets in server-only environment
  variables. `.env*` files are already ignored and must remain uncommitted.
- Preserve a text or voice-only fallback when adding media features.

## 4. Verify

Install from the lockfile and run repository-defined checks:

```bash
npm ci
npm run lint
npm run build
```

Use `npm run dev` for manual UI verification. Check at least desktop and narrow
mobile layouts, keyboard focus, reduced motion, every affected career route, and
relevant failure states. Record only observed results in `docs/VERIFICATION.md`.

For a LiveKit change, also check:

- microphone allowed, denied, unavailable, and revoked;
- connection, agent dispatch, reconnect, end, and timeout behavior;
- listening, thinking, speaking, muted, and error states;
- no API key or secret appears in browser source, network payloads, or logs;
- metadata is allow-listed and malformed values are rejected;
- avatar join failure falls back to usable audio;
- transcript/recording behavior matches the disclosed policy.

## 5. Hand off

Before ending material work:

1. Update `docs/STATUS.md`.
2. Update `docs/TASKS.md` and `docs/VERIFICATION.md`.
3. Update architecture or decisions only if they genuinely changed.
4. Replace `docs/AGENT_HANDOFF.md` when another contributor must continue.
5. Open a focused pull request describing changed files, checks and results,
   unverified areas, and the single best next action.

## Failure handling

- Preserve the meaningful error and the command or action that produced it.
- Distinguish product defects from environment, access, provider, and
  missing-configuration failures.
- Do not repeatedly retry the same action without changing the approach.
- Never describe an unrun check as passing.

