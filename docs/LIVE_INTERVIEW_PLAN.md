# Live Interview and Avatar Plan

Status: **Proposed; not implemented**

Last reviewed: 2026-09-02

## Goal

Turn `/interview?career=<CareerId>` into a live mock interview where a student
can speak with the deployed LiveKit interviewer, see the agent's state and a
transcript or coaching summary when approved, and optionally see a synchronized
talking avatar. Keep the existing text exercise or a voice-only mode available
when media permissions or the avatar provider fail.

## Current starting point

- The route is a client component with no backend.
- Career selection and interview topics already come from `data/careers.ts`.
- The current response and feedback are local text state only.
- The repository has no LiveKit packages, token route, microphone code, or
  avatar-provider package.
- The user reports that a LiveKit Agent Builder agent has been configured.

## Recommended sequence

### Phase 0: Confirm product and provider inputs

Record without committing secrets:

- LiveKit project WebSocket URL and deployed agent name;
- whether the production agent remains in Agent Builder for the voice pilot;
- participant authentication policy;
- allowed session metadata fields;
- whether transcripts, recordings, and analytics are disabled, transient, or
  retained, plus consent and deletion rules;
- supported browsers/devices and session duration/cost limits.

Use stable IDs such as `dataAnalytics`, not career display text, in metadata.
Allow-list every client-controlled value on the server.

### Phase 1: Voice-only vertical slice

1. Add the current LiveKit web client and React component dependencies.
2. Add a server-only standardized token endpoint. It must validate caller
   access and metadata, attach the selected agent dispatch configuration, return
   only short-lived connection details, and read credentials from server
   environment variables.
3. Refactor `app/interview/page.tsx` so the existing career selection surrounds
   a live-session component rather than being coupled to the current textarea.
4. Add explicit Start interview and End interview actions. Request microphone
   access only after the student's action.
5. Render connecting, listening, thinking, speaking, muted, reconnecting, ended,
   and error states. Provide retry and text-practice fallback paths.
6. Send only validated session metadata, initially:

   - `career_id`: one of `CAREER_IDS`
   - `mode`: `behavioral` or `technical`
   - `difficulty`: a small server allow-list if the product owner wants it
   - a non-sensitive display name only if required

7. Update the agent instructions to run an interview rather than a general
   coaching chat: one question at a time, short follow-ups, no invented BYU
   facts, calibrated feedback, and an explicit close.

Phase 1 is complete only when all eight career routes dispatch the intended
agent and microphone denial, disconnect, timeout, and normal end are usable.

### Phase 2: Transcript and coaching output

Decide whether the live transcript is ephemeral or retained before displaying
or storing it. If a summary is needed, define a structured schema such as:

- strengths grounded in the student's answer;
- one or two improvement priorities;
- missed specifics or tradeoffs;
- a suggested practice prompt;
- no hiring prediction or fabricated career fact.

Do not reuse the current word-count heuristics as if they were AI evaluation.
Keep the existing local review labeled as self-review if it remains available.

### Phase 3: Virtual avatar

Agent Builder does not currently support virtual avatars. Download/convert the
agent to a LiveKit Agents SDK project, or maintain a separate code-based agent
deployment, before adding an avatar plugin.

For a pilot, Anam is a reasonable candidate because LiveKit provides Python and
Node.js plugins and its avatar worker publishes synchronized audio and video to
the same LiveKit room. This is a proposal, not a vendor commitment.

Implementation responsibilities:

1. Store the avatar provider key only in the agent deployment environment.
2. Create and start the provider's avatar session before the agent begins its
   spoken greeting, with a bounded join timeout.
3. Render the avatar's standard video track in the interview page. LiveKit's
   React voice-assistant state can identify the appropriate audio/video tracks.
4. Show a clear AI-generated-avatar disclosure and preserve a visible voice-only
   fallback if the avatar is late or unavailable.
5. Measure avatar join and playback latency, mobile performance, cost per
   session, and failure rate before expanding the pilot.

Phase 3 is complete only when the avatar, audio, interruption behavior, session
end, disclosure, and fallback all work in supported browsers.

## Proposed file boundaries

Exact names may change after the runtime check, but responsibilities should stay
separate:

| Area | Proposed responsibility |
| --- | --- |
| `app/api/token/route.ts` | Authenticated, server-only LiveKit token response and agent dispatch |
| `app/interview/page.tsx` | Query parsing and page composition |
| `components/interview/live-interview.tsx` | Session lifecycle and top-level state UI |
| `components/interview/interview-stage.tsx` | Agent/avatar media, transcript, and controls |
| `lib/interview-session.ts` | Career/mode allow-lists and metadata construction |
| Separate agent project or directory | Agent prompt, session logic, evaluation, and avatar plugin |

Do not place a Python agent inside the web deployment without first deciding how
it will be built, tested, deployed, and owned. A separate agent repository is
acceptable if both repositories link to the same interface contract and owner.

## Required environment boundary

Names should follow the current LiveKit SDK and hosting conventions selected
during implementation. At minimum, the server/agent environments will need:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- provider-specific model keys only if LiveKit Inference is not used
- an avatar-provider key and avatar/persona ID for the avatar phase

Only a connection URL explicitly intended for public use may reach client code.
API keys and secrets must never use a public-client environment prefix.

## Acceptance and safety checklist

- Student starts media explicitly and can end it immediately.
- The UI accurately states whether audio, transcript, or recording is retained.
- Server rejects invalid careers, modes, agent overrides, room names, and
  unexpected metadata.
- Tokens are short-lived and scoped to the intended room/participant actions.
- No provider secret appears in the client bundle or browser network response.
- Agent does not invent BYU claims and treats `CAREERS.md` as the content limit.
- Interruptions, silence, reconnect, timeout, and provider failure are handled.
- Keyboard, screen-reader labels, reduced motion, and narrow layouts are checked.
- Voice remains usable when avatar video cannot start.
- Session cost and latency are measured before broad release.

## Current official references

- [LiveKit frontend session management](https://docs.livekit.io/frontends/build/sessions/)
- [LiveKit endpoint token generation](https://docs.livekit.io/frontends/build/authentication/endpoint/)
- [LiveKit virtual avatars](https://docs.livekit.io/frontends/build/virtual-avatars/)
- [LiveKit Agent Builder limitations and code conversion](https://docs.livekit.io/agents/start/builder/)
- [LiveKit Anam avatar integration](https://docs.livekit.io/agents/models/avatar/plugins/anam/)

Verify exact package versions and API signatures against the current official
documentation when implementation begins.

