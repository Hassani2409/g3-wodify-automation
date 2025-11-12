# ⚡ Quick Deploy & Review Guide

## 🚀 Schnelles Deployment

### Schritt 1: Vorbereitung (einmalig)

```bash
# 1. .env Datei erstellen
cp .env.example .env
nano .env  # Bearbeite die Werte

# 2. Dependencies installieren
source venv/bin/activate
pip install -r requirements.txt

cd website
npm install
cd ..
```

### Schritt 2: Deployment ausführen

```bash
# Automatisches Deployment-Skript
./scripts/deploy.sh
```

Das Skript prüft automatisch:
- ✅ Voraussetzungen
- ✅ Tests
- ✅ Frontend-Build
- ✅ Datenbank-Migrationen
- ✅ Docker-Build (optional)

### Schritt 3: System starten

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

## 🔍 System Review - Seite für Seite

### Automatisches Review

```bash
# Systematische Überprüfung aller Komponenten
python scripts/review_system.py
```

Das Review-Skript prüft:
- ✅ Backend API-Endpunkte
- ✅ Frontend-Seiten
- ✅ Webhook-Endpunkte
- ✅ Datenbank-Verbindung
- ✅ E-Mail-Service
- ✅ Sicherheitskonfiguration

### Manuelles Review - Seite für Seite

#### 1. Backend API

```bash
# Health Check
curl http://localhost:8000/webhooks/health

# API Docs
open http://localhost:8000/docs

# Admin Dashboard
open http://localhost:8000/admin/
```

**Zu prüfen:**
- [ ] Health-Check antwortet mit Status 200
- [ ] API-Docs sind erreichbar
- [ ] Admin-Dashboard lädt korrekt
- [ ] Alle Endpunkte funktionieren

#### 2. Frontend - Homepage

```bash
open http://localhost:3000/
```

**Zu prüfen:**
- [ ] Seite lädt korrekt
- [ ] Navigation funktioniert
- [ ] Bilder werden angezeigt
- [ ] Mobile-Ansicht funktioniert
- [ ] Links funktionieren

#### 3. Frontend - Kursplan

```bash
open http://localhost:3000/schedule
```

**Zu prüfen:**
- [ ] Kursplan wird angezeigt
- [ ] Verfügbarkeit wird korrekt angezeigt
- [ ] Buchung funktioniert (falls konfiguriert)
- [ ] Mobile-Ansicht funktioniert

#### 4. Frontend - Preise

```bash
open http://localhost:3000/pricing
```

**Zu prüfen:**
- [ ] Preise werden angezeigt
- [ ] Call-to-Actions funktionieren
- [ ] Mobile-Ansicht funktioniert

#### 5. Frontend - Kontakt

```bash
open http://localhost:3000/contact
```

**Zu prüfen:**
- [ ] Kontaktformular wird angezeigt
- [ ] Formular-Validierung funktioniert
- [ ] Absenden funktioniert
- [ ] E-Mail wird versendet

#### 6. Frontend - Shop

```bash
open http://localhost:3000/shop
```

**Zu prüfen:**
- [ ] Produkte werden angezeigt
- [ ] Produktdetails funktionieren
- [ ] Warenkorb funktioniert
- [ ] Checkout funktioniert (falls konfiguriert)

#### 7. Frontend - Login/Dashboard

```bash
open http://localhost:3000/login
```

**Zu prüfen:**
- [ ] Login-Formular funktioniert
- [ ] Authentifizierung funktioniert
- [ ] Dashboard wird nach Login angezeigt
- [ ] Statistiken werden angezeigt
- [ ] Logs werden angezeigt

---

## 🧪 Funktion für Funktion testen

### 1. Webhook-Funktionen

```bash
# UAT-Tests ausführen
python scripts/uat_tests.py
```

**Manuell testen:**
- [ ] Membership-Created-Webhook
- [ ] Lead-Created-Webhook
- [ ] Class-Booked-Webhook

### 2. E-Mail-Funktionen

**Zu prüfen:**
- [ ] Willkommens-E-Mail wird versendet
- [ ] Team-Benachrichtigung wird versendet
- [ ] Lead-Antwort-E-Mail wird versendet
- [ ] Nurturing-E-Mails werden versendet
- [ ] Probetraining-E-Mails werden versendet

**E-Mail-Logs prüfen:**
```bash
# Im Admin-Dashboard
open http://localhost:8000/admin/
# → E-Mail-Logs
```

### 3. Datenbank-Funktionen

**Zu prüfen:**
- [ ] Mitglieder werden gespeichert
- [ ] Leads werden gespeichert
- [ ] E-Mail-Logs werden gespeichert
- [ ] Webhook-Logs werden gespeichert

**Datenbank-Statistiken prüfen:**
```bash
# Im Admin-Dashboard
open http://localhost:8000/admin/
# → Statistiken
```

### 4. Performance

```bash
# Performance-Tests ausführen
python scripts/performance_tests.py
```

**Zu prüfen:**
- [ ] API-Response-Zeiten < 500ms
- [ ] E-Mail-Versand-Zeit < 5 Minuten
- [ ] Datenbank-Operationen schnell

---

## 📋 Review-Checkliste

### Vor Kunden-Präsentation

- [ ] ✅ Alle Seiten funktionieren
- [ ] ✅ Alle Funktionen getestet
- [ ] ✅ Mobile-Ansicht getestet
- [ ] ✅ E-Mail-Versand getestet
- [ ] ✅ Webhooks getestet
- [ ] ✅ Performance akzeptabel
- [ ] ✅ Keine kritischen Fehler
- [ ] ✅ Dokumentation vollständig

### System Review durchführen

```bash
# Automatisches Review
python scripts/review_system.py

# UAT-Tests
python scripts/uat_tests.py

# Performance-Tests
python scripts/performance_tests.py
```

---

## 🎯 Nächste Schritte nach Review

1. **Probleme dokumentieren**
   - Erstelle Issues für gefundene Probleme
   - Priorisiere nach Schweregrad

2. **Fixes implementieren**
   - Behebe kritische Probleme zuerst
   - Teste Fixes erneut

3. **Kunden-Präsentation vorbereiten**
   - Demo-Daten vorbereiten
   - Präsentations-Skript erstellen
   - Häufige Fragen vorbereiten

---

**Viel Erfolg beim Review! 🔍**

