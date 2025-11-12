# 🚀 Vercel Deployment Guide

## Status

✅ **Code erfolgreich auf GitHub gepusht!**
- Commit: `55e23c5`
- Branch: `main`
- Repository: `Hassani2409/g3-wodify-automation`

## Vercel Deployment

Das Projekt ist bereits mit Vercel verbunden:
- **Vercel Project**: `g3-wodify-automation`
- **Deployment URL**: https://vercel.com/hassanis-projects-2aebfad7/g3-wodify-automation/3NRHJvuVGMBZUvweYPmoqx1ZAT56

### Automatisches Deployment

Vercel sollte automatisch ein neues Deployment starten, nachdem der Code auf GitHub gepusht wurde.

**Prüfe den Deployment-Status:**
1. Gehe zu: https://vercel.com/hassanis-projects-2aebfad7/g3-wodify-automation
2. Prüfe die neuesten Deployments
3. Warte auf Build-Abschluss

### Manuelles Deployment

Falls das automatische Deployment nicht startet:

```bash
# Installiere Vercel CLI (falls noch nicht installiert)
npm i -g vercel

# Im website-Verzeichnis
cd website

# Deploy zu Vercel
vercel --prod
```

## Environment Variables in Vercel

**Wichtig:** Stelle sicher, dass folgende Environment Variables in Vercel gesetzt sind:

### Erforderliche Variablen

1. **NEXT_PUBLIC_API_URL**
   - Wert: `https://deine-backend-url.com`
   - Beispiel: `https://g3-wodify-backend.railway.app`

### Optional (für erweiterte Features)

2. **NEXT_PUBLIC_ANALYTICS_ID** (optional)
   - Für Analytics-Integration

3. **NEXT_PUBLIC_STRIPE_PUBLIC_KEY** (optional)
   - Für Shop/Checkout-Funktionalität

### Environment Variables in Vercel setzen

1. Gehe zu: https://vercel.com/hassanis-projects-2aebfad7/g3-wodify-automation/settings/environment-variables
2. Füge die Variablen hinzu:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Deine Backend-URL
   - Environment: Production, Preview, Development
3. Klicke auf "Save"

**Nach dem Setzen der Environment Variables:**
- Ein neues Deployment wird automatisch ausgelöst
- Oder manuell: Klicke auf "Redeploy" im Deployment-Dashboard

## Vercel-Konfiguration

Die `vercel.json` Datei ist bereits konfiguriert:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Konfiguration:**
- ✅ Framework: Next.js (automatisch erkannt)
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`
- ✅ Region: Frankfurt (fra1) - für bessere Performance in Deutschland

## Root Directory

**Wichtig:** Stelle sicher, dass das Root Directory in Vercel auf `website` gesetzt ist:

1. Gehe zu: https://vercel.com/hassanis-projects-2aebfad7/g3-wodify-automation/settings/general
2. Unter "Root Directory" sollte `website` stehen
3. Falls nicht, ändere es zu `website` und speichere

## Build-Logs prüfen

Nach dem Deployment:

1. Gehe zum Deployment: https://vercel.com/hassanis-projects-2aebfad7/g3-wodify-automation/3NRHJvuVGMBZUvweYPmoqx1ZAT56
2. Klicke auf "Runtime Logs" oder "Build Logs"
3. Prüfe auf Fehler oder Warnungen

## Häufige Probleme

### Build schlägt fehl

**Problem:** `NEXT_PUBLIC_API_URL` nicht gesetzt
**Lösung:** Setze die Environment Variable in Vercel

**Problem:** Dependencies fehlen
**Lösung:** Prüfe `package.json` und stelle sicher, dass alle Dependencies vorhanden sind

### Deployment lädt nicht

**Problem:** Backend-URL falsch konfiguriert
**Lösung:** Prüfe `NEXT_PUBLIC_API_URL` in Vercel Environment Variables

**Problem:** CORS-Fehler
**Lösung:** Stelle sicher, dass das Backend CORS für die Vercel-Domain erlaubt

## Post-Deployment Checkliste

Nach erfolgreichem Deployment:

- [ ] ✅ Frontend erreichbar: `https://g3-wodify-automation.vercel.app`
- [ ] ✅ Homepage lädt korrekt
- [ ] ✅ Alle Seiten funktionieren
- [ ] ✅ API-Verbindung funktioniert (Backend muss laufen)
- [ ] ✅ Mobile-Ansicht getestet
- [ ] ✅ Performance akzeptabel

## Custom Domain (Optional)

Falls eine Custom Domain verwendet werden soll:

1. Gehe zu: https://vercel.com/hassanis-projects-2aebfad7/g3-wodify-automation/settings/domains
2. Füge deine Domain hinzu
3. Folge den DNS-Anweisungen

## Monitoring

Vercel bietet integrierte Monitoring-Tools:

- **Runtime Logs**: Fehler und Logs in Echtzeit
- **Observability**: App Health & Performance
- **Speed Insights**: Performance-Metriken von echten Usern
- **Web Analytics**: Besucher & Traffic-Analyse

Zugriff über das Deployment-Dashboard.

---

## Nächste Schritte

1. ✅ Code auf GitHub gepusht
2. ⏳ Warte auf Vercel-Deployment
3. ⏳ Prüfe Deployment-Status
4. ⏳ Setze Environment Variables (falls noch nicht geschehen)
5. ⏳ Teste die deployed Website
6. ⏳ Führe System Review durch

---

**Viel Erfolg mit dem Vercel-Deployment! 🚀**

