# Anforderungen - G3 CrossFit Vollautomatisierung

**Erstellt:** 2025-01-27  
**Status:** Vollständige Anforderungsdokumentation  
**Ziel:** 80% Zeitersparnis bei administrativen Aufgaben

---

## Projektziel

Vollautomatisiertes System für Mitgliederverwaltung mit folgenden Hauptzielen:

1. **80% Zeitersparnis** bei administrativen Aufgaben
2. **Online-Mitgliedschaftsabschluss** ohne persönliche Beteiligung von Denis
3. **Vollständige WODIFY-Integration** für Kursplan und Sales Portal
4. **Automatische E-Mail-Workflows** für alle wichtigen Prozesse
5. **Moderne Website** mit klaren CTAs und Mobile-Optimierung

**Go-Live:** 01.01.2026

---

## Bestehende Prozesse (Analyse)

### Aktuelle manuelle Prozesse

#### 1. Mitgliederverwaltung
- **Aktuell:** Manuelle Erstellung von Mitgliedern in WODIFY
- **Zeitaufwand:** ~15 Minuten pro Mitglied
- **Häufigkeit:** 5-10 neue Mitglieder pro Woche
- **Automatisierungspotenzial:** 100%

#### 2. Lead-Management
- **Aktuell:** Manuelle Kontaktaufnahme mit Leads
- **Zeitaufwand:** ~30 Minuten pro Lead (E-Mail, Telefon, Follow-up)
- **Häufigkeit:** 10-20 Leads pro Woche
- **Automatisierungspotenzial:** 80%

#### 3. E-Mail-Kommunikation
- **Aktuell:** Manuelle Versendung von Willkommens-E-Mails, Remindern, Follow-ups
- **Zeitaufwand:** ~10 Minuten pro E-Mail
- **Häufigkeit:** 20-30 E-Mails pro Woche
- **Automatisierungspotenzial:** 100%

#### 4. Kursbuchungen
- **Aktuell:** Teilweise manuelle Unterstützung bei Buchungen
- **Zeitaufwand:** ~5 Minuten pro Buchung
- **Häufigkeit:** 50-100 Buchungen pro Woche
- **Automatisierungspotenzial:** 90%

#### 5. Probetraining-Koordination
- **Aktuell:** Manuelle Koordination und Erinnerungen
- **Zeitaufwand:** ~20 Minuten pro Probetraining
- **Häufigkeit:** 5-10 Probetrainings pro Woche
- **Automatisierungspotenzial:** 85%

---

## Automatisierungs-Potenzial

### Zeitersparnis-Berechnung

| Prozess | Aktuell (Min/Woche) | Automatisiert (Min/Woche) | Ersparnis |
|---------|---------------------|---------------------------|-----------|
| Mitgliederverwaltung | 75-150 | 0 | 100% |
| Lead-Management | 300-600 | 60-120 | 80% |
| E-Mail-Kommunikation | 200-300 | 0 | 100% |
| Kursbuchungen | 250-500 | 25-50 | 90% |
| Probetraining-Koordination | 100-200 | 15-30 | 85% |
| **Gesamt** | **925-1750** | **100-200** | **~85%** |

**Ziel erreicht:** ✅ 80% Zeitersparnis

---

## Funktionale Anforderungen

### FR1: Online-Mitgliedschaftsabschluss

**Beschreibung:**  
Kunden können Mitgliedschaften vollständig online abschließen ohne persönliche Beteiligung von Denis.

**Anforderungen:**
- Integration mit WODIFY Sales Portal
- Stripe-Zahlungsintegration
- Automatische Mitgliedschaftserstellung in WODIFY
- Automatische Willkommens-E-Mail
- Automatische Team-Benachrichtigung

**Akzeptanzkriterien:**
- ✅ Kunde kann Mitgliedschaft online abschließen
- ✅ Zahlung wird automatisch verarbeitet
- ✅ Mitgliedschaft wird automatisch in WODIFY erstellt
- ✅ Willkommens-E-Mail wird automatisch versendet
- ✅ Team wird automatisch benachrichtigt

---

### FR2: Automatische E-Mail-Workflows

**Beschreibung:**  
Vollständig automatisierte E-Mail-Workflows für alle wichtigen Prozesse.

#### FR2.1: Willkommens-E-Mail
- **Trigger:** Neues Mitglied erstellt
- **Timing:** 5 Minuten nach Erstellung
- **Inhalt:** Willkommensnachricht, WODIFY App-Download, Kursplan-Link, Community-Links

#### FR2.2: Team-Benachrichtigung
- **Trigger:** Neues Mitglied erstellt
- **Timing:** Sofort
- **Empfänger:** Team-E-Mail-Liste
- **Inhalt:** Mitgliedschaftsdetails, Kontaktinformationen

#### FR2.3: Lead-Antwort-E-Mail
- **Trigger:** Neuer Lead erstellt
- **Timing:** Innerhalb 5 Minuten
- **Inhalt:** Danksagung, Probetraining-Angebot, Kontaktinformationen

#### FR2.4: Probetraining-Bestätigung
- **Trigger:** Probetraining gebucht
- **Timing:** Sofort
- **Inhalt:** Bestätigung, Termin-Details, Vorbereitungshinweise

#### FR2.5: Probetraining-Reminder
- **Trigger:** Probetraining gebucht
- **Timing:** 24 Stunden vorher
- **Inhalt:** Erinnerung, Termin-Details, Vorbereitungshinweise

#### FR2.6: Follow-up nach Probetraining
- **Trigger:** Probetraining abgeschlossen
- **Timing:** 24 Stunden danach
- **Inhalt:** Feedback-Anfrage, Mitgliedschafts-Angebot, Kontaktinformationen

#### FR2.7: Lead-Nurturing-Sequenz
- **Tag 2:** Follow-up E-Mail mit zusätzlichen Informationen
- **Tag 5:** Value-Content E-Mail mit Tipps und Erfolgsgeschichten
- **Tag 7:** Finale E-Mail mit speziellem Angebot

**Akzeptanzkriterien:**
- ✅ Alle E-Mails werden automatisch versendet
- ✅ Personalisierung funktioniert korrekt
- ✅ Timing ist korrekt
- ✅ Opt-out-Mechanismus funktioniert

---

### FR3: WODIFY-Integration

#### FR3.1: Kursplan-Integration
- **Beschreibung:** Live-Daten aus WODIFY API
- **Anforderungen:**
  - Kursplan wird live aus WODIFY geladen
  - Real-time Availability-Anzeige
  - Buchungsfunktion direkt in WODIFY
  - Wartelisten-Funktion

#### FR3.2: Sales Portal-Integration
- **Beschreibung:** WODIFY Sales Portal einbetten
- **Anforderungen:**
  - Mitgliedschafts-Pakete werden aus WODIFY geladen
  - Checkout-Flow über WODIFY
  - Automatische Synchronisation

#### FR3.3: Webhook-Integration
- **Beschreibung:** Automatische Verarbeitung von WODIFY-Events
- **Anforderungen:**
  - Membership-Created Webhook
  - Lead-Created Webhook
  - Booking-Created Webhook
  - Booking-Cancelled Webhook

**Akzeptanzkriterien:**
- ✅ Kursplan zeigt aktuelle Daten
- ✅ Buchungen funktionieren
- ✅ Sales Portal ist integriert
- ✅ Webhooks werden korrekt verarbeitet

---

### FR4: Moderne Website

#### FR4.1: Design-System
- **Beschreibung:** Konsistentes Design-System
- **Anforderungen:**
  - Farbpalette optimiert
  - Typografie-System
  - Komponenten-Bibliothek
  - Mobile-First Responsive Design

#### FR4.2: Homepage
- **Beschreibung:** Komplett neu gestaltete Homepage
- **Anforderungen:**
  - Hero-Section mit klaren CTAs
  - Feature-Section optimiert
  - Social Proof integriert
  - Conversion-optimiert

#### FR4.3: Landing Pages
- **Beschreibung:** Dedizierte Landing Pages
- **Anforderungen:**
  - Probetraining-Landing-Page
  - Mitgliedschafts-Landing-Page
  - Conversion-optimiert

#### FR4.4: Forms
- **Beschreibung:** Optimierte Formulare
- **Anforderungen:**
  - Multi-Step-Formulare
  - Validierung verbessert
  - WODIFY-Integration
  - Mobile-optimiert

**Akzeptanzkriterien:**
- ✅ Website ist vollständig responsive
- ✅ Alle CTAs funktionieren
- ✅ Formulare sind optimiert
- ✅ Conversion-Rate ist verbessert

---

## Nicht-funktionale Anforderungen

### NFR1: Performance
- **Anforderung:** Website lädt in < 3 Sekunden
- **Messung:** Lighthouse Performance Score > 90

### NFR2: Verfügbarkeit
- **Anforderung:** 99.9% Uptime
- **Messung:** Monitoring mit Sentry

### NFR3: Sicherheit
- **Anforderung:** DSGVO-konform
- **Messung:** Datenschutzerklärung, SSL-Zertifikat

### NFR4: Skalierbarkeit
- **Anforderung:** Unterstützung von 1000+ Mitgliedern
- **Messung:** Load-Testing

### NFR5: Wartbarkeit
- **Anforderung:** Vollständige Dokumentation
- **Messung:** Code-Dokumentation, User-Guide, Admin-Guide

---

## E-Mail-Workflow-Mapping

### Workflow 1: Neues Mitglied

```
WODIFY Membership Created Webhook
  ↓
Automation Service: Member speichern
  ↓
Scheduler: Willkommens-E-Mail planen (5 Min)
  ↓
Email Service: Willkommens-E-Mail versenden
  ↓
Email Service: Team-Benachrichtigung versenden (sofort)
```

### Workflow 2: Neuer Lead

```
WODIFY Lead Created Webhook
  ↓
Automation Service: Lead speichern
  ↓
Email Service: Lead-Antwort-E-Mail versenden (5 Min)
  ↓
Scheduler: Nurturing-Sequenz planen
  ↓
  ├─ Tag 2: Follow-up E-Mail
  ├─ Tag 5: Value-Content E-Mail
  └─ Tag 7: Finale E-Mail mit Angebot
```

### Workflow 3: Probetraining gebucht

```
WODIFY Booking Created Webhook
  ↓
Automation Service: Booking speichern
  ↓
Email Service: Probetraining-Bestätigung versenden (sofort)
  ↓
Scheduler: Probetraining-Reminder planen (24h vorher)
  ↓
Email Service: Probetraining-Reminder versenden
  ↓
Scheduler: Follow-up planen (24h danach)
  ↓
Email Service: Follow-up E-Mail versenden
```

---

## Priorisierung

### Must-Have (P0)
1. ✅ Online-Mitgliedschaftsabschluss
2. ✅ Willkommens-E-Mail
3. ✅ Team-Benachrichtigung
4. ✅ Lead-Antwort-E-Mail
5. ✅ Kursplan-Integration
6. ✅ Sales Portal-Integration
7. ✅ Webhook-Integration

### Should-Have (P1)
8. ✅ Probetraining-Workflows
9. ✅ Lead-Nurturing-Sequenz
10. ✅ Moderne Website

### Nice-to-Have (P2)
11. ⏳ Geburtstags-E-Mails
12. ⏳ Zahlungserinnerungen
13. ⏳ Erweiterte Analytics

---

## Erfolgsmetriken

### Zeitersparnis
- **Ziel:** 80% Zeitersparnis
- **Messung:** Vergleich vor/nach Automatisierung

### Conversion-Rate
- **Ziel:** +20% Conversion-Rate
- **Messung:** Leads → Mitglieder

### E-Mail-Delivery-Rate
- **Ziel:** > 95% Delivery-Rate
- **Messung:** SendGrid Analytics

### Website-Performance
- **Ziel:** Lighthouse Score > 90
- **Messung:** Lighthouse CI

---

## Risiken & Mitigation

### Risiko 1: WODIFY API-Limits
- **Mitigation:** Rate-Limiting, Caching

### Risiko 2: E-Mail-Deliverability
- **Mitigation:** SendGrid best practices, SPF/DKIM

### Risiko 3: Performance-Probleme
- **Mitigation:** Load-Testing, Caching, CDN

### Risiko 4: Daten-Synchronisation
- **Mitigation:** Retry-Logik, Conflict-Resolution

---

## Nächste Schritte

1. ✅ Anforderungen dokumentiert
2. → Weiter zu: `ARCHITECTURE.md` für technische Architektur
3. → Weiter zu: `PROJECT_PLAN.md` für detaillierten Projektplan

---

**Letzte Aktualisierung:** 2025-01-27

