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

function loadFrontend(env) {
  const modules = new Map();
  let providerCalls = 0;
  const denyProvider = () => {
    providerCalls++;
    throw new Error('Unexpected live provider use in a paused demo');
  };
  function loadTs(filename) {
    if (modules.has(filename)) return modules.get(filename).exports;
    const compiledModule = { exports: {} };
    modules.set(filename, compiledModule);
    const source = readFileSync(filename, 'utf8').replaceAll(
      'import.meta.env',
      '__BUILD_ENV__',
    );
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
        if (id === '@livekit/components-react')
          return { useSession: denyProvider };
        if (id === 'livekit-client')
          return { TokenSource: { endpoint: denyProvider } };
        if (id.startsWith('@/components/ui/')) {
          const name = id.split('/').at(-1);
          const exportName = name[0].toUpperCase() + name.slice(1);
          const tag = { button: 'button', textarea: 'textarea', progress: 'progress' }[name] || 'div';
          return { [exportName]: ({ children, ...props }) => React.createElement(tag, props, children) };
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
  return { loadTs, providerCalls: () => providerCalls };
}

for (const flag of [undefined, 'false', 'TRUE', '1']) {
  test(`paused frontend ignores a configured endpoint with opt-in ${String(flag)}`, () => {
    const frontend = loadFrontend({
      PROD: true,
      VITE_LIVE_INTERVIEWS_ENABLED: flag,
      VITE_LIVEKIT_TOKEN_ENDPOINT: 'https://disposable.example/token',
    });
    const Page = frontend.loadTs(resolve(root, 'app/interview/page.tsx')).default;
    const html = renderToStaticMarkup(React.createElement(Page));
    assert.match(html, /Draft your answer/);
    assert.match(html, /<button disabled="">.*?Live conversation/s);
    assert.match(html, /Paused/);
    const { LiveInterview } = frontend.loadTs(resolve(root, 'components/interview/live-interview.tsx'));
    const direct = renderToStaticMarkup(React.createElement(LiveInterview, {
      careerId: 'dataAnalytics', mode: 'behavioral', onUseWrittenPractice() {},
    }));
    assert.match(direct, /Live conversation is paused/);
    assert.equal(frontend.providerCalls(), 0);
  });
}

test('written practice is still the default when live practice is explicitly enabled', () => {
  const frontend = loadFrontend({
    VITE_LIVE_INTERVIEWS_ENABLED: 'true',
    VITE_LIVEKIT_TOKEN_ENDPOINT: 'https://disposable.example/token',
  });
  const Page = frontend.loadTs(resolve(root, 'app/interview/page.tsx')).default;
  const html = renderToStaticMarkup(React.createElement(Page));
  assert.match(html, /Draft your answer/);
  assert.doesNotMatch(html, /<button disabled="">.*?Live conversation/s);
  assert.equal(frontend.providerCalls(), 0);
});
