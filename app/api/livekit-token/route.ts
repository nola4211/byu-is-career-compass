import { AccessToken, RoomAgentDispatch, RoomConfiguration, TrackSource } from 'livekit-server-sdk';
import { LIVEKIT_AGENT_NAME, parseInterviewMetadata } from '@/lib/interview-session';

const DEFAULT_LIVEKIT_URL = 'wss://is-core-case-2026-zat9gox0.livekit.cloud';
const MAX_REQUEST_LENGTH = 8_192;

type TokenRequestBody = {
  room_config?: {
    agents?: Array<{
      metadata?: unknown;
    }>;
  };
};

const jsonResponse = (body: object, status: number) =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });

const allowedOriginFor = (request: Request) =>
  (process.env.LIVEKIT_ALLOWED_ORIGIN || new URL(request.url).origin).replace(/\/$/, '');

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigin = allowedOriginFor(request);

  if ((process.env.NODE_ENV === 'production' && !origin) || (origin && origin.replace(/\/$/, '') !== allowedOrigin)) {
    return jsonResponse({ error: 'Request origin is not allowed.' }, 403);
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return jsonResponse({ error: 'Expected an application/json request.' }, 415);
  }

  const rawBody = await request.text();
  if (!rawBody || rawBody.length > MAX_REQUEST_LENGTH) {
    return jsonResponse({ error: 'Invalid token request.' }, 400);
  }

  let body: TokenRequestBody;
  try {
    body = JSON.parse(rawBody) as TokenRequestBody;
  } catch {
    return jsonResponse({ error: 'Invalid JSON.' }, 400);
  }

  const metadata = parseInterviewMetadata(body.room_config?.agents?.[0]?.metadata);
  if (!metadata) {
    return jsonResponse({ error: 'A supported career and interview mode are required.' }, 400);
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_URL || DEFAULT_LIVEKIT_URL;
  const agentName = process.env.LIVEKIT_AGENT_NAME || LIVEKIT_AGENT_NAME;

  if (!apiKey || !apiSecret) {
    return jsonResponse({ error: 'Live interview service is not configured.' }, 503);
  }

  const roomName = `career-practice-${crypto.randomUUID()}`;
  const participantIdentity = `student-${crypto.randomUUID()}`;
  const metadataJson = JSON.stringify(metadata);
  const accessToken = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: metadata.student_name,
    metadata: metadataJson,
    ttl: '10m',
  });

  accessToken.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canPublishData: true,
    canPublishSources: [TrackSource.MICROPHONE],
    canSubscribe: true,
  });

  accessToken.roomConfig = new RoomConfiguration({
    agents: [
      new RoomAgentDispatch({
        agentName,
        metadata: metadataJson,
      }),
    ],
  });

  const participantToken = await accessToken.toJwt();
  return jsonResponse(
    {
      server_url: serverUrl,
      participant_token: participantToken,
    },
    201,
  );
}
