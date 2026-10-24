'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, LoaderCircle, Phone, Mail } from 'lucide-react';
import { studio } from '@/lib/studio';
import { leadWasAccepted } from '@/lib/lead-response.mjs';
import styles from './contact.module.css';

export default function ContactPage() {
  const [pending, setPending] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const status = useRef<HTMLDivElement>(null);
  const pendingRequest = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingRequest.current) return;
    const data = new FormData(event.currentTarget);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
    if (!apiUrl) {
      setError('Das Onlineformular ist gerade nicht verfügbar. Ruf uns bitte an oder schreib uns direkt eine E-Mail. Deine Eingaben bleiben erhalten.');
      return;
    }
    pendingRequest.current = true;
    setPending(true); setError('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({
          firstName: String(data.get('firstName') || '').trim(),
          lastName: String(data.get('lastName') || '').trim(),
          email: String(data.get('email') || '').trim(),
          phone: String(data.get('phone') || '').trim() || undefined,
          message: String(data.get('message') || '').trim() || undefined,
          interested_in: 'Probetraining', experience_level: data.get('experience'),
          source: 'Website Contact Form',
        }),
      });
      const result: unknown = await response.json().catch(() => null);
      if (response.status === 429) throw new Error('Es gab zu viele Anfragen in kurzer Zeit. Bitte warte etwas oder kontaktiere uns direkt.');
      if (!response.ok || !leadWasAccepted(result)) throw new Error('Wir konnten die Anfrage nicht bestätigen. Bitte versuche es später erneut oder kontaktiere uns direkt.');
      setName(String(data.get('firstName') || '').trim());
      setAccepted(true);
      window.setTimeout(() => status.current?.focus(), 0);
    } catch (reason) {
      setError(reason instanceof Error && reason.name === 'AbortError'
        ? 'Die Bestätigung dauert zu lange. Bitte kontaktiere uns direkt, bevor du die Anfrage erneut sendest.'
        : reason instanceof Error ? reason.message : 'Die Verbindung ist fehlgeschlagen. Bitte kontaktiere uns direkt.');
    } finally {
      window.clearTimeout(timeout); setPending(false); pendingRequest.current = false;
    }
  }

  return <div className={styles.page} id="booking">
    <section className={styles.intro} aria-labelledby="contact-heading"><h1 id="contact-heading">Lernen wir<br />uns kennen.</h1><p>Dein persönliches Probetraining bei G3 ist kostenlos und unverbindlich. Wir stimmen deinen Termin gemeinsam ab.</p><div className={styles.direct}><a href={studio.phoneHref}><Phone size={18} aria-hidden="true" />{studio.phone}</a><a href={`mailto:${studio.email}`}><Mail size={18} aria-hidden="true" />{studio.email}</a></div><address>{studio.street}<br />{studio.postcode} {studio.city}<br /><span>{studio.entrance}</span></address><a href={studio.maps} target="_blank" rel="noopener noreferrer" className={styles.route}>Anfahrt ansehen <ArrowUpRight size={18} aria-hidden="true" /></a></section>
    <section className={styles.formSection} aria-labelledby="request-heading">
      {accepted ? <div ref={status} tabIndex={-1} role="status" className={styles.success}><CheckCircle2 size={42} aria-hidden="true" /><h2>Anfrage erfasst.</h2><p>Danke, {name}! Wir melden uns bei dir, um deinen Termin abzustimmen. Dein Probetraining ist erst vereinbart, wenn wir den Termin persönlich bestätigt haben.</p><Link href="/">Zurück zur Startseite <ArrowUpRight size={18} aria-hidden="true" /></Link></div> : <><h2 id="request-heading">Probetraining anfragen</h2><p className={styles.formNote}>Erzähl uns kurz von dir. Alles Weitere besprechen wir persönlich.</p><form onSubmit={submit}>
        <div className={styles.row}><label>Vorname<input name="firstName" autoComplete="given-name" required maxLength={100} /></label><label>Nachname<input name="lastName" autoComplete="family-name" required maxLength={100} /></label></div>
        <label>E-Mail<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>Telefon <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={50} minLength={5} /></label>
        <label>Deine CrossFit-Erfahrung<select name="experience" defaultValue="new"><option value="new">Ich starte neu</option><option value="experienced">Ich trainiere schon</option><option value="returning">Ich möchte wieder einsteigen</option></select></label>
        <label>Was möchtest du uns sagen? <span>(optional)</span><textarea name="message" rows={3} maxLength={2000} placeholder="Zum Beispiel dein Trainingsziel oder wann du gut Zeit hast." /></label>
        <label className={styles.privacy}><input name="privacy" type="checkbox" required /><span>Ich habe die <Link href="/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutzhinweise</Link> gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung meiner Anfrage einverstanden.</span></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button type="submit" disabled={pending}>{pending ? <>Anfrage wird gesendet <LoaderCircle size={19} className={styles.spin} aria-hidden="true" /></> : <>Anfrage senden <ArrowUpRight size={20} aria-hidden="true" /></>}</button>
        <p className={styles.small}>Du stellst eine unverbindliche Anfrage. Ein Termin wird anschließend persönlich bestätigt.</p>
      </form></>}
    </section>
  </div>;
}
