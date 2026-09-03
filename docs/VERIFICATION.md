# Verification Reference

Last updated: 2026-09-02

| Check | Exact command or action | Result |
| --- | --- | --- |
| Install | `npm ci` with Node.js 24.13.1 | Passed; 527 packages installed |
| Lint | `npm run lint` | Passed |
| Static export | `npm run build` | Passed; `/`, `/interview`, and `404` emitted |
| Artifact layout | Inspect `dist/client` | Passed; `_next`, `index.html`, `interview/index.html`, and `.nojekyll` present |
| Home interaction | Complete five-answer quiz in local Pages-path server | Passed; ranked result displayed |
| Direct interview link | Load `/byu-is-career-compass/interview/?career=cybersecurity` | Passed; Cybersecurity selected after hydration |
| Text self-review | Enter a response and choose Review | Passed; three feedback notes displayed |
| Repository-path assets | Serve artifact at `/byu-is-career-compass/` | Passed; CSS, scripts, and fonts loaded |
| Mobile layout | Browser viewport 390 × 844 | Passed; document width remained 390px |
| Secret/legacy URL scan | Search tracked source and built artifact | Passed; no secret-like value or `chatgpt.site` reference found |
| GitHub workflow | Observe `Deploy GitHub Pages` run `33702333157` | Passed after Pages was enabled and the failed deployment job was rerun |
| Production URL | Open home and Cybersecurity interview URLs | Passed; both returned HTTP 200 and the home page rendered in a browser |

## Notes

- `npm ci` reports 10 dependency audit findings: 4 moderate and 6 high. They are
  inherited dependency findings and were not auto-fixed because that can change
  package behavior outside this migration.
- Vinext currently needs the post-build artifact preparation script because its
  static exporter emits the clean interview route as `interview.html` and nests
  prefixed assets. The script creates the directory route GitHub Pages serves
  and moves assets to the artifact root without altering application code.
- LiveKit and avatar verification are unavailable because neither feature is
  implemented.
