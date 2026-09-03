# Live Interview and Avatar Plan

Status: **Voice integration implemented in the feature branch; external
configuration and end-to-end verification pending. Avatar remains proposed.**

Last reviewed: 2026-09-02

## Goal

Let a student speak with the deployed LiveKit interviewer for any supported
career while retaining written and voice-only fallbacks. Add a synchronized
talking avatar only after the voice path is reliable and its provider is
approved.

## Phase 1: Voice vertical slice

Implemented in `feat/livekit-interview`:

- LiveKit React/web and server SDK dependencies.
- Live/written practice selection on the existing interview route.
- Explicit microphone start, mute, end, connection/agent states, transcript,
  clear AI disclosure, error handling, and written fallback.
- Shared allow-list for all eight career IDs and behavioral/technical modes.
- External Cloudflare Worker that validates origin/input, derives job title,
  issues a ten-minute microphone-only token, and dispatches only
  `career-interviewer`.
- Configuration examples without secrets and a GitHub Actions variable for the
  public Worker endpoint.

Still required for completion:

- Deploy the Worker with real LiveKit API credentials.
- Add its URL to `VITE_LIVEKIT_TOKEN_ENDPOINT` in GitHub Actions.
- Confirm the LiveKit agent deployment is active.
- Test all eight careers, both modes, microphone denial, disconnect, normal end,
  and mobile behavior against the real service.
- Confirm and document provider recording, transcript, analytics, retention,
  deletion, session limit, and cost policies.

## Session contract

The browser may request only:

- `career_id`: one of the eight `CAREER_IDS`
- `mode`: `behavioral` or `technical`
- `student_name`: normalized display text
- `company_name`: normalized display text

The Worker derives `job_title`, room name, participant identity, token grants,
agent name, and token lifetime. It does not accept arbitrary prompt text or an
agent override from the browser.

## Phase 2: Coaching output

Before persisting any transcript or summary, approve a retention/deletion
policy. A later structured coaching result may include grounded strengths, one
or two improvement priorities, missed specifics, and another practice prompt.
It must not predict hiring outcomes or invent BYU facts. The existing written
heuristics remain labeled self-review.

## Phase 3: Virtual avatar

The frontend already renders the agent camera track when present and otherwise
shows a voice visualization. Actual avatar generation belongs in a code-based
LiveKit agent deployment or compatible avatar participant, not in the static
site or token Worker.

Before implementation, approve:

- provider and budget;
- AI-avatar disclosure;
- server-side API key ownership;
- join timeout and voice-only fallback;
- supported browsers and mobile performance targets;
- latency, failure-rate, and per-session cost thresholds.

The avatar phase is complete only when video/audio synchronization,
interruptions, session end, disclosure, timeout, and voice fallback pass real
browser tests.

## Safety checklist

- Media starts only after the student acts and can be ended immediately.
- No LiveKit or avatar-provider credential enters source or the client bundle.
- The Worker rejects invalid origins, careers, modes, and unexpected metadata.
- Tokens are short-lived and limited to the intended room actions.
- The UI makes no unverified privacy or retention promise.
- Agent prompts do not invent BYU claims and respect `CAREERS.md`.
- Written practice remains available when voice or avatar service fails.

## Official references

- [LiveKit frontend sessions](https://docs.livekit.io/frontends/build/sessions/)
- [LiveKit token endpoints](https://docs.livekit.io/frontends/build/authentication/endpoint/)
- [LiveKit authentication](https://docs.livekit.io/frontends/build/authentication/)
- [LiveKit virtual avatars](https://docs.livekit.io/frontends/build/virtual-avatars/)

