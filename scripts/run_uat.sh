#!/bin/bash
# UAT Test Runner Script

cd "$(dirname "$0")/.."

echo "🧪 UAT-Tests ausführen"
echo "======================"
echo ""

# Prüfe ob Backend läuft
if ! curl -s http://localhost:8000/webhooks/health > /dev/null; then
    echo "⚠️  Backend läuft nicht!"
    echo "Bitte starte das Backend zuerst:"
    echo "  python main.py"
    echo ""
    read -p "Soll das Backend jetzt gestartet werden? (j/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Jj]$ ]]; then
        echo "🚀 Starte Backend..."
        source venv/bin/activate
        python main.py &
        BACKEND_PID=$!
        echo "Backend gestartet (PID: $BACKEND_PID)"
        echo "Warte 5 Sekunden..."
        sleep 5
    else
        exit 1
    fi
fi

# Führe UAT-Tests aus
echo "📋 Führe UAT-Tests aus..."
source venv/bin/activate
python scripts/uat_tests.py

UAT_EXIT_CODE=$?

# Führe Performance-Tests aus
echo ""
echo "📊 Führe Performance-Tests aus..."
python scripts/performance_tests.py

PERF_EXIT_CODE=$?

# Zusammenfassung
echo ""
echo "======================"
echo "Test-Zusammenfassung:"
echo "======================"
if [ $UAT_EXIT_CODE -eq 0 ]; then
    echo "✅ UAT-Tests: Bestanden"
else
    echo "❌ UAT-Tests: Fehlgeschlagen"
fi

if [ $PERF_EXIT_CODE -eq 0 ]; then
    echo "✅ Performance-Tests: Bestanden"
else
    echo "⚠️  Performance-Tests: Warnungen"
fi

# Cleanup
if [ ! -z "$BACKEND_PID" ]; then
    echo ""
    echo "🛑 Stoppe Backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID
fi

exit $((UAT_EXIT_CODE + PERF_EXIT_CODE))

