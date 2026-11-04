import { createHash } from 'node:crypto';

export const runtime = 'nodejs';
// Per-process pilot limits; shared storage is required before a scaled public rollout.
const recent = new Map<string, { at: number; event: string }>();
let windowStart = Date.now();
let windowCount = 0;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const headers = { 'Cache-Control': 'no-store' };
  // Enabled only where the server-side demo configuration is installed.
  if (process.env.G3_DEMO_EMAIL_ENABLED !== 'true') return Response.json({ message: 'Echter Testversand ist hier nicht aktiviert.' }, { status: 403, headers });
  if (request.headers.get('origin') !== url.origin) return Response.json({ message: 'Anfrage nicht erlaubt.' }, { status: 403, headers });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ message: 'JSON erforderlich.' }, { status: 415, headers });
  const raw = await request.text();
  if (raw.length > 2000) return Response.json({ message: 'Anfrage zu groß.' }, { status: 413, headers });
  let body;
  try { body = JSON.parse(raw); } catch { return Response.json({ message: 'Ungültige Anfrage.' }, { status: 400, headers }); }
  const recipient = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!recipient || recipient.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) || typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.length > 80 || typeof body.eventId !== 'string' || !/^[a-zA-Z0-9_-]{16,128}$/.test(body.eventId) || body.confirm !== true) return Response.json({ message: 'Bitte eine gültige E-Mail-Adresse, deinen Namen und die Versandbestätigung angeben.' }, { status: 422, headers });
  const key = process.env.G3_DEMO_RESEND_API_KEY;
  const from = process.env.G3_DEMO_EMAIL_FROM;
  if (!key || !from) return Response.json({ message: 'Resend ist noch nicht konfiguriert.' }, { status: 503, headers });
  const subject = 'G3-Demo: Deine Probetraining-Anfrage';
  const text = `Hallo ${body.name.trim()},\n\ndas ist die echte Test-E-Mail aus der G3-Probetraining-Demo von Hassani Solutions.\n\nDeine Angaben wurden im Testlauf verarbeitet. Es wurde kein echtes Probetraining gebucht und kein Eintrag in Wodify oder einem produktiven CRM angelegt. Für diese Demo ist keine weitere Aktion nötig.\n\nViele Grüße\nHassani Solutions\nhttps://hassanisolutions.com`;
  const idempotency = createHash('sha256').update(JSON.stringify([recipient, body.eventId, body.name.trim()])).digest('hex');
  const now = Date.now();
  if (now - windowStart >= 3600000) { windowStart = now; windowCount = 0; }
  for (const [hash, entry] of recent) if (now - entry.at >= 3600000) recent.delete(hash);
  const recipientHash = createHash('sha256').update(recipient).digest('hex');
  const last = recent.get(recipientHash);
  const retry = last?.event === idempotency;
  if (!retry && ((last && now - last.at < 60000) || windowCount >= 30)) return Response.json({ message: 'Bitte warte kurz vor einer weiteren Demo-Mail.' }, { status: 429, headers });
  if (!retry) { recent.set(recipientHash, { at: now, event: idempotency }); windowCount++; }
  try {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `g3-demo/${idempotency}` }, body: JSON.stringify({ from, to: [recipient], subject, text }), signal: AbortSignal.timeout(10000) });
    const data = await response.json();
    if (!response.ok || typeof data.id !== 'string') return Response.json({ message: 'Resend hat den Versand nicht bestätigt.', status: response.status }, { status: 502, headers });
    return Response.json({ accepted: true, provider: 'Resend', id: data.id, to: recipient, subject, delivery: 'accepted_not_delivery_confirmed' }, { headers });
  } catch { return Response.json({ message: 'Versandstatus unklar. Erneuter Versuch mit denselben Angaben verwendet denselben Versandschlüssel.' }, { status: 503, headers }); }
}
