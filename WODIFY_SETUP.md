# WODIFY Setup Guide - Vollständige Konfiguration

**Erstellt:** 2025-01-27  
**Status:** Setup-Anleitung für vollständige WODIFY-Integration

---

## Übersicht

Dieses Dokument beschreibt die vollständige Einrichtung des WODIFY-Zugangs für die G3 CrossFit Automatisierung. Es umfasst API-Zugang, Webhook-Konfiguration und Sales Portal-Integration.

---

## Schritt 1: WODIFY Admin-Zugang erhalten

### 1.1 Admin-Login

1. Öffne https://app.wodify.com
2. Melde dich mit deinem Admin-Account an
3. Stelle sicher, dass du **Vollzugriff** auf alle Bereiche hast:
   - Settings
   - API Access
   - Locations
   - Sales Portal
   - Webhooks

---

## Schritt 2: API-Key generieren

### 2.1 API-Zugang aktivieren

1. Navigiere zu: **Settings → API Access**
2. Falls noch nicht aktiviert, klicke auf **"Enable API Access"**
3. Klicke auf **"Generate API Key"**
4. **WICHTIG:** Kopiere den API Key sofort - er wird nur einmal angezeigt!
5. Speichere den API Key sicher (z.B. in einem Password Manager)

### 2.2 API-Key-Format

Der API-Key hat typischerweise folgendes Format:
```
wod_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2.3 API-Key-Berechtigungen prüfen

Stelle sicher, dass der API-Key folgende Berechtigungen hat:
- ✅ **Read Access** für Classes/Schedule
- ✅ **Read/Write Access** für Bookings
- ✅ **Read Access** für Memberships
- ✅ **Read/Write Access** für Leads
- ✅ **Read Access** für Payments

---

## Schritt 3: Location ID identifizieren

### 3.1 Location ID finden

1. Navigiere zu: **Settings → Locations**
2. Wähle deine Location aus (z.B. "G3 CrossFit Berlin")
3. Die Location ID findest du in der URL oder in den Location-Details
4. Format: `g3crossfit-berlin` oder `g3crossfitberlin`

### 3.2 Location ID bestätigen

Die Location ID wird für folgende API-Calls benötigt:
- Schedule-Abfragen
- Booking-Erstellung
- Membership-Management
- Lead-Erstellung

---

## Schritt 4: Webhook-Secret konfigurieren

### 4.1 Webhook-Zugang einrichten

1. Navigiere zu: **Settings → Integrations → Webhooks**
2. Klicke auf **"Add Webhook"** oder **"Configure Webhooks"**
3. Erstelle einen neuen Webhook-Endpunkt

### 4.2 Webhook-URL konfigurieren

**Development:**
```
http://localhost:8000/webhooks/wodify/membership-created
http://localhost:8000/webhooks/wodify/lead-created
http://localhost:8000/webhooks/wodify/booking-created
```

**Production:**
```
https://deine-backend-url.com/webhooks/wodify/membership-created
https://deine-backend-url.com/webhooks/wodify/lead-created
https://deine-backend-url.com/webhooks/wodify/booking-created
```

### 4.3 Webhook-Events aktivieren

Aktiviere folgende Webhook-Events:
- ✅ **Membership Created** - Wenn ein neues Mitglied erstellt wird
- ✅ **Membership Updated** - Wenn Mitgliedschaft aktualisiert wird
- ✅ **Lead Created** - Wenn ein neuer Lead erstellt wird
- ✅ **Lead Updated** - Wenn Lead aktualisiert wird
- ✅ **Booking Created** - Wenn eine Buchung erstellt wird
- ✅ **Booking Cancelled** - Wenn eine Buchung storniert wird

### 4.4 Webhook-Secret generieren

1. Nach dem Erstellen des Webhooks wird ein **Webhook Secret** generiert
2. Kopiere dieses Secret - es wird für die Signatur-Verifizierung benötigt
3. Format: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Schritt 5: Sales Portal-Zugang einrichten

### 5.1 Sales Portal aktivieren

1. Navigiere zu: **Settings → Sales Portal**
2. Aktiviere das **Sales Portal** für deine Location
3. Konfiguriere die verfügbaren Mitgliedschafts-Pakete

### 5.2 Mitgliedschafts-Pakete konfigurieren

Stelle sicher, dass folgende Pakete konfiguriert sind:
- **Monatlich** - Flexible Mitgliedschaft
- **6 Monate** - Halbjährliche Mitgliedschaft (mit Rabatt)
- **12 Monate** - Jährliche Mitgliedschaft (mit Rabatt)

### 5.3 Sales Portal URL

Die Sales Portal URL hat folgendes Format:
```
https://app.wodify.com/SalesPortal/[LOCATION_ID]
```

Beispiel:
```
https://app.wodify.com/SalesPortal/g3crossfit-berlin
```

### 5.4 Sales Portal API-Zugang

1. Navigiere zu: **Settings → API Access → Sales Portal**
2. Aktiviere **"Enable Sales Portal API"**
3. Notiere die **Sales Portal API Key** (falls separat)

---

## Schritt 6: Environment-Variablen konfigurieren

### 6.1 Backend (.env)

Erstelle eine `.env` Datei im Root-Verzeichnis:

```bash
# WODIFY API Configuration
WODIFY_API_KEY=wod_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WODIFY_API_URL=https://api.wodify.com/v1
WODIFY_LOCATION_ID=g3crossfit-berlin
WODIFY_TENANT=g3crossfit
WODIFY_APP_URL=https://app.wodify.com
WODIFY_SCHEDULE_URL=https://app.wodify.com/Schedule/g3crossfit-berlin

# WODIFY Webhook Configuration
WODIFY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# WODIFY Sales Portal Configuration
WODIFY_SALES_PORTAL_URL=https://app.wodify.com/SalesPortal/g3crossfit-berlin
WODIFY_SALES_PORTAL_API_KEY=wod_sales_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 6.2 Frontend (website/.env.local)

Erstelle eine `website/.env.local` Datei:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# WODIFY Configuration (für Frontend)
NEXT_PUBLIC_WODIFY_SCHEDULE_URL=https://app.wodify.com/Schedule/g3crossfit-berlin
NEXT_PUBLIC_WODIFY_SALES_PORTAL_URL=https://app.wodify.com/SalesPortal/g3crossfit-berlin
```

**Für Production:**
```bash
NEXT_PUBLIC_API_URL=https://deine-backend-url.com
NEXT_PUBLIC_WODIFY_SCHEDULE_URL=https://app.wodify.com/Schedule/g3crossfit-berlin
NEXT_PUBLIC_WODIFY_SALES_PORTAL_URL=https://app.wodify.com/SalesPortal/g3crossfit-berlin
```

---

## Schritt 7: API-Verbindung testen

### 7.1 Backend-Test

```bash
# Starte das Backend
python main.py

# Teste die API-Verbindung
curl http://localhost:8000/api/schedule/classes
```

### 7.2 Webhook-Test

1. Erstelle einen Test-Lead in WODIFY
2. Überprüfe die Logs: `logs/app.log`
3. Überprüfe, ob der Webhook empfangen wurde

### 7.3 Sales Portal-Test

1. Öffne die Sales Portal URL im Browser
2. Überprüfe, ob die Mitgliedschafts-Pakete angezeigt werden
3. Teste den Checkout-Flow (im Test-Modus)

---

## Schritt 8: Konfiguration in settings.py

Die Konfiguration wird automatisch aus den Environment-Variablen geladen:

```python
# config/settings.py
wodify_api_key: Optional[str] = Field(default=None, env="WODIFY_API_KEY")
wodify_api_url: str = Field(default="https://api.wodify.com/v1", env="WODIFY_API_URL")
wodify_location_id: Optional[str] = Field(default=None, env="WODIFY_LOCATION_ID")
wodify_webhook_secret: str = Field(env="WODIFY_WEBHOOK_SECRET")
```

---

## Troubleshooting

### Problem: "WODIFY_API_KEY not found"

**Lösung:**
1. Überprüfe, ob `.env` Datei existiert
2. Überprüfe, ob `WODIFY_API_KEY` korrekt gesetzt ist
3. Starte das Backend neu

### Problem: "Webhook signature verification failed"

**Lösung:**
1. Überprüfe `WODIFY_WEBHOOK_SECRET` in `.env`
2. Stelle sicher, dass das Secret mit dem in WODIFY übereinstimmt
3. Überprüfe die Webhook-URL-Konfiguration

### Problem: "Location ID not found"

**Lösung:**
1. Überprüfe `WODIFY_LOCATION_ID` in `.env`
2. Stelle sicher, dass die Location ID korrekt ist
3. Überprüfe die Location in WODIFY Admin

### Problem: "Sales Portal not accessible"

**Lösung:**
1. Überprüfe, ob Sales Portal in WODIFY aktiviert ist
2. Überprüfe die Sales Portal URL
3. Überprüfe die Berechtigungen des API-Keys

---

## Sicherheitshinweise

1. **Niemals API-Keys committen**
   - Verwende `.env` Dateien (nicht in Git)
   - Verwende `.gitignore` für `.env` Dateien

2. **API-Keys regelmäßig rotieren**
   - Generiere neue Keys alle 90 Tage
   - Aktualisiere die Environment-Variablen

3. **Webhook-Secrets sicher speichern**
   - Verwende einen Password Manager
   - Teile Secrets niemals per E-Mail

4. **Production vs. Development**
   - Verwende separate API-Keys für Production und Development
   - Verwende separate Webhook-Endpunkte

---

## Nächste Schritte

Nach erfolgreicher Konfiguration:

1. ✅ API-Verbindung getestet
2. ✅ Webhooks konfiguriert
3. ✅ Sales Portal aktiviert
4. → Weiter zu: `REQUIREMENTS.md` für Anforderungsanalyse
5. → Weiter zu: `ARCHITECTURE.md` für technische Architektur

---

## Support & Ressourcen

- **WODIFY Support:** support@wodify.com
- **WODIFY API Dokumentation:** (von WODIFY Support anfordern)
- **Projekt-Dokumentation:** Siehe `README.md`

---

**Letzte Aktualisierung:** 2025-01-27

