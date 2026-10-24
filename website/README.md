# 🏋️ G3 CrossFit Premium Website

Eine moderne, hochperformante Next.js 14 Webseite für G3 CrossFit Berlin.

## ✨ Features

### 🎨 Design
- **Premium UI/UX** - Modernes, professionelles Design
- **Framer Motion Animationen** - Smooth Scroll-Animationen
- **Responsive Design** - Perfekt auf allen Geräten
- **Dark Mode Ready** - Vorbereitet für Dark Mode
- **Glassmorphism Effects** - Moderne UI-Effekte

### ⚡ Performance
- **Next.js 14 App Router** - Neueste Next.js Features
- **Server Components** - Optimale Performance
- **Image Optimization** - Automatische Bild-Optimierung
- **Code Splitting** - Schnelle Ladezeiten
- **SEO-Optimiert** - Server-Side Rendering

### 🧩 Komponenten
- ✅ **HeroSection** - Beeindruckende Landing Section
- ✅ **FeatureCards** - Warum G3 CrossFit?
- ✅ **TrainingPrograms** - Preispläne & Programme
- ✅ **AboutPreview** - Über uns Vorschau
- ✅ **CoachPreview** - Team-Vorstellung
- ✅ **Testimonials** - Kundenbewertungen

## 🚀 Quick Start

### Installation
```bash
cd website
npm install
```

### Development Server starten
```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Production Build
```bash
npm run build
npm start
```

## 📁 Projekt-Struktur

```
website/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root Layout
│   │   ├── page.tsx             # Homepage
│   │   └── globals.css          # Global Styles
│   ├── components/
│   │   ├── HeroSection.tsx      # Hero Component
│   │   ├── FeatureCards.tsx     # Features Component
│   │   ├── TrainingPrograms.tsx # Programs Component
│   │   ├── AboutPreview.tsx     # About Component
│   │   ├── CoachPreview.tsx     # Coaches Component
│   │   ├── Testimonials.tsx     # Testimonials Component
│   │   └── ui/
│   │       └── button.tsx       # Button Component
│   └── lib/
│       └── utils.ts             # Utility Functions
├── public/                      # Static Assets
├── package.json
└── tsconfig.json
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Radix UI
- **Deployment**: Vercel (empfohlen)

## 🎯 Nächste Schritte

### Weitere Seiten erstellen
- [ ] `/about` - Über uns Seite
- [ ] `/programs` - Programme & Preise
- [ ] `/coaches` - Team-Seite
- [ ] `/schedule` - Kursplan
- [ ] `/contact` - Kontaktformular
- [ ] `/blog` - News & Blog (optional)

### Features hinzufügen
- [ ] Header/Navigation mit Mobile Menu
- [ ] Footer mit Links & Social Media
- [ ] Kontaktformular mit WODIFY Integration
- [ ] Google Maps Integration
- [ ] Newsletter-Anmeldung
- [ ] Booking-System Integration

### SEO & Performance
- [ ] Metadata für alle Seiten
- [ ] Sitemap.xml generieren
- [ ] Robots.txt konfigurieren
- [ ] Open Graph Images
- [ ] Analytics Integration (Google Analytics)

### Content
- [ ] Echte Bilder vom Gym hinzufügen
- [ ] Coach-Fotos & Bios
- [ ] Testimonial-Fotos
- [ ] Video-Content

## 🔗 Integration mit Backend

Die Webseite kann mit dem WODIFY Automation Backend verbunden werden:

```typescript
// API Routes für Webhooks
// website/src/app/api/contact/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  // Sende an WODIFY Backend
  await fetch('http://localhost:8000/webhooks/lead/created', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  return Response.json({ success: true });
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Farben

### Primary (Emerald)
- `emerald-400`: #34d399
- `emerald-500`: #10b981
- `emerald-600`: #059669

### Secondary (Blue)
- `blue-400`: #60a5fa
- `blue-500`: #3b82f6
- `blue-600`: #2563eb

### Neutral (Zinc)
- `zinc-700`: #3f3f46
- `zinc-800`: #27272a
- `zinc-900`: #18181b

## 🚀 Deployment

### Vercel (Empfohlen)
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel
```

### Andere Plattformen
- **Netlify**: `npm run build` → Deploy `out/` folder
- **AWS Amplify**: Automatisches Deployment via Git
- **DigitalOcean**: Docker Container

## 📝 Anpassungen

### Texte ändern
Alle Texte sind direkt in den Komponenten. Suche nach dem Text und ändere ihn.

### Farben ändern
Ändere die Tailwind-Klassen in den Komponenten:
- `bg-emerald-500` → `bg-blue-500`
- `text-emerald-400` → `text-blue-400`

### Bilder hinzufügen
1. Bilder in `/public/images/` ablegen
2. In Komponenten verwenden:
```tsx
import Image from 'next/image'

<Image 
  src="/images/gym.jpg" 
  alt="G3 CrossFit Gym"
  width={1200}
  height={800}
/>
```

## 🐛 Troubleshooting

### Port bereits belegt
```bash
# Anderen Port verwenden
PORT=3001 npm run dev
```

### Build-Fehler
```bash
# Cache löschen
rm -rf .next
npm run dev
```

## 📞 Support

Bei Fragen oder Problemen:
- **Email**: info@g3crossfit.com
- **GitHub Issues**: [Repository Issues](https://github.com/Hassani2409/g3-wodify-automation/issues)

## 📄 Lizenz

Proprietary - G3 CrossFit Berlin

---

**Erstellt mit ❤️ für G3 CrossFit Berlin**



## Public Wodify calendar

The `/schedule` page does not contain sample courses, availability counts or a fallback timetable.
Until a working public calendar has been verified, it directs members to the Wodify app and the team contact.

To enable an external calendar link, set `NEXT_PUBLIC_WODIFY_CALENDAR_URL` to the verified HTTPS URL
in the deployment environment and rebuild. Do not use a guessed tenant or the old, unavailable link.
Without this variable (or with a malformed or non-HTTPS value), the contact/app guidance stays visible.

Run `npm test` for JSON-LD escaping and public calendar configuration regression tests.
