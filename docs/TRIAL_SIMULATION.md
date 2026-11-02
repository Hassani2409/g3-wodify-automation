# Lokale Probetraining-Simulation

Freigegebener Ablauf vom 24.10.2026. Dieses Modul ist **nicht** an den Produktions-Ingest, den Cron oder HubSpot angeschlossen. Es enthält keine Versandfunktion. Die bestehenden zwei Produktionsvorschauen bleiben unverändert.

## Ausführen

Aus dem Repository mit dessen Python-Testumgebung:

```sh
python -m scripts.simulate_trials --output /tmp/g3-trial-review-new
python -m http.server 8766 --bind 127.0.0.1 --directory /tmp/g3-trial-review-new
```

Im Browser `http://127.0.0.1:8766/index.html` öffnen. Das Ausgabeziel muss neu sein; frühere Prüfstände werden nicht überschrieben. Alle Personen und Termine sind synthetisch. Die einzelnen HTML- und Klartextdateien lassen sich auch direkt öffnen. Die Galerie enthält zwölf Szenarien (zehn Probetraining, zwei Reaktivierung), `results.json` die erzeugten Entwürfe und `databases/` je eine isolierte SQLite-Datei mit Ereignissen, Zustand und Vorschauen.

## Manuelle Testereignisse

`TrialSimulation(path).event(event_id, kind, at, **data)` und `.advance(now)` benötigen explizite Datetimes mit UTC-Offset. Eine Datei entspricht einer Anfrage; keine echte Kontaktadresse verwenden. Unterstützte Ereignisse: `inquiry`, `contacted`, `responded`, `confirm`, `reschedule`, `declined`, `cancel`, `closed`, `converted`, `attended`, `no_show`, `feedback_received`.

- `inquiry`: `email`, optional `first_name`, `wish_date` (ISO-Datum), `phone`, `experience`, `message`.
- `confirm`/`reschedule`: konkrete `begins` und `ends` mit Offset; Beginn muss zukünftig, Ende nach Beginn liegen. Ein Wunschdatum bestätigt keinen Termin.
- `attended`/`no_show`: explizite Entscheidung nach bestätigtem Ende; keine Ableitung aus Datum oder CRM-Synchronisierung.
- Gleiche Ereignis-ID mit gleichem Inhalt ist wirkungslos; widersprüchliche Wiederverwendung wird abgewiesen. Zeit darf nicht rückwärts laufen. Entwürfe sind durch Schritt und Terminversion eindeutig, auch nach Neustart.

Zeitabstände werden in UTC berechnet, Anzeige in Europe/Berlin. Eine interne Erinnerung entsteht nach 24 Stunden, interne Eskalation bzw. einmalige externe Nachfrage nach 72 Stunden ab Eingang. Externe Nachfrage nur bei persönlicher Kontaktaufnahme, ohne Antwort, ohne bestätigten Termin und ohne abgelaufenes Wunschdatum.

Termin-Erinnerung ab Beginn minus 24 Stunden, solange der Termin noch bevorsteht. Bei kurzfristiger Bestätigung innerhalb der 24 Stunden entfällt sie. Ein verspäteter Prüflauf nach Beginn erzeugt keine veraltete Erinnerung; bei Ausführung am Trainingstag wird nicht „morgen“ behauptet. Feedback frühestens Ende plus 24 Stunden und erst nach expliziter Teilnahme.

Verschiebungen erhöhen die Terminversion und entwerten vorhandene Termin-Entwürfe der alten Version. Absage/Abschluss stoppt weitere Schritte. Antwort stoppt allgemeines Nachfassen, aber keinen weiterhin gültigen bestätigten Termin. Bereits erzeugte Entwürfe bleiben als `superseded` zur Prüfung erhalten; das sind keine versandten Mails.

## Erweiterte Abläufe (02.11.2026)

- **Ja/Nein vor dem Termin:** Die Erinnerung bittet um eine kurze Antwort mit JA oder NEIN. Die Antwort wird nicht automatisch ausgewertet; das Team trägt ein NEIN als `declined` ein (nur vor Beginn). Das entwertet die Termin-Entwürfe und erzeugt einen Entwurf „neuen Termin anbieten“ plus internen Hinweis. Ein danach bestätigter Termin (`confirm`) startet den Termin-Ablauf mit neuer Version.
- **Nicht erschienen:** `no_show` erzeugt eine einmalige, freundliche Nachfrage und einen internen Hinweis. Absage/Abschluss entwertet beides.
- **Feedback und Bewertung:** Die Feedback-Mail fragt nach einer Zahl von 1 bis 5. `feedback_received` (`rating` 1–5, optional `comment`) ist erst nach der Feedback-Anfrage und nur einmal möglich. Bei konfiguriertem `TrialSimulation(path, review_url=...)` (nur HTTPS) erhält **jede** Rückmeldung unabhängig von der Bewertung dieselbe freiwillige Bitte um eine Google-Bewertung – kein Review-Gating. Bewertungen bis 3 erzeugen zusätzlich einen internen Hinweis. Ohne Link entsteht keine Bewertungsbitte. Der echte Google-Bewertungslink von G3 ist noch nicht hinterlegt; die Demo nutzt einen Platzhalter unter `example.invalid`.

## Reaktivierung ehemaliger Mitglieder

`ReactivationSimulation(path)` in `src/leads/reactivation_simulation.py`, eine Datei pro ehemaligem Mitglied, gleiche Regeln für Ereignis-IDs und Zeit. Ereignisse: `membership_ended` (`email`, optional `first_name`; Zeitpunkt = Ende), danach `rejoined`, `opted_out` oder `responded` als Stopp.

- Erste Nachricht ab Ende plus 30 Tagen, sofern noch keine 90 Tage vergangen sind; ein sehr später Prüflauf erzeugt keine veraltete Nachricht.
- Letzte Nachricht ab Ende plus 90 Tagen und frühestens 30 Tage nach der ersten. Danach keine weiteren Nachrichten.
- Jede Nachricht enthält den Hinweis auf das jederzeitige Widerspruchsrecht. Ein Stopp-Ereignis entwertet alle offenen Entwürfe.
- **Offene Frage vor jedem Live-Betrieb:** G3 muss prüfen, ob die Voraussetzungen für Werbe-E-Mails an Bestandskunden (§ 7 Abs. 3 UWG) erfüllt sind, insbesondere der Widerspruchshinweis bereits bei Erhebung der Adresse, oder eine ausdrückliche Einwilligung vorliegt. Keine Anrufe an ehemalige Mitglieder ohne ausdrückliche Einwilligung. Rechtlich prüfen lassen.

## Abnahme

```sh
pytest tests/test_trial_simulation.py tests/test_reactivation_simulation.py
pytest
black --check src/leads/trial_simulation.py src/leads/trial_preview.py src/leads/reactivation_simulation.py scripts/simulate_trials.py tests/test_trial_simulation.py tests/test_reactivation_simulation.py
flake8 src tests scripts/simulate_trials.py
```

Stand 02.11.2026: 42 Simulationstests, gesamte Python-Suite 119 erfolgreich. Netzwerkzugriff wird in den Isolationstests blockiert; auch bei gesetzten Produktions-/SendGrid-Umgebungsvariablen bleibt die Simulation lokal. Keine Migration und kein Deployment erforderlich. Browserprüfung bestätigt lesbare Testkennzeichnung und Terminbestätigung. Das ist eine Browser-Vorschau, noch kein Renderingtest in Outlook/Gmail.
