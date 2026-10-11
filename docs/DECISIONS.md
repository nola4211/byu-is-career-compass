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


## D-007: Bound token input and retain an optional operational pause

- Date: 2026-10-09
- Status: Proposed for shared review
- Decision: Stream-read at most 8,192 bytes before signing, validate the JSON structure, and use the Worker-only `LIVEKIT_INTERVIEWS_ENABLED=false` to pause new tokens. Keep unset compatible with current behavior.
- Consequences: Malformed/oversized input gets a bounded response and operators have a new-token pause after an approved rollout. Existing sessions, authentication, throttling, quota accounting, retention, and costs still require separate controls. Use tested patch versions and scoped overrides while leaving wider tooling migrations for their own compatibility review.

## D-008: Written-first showcase and explicit live opt-in

- Date: 2026-10-10
- Context: Cameron requests no demo usage charges and reports separate LiveKit/Cloudflare account owners.
- Decision: Open written practice by default. Require exact true flags in frontend and token service; public Pages and Worker deployment configs explicitly set false. This supersedes D-007's unset-means-enabled compatibility choice.
- Consequences: The prepared showcase cannot start voice through normal UI or token signing when paused. A separate owner rollout is necessary to close the existing endpoint. Existing rooms, alternate dispatch and provider billing are not controlled by a frontend change. Future live testing needs a separate approved budget and privacy/admission controls.

## D-009: Separate the stylesheet from component generation

- Date: 2026-10-10
- Status: Proposed for shared review
- Decision: Retain the exact shadcn 4.18.0 stylesheet and MIT notice locally, while removing the unneeded generator executable from the installed application graph. Keep the actually imported @shadcn/react library. Upgrade Vinext/RSC/Wrangler compatibly and apply Satori's official same-series fflate patch.
- Consequences: The original styling still builds while 265 generator-chain packages are removed. Local full build, 17 tests, types/lint, dry-run and browser checks pass. Six propagated audit entries remain through an unpatched build-only braces chain; monitor upstream and build trusted source. No production deployment or general security clearance follows from these checks.
