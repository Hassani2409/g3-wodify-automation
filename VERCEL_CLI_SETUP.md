# 🔧 Vercel CLI Setup - Problem beheben

## Problem

Vercel erkennt das Projekt als Python-Projekt statt Next.js.

## Lösung mit Vercel CLI

### Schritt 1: Vercel CLI Login

```bash
vercel login
```

Folge den Anweisungen im Browser.

### Schritt 2: Projekt verlinken

```bash
cd /Users/dennisboateng/Downloads/g3-wodify-automation/g3-wodify-automation
vercel link
```

Wähle:
- **Set up and deploy?** → Yes
- **Which scope?** → hassanis-projects-2aebfad7
- **Link to existing project?** → Yes
- **What's the name of your existing project?** → g3-wodify-automation

### Schritt 3: Root Directory setzen

```bash
vercel --cwd website
```

Oder manuell in Vercel Dashboard:
1. Gehe zu: https://vercel.com/hassanis-projects-2aebfad7/g3-wodify-automation/settings/general
2. Unter "Root Directory" setze: `website`
3. Speichere

### Schritt 4: Projekt neu deployen

```bash
vercel --prod
```

Oder aus dem `website`-Verzeichnis:
```bash
cd website
vercel --prod
```

## Alternative: Manuelle Konfiguration

Falls Vercel CLI nicht funktioniert, konfiguriere manuell im Dashboard:

1. **Gehe zu Vercel Dashboard:**
   https://vercel.com/hassanis-projects-2aebfad7/g3-wodify-automation/settings/general

2. **Root Directory setzen:**
   - Scrolle zu "Root Directory"
   - Setze: `website`
   - Klicke "Save"

3. **Build Settings prüfen:**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (oder leer)
   - Output Directory: `.next` (oder leer)
   - Install Command: `npm install` (oder leer)

4. **Redeploy:**
   - Gehe zu Deployments
   - Klicke auf das neueste Deployment
   - Klicke "Redeploy"

## Verifizierung

Nach dem Deployment sollte:
- ✅ Keine Python-Fehler mehr auftreten
- ✅ Next.js erfolgreich builden
- ✅ Website erreichbar sein

---

**Hinweis:** Die `vercel.json` im Root sollte bereits korrekt konfiguriert sein. Falls nicht, setze das Root Directory manuell im Dashboard.

