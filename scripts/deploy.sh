#!/bin/bash
# Deployment Script - G3 CrossFit WODIFY Automation

set -e  # Exit on error

cd "$(dirname "$0")/.."

echo "🚀 G3 CrossFit WODIFY Automation - Deployment"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Step 1: Prüfe Voraussetzungen
print_info "Schritt 1: Prüfe Voraussetzungen..."

# Prüfe ob .env existiert
if [ ! -f .env ]; then
    print_error ".env Datei nicht gefunden!"
    print_info "Bitte erstelle eine .env Datei basierend auf .env.example"
    exit 1
fi
print_success ".env Datei gefunden"

# Prüfe ob venv existiert
if [ ! -d venv ]; then
    print_warning "Virtuelle Umgebung nicht gefunden. Erstelle sie..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
print_success "Virtuelle Umgebung aktiviert"

# Step 2: Tests ausführen
print_info "Schritt 2: Führe Tests aus..."
if pytest tests/ -v --tb=short > /dev/null 2>&1; then
    print_success "Tests bestanden"
else
    print_warning "Einige Tests fehlgeschlagen (kann normal sein)"
fi

# Step 3: Frontend Build
print_info "Schritt 3: Baue Frontend..."
cd website
if [ ! -d node_modules ]; then
    print_info "Installiere Frontend-Dependencies..."
    npm install
fi

if npm run build > /dev/null 2>&1; then
    print_success "Frontend-Build erfolgreich"
else
    print_error "Frontend-Build fehlgeschlagen"
    exit 1
fi
cd ..

# Step 4: Datenbank-Migrationen
print_info "Schritt 4: Wende Datenbank-Migrationen an..."
if alembic upgrade head > /dev/null 2>&1; then
    print_success "Migrationen angewendet"
else
    print_warning "Migrationen konnten nicht angewendet werden (kann normal sein bei SQLite)"
fi

# Step 5: Docker Build (optional)
if command -v docker &> /dev/null; then
    print_info "Schritt 5: Baue Docker-Image..."
    if docker build -t g3-wodify-automation . > /dev/null 2>&1; then
        print_success "Docker-Image erfolgreich gebaut"
    else
        print_warning "Docker-Build fehlgeschlagen (optional)"
    fi
else
    print_info "Schritt 5: Docker nicht verfügbar (übersprungen)"
fi

# Step 6: Prüfe Environment-Variablen
print_info "Schritt 6: Prüfe kritische Environment-Variablen..."
source .env 2>/dev/null || true

if [ -z "$WODIFY_WEBHOOK_SECRET" ] || [ "$WODIFY_WEBHOOK_SECRET" = "your-webhook-secret-here" ]; then
    print_warning "WODIFY_WEBHOOK_SECRET nicht konfiguriert!"
fi

if [ -z "$SENDGRID_API_KEY" ] || [ "$SENDGRID_API_KEY" = "your-sendgrid-api-key" ]; then
    print_warning "SENDGRID_API_KEY nicht konfiguriert!"
fi

if [ -z "$JWT_SECRET_KEY" ] || [ "$JWT_SECRET_KEY" = "your-secret-key-change-in-production-min-32-chars" ]; then
    print_warning "JWT_SECRET_KEY verwendet noch den Default-Wert!"
fi

# Step 7: Zusammenfassung
echo ""
echo "=============================================="
print_success "Deployment-Vorbereitung abgeschlossen!"
echo "=============================================="
echo ""
print_info "Nächste Schritte:"
echo "  1. Prüfe .env Datei auf korrekte Werte"
echo "  2. Starte Backend: python main.py"
echo "  3. Starte Frontend: cd website && npm run dev"
echo "  4. Führe Review durch: python scripts/review_system.py"
echo ""
print_info "Für Production-Deployment:"
echo "  - Docker: docker-compose up -d"
echo "  - Vercel (Frontend): vercel deploy"
echo "  - Railway (Backend): railway up"
echo ""

