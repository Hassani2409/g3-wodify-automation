# Detaillierter Projektplan - G3 CrossFit Vollautomatisierung

**Erstellt:** 2025-01-27  
**Status:** Detaillierter 14-Wochen-Plan  
**Go-Live:** 01.01.2026

---

## Projekt-Übersicht

**Ziel:** Vollautomatisiertes System für Mitgliederverwaltung mit 80% Zeitersparnis

**Dauer:** 14 Wochen (01.10.2025 - 01.01.2026)

**Team:** Entwickler + Denis (Stakeholder)

---

## Phase 1: Discovery & Planning (Woche 1-2)

### Woche 1: Anforderungsanalyse & WODIFY-Zugang ✅

**Status:** Abgeschlossen

**Aufgaben:**
- ✅ WODIFY-Zugang erhalten und dokumentiert (`WODIFY_SETUP.md`)
- ✅ Anforderungen vollständig dokumentiert (`REQUIREMENTS.md`)
- ✅ Technische Architektur geplant (`ARCHITECTURE.md`)

**Deliverables:**
- ✅ WODIFY API-Zugang konfiguriert
- ✅ Vollständige Anforderungsdokumentation
- ✅ Technische Architektur-Dokumentation

---

### Woche 2: Projektplanung & Setup

**Status:** In Bearbeitung

**Aufgaben:**

#### 1. Detaillierter Projektplan
- ✅ Task-Breakdown für alle Phasen (dieses Dokument)
- ✅ Abhängigkeiten identifiziert
- ✅ Risiken und Mitigationsstrategien dokumentiert

#### 2. Development-Environment Setup
- ✅ WODIFY Sandbox-Environment einrichten (bereit für Integration)
- ✅ Test-Datenbank konfiguriert (SQLite für Development)
- ⏳ E-Mail-Test-Accounts einrichten
- ⏳ CI/CD-Pipeline erweitern

#### 3. Code-Review & Refactoring-Plan
- ✅ Bestehenden Code analysiert
- ✅ Refactoring-Bedarf identifiziert
- ✅ Code-Qualitäts-Standards definiert
- ✅ Priorität 1 Refactorings implementiert:
  - ✅ Scheduler-Service: Persistent Job Store (SQLAlchemy)
  - ✅ WODIFY API Service: Retry-Logik mit exponentieller Backoff
  - ✅ Lead-State-Management: Migration vorhanden

**Deliverables:**
- ✅ Detaillierter Projektplan (dieses Dokument)
- ✅ Development-Environment bereit
- ✅ Refactoring-Plan erstellt und Priorität 1 umgesetzt

---

## Phase 2: Website-Redesign (Woche 3-6)

### Woche 3: Design-System & Komponenten ✅

**Status:** Abgeschlossen

**Aufgaben:**
1. ✅ Design-System entwickeln
   - ✅ Farbpalette optimiert (bereits vorhanden)
   - ✅ Typografie-System dokumentiert (`website/src/lib/design-system.md`)
   - ✅ Komponenten-Bibliothek erweitert (Dialog, Dropdown, Tabs)
   - ✅ **Dateien:** `website/src/components/ui/*` erweitert

2. ✅ Mobile-First Responsive Design
   - ✅ Breakpoints definiert und dokumentiert
   - ✅ Mobile-Navigation optimiert (Touch-Interaktionen)
   - ✅ Touch-Interaktionen verbessert (active states, touch-manipulation)
   - ✅ **Dateien:** `website/src/components/Header.tsx`, `website/src/app/globals.css`

3. ✅ Performance-Optimierung
   - ✅ Image-Optimierung implementiert (AVIF, WebP, device sizes)
   - ✅ Code-Splitting optimiert (optimizePackageImports)
   - ✅ Lazy-Loading vorbereitet (Dokumentation)
   - ✅ Security Headers hinzugefügt
   - ✅ **Dateien:** `website/next.config.ts` erweitert

**Abhängigkeiten:** Phase 1 abgeschlossen ✅

**Deliverables:**
- ✅ Vollständiges Design-System (dokumentiert)
- ✅ Mobile-optimierte Komponenten
- ✅ Performance-Optimierungen implementiert

---

### Woche 4: Homepage & Landing Pages ✅

**Status:** Abgeschlossen

**Aufgaben:**
1. ✅ Homepage komplett neu gestalten
   - ✅ Hero-Section mit Premium-Bild aus G3 Felix integriert
   - ✅ Feature-Section optimiert
   - ✅ Social Proof integriert
   - ✅ **Dateien:** `website/src/app/page.tsx`, `website/src/components/HeroSection.tsx`

2. ✅ Landing Pages erstellt
   - ✅ Probetraining-Landing-Page (`website/src/app/trial/page.tsx`)
   - ✅ Mitgliedschafts-Landing-Page (`website/src/app/membership/page.tsx`)
   - ✅ Premium-Design mit Benefits, Process, FAQ

3. ✅ CTA-Optimierung
   - ✅ Analytics-Tracking vorbereitet (`website/src/lib/analytics.ts`)
   - ✅ Conversion-Tracking für alle CTAs
   - ✅ Event-Tracking für CTA-Clicks, Form-Submits, Bookings
   - ✅ **Dateien:** Alle Seiten mit CTAs

**Abhängigkeiten:** Woche 3 abgeschlossen ✅

**Deliverables:**
- ✅ Redesigned Homepage (Premium-Design mit Bild)
- ✅ Landing Pages (Probetraining & Mitgliedschaft)
- ✅ CTA-Optimierung (Analytics-Tracking)

---

### Woche 5: Content-Seiten & Navigation

**Aufgaben:**
1. Content-Seiten optimieren
   - Training-Seite überarbeiten
   - Coaches-Seite (bereits erstellt)
   - About-Seite optimieren
   - **Dateien:** `website/src/app/training/page.tsx`, `website/src/app/about/page.tsx`

2. Navigation verbessern
   - Mega-Menu implementieren
   - Mobile-Navigation optimieren
   - Breadcrumbs hinzufügen
   - **Dateien:** `website/src/components/Header.tsx`

3. SEO-Optimierung
   - Meta-Tags optimieren
   - Structured Data hinzufügen
   - Sitemap generieren
   - **Dateien:** `website/src/app/layout.tsx`, `website/next.config.ts`

**Abhängigkeiten:** Woche 4 abgeschlossen

**Deliverables:**
- Optimierte Content-Seiten
- Verbesserte Navigation
- SEO-Optimierung

---

### Woche 6: Forms & User Experience

**Aufgaben:**
1. Kontaktformular optimieren
   - Multi-Step-Form implementieren
   - Validierung verbessern
   - WODIFY-Integration vorbereiten
   - **Dateien:** `website/src/app/contact/page.tsx`

2. Mitgliedschafts-Formular
   - Stripe-Integration optimieren
   - WODIFY-Sales-Portal-Integration
   - Multi-Step-Checkout
   - **Dateien:** `website/src/app/pricing/page.tsx`, `website/src/app/api/create-checkout-session/route.ts`

3. User Experience Testing
   - Usability-Tests durchführen
   - Accessibility prüfen
   - Performance-Tests
   - **Dokumentation:** `UX_TESTING.md`

**Abhängigkeiten:** Woche 5 abgeschlossen, WODIFY-Integration vorbereitet

**Deliverables:**
- Optimierte Formulare
- WODIFY-Integration vorbereitet
- UX-Testing abgeschlossen

---

## Phase 3: WODIFY-Integration (Woche 7-8)

### Woche 7: Kursplan-Integration & Sales Portal

**Aufgaben:**
1. Kursplan vollständig integrieren
   - Live-Daten aus WODIFY API
   - Real-time Availability
   - Buchungsfunktion
   - **Dateien:** `src/api/schedule.py`, `src/services/wodify_api_service.py`, `website/src/app/schedule/page.tsx`

2. Sales Portal Integration
   - WODIFY Sales Portal einbetten
   - Mitgliedschafts-Pakete synchronisieren
   - Checkout-Flow optimieren
   - **Dateien:** `src/api/membership.py` (neu), `website/src/app/pricing/page.tsx`

3. Webhook-System erweitern
   - Membership-Webhooks erweitern
   - Booking-Webhooks hinzufügen
   - Error-Handling verbessern
   - **Dateien:** `src/api/webhooks.py`, `src/services/automation_service.py`

**Abhängigkeiten:** Phase 2 abgeschlossen, WODIFY-Zugang vorhanden

**Deliverables:**
- Vollständige Kursplan-Integration
- Sales Portal integriert
- Erweiterte Webhooks

---

### Woche 8: API-Erweiterungen & Synchronisation

**Aufgaben:**
1. WODIFY API Service erweitern
   - Membership-Management
   - Lead-Management
   - Payment-Integration
   - **Dateien:** `src/services/wodify_api_service.py`

2. Datenbank-Synchronisation
   - Automatische Sync-Jobs
   - Conflict-Resolution
   - Datenintegrität sicherstellen
   - **Dateien:** `src/services/scheduler_service.py`, `src/services/database_service.py`

3. Admin-Dashboard erweitern
   - WODIFY-Status-Monitoring
   - Sync-Status anzeigen
   - Error-Logging verbessern
   - **Dateien:** `src/api/admin.py`, `website/src/app/dashboard/page.tsx`

**Abhängigkeiten:** Woche 7 abgeschlossen

**Deliverables:**
- Erweiterte WODIFY API-Integration
- Automatische Synchronisation
- Erweitertes Admin-Dashboard

---

## Phase 4: Python-Automatisierung (Woche 9-12)

### Woche 9: E-Mail-Workflows - Willkommen & Team-Benachrichtigung

**Aufgaben:**
1. Willkommens-E-Mail-Workflow
   - Template optimieren
   - Personalisierung erweitern
   - Automatischer Versand bei Membership-Created
   - **Dateien:** `templates/email/welcome.html`, `src/services/email_service.py`, `src/services/automation_service.py`

2. Team-Benachrichtigung
   - Template optimieren
   - Multi-Empfänger-Logik
   - Automatischer Versand
   - **Dateien:** `templates/email/team_notification.html`, `src/services/automation_service.py`

3. Scheduler-Integration
   - APScheduler-Jobs einrichten
   - Retry-Logik verbessern
   - Monitoring hinzufügen
   - **Dateien:** `src/services/scheduler_service.py`

**Abhängigkeiten:** Phase 3 abgeschlossen

**Deliverables:**
- Willkommens-E-Mail-Workflow
- Team-Benachrichtigung
- Scheduler-Integration

---

### Woche 10: Lead-Nurturing & Probetraining-Workflows

**Aufgaben:**
1. Lead-Antwort-E-Mail (innerhalb 5 Min)
   - Template erstellen
   - Automatischer Versand bei Lead-Created
   - Personalisierung
   - **Dateien:** `templates/email/lead_response.html` (neu), `src/services/automation_service.py`

2. Probetraining-Bestätigung
   - Template erstellen
   - Automatischer Versand bei Booking
   - Kalender-Integration
   - **Dateien:** `templates/email/trial_confirmation.html` (neu), `src/services/automation_service.py`

3. Probetraining-Reminder (24h vorher)
   - Template erstellen
   - Scheduler-Job einrichten
   - Automatischer Versand
   - **Dateien:** `templates/email/trial_reminder.html` (neu), `src/services/scheduler_service.py`

**Abhängigkeiten:** Woche 9 abgeschlossen

**Deliverables:**
- Lead-Antwort-E-Mail
- Probetraining-Bestätigung
- Probetraining-Reminder

---

### Woche 11: Follow-up-Workflows & Nurturing-Sequenz

**Aufgaben:**
1. Follow-up nach Probetraining (24h danach)
   - Template erstellen
   - Feedback-Formular integrieren
   - Automatischer Versand
   - **Dateien:** `templates/email/trial_followup.html` (neu), `src/services/automation_service.py`

2. Lead-Nurturing-Sequenz
   - Tag 2: Follow-up E-Mail
   - Tag 5: Value-Content E-Mail
   - Tag 7: Finale E-Mail mit Angebot
   - **Dateien:** `templates/email/lead_nurturing_2.html` (neu), `templates/email/lead_nurturing_5.html` (neu), `templates/email/lead_nurturing_7.html` (neu), `src/services/automation_service.py`

3. Nurturing-Logik implementieren
   - State-Machine für Leads
   - Automatische Sequenz-Auslösung
   - Opt-out-Mechanismus
   - **Dateien:** `src/services/automation_service.py`, `src/models/wodify.py`

**Abhängigkeiten:** Woche 10 abgeschlossen

**Deliverables:**
- Follow-up nach Probetraining
- Vollständige Nurturing-Sequenz
- Automatische Sequenz-Logik

---

### Woche 12: Backend-Optimierung & Monitoring

**Aufgaben:**
1. Code-Optimierung
   - Performance-Optimierung
   - Error-Handling verbessern
   - Logging erweitern
   - **Dateien:** Alle Backend-Dateien

2. Monitoring & Alerting
   - Sentry-Integration erweitern
   - E-Mail-Delivery-Monitoring
   - Webhook-Status-Monitoring
   - **Dateien:** `main.py`, `src/services/email_service.py`

3. Testing erweitern
   - Unit-Tests für E-Mail-Workflows
   - Integration-Tests für WODIFY-API
   - E2E-Tests für Automatisierung
   - **Dateien:** `tests/test_email_workflows.py` (neu), `tests/test_wodify_integration.py` (neu)

**Abhängigkeiten:** Woche 11 abgeschlossen

**Deliverables:**
- Optimiertes Backend
- Monitoring & Alerting
- Erweiterte Tests

---

## Phase 5: Testing & Launch (Woche 13-14)

### Woche 13: User Acceptance Testing & Schulung

**Aufgaben:**
1. User Acceptance Testing
   - Test-Szenarien durchführen
   - Bug-Fixes
   - Performance-Tests
   - **Dokumentation:** `UAT_RESULTS.md`

2. Team-Schulung
   - Schulungsmaterialien erstellen
   - Team-Schulung durchführen
   - FAQ-Dokumentation
   - **Dokumentation:** `TEAM_TRAINING.md`, `FAQ.md`

3. Dokumentation finalisieren
   - User-Guide erstellen
   - Admin-Guide aktualisieren
   - API-Dokumentation
   - **Dokumentation:** `USER_GUIDE.md`, `ADMIN_GUIDE.md`

**Abhängigkeiten:** Phase 4 abgeschlossen

**Deliverables:**
- UAT abgeschlossen
- Team geschult
- Vollständige Dokumentation

---

### Woche 14: Go-Live & Monitoring

**Aufgaben:**
1. Production-Deployment
   - Production-Environment vorbereiten
   - Datenbank-Migrationen
   - Environment-Variablen konfigurieren
   - **Dateien:** `docker-compose.yml`, `.env.example`

2. Go-Live
   - System aktivieren
   - Monitoring einrichten
   - Support-Bereitschaft
   - **Dokumentation:** `GO_LIVE_CHECKLIST.md`

3. Post-Launch-Monitoring
   - System-Status überwachen
   - Error-Logs prüfen
   - Performance-Metriken
   - **Dokumentation:** `POST_LAUNCH_MONITORING.md`

**Abhängigkeiten:** Woche 13 abgeschlossen

**Deliverables:**
- System live
- Monitoring aktiv
- Post-Launch-Plan

---

## Abhängigkeiten-Matrix

| Task | Abhängig von | Kritischer Pfad |
|------|--------------|-----------------|
| Phase 1, Woche 1 | - | ✅ |
| Phase 1, Woche 2 | Phase 1, Woche 1 | ✅ |
| Phase 2, Woche 3 | Phase 1 | ✅ |
| Phase 2, Woche 4 | Phase 2, Woche 3 | ✅ |
| Phase 2, Woche 5 | Phase 2, Woche 4 | ✅ |
| Phase 2, Woche 6 | Phase 2, Woche 5 | ✅ |
| Phase 3, Woche 7 | Phase 2 | ✅ |
| Phase 3, Woche 8 | Phase 3, Woche 7 | ✅ |
| Phase 4, Woche 9 | Phase 3 | ✅ |
| Phase 4, Woche 10 | Phase 4, Woche 9 | ✅ |
| Phase 4, Woche 11 | Phase 4, Woche 10 | ✅ |
| Phase 4, Woche 12 | Phase 4, Woche 11 | ✅ |
| Phase 5, Woche 13 | Phase 4 | ✅ |
| Phase 5, Woche 14 | Phase 5, Woche 13 | ✅ |

---

## Risiken & Mitigationsstrategien

### Risiko 1: WODIFY API-Limits

**Wahrscheinlichkeit:** Mittel  
**Impact:** Hoch

**Mitigation:**
- Rate-Limiting implementieren
- Caching für Schedule-Daten (5 Minuten)
- Retry-Logik mit exponentieller Backoff
- Monitoring für API-Usage

---

### Risiko 2: E-Mail-Deliverability

**Wahrscheinlichkeit:** Niedrig  
**Impact:** Hoch

**Mitigation:**
- SendGrid best practices befolgen
- SPF/DKIM konfigurieren
- Domain-Verifizierung in SendGrid
- Monitoring für Delivery-Rates
- Bounce-Handling implementieren

---

### Risiko 3: Performance-Probleme

**Wahrscheinlichkeit:** Niedrig  
**Impact:** Mittel

**Mitigation:**
- Load-Testing durchführen
- Caching-Strategien implementieren
- CDN für statische Assets
- Database-Indexing optimieren
- API-Response-Times monitoren

---

### Risiko 4: Daten-Synchronisation

**Wahrscheinlichkeit:** Mittel  
**Impact:** Hoch

**Mitigation:**
- Retry-Logik für fehlgeschlagene Syncs
- Conflict-Resolution-Mechanismus
- Monitoring für Sync-Status
- Logging aller Sync-Operationen
- Manuelle Sync-Möglichkeit im Admin-Dashboard

---

### Risiko 5: Deadline-Verzögerung

**Wahrscheinlichkeit:** Niedrig  
**Impact:** Hoch

**Mitigation:**
- Wöchentliche Status-Updates
- Frühe Identifikation von Blockern
- Priorisierung nach Must-Have/Should-Have
- Puffer-Zeit in Planung einbauen

---

## Erfolgsmetriken

### Phase 1-2 (Woche 1-6)
- ✅ WODIFY-Zugang konfiguriert
- ✅ Design-System implementiert (Woche 3 abgeschlossen)
- ⏳ Website komplett redesigned (Woche 4-6)
- ✅ Mobile-Optimierung abgeschlossen (Woche 3)

### Phase 3 (Woche 7-8)
- ⏳ Kursplan live aus WODIFY
- ⏳ Sales Portal integriert
- ⏳ Webhooks funktionieren

### Phase 4 (Woche 9-12)
- ⏳ Alle 7 E-Mail-Workflows implementiert
- ⏳ Automatische Sequenzen funktionieren
- ⏳ Monitoring aktiv

### Phase 5 (Woche 13-14)
- ⏳ UAT erfolgreich
- ⏳ Team geschult
- ⏳ System live am 01.01.2026

---

## Nächste Schritte

1. ✅ Projektplan erstellt
2. ✅ Development-Environment Setup (teilweise abgeschlossen)
3. ✅ Refactoring-Plan: Priorität 1 umgesetzt
4. → Weiter zu: Phase 2, Woche 3 - Design-System & Komponenten
5. → Optional: E-Mail-Test-Accounts einrichten
6. → Optional: CI/CD-Pipeline erweitern

---

**Letzte Aktualisierung:** 2025-01-27

