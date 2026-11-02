# Website-Assistent (Claude)

Stand: 02.11.2026. Chat über den Kontakt-Button unten rechts („Frag den G3-Assistenten“).

## Aufbau

Browser → `POST /api/assistant` (Next.js, nur serverseitig) → Anthropic Messages API. Der API-Key verlässt nie den Server.

- Wissen: `website/src/lib/assistant/knowledge.ts` baut den Systemprompt ausschließlich aus gepflegten Quellen (`lib/site.ts`, `lib/pricing.ts`). Kurszeiten, Öffnungszeiten, freie Plätze und Parkplätze kennt der Assistent bewusst nicht.
- Prüfung: höchstens 12 Nachrichten, je 800 Zeichen, abwechselnd beginnend mit dem Nutzer; fremde Herkunft 403, Größe 413.
- Kostenschutz: 20 Nachrichten pro IP in 10 Minuten. Der Zähler liegt im Arbeitsspeicher einer Server-Instanz – auf Vercel nur ein grober Schutz. Zusätzlich im Anthropic-Konto ein Ausgabenlimit setzen.
- Datenschutz: Chatinhalte werden nicht gespeichert oder geloggt (Fehlerlog nur mit Statuscode). Hinweis im Chat und Abschnitt 7 der Datenschutzerklärung – **vor Livegang rechtlich prüfen lassen** (Drittlandübermittlung USA, Auftragsverarbeitung mit Anthropic).
- Demo-Modus: Ohne `ANTHROPIC_API_KEY` oder bei einem Fehler des Anbieters antworten regelbasierte Texte aus denselben Fakten; der Chat zeigt dann „Demo-Modus“.

## Aktivieren

In Vercel (oder `.env.local`) setzen, siehe `website/.env.assistant.example`:

```
ANTHROPIC_API_KEY=...
ASSISTANT_MODEL=claude-haiku-5-5   # optional
```

Danach neu deployen. Ein echter Testlauf mit Key steht noch aus.

## Weitere Änderungen in diesem Schritt

- Blog bleibt als Showcase, ist aber als Beispielinhalt gekennzeichnet (Hinweisbox, Musterautor:innen, fiktive Story) und `noindex`.
- `/trial` leitet auf `/contact#booking` um; `/trial` und `/showcase` sind aus der Sitemap entfernt.
- Showcase, Telefon-Assistent, Mitgliederbereich und Login sind `noindex`. Der Login-Link im Header erscheint erst mit `NEXT_PUBLIC_MEMBER_PORTAL=true`.
- Der Kontakt-Button bietet Chat und einen echten Anruf-Link statt des Telefon-Prototyps.

## Prüfen

```sh
npm --prefix website test     # inkl. tests/assistant.test.mjs
npm --prefix website run lint
```
