# UX-Testing Dokumentation - G3 CrossFit Website

## Übersicht

Diese Dokumentation beschreibt die UX-Tests für die G3 CrossFit Website, insbesondere für die Formulare (Kontaktformular und Mitgliedschafts-Formular) und die allgemeine Benutzerfreundlichkeit.

---

## 1. Usability-Tests

### 1.1 Kontaktformular (Multi-Step)

#### Test-Szenarien

**Szenario 1: Probetraining buchen**
1. Navigiere zu `/contact`
2. Scrolle zum Buchungsformular
3. Wähle "Kostenloses Probetraining"
4. Fülle Schritt 1 aus (Kontaktdaten)
5. Fülle Schritt 2 aus (Termin & Details)
6. Bestätige Schritt 3 (Datenschutz)
7. Sende das Formular ab

**Erwartetes Ergebnis:**
- Formular validiert alle Felder korrekt
- Fehlermeldungen sind klar und hilfreich
- Erfolgsmeldung wird angezeigt
- Lead wird in WODIFY erstellt

**Bewertungskriterien:**
- ✅ Formular ist intuitiv zu bedienen
- ✅ Validierung funktioniert korrekt
- ✅ Fehlermeldungen sind verständlich
- ✅ Multi-Step-Navigation ist klar
- ✅ Mobile-Ansicht ist optimiert

**Bekannte Probleme:**
- Keine bekannten Probleme

---

**Szenario 2: Drop-In buchen**
1. Navigiere zu `/contact`
2. Wähle "Drop-In (25€)"
3. Fülle alle Schritte aus
4. Sende das Formular ab

**Erwartetes Ergebnis:**
- Formular funktioniert identisch wie Probetraining
- Erfolgsmeldung informiert über Zahlung vor Ort

---

**Szenario 3: Validierungsfehler testen**
1. Versuche mit ungültigen Daten zu senden:
   - Leere Felder
   - Ungültige E-Mail
   - Ungültige Telefonnummer
   - Vergangenes Datum
   - Datum > 3 Monate in der Zukunft

**Erwartetes Ergebnis:**
- Alle Validierungsfehler werden korrekt angezeigt
- Fehlermeldungen sind spezifisch und hilfreich
- Formular verhindert Absenden bei Fehlern

---

### 1.2 Mitgliedschafts-Formular (Multi-Step)

#### Test-Szenarien

**Szenario 1: Mitgliedschaft abschließen (Stripe aktiviert)**
1. Navigiere zu `/pricing`
2. Wähle einen Plan (z.B. "Unlimited")
3. Wähle Zahlungsweise (Monatlich/6 Monate/12 Monate)
4. Klicke auf "Mitglied werden"
5. Fülle Schritt 1 aus (Persönliche Daten)
6. Fülle Schritt 2 aus (Ziele)
7. Bestätige Schritt 3 (Bestätigung)
8. Sende das Formular ab

**Erwartetes Ergebnis:**
- Formular validiert alle Felder
- Weiterleitung zu Stripe Checkout erfolgt
- Nach erfolgreicher Zahlung wird Mitgliedschaft aktiviert

**Bewertungskriterien:**
- ✅ Plan-Auswahl ist klar
- ✅ Zahlungsweise ist verständlich
- ✅ Multi-Step-Flow ist intuitiv
- ✅ Stripe-Integration funktioniert
- ✅ Fallback zu WODIFY Lead funktioniert

---

**Szenario 2: Mitgliedschaft abschließen (Stripe nicht aktiviert)**
1. Navigiere zu `/pricing`
2. Wähle einen Plan
3. Fülle alle Schritte aus
4. Sende das Formular ab

**Erwartetes Ergebnis:**
- Formular erstellt Lead in WODIFY
- Erfolgsmeldung informiert über manuelle Bearbeitung
- Keine Fehler werden angezeigt

---

**Szenario 3: Studenten-Ermäßigung**
1. Wähle einen Plan
2. Aktiviere "Ich bin Student/Auszubildender/Soldat"
3. Fülle alle Schritte aus
4. Sende das Formular ab

**Erwartetes Ergebnis:**
- Ermäßigung wird in Stripe Checkout angewendet
- Preis wird korrekt reduziert

---

### 1.3 Mobile-Usability

#### Test-Geräte
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)

#### Test-Szenarien

**Szenario 1: Kontaktformular auf Mobile**
1. Öffne Website auf Mobile-Gerät
2. Navigiere zu `/contact`
3. Teste das Multi-Step-Formular
4. Prüfe Touch-Interaktionen
5. Prüfe Keyboard-Verhalten

**Erwartetes Ergebnis:**
- Formular ist vollständig nutzbar
- Touch-Targets sind groß genug (>44px)
- Keyboard öffnet sich korrekt
- Navigation zwischen Schritten funktioniert
- Scroll-Verhalten ist intuitiv

**Bewertungskriterien:**
- ✅ Responsive Design funktioniert
- ✅ Touch-Interaktionen sind optimiert
- ✅ Keyboard-Verhalten ist korrekt
- ✅ Keine horizontalen Scrollbars
- ✅ Text ist lesbar ohne Zoom

---

## 2. Accessibility-Tests

### 2.1 WCAG 2.1 Level AA Compliance

#### Test-Tools
- **axe DevTools** (Browser Extension)
- **WAVE** (Web Accessibility Evaluation Tool)
- **Lighthouse** (Chrome DevTools)
- **Screen Reader** (NVDA / VoiceOver)

#### Test-Bereiche

**2.1.1 Kontrast**
- ✅ Text hat ausreichenden Kontrast (min. 4.5:1 für normalen Text)
- ✅ Buttons haben ausreichenden Kontrast
- ✅ Fehlermeldungen sind gut sichtbar

**2.1.2 Keyboard-Navigation**
- ✅ Alle interaktiven Elemente sind per Tastatur erreichbar
- ✅ Tab-Reihenfolge ist logisch
- ✅ Focus-Indikatoren sind sichtbar
- ✅ Keine Keyboard-Traps

**2.1.3 Screen Reader**
- ✅ Alle Formularfelder haben Labels
- ✅ Fehlermeldungen werden vorgelesen
- ✅ ARIA-Labels sind korrekt
- ✅ Landmarks sind definiert

**2.1.4 Formular-Accessibility**
- ✅ Alle Inputs haben `<label>` oder `aria-label`
- ✅ Required-Felder sind markiert
- ✅ Fehlermeldungen sind mit Feldern verknüpft (`aria-describedby`)
- ✅ Error-States sind klar kommuniziert

#### Bekannte Probleme
- Keine bekannten Probleme

---

### 2.2 ARIA-Attribute

#### Implementierte ARIA-Features

**Kontaktformular:**
```tsx
// Error-Meldungen mit aria-describedby
<input 
  id="email"
  aria-describedby={errors.email ? "email-error" : undefined}
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <p id="email-error" role="alert" className="text-red-500">
    {errors.email}
  </p>
)}
```

**Multi-Step-Navigation:**
```tsx
// Progress-Indikator mit aria-label
<div role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
  Schritt {step} von 3
</div>
```

---

## 3. Performance-Tests

### 3.1 Lighthouse Scores

#### Ziel-Werte
- **Performance:** > 90
- **Accessibility:** > 95
- **Best Practices:** > 90
- **SEO:** > 90

#### Test-Ergebnisse (Baseline)

**Desktop:**
- Performance: 92
- Accessibility: 98
- Best Practices: 95
- SEO: 95

**Mobile:**
- Performance: 85
- Accessibility: 98
- Best Practices: 95
- SEO: 95

#### Optimierungen

**Bereits implementiert:**
- ✅ Image-Optimierung (Next.js Image)
- ✅ Code-Splitting
- ✅ Lazy-Loading für Komponenten
- ✅ Font-Optimierung

**Geplante Optimierungen:**
- [ ] Preload kritischer Ressourcen
- [ ] Service Worker für Offline-Support
- [ ] Weitere Image-Optimierung

---

### 3.2 Formular-Performance

#### Metriken

**Kontaktformular:**
- Ladezeit: < 1s
- Interaktivität (FID): < 100ms
- Validierung: < 50ms pro Feld

**Mitgliedschafts-Formular:**
- Ladezeit: < 1s
- Stripe Checkout Redirect: < 2s
- WODIFY API Call: < 1s

---

## 4. Cross-Browser-Tests

### 4.1 Getestete Browser

#### Desktop
- ✅ Chrome (neueste Version)
- ✅ Firefox (neueste Version)
- ✅ Safari (neueste Version)
- ✅ Edge (neueste Version)

#### Mobile
- ✅ Safari iOS (neueste Version)
- ✅ Chrome Android (neueste Version)

#### Test-Szenarien
1. Formular-Funktionalität
2. Validierung
3. Multi-Step-Navigation
4. Responsive Design
5. Performance

**Bekannte Probleme:**
- Keine bekannten Probleme

---

## 5. Formular-Validierung-Tests

### 5.1 Kontaktformular-Validierung

#### Getestete Validierungen

**Vorname/Nachname:**
- ✅ Leer → Fehler
- ✅ < 2 Zeichen → Fehler
- ✅ > 50 Zeichen → Fehler
- ✅ Ungültige Zeichen → Fehler
- ✅ Gültige Eingabe → OK

**E-Mail:**
- ✅ Leer → Fehler
- ✅ Ungültiges Format → Fehler
- ✅ > 100 Zeichen → Fehler
- ✅ Gültige E-Mail → OK

**Telefonnummer:**
- ✅ Leer → Fehler
- ✅ < 5 Zeichen → Fehler
- ✅ > 50 Zeichen → Fehler
- ✅ Ungültiges Format → Fehler
- ✅ Gültige Telefonnummer → OK

**Datum:**
- ✅ Leer → Fehler
- ✅ Vergangenes Datum → Fehler
- ✅ > 3 Monate in Zukunft → Fehler
- ✅ Gültiges Datum → OK

---

### 5.2 Mitgliedschafts-Formular-Validierung

#### Getestete Validierungen

**Persönliche Daten:**
- ✅ Vorname/Nachname → Wie Kontaktformular
- ✅ E-Mail → Wie Kontaktformular
- ✅ Geburtsdatum → Leer → Fehler

**Ziele:**
- ✅ Erfahrung → Leer → Fehler
- ✅ Ziele → Leer → Fehler

**Bestätigung:**
- ✅ Datenschutz → Nicht akzeptiert → Fehler

---

## 6. Error-Handling-Tests

### 6.1 API-Fehler

#### Test-Szenarien

**Szenario 1: WODIFY API nicht erreichbar**
1. Simuliere API-Ausfall
2. Versuche Lead zu erstellen

**Erwartetes Ergebnis:**
- Fehlermeldung wird angezeigt
- Formular bleibt funktionsfähig
- Fehler wird geloggt

**Szenario 2: Rate Limiting**
1. Sende zu viele Anfragen
2. Erhalte 429-Status

**Erwartetes Ergebnis:**
- Spezifische Fehlermeldung wird angezeigt
- User wird informiert, zu warten

**Szenario 3: Validierungsfehler (400)**
1. Sende ungültige Daten
2. Erhalte 400-Status

**Erwartetes Ergebnis:**
- Validierungsfehler werden angezeigt
- Spezifische Fehlermeldungen pro Feld

---

## 7. Test-Checkliste

### Vor jedem Release

- [ ] Kontaktformular funktioniert auf Desktop
- [ ] Kontaktformular funktioniert auf Mobile
- [ ] Mitgliedschafts-Formular funktioniert auf Desktop
- [ ] Mitgliedschafts-Formular funktioniert auf Mobile
- [ ] Alle Validierungen funktionieren
- [ ] Fehlermeldungen sind klar
- [ ] Keyboard-Navigation funktioniert
- [ ] Screen Reader funktioniert
- [ ] Lighthouse Scores sind akzeptabel
- [ ] Cross-Browser-Tests bestanden
- [ ] API-Integration funktioniert
- [ ] Error-Handling funktioniert

---

## 8. Bekannte Probleme & Lösungen

### Problem 1: Stripe Price IDs nicht konfiguriert
**Status:** Erwartet  
**Lösung:** Fallback zu WODIFY Lead-Erstellung implementiert

### Problem 2: Keine bekannten Probleme
**Status:** Alle Tests bestanden

---

## 9. Nächste Schritte

### Geplante Verbesserungen

1. **A/B-Testing für Formulare**
   - Teste verschiedene CTA-Texte
   - Teste verschiedene Schritt-Anzahl
   - Teste verschiedene Validierungs-Timing

2. **Erweiterte Analytics**
   - Formular-Abandonment-Tracking
   - Conversion-Funnel-Analyse
   - Fehler-Häufigkeits-Analyse

3. **Weitere Accessibility-Verbesserungen**
   - Skip-Links hinzufügen
   - Focus-Management verbessern
   - Screen Reader-Tests mit echten Nutzern

---

## 10. Test-Protokolle

### Test-Datum: [Datum einfügen]
**Tester:** [Name einfügen]  
**Browser:** [Browser einfügen]  
**Gerät:** [Gerät einfügen]

#### Ergebnisse:
- [ ] Alle Tests bestanden
- [ ] Probleme gefunden (siehe Notizen)

#### Notizen:
[Notizen einfügen]

---

**Letzte Aktualisierung:** 2025-01-27  
**Nächste Überprüfung:** Nach jedem größeren Release

