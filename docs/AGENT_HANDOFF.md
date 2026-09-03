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

## Remaining publication steps

1. Push `deploy/github-pages`.
2. Open and merge its pull request into `main`.
3. Configure GitHub Pages to use GitHub Actions.
4. Wait for the workflow and verify the public URL.

## Guardrails

- Do not put LiveKit or avatar credentials in the GitHub Pages site.
- Keep the OpenAI Sites deployment untouched unless the owner separately asks
  to decommission it after the GitHub URL is verified.
- Do not change the eight stable `CareerId` values or career evidence policy.
