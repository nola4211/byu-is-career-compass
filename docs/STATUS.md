# Current Project Status

Snapshot: 2026-09-02

Checked against: GitHub repository `nola4211/byu-is-career-compass`, main commit
`7cc52e6e9aa6e89a00a08f823ecea68b4fd29327`, and the project-specific
documentation change set in the Codex workspace

## State

**The career-discovery and text interview experience exists. Live voice and
avatar interviewing are planned but not implemented.**

## Verified

- The main route implements a timed five-answer career journey across eight
  stable career IDs.
- The interview route supports career selection, two question modes, typed
  responses, and local rule-based feedback.
- No LiveKit package, backend/API route, authentication, persistence, microphone
  capture, transcript service, recording, or avatar integration exists in the
  inspected repository tree.
- The project uses React 19, TypeScript, Vinext, Vite, Tailwind CSS, OpenAI Sites,
  and Cloudflare tooling.
- `package.json` requires Node.js 22.13.0 or newer and declares `dev`, `build`,
  `start`, `lint`, and `format` scripts.
- `CAREERS.md` governs career-content sourcing and known evidence gaps.
- The GitHub connection has push access, and the documentation is published on
  `docs/agent-coordination-livekit` for review against `main`.

## Completed in this documentation update

- Replaced the placeholder Live Share notes with an audit of the real GitHub
  project.
- Documented current routes, data flow, build tooling, source-of-truth rules,
  risks, and known unknowns.
- Added a phased LiveKit voice and virtual-avatar integration plan.
- Kept this change documentation-only; no application code was modified.

## Remaining gaps

- Application build, lint, and browser verification have not been run because
  the source repository is not checked out in the writable workspace.
- LiveKit project values, deployed agent name, product consent/retention choices,
  and avatar-provider selection are not recorded in the repository.

## Next actions

1. Review and merge the documentation pull request.
2. Run the baseline install, lint, build, and responsive browser checks.
3. Confirm the deployed LiveKit agent name and production authentication policy.
4. Implement the voice-only session slice before adding an avatar.
5. Choose and test an avatar provider only after the voice flow is reliable.

