# 🚀 Quick Start - Deployment & Review

## 1. Deployment vorbereiten

\`\`\`bash
# .env erstellen und konfigurieren
cp .env.example .env
nano .env

# Deployment ausführen
./scripts/deploy.sh
\`\`\`

## 2. System starten

\`\`\`bash
# Backend (Terminal 1)
source venv/bin/activate
python main.py

# Frontend (Terminal 2)
cd website
npm run dev
\`\`\`

## 3. System Review durchführen

\`\`\`bash
# Automatisches Review
python scripts/review_system.py

# UAT-Tests
python scripts/uat_tests.py

# Performance-Tests
python scripts/performance_tests.py
\`\`\`

## 4. Seite für Seite durchgehen

Siehe: \`QUICK_DEPLOY.md\` für detaillierte Anleitung

---

**Bereit für Kunden-Präsentation! 🎉**
