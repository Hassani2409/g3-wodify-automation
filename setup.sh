#!/bin/bash

# G3 CrossFit WODIFY Automation - Setup Script
# Dieses Script richtet die lokale Entwicklungsumgebung ein

set -e  # Exit on error

echo "🐻 G3 CrossFit WODIFY Automation - Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Python version
echo "📋 Prüfe Python-Version..."
if ! command -v python3.11 &> /dev/null; then
    echo -e "${RED}❌ Python 3.11 nicht gefunden. Bitte installiere Python 3.11${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python 3.11 gefunden${NC}"
echo ""

# Check Node.js
echo "📋 Prüfe Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js nicht gefunden. Bitte installiere Node.js 20+${NC}"
    exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js Version zu alt. Benötigt Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js gefunden${NC}"
echo ""

# Backend Setup
echo "🔧 Backend-Setup..."
echo ""

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Erstelle virtuelle Umgebung..."
    python3.11 -m venv venv
    echo -e "${GREEN}✅ Virtuelle Umgebung erstellt${NC}"
else
    echo -e "${YELLOW}⚠️  Virtuelle Umgebung existiert bereits${NC}"
fi

# Activate virtual environment
echo "🔌 Aktiviere virtuelle Umgebung..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Aktualisiere pip..."
pip install --upgrade pip --quiet

# Install Python dependencies
echo "📦 Installiere Python-Dependencies..."
pip install -r requirements.txt --quiet
echo -e "${GREEN}✅ Python-Dependencies installiert${NC}"
echo ""

# Create .env from .env.example if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Erstelle .env Datei..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Bitte bearbeite .env und füge deine Werte ein!${NC}"
else
    echo -e "${YELLOW}⚠️  .env Datei existiert bereits${NC}"
fi

# Create logs directory
echo "📁 Erstelle logs-Verzeichnis..."
mkdir -p logs
touch logs/.gitkeep
echo -e "${GREEN}✅ Logs-Verzeichnis erstellt${NC}"
echo ""

# Frontend Setup
echo "🔧 Frontend-Setup..."
echo ""

cd website

# Install Node dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installiere Node-Dependencies..."
    npm install
    echo -e "${GREEN}✅ Node-Dependencies installiert${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules existiert bereits${NC}"
fi

# Create .env.local from .env.local.example if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Erstelle .env.local Datei..."
    cp .env.local.example .env.local
    echo -e "${YELLOW}⚠️  Bitte bearbeite .env.local und setze NEXT_PUBLIC_API_URL!${NC}"
else
    echo -e "${YELLOW}⚠️  .env.local Datei existiert bereits${NC}"
fi

cd ..

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Setup abgeschlossen!${NC}"
echo ""
echo "📋 Nächste Schritte:"
echo ""
echo "1. Bearbeite .env und füge deine Werte ein:"
echo "   nano .env"
echo ""
echo "2. Bearbeite website/.env.local:"
echo "   nano website/.env.local"
echo ""
echo "3. Erstelle Datenbank-Migrationen (optional):"
echo "   alembic revision --autogenerate -m 'Initial schema'"
echo "   alembic upgrade head"
echo ""
echo "4. Starte Backend:"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "5. Starte Frontend (in neuem Terminal):"
echo "   cd website"
echo "   npm run dev"
echo ""
echo "📚 Weitere Informationen:"
echo "   - README.md - Hauptdokumentation"
echo "   - NEXT_STEPS.md - Detaillierte nächste Schritte"
echo "   - CI_CD_GUIDE.md - CI/CD-Anleitung"
echo ""
echo "🎉 Viel Erfolg!"

