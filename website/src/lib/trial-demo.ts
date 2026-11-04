export type DemoInput = { eventId: string; name: string; email: string; consent: boolean };
export type DemoRecord = { id: string; email: string; name: string; eventId: string; state: 'pending' | 'completed' };
export type DemoState = { records: DemoRecord[]; events: Record<string, string> };
export type DemoResult = {
  state: DemoState;
  status: 'invalid' | 'duplicate' | 'pending' | 'completed' | 'conflict';
  steps: { title: string; detail: string }[];
  receipt?: string;
  emailPreview?: string;
  taskPreview?: string;
};

export const emptyDemo = (): DemoState => ({ records: [], events: {} });

/** Pure simulation: no network, persistence, booking or message delivery. */
export function runTrialDemo(previous: DemoState, input: DemoInput, crmUnavailable = false): DemoResult {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const state: DemoState = { records: previous.records.map(r => ({ ...r })), events: { ...previous.events } };
  const steps = [{ title: 'Anfrage empfangen', detail: 'Testdaten im Arbeitsspeicher dieser Seite.' }];
  const result = (status: DemoResult['status']): DemoResult => ({ state, status, steps });
  if (!input.eventId.trim() || name.length < 2 || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !input.consent) {
    steps.push({ title: 'Prüfung gestoppt', detail: 'Name, gültige E-Mail-Adresse und Test-Einwilligung sind erforderlich. Kein Vorgang angelegt.' });
    return result('invalid');
  }
  const fingerprint = JSON.stringify([name, email, input.consent]);
  if (state.events[input.eventId] && state.events[input.eventId] !== fingerprint) {
    steps.push({ title: 'Widersprüchliche Wiederholung', detail: 'Dieselbe Ereignis-ID enthält andere Daten. Manuelle Prüfung erforderlich.' });
    return result('conflict');
  }
  steps.push({ title: 'Daten geprüft', detail: 'Pflichtfelder vollständig; E-Mail-Adresse normalisiert.' });
  const existing = state.records.find(r => r.email === email);
  if (existing && (existing.state === 'completed' || existing.eventId !== input.eventId)) {
    steps.push({ title: 'Doppelte Anfrage erkannt', detail: `Vorgang ${existing.id} existiert bereits. Keine zweite Bestätigung oder CRM-Aufgabe.` });
    return { ...result('duplicate'), receipt: existing.id };
  }
  const record = existing ?? { id: `DEMO-${String(state.records.length + 1).padStart(3, '0')}`, email, name, eventId: input.eventId, state: 'pending' as const };
  if (!existing) state.records.push(record);
  state.events[input.eventId] = fingerprint;
  steps.push({ title: existing ? 'Vorgang wieder aufgenommen' : 'Demo-Vorgang angelegt', detail: `${record.id}: Anfrage ist keine bestätigte Buchung.` });
  if (crmUnavailable) {
    steps.push({ title: 'CRM nicht erreichbar · simuliert', detail: 'Vorgang bleibt offen. Nach Behebung mit derselben Ereignis-ID fortsetzen; keine Bestätigungsvorschau erzeugt.' });
    return { ...result('pending'), receipt: record.id };
  }
  record.state = 'completed';
  steps.push({ title: 'CRM-Aufgabe vorbereitet', detail: 'Team soll Kontakt aufnehmen und einen Termin persönlich abstimmen. Nur Vorschau.' });
  steps.push({ title: 'Eingangsbestätigung vorbereitet', detail: 'Nur Nachrichtenvorschau. Keine E-Mail versendet, kein Wodify-Eintrag.' });
  return {
    ...result('completed'), receipt: record.id,
    taskPreview: `${record.id} · ${name} kontaktieren. Probetraining abstimmen. Status: neue Anfrage.`,
    emailPreview: `Hallo ${name}, deine Anfrage zum Probetraining ist eingegangen (${record.id}). Das Team meldet sich zur Terminabstimmung. Dein Termin ist noch nicht bestätigt.`,
  };
}
