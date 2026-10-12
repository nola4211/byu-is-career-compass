import {
  AccessToken,
  RoomAgentDispatch,
  RoomConfiguration,
  TrackSource,
} from 'livekit-server-sdk';
import {
  LIVEKIT_AGENT_NAME,
  parseInterviewMetadata,
} from '../../../lib/interview-session';

const DEFAULT_LIVEKIT_URL = 'wss://is-core-case-2026-zat9gox0.livekit.cloud';
const DEFAULT_ALLOWED_ORIGIN = 'https://nola4211.github.io';
const MAX_REQUEST_BYTES = 8_192;

type Env = {
  LIVEKIT_API_KEY?: string;
  LIVEKIT_API_SECRET?: string;
  LIVEKIT_URL?: string;
  LIVEKIT_AGENT_NAME?: string;
  LIVEKIT_ALLOWED_ORIGIN?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

async function readBoundedBody(
  request: Request,
): Promise<{ ok: true; text: string } | { ok: false; status: 400 | 413 }> {
  if (!request.body) return { ok: false, status: 400 };
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_REQUEST_BYTES) {
        void reader.cancel().catch(() => undefined);
        return { ok: false, status: 413 };
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
    return text ? { ok: true, text } : { ok: false, status: 400 };
  } catch {
    void reader.cancel().catch(() => undefined);
    return { ok: false, status: 400 };
  } finally {
    reader.releaseLock();
  }
}

const normalizedOrigin = (value: string) => value.replace(/\/$/, '');

const corsHeaders = (
  origin: string | null,
  allowedOrigin: string,
): Record<string, string> => {
  if (!origin || normalizedOrigin(origin) !== allowedOrigin) return {};

  return {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
};

const jsonResponse = (
  body: object,
  status: number,
  origin: string | null,
  allowedOrigin: string,
) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...corsHeaders(origin, allowedOrigin),
    },
  });

async function handleRequest(request: Request, env: Env) {
  const origin = request.headers.get('origin');
  const allowedOrigin = normalizedOrigin(
    env.LIVEKIT_ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN,
  );

  if (!origin || normalizedOrigin(origin) !== allowedOrigin) {
    return jsonResponse(
      { error: 'Request origin is not allowed.' },
      403,
      origin,
      allowedOrigin,
    );
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin, allowedOrigin),
    });
  }

  if (request.method !== 'POST') {
    return jsonResponse(
      { error: 'Method not allowed.' },
      405,
      origin,
      allowedOrigin,
    );
  }

  if (
    request.headers
      .get('content-type')
      ?.split(';', 1)[0]
      .trim()
      .toLowerCase() !== 'application/json'
  ) {
    return jsonResponse(
      { error: 'Expected an application/json request.' },
      415,
      origin,
      allowedOrigin,
    );
  }

  const rawBody = await readBoundedBody(request);
  if (!rawBody.ok) {
    return jsonResponse(
      { error: 'Invalid token request.' },
      rawBody.status,
      origin,
      allowedOrigin,
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody.text);
  } catch {
    return jsonResponse({ error: 'Invalid JSON.' }, 400, origin, allowedOrigin);
  }

  if (
    !isRecord(body) ||
    !isRecord(body.room_config) ||
    !Array.isArray(body.room_config.agents)
  ) {
    return jsonResponse(
      { error: 'Invalid token request.' },
      400,
      origin,
      allowedOrigin,
    );
  }
  const firstAgent = body.room_config.agents[0];
  const metadata = parseInterviewMetadata(
    isRecord(firstAgent) ? firstAgent.metadata : undefined,
  );
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
  const accessToken = new AccessToken(
    env.LIVEKIT_API_KEY,
    env.LIVEKIT_API_SECRET,
    {
      identity: participantIdentity,
      name: metadata.student_name,
      metadata: metadataJson,
      ttl: '10m',
    },
  );

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
