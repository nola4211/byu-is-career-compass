# Voice service and dependency review

Reviewed 2026-10-09. Changes are prepared for shared review; no production setting, credential, account, recording, or session record was accessed.

## Implemented on this branch

The Worker reads a maximum of 8,192 bytes, stops/cancels oversized streams, decodes split UTF-8 safely, and rejects invalid JSON shapes or media types. Previously a JSON `null` body could throw before a response, and the limit was applied to characters after reading the entire body. Eleven tests exercise actual source and real SDK token signing with disposable keys, including all eight careers and both modes. These are local request/grant checks, not a Cloudflare or live-agent acceptance test.

`LIVEKIT_INTERVIEWS_ENABLED=false` pauses issuance of new tokens before credentials are used. Leave unset to preserve existing behavior. After an approved Worker rollout, the service owner can use this server-only variable as an operational pause. It does not terminate active rooms or impose a spending cap. The frontend presents an unavailable-service message and retains written practice.

## Controls still required before recommending an unrestricted voice demo

- Verify service ownership, recording/transcript retention, deletion, and the exact providers receiving audio and metadata. Existing disclosure remains; do not promise no retention.
- Add an authenticated or otherwise verified admission boundary, throttling, and per-user/concurrent/global session quotas. A matching Origin header is a browser policy signal, not proof of a permitted student.
- Enforce session duration and termination on the service side, and test the resulting billing stop. [LiveKit token expiry governs entry rather than an ongoing session cutoff](https://docs.livekit.io/frontends/reference/tokens-grants/).
- Use authoritative quota/budget accounting when a hard limit is required. [Cloudflare's rate-limiting binding is local to each location and eventually consistent](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/); it should not be represented as an exact global spending cap.
- Perform a consented disposable microphone session covering agent join, metadata, speech, transcription, mute/end, denied permission, disconnect, and provider-side termination before claiming live acceptance.

## Dependency findings

Initial locked graph: 28 affected packages, including three critical entries. Targeted changes reduce it to 22 affected packages: zero critical, 16 high, five moderate, one low. This count includes propagated dependency effects and is not 22 independent exploitable application defects.

| Change | Reason and verification |
| --- | --- |
| React/React DOM/RSC 19.2.8 | Keep the family aligned while addressing the [RSC server-function advisory](https://github.com/advisories/GHSA-wx67-qw84-cm4g). Static build passed; the Pages artifact has no RSC server. |
| Vite 8.0.16 | Patch the current 8.0 line for [Windows file-deny bypass](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) and [editor UNC-path handling](https://github.com/advisories/GHSA-v6wh-96g9-6wx3). Build passed. |
| oxfmt's tinypool override 2.1.2 | Address [worker-option prototype pollution](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3) and [run-option pollution](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) without a formatter migration. Selected-file formatting passed through the consuming CLI. |
| proxy-addr 2.0.8 | Address [mapped-IPv6 trust handling](https://github.com/advisories/GHSA-jqcg-44mw-7w3h). Locked build graph passed. |
| source-map-js 1.2.2 | Address [indexed-map processing](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). Static build passed. |

Remaining findings include Wrangler/Miniflare transport and image tooling, Vinext/image-size/plugin tooling, and shadcn/MCP/parser/glob dependencies. Review compatible transitive fixes and Wrangler/Vinext upgrades separately; no forced downgrade or broad framework migration was applied. The static hosted frontend runs no development server, formatter, or image optimizer. The independently deployed Worker and developer tools have different exposure boundaries; deployed Worker behavior/settings were not refreshed in this review. A full source-history credential scan, penetration test, dependency clearance, or provider-side security certification is not claimed.

## Rollout boundary

Review and merge through the shared repository's process after PR checks. A merge publishes the static frontend through the existing main-branch workflow; Worker deployment remains a separate owner-approved action. Confirm the variable/default policy before deploying the Worker, test the pause with disposable requests, then apply admission/retention/cost gates before broader promotion. Keep credentials out of source and CI artifacts.
