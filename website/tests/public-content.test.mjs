import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));

function loadSource(relativePath) {
  const filename = path.join(testDirectory, '..', relativePath);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, URL }, { filename });
  return loadedModule.exports;
}

const { serializeJsonLd } = loadSource('src/lib/serialize-json-ld.ts');
const { getPublicCalendarUrl } = loadSource('src/lib/public-calendar.ts');

test('JSON-LD cannot terminate its script element and round-trips unchanged', () => {
  const data = { name: '</script><script>alert("x")</script>', nested: { value: '<&>' } };
  const serialized = serializeJsonLd(data);
  assert.ok(!serialized.includes('<'));
  assert.ok(serialized.includes('\\u003c/script>'));
  assert.deepEqual(JSON.parse(serialized), data);
});

test('JSON-LD preserves normal public facts and Unicode', () => {
  const data = { name: 'G3 CrossFit', address: 'Tempelhofer Ufer 36', note: 'für dich' };
  assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
});

test('no public calendar is advertised when configuration is missing or invalid', () => {
  for (const value of [undefined, '', '   ', '/schedule', 'not a url', 'javascript:alert(1)', 'http://example.com']) {
    assert.equal(getPublicCalendarUrl(value), null);
  }
});

test('a configured HTTPS calendar URL is preserved', () => {
  assert.equal(getPublicCalendarUrl('https://app.wodify.com/calendar?tenant=verified'), 'https://app.wodify.com/calendar?tenant=verified');
});
