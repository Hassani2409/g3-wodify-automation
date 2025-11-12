#!/bin/bash
cd /Users/dennisboateng/Downloads/g3-wodify-automation/g3-wodify-automation
source venv/bin/activate
echo "🚀 Starte Backend-Server..."
echo "📍 Backend läuft auf: http://localhost:8000"
echo "📚 API-Docs: http://localhost:8000/docs"
echo "🔧 Admin Dashboard: http://localhost:8000/admin/"
echo ""
python main.py
