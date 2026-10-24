# Lokale Probetraining-Simulation

Freigegebener Ablauf vom 24.10.2026. Dieses Modul ist **nicht** an den Produktions-Ingest, den Cron oder HubSpot angeschlossen. Es enthält keine Versandfunktion. Die bestehenden zwei Produktionsvorschauen bleiben unverändert.

## Ausführen

Aus dem Repository mit dessen Python-Testumgebung:

```sh
python -m scripts.simulate_trials --output /tmp/g3-trial-review-new
python -m http.server 8766 --bind 127.0.0.1 --directory /tmp/g3-trial-review-new
```

Im Browser `http://127.0.0.1:8766/index.html` öffnen. Das Ausgabeziel muss neu sein; frühere Prüfstände werden nicht überschrieben. Alle Personen und Termine sind synthetisch. Die einzelnen HTML- und Klartextdateien lassen sich auch direkt öffnen. Die Galerie enthält sieben Szenarien, `results.json` die erzeugten Entwürfe und `databases/` je eine isolierte SQLite-Datei mit Ereignissen, Zustand und Vorschauen.

## Manuelle Testereignisse

`TrialSimulation(path).event(event_id, kind, at, **data)` und `.advance(now)` benötigen explizite Datetimes mit UTC-Offset. Eine Datei entspricht einer Anfrage; keine echte Kontaktadresse verwenden. Unterstützte Ereignisse: `inquiry`, `contacted`, `responded`, `confirm`, `reschedule`, `cancel`, `closed`, `converted`, `attended`, `no_show`.

- `inquiry`: `email`, optional `first_name`, `wish_date` (ISO-Datum), `phone`, `experience`, `message`.
- `confirm`/`reschedule`: konkrete `begins` und `ends` mit Offset; Beginn muss zukünftig, Ende nach Beginn liegen. Ein Wunschdatum bestätigt keinen Termin.
- `attended`/`no_show`: explizite Entscheidung nach bestätigtem Ende; keine Ableitung aus Datum oder CRM-Synchronisierung.
- Gleiche Ereignis-ID mit gleichem Inhalt ist wirkungslos; widersprüchliche Wiederverwendung wird abgewiesen. Zeit darf nicht rückwärts laufen. Entwürfe sind durch Schritt und Terminversion eindeutig, auch nach Neustart.

Zeitabstände werden in UTC berechnet, Anzeige in Europe/Berlin. Eine interne Erinnerung entsteht nach 24 Stunden, interne Eskalation bzw. einmalige externe Nachfrage nach 72 Stunden ab Eingang. Externe Nachfrage nur bei persönlicher Kontaktaufnahme, ohne Antwort, ohne bestätigten Termin und ohne abgelaufenes Wunschdatum.

Termin-Erinnerung ab Beginn minus 24 Stunden, solange der Termin noch bevorsteht. Bei kurzfristiger Bestätigung innerhalb der 24 Stunden entfällt sie. Ein verspäteter Prüflauf nach Beginn erzeugt keine veraltete Erinnerung; bei Ausführung am Trainingstag wird nicht „morgen“ behauptet. Feedback frühestens Ende plus 24 Stunden und erst nach expliziter Teilnahme.

Verschiebungen erhöhen die Terminversion und entwerten vorhandene Termin-Entwürfe der alten Version. Absage/Abschluss stoppt weitere Schritte. Antwort stoppt allgemeines Nachfassen, aber keinen weiterhin gültigen bestätigten Termin. Bereits erzeugte Entwürfe bleiben als `superseded` zur Prüfung erhalten; das sind keine versandten Mails.

## Abnahme

```sh
pytest tests/test_trial_simulation.py
pytest
black --check src/leads/trial_simulation.py src/leads/trial_preview.py scripts/simulate_trials.py tests/test_trial_simulation.py
flake8 src tests scripts/simulate_trials.py
```

22 neue Tests, gesamte Python-Suite 99 erfolgreich. Netzwerkzugriff wird in den Isolationstests blockiert; auch bei gesetzten Produktions-/SendGrid-Umgebungsvariablen bleibt die Simulation lokal. Keine Migration und kein Deployment erforderlich. Browserprüfung bestätigt lesbare Testkennzeichnung und Terminbestätigung. Das ist eine Browser-Vorschau, noch kein Renderingtest in Outlook/Gmail.
