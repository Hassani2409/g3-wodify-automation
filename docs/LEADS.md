# CRM-unabhängige Lead-Verarbeitung

Stand: 24.10.2026. Prototyp im Testbetrieb. Kein Versand, keine CRM-Workflow-Einschreibung, keine Terminbestätigung.

## Architektur und Daten

Website → gleichnamige Next.js-Route `/api/leads` → eigenständige FastAPI-Anwendung → lokale Datenbank → dauerhafte CRM-Warteschlange → Adapter.

- `crm_contacts`: ein Kontakt pro normalisierter E-Mail-Adresse.
- `crm_inquiries`: unveränderliche Anfrage mit Terminwunsch, Uhrzeitwunsch, Erfahrung, Nachricht und bestätigtem Datenschutzhinweis samt Version. Eingang ist keine Buchung.
- `crm_sync_jobs`: Provider, ursprünglicher Test-/Live-Modus, Status, Versuche, nächster Versuch, zeitlich begrenzte Worker-Lease und externe Kontakt-ID. Keine Tokens oder API-Antworttexte in Fehlerfeldern.
- `crm_automation_previews`: Eingangsbestätigung und Team-Benachrichtigung als reiner Textentwurf. Keine Versandfunktion, kein SendGrid-Import und keine geplanten Marketing-Mails.

Kontakt- und Anfrageablage, Sync-Auftrag und Entwürfe werden atomar gespeichert, bevor eine CRM-Verbindung aufgebaut wird. Ein erneuter Versuch mit demselben `Idempotency-Key` und identischem Inhalt gibt dieselbe Anfragenummer zurück. Unterschiedliche Anfragen derselben Person bleiben getrennt erhalten. Die Website behält den Schlüssel bei einem Übertragungsfehler solange die Angaben unverändert bleiben; bei komplettem Neuladen entsteht ein neuer Schlüssel.

## Sicherer Standard

`CRM_SYNC_MODE=test` erzeugt ausschließlich lokale Referenzen mit `test:`. Der Worker ruft dabei keine externe API auf. Test-Aufträge bleiben auch nach einer späteren Konfigurationsänderung Test-Aufträge. Live-Aufträge werden bei aktivem globalem Testmodus blockiert. Ausgehende Kontaktfelder stammen aus der neuesten Anfrage desselben Kontakts, Providers und ursprünglichen Modus, damit Testdaten nicht über alte Live-Aufträge übertragen werden und ältere Wiederholungen keine neueren Anfragen überschreiben.

`LEAD_AUTOMATION_MODE` unterstützt in dieser Version ausschließlich `test`. Ein anderer Wert verhindert den Start. Entwürfe sind nicht gesendet und werden nie als zugestellte Nachrichten ausgewiesen. Termine, Erinnerungen und Nachfass-Sequenzen werden nicht automatisch gebucht oder aktiviert.

## Lokal starten

Python 3.11; bestehende Abhängigkeiten installieren:

```sh
python -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.leads.example .env
.venv/bin/uvicorn src.lead_app:app --host 127.0.0.1 --port 8000
```

In einem zweiten Terminal mit derselben Umgebung:

```sh
.venv/bin/python -m src.leads.worker
# Alternativ: nur aktuell fällige Aufträge abarbeiten
.venv/bin/python -m src.leads.worker --once
```

Die eigenständige Anwendung braucht weder Wodify- noch SendGrid-Konfiguration und importiert die alten Scheduler nicht. Für diesen Prototyp einen Worker betreiben. SQLite ist für lokale Demonstration gedacht; Datenbank und Worker müssen bei einem Deployment dauerhaft laufen. Der Legacy-Einstieg `main:app` ist hierfür nicht nötig und hat weiterhin unabhängige Altfehler.

Website: `LEAD_API_URL` serverseitig gemäß `website/.env.leads.example` setzen und Next.js neu bauen/starten. Kein `NEXT_PUBLIC_`-Schlüssel. Ohne Backend-Konfiguration liefert das Formular einen Fehler statt einer vorgetäuschten Bestätigung. HTTP ist nur für localhost erlaubt, außerhalb davon HTTPS. Next.js prüft Herkunft, Größe, JSON und Anfrageschlüssel; die API validiert alle Felder und begrenzt die öffentliche Annahme auf zehn Anfragen pro Minute pro Backend-Clientadresse. Hinter dem Website-Proxy ist das zunächst ein gemeinsames Limit. Für Produktion IP-/Proxy-Vertrauen, verteilten Spam-/Rate-Limit-Schutz und eine verbindliche Aufbewahrungs-/Löschregel ergänzen.

Neue Tabellen werden beim Start additiv erzeugt. Die vorhandene Alembic-Revision `002_crm_independent_leads` ist für eine bereits migrierte Bestandsdatenbank vorgesehen; ihren Ziel-Datenbankpfad ausdrücklich prüfen. Die neuen Tabellen ändern die alten Wodify-Lead-Tabellen nicht.

## Prüfen und bearbeiten

`LEAD_ADMIN_KEY` als zufälliges Geheimnis mit mindestens 32 Zeichen setzen; nicht in Git schreiben und nicht im Browser speichern. Verwaltungsaufrufe brauchen `X-Lead-Admin-Key`. Ohne Konfiguration ist der Zugang gesperrt; Antworten sind `Cache-Control: no-store`.

- `GET /api/leads/manage?limit=25&offset=0`: paginierte Anfrageliste.
- `GET /api/leads/manage/{request_id}`: originale Angaben, CRM-Status und Textentwürfe.
- `PATCH /api/leads/manage/{request_id}` mit `{"status":"contacted"}`: Status `new`, `contacted`, `converted` oder `closed`.
- `POST /api/leads/manage/process?limit=10`: fällige Aufträge abarbeiten.
- `POST /api/leads/manage/{request_id}/retry`: fehlgeschlagene Aufträge atomar neu vormerken; aktiver Worker und simulierte/erfolgreiche Aufträge bleiben geschützt.

Standardwiederholung: maximal fünf Versuche, exponentielle Wartezeit ab 60 Sekunden. HubSpot-429 berücksichtigt `Retry-After`, Authentifizierungs-/Validierungsfehler brauchen eine bewusste Korrektur. Nach einem Worker-Abbruch wird die abgelaufene Lease wieder übernommen. CRM-Zustellung erfolgt mindestens einmal; der Adapter muss idempotent arbeiten. Es gibt noch keine grafische CRM-Verwaltungsoberfläche oder produktive Termin-Synchronisierung.

## HubSpot und weitere Adapter

`src/leads/adapters.py` definiert `CRMAdapter.upsert_contact(payload)` und `SyncResult`/`SyncError`. Einen weiteren CRM-Adapter implementieren, im Provider-Resolver und der Konfiguration registrieren und dessen Idempotenz und Fehlerklassifikation testen. Die Website bleibt davon unabhängig. In dieser Version ist HubSpot der einzige implementierte Provider.

HubSpot verwendet den offiziellen [Kontakt-Upsert-Endpunkt](https://developers.hubspot.com/docs/api-reference/legacy/crm/objects/contacts/guide#upsert-contacts), `POST /crm/v3/objects/contacts/batch/upsert` mit `idProperty=email`. Übertragen werden E-Mail, Vor-/Nachname und gegebenenfalls Telefon. Kein Lifecycle-Status, Marketing-Abonnement, Workflow oder Deal wird gesetzt. Anfrage-Details bleiben zunächst in unserer lokalen Ablage.

Es wurde noch kein echtes HubSpot-Konto verbunden. Vor einem Live-Test: Testkonto und Kontakt-Schreibrechte bereitstellen, `HUBSPOT_ACCESS_TOKEN` sicher hinterlegen, vorhandene HubSpot-Automationen auf unerwünschten Versand prüfen und erst dann `CRM_SYNC_MODE=live` bewusst konfigurieren. Das schaltet weiterhin keinen E-Mail-Versand unserer Anwendung frei. Bereits vorhandene Testanfragen werden nicht nachträglich übertragen.

## Verifikation

```sh
.venv/bin/python -m pytest tests/test_crm_leads.py -o addopts='' -q
.venv/bin/python -m flake8 src/leads src/lead_app.py src/api/leads.py tests/test_crm_leads.py --max-line-length=120 --extend-ignore=E203,W503
npm --prefix website test
npm --prefix website run lint
npm --prefix website run type-check
npm --prefix website run build
```

HubSpot-Vertragstests verwenden `httpx.MockTransport`; sie ersetzen keine Abnahme gegen ein echtes Konto. Die vollständige alte Python-Suite scheitert derzeit bereits beim Einsammeln von `test_admin.py` und `test_webhooks.py`, weil `src/api/membership.py` den nicht vorhandenen Namen `MembershipStatus` importiert. Diese unabhängige Altbaustelle wurde nicht in den Lead-Prototyp übernommen.
