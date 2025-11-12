#!/bin/bash
# Vercel Deployment Script - Deployt direkt aus website-Verzeichnis

set -e

echo "🚀 Vercel Deployment - G3 CrossFit"
echo "===================================="
echo ""

# Wechsle ins website-Verzeichnis
cd "$(dirname "$0")/website"

echo "📁 Aktuelles Verzeichnis: $(pwd)"
echo ""

# Prüfe ob vercel CLI installiert ist
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI nicht gefunden. Installiere..."
    npm install -g vercel
fi

echo "✅ Vercel CLI gefunden"
echo ""

# Prüfe Login
echo "📋 Prüfe Vercel Login..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Bitte zuerst einloggen:"
    echo "   vercel login"
    echo ""
    echo "Dann führe dieses Script erneut aus."
    exit 1
fi

USER=$(vercel whoami 2>/dev/null || echo "Unknown")
echo "✅ Eingeloggt als: $USER"
echo ""

# Prüfe ob Projekt bereits verlinkt ist
if [ -d ".vercel" ]; then
    echo "✅ Projekt bereits verlinkt"
else
    echo "🔗 Verlinke Projekt..."
    vercel link --yes --scope hassanis-projects-2aebfad7 --project g3-wodify-automation 2>&1 | tail -10
fi

echo ""
echo "🚀 Deploye zu Production..."
echo ""

# Deploy zu Production
vercel --prod --yes

echo ""
echo "✅ Deployment abgeschlossen!"
echo ""
echo "📊 Prüfe das Deployment:"
echo "   https://vercel.com/hassanis-projects-2aebfad7/g3-wodify-automation"
echo ""
