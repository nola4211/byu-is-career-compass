# Current Project Status

Snapshot: 2026-09-02

## State

**The career-discovery and text interview experience is prepared for GitHub
Pages. Live voice and avatar interviewing remain planned but unimplemented.**

## Completed

- Merged the coordination and LiveKit planning documents into the focused
  `deploy/github-pages` migration branch based on current `main`.
- Replaced OpenAI Sites and Cloudflare runtime configuration with a Vinext
  static export for `https://nola4211.github.io/byu-is-career-compass/`.
- Added an automatic GitHub Pages workflow for pushes to `main`.
- Added repository-path-safe navigation and a Pages artifact preparation step.
- Documented that future LiveKit tokens require a separately hosted secure
  HTTPS endpoint.

## Verified locally

- `npm ci`, `npm run lint`, and `npm run build` pass.
- The build emits static home and interview routes plus `.nojekyll`.
- Browser checks passed for quiz completion, direct career query selection,
  interview feedback, asset loading, and a 390px-wide layout.
- No committed secret or `chatgpt.site` reference was found.

## Publication status

- Migration branch, pull request, merge, Pages configuration, workflow run, and
  public URL verification are pending publication from this workspace.
- The existing OpenAI Sites deployment remains available as rollback and is not
  modified by this change.

## Next action

Publish the migration branch, merge it to `main`, enable GitHub Actions as the
Pages source, and verify the live GitHub Pages URL.
