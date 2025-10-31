# Wodify API Integration - Setup Guide

## 📋 Übersicht

Die G3 CrossFit Website ist jetzt mit der Wodify API verbunden! Kurse werden live aus Wodify geladen und Buchungen werden direkt an Wodify gesendet.

---

## 🔧 Setup-Schritte

### 1. Wodify API-Zugang erhalten

1. **Wodify Admin öffnen:**
   - Gehe zu https://app.wodify.com
   - Melde dich mit deinem Admin-Account an

2. **API-Zugang aktivieren:**
   - Navigiere zu: **Settings → API Access**
   - Klicke auf **"Generate API Key"**
   - Kopiere den API Key (wird nur einmal angezeigt!)

3. **Location ID finden:**
   - Navigiere zu: **Settings → Locations**
   - Kopiere deine Location ID (z.B. `g3crossfit-berlin`)

---

### 2. Environment Variables konfigurieren

#### Backend (.env)

Öffne die `.env` Datei im Root-Verzeichnis und füge hinzu:

```bash
# WODIFY API Configuration
WODIFY_API_KEY=dein_wodify_api_key_hier
WODIFY_API_URL=https://api.wodify.com/v1
WODIFY_LOCATION_ID=deine_location_id_hier
```

#### Frontend (website/.env.local)

Öffne die `website/.env.local` Datei und stelle sicher, dass die Backend-URL korrekt ist:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Für Production:**
```bash
NEXT_PUBLIC_API_URL=https://deine-backend-url.com
```

---

### 3. Backend starten

```bash
# Im Root-Verzeichnis
python main.py
```

Der Backend-Server läuft jetzt auf: **http://localhost:8000**

**API-Dokumentation:** http://localhost:8000/docs

---

### 4. Frontend starten

```bash
# Im website-Verzeichnis
cd website
npm run dev
```

Die Website läuft jetzt auf: **http://localhost:3000**

---

## 📡 API-Endpunkte

### Schedule Endpoints

#### 1. **GET /api/schedule/classes**
Holt alle Kurse aus Wodify

**Query Parameters:**
- `start_date` (optional): Start-Datum (YYYY-MM-DD)
- `end_date` (optional): End-Datum (YYYY-MM-DD)
- `class_type` (optional): Filter nach Kurstyp
- `day` (optional): Filter nach Wochentag

**Beispiel:**
```bash
curl http://localhost:8000/api/schedule/classes?start_date=2024-01-15&end_date=2024-01-22
```

**Response:**
```json
{
  "success": true,
  "classes": [
    {
      "id": "class_123",
      "name": "CrossFit WOD",
      "type": "crossfit",
      "trainer": "Dave",
      "day": "Montag",
      "startTime": "06:00",
      "endTime": "07:00",
      "level": "Alle Level",
      "spotsTotal": 12,
      "spotsBooked": 8,
      "description": "Klassisches CrossFit Training",
      "price": "Mitgliedschaft"
    }
  ],
  "count": 14
}
```

---

#### 2. **GET /api/schedule/classes/{class_id}**
Holt Details zu einem spezifischen Kurs

**Beispiel:**
```bash
curl http://localhost:8000/api/schedule/classes/class_123
```

---

#### 3. **POST /api/schedule/book**
Bucht einen Kurs

**Request Body:**
```json
{
  "class_id": "class_123",
  "user_id": "user_456",
  "user_email": "kunde@example.com",
  "user_name": "Max Mustermann"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Class booked successfully",
  "booking": {
    "booking_id": "booking_789",
    "class_id": "class_123",
    "user_id": "user_456",
    "status": "confirmed"
  }
}
```

---

#### 4. **POST /api/schedule/waitlist**
Fügt User zur Warteliste hinzu

**Request Body:**
```json
{
  "class_id": "class_123",
  "user_id": "user_456",
  "user_email": "kunde@example.com",
  "user_name": "Max Mustermann"
}
```

---

#### 5. **DELETE /api/schedule/bookings/{booking_id}**
Storniert eine Buchung

**Query Parameters:**
- `user_id`: User ID

**Beispiel:**
```bash
curl -X DELETE "http://localhost:8000/api/schedule/bookings/booking_789?user_id=user_456"
```

---

#### 6. **GET /api/schedule/user/{user_id}/bookings**
Holt alle Buchungen eines Users

**Beispiel:**
```bash
curl http://localhost:8000/api/schedule/user/user_456/bookings
```

---

#### 7. **GET /api/schedule/class-types**
Holt alle verfügbaren Kurstypen

---

#### 8. **GET /api/schedule/trainers**
Holt alle Trainer/Coaches

---

## 🔄 Datenfluss

```
┌─────────────────┐
│  Next.js        │
│  Frontend       │
│  (Port 3000)    │
└────────┬────────┘
         │
         │ HTTP Request
         │ (fetch API)
         ▼
┌─────────────────┐
│  FastAPI        │
│  Backend        │
│  (Port 8000)    │
└────────┬────────┘
         │
         │ HTTP Request
         │ (httpx)
         ▼
┌─────────────────┐
│  Wodify API     │
│  (api.wodify.   │
│   com/v1)       │
└─────────────────┘
```

---

## 🧪 Testing

### 1. Backend-Tests

```bash
# API-Dokumentation öffnen
open http://localhost:8000/docs

# Teste GET /api/schedule/classes
curl http://localhost:8000/api/schedule/classes

# Teste POST /api/schedule/book
curl -X POST http://localhost:8000/api/schedule/book \
  -H "Content-Type: application/json" \
  -d '{
    "class_id": "test_class",
    "user_id": "test_user",
    "user_email": "test@example.com",
    "user_name": "Test User"
  }'
```

### 2. Frontend-Tests

1. Öffne http://localhost:3000/schedule
2. Überprüfe, ob Kurse geladen werden
3. Klicke auf einen Kurs → Modal sollte sich öffnen
4. Teste Filter (Tag, Kurstyp, Level, Uhrzeit)

---

## 🚨 Troubleshooting

### Problem: "Failed to fetch courses"

**Lösung:**
1. Überprüfe, ob Backend läuft: `curl http://localhost:8000`
2. Überprüfe CORS-Einstellungen in `main.py`
3. Überprüfe `NEXT_PUBLIC_API_URL` in `website/.env.local`

### Problem: "Wodify API HTTP error: 401"

**Lösung:**
1. Überprüfe `WODIFY_API_KEY` in `.env`
2. Generiere neuen API Key in Wodify Admin
3. Stelle sicher, dass API-Zugang aktiviert ist

### Problem: "Wodify API HTTP error: 404"

**Lösung:**
1. Überprüfe `WODIFY_LOCATION_ID` in `.env`
2. Überprüfe `WODIFY_API_URL` (sollte `https://api.wodify.com/v1` sein)

### Problem: Kurse werden nicht angezeigt

**Lösung:**
1. Öffne Browser DevTools (F12) → Console
2. Suche nach Fehlermeldungen
3. Überprüfe Network-Tab für API-Requests
4. Falls API-Call fehlschlägt, werden Mock-Daten verwendet

---

## 📝 Nächste Schritte

### 1. Authentifizierung implementieren
- [ ] User-Login-System einrichten
- [ ] JWT-Tokens für API-Requests
- [ ] User-Profil mit Buchungshistorie

### 2. Wodify Webhook Integration
- [ ] Webhook-Endpunkt für Buchungs-Updates
- [ ] Automatische Synchronisation bei Änderungen
- [ ] E-Mail-Benachrichtigungen bei Buchungen

### 3. Production Deployment
- [ ] Backend auf Server deployen (z.B. Railway, Render, DigitalOcean)
- [ ] Frontend auf Vercel deployen
- [ ] Environment Variables in Production setzen
- [ ] HTTPS aktivieren
- [ ] CORS für Production-Domain konfigurieren

---

## 📚 Weitere Ressourcen

- **Wodify API Dokumentation:** (Link von Wodify Support erfragen)
- **FastAPI Dokumentation:** https://fastapi.tiangolo.com
- **Next.js Dokumentation:** https://nextjs.org/docs

---

## 🆘 Support

Bei Fragen oder Problemen:
1. Überprüfe die Logs: `logs/app.log`
2. Öffne ein Issue auf GitHub
3. Kontaktiere Wodify Support für API-Fragen

