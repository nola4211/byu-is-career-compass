# Decision Log

Statuses are **Proposed**, **Accepted**, **Superseded**, or **Rejected**.

## D-001: Use Markdown as the coordination layer

- Date: 2026-09-02
- Status: Accepted
- Decision: Use root `AGENTS.md` for mandatory rules and focused references in
  `docs/` for context, status, tasks, architecture, verification, decisions,
  workflow, and handoff.

## D-002: Treat CAREERS.md as the career-content source of truth

- Date: 2026-09-02
- Status: Accepted
- Decision: Add verified BYU sources to `CAREERS.md` before changing related
  claims in `data/careers.ts`. Keep program-wide outcomes separate from
  individual career paths and label quiz scoring as team-authored logic.

## D-003: Use GitHub as the shared project record

- Date: 2026-09-02
- Status: Accepted
- Decision: Keep coordination documents beside the application in
  `nola4211/byu-is-career-compass` and exchange material work through focused
  branches and pull requests.

## D-004: Deliver LiveKit voice before an avatar

- Date: 2026-09-02
- Status: Accepted
- Decision: Keep written practice as a fallback, add a LiveKit voice session as
  the first media milestone, and render video only when an agent/avatar track is
  available. Select and deploy an avatar provider after voice passes real-device,
  failure-state, privacy, latency, and cost checks.
- Consequence: The interface is avatar-ready without coupling the initial voice
  rollout to a new paid provider.

## D-005: Publish the static frontend with GitHub Pages

- Date: 2026-09-02
- Status: Accepted
- Decision: Use Vinext static export, publish `dist/client` from `main` with
  GitHub Actions, and serve the project at
  `https://nola4211.github.io/byu-is-career-compass/`.
- Consequence: Dynamic token signing must run outside GitHub Pages.

## D-006: Run token signing as a separate Cloudflare Worker

- Date: 2026-09-02
- Status: Accepted
- Context: GitHub Pages cannot protect `LIVEKIT_API_SECRET`, while the browser
  requires short-lived room credentials and explicit agent dispatch.
- Decision: Deploy `services/livekit-token-worker/src/index.ts` independently.
  Inject only its public HTTPS URL into the Pages build and store LiveKit API
  credentials as Worker secrets.
- Alternatives considered: Reintroduce a dynamic application host; use a
  long-lived token in the browser; leave voice documentation-only.
- Consequences: Frontend and token service have separate deployments. The owner
  must configure Cloudflare secrets and one GitHub Actions variable.

