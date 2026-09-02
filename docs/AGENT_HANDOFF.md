# Agent Handoff

Updated: 2026-09-02

## Objective

Publish this project-specific coordination pack, establish the application
verification baseline, and then connect the existing `/interview` experience to
the user's deployed LiveKit interviewer before adding an optional avatar.

## Authorized scope completed

- Audited the public GitHub repository and replaced generic Live Share
  placeholders with verified project details.
- Documented the current career-discovery and text-only interview flows.
- Documented Vinext/OpenAI Sites/Cloudflare build and hosting boundaries.
- Added a phased voice and avatar plan with privacy, secret, fallback, and
  acceptance-criteria guardrails.
- No application code, deployment, account, billing setting, or secret changed.

## Files in this documentation change set

- `AGENTS.md`
- `docs/README.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/STATUS.md`
- `docs/TASKS.md`
- `docs/ARCHITECTURE.md`
- `docs/LIVE_INTERVIEW_PLAN.md`
- `docs/WORKFLOW.md`
- `docs/VERIFICATION.md`
- `docs/DECISIONS.md`
- `docs/AGENT_HANDOFF.md`

## Checks and results

- GitHub `main` tree and task-relevant source files: inspected successfully at
  commit `7cc52e6e9aa6e89a00a08f823ecea68b4fd29327`.
- Application lint/build/preview: not run because the source is not checked out
  in the writable workspace.
- Documentation relative-link check: see the current result in
  `docs/VERIFICATION.md`.
- GitHub branch/PR publication: see the current result in `docs/STATUS.md` and
  `docs/VERIFICATION.md`.

## Unverified or blocked

- LiveKit agent name, URL, production authentication, and session-data policy
  are not recorded in the repository.
- Avatar provider, account, budget, disclosure, and fallback behavior remain
  undecided.

## Best next action

Review and merge the documentation-only pull request. After merge, claim
`QA-001`, run the baseline checks, and then claim `LK-001` before writing LiveKit
integration code.

## Do not change without explicit agreement

- The stable eight `CareerId` values and their source policy
- Program-wide statistics into career-specific claims
- Production deployment, billing, retention, or recording settings
- Secrets or personally identifying student information

