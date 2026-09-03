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

Live voice interviewing is planned but not implemented. GitHub Pages is static, so a future LiveKit integration must use a separately hosted HTTPS token endpoint; LiveKit API credentials must never be included in this repository or the browser bundle.
