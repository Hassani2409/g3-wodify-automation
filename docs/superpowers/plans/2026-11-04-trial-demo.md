# Probetraining-Demo

Freigegebene Richtung: separater Demo-Bereich im G3-Projekt, zunächst Anfrage → Prüfung → Dublettenprüfung → Bestätigungsvorschau → CRM-Aufgabe. Ausschließlich simulierte Daten, keine Wodify- oder Versandbehauptung.

Entscheidung: deterministische Browser-Simulation ohne externe Aufrufe. Die vorhandene Python-Simulation bleibt unverändert; eine neue öffentliche API wäre für die erste vorzeigbare Demo unnötig. Ablauf und Ergebnisse sind exportierbar, keine Speicherung im Browser.

- [x] Reine Ablauf-Engine mit Tests für Validierung, Wiederholung, Dubletten und Wiederaufnahme nach CRM-Ausfall.
- [x] Separate noindex-Seite `/demo/probetraining` mit Testfallauswahl, sichtbaren Ergebnissen und JSON-Export.
- [x] Verlinkung im Showcase, keine Änderung des echten Kontaktformulars.
- [x] Tests, Typprüfung, Build und Browserprüfung auf Desktop und Mobil.

Grenzen: keine echte E-Mail, CRM-Aufgabe oder Buchung; keine reale Kurstermin- oder Platzverfügbarkeit. Eingang wird quittiert, Termin bleibt unbestätigt. Sitzung endet beim Neuladen. Kein Kopieren fremder Flow-Lab-Dateien.

Prüfung: 24 Website-Tests bestanden; Typprüfung und gezieltes ESLint bestanden. Produktionsbuild erfolgreich, protokolliert aber bestehende PortalLayout-SSR-Meldungen (location is not defined); diese liegen außerhalb der Demo. Browser: Normalfall, Dublette, ungültige Eingabe und CRM-Wiederaufnahme geprüft; Mobilansicht ohne horizontalen Überlauf. Lokale Vorschau auf Port 3050, noch kein Deployment.

## Weiterentwicklung: serverseitige Ausführung

Nutzerkorrektur: eigene Eingaben absenden, tatsächliche Verarbeitung und Daten pro Schritt beobachten. Die Browser-Wiedergabe wurde durch POST `/api/demo/trial` mit NDJSON-Ereignissen ersetzt. Oberfläche zeigt Start/Ergebnis, Eingabe/Ausgabe, Zeitstempel und Laufzeit je Knoten. 1,2 Sekunden Lesepause ist explizit ausgewiesen. CRM/E-Mail bleiben reine Testadapter; Zustand wird nur in der geöffneten Seite gehalten und zum erneuten Test mitgesendet. Keine echte Datenbank, kein Versand und kein n8n-Runtime-Claim.

Abnahme: Typprüfung, gezieltes ESLint und 24 bestehende Tests erfolgreich; echter HTTP-Stream mit sechs Start-/Ergebnis-Paaren und sent=false geprüft. CRM-Fehler liefert pending und führt E-Mail-Schritt nicht aus. Formular im Browser bis zum vollständigen Serverergebnis geprüft; anschließend Eingaben zurückgesetzt.

## Resend-Testversand

Separater expliziter Button nach erfolgreicher Simulation, lokale Route `/api/demo/trial/email`. Nur localhost und aktiviertes Serverflag, feste Empfänger-Allowlist, Same-Origin und serverseitige Schlüssel. Keine Veröffentlichung oder Öffnung für beliebige Empfänger. Resend-Idempotenzschlüssel aus Event und Nachricht; 24-Stunden-Fenster laut Anbieter, kein unbegrenzter Doppelversandschutz. Bei identischer Wiederholung gleiche Provider-ID zurückgegeben. Andere Adresse abgelehnt. Echte Testmail am 04.11.2026 von Hassani Solutions an Dennis' hinterlegte Gmail-Adresse angenommen, Provider-ID 01a1a635-d721-77e8-bf2e-a3dddf78420e. Zustellung nicht bestätigt. 28 Tests bestanden, Typprüfung und gezieltes ESLint bestanden. Lokale Konfiguration nur in ignorierter .env.local, kein Schlüssel im Repository.

Nutzeränderung: feste Empfänger-Allowlist entfernt; jede gültige eingegebene Adresse wird akzeptiert. Expliziter Versandbutton bleibt. Pro Prozess 60 Sekunden Abstand je Empfänger bei neuem Ereignis, 30 neue Sendungen/Stunde insgesamt, identische Wiederholungen mit Resend-Idempotenz. Diese In-Memory-Grenzen sind für lokale Vorschau; für skalierten öffentlichen Betrieb gemeinsame dauerhafte Limitierung ergänzen. Keine öffentliche Veröffentlichung erfolgt. 30 Tests bestanden, inklusive Kundenadresse und Versandlimit.

## Automatischer Versand im Ablauf

Nutzerfreigabe: echte Mail automatisch am Ende versenden, ohne zweiten Klick. Formular nennt echten Versand vorab; Zustimmung deckt Datenverarbeitung und Demo-Mail ab. Streaming-Workflow ruft serverseitig den bestehenden geschützten Resend-Handler auf und wartet auf dessen Antwort. Provider-ID/accepted werden im E-Mail-Knoten ausgegeben, Zustellung wird nicht behauptet. CRM bleibt Testadapter. Mail-Fehler liefert email_failed und offenen Vorgang zur Wiederaufnahme; erfolgreiche Wiederholung stoppt als Dublette. 33 Tests erfolgreich, einschließlich asynchronem Sender, CRM-Abbruch, Mail-Fehler und Wiederaufnahme. Deployment auf Vercel ist laut Nutzer für später vorgesehen; noch nicht erfolgt.
