# 🏠 Hauptseite Analyse & WODIFY-Integration

## 📋 Link-Überprüfung

### ✅ Vorhandene Seiten & Links

| Link | Ziel | Status | Seite vorhanden |
|------|------|--------|-----------------|
| `/` | Homepage | ✅ | ✅ |
| `/training` | Training-Übersicht | ✅ | ✅ |
| `/about` | Über uns | ✅ | ✅ |
| `/coaches` | Coaches | ⚠️ | ❌ Fehlt |
| `/pricing` | Preise | ✅ | ✅ |
| `/contact` | Kontakt | ✅ | ✅ |
| `/schedule` | Kursplan | ✅ | ✅ |
| `/login` | Login | ✅ | ✅ |
| `/impressum` | Impressum | ⚠️ | ❌ Fehlt |
| `/datenschutz` | Datenschutz | ⚠️ | ❌ Fehlt |
| `/agb` | AGB | ⚠️ | ❌ Fehlt |

### ❌ Fehlende Seiten

1. **`/coaches`** - Wird im Header & Footer verlinkt, aber existiert nicht
2. **`/impressum`** - Wird im Footer verlinkt, aber existiert nicht
3. **`/datenschutz`** - Wird im Footer verlinkt, aber existiert nicht
4. **`/agb`** - Wird im Footer verlinkt, aber existiert nicht

---

## 🔗 Link-Analyse nach Komponenten

### Header (`Header.tsx`)

**Navigation Links:**
- ✅ `/` - Homepage
- ✅ `/training` - Training
- ✅ `/about` - Über uns
- ⚠️ `/coaches` - **FEHLT** (Seite existiert nicht)
- ✅ `/pricing` - Preise
- ✅ `/contact` - Kontakt

**CTA Buttons:**
- ✅ `/contact` - "Probetraining" Button

### Footer (`Footer.tsx`)

**Training Links:**
- ✅ `/training#crossfit-beginner` - CrossFit Foundations
- ✅ `/training#crossfit-advanced` - CrossFit Classes
- ✅ `/training#olympic-lifting` - Olympic Weightlifting
- ✅ `/training#strength-conditioning` - Strength & Conditioning

**Company Links:**
- ✅ `/about` - Über uns
- ⚠️ `/coaches` - **FEHLT** (Seite existiert nicht)
- ✅ `/pricing` - Preise
- ✅ `/contact` - Kontakt

**Legal Links:**
- ⚠️ `/impressum` - **FEHLT** (Seite existiert nicht)
- ⚠️ `/datenschutz` - **FEHLT** (Seite existiert nicht)
- ⚠️ `/agb` - **FEHLT** (Seite existiert nicht)

### HeroSection (`HeroSection.tsx`)

**CTA Buttons:**
- ❌ "Kostenloses Probetraining" - **KEIN LINK** (Button ohne href)
- ❌ "Zum Kursplan" - **KEIN LINK** (Button ohne href)

**Statistiken:**
- "500+ Mitglieder" - **KÖNNTE VON WODIFY KOMMEN**
- "30+ Kurse pro Woche" - **KÖNNTE VON WODIFY KOMMEN**

### FeatureCards (`FeatureCards.tsx`)

**CTA Button:**
- ❌ "Jetzt kostenloses Probetraining buchen" - **KEIN LINK** (Button ohne href)

---

## 🔌 WODIFY-Integration-Punkte

### 1. **Statistiken auf der Hauptseite** (HeroSection)

**Aktuell:** Statische Werte
```tsx
{ value: "500+", label: "Zufriedene Mitglieder" }
{ value: "30+", label: "Kurse pro Woche" }
```

**WODIFY-Integration:**
- ✅ Mitgliederanzahl aus WODIFY API abrufen
- ✅ Anzahl Kurse pro Woche aus WODIFY Schedule API
- ✅ Live-Daten statt statische Werte

**Backend-Endpoint erstellen:**
```python
GET /api/stats
{
  "total_members": 523,
  "classes_per_week": 35,
  "active_coaches": 12,
  "training_area": "1000m²"
}
```

### 2. **"Nur noch X Plätze verfügbar" Badge** (HeroSection)

**Aktuell:** Statischer Text "Nur noch 3 Plätze diese Woche verfügbar"

**WODIFY-Integration:**
- ✅ Verfügbare Plätze für diese Woche aus WODIFY Schedule API
- ✅ Dynamisches Badge mit echten Daten
- ✅ Automatische Aktualisierung

**Backend-Endpoint:**
```python
GET /api/schedule/availability/week
{
  "available_spots_this_week": 3,
  "total_spots_this_week": 150,
  "percentage_full": 98
}
```

### 3. **Kursplan-Link** (HeroSection)

**Aktuell:** Button ohne Link

**WODIFY-Integration:**
- ✅ Link zu `/schedule` (bereits vorhanden)
- ✅ Schedule-Seite zeigt bereits WODIFY-Daten

### 4. **Probetraining-Button** (HeroSection & FeatureCards)

**Aktuell:** Button ohne Link

**WODIFY-Integration:**
- ✅ Link zu `/contact` oder `/pricing`
- ✅ Oder: Direktes Lead-Formular mit WODIFY-Integration
- ✅ Automatische Lead-Erstellung in WODIFY

**Neuer Workflow:**
1. User klickt "Probetraining buchen"
2. Formular öffnet sich
3. Daten werden an Backend gesendet
4. Backend erstellt Lead in WODIFY via API
5. WODIFY sendet Webhook zurück
6. Automation-Service sendet Bestätigungs-E-Mail

---

## 🤖 Agenten-Workflow-Integration-Punkte

### 1. **Lead-Nurturing Workflow**

**Trigger:** User klickt "Probetraining buchen" oder füllt Kontaktformular aus

**Workflow:**
```
User-Aktion → Lead-Formular → Backend API → WODIFY Lead erstellen
  ↓
WODIFY Webhook → Automation Service → Lead in DB speichern
  ↓
APScheduler → Nach 24h → Nurturing E-Mail senden
  ↓
Nach 3 Tagen → Follow-up E-Mail
  ↓
Nach 7 Tagen → Finale E-Mail mit Angebot
```

**Integration-Punkte:**
- ✅ `/contact` - Kontaktformular
- ✅ `/pricing` - Preise-Seite (Probetraining-Button)
- ✅ HeroSection - "Kostenloses Probetraining" Button
- ✅ FeatureCards - "Jetzt kostenloses Probetraining buchen" Button

### 2. **Membership-Workflow**

**Trigger:** Neues Mitglied registriert sich über WODIFY

**Workflow:**
```
WODIFY Membership Created Webhook → Backend
  ↓
Automation Service → Member in DB speichern
  ↓
Welcome E-Mail senden (nach X Minuten)
  ↓
Team Notification E-Mail senden
  ↓
Optional: Onboarding-Sequenz starten
```

**Integration-Punkte:**
- ✅ `/webhooks/wodify/membership-created` - Bereits vorhanden
- ✅ `/api/auth/register` - User-Registrierung könnte WODIFY-Member verknüpfen

### 3. **Schedule-Synchronisation**

**Trigger:** Automatisch oder manuell

**Workflow:**
```
APScheduler → Alle 15 Minuten → WODIFY Schedule API abrufen
  ↓
Vergleiche mit lokaler DB
  ↓
Update lokale Schedule-Daten
  ↓
Frontend zeigt aktuelle Daten
```

**Integration-Punkte:**
- ✅ `/schedule` - Schedule-Seite zeigt bereits WODIFY-Daten
- ✅ `/api/schedule/classes` - Backend-Endpoint für Schedule-Daten

### 4. **Live-Availability-Anzeige**

**Trigger:** User besucht Hauptseite oder Schedule-Seite

**Workflow:**
```
Frontend → Backend API → WODIFY Schedule API
  ↓
Berechne verfügbare Plätze für diese Woche
  ↓
Zeige dynamisches Badge/Statistik
```

**Integration-Punkte:**
- ✅ HeroSection - "Nur noch X Plätze verfügbar" Badge
- ✅ Schedule-Seite - Verfügbare Plätze pro Kurs

---

## 📝 Empfohlene Änderungen

### Priorität 1: Fehlende Links beheben

1. **HeroSection.tsx:**
   ```tsx
   // Vorher:
   <Button>Kostenloses Probetraining</Button>
   
   // Nachher:
   <Link href="/contact#booking">
     <Button>Kostenloses Probetraining</Button>
   </Link>
   ```

2. **HeroSection.tsx:**
   ```tsx
   // Vorher:
   <Button>Zum Kursplan</Button>
   
   // Nachher:
   <Link href="/schedule">
     <Button>Zum Kursplan</Button>
   </Link>
   ```

3. **FeatureCards.tsx:**
   ```tsx
   // Vorher:
   <button>Jetzt kostenloses Probetraining buchen</button>
   
   // Nachher:
   <Link href="/contact#booking">
     <button>Jetzt kostenloses Probetraining buchen</button>
   </Link>
   ```

### Priorität 2: Fehlende Seiten erstellen

1. **`/coaches`** - Coaches-Seite
2. **`/impressum`** - Impressum-Seite
3. **`/datenschutz`** - Datenschutz-Seite
4. **`/agb`** - AGB-Seite

### Priorität 3: WODIFY-Integration

1. **Stats-API erstellen:**
   - Backend: `GET /api/stats`
   - Frontend: HeroSection nutzt API statt statische Werte

2. **Availability-API erstellen:**
   - Backend: `GET /api/schedule/availability/week`
   - Frontend: HeroSection zeigt dynamisches Badge

3. **Lead-Formular mit WODIFY-Integration:**
   - Kontaktformular sendet Daten an Backend
   - Backend erstellt Lead in WODIFY
   - Automation-Service startet Nurturing-Workflow

---

## 🎯 Konkrete Integrations-Punkte

### Frontend → Backend → WODIFY

1. **Hauptseite Stats:**
   ```
   HeroSection → GET /api/stats → WODIFY API → Live-Daten
   ```

2. **Probetraining-Button:**
   ```
   Button → /contact#booking → Formular → POST /api/leads → WODIFY API
   ```

3. **Schedule-Seite:**
   ```
   SchedulePage → GET /api/schedule/classes → WODIFY Schedule API
   ```

4. **Availability-Badge:**
   ```
   HeroSection → GET /api/schedule/availability/week → WODIFY Schedule API
   ```

### WODIFY → Backend → Frontend

1. **Membership Created:**
   ```
   WODIFY Webhook → POST /webhooks/wodify/membership-created → Automation Service
   ```

2. **Lead Created:**
   ```
   WODIFY Webhook → POST /webhooks/wodify/lead-created → Automation Service
   ```

3. **Schedule Updates:**
   ```
   WODIFY Schedule API → APScheduler → Update DB → Frontend zeigt neue Daten
   ```

---

## ✅ Nächste Schritte

1. ✅ Fehlende Links in HeroSection & FeatureCards hinzufügen
2. ✅ Fehlende Seiten erstellen (coaches, impressum, datenschutz, agb)
3. ✅ Stats-API erstellen für dynamische Statistiken
4. ✅ Availability-API erstellen für dynamisches Badge
5. ✅ Lead-Formular mit WODIFY-Integration verbinden
6. ✅ Frontend-Komponenten für WODIFY-Daten aktualisieren

---

**Status:** Ready für Implementation 🚀

