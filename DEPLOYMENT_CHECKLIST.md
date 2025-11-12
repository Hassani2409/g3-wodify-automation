# ✅ Deployment-Checkliste

## Vor dem Deployment

### 1. Umgebungsvariablen prüfen

- [ ] `.env` Datei mit echten Production-Werten gefüllt
- [ ] `JWT_SECRET_KEY` geändert (nicht der Default!)
- [ ] `WODIFY_WEBHOOK_SECRET` konfiguriert
- [ ] `SENDGRID_API_KEY` verifiziert
- [ ] `SENDGRID_FROM_EMAIL` verifiziert
- [ ] `DATABASE_URL` für Production konfiguriert (PostgreSQL empfohlen)
- [ ] `APP_ENV=production` gesetzt
- [ ] `DEBUG=False` gesetzt

### 2. Sicherheit

- [ ] Alle Secrets aus `.env` entfernt (nur in Production-Umgebung)
- [ ] `.env` in `.gitignore` enthalten ✅
- [ ] JWT_SECRET_KEY mindestens 32 Zeichen lang
- [ ] HTTPS aktiviert
- [ ] CORS korrekt konfiguriert
- [ ] Rate Limiting aktiv

### 3. Datenbank

- [ ] PostgreSQL-Datenbank erstellt
- [ ] Migrationen angewendet: `alembic upgrade head`
- [ ] Backup-Strategie definiert
- [ ] Datenbank-Berechtigungen korrekt

### 4. WODIFY-Integration

- [ ] WODIFY-Webhook-URLs konfiguriert:
  - Membership Created: `https://deine-domain.com/webhooks/wodify/membership-created`
  - Lead Created: `https://deine-domain.com/webhooks/wodify/lead-created`
- [ ] Webhook-Secret in WODIFY Admin gesetzt
- [ ] Webhook-Signatur-Verifizierung getestet

### 5. SendGrid

- [ ] SendGrid-API-Key erstellt
- [ ] Sender-E-Mail oder Domain verifiziert
- [ ] E-Mail-Templates getestet
- [ ] Test-E-Mail versendet

### 6. Frontend

- [ ] `website/.env.local` mit Production-API-URL
- [ ] `NEXT_PUBLIC_API_URL` korrekt gesetzt
- [ ] Build erfolgreich: `npm run build`
- [ ] Alle Links funktionieren

### 7. Tests

- [ ] Alle Tests bestehen: `pytest tests/ -v`
- [ ] Frontend-Build erfolgreich
- [ ] Docker-Image getestet
- [ ] Health-Check funktioniert

### 8. Monitoring

- [ ] Sentry DSN konfiguriert (optional)
- [ ] Logs-Verzeichnis beschreibbar
- [ ] Log-Rotation konfiguriert
- [ ] Monitoring-Tools eingerichtet

### 9. CI/CD

- [ ] GitHub-Secrets konfiguriert
- [ ] CI-Workflows laufen erfolgreich
- [ ] Deployment-Workflow getestet

### 10. Dokumentation

- [ ] README.md aktualisiert
- [ ] API-Dokumentation verfügbar
- [ ] Deployment-Anleitung vorhanden

---

## Deployment-Optionen

### Option 1: Docker Compose (Empfohlen)

```bash
# Auf Server
git clone https://github.com/Hassani2409/g3-wodify-automation.git
cd g3-wodify-automation

# .env konfigurieren
nano .env

# Starten
docker-compose up -d

# Logs prüfen
docker-compose logs -f
```

### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend:**
1. Verbinde GitHub-Repository mit Vercel
2. Root-Verzeichnis: `website`
3. Environment Variables setzen
4. Deploy!

**Backend:**
1. Verbinde GitHub-Repository mit Railway
2. Railway erkennt Dockerfile automatisch
3. Environment Variables setzen
4. Deploy!

### Option 3: Eigenes VPS

Siehe `README.md` → Deployment → Option 1: VPS

---

## Nach dem Deployment

- [ ] Health-Check testen: `curl https://deine-domain.com/webhooks/health`
- [ ] Admin-Dashboard erreichbar: `https://deine-domain.com/admin/`
- [ ] API-Docs erreichbar: `https://deine-domain.com/docs`
- [ ] Frontend erreichbar: `https://deine-frontend-domain.com`
- [ ] Test-Webhook senden
- [ ] Test-Login durchführen
- [ ] E-Mail-Versand testen
- [ ] Logs prüfen

---

## Rollback-Plan

Falls etwas schiefgeht:

```bash
# Docker Compose
docker-compose down
docker-compose up -d --scale app=0  # Stoppe App
# Alte Version deployen
docker-compose up -d

# Git Rollback
git checkout <previous-commit>
git push origin main --force  # Vorsicht!
```

---

## Support & Troubleshooting

- **Logs prüfen**: `docker-compose logs -f app`
- **Health-Check**: `curl https://deine-domain.com/webhooks/health`
- **Datenbank prüfen**: `alembic current`
- **CI/CD-Status**: GitHub → Actions

---

**Viel Erfolg beim Deployment! 🚀**

