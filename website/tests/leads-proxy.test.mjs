import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const code = ts.transpileModule(fs.readFileSync(new URL('../src/app/api/leads/route.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
function proxy(env = {}, upstream = async () => { throw new Error('No network expected'); }) {
  const loadedModule = { exports: {} };
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, URL, TextEncoder, AbortSignal, process: { env }, fetch: upstream,
    require: name => { assert.equal(name, 'next/server'); return { NextResponse: { json: (data, init) => new Response(JSON.stringify(data), init) } }; },
  });
  return loadedModule.exports.POST;
}
function request(body = '{}', headers = {}) {
  return { nextUrl: new URL('https://g3.example/api/leads'), headers: new Headers({ 'content-type': 'application/json', origin: 'https://g3.example', 'idempotency-key': '1234567890123456', ...headers }), text: async () => body };
}
test('lead proxy fails closed without backend configuration or matching origin', async () => {
  assert.equal((await proxy()(request())).status, 503);
  assert.equal((await proxy({ LEAD_API_URL: 'https://backend.example' })(request('{}', { origin: 'https://evil.example' }))).status, 403);
  assert.equal((await proxy({ LEAD_API_URL: 'http://remote.example' })(request())).status, 503);
});
test('lead proxy rejects oversized, malformed and unkeyed submissions before forwarding', async () => {
  const post = proxy({ LEAD_API_URL: 'https://backend.example' });
  assert.equal((await post(request('invalid'))).status, 400);
  assert.equal((await post(request('a'.repeat(12001)))).status, 413);
  assert.equal((await post(request('{}', { 'idempotency-key': '' }))).status, 422);
});
test('lead proxy forwards idempotency and only returns the public receipt', async () => {
  let count = 0;
  const post = proxy({ LEAD_API_URL: 'https://backend.example' }, async (url, options) => {
    count++;
    assert.equal(url, 'https://backend.example/api/leads');
    assert.equal(options.headers['Idempotency-Key'], '1234567890123456');
    assert.equal(options.redirect, 'error');
    return new Response(JSON.stringify({ success: true, request_id: 'request-1', automation_mode: 'test', private: 'hidden' }), { status: 202 });
  });
  const response = await post(request());
  assert.equal(response.status, 202);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal((await response.json()).private, undefined);
  assert.equal(count, 1);
});
test('lead proxy never claims success after upstream failure or malformed receipt', async () => {
  for (const upstream of [async () => { throw new Error('timeout'); }, async () => new Response('secret', { status: 500 }), async () => new Response(JSON.stringify({ success: true, automation_mode: 'live' }))]) {
    const result = await proxy({ LEAD_API_URL: 'https://backend.example' }, upstream)(request());
    assert.equal(result.status, 503);
    assert.ok(!(await result.text()).includes('secret'));
  }
});
