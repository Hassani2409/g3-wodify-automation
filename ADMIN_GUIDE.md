# ⚙️ Admin-Handbuch - G3 CrossFit WODIFY Automation

**Erstellt:** 2025-01-27  
**Status:** Phase 5, Woche 13  
**Version:** 1.0  
**Zielgruppe:** System-Administratoren und Entwickler

---

## 📋 Inhaltsverzeichnis

1. [System-Architektur](#system-architektur)
2. [Installation & Setup](#installation--setup)
3. [Konfiguration](#konfiguration)
4. [Deployment](#deployment)
5. [Monitoring & Wartung](#monitoring--wartung)
6. [Troubleshooting](#troubleshooting)
7. [API-Dokumentation](#api-dokumentation)

---

## 🏗️ System-Architektur

### Übersicht

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   WODIFY    │────────▶│   Backend   │────────▶│  SendGrid   │
│   (API)     │◀────────│  (FastAPI)  │◀────────│   (Email)   │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │  PostgreSQL  │
                        │  (Database)  │
                        └─────────────┘
```

### Komponenten

#### Backend (FastAPI)
- **Framework:** FastAPI
- **Sprache:** Python 3.11+
- **Port:** 8000 (Standard)
- **API-Dokumentation:** `/docs` (Swagger UI)

#### Frontend (Next.js)
- **Framework:** Next.js 14+
- **Sprache:** TypeScript
- **Port:** 3000 (Development)

#### Datenbank
- **Development:** SQLite (`g3_wodify.db`)
- **Production:** PostgreSQL (empfohlen)

#### Services
- **E-Mail:** SendGrid API
- **Scheduling:** APScheduler
- **Monitoring:** Sentry (optional)

---

## 🚀 Installation & Setup

### Voraussetzungen

- Python 3.11+
- Node.js 18+ (für Frontend)
- PostgreSQL (für Production)
- Docker & Docker Compose (optional)

### Schritt 1: Repository klonen

```bash
git clone https://github.com/Hassani2409/g3-wodify-automation.git
cd g3-wodify-automation
```

### Schritt 2: Backend-Setup

```bash
# Virtuelle Umgebung erstellen
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Dependencies installieren
pip install -r requirements.txt

# Umgebungsvariablen konfigurieren
cp .env.example .env
nano .env  # Bearbeiten Sie .env mit Ihren Credentials
```

### Schritt 3: Datenbank-Setup

```bash
# Migrationen anwenden
alembic upgrade head

# Optional: Test-Daten laden
python scripts/seed_products.py
```

### Schritt 4: Frontend-Setup

```bash
cd website
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env.local
nano .env.local  # Bearbeiten Sie .env.local
```

### Schritt 5: System starten

**Backend:**
```bash
# Development
python main.py

# Oder mit Uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd website
npm run dev
```

---

## ⚙️ Konfiguration

### Umgebungsvariablen

**Backend (.env):**

```env
# Application
APP_ENV=production
DEBUG=False
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/g3_wodify

# WODIFY
WODIFY_WEBHOOK_SECRET=your_webhook_secret_here
WODIFY_TENANT=g3crossfit

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=info@g3crossfit.com

# G3 CrossFit
G3_PHONE=+49 30 12345678
G3_EMAIL=info@g3crossfit.com
G3_WEBSITE=https://g3-cross-fit-53cc52df.base44.app

# Security
JWT_SECRET_KEY=your-secret-key-min-32-chars-long
```

**Frontend (.env.local):**

```env
NEXT_PUBLIC_API_URL=https://deine-backend-url.com
```

### Feature Flags

**E-Mail-Workflows aktivieren/deaktivieren:**

```env
ENABLE_WELCOME_EMAIL=true
ENABLE_TEAM_NOTIFICATION=true
ENABLE_LEAD_NURTURING=true
```

**E-Mail-Timing anpassen:**

```env
WELCOME_EMAIL_DELAY_MINUTES=5
LEAD_NURTURING_DELAY_HOURS=24
LEAD_FOLLOWUP_DELAY_DAYS=7
```

---

## 🚀 Deployment

### Option 1: Docker Compose (Empfohlen)

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./logs:/app/logs
    restart: always

  frontend:
    build: ./website
    ports:
      - "3000:3000"
    env_file:
      - ./website/.env.local
    depends_on:
      - backend
    restart: always

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: g3_wodify
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres_data:
```

**Deployment:**
```bash
docker-compose up -d
docker-compose logs -f
```

---

### Option 2: VPS (Ubuntu/Debian)

**Systemd Service erstellen:**

```bash
sudo nano /etc/systemd/system/g3-wodify.service
```

```ini
[Unit]
Description=G3 CrossFit WODIFY Automation
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/g3-wodify-automation
Environment="PATH=/home/ubuntu/g3-wodify-automation/venv/bin"
ExecStart=/home/ubuntu/g3-wodify-automation/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

**Service aktivieren:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable g3-wodify
sudo systemctl start g3-wodify
sudo systemctl status g3-wodify
```

---

### Option 3: Cloud Platforms

#### Railway

1. Verbinden Sie GitHub-Repository
2. Railway erkennt Dockerfile automatisch
3. Fügen Sie Umgebungsvariablen hinzu
4. Deploy!

#### Heroku

```bash
heroku create g3-wodify-automation
heroku config:set $(cat .env | xargs)
git push heroku main
```

---

## 📊 Monitoring & Wartung

### Logs anzeigen

**Docker Compose:**
```bash
docker-compose logs -f backend
```

**Systemd:**
```bash
sudo journalctl -u g3-wodify -f
```

**Manuell:**
```bash
tail -f logs/app.log
```

### Health Check

```bash
curl http://localhost:8000/webhooks/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "G3 CrossFit WODIFY Automation",
  "timestamp": "2025-01-27T12:00:00.000000"
}
```

### Datenbank-Backup

**PostgreSQL:**
```bash
pg_dump -U postgres g3_wodify > backup_$(date +%Y%m%d).sql
```

**SQLite:**
```bash
cp g3_wodify.db backup_$(date +%Y%m%d).db
```

### Datenbank-Migrationen

**Neue Migration erstellen:**
```bash
alembic revision --autogenerate -m "description"
```

**Migrationen anwenden:**
```bash
alembic upgrade head
```

**Migrationen zurücksetzen:**
```bash
alembic downgrade -1
```

---

## 🔧 Troubleshooting

### Problem: Backend startet nicht

**Prüfen Sie:**
1. ✅ Python-Version (3.11+)
2. ✅ Dependencies installiert (`pip install -r requirements.txt`)
3. ✅ Umgebungsvariablen konfiguriert (`.env`)
4. ✅ Port 8000 verfügbar

**Lösung:**
```bash
# Logs prüfen
tail -f logs/app.log

# Dependencies neu installieren
pip install -r requirements.txt --force-reinstall

# Port prüfen
netstat -tulpn | grep 8000
```

---

### Problem: Datenbank-Verbindung fehlgeschlagen

**Prüfen Sie:**
1. ✅ `DATABASE_URL` korrekt?
2. ✅ Datenbank läuft?
3. ✅ Berechtigungen korrekt?

**Lösung:**
```bash
# PostgreSQL-Verbindung testen
psql -U postgres -d g3_wodify

# Migrationen prüfen
alembic current

# Migrationen neu anwenden
alembic upgrade head
```

---

### Problem: E-Mails werden nicht versendet

**Prüfen Sie:**
1. ✅ `SENDGRID_API_KEY` korrekt?
2. ✅ Sender-E-Mail verifiziert?
3. ✅ SendGrid-Status prüfen

**Lösung:**
```bash
# SendGrid-Status prüfen
curl -X GET "https://api.sendgrid.com/v3/user/profile" \
  -H "Authorization: Bearer $SENDGRID_API_KEY"

# E-Mail-Logs prüfen
# Im Dashboard → E-Mail-Logs
```

---

### Problem: Webhooks kommen nicht an

**Prüfen Sie:**
1. ✅ Webhook-URL korrekt konfiguriert?
2. ✅ Webhook-Secret korrekt?
3. ✅ Firewall blockiert Webhooks?

**Lösung:**
```bash
# Webhook manuell testen
curl -X POST http://localhost:8000/webhooks/wodify/membership-created \
  -H "Content-Type: application/json" \
  -H "X-Wodify-Signature: ..." \
  -d '{...}'

# Webhook-Logs prüfen
# Im Dashboard → Webhook-Logs
```

---

## 📡 API-Dokumentation

### Endpoints

#### Webhooks

**POST `/webhooks/wodify/membership-created`**
- **Beschreibung:** Empfängt Membership-Created-Webhook von WODIFY
- **Headers:** `X-Wodify-Signature` (HMAC-SHA256)
- **Body:** JSON (siehe `WodifyMembershipCreated`)

**POST `/webhooks/wodify/lead-created`**
- **Beschreibung:** Empfängt Lead-Created-Webhook von WODIFY
- **Headers:** `X-Wodify-Signature` (HMAC-SHA256)
- **Body:** JSON (siehe `WodifyLeadCreated`)

**GET `/webhooks/health`**
- **Beschreibung:** Health-Check-Endpoint
- **Response:** `{"status": "healthy", ...}`

---

#### Admin API

**GET `/api/admin/stats`**
- **Beschreibung:** Statistiken abrufen
- **Auth:** JWT-Token erforderlich
- **Response:** JSON mit Statistiken

**GET `/api/admin/members`**
- **Beschreibung:** Mitglieder-Liste abrufen
- **Auth:** JWT-Token erforderlich
- **Query-Parameter:** `page`, `limit`, `status`

**GET `/api/admin/leads`**
- **Beschreibung:** Leads-Liste abrufen
- **Auth:** JWT-Token erforderlich
- **Query-Parameter:** `page`, `limit`, `state`

---

#### Schedule API

**GET `/api/schedule/classes`**
- **Beschreibung:** Kursplan abrufen
- **Query-Parameter:** `date`, `location_id`
- **Response:** JSON mit Klassen

**POST `/api/schedule/book`**
- **Beschreibung:** Klasse buchen
- **Auth:** JWT-Token erforderlich
- **Body:** `{"class_id": "...", "member_id": "..."}`

---

### API-Dokumentation (Swagger)

**URL:** `http://localhost:8000/docs`

**Features:**
- ✅ Interaktive API-Dokumentation
- ✅ Request/Response-Beispiele
- ✅ Try-it-out-Funktion

---

## 🔒 Sicherheit

### Best Practices

1. ✅ **Secrets:** Niemals in Code committen
2. ✅ **HTTPS:** Immer HTTPS in Production
3. ✅ **Webhook-Signatur:** Immer verifizieren
4. ✅ **Rate Limiting:** Aktiviert
5. ✅ **CORS:** Korrekt konfiguriert
6. ✅ **Input-Validierung:** Pydantic-Models verwenden

### Webhook-Signatur-Verifizierung

**HMAC-SHA256:**
```python
import hmac
import hashlib

signature = hmac.new(
    webhook_secret.encode(),
    request_body.encode(),
    hashlib.sha256
).hexdigest()

if signature != received_signature:
    raise HTTPException(401, "Invalid signature")
```

---

## 📚 Weitere Ressourcen

### Dokumentation

- 📖 **README.md** - Projekt-Übersicht
- 📖 **USER_GUIDE.md** - Benutzerhandbuch
- 📖 **DEPLOYMENT_CHECKLIST.md** - Deployment-Checkliste
- 📖 **UAT_RESULTS.md** - UAT-Ergebnisse

### Externe Ressourcen

- 🔗 **FastAPI:** https://fastapi.tiangolo.com
- 🔗 **SendGrid:** https://docs.sendgrid.com
- 🔗 **WODIFY API:** https://api.wodify.com/docs
- 🔗 **PostgreSQL:** https://www.postgresql.org/docs

---

**Viel Erfolg mit dem System! 🚀**

**Letzte Aktualisierung:** 2025-01-27

