# BYU IS Career Compass

An interactive career-discovery and interview-practice site for BYU Information Systems students.

## Live site

[Open BYU IS Career Compass](https://nola4211.github.io/byu-is-career-compass/)

## Development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

`npm run build` creates a static export in `dist/client`. Pushes to `main` publish that export to GitHub Pages through `.github/workflows/deploy-pages.yml`.

## LiveKit status

The interview route opens in written practice. This branch pauses public live
voice entry to honor the portfolio's zero-spending policy. An endpoint or saved
credential alone cannot enable voice: the frontend and separately deployed
Cloudflare token Worker each require an exact `true` opt-in. The Pages workflow
and Worker deployment configuration explicitly set their flags to `false`.

These are proposed source changes, not confirmation that the existing public
Worker has been disabled. Its Cloudflare owner must deploy the paused Worker
or disable the existing endpoint. Cameron reports owning LiveKit; a partner
likely controls Cloudflare. No paid voice test is authorized by the portfolio
review. Existing rooms must be checked separately; a token pause does not end them.

For local development, copy `.dev.vars.example` to `.dev.vars`, add disposable
development credentials, and create an ignored `.env.local` containing:

```dotenv
VITE_LIVEKIT_TOKEN_ENDPOINT=http://localhost:8787
VITE_LIVE_INTERVIEWS_ENABLED=false
```

Then run these in separate terminals:

```bash
npm run livekit:dev
npm run dev
```

Keep both flags false for the showcase. Any future live testing requires an
owner-approved budget, privacy and admission controls, and explicit opt-in in
both environments. Production credentials belong only in the Worker environment.
See `docs/SECURITY_REVIEW.md` and `.env.example`.
