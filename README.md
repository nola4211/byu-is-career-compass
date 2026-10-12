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

The interview page opens the existing live prejoin screen when
`VITE_LIVEKIT_TOKEN_ENDPOINT` is configured; otherwise it opens written practice.
Voice starts only after the student acknowledges the AI/provider disclosure and
selects Start. Written self-review remains available.

The security review preserves this behavior while bounding token requests and
updating vulnerable dependencies. Cameron reports that no service for this
project has a payment method or paid plan. A billing-related voice pause is not
required, and the proposed enable flags have been removed. Real microphone and
provider-retention acceptance are still unverified; see `docs/SECURITY_REVIEW.md`.

For local development, copy `.dev.vars.example` to the ignored `.dev.vars`, add
development credentials there, and create an ignored `.env.local` containing:

```dotenv
VITE_LIVEKIT_TOKEN_ENDPOINT=http://localhost:8787
```

Then run these in separate terminals:

```bash
npm run livekit:dev
npm run dev
```

Production credentials belong only in the Worker environment. A frontend merge
publishes through Pages; deployment of the request-validation fixes to the
separate Worker requires its Cloudflare owner. No shutdown deployment is needed.
