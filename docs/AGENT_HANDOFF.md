# Agent Handoff

Updated: 2026-09-02

## Objective

Complete the LiveKit voice interview on the GitHub Pages site without exposing
secrets, while retaining written practice and preparing the UI for an avatar.

## Current production result

- PR #3 was squash-merged to `main` as `d702da4`.
- PR #2 was squash-merged to `main` as `e753a13`.
- PR #5 was squash-merged to `main` as `90cb244`.
- GitHub Pages deploys through GitHub Actions.
- LiveKit-enabled workflow run `33713674323` succeeded.
- Lifecycle-fix workflow run `33715049992` succeeded.
- The current site and configured interview bundle are verified at
  `https://nola4211.github.io/byu-is-career-compass/`.

## Completed and deployed

- Merged the current GitHub Pages/static-export architecture.
- Integrated LiveKit session UI and written fallback into `/interview`.
- Added shared career/mode metadata validation.
- Added a separately deployable Cloudflare token Worker.
- Added Worker examples/scripts and Pages endpoint-variable wiring.
- Added an avatar video-track slot with a voice visualization fallback.
- Passed the local checks recorded in `docs/VERIFICATION.md`.
- Deployed and production-smoke-tested the credentialed Worker at
  `https://byu-is-career-compass-livekit-token.nola4211-career-compass.workers.dev`.
- Configured the interview prompt, greeting, and five metadata variables in the
  matching Agent Builder.
- Deployed `career-interviewer` version `RzHQfERQN9jP`; agent
  `CA_RfBuCqhsQZYt` is registered with the expected explicit dispatch name and
  reports `running` in production.

## Current validation gap

- The first Chrome test fetched a token and began LiveKit signaling, but the
  room disconnected before establishment and no LiveKit session was recorded.
- Browser logs and `useSession` behavior showed the cleanup effect ran whenever
  the changing session object re-rendered.
- The stable-`session.end` fix is merged through PR #5 and the Pages deployment
  succeeded. Reloading production no longer repeats the immediate cleanup
  error.
- A real microphone conversation has not yet confirmed agent join, dynamic
  metadata delivery, speech, transcript, and normal session end.

## Next owner-access steps

1. Test a live session on desktop and inspect the corresponding LiveKit record.
2. Verify dynamic student, company, role, career, and mode metadata.
3. Test the accepted flow on mobile plus microphone denial and disconnect.

## Guardrails

- Never put provider secrets in GitHub Pages variables, source, logs, or pull
  request text.
- Do not claim recordings or transcripts are private or unretained until the
  provider configuration proves it.
- Keep the eight `CareerId` values and `CAREERS.md` evidence policy stable.
- Do not select or purchase an avatar provider without owner approval.
