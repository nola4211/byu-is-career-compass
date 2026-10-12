# Voice service and dependency review

Reviewed 2026-10-12. Prepared for shared review; no provider credentials,
settings or session records were accessed.

## Implemented on this branch

The Worker reads at most 8,192 bytes, stops/cancels oversized streams, decodes
split UTF-8 safely and rejects invalid JSON shapes/media types. Previously
JSON null could throw and the limit used characters after reading all input.
The existing career allow-list, derived metadata, random room/identity, fixed
agent dispatch and scoped tokens remain. Main's voice UI is preserved apart
from a clearer unavailable-service message.

The corrected source passes 13 focused tests: ten actual-Worker tests with
disposable signing keys and three actual-frontend rendering tests with harmless
session doubles. Configured voice renders the existing prejoin screen without
starting a session; missing endpoints retain written practice. All eight career
IDs and both modes receive scoped ten-minute microphone-only tokens without a
new opt-in flag. Local lint, TypeScript, the full configured-endpoint static
build/Pages preparation and Worker dry-run pass on Node 24.16.0. The dry-run is
149.88 KiB / 30.87 KiB gzip with metrics disabled; nothing is deployed.

The refreshed October 12 audit has six high propagated entries through the
unpatched braces build chain and zero critical/moderate/low. No general security
clearance is claimed. Current GitHub CI must be observed after publication.

## Billing clarification and remaining acceptance

**Reported:** Cameron has not purchased services or supplied payment details
for this project. The proposed billing-related pause and extra enable flags are
removed. No shutdown, card verification or paid plan is required by this review.

Provider retention/deletion and actual voice behavior remain unverified. Use a
consented fictional session to verify agent join, metadata, speech, transcript,
mute/end and device-denial/disconnect behavior before claiming live acceptance.
The Worker has no authentication or rate limit; an Origin header does not prove
identity. Token expiry is an admission limit, not an ongoing-session cutoff.
These are documented public-service limitations, not a billing shutdown gate.

## Dependency findings before the tooling update

Initial locked graph: 28 affected packages, including three critical entries. Targeted changes reduce it to 22 affected packages: zero critical, 16 high, five moderate, one low. This count includes propagated dependency effects and is not 22 independent exploitable application defects.

| Change | Reason and verification |
| --- | --- |
| React/React DOM/RSC 19.2.8 | Keep the family aligned while addressing the [RSC server-function advisory](https://github.com/advisories/GHSA-wx67-qw84-cm4g). Static build passed; the Pages artifact has no RSC server. |
| Vite 8.0.16 | Patch the current 8.0 line for [Windows file-deny bypass](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) and [editor UNC-path handling](https://github.com/advisories/GHSA-v6wh-96g9-6wx3). Build passed. |
| oxfmt's tinypool override 2.1.2 | Address [worker-option prototype pollution](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3) and [run-option pollution](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) without a formatter migration. Selected-file formatting passed through the consuming CLI. |
| proxy-addr 2.0.8 | Address [mapped-IPv6 trust handling](https://github.com/advisories/GHSA-jqcg-44mw-7w3h). Locked build graph passed. |
| source-map-js 1.2.2 | Address [indexed-map processing](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). Static build passed. |

That earlier 22-entry snapshot is superseded by the October 10 tooling review below. The remaining six entries now trace only to the unpatched braces build chain; no forced downgrade was applied. The static hosted frontend runs no development server, formatter, or image optimizer. The independently deployed Worker and developer tools have different exposure boundaries; deployed Worker behavior/settings were not refreshed in this review. A full source-history credential scan, penetration test, dependency clearance, or provider-side security certification is not claimed.

## Build tooling update (2026-10-10)

The review branch upgrades Vinext to 1.1.0, its required RSC companion to 0.5.36, and Wrangler to 4.149.0. It removes the unused shadcn generator executable and its transitive toolchain while retaining the exact original stylesheet and MIT notice in `vendor/shadcn/`. `@shadcn/react`, which is actually imported by a component, remains installed. The Satori-only override selects the official same-series `fflate@0.7.5` patch instead of its exact vulnerable 0.7.3 pin. No forced framework downgrade or disabled peer checks are used.

The refreshed complete npm audit is six high entries, zero critical/moderate/low. All six trace to the [unpatched braces pattern-walker issue](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) through Vinext's CommonJS/dynamic-import/glob build chain. This is six propagated package entries, not six independent application bugs. The static Pages artifact does not execute that build chain or accept visitor-supplied build patterns. Build only trusted source/inputs and keep development tooling private. This is a bounded exposure assessment, not dependency clearance; track an upstream fix. The [fflate patch advisory](https://github.com/advisories/GHSA-px8p-9vwx-vf98) lists 0.7.5 as patched.

The October 10 paused draft passed checks at its historical revision. Those
results do not validate the corrected source; current checks are listed above
and in VERIFICATION.md.

## Rollout boundary

Use shared review and PR checks before merging. A merge publishes the static
frontend through the existing workflow. The Cloudflare owner separately
deploys the request-validation fixes to the Worker. No paused configuration or
token-denial rollout is required. Keep provider secrets out of source/artifacts.
