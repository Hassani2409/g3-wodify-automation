# 🚀 Go-Live-Checkliste - G3 CrossFit WODIFY Automation

**Erstellt:** 2025-01-27  
**Status:** Phase 5, Woche 14  
**Go-Live-Datum:** 01.01.2026

---

## ✅ Pre-Launch Checkliste

### 1. Code & Tests

- [ ] ✅ Alle Tests bestehen (`pytest tests/ -v`)
- [ ] ✅ Frontend-Build erfolgreich (`npm run build`)
- [ ] ✅ Code-Review abgeschlossen
- [ ] ✅ Alle kritischen Bugs behoben
- [ ] ✅ UAT erfolgreich abgeschlossen
- [ ] ✅ Performance-Tests bestanden

---

### 2. Konfiguration

- [ ] ✅ `.env` mit Production-Werten konfiguriert
- [ ] ✅ `JWT_SECRET_KEY` geändert (nicht Default!)
- [ ] ✅ `WODIFY_WEBHOOK_SECRET` konfiguriert
- [ ] ✅ `SENDGRID_API_KEY` verifiziert
- [ ] ✅ `SENDGRID_FROM_EMAIL` verifiziert
- [ ] ✅ `DATABASE_URL` für Production konfiguriert
- [ ] ✅ `APP_ENV=production` gesetzt
- [ ] ✅ `DEBUG=False` gesetzt
- [ ] ✅ Alle Feature Flags konfiguriert

---

### 3. Datenbank

- [ ] ✅ PostgreSQL-Datenbank erstellt
- [ ] ✅ Migrationen angewendet (`alembic upgrade head`)
- [ ] ✅ Backup-Strategie definiert
- [ ] ✅ Datenbank-Berechtigungen korrekt
- [ ] ✅ Datenbank-Backup getestet

---

### 4. WODIFY-Integration

- [ ] ✅ WODIFY-Webhook-URLs konfiguriert:
  - [ ] Membership Created: `https://deine-domain.com/webhooks/wodify/membership-created`
  - [ ] Lead Created: `https://deine-domain.com/webhooks/wodify/lead-created`
  - [ ] Class Booked: `https://deine-domain.com/webhooks/wodify/class-booked`
- [ ] ✅ Webhook-Secret in WODIFY Admin gesetzt
- [ ] ✅ Webhook-Signatur-Verifizierung getestet
- [ ] ✅ Test-Webhook erfolgreich gesendet

---

### 5. SendGrid

- [ ] ✅ SendGrid-API-Key erstellt
- [ ] ✅ Sender-E-Mail oder Domain verifiziert
- [ ] ✅ E-Mail-Templates getestet
- [ ] ✅ Test-E-Mail versendet
- [ ] ✅ SPF/DKIM konfiguriert
- [ ] ✅ Domain-Verifizierung abgeschlossen

---

### 6. Frontend

- [ ] ✅ `website/.env.local` mit Production-API-URL
- [ ] ✅ `NEXT_PUBLIC_API_URL` korrekt gesetzt
- [ ] ✅ Build erfolgreich (`npm run build`)
- [ ] ✅ Alle Links funktionieren
- [ ] ✅ Mobile-Responsive getestet
- [ ] ✅ SEO-Meta-Tags korrekt

---

### 7. Sicherheit

- [ ] ✅ Alle Secrets aus `.env` entfernt (nur in Production)
- [ ] ✅ `.env` in `.gitignore` enthalten
- [ ] ✅ `JWT_SECRET_KEY` mindestens 32 Zeichen lang
- [ ] ✅ HTTPS aktiviert
- [ ] ✅ CORS korrekt konfiguriert
- [ ] ✅ Rate Limiting aktiv
- [ ] ✅ Firewall-Regeln konfiguriert

---

### 8. Monitoring

- [ ] ✅ Sentry DSN konfiguriert (optional)
- [ ] ✅ Logs-Verzeichnis beschreibbar
- [ ] ✅ Log-Rotation konfiguriert
- [ ] ✅ Monitoring-Tools eingerichtet
- [ ] ✅ Alerting konfiguriert
- [ ] ✅ Health-Check-Endpoint getestet

---

### 9. CI/CD

- [ ] ✅ GitHub-Secrets konfiguriert
- [ ] ✅ CI-Workflows laufen erfolgreich
- [ ] ✅ Deployment-Workflow getestet
- [ ] ✅ Rollback-Plan definiert

---

### 10. Dokumentation

- [ ] ✅ README.md aktualisiert
- [ ] ✅ USER_GUIDE.md erstellt
- [ ] ✅ ADMIN_GUIDE.md erstellt
- [ ] ✅ FAQ.md erstellt
- [ ] ✅ TEAM_TRAINING.md erstellt
- [ ] ✅ Deployment-Anleitung vorhanden

---

## 🚀 Launch-Tag Checkliste

### Vor dem Go-Live (T-1 Tag)

- [ ] ✅ Finale Tests durchgeführt
- [ ] ✅ System Review durchgeführt: `python scripts/review_system.py`
- [ ] ✅ UAT-Tests durchgeführt: `python scripts/uat_tests.py`
- [ ] ✅ Performance-Tests durchgeführt: `python scripts/performance_tests.py`
- [ ] ✅ Team-Schulung abgeschlossen
- [ ] ✅ Support-Bereitschaft organisiert
- [ ] ✅ Rollback-Plan bereit
- [ ] ✅ Backup erstellt

---

### Go-Live (T-0)

#### Schritt 1: Deployment

- [ ] ✅ Code zu Production-Branch gepusht
- [ ] ✅ CI/CD-Pipeline erfolgreich
- [ ] ✅ Deployment erfolgreich
- [ ] ✅ Services gestartet

#### Schritt 2: Verifizierung

- [ ] ✅ Health-Check erfolgreich: `curl https://deine-domain.com/webhooks/health`
- [ ] ✅ Frontend erreichbar: `https://deine-frontend-domain.com`
- [ ] ✅ Admin-Dashboard erreichbar: `https://deine-domain.com/dashboard`
- [ ] ✅ API-Docs erreichbar: `https://deine-domain.com/docs`

#### Schritt 3: Integrationstests

- [ ] ✅ Test-Webhook gesendet
- [ ] ✅ Test-Login durchgeführt
- [ ] ✅ Test-E-Mail versendet
- [ ] ✅ Datenbank-Verbindung getestet

#### Schritt 4: Monitoring

- [ ] ✅ Logs werden geschrieben
- [ ] ✅ Monitoring-Tools zeigen Daten
- [ ] ✅ Keine kritischen Fehler in Logs
- [ ] ✅ Performance-Metriken normal

---

### Nach dem Go-Live (T+1 Tag)

- [ ] ✅ System läuft stabil
- [ ] ✅ Keine kritischen Fehler
- [ ] ✅ E-Mails werden versendet
- [ ] ✅ Webhooks funktionieren
- [ ] ✅ Team-Feedback eingeholt

---

## 🔄 Rollback-Plan

### Wenn etwas schiefgeht:

#### Option 1: Docker Compose

```bash
# Services stoppen
docker-compose down

# Alte Version deployen
git checkout <previous-commit>
docker-compose up -d

# Logs prüfen
docker-compose logs -f
```

#### Option 2: Systemd Service

```bash
# Service stoppen
sudo systemctl stop g3-wodify

# Alte Version deployen
git checkout <previous-commit>
sudo systemctl start g3-wodify

# Status prüfen
sudo systemctl status g3-wodify
```

#### Option 3: Datenbank-Rollback

```bash
# Migration zurücksetzen
alembic downgrade -1

# Oder Backup wiederherstellen
psql -U postgres g3_wodify < backup_YYYYMMDD.sql
```

---

## 📊 Post-Launch-Monitoring

### Erste 24 Stunden

**Alle 2 Stunden prüfen:**
- [ ] ✅ System-Status (Health-Check)
- [ ] ✅ Error-Logs
- [ ] ✅ E-Mail-Versand-Rate
- [ ] ✅ Webhook-Empfangs-Rate
- [ ] ✅ Performance-Metriken

**Metriken:**
- 📊 API-Response-Zeit
- 📊 E-Mail-Versand-Zeit
- 📊 Webhook-Verarbeitungs-Zeit
- 📊 Error-Rate
- 📊 System-Uptime

---

### Erste Woche

**Täglich prüfen:**
- [ ] ✅ System-Status
- [ ] ✅ Error-Logs
- [ ] ✅ Statistiken
- [ ] ✅ Team-Feedback

**Wöchentlicher Report:**
- 📊 Neue Mitglieder
- 📊 Neue Leads
- 📊 Conversion-Rate
- 📊 E-Mail-Versand-Statistiken
- 📊 System-Performance

---

## 🆘 Support-Bereitschaft

### Go-Live-Tag

**Support-Team:**
- 👤 **Primär:** [Name] - [Telefon] - [E-Mail]
- 👤 **Sekundär:** [Name] - [Telefon] - [E-Mail]

**Support-Zeiten:**
- 🕐 **Go-Live-Tag:** 24/7 Bereitschaft
- 🕐 **Erste Woche:** Erweiterte Bereitschaft (7-22 Uhr)

**Eskalationspfad:**
1. ✅ Level 1: Support-Team
2. ✅ Level 2: Entwickler-Team
3. ✅ Level 3: Management

---

## ✅ Go-Live-Entscheidung

**Status:** ⏳ Ausstehend

**Kriterien:**
- [ ] ✅ Alle Pre-Launch-Checklisten abgeschlossen
- [ ] ✅ UAT erfolgreich
- [ ] ✅ Team geschult
- [ ] ✅ Dokumentation vollständig
- [ ] ✅ Support-Bereitschaft organisiert
- [ ] ✅ Rollback-Plan bereit

**Entscheidung:** ⏳ Ausstehend

**Bemerkungen:**
- 

---

## 📝 Go-Live-Protokoll

### Go-Live-Durchführung

**Datum:**  
**Zeit:**  
**Durchgeführt von:**  

**Schritte:**
1. 
2. 
3. 

**Ergebnisse:**
- 

**Probleme:**
- 

**Nächste Schritte:**
- 

---

**Viel Erfolg beim Go-Live! 🚀**

**Letzte Aktualisierung:** 2025-01-27

