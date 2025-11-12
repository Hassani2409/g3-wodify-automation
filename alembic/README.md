# Alembic Database Migrations

Dieses Verzeichnis enthält die Datenbank-Migrationen für das G3 CrossFit WODIFY Automation Projekt.

## 📋 Übersicht

Alembic wird verwendet, um Datenbank-Schema-Änderungen zu verwalten und zu versionieren.

## 🚀 Erste Schritte

### 1. Dependencies installieren

Stelle sicher, dass alle Dependencies installiert sind:

```bash
pip install -r requirements.txt
```

### 2. Umgebungsvariablen konfigurieren

Stelle sicher, dass deine `.env` Datei korrekt konfiguriert ist:

```bash
cp .env.example .env
# Bearbeite .env und füge deine Datenbank-URL hinzu
```

### 3. Initiale Migration erstellen

Wenn du die Migrationen zum ersten Mal einrichtest:

```bash
# Erstelle die initiale Migration basierend auf den aktuellen Modellen
alembic revision --autogenerate -m "Initial schema"

# Wende die Migration an
alembic upgrade head
```

## 📝 Migrationen verwenden

### Neue Migration erstellen

```bash
# Automatisch basierend auf Modell-Änderungen
alembic revision --autogenerate -m "Beschreibung der Änderung"

# Manuell (leere Migration)
alembic revision -m "Beschreibung der Änderung"
```

### Migrationen anwenden

```bash
# Auf die neueste Version upgraden
alembic upgrade head

# Auf eine spezifische Revision upgraden
alembic upgrade <revision_id>

# Einen Schritt zurückgehen
alembic downgrade -1

# Auf eine spezifische Revision downgraden
alembic downgrade <revision_id>
```

### Migration-Status prüfen

```bash
# Aktuelle Revision anzeigen
alembic current

# Migrations-Historie anzeigen
alembic history

# Unterschiede zwischen aktueller DB und Modellen anzeigen
alembic check
```

## 🔧 Konfiguration

Die Alembic-Konfiguration befindet sich in:
- `alembic.ini` - Hauptkonfigurationsdatei
- `alembic/env.py` - Python-Konfiguration (verwendet Settings aus `config/settings.py`)

Die Datenbank-URL wird automatisch aus `config.settings.database_url` geladen.

## 📁 Verzeichnisstruktur

```
alembic/
├── README.md          # Diese Datei
├── env.py             # Alembic-Umgebungskonfiguration
├── script.py.mako     # Template für neue Migrationen
└── versions/          # Migrations-Dateien
    └── <revision>_<description>.py
```

## ⚠️ Wichtige Hinweise

1. **Backup vor Migrationen**: Erstelle immer ein Backup der Datenbank vor größeren Migrationen
2. **Test-Umgebung**: Teste Migrationen zuerst in einer Test-Umgebung
3. **Review**: Überprüfe generierte Migrationen vor dem Anwenden
4. **Production**: In Production sollten Migrationen als Teil des Deployment-Prozesses ausgeführt werden

## 🐛 Troubleshooting

### Problem: "ModuleNotFoundError: No module named 'pydantic_settings'"

**Lösung:**
```bash
pip install -r requirements.txt
```

### Problem: "Target database is not up to date"

**Lösung:**
```bash
alembic upgrade head
```

### Problem: "Can't locate revision identified by 'xxxx'"

**Lösung:**
```bash
# Prüfe die aktuelle Revision
alembic current

# Prüfe die Historie
alembic history

# Falls nötig, markiere die aktuelle Revision manuell
alembic stamp head
```

## 📚 Weitere Ressourcen

- [Alembic Dokumentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Dokumentation](https://docs.sqlalchemy.org/)

