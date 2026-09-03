import { AccessToken, RoomAgentDispatch, RoomConfiguration, TrackSource } from 'livekit-server-sdk';
import { LIVEKIT_AGENT_NAME, parseInterviewMetadata } from '../../../lib/interview-session';

const DEFAULT_LIVEKIT_URL = 'wss://is-core-case-2026-zat9gox0.livekit.cloud';
const DEFAULT_ALLOWED_ORIGIN = 'https://nola4211.github.io';
const MAX_REQUEST_LENGTH = 8_192;

type Env = {
  LIVEKIT_API_KEY?: string;
  LIVEKIT_API_SECRET?: string;
  LIVEKIT_URL?: string;
  LIVEKIT_AGENT_NAME?: string;
  LIVEKIT_ALLOWED_ORIGIN?: string;
};

type TokenRequestBody = {
  room_config?: {
    agents?: Array<{
      metadata?: unknown;
    }>;
  };
};

const normalizedOrigin = (value: string) => value.replace(/\/$/, '');

const corsHeaders = (origin: string | null, allowedOrigin: string): Record<string, string> => {
  if (!origin || normalizedOrigin(origin) !== allowedOrigin) return {};

  return {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
};

const jsonResponse = (body: object, status: number, origin: string | null, allowedOrigin: string) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...corsHeaders(origin, allowedOrigin),
    },
  });

async function handleRequest(request: Request, env: Env) {
  const origin = request.headers.get('origin');
  const allowedOrigin = normalizedOrigin(env.LIVEKIT_ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN);

  if (!origin || normalizedOrigin(origin) !== allowedOrigin) {
    return jsonResponse({ error: 'Request origin is not allowed.' }, 403, origin, allowedOrigin);
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin, allowedOrigin) });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405, origin, allowedOrigin);
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return jsonResponse({ error: 'Expected an application/json request.' }, 415, origin, allowedOrigin);
  }

  const rawBody = await request.text();
  if (!rawBody || rawBody.length > MAX_REQUEST_LENGTH) {
    return jsonResponse({ error: 'Invalid token request.' }, 400, origin, allowedOrigin);
  }

  let body: TokenRequestBody;
  try {
    body = JSON.parse(rawBody) as TokenRequestBody;
  } catch {
    return jsonResponse({ error: 'Invalid JSON.' }, 400, origin, allowedOrigin);
  }

  const metadata = parseInterviewMetadata(body.room_config?.agents?.[0]?.metadata);
  if (!metadata) {
    return jsonResponse(
      { error: 'A supported career and interview mode are required.' },
      400,
      origin,
      allowedOrigin,
    );
  }

  if (!env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET) {
    return jsonResponse(
      { error: 'Live interview service is not configured.' },
      503,
      origin,
      allowedOrigin,
    );
  }

  const roomName = `career-practice-${crypto.randomUUID()}`;
  const participantIdentity = `student-${crypto.randomUUID()}`;
  const metadataJson = JSON.stringify(metadata);
  const accessToken = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
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
        agentName: env.LIVEKIT_AGENT_NAME || LIVEKIT_AGENT_NAME,
        metadata: metadataJson,
      }),
    ],
  });

  return jsonResponse(
    {
      server_url: env.LIVEKIT_URL || DEFAULT_LIVEKIT_URL,
      participant_token: await accessToken.toJwt(),
    },
    201,
    origin,
    allowedOrigin,
  );
}

const worker = { fetch: handleRequest };

export default worker;
