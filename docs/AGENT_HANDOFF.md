# Agent Handoff

Updated: 2026-09-02

## Objective

Move BYU IS Career Compass from OpenAI Sites to GitHub Pages while preserving
the existing quiz and text interview and leaving LiveKit documentation-only.

## Completed

- Prepared a static Vinext export and GitHub Pages workflow.
- Removed OpenAI Sites and Cloudflare runtime dependencies and configuration.
- Made navigation and exported assets work beneath the repository project path.
- Merged and updated the LiveKit planning documentation to require an external
  secure token endpoint in the future.
- Passed install, lint, build, desktop interaction, direct route, and mobile
  width checks; see `docs/VERIFICATION.md`.

## Publication result

- PR #3 was squash-merged to `main` as `d702da4`.
- GitHub Pages is configured to deploy through GitHub Actions.
- Workflow run `33702333157` succeeded.
- The live site is verified at
  `https://nola4211.github.io/byu-is-career-compass/`.

## Guardrails

- Do not put LiveKit or avatar credentials in the GitHub Pages site.
- Keep the OpenAI Sites deployment untouched unless the owner separately asks
  to decommission it after the GitHub URL is verified.
- Do not change the eight stable `CareerId` values or career evidence policy.
