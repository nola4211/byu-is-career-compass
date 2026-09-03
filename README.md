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

The interview route supports live voice interviewing plus the existing written
fallback. Because GitHub Pages is static, token signing runs as a separate
Cloudflare Worker in `services/livekit-token-worker/`.

For local development, copy `.dev.vars.example` to `.dev.vars`, add disposable
development credentials, and create an ignored `.env.local` containing:

```dotenv
VITE_LIVEKIT_TOKEN_ENDPOINT=http://localhost:8787
```

Then run these in separate terminals:

```bash
npm run livekit:dev
npm run dev
```

The frontend reads the public Worker URL from
`VITE_LIVEKIT_TOKEN_ENDPOINT`. Production credentials belong only in the
Worker environment. See `docs/LIVE_INTERVIEW_PLAN.md` and `.env.example`.
