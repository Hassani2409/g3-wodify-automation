# 📖 Benutzerhandbuch - G3 CrossFit WODIFY Automation

**Erstellt:** 2025-01-27  
**Status:** Phase 5, Woche 13  
**Version:** 1.0

---

## 📋 Inhaltsverzeichnis

1. [Einführung](#einführung)
2. [Erste Schritte](#erste-schritte)
3. [Dashboard-Nutzung](#dashboard-nutzung)
4. [Mitglieder-Verwaltung](#mitglieder-verwaltung)
5. [Leads-Verwaltung](#leads-verwaltung)
6. [E-Mail-Verwaltung](#e-mail-verwaltung)
7. [Statistiken & Reports](#statistiken--reports)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Einführung

### Was ist das System?

Das **G3 CrossFit WODIFY Automation System** ist eine vollautomatisierte Lösung für:
- ✅ Automatische E-Mail-Workflows
- ✅ Mitglieder- und Lead-Verwaltung
- ✅ Integration mit WODIFY
- ✅ Statistiken und Reports

### Zielgruppe

Dieses Handbuch richtet sich an:
- 👥 **Team-Mitglieder** von G3 CrossFit
- 👥 **Administratoren** des Systems
- 👥 **Endbenutzer**, die das System nutzen

---

## 🚀 Erste Schritte

### Zugang zum System

**URL:** `https://deine-domain.com/dashboard`

**Login:**
1. Gehen Sie zur Login-Seite
2. Geben Sie Ihre Zugangsdaten ein
3. Sie werden zum Dashboard weitergeleitet

**Passwort zurücksetzen:**
1. Klicken Sie auf "Passwort vergessen?"
2. Geben Sie Ihre E-Mail-Adresse ein
3. Sie erhalten einen Reset-Link per E-Mail

---

### Dashboard-Übersicht

Nach dem Login sehen Sie:

**Obere Navigation:**
- 🏠 Dashboard (Home)
- 👥 Mitglieder
- 📧 Leads
- 📊 Statistiken
- ⚙️ Einstellungen

**Hauptbereich:**
- 📊 Übersichtskarten (Mitglieder, Leads, E-Mails)
- 📈 Diagramme und Trends
- 📋 Aktuelle Aktivitäten

---

## 🖥️ Dashboard-Nutzung

### Übersicht (Dashboard Home)

**Was Sie sehen:**

#### Übersichtskarten

| Karte | Beschreibung |
|-------|--------------|
| **Gesamt-Mitglieder** | Anzahl aller Mitglieder |
| **Aktive Leads** | Anzahl aktiver Leads |
| **Heute versendete E-Mails** | Anzahl heute versendeter E-Mails |
| **Conversion-Rate** | Prozentsatz Leads → Mitglieder |

#### Diagramme

- 📈 **Mitglieder-Trend** (letzte 30 Tage)
- 📈 **Lead-Trend** (letzte 30 Tage)
- 📈 **E-Mail-Versand** (letzte 7 Tage)
- 📈 **Conversion-Rate** (letzte 30 Tage)

#### Aktuelle Aktivitäten

- 🔔 Neueste Mitglieder
- 🔔 Neueste Leads
- 🔔 Neueste E-Mail-Versendungen
- 🔔 Neueste Webhooks

---

### Navigation

**Obere Navigation:**

- **Dashboard:** Zurück zur Übersicht
- **Mitglieder:** Mitglieder-Verwaltung
- **Leads:** Leads-Verwaltung
- **Statistiken:** Detaillierte Statistiken
- **Einstellungen:** System-Einstellungen

**Seitenleiste (falls vorhanden):**

- 🔍 Suche
- 📊 Quick-Stats
- 🔔 Benachrichtigungen

---

## 👥 Mitglieder-Verwaltung

### Mitglieder-Liste anzeigen

**Schritte:**
1. Klicken Sie auf "Mitglieder" in der Navigation
2. Sie sehen eine Liste aller Mitglieder

**Filter:**
- 🔍 **Suche:** Nach Name, E-Mail, Telefon suchen
- 📅 **Datum:** Nach Erstellungsdatum filtern
- 🏷️ **Status:** Nach Status filtern (Active, Paused, Cancelled)
- 💳 **Mitgliedschaftstyp:** Nach Typ filtern

**Sortierung:**
- Nach Name (A-Z, Z-A)
- Nach Datum (Neueste zuerst, Älteste zuerst)
- Nach Status

---

### Mitglieder-Details anzeigen

**Schritte:**
1. Klicken Sie auf ein Mitglied in der Liste
2. Sie sehen die Mitglieder-Details

**Details:**
- 👤 **Persönliche Daten:** Name, E-Mail, Telefon
- 💳 **Mitgliedschaft:** Typ, Status, Startdatum, Preis
- 📧 **E-Mail-Historie:** Versendete E-Mails
- 📝 **Notizen:** Interne Notizen

---

### Neues Mitglied hinzufügen

**Schritte:**
1. Klicken Sie auf "Neues Mitglied" in der Mitglieder-Liste
2. Füllen Sie das Formular aus:
   - Vorname
   - Nachname
   - E-Mail
   - Telefon
   - Mitgliedschaftstyp
   - Startdatum
3. Klicken Sie auf "Speichern"

**Hinweis:** Willkommens-E-Mail wird automatisch versendet!

---

### Mitglied bearbeiten

**Schritte:**
1. Finden Sie das Mitglied in der Liste
2. Klicken Sie auf "Bearbeiten"
3. Ändern Sie die gewünschten Felder
4. Klicken Sie auf "Speichern"

**Hinweis:** Änderungen werden sofort gespeichert!

---

### Mitglied löschen

**Schritte:**
1. Finden Sie das Mitglied in der Liste
2. Klicken Sie auf "Löschen"
3. Bestätigen Sie die Löschung

**Hinweis:** Löschung kann nicht rückgängig gemacht werden!

---

## 📧 Leads-Verwaltung

### Leads-Liste anzeigen

**Schritte:**
1. Klicken Sie auf "Leads" in der Navigation
2. Sie sehen eine Liste aller Leads

**Filter:**
- 🔍 **Suche:** Nach Name, E-Mail, Telefon suchen
- 📅 **Datum:** Nach Erstellungsdatum filtern
- 🏷️ **State:** Nach State filtern (new, nurturing, converted, lost)
- 📍 **Quelle:** Nach Quelle filtern

**Sortierung:**
- Nach Name (A-Z, Z-A)
- Nach Datum (Neueste zuerst, Älteste zuerst)
- Nach State

---

### Lead-States verstehen

**Lead-States:**

| State | Beschreibung | Aktion |
|-------|--------------|--------|
| 🟢 **new** | Neuer Lead | Nurturing-Sequenz startet automatisch |
| 🟡 **nurturing** | Nurturing aktiv | E-Mails werden versendet |
| 🔵 **converted** | Lead wurde zu Mitglied | Nurturing gestoppt |
| 🔴 **lost** | Lead hat abgelehnt | Keine weiteren E-Mails |

---

### Lead-Details anzeigen

**Schritte:**
1. Klicken Sie auf einen Lead in der Liste
2. Sie sehen die Lead-Details

**Details:**
- 👤 **Persönliche Daten:** Name, E-Mail, Telefon
- 📍 **Quelle:** Woher kommt der Lead?
- 📧 **E-Mail-Historie:** Versendete E-Mails
- 📝 **Notizen:** Interne Notizen
- 🏷️ **State:** Aktueller State

---

### Lead-State ändern

**Schritte:**
1. Finden Sie den Lead in der Liste
2. Klicken Sie auf "Bearbeiten"
3. Ändern Sie den State
4. Klicken Sie auf "Speichern"

**Hinweis:** Nurturing-Sequenz wird automatisch angepasst!

---

## 📨 E-Mail-Verwaltung

### E-Mail-Logs anzeigen

**Schritte:**
1. Klicken Sie auf "E-Mail-Logs" in der Navigation
2. Sie sehen eine Liste aller versendeten E-Mails

**Filter:**
- 🔍 **Suche:** Nach Empfänger, Betreff suchen
- 📅 **Datum:** Nach Versanddatum filtern
- 🏷️ **Typ:** Nach E-Mail-Typ filtern
- ✅ **Status:** Nach Status filtern (sent, failed, pending)

---

### E-Mail-Typen

**E-Mail-Typen:**

| Typ | Beschreibung | Wann wird versendet? |
|-----|--------------|---------------------|
| 📧 **Willkommens-E-Mail** | Willkommens-E-Mail für neue Mitglieder | Nach Mitgliedschaftserstellung |
| 📧 **Team-Benachrichtigung** | Benachrichtigung an das Team | Bei neuen Mitgliedern |
| 📧 **Lead-Antwort** | Antwort auf Lead-Anfrage | Innerhalb 5 Min nach Lead-Erstellung |
| 📧 **Lead-Nurturing** | Nurturing-E-Mail | Tag 2, 5, 7 nach Lead-Erstellung |
| 📧 **Probetraining-Bestätigung** | Bestätigung für Probetraining | Nach Buchung |
| 📧 **Probetraining-Reminder** | Erinnerung vor Probetraining | 24h vorher |
| 📧 **Probetraining-Follow-up** | Follow-up nach Probetraining | 24h danach |

---

### E-Mail-Status verstehen

**E-Mail-Status:**

| Status | Beschreibung | Aktion |
|--------|--------------|--------|
| ✅ **sent** | Erfolgreich versendet | Keine Aktion nötig |
| ⚠️ **failed** | Fehlgeschlagen | System versucht automatisch erneut |
| 🔄 **pending** | Wird noch versendet | Warten |

---

### E-Mail erneut versenden

**Schritte:**
1. Finden Sie die fehlgeschlagene E-Mail in den Logs
2. Klicken Sie auf "Erneut versenden"
3. System versendet E-Mail erneut

**Hinweis:** System versendet E-Mails automatisch erneut bei Fehlern!

---

## 📊 Statistiken & Reports

### Statistiken anzeigen

**Schritte:**
1. Klicken Sie auf "Statistiken" in der Navigation
2. Sie sehen verschiedene Statistiken

**Verfügbare Statistiken:**

#### Mitglieder-Statistiken
- 📊 Gesamt-Mitgliederanzahl
- 📊 Neue Mitglieder (heute, diese Woche, dieser Monat)
- 📊 Mitglieder nach Status
- 📊 Mitglieder nach Mitgliedschaftstyp

#### Lead-Statistiken
- 📊 Gesamt-Leads
- 📊 Neue Leads (heute, diese Woche, dieser Monat)
- 📊 Leads nach State
- 📊 Leads nach Quelle

#### E-Mail-Statistiken
- 📊 Versendete E-Mails (heute, diese Woche, dieser Monat)
- 📊 Erfolgsrate (sent vs. failed)
- 📊 E-Mails nach Typ
- 📊 E-Mails nach Status

#### Conversion-Statistiken
- 📊 Conversion-Rate (Leads → Mitglieder)
- 📊 Conversion nach Quelle
- 📊 Conversion nach Zeitraum

---

### Reports exportieren

**Schritte:**
1. Gehen Sie zu Statistiken
2. Wählen Sie den gewünschten Zeitraum
3. Wählen Sie die gewünschten Statistiken
4. Klicken Sie auf "Exportieren"
5. Wählen Sie Format (CSV, Excel, PDF)
6. Download startet

**Verfügbare Formate:**
- 📄 **CSV:** Für Excel/Google Sheets
- 📊 **Excel:** Für detaillierte Analysen
- 📑 **PDF:** Für Präsentationen

---

## 🔧 Troubleshooting

### Problem: Ich kann mich nicht einloggen

**Lösung:**
1. Prüfen Sie Ihre Zugangsdaten
2. Prüfen Sie, ob Caps Lock aktiviert ist
3. Versuchen Sie "Passwort zurücksetzen"
4. Kontaktieren Sie Support

---

### Problem: Dashboard lädt nicht

**Lösung:**
1. Prüfen Sie Ihre Internetverbindung
2. Aktualisieren Sie die Seite (F5)
3. Leeren Sie den Browser-Cache
4. Versuchen Sie einen anderen Browser
5. Kontaktieren Sie Support

---

### Problem: E-Mail wurde nicht versendet

**Lösung:**
1. Prüfen Sie E-Mail-Logs im Dashboard
2. Prüfen Sie Fehler-Meldung
3. Klicken Sie auf "Erneut versenden"
4. Falls weiterhin fehlgeschlagen: Kontaktieren Sie Support

---

### Problem: Statistiken sind nicht aktuell

**Lösung:**
1. Aktualisieren Sie die Seite (F5)
2. Prüfen Sie den Zeitraum-Filter
3. Warten Sie einige Minuten (Statistiken werden täglich aktualisiert)
4. Kontaktieren Sie Support

---

## 📞 Support

### Support kontaktieren

**E-Mail:** support@g3crossfit.com  
**Telefon:** +49 30 12345678  
**Support-Zeiten:** Mo-Fr, 9-18 Uhr

**Bei Support-Anfrage bitte angeben:**
- ✅ Problem-Beschreibung
- ✅ Screenshots (falls möglich)
- ✅ Relevante Logs (aus Dashboard)
- ✅ Zeitpunkt des Problems

---

## 📚 Weitere Ressourcen

### Dokumentation

- 📖 **TEAM_TRAINING.md** - Team-Schulungsmaterialien
- 📖 **FAQ.md** - Häufige Fragen und Antworten
- 📖 **ADMIN_GUIDE.md** - Admin-Handbuch mit technischen Details

### Externe Ressourcen

- 🔗 **WODIFY:** https://app.wodify.com
- 🔗 **SendGrid:** https://app.sendgrid.com

---

**Viel Erfolg mit dem System! 🚀**

**Letzte Aktualisierung:** 2025-01-27

