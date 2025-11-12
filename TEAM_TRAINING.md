# 👥 Team-Schulung - G3 CrossFit WODIFY Automation

**Erstellt:** 2025-01-27  
**Status:** Phase 5, Woche 13  
**Zielgruppe:** Denis & Team G3 CrossFit

---

## 📚 Schulungs-Übersicht

### Schulungsziele

Nach dieser Schulung können Sie:
- ✅ Das System verstehen und nutzen
- ✅ Häufige Aufgaben selbstständig durchführen
- ✅ Probleme erkennen und beheben
- ✅ Neue Mitglieder und Leads verwalten
- ✅ Statistiken und Reports abrufen

**Dauer:** 2-3 Stunden  
**Format:** Praktische Übungen + Q&A

---

## 🎯 Modul 1: System-Überblick

### Was ist das System?

Das **G3 CrossFit WODIFY Automation System** automatisiert:
- ✅ Willkommens-E-Mails an neue Mitglieder
- ✅ Team-Benachrichtigungen bei neuen Anmeldungen
- ✅ Lead-Nurturing für Interessenten
- ✅ Probetraining-Reminder und Follow-ups
- ✅ Datenbank-Tracking aller Aktivitäten

### Warum wurde es entwickelt?

**Ziel:** 80% Zeitersparnis bei administrativen Aufgaben

**Vorher:**
- Manuelle E-Mail-Versendung: ~10 Min pro E-Mail
- Manuelle Lead-Kontaktierung: ~30 Min pro Lead
- Manuelle Probetraining-Koordination: ~20 Min pro Probetraining

**Jetzt:**
- ✅ Vollautomatisch
- ✅ Sofortige Reaktion
- ✅ Konsistente Kommunikation
- ✅ Keine vergessenen Follow-ups

---

## 🔄 Modul 2: Automatisierte Workflows

### Workflow 1: Neues Mitglied

**Was passiert automatisch:**

```
1. Mitglied registriert sich über WODIFY
   ↓
2. WODIFY sendet Webhook an unser System
   ↓
3. System speichert Mitglied in Datenbank
   ↓
4. Willkommens-E-Mail wird nach 5 Minuten versendet
   ↓
5. Team-Benachrichtigung wird sofort versendet
```

**Was Sie tun müssen:**
- ✅ **NICHTS!** Alles läuft automatisch

**Was Sie prüfen können:**
- Admin-Dashboard → Mitglieder-Liste
- E-Mail-Logs → Versendete E-Mails

---

### Workflow 2: Neuer Lead

**Was passiert automatisch:**

```
1. Lead füllt Kontaktformular aus
   ↓
2. System erstellt Lead in WODIFY
   ↓
3. WODIFY sendet Webhook zurück
   ↓
4. Lead-Antwort-E-Mail wird innerhalb 5 Min versendet
   ↓
5. Nurturing-Sequenz startet:
   - Tag 2: Follow-up E-Mail
   - Tag 5: Value-Content E-Mail
   - Tag 7: Finale E-Mail mit Angebot
```

**Was Sie tun müssen:**
- ✅ **NICHTS!** Alles läuft automatisch
- ✅ Optional: Lead manuell kontaktieren, wenn gewünscht

**Was Sie prüfen können:**
- Admin-Dashboard → Leads-Liste
- Lead-State: "new", "nurturing", "converted", "lost"

---

### Workflow 3: Probetraining gebucht

**Was passiert automatisch:**

```
1. Lead bucht Probetraining über Website
   ↓
2. WODIFY sendet Booking-Webhook
   ↓
3. System speichert Booking
   ↓
4. Bestätigungs-E-Mail wird versendet
   ↓
5. Reminder wird 24h vorher versendet
   ↓
6. Follow-up wird 24h danach versendet
```

**Was Sie tun müssen:**
- ✅ **NICHTS!** Alles läuft automatisch
- ✅ Optional: Vorbereitung für Probetraining

**Was Sie prüfen können:**
- Admin-Dashboard → Bookings-Liste
- E-Mail-Logs → Versendete Reminder

---

## 🖥️ Modul 3: Admin-Dashboard nutzen

### Zugriff auf das Dashboard

**URL:** `https://deine-domain.com/dashboard`

**Login:**
1. Gehen Sie zu `/login`
2. Geben Sie Ihre Zugangsdaten ein
3. Sie werden zum Dashboard weitergeleitet

---

### Dashboard-Bereiche

#### 1. Übersicht (Dashboard Home)

**Was Sie sehen:**
- 📊 Gesamt-Mitgliederanzahl
- 📊 Aktive Leads
- 📊 Heute versendete E-Mails
- 📊 Erfolgsrate (Lead → Mitglied)

**Wie Sie es nutzen:**
- ✅ Täglicher Check: Wie viele neue Mitglieder heute?
- ✅ Wöchentlicher Check: Wie viele Leads wurden zu Mitgliedern?

---

#### 2. Mitglieder-Verwaltung

**Was Sie sehen:**
- Liste aller Mitglieder
- Filter: Status, Mitgliedschaftstyp, Datum
- Details: Name, E-Mail, Telefon, Mitgliedschaftstyp

**Wie Sie es nutzen:**
- ✅ Mitglieder suchen
- ✅ Mitgliedsdaten prüfen
- ✅ Export für weitere Verarbeitung

---

#### 3. Leads-Verwaltung

**Was Sie sehen:**
- Liste aller Leads
- Filter: State, Datum, Quelle
- Details: Name, E-Mail, Telefon, State

**Lead-States:**
- 🟢 **new**: Neuer Lead, Nurturing-Sequenz läuft
- 🟡 **nurturing**: Nurturing-Sequenz aktiv
- 🔵 **converted**: Lead wurde zu Mitglied
- 🔴 **lost**: Lead hat abgelehnt oder nicht geantwortet

**Wie Sie es nutzen:**
- ✅ Leads nach State filtern
- ✅ Lead-State manuell ändern (falls nötig)
- ✅ Lead-Details prüfen

---

#### 4. E-Mail-Logs

**Was Sie sehen:**
- Liste aller versendeten E-Mails
- Filter: Typ, Status, Datum
- Details: Empfänger, Betreff, Status, Message ID

**E-Mail-Typen:**
- 📧 Willkommens-E-Mail
- 📧 Team-Benachrichtigung
- 📧 Lead-Antwort
- 📧 Lead-Nurturing (Tag 2, 5, 7)
- 📧 Probetraining-Bestätigung
- 📧 Probetraining-Reminder
- 📧 Probetraining-Follow-up

**E-Mail-Status:**
- ✅ **sent**: Erfolgreich versendet
- ⚠️ **failed**: Fehlgeschlagen (wird automatisch wiederholt)
- 🔄 **pending**: Wird noch versendet

**Wie Sie es nutzen:**
- ✅ Prüfen, ob E-Mail versendet wurde
- ✅ Fehlgeschlagene E-Mails identifizieren
- ✅ E-Mail-Details prüfen

---

#### 5. Webhook-Logs

**Was Sie sehen:**
- Liste aller empfangenen Webhooks
- Filter: Typ, Status, Datum
- Details: Payload, Response, Fehler

**Webhook-Typen:**
- 🔔 Membership Created
- 🔔 Lead Created
- 🔔 Class Booked
- 🔔 Generic

**Wie Sie es nutzen:**
- ✅ Prüfen, ob Webhooks ankommen
- ✅ Fehlerhafte Webhooks identifizieren
- ✅ Debugging bei Problemen

---

#### 6. Statistiken

**Was Sie sehen:**
- 📊 Mitglieder-Statistiken
- 📊 Lead-Statistiken
- 📊 E-Mail-Statistiken
- 📊 Conversion-Rate
- 📊 Zeitreihen-Diagramme

**Wie Sie es nutzen:**
- ✅ Wöchentliche Reports
- ✅ Monatliche Auswertungen
- ✅ Trend-Analysen

---

## 🔧 Modul 4: Häufige Aufgaben

### Aufgabe 1: Mitglied manuell hinzufügen

**Wann:** Falls Mitglied nicht über WODIFY registriert wurde

**Schritte:**
1. Gehen Sie zu Admin-Dashboard → Mitglieder
2. Klicken Sie auf "Neues Mitglied"
3. Füllen Sie die Felder aus
4. Speichern Sie

**Hinweis:** Willkommens-E-Mail wird automatisch versendet!

---

### Aufgabe 2: Lead-State manuell ändern

**Wann:** Falls Lead-State falsch ist oder manuell geändert werden soll

**Schritte:**
1. Gehen Sie zu Admin-Dashboard → Leads
2. Finden Sie den Lead
3. Klicken Sie auf "Bearbeiten"
4. Ändern Sie den State
5. Speichern Sie

**Hinweis:** Nurturing-Sequenz wird automatisch angepasst!

---

### Aufgabe 3: E-Mail manuell versenden

**Wann:** Falls E-Mail nicht automatisch versendet wurde

**Schritte:**
1. Gehen Sie zu Admin-Dashboard → E-Mail-Logs
2. Finden Sie die fehlgeschlagene E-Mail
3. Klicken Sie auf "Erneut versenden"
4. System versendet E-Mail erneut

**Hinweis:** System versendet E-Mails automatisch erneut bei Fehlern!

---

### Aufgabe 4: Statistiken exportieren

**Wann:** Für Reports oder weitere Verarbeitung

**Schritte:**
1. Gehen Sie zu Admin-Dashboard → Statistiken
2. Wählen Sie den Zeitraum
3. Klicken Sie auf "Exportieren"
4. Wählen Sie Format (CSV, Excel, PDF)
5. Download startet

---

## ⚠️ Modul 5: Probleme erkennen und beheben

### Problem 1: E-Mail wurde nicht versendet

**Symptome:**
- Mitglied hat keine Willkommens-E-Mail erhalten
- E-Mail-Log zeigt Status "failed"

**Lösung:**
1. Prüfen Sie E-Mail-Logs im Dashboard
2. Prüfen Sie Fehler-Meldung
3. Klicken Sie auf "Erneut versenden"
4. Falls weiterhin fehlgeschlagen: Prüfen Sie SendGrid-Status

**Häufige Ursachen:**
- ⚠️ Ungültige E-Mail-Adresse
- ⚠️ SendGrid-API-Problem
- ⚠️ E-Mail wurde als Spam markiert

---

### Problem 2: Webhook kommt nicht an

**Symptome:**
- Neues Mitglied wurde nicht erkannt
- Webhook-Log zeigt keine Einträge

**Lösung:**
1. Prüfen Sie WODIFY-Webhook-Konfiguration
2. Prüfen Sie Webhook-Logs im Dashboard
3. Testen Sie Webhook manuell (siehe Testing-Dokumentation)

**Häufige Ursachen:**
- ⚠️ Webhook-URL falsch konfiguriert
- ⚠️ Webhook-Secret falsch
- ⚠️ Firewall blockiert Webhook

---

### Problem 3: Lead-Nurturing-Sequenz läuft nicht

**Symptome:**
- Lead hat keine Follow-up-E-Mails erhalten
- Lead-State ist "new", aber keine E-Mails versendet

**Lösung:**
1. Prüfen Sie Lead-State im Dashboard
2. Prüfen Sie E-Mail-Logs
3. Prüfen Sie Scheduler-Status
4. Kontaktieren Sie Support falls nötig

**Häufige Ursachen:**
- ⚠️ Lead wurde manuell auf "lost" gesetzt
- ⚠️ Scheduler-Service läuft nicht
- ⚠️ E-Mail-Feature ist deaktiviert

---

## 📞 Modul 6: Support & Kontakt

### Wann sollten Sie Support kontaktieren?

**Kontaktieren Sie Support bei:**
- 🔴 System ist nicht erreichbar
- 🔴 Kritische Fehler (z.B. Datenverlust)
- 🔴 Sicherheitsprobleme
- ⚠️ Wiederkehrende Probleme
- ⚠️ Fragen zur Funktionalität

**Kontaktieren Sie Support NICHT bei:**
- ✅ Einzelne fehlgeschlagene E-Mails (werden automatisch wiederholt)
- ✅ Normale Nutzung des Systems
- ✅ Fragen, die in dieser Dokumentation beantwortet werden

---

### Support-Kontakt

**E-Mail:** support@g3crossfit.com  
**Telefon:** +49 30 12345678  
**Support-Zeiten:** Mo-Fr, 9-18 Uhr

**Bei Support-Anfrage bitte angeben:**
- ✅ Problem-Beschreibung
- ✅ Screenshots (falls möglich)
- ✅ Relevante Logs (aus Dashboard)
- ✅ Zeitpunkt des Problems

---

## ✅ Checkliste: Nach der Schulung

Nach der Schulung sollten Sie:

- [ ] ✅ Zugang zum Admin-Dashboard haben
- [ ] ✅ Dashboard-Bereiche verstehen
- [ ] ✅ Mitglieder und Leads verwalten können
- [ ] ✅ E-Mail-Logs prüfen können
- [ ] ✅ Häufige Probleme erkennen können
- [ ] ✅ FAQ-Dokumentation kennen

---

## 📚 Weitere Ressourcen

### Dokumentation

- 📖 **USER_GUIDE.md** - Ausführliches Benutzerhandbuch
- 📖 **ADMIN_GUIDE.md** - Admin-Handbuch mit technischen Details
- 📖 **FAQ.md** - Häufige Fragen und Antworten
- 📖 **README.md** - Projekt-Übersicht

### Videos (Optional)

- 🎥 Dashboard-Tour (Link folgt)
- 🎥 Workflow-Erklärung (Link folgt)
- 🎥 Troubleshooting-Guide (Link folgt)

---

## 🎯 Nächste Schritte

1. ✅ **Praktische Übung:** Führen Sie alle Aufgaben einmal durch
2. ✅ **Fragen stellen:** Nutzen Sie die Q&A-Session
3. ✅ **Dokumentation lesen:** Lesen Sie USER_GUIDE.md und FAQ.md
4. ✅ **Testen:** Testen Sie das System mit Test-Daten
5. ✅ **UAT-Tests durchführen:** Nutzen Sie `scripts/uat_tests.py` für systematische Tests
6. ✅ **Performance prüfen:** Nutzen Sie `scripts/performance_tests.py` für Performance-Metriken

## 📋 Test-Skripte

Für systematische Tests stehen folgende Skripte zur Verfügung:

- **UAT-Tests:** `python scripts/uat_tests.py` - Testet alle 6 UAT-Szenarien
- **Performance-Tests:** `python scripts/performance_tests.py` - Misst API-Response-Zeiten
- **Beide Tests:** `./scripts/run_uat.sh` - Führt beide Test-Suites aus

Siehe `scripts/README.md` für Details.

---

**Viel Erfolg mit dem neuen System! 🚀**

**Letzte Aktualisierung:** 2025-01-27

