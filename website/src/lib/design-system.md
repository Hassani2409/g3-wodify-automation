# G3 CrossFit Design System

**Version:** 1.0.0  
**Letzte Aktualisierung:** 2025-01-27

---

## Übersicht

Das G3 CrossFit Design System bietet eine konsistente Basis für alle UI-Komponenten der Website. Es basiert auf Tailwind CSS v4 und verwendet Radix UI für zugängliche Komponenten.

---

## Farbpalette

### Primary (Grün)
- **Primary 50:** `#E8F3ED` - Sehr helles Grün
- **Primary 100:** `#D1E7DB` - Helles Grün
- **Primary 200:** `#A3CFB7` - Hellgrün
- **Primary 300:** `#75B793` - Mittelgrün
- **Primary 400:** `#479F6F` - Grün
- **Primary 500:** `#2A5D3C` - Hauptfarbe (Standard)
- **Primary 600:** `#224A30` - Dunkelgrün
- **Primary 700:** `#193824` - Sehr dunkelgrün
- **Primary 800:** `#112518` - Fast schwarz-grün
- **Primary 900:** `#08130C` - Schwarz-grün

**Verwendung:** Hauptfarbe für Buttons, Links, Akzente

### Secondary (Hellgrün)
- **Secondary 50:** `#F0F8F2` - Sehr helles Sekundärgrün
- **Secondary 500:** `#6BAF7E` - Hauptfarbe
- **Secondary 900:** `#15231A` - Dunkelste Variante

**Verwendung:** Sekundäre Buttons, Hintergründe

### Accent (Orange)
- **Accent 50:** `#FFF3EF` - Sehr helles Orange
- **Accent 500:** `#FF6B35` - Hauptfarbe (Standard)
- **Accent 600:** `#FF4500` - Dunkleres Orange
- **Accent 900:** `#661B00` - Dunkelste Variante

**Verwendung:** CTAs, Warnungen, Highlights

### Neutrale Farben
- **Background:** `#F9F5F0` - Beige Hintergrund
- **Card:** `#FFFFFF` - Weiß für Karten
- **Muted:** `#E5E7EB` - Grau für deaktivierte Elemente
- **Foreground:** `#1F2937` - Dunkelgrau für Text

---

## Typografie

### Schriftarten

#### Heading Font: Barlow Condensed
- **Gewichte:** 400, 500, 600, 700
- **Verwendung:** Überschriften (h1-h6)
- **CSS Variable:** `--font-heading`

#### Body Font: Open Sans
- **Gewichte:** 300, 400, 600, 700
- **Verwendung:** Fließtext, Beschreibungen
- **CSS Variable:** `--font-sans`

#### Button Font: Montserrat
- **Gewichte:** 500, 600, 700
- **Verwendung:** Buttons, Labels
- **CSS Variable:** `--font-button`

### Schriftgrößen

```css
/* Tailwind Standard-Größen */
text-xs    /* 0.75rem / 12px */
text-sm    /* 0.875rem / 14px */
text-base  /* 1rem / 16px */
text-lg    /* 1.125rem / 18px */
text-xl    /* 1.25rem / 20px */
text-2xl   /* 1.5rem / 24px */
text-3xl   /* 1.875rem / 30px */
text-4xl   /* 2.25rem / 36px */
```

### Zeilenhöhen

- **Tight:** `leading-tight` - 1.25
- **Normal:** `leading-normal` - 1.5
- **Relaxed:** `leading-relaxed` - 1.75

---

## Breakpoints (Responsive Design)

### Mobile-First Ansatz

```css
/* Tailwind Breakpoints */
sm:  640px   /* Small devices (landscape phones) */
md:  768px   /* Medium devices (tablets) */
lg:  1024px  /* Large devices (desktops) */
xl:  1280px  /* Extra large devices */
2xl: 1536px  /* 2X Extra large devices */
```

### Verwendung in Tailwind

```tsx
// Mobile-first: Standard ist Mobile, größere Breakpoints überschreiben
<div className="text-sm md:text-base lg:text-lg">
  Responsive Text
</div>

// Grid-Layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

---

## Komponenten

### Button

**Variants:**
- `default` - Primary Button (Grün)
- `destructive` - Destruktive Aktionen (Rot)
- `outline` - Outline Button
- `secondary` - Sekundärer Button
- `ghost` - Ghost Button (transparent)
- `link` - Link-ähnlicher Button

**Sizes:**
- `sm` - Small
- `default` - Standard
- `lg` - Large
- `icon` - Icon-only

**Beispiel:**
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg">
  Probetraining buchen
</Button>
```

### Card

**Komponenten:**
- `Card` - Container
- `CardHeader` - Header-Bereich
- `CardTitle` - Titel
- `CardDescription` - Beschreibung
- `CardContent` - Hauptinhalt
- `CardFooter` - Footer-Bereich

**Beispiel:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Training</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Dialog

**Komponenten:**
- `Dialog` - Root-Container
- `DialogTrigger` - Trigger-Button
- `DialogContent` - Dialog-Inhalt
- `DialogHeader` - Header
- `DialogTitle` - Titel
- `DialogDescription` - Beschreibung
- `DialogFooter` - Footer

**Beispiel:**
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>Öffnen</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Titel</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### Tabs

**Komponenten:**
- `Tabs` - Root-Container
- `TabsList` - Tab-Liste
- `TabsTrigger` - Tab-Trigger
- `TabsContent` - Tab-Inhalt

**Beispiel:**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Übersicht</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Inhalt 1</TabsContent>
  <TabsContent value="details">Inhalt 2</TabsContent>
</Tabs>
```

---

## Spacing System

Tailwind verwendet ein 4px-basiertes Spacing-System:

```css
0    /* 0px */
0.5  /* 2px */
1    /* 4px */
2    /* 8px */
3    /* 12px */
4    /* 16px */
5    /* 20px */
6    /* 24px */
8    /* 32px */
10   /* 40px */
12   /* 48px */
16   /* 64px */
20   /* 80px */
24   /* 96px */
```

**Verwendung:**
```tsx
<div className="p-4 m-2 gap-6">
  {/* padding: 16px, margin: 8px, gap: 24px */}
</div>
```

---

## Border Radius

```css
--radius-button: 8px;   /* Buttons */
--radius-card: 12px;     /* Cards */
```

**Tailwind Klassen:**
- `rounded-sm` - 2px
- `rounded-md` - 6px
- `rounded-lg` - 8px
- `rounded-xl` - 12px
- `rounded-full` - 9999px

---

## Shadows

```tsx
shadow-sm    /* Kleiner Schatten */
shadow       /* Standard Schatten */
shadow-md    /* Mittlerer Schatten */
shadow-lg    /* Großer Schatten */
shadow-xl    /* Sehr großer Schatten */
shadow-2xl   /* Extrem großer Schatten */
```

---

## Animationen & Transitions

### Standard Transition
```tsx
className="transition-all duration-300"
```

### Hover Effects
```tsx
className="hover:scale-105 hover:shadow-lg transition-all duration-300"
```

### Framer Motion
Für komplexere Animationen verwenden wir Framer Motion:

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

---

## Accessibility (A11y)

### Best Practices

1. **Semantisches HTML:** Verwende korrekte HTML-Tags
2. **ARIA-Labels:** Für interaktive Elemente ohne Text
3. **Keyboard Navigation:** Alle interaktiven Elemente müssen per Tastatur erreichbar sein
4. **Focus States:** Sichtbare Focus-Indikatoren
5. **Color Contrast:** Mindestens 4.5:1 für normalen Text, 3:1 für große Texte

### Radix UI Komponenten

Alle Radix UI Komponenten sind standardmäßig zugänglich und erfüllen WCAG 2.1 Level AA.

---

## Performance-Optimierungen

### Image Optimization
- Next.js Image-Komponente verwenden
- AVIF und WebP Formate
- Lazy Loading für Bilder unterhalb des Viewports

### Code Splitting
- Automatisches Code Splitting durch Next.js
- Dynamic Imports für große Komponenten
- Route-based Code Splitting

### Lazy Loading
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Optional: Nur Client-side rendern
});
```

---

## Verwendung

### In Komponenten

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MyComponent() {
  return (
    <Card>
      <CardContent>
        <Button variant="default">Klick mich</Button>
      </CardContent>
    </Card>
  );
}
```

### Custom Styling

```tsx
// Mit Tailwind Klassen
<Button className="bg-accent-500 hover:bg-accent-600">
  Custom Button
</Button>

// Mit CSS Variables
<div style={{ backgroundColor: 'var(--color-primary-500)' }}>
  Custom Background
</div>
```

---

## Nächste Schritte

- [ ] Weitere Komponenten hinzufügen (Tooltip, Popover, etc.)
- [ ] Dark Mode Support
- [ ] Animation Library erweitern
- [ ] Design Tokens dokumentieren

---

**Letzte Aktualisierung:** 2025-01-27

