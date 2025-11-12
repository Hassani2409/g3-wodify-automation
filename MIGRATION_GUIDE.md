# 📚 Datenbank-Migrationen Guide

## Schnellstart

Nach der Installation der Dependencies kannst du die initiale Migration erstellen:

```bash
# 1. Stelle sicher, dass alle Dependencies installiert sind
pip install -r requirements.txt

# 2. Erstelle die initiale Migration
alembic revision --autogenerate -m "Initial schema"

# 3. Wende die Migration an
alembic upgrade head
```

## Automatische Migration-Erstellung

Die Migrationen werden automatisch basierend auf den Modellen in `src/models/database.py` erstellt.

**Wichtig:** Überprüfe immer die generierten Migrationen vor dem Anwenden!

## Manuelle Migration-Erstellung

Falls du eine Migration manuell erstellen möchtest:

```bash
alembic revision -m "Beschreibung der Änderung"
```

Dann bearbeite die generierte Datei in `alembic/versions/`.

## Weitere Informationen

Siehe `alembic/README.md` für detaillierte Informationen.

