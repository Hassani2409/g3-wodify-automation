# Pre-Deployment Checkliste

## Vor dem Deployment durchgehen

### ✅ Code & Tests
- [ ] Alle Tests bestehen: `pytest tests/ -v`
- [ ] Frontend-Build erfolgreich: `cd website && npm run build`
- [ ] Code-Review abgeschlossen
- [ ] Alle kritischen Bugs behoben

### ✅ Konfiguration
- [ ] `.env` Datei erstellt aus `.env.example`
- [ ] `JWT_SECRET_KEY` geändert (mindestens 32 Zeichen, NICHT der Default!)
- [ ] `WODIFY_WEBHOOK_SECRET` konfiguriert
- [ ] `SENDGRID_API_KEY` verifiziert
- [ ] `SENDGRID_FROM_EMAIL` verifiziert
- [ ] `DATABASE_URL` für Production konfiguriert (PostgreSQL empfohlen)
- [ ] `APP_ENV=production` gesetzt
- [ ] `DEBUG=False` gesetzt

### ✅ Datenbank
- [ ] PostgreSQL-Datenbank erstellt (für Production)
- [ ] Migrationen angewendet: `alembic upgrade head`
- [ ] Backup-Strategie definiert
- [ ] Datenbank-Berechtigungen korrekt

### ✅ WODIFY-Integration
- [ ] WODIFY-Webhook-URLs konfiguriert:
  - [ ] Membership Created: `https://deine-domain.com/webhooks/wodify/membership-created`
  - [ ] Lead Created: `https://deine-domain.com/webhooks/wodify/lead-created`
  - [ ] Class Booked: `https://deine-domain.com/webhooks/wodify/class-booked`
- [ ] Webhook-Secret in WODIFY Admin gesetzt
- [ ] Webhook-Signatur-Verifizierung getestet
- [ ] Test-Webhook erfolgreich gesendet

### ✅ SendGrid
- [ ] SendGrid-API-Key erstellt
- [ ] Sender-E-Mail oder Domain verifiziert
- [ ] E-Mail-Templates getestet
- [ ] Test-E-Mail versendet
- [ ] SPF/DKIM konfiguriert (falls Domain verwendet)

### ✅ Frontend
- [ ] `website/.env.local` mit Production-API-URL
- [ ] `NEXT_PUBLIC_API_URL` korrekt gesetzt
- [ ] Build erfolgreich: `cd website && npm run build`
- [ ] Alle Links funktionieren
- [ ] Mobile-Responsive getestet
- [ ] SEO-Meta-Tags korrekt

### ✅ Sicherheit
- [ ] `.env` in `.gitignore` enthalten ✅
- [ ] `JWT_SECRET_KEY` mindestens 32 Zeichen lang
- [ ] HTTPS aktiviert (für Production)
- [ ] CORS korrekt konfiguriert
- [ ] Rate Limiting aktiv
- [ ] Firewall-Regeln konfiguriert (falls VPS)

### ✅ Monitoring
- [ ] Sentry DSN konfiguriert (optional)
- [ ] Logs-Verzeichnis beschreibbar
- [ ] Log-Rotation konfiguriert
- [ ] Monitoring-Tools eingerichtet
- [ ] Alerting konfiguriert
- [ ] Health-Check-Endpoint getestet

### ✅ Dokumentation
- [ ] README.md aktualisiert
- [ ] USER_GUIDE.md vorhanden
- [ ] ADMIN_GUIDE.md vorhanden
- [ ] FAQ.md vorhanden
- [ ] Deployment-Anleitung vorhanden

---

## Deployment-Schritte

### 1. Deployment-Skript ausführen
```bash
./scripts/deploy.sh
```

### 2. System Review durchführen
```bash
python scripts/review_system.py
```

### 3. Manuelle Tests
- Frontend-Seiten im Browser öffnen
- Funktionen testen
- Mobile-Ansicht prüfen

### 4. Integrationstests
```bash
python scripts/uat_tests.py
python scripts/performance_tests.py
```

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

**Viel Erfolg beim Deployment! 🚀**

