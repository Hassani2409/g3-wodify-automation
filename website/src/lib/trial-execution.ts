import { emptyDemo, runTrialDemo, type DemoInput, type DemoState } from './trial-demo';

export type ExecutionNode = { id: string; title: string; status: 'running' | 'success' | 'stopped' | 'error'; input: unknown; output?: unknown; startedAt: string; durationMs?: number; adapter?: string };
export type ExecutionEvent = { type: 'node'; node: ExecutionNode } | { type: 'done'; state: DemoState; status: string };

/** Server execution: CRM stays simulated; optional mail sender performs real delivery. */
export async function* executeTrial(input: DemoInput, state: DemoState = emptyDemo(), failCrm = false, sendMail?: () => Promise<unknown>): AsyncGenerator<ExecutionEvent> {
  async function* node(id: string, title: string, data: unknown, work: () => unknown | Promise<unknown>, adapter?: string): AsyncGenerator<ExecutionEvent, unknown> {
    const started = Date.now();
    const base = { id, title, input: data, startedAt: new Date(started).toISOString(), adapter };
    yield { type: 'node', node: { ...base, status: 'running' } };
    // Deliberate presentation pacing, not a claimed integration response time.
    await new Promise(resolve => setTimeout(resolve, 1200));
    try {
      const output = await work();
      yield { type: 'node', node: { ...base, status: 'success', output, durationMs: Date.now() - started } };
      return output;
    } catch (cause) {
      yield { type: 'node', node: { ...base, status: 'error', output: { error: cause instanceof Error ? cause.message : 'Schritt fehlgeschlagen', retryable: true }, durationMs: Date.now() - started } };
      return null;
    }
  }
  yield* node('webhook', 'Formular → Webhook', input, () => ({ received: true, eventId: input.eventId }), 'Echter HTTP-Eingang');
  const result = runTrialDemo(state, input, failCrm);
  const valid = !['invalid', 'conflict'].includes(result.status);
  yield* node('validate', 'Daten prüfen & normalisieren', { name: input.name, email: input.email, consent: input.consent }, () => ({ valid, name: input.name.trim(), email: input.email.trim().toLowerCase(), reason: valid ? null : result.steps.at(-1)?.detail }));
  if (!valid) { yield { type: 'done', state, status: result.status }; return; }
  yield* node('duplicate', 'Dubletten abgleichen', { email: input.email.trim().toLowerCase(), existingRecords: state.records.length }, () => ({ duplicate: result.status === 'duplicate', receipt: result.receipt }));
  if (result.status === 'duplicate') { yield { type: 'done', state, status: 'duplicate' }; return; }
  yield* node('record', 'Testvorgang anlegen / fortsetzen', { eventId: input.eventId }, () => ({ receipt: result.receipt, persistence: 'Sitzungsdaten, keine Datenbank', bookingConfirmed: false }), 'Test-Speicher');
  yield* node('crm', 'CRM-Aufgabe erstellen', { receipt: result.receipt, name: input.name.trim(), email: input.email.trim().toLowerCase() }, () => {
    if (failCrm) throw new Error('Simulated outage');
    return { created: true, task: result.taskPreview, externalWrite: false };
  }, 'CRM-Testadapter');
  if (result.status === 'pending') { yield { type: 'done', state: result.state, status: 'pending' }; return; }
  const email = yield* node('email', sendMail ? 'Bestätigung über Resend senden' : 'Bestätigung erstellen', { to: input.email.trim().toLowerCase(), receipt: result.receipt }, sendMail ?? (() => ({ subject: 'Deine Probetraining-Anfrage', text: result.emailPreview, sent: false, bookingConfirmed: false })), sendMail ? 'Resend · echter Versand' : 'E-Mail-Testadapter');
  if (email === null) {
    const pending = { ...result.state, records: result.state.records.map(r => r.id === result.receipt ? { ...r, state: 'pending' as const } : r) };
    yield { type: 'done', state: pending, status: 'email_failed' }; return;
  }
  yield { type: 'done', state: result.state, status: result.status };
}
