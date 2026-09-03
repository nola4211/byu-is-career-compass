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

- Pull request #3 was squash-merged to `main` as commit `d702da4`.
- GitHub Pages uses GitHub Actions, workflow run `33702333157` succeeded, and
  `https://nola4211.github.io/byu-is-career-compass/` returned HTTP 200 and was
  verified in a browser.
- The existing OpenAI Sites deployment remains available as rollback and is not
  modified by this change.

## Next action

Treat GitHub Pages as the primary frontend. Select a separate secure backend
before implementing the planned LiveKit token endpoint.
