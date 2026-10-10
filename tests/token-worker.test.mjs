import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import ts from 'typescript';

// Exercise the actual TypeScript Worker and real token SDK with disposable keys.
// No Cloudflare, LiveKit, microphone, or production configuration is contacted.
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));
const modules = new Map();
function loadTs(filename) {
  if (modules.has(filename)) return modules.get(filename).exports;
  const compiledModule = { exports: {} };
  modules.set(filename, compiledModule);
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  runInNewContext(
    code,
    {
      module: compiledModule,
      exports: compiledModule.exports,
      require: (id) =>
        id.startsWith('.')
          ? loadTs(resolve(dirname(filename), `${id}.ts`))
          : require(id),
      Request,
      Response,
      TextDecoder,
      TextEncoder,
      ReadableStream,
      crypto: webcrypto,
    },
    { filename },
  );
  return compiledModule.exports;
}
const worker = loadTs(
  resolve(root, 'services/livekit-token-worker/src/index.ts'),
).default;
const { CAREER_IDS } = loadTs(resolve(root, 'data/careers.ts'));
const origin = 'https://nola4211.github.io';
const fakeEnv = {
  LIVEKIT_API_KEY: 'disposable-test-key',
  LIVEKIT_API_SECRET: 'disposable-local-test-secret',
};
const metadata = {
  career_id: 'dataAnalytics',
  mode: 'behavioral',
  student_name: 'Demo Student',
  company_name: 'Example Company',
};
const body = (value = metadata) => ({
  room_config: { agents: [{ metadata: value }] },
});
const request = (value = body(), contentType = 'application/json') =>
  new Request('https://example.test/token', {
    method: 'POST',
    headers: { origin, 'content-type': contentType },
    body: JSON.stringify(value),
  });
const claims = async (response) => {
  assert.equal(response.status, 201);
  return JSON.parse(
    Buffer.from(
      (await response.json()).participant_token.split('.')[1],
      'base64url',
    ).toString(),
  );
};

test('malformed JSON structures return 400 without throwing', async () => {
  for (const value of [
    null,
    [],
    true,
    42,
    'string',
    {},
    { room_config: null },
    { room_config: { agents: {} } },
    { room_config: { agents: [null] } },
  ]) {
    assert.equal((await worker.fetch(request(value), fakeEnv)).status, 400);
  }
});

test('invalid JSON, invalid UTF-8, and a failed body stream return 400', async () => {
  for (const invalid of ['{', new Uint8Array([255])]) {
    const req = new Request('https://example.test/token', {
      method: 'POST',
      headers: { origin, 'content-type': 'application/json' },
      body: invalid,
    });
    assert.equal((await worker.fetch(req, fakeEnv)).status, 400);
  }
  const stream = new ReadableStream({
    start(controller) {
      controller.error(new Error('disposable stream failure'));
    },
  });
  const req = new Request('https://example.test/token', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: stream,
    duplex: 'half',
  });
  assert.equal((await worker.fetch(req, fakeEnv)).status, 400);
});

test('body size is limited in bytes for multibyte input', async () => {
  assert.equal(
    (
      await worker.fetch(
        request(body({ ...metadata, student_name: '😀'.repeat(2500) })),
        fakeEnv,
      )
    ).status,
    413,
  );
});

test('an oversized streamed body is cancelled without trusting content-length', async () => {
  let reads = 0;
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) {
      reads++;
      controller.enqueue(new Uint8Array(4096).fill(32));
    },
    cancel() {
      cancelled = true;
    },
  });
  const req = new Request('https://example.test/token', {
    method: 'POST',
    headers: {
      origin,
      'content-type': 'application/json',
      'content-length': '1',
    },
    body: stream,
    duplex: 'half',
  });
  assert.equal((await worker.fetch(req, fakeEnv)).status, 413);
  assert.equal(cancelled, true);
  assert.ok(reads <= 4);
});

test('valid JSON at the exact byte limit still receives a scoped token', async () => {
  const json = JSON.stringify(body());
  const raw = json + ' '.repeat(8192 - Buffer.byteLength(json));
  const req = new Request('https://example.test/token', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: raw,
  });
  await claims(await worker.fetch(req, fakeEnv));
});

test('streamed UTF-8 split across chunks preserves display metadata', async () => {
  const bytes = new TextEncoder().encode(
    JSON.stringify(body({ ...metadata, student_name: 'Demo 雲 😀' })),
  );
  let offset = 0;
  const stream = new ReadableStream({
    pull(controller) {
      if (offset >= bytes.length) return controller.close();
      controller.enqueue(bytes.slice(offset, offset + 3));
      offset += 3;
    },
  });
  const req = new Request('https://example.test/token', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: stream,
    duplex: 'half',
  });
  const token = await claims(await worker.fetch(req, fakeEnv));
  assert.equal(JSON.parse(token.metadata).student_name, 'Demo 雲 😀');
});

test('content type uses the actual JSON media type', async () => {
  for (const type of [
    'application/jsonp',
    'text/application/json',
    'text/plain',
  ]) {
    assert.equal(
      (await worker.fetch(request(body(), type), fakeEnv)).status,
      415,
    );
  }
  await claims(
    await worker.fetch(
      request(body(), 'Application/JSON; charset=utf-8'),
      fakeEnv,
    ),
  );
});

test('origin and method checks preserve preflight behavior', async () => {
  const foreign = new Request('https://example.test/token', {
    method: 'POST',
    headers: { origin: 'https://foreign.example' },
  });
  const rejected = await worker.fetch(foreign, fakeEnv);
  assert.equal(rejected.status, 403);
  assert.equal(rejected.headers.get('access-control-allow-origin'), null);
  const preflight = new Request('https://example.test/token', {
    method: 'OPTIONS',
    headers: { origin },
  });
  assert.equal((await worker.fetch(preflight, fakeEnv)).status, 204);
  const get = new Request('https://example.test/token', {
    headers: { origin },
  });
  assert.equal((await worker.fetch(get, fakeEnv)).status, 405);
});

test('operator pause rejects new tokens without returning credentials', async () => {
  const response = await worker.fetch(request(), {
    ...fakeEnv,
    LIVEKIT_INTERVIEWS_ENABLED: 'false',
  });
  assert.equal(response.status, 503);
  const text = await response.text();
  assert.ok(
    !text.includes(fakeEnv.LIVEKIT_API_KEY) &&
      !text.includes(fakeEnv.LIVEKIT_API_SECRET),
  );
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('access-control-allow-origin'), origin);
});

test('missing credentials and unsupported metadata fail before token issuance', async () => {
  assert.equal((await worker.fetch(request(), {})).status, 503);
  assert.equal(
    (
      await worker.fetch(
        request(body({ ...metadata, career_id: 'unknown' })),
        fakeEnv,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await worker.fetch(
        request(body({ ...metadata, mode: 'unknown' })),
        fakeEnv,
      )
    ).status,
    400,
  );
});

test('all eight careers and both modes retain ten-minute microphone-only grants', async () => {
  assert.equal(CAREER_IDS.length, 8);
  for (const career of CAREER_IDS)
    for (const mode of ['behavioral', 'technical']) {
      const token = await claims(
        await worker.fetch(
          request(
            body({
              ...metadata,
              career_id: career,
              mode,
              job_title: 'untrusted title',
            }),
          ),
          fakeEnv,
        ),
      );
      assert.equal(token.exp - token.nbf, 600);
      assert.equal(token.video.roomJoin, true);
      assert.deepEqual(token.video.canPublishSources, ['microphone']);
      assert.match(token.video.room, /^career-practice-/);
      const clean = JSON.parse(token.metadata);
      assert.equal(clean.career_id, career);
      assert.equal(clean.mode, mode);
      assert.notEqual(clean.job_title, 'untrusted title');
      assert.equal(token.roomConfig.agents[0].agentName, 'career-interviewer');
    }
});
