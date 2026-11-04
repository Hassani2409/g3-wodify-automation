import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
const code = ts.transpileModule(fs.readFileSync(new URL('../src/lib/trial-demo.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const mod = { exports: {} };
vm.runInNewContext(code, { module: mod, exports: mod.exports });
const { emptyDemo, runTrialDemo } = mod.exports;
const input = { eventId: 'event-1', name: 'Alex Demo', email: 'alex@example.com', consent: true };
test('valid request prepares previews but never confirms a booking', () => {
  const r = runTrialDemo(emptyDemo(), input);
  assert.equal(r.status, 'completed');
  assert.match(r.emailPreview, /noch nicht bestätigt/);
  assert.equal(r.state.records.length, 1);
});
test('invalid fields and missing consent have no stored effects', () => {
  for (const patch of [{ email: 'invalid' }, { consent: false }, { name: '' }]) {
    const r = runTrialDemo(emptyDemo(), { ...input, ...patch });
    assert.equal(r.status, 'invalid');
    assert.equal(r.state.records.length, 0);
  }
});
test('same event and normalized email cannot create duplicate previews', () => {
  const first = runTrialDemo(emptyDemo(), input);
  const r = runTrialDemo(first.state, { ...input, eventId: 'event-2', email: ' ALEX@example.com ' });
  assert.equal(r.status, 'duplicate');
  assert.equal(r.state.records.length, 1);
  assert.equal(r.emailPreview, undefined);
  assert.equal(runTrialDemo(first.state, input).status, 'duplicate');
});
test('CRM failure retains pending request, recovery completes once without mutating old state', () => {
  const pending = runTrialDemo(emptyDemo(), input, true);
  assert.equal(pending.status, 'pending');
  assert.equal(pending.emailPreview, undefined);
  const done = runTrialDemo(pending.state, input);
  assert.equal(done.status, 'completed');
  assert.equal(done.receipt, pending.receipt);
  assert.equal(pending.state.records[0].state, 'pending');
  assert.equal(done.state.records.length, 1);
});
test('reused event with changed payload is rejected', () => {
  const first = runTrialDemo(emptyDemo(), input, true);
  assert.equal(runTrialDemo(first.state, { ...input, name: 'Other' }).status, 'conflict');
});
