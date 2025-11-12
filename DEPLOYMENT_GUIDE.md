# 🚀 Deployment-Anleitung - G3 CrossFit WODIFY Automation

## Übersicht

Diese Anleitung führt Sie durch den Deployment-Prozess für die G3 CrossFit WODIFY Automation.

## Schnellstart

### 1. Vorbereitung

```bash
# Repository klonen (falls noch nicht geschehen)
git clone <repository-url>
cd g3-wodify-automation

# .env Datei erstellen
cp .env.example .env
nano .env  # Bearbeite die Werte
```

### 2. Deployment-Skript ausführen

```bash
# Deployment-Vorbereitung
./scripts/deploy.sh
```

Das Skript:
- ✅ Prüft Voraussetzungen
- ✅ Führt Tests aus
- ✅ Baut Frontend
- ✅ Wendet Datenbank-Migrationen an
- ✅ Baut Docker-Image (optional)

### 3. System Review durchführen

```bash
# Systematische Überprüfung aller Komponenten
python scripts/review_system.py
```

### 4. System starten

**Development:**
```bash
# Terminal 1: Backend
source venv/bin/activate
python main.py

# Terminal 2: Frontend
cd website
npm run dev
```

**Production (Docker):**
```bash
docker-compose up -d
```

---

## Detaillierte Schritte

### Schritt 1: Environment-Variablen konfigurieren

1. Kopiere `.env.example` zu `.env`:
   ```bash
   cp .env.example .env
   ```

2. Bearbeite `.env` und setze folgende Werte:
   - `WODIFY_WEBHOOK_SECRET` - Webhook-Secret von WODIFY
   - `SENDGRID_API_KEY` - SendGrid API-Key
   - `JWT_SECRET_KEY` - Mindestens 32 Zeichen (NICHT der Default!)
   - `DATABASE_URL` - PostgreSQL für Production
   - `APP_ENV=production` - Für Production
   - `DEBUG=False` - Für Production

### Schritt 2: Datenbank einrichten

**Development (SQLite):**
```bash
# Automatisch beim ersten Start
```

**Production (PostgreSQL):**
```bash
# Datenbank erstellen
createdb g3_wodify

# Migrationen anwenden
alembic upgrade head
```

### Schritt 3: Frontend konfigurieren

```bash
cd website

# .env.local erstellen
echo "NEXT_PUBLIC_API_URL=https://deine-backend-url.com" > .env.local

# Dependencies installieren
npm install

# Build
npm run build
```

### Schritt 4: WODIFY-Webhooks konfigurieren

1. Gehe zu WODIFY Admin → Webhooks
2. Konfiguriere folgende Webhooks:
   - **Membership Created**: `https://deine-domain.com/webhooks/wodify/membership-created`
   - **Lead Created**: `https://deine-domain.com/webhooks/wodify/lead-created`
   - **Class Booked**: `https://deine-domain.com/webhooks/wodify/class-booked`
3. Setze das Webhook-Secret in WODIFY Admin
4. Setze das gleiche Secret in `.env` als `WODIFY_WEBHOOK_SECRET`

### Schritt 5: SendGrid konfigurieren

1. Erstelle SendGrid API-Key
2. Verifiziere Sender-E-Mail oder Domain
3. Setze `SENDGRID_API_KEY` in `.env`
4. Teste E-Mail-Versand:
   ```bash
   python -c "from src.services.email_service import email_service; email_service.send_test_email()"
   ```

---

## Deployment-Optionen

### Option 1: Docker Compose (Empfohlen)

```bash
# Build und Start
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Stoppen
docker-compose down
```

### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
1. Verbinde GitHub-Repository mit Vercel
2. Root-Verzeichnis: `website`
3. Environment Variables:
   - `NEXT_PUBLIC_API_URL=https://deine-backend-url.com`
4. Deploy!

**Backend (Railway):**
1. Verbinde GitHub-Repository mit Railway
2. Railway erkennt Dockerfile automatisch
3. Environment Variables aus `.env` setzen
4. Deploy!

### Option 3: Eigenes VPS

```bash
# Auf Server
git clone <repository-url>
cd g3-wodify-automation

# .env konfigurieren
nano .env

# Docker Compose starten
docker-compose up -d

# Nginx konfigurieren (für HTTPS)
# Siehe: nginx.conf.example
```

---

## Post-Deployment Checkliste

Nach dem Deployment:

- [ ] Health-Check: `curl https://deine-domain.com/webhooks/health`
- [ ] Admin-Dashboard: `https://deine-domain.com/admin/`
- [ ] API-Docs: `https://deine-domain.com/docs`
- [ ] Frontend: `https://deine-frontend-domain.com`
- [ ] Test-Webhook senden
- [ ] Test-Login durchführen
- [ ] E-Mail-Versand testen
- [ ] Logs prüfen

---

## System Review durchführen

Nach dem Deployment sollte ein systematisches Review durchgeführt werden:

```bash
# Automatisches Review
python scripts/review_system.py

# Manuelle Tests
python scripts/uat_tests.py
python scripts/performance_tests.py
```

Das Review-Skript prüft:
- ✅ Backend API-Endpunkte
- ✅ Frontend-Seiten
- ✅ Webhook-Endpunkte
- ✅ Datenbank-Verbindung
- ✅ E-Mail-Service
- ✅ Sicherheitskonfiguration

---

## Troubleshooting

### Backend startet nicht
- Prüfe `.env` Datei
- Prüfe Logs: `docker-compose logs app`
- Prüfe Datenbank-Verbindung

### Frontend zeigt Fehler
- Prüfe `NEXT_PUBLIC_API_URL` in `website/.env.local`
- Prüfe Backend-Verfügbarkeit
- Prüfe Browser-Konsole

### Webhooks funktionieren nicht
- Prüfe Webhook-URLs in WODIFY
- Prüfe `WODIFY_WEBHOOK_SECRET`
- Prüfe Webhook-Logs im Admin-Dashboard

### E-Mails werden nicht versendet
- Prüfe `SENDGRID_API_KEY`
- Prüfe E-Mail-Logs im Admin-Dashboard
- Prüfe SendGrid-Dashboard

---

## Rollback

Falls etwas schiefgeht:

```bash
# Docker Compose
docker-compose down
git checkout <previous-commit>
docker-compose up -d

# Git Rollback (Vorsicht!)
git checkout <previous-commit>
git push origin main --force
```

---

## Support

Bei Problemen:
1. Prüfe Logs: `docker-compose logs -f`
2. Prüfe Health-Check: `curl https://deine-domain.com/webhooks/health`
3. Prüfe Admin-Dashboard für Statistiken
4. Siehe `TROUBLESHOOTING.md` für häufige Probleme

---

**Viel Erfolg beim Deployment! 🚀**

