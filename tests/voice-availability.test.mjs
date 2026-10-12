import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));

// Render actual frontend source with harmless doubles: no token request,
// microphone or provider session is made by these regression tests.
function loadFrontend(env) {
  const modules = new Map();
  const calls = { endpoints: [], sessions: [], starts: 0 };
  const session = {
    start: async () => { calls.starts++; },
    end: async () => {},
    isConnected: false,
    room: { localParticipant: { setMicrophoneEnabled: async () => {} } },
  };
  function loadTs(filename) {
    if (modules.has(filename)) return modules.get(filename).exports;
    const compiledModule = { exports: {} };
    modules.set(filename, compiledModule);
    const source = readFileSync(filename, 'utf8').replaceAll('import.meta.env', '__BUILD_ENV__');
    const code = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    runInNewContext(code, {
      module: compiledModule,
      exports: compiledModule.exports,
      __BUILD_ENV__: env,
      require: (id) => {
        if (id === '@livekit/components-react') return {
          useSession: (tokenSource, options) => {
            calls.sessions.push({ tokenSource, options });
            return session;
          },
          SessionProvider: ({ children }) => children,
          useSessionContext: () => session,
          useAgent: () => ({ state: 'disconnected' }),
          useSessionMessages: () => ({ messages: [] }),
          useTrackVolume: () => 0,
          RoomAudioRenderer: () => null,
          VideoTrack: () => null,
        };
        if (id === 'livekit-client') return {
          TokenSource: { endpoint: (url) => {
            calls.endpoints.push(url);
            return { url };
          } },
        };
        if (id.startsWith('@/components/ui/')) {
          const name = id.split('/').at(-1);
          const exportName = name[0].toUpperCase() + name.slice(1);
          if (name === 'checkbox') return {
            Checkbox: ({ onCheckedChange: _onCheckedChange, ...props }) => React.createElement('input', { ...props, type: 'checkbox', readOnly: true }),
          };
          const tag = { button: 'button', input: 'input', textarea: 'textarea', progress: 'progress' }[name] || 'div';
          return { [exportName]: ({ children, size: _size, variant: _variant, ...props }) => React.createElement(tag, props, children) };
        }
        if (id.startsWith('@/') || id.startsWith('.')) {
          const path = id.startsWith('@/') ? resolve(root, id.slice(2)) : resolve(dirname(filename), id);
          const extension = id.includes('live-interview') && id.includes('components/') ? '.tsx' : '.ts';
          return loadTs(path + extension);
        }
        return require(id);
      },
    }, { filename });
    return compiledModule.exports;
  }
  return { loadTs, calls };
}

test('configured voice opens the existing prejoin screen without starting a session', () => {
  const frontend = loadFrontend({ PROD: true, VITE_LIVEKIT_TOKEN_ENDPOINT: ' https://disposable.example/token ' });
  const Page = frontend.loadTs(resolve(root, 'app/interview/page.tsx')).default;
  const html = renderToStaticMarkup(React.createElement(Page));
  assert.match(html, /Start your interview/);
  assert.match(html, /Audio and transcripts are processed by the configured providers/);
  assert.match(html, /<button[^>]*class="start-interview-button"[^>]*disabled=""/);
  assert.match(html, /id="live-interview-consent"/);
  assert.doesNotMatch(html, /Draft your answer|Live conversation is paused/);
  assert.deepEqual(frontend.calls.endpoints, ['https://disposable.example/token']);
  assert.equal(frontend.calls.sessions.length, 1);
  assert.equal(frontend.calls.starts, 0);
});

test('missing or blank endpoint keeps written practice usable without a session', () => {
  for (const endpoint of [undefined, '', '   ']) {
    const frontend = loadFrontend({ VITE_LIVEKIT_TOKEN_ENDPOINT: endpoint });
    const Page = frontend.loadTs(resolve(root, 'app/interview/page.tsx')).default;
    assert.match(renderToStaticMarkup(React.createElement(Page)), /Draft your answer/);
    const { LiveInterview } = frontend.loadTs(resolve(root, 'components/interview/live-interview.tsx'));
    const html = renderToStaticMarkup(React.createElement(LiveInterview, {
      careerId: 'dataAnalytics', mode: 'behavioral', onUseWrittenPractice() {},
    }));
    assert.match(html, /The interviewer is almost connected/);
    assert.match(html, /Use written practice/);
    assert.equal(frontend.calls.endpoints.length, 0);
    assert.equal(frontend.calls.sessions.length, 0);
    assert.equal(frontend.calls.starts, 0);
  }
});

test('direct voice component preserves career metadata and fixed dispatch before consent', () => {
  const frontend = loadFrontend({ VITE_LIVEKIT_TOKEN_ENDPOINT: 'https://disposable.example/token' });
  const { LiveInterview } = frontend.loadTs(resolve(root, 'components/interview/live-interview.tsx'));
  const html = renderToStaticMarkup(React.createElement(LiveInterview, {
    careerId: 'cybersecurity', mode: 'technical', onUseWrittenPractice() {},
  }));
  assert.match(html, /Cybersecurity/);
  assert.match(html, /class="start-interview-button"[^>]*disabled=""/);
  const { options } = frontend.calls.sessions[0];
  const metadata = JSON.parse(options.agentMetadata);
  assert.equal(metadata.career_id, 'cybersecurity');
  assert.equal(metadata.mode, 'technical');
  assert.equal(options.agentName, 'career-interviewer');
  assert.equal(frontend.calls.starts, 0);
});
