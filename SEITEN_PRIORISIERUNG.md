# 📋 Seiten-Priorisierung & Status

## ✅ Bestehende Seiten (Status)

### 1. `/contact` - Kontakt-Seite
**Status:** ✅ Funktional, aber Backend-Integration fehlt
- ✅ Booking-Formular vorhanden (`#booking` Anchor)
- ❌ Formular sendet nur `setTimeout` (keine echte API)
- ❌ Keine WODIFY-Integration
- ✅ Design komplett

**Was fehlt:**
- Backend-API-Endpoint: `POST /api/leads`
- WODIFY Lead-Erstellung
- E-Mail-Bestätigung

### 2. `/pricing` - Preise-Seite
**Status:** ✅ Funktional, aber Backend-Integration fehlt
- ✅ Signup-Modal vorhanden
- ✅ Stripe-Integration vorbereitet
- ❌ Keine WODIFY-Integration
- ✅ Design komplett

**Was fehlt:**
- Backend-API-Endpoint: `POST /api/memberships`
- WODIFY Membership-Erstellung
- Stripe Checkout-Integration

### 3. `/schedule` - Kursplan
**Status:** ✅ Sehr gut, nur kleine Optimierungen
- ✅ WODIFY-Integration vorhanden
- ✅ API-Endpoints vorhanden
- ✅ Authentifizierung integriert
- ✅ Design komplett

**Was fehlt:**
- Kleinere Optimierungen
- Live-Availability-Badge

### 4. `/about` - Über uns
**Status:** ✅ Komplett
- ✅ Design komplett
- ✅ Inhalte vorhanden

### 5. `/training` - Training
**Status:** ✅ Komplett
- ✅ Design komplett
- ✅ Inhalte vorhanden

---

## ❌ Fehlende Seiten

### 1. `/coaches` - Coaches-Seite
**Status:** ❌ Fehlt komplett
**Verlinkt in:**
- Header Navigation
- Footer Navigation

**Benötigt:**
- Coach-Profile
- Zertifizierungen
- Spezialisierungen
- Kontakt-Informationen

### 2. `/impressum` - Impressum
**Status:** ❌ Fehlt komplett
**Verlinkt in:**
- Footer Legal Links

**Benötigt:**
- Rechtliche Angaben
- Geschäftsführer
- Adresse
- Kontakt

### 3. `/datenschutz` - Datenschutz
**Status:** ❌ Fehlt komplett
**Verlinkt in:**
- Footer Legal Links
- Pricing-Seite (Checkbox)

**Benötigt:**
- DSGVO-konforme Datenschutzerklärung
- Cookie-Richtlinien
- Datenverarbeitung

### 4. `/agb` - AGB
**Status:** ❌ Fehlt komplett
**Verlinkt in:**
- Footer Legal Links
- Pricing-Seite (Checkbox)

**Benötigt:**
- Allgemeine Geschäftsbedingungen
- Mitgliedschaftsbedingungen
- Stornierungsbedingungen

---

## 🎯 Empfohlene Reihenfolge

### Option A: Fehlende Seiten zuerst (EMPFOHLEN)

**Vorteile:**
- ✅ Keine 404-Fehler mehr
- ✅ Schnell umsetzbar (1-2 Stunden)
- ✅ Bessere User Experience
- ✅ Danach fokussiert auf WODIFY-Integration

**Reihenfolge:**
1. `/coaches` - Coaches-Seite (wichtigste fehlende Seite)
2. `/impressum` - Impressum (rechtlich wichtig)
3. `/datenschutz` - Datenschutz (DSGVO-pflichtig)
4. `/agb` - AGB (rechtlich wichtig)

**Dann:**
5. Contact-Formular Backend-Integration
6. Pricing WODIFY-Integration
7. WODIFY Stats-API

### Option B: Bestehende Seiten komplettieren

**Vorteile:**
- ✅ Funktionale Features zuerst
- ✅ WODIFY-Integration sofort
- ✅ Bessere Conversion-Rate

**Reihenfolge:**
1. Contact-Formular Backend-Integration
2. Pricing WODIFY-Integration
3. WODIFY Stats-API
4. Dann fehlende Seiten

---

## 📊 Vergleich

| Kriterium | Option A (Fehlende zuerst) | Option B (Bestehende komplettieren) |
|-----------|---------------------------|-----------------------------------|
| **Geschwindigkeit** | ⚡ Schnell (1-2h) | 🐌 Langsamer (4-6h) |
| **404-Fehler** | ✅ Keine mehr | ❌ Bleiben bestehen |
| **UX** | ✅ Bessere UX | ⚠️ Gleiche UX |
| **Funktionalität** | ⚠️ Keine neuen Features | ✅ Neue Features |
| **WODIFY-Integration** | ⏳ Später | ✅ Sofort |

---

## 💡 Meine Empfehlung

**Option A: Fehlende Seiten zuerst**

**Warum?**
1. Schnell umsetzbar (1-2 Stunden für alle 4 Seiten)
2. Keine 404-Fehler mehr
3. Bessere User Experience
4. Danach können wir uns voll auf WODIFY-Integration konzentrieren
5. Die bestehenden Seiten funktionieren bereits, nur Backend-Integration fehlt

**Zeitaufwand:**
- `/coaches`: ~30 Minuten
- `/impressum`: ~15 Minuten
- `/datenschutz`: ~30 Minuten
- `/agb`: ~30 Minuten
- **Gesamt: ~1.5 Stunden**

**Danach:**
- Contact-Formular Backend: ~1 Stunde
- Pricing WODIFY: ~1 Stunde
- Stats-API: ~1 Stunde
- **Gesamt: ~3 Stunden**

---

## ✅ Entscheidung

**Was möchtest du zuerst machen?**

1. **Fehlende Seiten erstellen** (empfohlen)
   - Schnell, keine 404-Fehler, bessere UX

2. **Bestehende Seiten komplettieren**
   - Funktionale Features, WODIFY-Integration

3. **Beides parallel**
   - Fehlende Seiten + Backend-Integration gleichzeitig

