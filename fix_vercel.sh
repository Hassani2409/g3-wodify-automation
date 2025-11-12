#!/bin/bash
# Vercel Fix Script

echo "🔧 Vercel Deployment Fix"
echo "========================"
echo ""

# Prüfe ob vercel CLI installiert ist
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI nicht gefunden. Installiere..."
    npm install -g vercel
fi

echo "✅ Vercel CLI gefunden"
echo ""

# Prüfe Login-Status
echo "📋 Prüfe Vercel Login-Status..."
if vercel whoami &> /dev/null; then
    echo "✅ Bereits eingeloggt"
    USER=$(vercel whoami)
    echo "   User: $USER"
else
    echo "⚠️  Nicht eingeloggt"
    echo ""
    echo "Bitte führe aus: vercel login"
    echo "Dann führe dieses Script erneut aus."
    exit 1
fi

echo ""
echo "🔗 Verlinke Projekt..."
cd website

# Verlinke Projekt
vercel link --yes --scope hassanis-projects-2aebfad7 --project g3-wodify-automation 2>&1 | grep -v "Error\|Warning" || echo "Projekt bereits verlinkt"

echo ""
echo "📝 Setze Root Directory..."
# Root Directory wird durch vercel.json gesetzt, aber wir können es auch explizit setzen
echo "Root Directory sollte 'website' sein (wird durch vercel.json gesetzt)"

echo ""
echo "🚀 Deploye zu Production..."
vercel --prod --yes

echo ""
echo "✅ Fertig! Prüfe das Deployment in Vercel Dashboard."
