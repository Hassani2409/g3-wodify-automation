# ⚡ Quick Start Guide

## 🚀 Schnellstart in 5 Minuten

### 1. Setup ausführen

```bash
# Führe das Setup-Script aus
./setup.sh
```

Das Script:
- ✅ Erstellt virtuelle Umgebung
- ✅ Installiert alle Dependencies
- ✅ Erstellt .env Dateien
- ✅ Richtet alles ein

### 2. Umgebungsvariablen konfigurieren

```bash
# Backend
nano .env
# Füge mindestens hinzu:
# - WODIFY_WEBHOOK_SECRET
# - SENDGRID_API_KEY
# - JWT_SECRET_KEY

# Frontend
nano website/.env.local
# Setze:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Backend starten

```bash
source venv/bin/activate
python main.py
```

✅ Backend läuft auf: http://localhost:8000

### 4. Frontend starten (neues Terminal)

```bash
cd website
npm run dev
```

✅ Frontend läuft auf: http://localhost:3000

### 5. Testen

- **API-Docs**: http://localhost:8000/docs
- **Admin Dashboard**: http://localhost:8000/admin/
- **Login**: http://localhost:3000/login

---

## 🐳 Mit Docker

```bash
# Build
docker build -t g3-wodify-automation .

# Run
docker run -d \
  --name g3-wodify \
  -p 8000:8000 \
  --env-file .env \
  g3-wodify-automation

# Oder mit docker-compose
docker-compose up -d
```

---

## 📚 Weitere Informationen

- **NEXT_STEPS.md** - Detaillierte Anleitung
- **README.md** - Vollständige Dokumentation
- **CI_CD_GUIDE.md** - CI/CD-Setup

