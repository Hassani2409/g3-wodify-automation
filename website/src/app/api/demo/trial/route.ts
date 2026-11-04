import { POST as sendDemoMail } from './email/route';
import { executeTrial } from '@/lib/trial-execution';
import { emptyDemo, type DemoInput, type DemoState } from '@/lib/trial-demo';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return new Response('Nicht erlaubt', { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return new Response('JSON erforderlich', { status: 415 });
  const text = await request.text();
  if (new TextEncoder().encode(text).length > 20000) return new Response('Anfrage zu groß', { status: 413 });
  let body;
  try { body = JSON.parse(text); } catch { return new Response('Ungültiges JSON', { status: 400 }); }
  const input = body?.input as DemoInput;
  if (!input || typeof input.name !== 'string' || typeof input.email !== 'string' || typeof input.eventId !== 'string' || typeof input.consent !== 'boolean' || input.name.length > 80 || input.email.length > 254 || input.eventId.length > 128) return new Response('Ungültige Daten', { status: 422 });
  const state: DemoState = body.state ?? emptyDemo();
  if (!Array.isArray(state.records) || state.records.length > 50 || !state.events || typeof state.events !== 'object' || Object.keys(state.events).length > 100 || !state.records.every(r => r && typeof r.email === 'string' && typeof r.name === 'string' && typeof r.id === 'string' && typeof r.eventId === 'string' && ['pending','completed'].includes(r.state))) return new Response('Demo zurücksetzen', { status: 422 });
  const iterator = executeTrial(input, state, body.failCrm === true, async () => {
    const response = await sendDemoMail(new Request(new URL('/api/demo/trial/email', request.url), {
      method: 'POST', headers: { 'Content-Type': 'application/json', origin: new URL(request.url).origin },
      body: JSON.stringify({ ...input, confirm: input.consent }),
    }));
    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? 'Resend-Versand nicht bestätigt.');
    return data;
  });
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async pull(controller) {
      try {
        const next = await iterator.next();
        if (next.done) controller.close();
        else controller.enqueue(encoder.encode(JSON.stringify(next.value) + '\n'));
      } catch { controller.error(new Error('Testlauf fehlgeschlagen')); }
    },
    async cancel() { await iterator.return(undefined); },
  });
  return new Response(stream, { headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
