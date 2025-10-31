# Stripe Integration Setup für G3 CrossFit

Diese Anleitung erklärt, wie du die Stripe-Zahlungsintegration für die G3 CrossFit Website einrichtest.

## 📋 Voraussetzungen

1. **Stripe Account**: Erstelle einen Account auf [stripe.com](https://stripe.com)
2. **Node.js & npm**: Bereits installiert (für das Next.js Projekt)

## 🚀 Setup-Schritte

### 1. Stripe SDK installieren

```bash
cd website
npm install stripe @stripe/stripe-js
```

### 2. Umgebungsvariablen konfigurieren

Kopiere `.env.local.example` zu `.env.local`:

```bash
cp .env.local.example .env.local
```

Fülle die Stripe-Variablen aus:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**API Keys finden:**
- Gehe zu [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)
- Kopiere den **Publishable Key** (beginnt mit `pk_test_`)
- Kopiere den **Secret Key** (beginnt mit `sk_test_`)

### 3. Produkte und Preise in Stripe erstellen

#### A. Mitgliedschaften (Recurring Subscriptions)

Erstelle folgende **Produkte** im [Stripe Dashboard](https://dashboard.stripe.com/products):

**Produkt 1: "2x pro Woche"**
- Preise:
  - Monatlich: 140€/Monat (recurring)
  - 6 Monate: 110€/Monat (recurring, 6 Monate Vertragslaufzeit)
  - 12 Monate: 100€/Monat (recurring, 12 Monate Vertragslaufzeit)

**Produkt 2: "3x pro Woche"**
- Preise:
  - Monatlich: 150€/Monat (recurring)
  - 6 Monate: 130€/Monat (recurring)
  - 12 Monate: 120€/Monat (recurring)

**Produkt 3: "Unlimited"**
- Preise:
  - Monatlich: 175€/Monat (recurring)
  - 6 Monate: 150€/Monat (recurring)
  - 12 Monate: 140€/Monat (recurring)

#### B. Einmalige Zahlungen (One-time Payments)

**Produkt 4: "Drop-In"**
- Preis: 25€ (one-time)

**Produkt 5: "10er-Karte"**
- Preis: 200€ (one-time)

**Produkt 6: "Aufnahmegebühr"**
- Preis: 49€ (one-time)

### 4. Price IDs aktualisieren

Nach dem Erstellen der Produkte, kopiere die **Price IDs** (beginnen mit `price_...`) und aktualisiere:

**Datei: `website/src/lib/stripe.ts`**

```typescript
export const STRIPE_PRICE_IDS = {
  '2x_weekly': {
    monthly: 'price_1ABC...', // Deine echte Price ID
    sixMonth: 'price_2DEF...',
    twelveMonth: 'price_3GHI...',
  },
  '3x_weekly': {
    monthly: 'price_4JKL...',
    sixMonth: 'price_5MNO...',
    twelveMonth: 'price_6PQR...',
  },
  unlimited: {
    monthly: 'price_7STU...',
    sixMonth: 'price_8VWX...',
    twelveMonth: 'price_9YZ...',
  },
  dropIn: 'price_10ABC...',
  tenPack: 'price_11DEF...',
  onboarding: 'price_12GHI...',
};
```

**Datei: `website/src/app/pricing/page.tsx`**

Aktualisiere die `stripePriceId` Felder in den `plans` Array:

```typescript
stripePriceId: {
  monthly: 'price_1ABC...',
  sixMonth: 'price_2DEF...',
  twelveMonth: 'price_3GHI...',
}
```

### 5. API Route aktivieren

**Datei: `website/src/app/api/create-checkout-session/route.ts`**

Entferne die Kommentare (`//` und `/* */`) um den Stripe-Code zu aktivieren:

```typescript
// Zeile 19-22: Uncomment
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Zeile 50-110: Uncomment den gesamten Stripe Checkout Code
```

### 6. Webhook einrichten (für Produktions-Umgebung)

**Lokal testen mit Stripe CLI:**

```bash
# Stripe CLI installieren
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Webhook forwarding starten
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Für Produktion:**

1. Gehe zu [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Klicke auf "Add endpoint"
3. URL: `https://deine-domain.com/api/webhooks/stripe`
4. Events auswählen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Kopiere den **Webhook Secret** und füge ihn zu `.env.local` hinzu

### 7. Success/Cancel Seiten erstellen

Erstelle folgende Seiten:

**`website/src/app/success/page.tsx`** - Erfolgreiche Zahlung
**`website/src/app/cancel/page.tsx`** - Abgebrochene Zahlung

## 🧪 Testen

### Test-Kreditkarten

Stripe bietet Test-Kreditkarten für verschiedene Szenarien:

- **Erfolgreiche Zahlung**: `4242 4242 4242 4242`
- **Fehlgeschlagene Zahlung**: `4000 0000 0000 0002`
- **3D Secure erforderlich**: `4000 0027 6000 3184`

**Weitere Details:** [Stripe Test Cards](https://stripe.com/docs/testing)

### SEPA Lastschrift testen

- IBAN: `DE89370400440532013000`
- Name: Beliebiger Name

## 📊 Ermäßigungen (Studenten/Azubis/Soldaten)

Die Ermäßigungen werden automatisch als Stripe Coupons erstellt:

- 2x pro Woche: -10€
- 3x pro Woche: -15€
- Unlimited: -20€

Im Signup-Modal kann ein Checkbox für "Student/Azubi/Soldat" hinzugefügt werden.

## 🔒 Sicherheit

**Wichtig:**
- ✅ Niemals `STRIPE_SECRET_KEY` im Frontend verwenden
- ✅ Niemals Secret Keys in Git committen
- ✅ `.env.local` ist in `.gitignore` enthalten
- ✅ Webhook-Signaturen immer verifizieren

## 📝 Nächste Schritte

Nach dem Setup:

1. ✅ Teste alle Zahlungsflows im Test-Modus
2. ✅ Erstelle Success/Cancel Seiten
3. ✅ Implementiere Webhook-Handler für Subscription-Events
4. ✅ Füge Email-Benachrichtigungen hinzu (z.B. via SendGrid)
5. ✅ Integriere mit WODIFY API für automatische Mitglieder-Erstellung
6. ✅ Wechsle zu Live-Modus für Produktion

## 🆘 Support

- [Stripe Dokumentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
- [Next.js + Stripe Guide](https://stripe.com/docs/payments/checkout/how-checkout-works)

## 📞 Kontakt

Bei Fragen zur Integration:
- Email: info@g3crossfit.com
- Tel: 0160/5571866

