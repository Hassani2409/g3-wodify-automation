# Test-Skripte - G3 CrossFit WODIFY Automation

Dieses Verzeichnis enthält Test-Skripte für UAT-Tests und Performance-Tests.

## Verfügbare Skripte

### 1. UAT-Tests (`uat_tests.py`)

Führt die UAT-Test-Szenarien 1-6 aus `UAT_RESULTS.md` durch:

- **Szenario 1:** Neues Mitglied registriert sich
- **Szenario 2:** Neuer Lead meldet sich
- **Szenario 3:** Probetraining wird gebucht
- **Szenario 4:** Lead wird zu Mitglied
- **Szenario 5:** Kursplan-Anzeige
- **Szenario 6:** Admin-Dashboard

**Verwendung:**
```bash
# Backend muss laufen!
python scripts/uat_tests.py

# Mit Umgebungsvariablen
API_BASE_URL=http://localhost:8000 WODIFY_WEBHOOK_SECRET=your-secret python scripts/uat_tests.py
```

### 2. Performance-Tests (`performance_tests.py`)

Misst die Response-Zeiten der API-Endpunkte:

- Health-Check-Endpoint
- Schedule-Classes-Endpoint
- Admin-Stats-Endpoint

**Verwendung:**
```bash
# Backend muss laufen!
python scripts/performance_tests.py

# Mit Umgebungsvariablen
API_BASE_URL=http://localhost:8000 python scripts/performance_tests.py
```

### 3. Test-Runner (`run_uat.sh`)

Führt beide Test-Suites automatisch aus:

**Verwendung:**
```bash
./scripts/run_uat.sh
```

Das Skript:
- Prüft, ob das Backend läuft
- Startet das Backend automatisch (falls gewünscht)
- Führt UAT-Tests aus
- Führt Performance-Tests aus
- Zeigt eine Zusammenfassung

## Voraussetzungen

1. **Backend muss laufen:**
   ```bash
   source venv/bin/activate
   python main.py
   ```

2. **Environment-Variablen:**
   - `WODIFY_WEBHOOK_SECRET` (für Webhook-Signaturen)
   - `API_BASE_URL` (optional, Standard: http://localhost:8000)

3. **Python-Pakete:**
   ```bash
   pip install requests
   ```

## Test-Ergebnisse

Die Test-Ergebnisse werden in der Konsole ausgegeben und sollten in `UAT_RESULTS.md` dokumentiert werden.

## Troubleshooting

### Backend nicht erreichbar
- Stelle sicher, dass das Backend läuft: `python main.py`
- Prüfe die URL: `curl http://localhost:8000/webhooks/health`

### Webhook-Tests schlagen fehl
- Prüfe `WODIFY_WEBHOOK_SECRET` in der `.env`-Datei
- Stelle sicher, dass die Webhook-Signatur korrekt berechnet wird

### Performance-Tests zeigen langsame Response-Zeiten
- Prüfe die Backend-Logs auf Fehler
- Prüfe die Datenbank-Performance
- Prüfe externe API-Aufrufe (WODIFY, SendGrid)

