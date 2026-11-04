'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { emptyDemo, type DemoInput } from '@/lib/trial-demo';
import type { ExecutionEvent, ExecutionNode } from '@/lib/trial-execution';
import styles from './trial-demo.module.css';

const definitions = [
  ['webhook', 'Formular → Webhook'], ['validate', 'Daten prüfen'], ['duplicate', 'Dubletten abgleichen'],
  ['record', 'Testvorgang'], ['crm', 'CRM-Aufgabe'], ['email', 'E-Mail-Bestätigung'],
];
const statusText = { running: 'Wird ausgeführt', success: 'Ausgeführt', error: 'Fehler', stopped: 'Gestoppt' };
const endings: Record<string, string> = { completed: 'Testlauf abgeschlossen', invalid: 'Eingaben ungültig – Ablauf gestoppt', conflict: 'Ereigniskonflikt – Ablauf gestoppt', duplicate: 'Dublette – keine zweite Aufgabe oder E-Mail', email_failed: 'E-Mail nicht bestätigt – erneuter Versuch möglich', pending: 'CRM fehlgeschlagen – Vorgang wartet auf Wiederaufnahme' };

export default function TrialDemo() {
  const [input, setInput] = useState<DemoInput>({ eventId: '', name: '', email: '', consent: false });
  const [store, setStore] = useState(emptyDemo);
  const [failure, setFailure] = useState(false);
  const [nodes, setNodes] = useState<ExecutionNode[]>([]);
  const [selected, setSelected] = useState('webhook');
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState('');
  const [error, setError] = useState('');

  const [follow, setFollow] = useState(true);
  const followRef = useRef(true);
  const events = useRef<ExecutionEvent[]>([]);
  const panel = useRef<HTMLElement>(null);
  const active = nodes.find(n => n.id === selected);

  async function run(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setOutcome(''); setNodes([]); setSelected('webhook');
    events.current = []; followRef.current = true; setFollow(true);
    panel.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    const requestInput = { ...input, eventId: input.eventId || crypto.randomUUID() };
    setInput(requestInput);
    try {
      const response = await fetch('/api/demo/trial', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input: requestInput, state: store, failCrm: failure }) });
      if (!response.ok || !response.body) throw new Error(`Testlauf konnte nicht gestartet werden (HTTP ${response.status}).`);
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let completed = false;
      function receive(line: string) {
        const event: ExecutionEvent = JSON.parse(line); events.current.push(event);
        if (event.type === 'node') {
          setNodes(old => [...old.filter(n => n.id !== event.node.id), event.node]);
          if (followRef.current) setSelected(event.node.id);
        } else { setStore(event.state); setOutcome(event.status); completed = true; }
      }
      while (true) {
        const chunk = await reader.read();
        buffer += decoder.decode(chunk.value, { stream: !chunk.done });
        const lines = buffer.split('\n'); buffer = lines.pop() ?? '';
        lines.filter(Boolean).forEach(receive);
        if (chunk.done) break;
      }
      if (buffer.trim()) receive(buffer);
      if (!completed) throw new Error('Verbindung unterbrochen. Kein vollständiger Testnachweis; bitte erneut prüfen.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Verarbeitung fehlgeschlagen.'); }
    finally { setBusy(false); }
  }
  function reset() {
    setStore(emptyDemo()); setNodes([]); setOutcome(''); setError(''); events.current = [];
    setInput({ eventId: '', name: '', email: '', consent: false }); setFailure(false);
  }
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ mode: 'server-test-adapters', events: events.current }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'g3-ausfuehrung.json'; link.click(); URL.revokeObjectURL(url);
  }

  return <div className={styles.demo}>
    <header className={styles.hero}><div className={styles.wrap}>
      <Link href="/" className={styles.back}>← Zur G3-Hauptseite</Link>
      <p className={styles.eyebrow}>G3 × Hassani Solutions · Ausführbare Arbeitsprobe</p>
      <h1>Deine Anfrage.<br /><span>Der Ablauf dahinter.</span></h1>
      <p className={styles.intro}>Gib deine Angaben ein und starte den Testlauf. Jeder Schritt zeigt dir live, welche Daten ankommen, was geprüft wird und welches Ergebnis entsteht.</p>
      <p className={styles.notice}><strong>Serverseitiger Testlauf.</strong> Deine Eingaben werden an diesen Demo-Server übertragen, verarbeitet und zurückgegeben. Keine dauerhafte Speicherung. Das CRM bleibt ein Testadapter. Am Ende des Ablaufs wird automatisch eine echte Demo-Mail über Resend an deine eingegebene E-Mail-Adresse gesendet. Keine Buchung oder Wodify-Verbindung. Jeder Schritt enthält 1,2 Sekunden Lesepause; die angezeigte Laufzeit enthält diese Pause.</p>
    </div></header>
    <div className={styles.wrap}>
      <div className={styles.workspace}>
        <section className={styles.formSection} aria-labelledby="input-heading">
          <p className={styles.eyebrow}>01 / Deine Anfrage</p><h2 id="input-heading">Probetraining anfragen.</h2>
          <p>Beim Start wird der Ablauf ausgeführt und anschließend automatisch eine echte Demo-Mail an deine Adresse verschickt. Keine Studio-Anmeldung.</p>
          <form onSubmit={run}><fieldset className={styles.fields} disabled={busy}>
            <label htmlFor="demo-name">Dein Name</label><input required minLength={2} maxLength={80} id="demo-name" value={input.name} onChange={e => setInput({ ...input, eventId: '', name: e.target.value })} autoComplete="off" />
            <label htmlFor="demo-email">Deine E-Mail-Adresse</label><input required type="email" maxLength={254} id="demo-email" value={input.email} onChange={e => setInput({ ...input, eventId: '', email: e.target.value })} autoComplete="off" />
            <label className={styles.check}><input required type="checkbox" checked={input.consent} onChange={e => setInput({ ...input, eventId: '', consent: e.target.checked })} />Meine Angaben verarbeiten und mir automatisch eine echte Demo-Mail senden</label>
            <label className={styles.check}><input type="checkbox" checked={failure} onChange={e => setFailure(e.target.checked)} />CRM-Ausfall im Testadapter auslösen</label>
            <button className={styles.primary} type="submit">{busy ? 'Testlauf wird ausgeführt …' : (outcome === 'pending' || outcome === 'email_failed') && !failure ? 'Offenen Testlauf wieder aufnehmen' : 'Testlauf starten'} <span aria-hidden>↗</span></button>
          </fieldset></form>
          <div className={styles.tests}><button disabled={busy} onClick={() => { setInput({ eventId: '', name: 'Alex Demo', email: 'alex@example.com', consent: true }); }}>Beispieldaten einsetzen</button><button disabled={busy} onClick={reset}>Daten & Testläufe löschen</button></div>
          <p className={styles.hint}>Dubletten testen: dieselben Angaben erneut absenden. Fehler testen: CRM-Ausfall aktivieren, starten, anschließend deaktivieren und wieder aufnehmen. Es werden keine anderen Sitzungen abgefragt.</p>
        </section>
        <section ref={panel} className={styles.results} aria-labelledby="result-heading">
          <p className={styles.eyebrow}>02 / Live-Ausführung</p>
          <h2 id="result-heading" role="status">{busy ? 'Testlauf läuft …' : error ? 'Testlauf unterbrochen' : endings[outcome] ?? 'Wartet auf deine Anfrage.'}</h2>
          {error && <p role="alert">{error}</p>}
          <label className={styles.check}><input type="checkbox" checked={follow} onChange={e => { setFollow(e.target.checked); followRef.current = e.target.checked; }} />Aktiven Schritt automatisch anzeigen</label>
          <div className={styles.execution}>
            <ol className={styles.nodeList}>{definitions.map(([id,title]) => {
              const node = nodes.find(n => n.id === id);
              return <li key={id}><button onClick={() => { setSelected(id); setFollow(false); followRef.current = false; }} aria-pressed={id === selected} data-status={node?.status ?? 'waiting'}><span>{title}</span><small>{node ? statusText[node.status] : outcome ? 'Nicht ausgeführt' : 'Wartet'}</small></button></li>;
            })}</ol>
            <div className={styles.inspector} aria-live="polite">
              <h3>{definitions.find(d => d[0] === selected)?.[1]}</h3>
              {active ? <>
                <p>{statusText[active.status]}{active.durationMs !== undefined ? ` · ${active.durationMs} ms inkl. Lesepause` : ''}</p>
                <p className={styles.hint}>{active.adapter ?? 'Verarbeitungslogik'} · {new Date(active.startedAt).toLocaleTimeString('de-DE')}</p>
                <h4>Eingabe</h4><pre>{JSON.stringify(active.input,null,2)}</pre>
                <h4>Ausgabe</h4><pre>{active.output === undefined ? 'Schritt läuft – Ergebnis noch nicht vorhanden.' : JSON.stringify(active.output,null,2)}</pre>
              </> : <p>Dieser Schritt wurde noch nicht ausgeführt. Nach dem Absenden erscheinen hier die tatsächlich verarbeiteten Daten.</p>}
            </div>
          </div>
          <div className={styles.summary}><p>{store.records.length} Testvorgänge in dieser Sitzung. Keine Produktivdatenbank.</p><button disabled={busy || !outcome} onClick={download}>Ausführungsprotokoll herunterladen ↓</button></div>
        </section>
      </div>
      <section className={styles.boundaries}><h2>Echte Verarbeitung. Kontrollierte Testadapter.</h2><p>HTTP-Annahme, Validierung, Normalisierung und Dublettenlogik laufen auf dem Server. Die CRM-Aufgabe wird als Testobjekt erstellt. Der letzte Schritt ruft Resend tatsächlich auf und zeigt dessen Versandantwort. Die Ausgangsdaten für den Dublettenabgleich stammen ausschließlich aus dieser geöffneten Seite. Beim Neuladen endet die Sitzung.</p><p>Für einen Live-Betrieb fehlen noch dauerhafte Speicherung, eine produktive CRM-Anbindung und die Abnahme. Resend nutzt deine eingegebene E-Mail-Adresse. „Angenommen“ bedeutet noch keine bestätigte Zustellung im Postfach. Die Demo verspricht keine bestätigten Termine.</p></section>
    </div>
  </div>;
}
