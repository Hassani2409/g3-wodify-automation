# Dauerhafte Lead-Verarbeitung

## Architektur

Produktionsformular → Next.js `/api/leads` → privater Schlüssel im Server-Header → Vercel-FastAPI `src.lead_app:app` → Supabase PostgreSQL in Frankfurt → dauerhafter Sync-Auftrag → HubSpot-Kontakt.

E-Mails und Automatisierungen unterstützen weiterhin ausschließlich `test`. Die CRM-Synchronisierung ist davon unabhängig `live`. Keine Marketing-Abonnements, Workflow-Einschreibungen oder Buchungsbestätigungen werden gesetzt.

## Daten und Wiederholungen

Alle Daten liegen im nicht über die Data API exponierten Schema `g3_leads`. Ein eigener Datenbankbenutzer erhält nur CRUD-Zugriff auf diese Tabellen. RLS ist aktiv; `anon` und `authenticated` haben keinen Schemazugriff. Schema und Policies: `deploy/lead-schema.sql`. Rollenpasswort und Zugangsschlüssel werden separat provisioniert und niemals eingecheckt.

Die Datenbank verwendet den SSL-geschützten Supabase-Transaktionspooler. Der SQLAlchemy-Pool ist für PostgreSQL deaktiviert, Tabellen werden in Produktion nicht automatisch erzeugt. Der Healthcheck prüft eine tatsächliche Datenbankverbindung.

Anfrage, CRM-Auftrag und zwei ungesendete Kommunikationsentwürfe werden atomar gespeichert. Derselbe Idempotenzschlüssel gibt dieselbe Anfragenummer zurück. Ein persistentes globales Limit erlaubt zehn neue Anfragen pro Minute; Wiederholungen einer bereits gespeicherten Anfrage verbrauchen keinen weiteren Platz. Alte Zähler werden nach zwei Tagen gelöscht. Dieser begrenzte globale Schutz ersetzt keinen späteren CAPTCHA-/Bot-Schutz bei erhöhtem Aufkommen.

FastAPI startet die erste Synchronisierung als BackgroundTask nach der Speicherung. Ein minütlicher Supabase-pg_cron-Aufruf über pg_net bearbeitet zusätzlich fällige Aufträge, auch nach Unterbrechung eines Function-Prozesses. Die im bestehenden Worker implementierten Leases und bedingten Statusänderungen verhindern doppelte Übernahme. Nach maximal fünf Versuchen verbleibt ein Fehler zur bewussten Prüfung in der Warteschlange; keine stille Löschung. Der Cron-Zugangsschlüssel liegt in Supabase Vault, nicht im Cron-Kommando.

## HubSpot-Mapping

- E-Mail, Vorname, Nachname und Telefon als Kontaktfelder.
- `g3_anfrage` (Label „G3 Anfrage“, mehrzeiliger Text): Anfragenummer, Quelle, Interesse, Termin-/Uhrzeitwunsch, Erfahrung und Nachricht, plus Hinweis auf noch nicht bestätigten Termin.
- Das Kontaktfeld zeigt den neuesten Anfrage-Snapshot desselben Providers/Modus. Alte Wiederholungen sollen keine älteren Details zurückschreiben. Alle einzelnen Anfragen bleiben unveränderlich in PostgreSQL erhalten.
- HubSpot-Upsert per E-Mail bleibt idempotent; es werden keine zusätzlichen Notizen pro Wiederholung angelegt.

## Konfiguration

Backend: `LEAD_DATABASE_URL` (Pooler, SSL), `LEAD_DATABASE_SCHEMA=g3_leads`, `LEAD_INITIALIZE_SCHEMA=false`, `LEAD_INGEST_KEY`, `LEAD_ADMIN_KEY`, `HUBSPOT_ACCESS_TOKEN`, `HUBSPOT_INQUIRY_PROPERTY=g3_anfrage`, `CRM_SYNC_MODE=live`, `LEAD_AUTOMATION_MODE=test`, `LEAD_PROCESS_ON_SUBMIT=true`.

Frontend: nur serverseitig `LEAD_API_URL` und `LEAD_INGEST_KEY`. Der Admin- und HubSpot-Schlüssel bleiben ausschließlich im Backend. Ohne Backend-Konfiguration zeigt das Formular einen Fehler. Unberechtigter Backend-Ingest und Verwaltung liefern 401; kein öffentliches Lesen von Anfragen.

Backend-Projekt: `g3-leads-api`, Repository-Wurzel, Framework FastAPI, Frankfurt. Frontend-Projekte bleiben auf `website/`, Next.js. Die `pyproject.toml` legt nur für das Backend dessen schlanke Laufzeitabhängigkeiten und den eigenständigen Einstieg fest; die Legacy-Wodify-Anwendung wird nicht gestartet.

## Betriebsgrenzen

Supabase-/Vercel-Kontingente, Verfügbarkeit und Aufbewahrungsregeln müssen zum endgültigen Betrieb passen. Wiederholungsfehler über die geschützte Management-API und Cron-Protokolle prüfen. Es gibt keine grafische Betriebsalarmierung. Kein automatischer Versand und keine Termineintragung. Vor einer späteren Versandfreigabe gesondert Einwilligungen, Empfänger und Vorlagen abnehmen.
