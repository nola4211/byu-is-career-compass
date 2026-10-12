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


## D-007 / D-008: Historical pause proposals

- Dates: 2026-10-09 / 2026-10-10
- Status: Superseded by D-010
- The optional Worker pause and later written-first/exact-opt-in proposal were
  not merged. Their shutdown requirements no longer apply. The bounded-input
  changes are retained independently.

## D-009: Separate the stylesheet from component generation

- Date: 2026-10-10
- Status: Proposed for shared review
- Decision: Retain the exact shadcn 4.18.0 stylesheet and MIT notice locally, while removing the unneeded generator executable from the installed application graph. Keep the actually imported @shadcn/react library. Upgrade Vinext/RSC/Wrangler compatibly and apply Satori's official same-series fflate patch.
- Consequences: The original styling still builds while 265 generator-chain packages are removed. October 10 checks passed at the previous draft revision; current checks are recorded separately in VERIFICATION.md. Six propagated audit entries remain through an unpatched build-only braces chain; monitor upstream and build trusted source. No production deployment or general security clearance follows from these checks.

## D-010: Preserve voice availability after billing clarification

- Date: 2026-10-12
- Status: Proposed for shared review; Cameron requested removal of billing pause
- Context: Cameron reports no paid services or payment method for this project.
- Decision: Restore main's configured live prejoin and written fallback, remove
  the proposed enable flags/gates, and retain bounded request validation and
  dependency fixes. Preserve consent before Start.
- Consequences: No Cloudflare shutdown deployment is needed. Shipping Worker
  validation remains a separate owner deployment. Real speech/device/privacy
  acceptance and shared review are still independent of billing status.
