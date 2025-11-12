# ❓ Häufige Fragen (FAQ) - G3 CrossFit WODIFY Automation

**Erstellt:** 2025-01-27  
**Status:** Phase 5, Woche 13

---

## 📧 E-Mail-Workflows

### Wie schnell werden E-Mails versendet?

**Willkommens-E-Mail:** Innerhalb von 5 Minuten nach Mitgliedschaftserstellung  
**Team-Benachrichtigung:** Innerhalb von 5 Sekunden  
**Lead-Antwort:** Innerhalb von 5 Minuten nach Lead-Erstellung  
**Probetraining-Bestätigung:** Innerhalb von 5 Minuten nach Buchung  
**Probetraining-Reminder:** 24 Stunden vor dem Probetraining  
**Probetraining-Follow-up:** 24 Stunden nach dem Probetraining

---

### Was passiert, wenn eine E-Mail fehlschlägt?

Das System versendet E-Mails automatisch erneut:
- ✅ **3 Versuche** innerhalb von 24 Stunden
- ✅ **Exponentielle Backoff** zwischen Versuchen
- ✅ **Logging** aller Versuche im Dashboard

Falls alle Versuche fehlschlagen:
- ⚠️ E-Mail wird im Dashboard als "failed" markiert
- ⚠️ Sie können manuell "Erneut versenden" klicken
- ⚠️ Support wird bei kritischen Fehlern benachrichtigt

---

### Kann ich E-Mail-Templates anpassen?

**Ja!** Die E-Mail-Templates befinden sich in `templates/email/`:
- `welcome.html` - Willkommens-E-Mail
- `team_notification.html` - Team-Benachrichtigung
- `lead_response.html` - Lead-Antwort
- `lead_nurturing_2.html` - Nurturing Tag 2
- `lead_nurturing_5.html` - Nurturing Tag 5
- `lead_nurturing_7.html` - Nurturing Tag 7
- `trial_confirmation.html` - Probetraining-Bestätigung
- `trial_reminder.html` - Probetraining-Reminder
- `trial_followup.html` - Probetraining-Follow-up

**Hinweis:** Nach Änderungen muss das System neu gestartet werden.

---

### Kann ich E-Mail-Workflows deaktivieren?

**Ja!** Über Umgebungsvariablen in `.env`:

```env
ENABLE_WELCOME_EMAIL=false
ENABLE_TEAM_NOTIFICATION=false
ENABLE_LEAD_NURTURING=false
```

**Hinweis:** Nach Änderungen muss das System neu gestartet werden.

---

## 🔔 Webhooks

### Wie funktionieren Webhooks?

**Webhooks** sind Benachrichtigungen von WODIFY an unser System:

1. ✅ WODIFY sendet HTTP-POST-Request an unsere Webhook-URL
2. ✅ Unser System verifiziert die Signatur
3. ✅ Unser System verarbeitet die Daten
4. ✅ Unser System sendet Antwort zurück

**Webhook-Typen:**
- 🔔 Membership Created
- 🔔 Lead Created
- 🔔 Class Booked
- 🔔 Generic

---

### Was passiert, wenn ein Webhook fehlschlägt?

**Automatische Wiederholung:**
- ✅ WODIFY versucht Webhooks automatisch erneut
- ✅ Bis zu **5 Versuche** innerhalb von 24 Stunden
- ✅ Exponentielle Backoff zwischen Versuchen

**Manuelle Prüfung:**
- ✅ Webhook-Logs im Dashboard prüfen
- ✅ Fehler-Meldungen analysieren
- ✅ Bei Bedarf Support kontaktieren

---

### Wie kann ich Webhooks testen?

**Option 1: Über WODIFY Admin**
1. Gehen Sie zu WODIFY Admin → Settings → Webhooks
2. Klicken Sie auf "Test Webhook"
3. Prüfen Sie Webhook-Logs im Dashboard

**Option 2: Über API**
```bash
curl -X POST https://deine-domain.com/webhooks/wodify/membership-created \
  -H "Content-Type: application/json" \
  -H "X-Wodify-Signature: ..." \
  -d '{...}'
```

---

## 👥 Mitglieder & Leads

### Wie werden Mitglieder erstellt?

**Automatisch:**
- ✅ Mitglied registriert sich über WODIFY Sales Portal
- ✅ WODIFY sendet Webhook
- ✅ System erstellt Mitglied automatisch

**Manuell:**
- ✅ Admin-Dashboard → Mitglieder → "Neues Mitglied"
- ✅ Willkommens-E-Mail wird automatisch versendet

---

### Was ist der Unterschied zwischen Lead und Mitglied?

**Lead:**
- 🟡 Interessent, der noch keine Mitgliedschaft abgeschlossen hat
- 🟡 Erhält Nurturing-Sequenz
- 🟡 State: "new", "nurturing", "converted", "lost"

**Mitglied:**
- 🟢 Hat Mitgliedschaft abgeschlossen
- 🟢 Erhält Willkommens-E-Mail
- 🟢 Status: "Active", "Paused", "Cancelled"

**Konvertierung:**
- ✅ Lead wird automatisch zu Mitglied, wenn Mitgliedschaft abgeschlossen wird
- ✅ Nurturing-Sequenz wird automatisch gestoppt

---

### Kann ich Lead-State manuell ändern?

**Ja!** Über Admin-Dashboard:

1. Gehen Sie zu Leads → Finden Sie den Lead
2. Klicken Sie auf "Bearbeiten"
3. Ändern Sie den State
4. Speichern Sie

**Hinweis:** Nurturing-Sequenz wird automatisch angepasst!

---

## 📊 Dashboard & Statistiken

### Wie oft werden Statistiken aktualisiert?

**Echtzeit:**
- ✅ Mitglieder-Liste
- ✅ Leads-Liste
- ✅ E-Mail-Logs
- ✅ Webhook-Logs

**Täglich (um Mitternacht):**
- 📊 Tägliche Statistiken
- 📊 Conversion-Rate
- 📊 E-Mail-Statistiken

---

### Kann ich Statistiken exportieren?

**Ja!** Über Admin-Dashboard:

1. Gehen Sie zu Statistiken
2. Wählen Sie den Zeitraum
3. Klicken Sie auf "Exportieren"
4. Wählen Sie Format (CSV, Excel, PDF)
5. Download startet

---

## 🔧 Technische Fragen

### Welche Datenbank wird verwendet?

**Development:** SQLite (Datei: `g3_wodify.db`)  
**Production:** PostgreSQL (empfohlen)

**Datenbank-Schema:**
- `members` - Mitglieder
- `leads` - Leads
- `webhook_logs` - Webhook-Logs
- `email_logs` - E-Mail-Logs

---

### Wie wird das System deployed?

**Optionen:**
1. **Docker Compose** (empfohlen)
2. **VPS** (Ubuntu/Debian)
3. **Cloud Platforms** (Railway, Heroku, etc.)

**Siehe:** `DEPLOYMENT_CHECKLIST.md` für Details

---

### Wie kann ich das System neu starten?

**Docker Compose:**
```bash
docker-compose restart
```

**Systemd Service:**
```bash
sudo systemctl restart g3-wodify
```

**Manuell:**
```bash
# Prozess beenden (Ctrl+C)
# Neu starten
python main.py
```

---

## 🔒 Sicherheit

### Wie sicher ist das System?

**Sicherheits-Features:**
- ✅ Webhook-Signatur-Verifizierung (HMAC-SHA256)
- ✅ JWT-Authentifizierung für API
- ✅ HTTPS-Verschlüsselung
- ✅ Rate Limiting
- ✅ CORS-Konfiguration
- ✅ Input-Validierung

**Best Practices:**
- ✅ Secrets werden über Umgebungsvariablen verwaltet
- ✅ Keine Hardcodierung von Passwörtern
- ✅ Regelmäßige Updates
- ✅ Logging aller Aktivitäten

---

### Wer hat Zugang zum Admin-Dashboard?

**Nur autorisierte Benutzer:**
- ✅ Login erforderlich
- ✅ JWT-Token-basierte Authentifizierung
- ✅ Rollenbasierte Zugriffskontrolle (geplant)

**Aktuell:**
- ✅ Alle eingeloggten Benutzer haben vollen Zugriff
- ⏳ Rollenbasierte Zugriffskontrolle in Planung

---

## 🐛 Troubleshooting

### System ist nicht erreichbar

**Prüfen Sie:**
1. ✅ Ist der Server online?
2. ✅ Läuft der Service? (`systemctl status g3-wodify`)
3. ✅ Sind Ports geöffnet? (`netstat -tulpn`)
4. ✅ Sind Firewall-Regeln korrekt?

**Lösung:**
- ✅ Service neu starten
- ✅ Logs prüfen (`journalctl -u g3-wodify -f`)
- ✅ Support kontaktieren

---

### E-Mails werden nicht versendet

**Prüfen Sie:**
1. ✅ SendGrid-API-Key korrekt?
2. ✅ Sender-E-Mail verifiziert?
3. ✅ E-Mail-Logs im Dashboard prüfen
4. ✅ SendGrid-Status prüfen

**Lösung:**
- ✅ E-Mail manuell erneut versenden
- ✅ SendGrid-Status prüfen
- ✅ Support kontaktieren

---

### Webhooks kommen nicht an

**Prüfen Sie:**
1. ✅ Webhook-URL korrekt konfiguriert?
2. ✅ Webhook-Secret korrekt?
3. ✅ Firewall blockiert Webhooks?
4. ✅ Webhook-Logs im Dashboard prüfen

**Lösung:**
- ✅ Webhook-URL in WODIFY prüfen
- ✅ Webhook manuell testen
- ✅ Support kontaktieren

---

## 📞 Support

### Wie kann ich Support kontaktieren?

**E-Mail:** support@g3crossfit.com  
**Telefon:** +49 30 12345678  
**Support-Zeiten:** Mo-Fr, 9-18 Uhr

**Bei Support-Anfrage bitte angeben:**
- ✅ Problem-Beschreibung
- ✅ Screenshots (falls möglich)
- ✅ Relevante Logs (aus Dashboard)
- ✅ Zeitpunkt des Problems

---

### Was ist die durchschnittliche Antwortzeit?

**Kritische Probleme:** Innerhalb von 2 Stunden  
**Normale Probleme:** Innerhalb von 24 Stunden  
**Fragen:** Innerhalb von 48 Stunden

---

## 📚 Weitere Ressourcen

### Dokumentation

- 📖 **USER_GUIDE.md** - Ausführliches Benutzerhandbuch
- 📖 **ADMIN_GUIDE.md** - Admin-Handbuch mit technischen Details
- 📖 **TEAM_TRAINING.md** - Team-Schulungsmaterialien
- 📖 **README.md** - Projekt-Übersicht

### Externe Ressourcen

- 🔗 **WODIFY API Dokumentation:** https://api.wodify.com/docs
- 🔗 **SendGrid Dokumentation:** https://docs.sendgrid.com
- 🔗 **FastAPI Dokumentation:** https://fastapi.tiangolo.com

---

**Haben Sie weitere Fragen? Kontaktieren Sie uns! 📞**

**Letzte Aktualisierung:** 2025-01-27

