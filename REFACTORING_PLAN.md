# Refactoring-Plan - G3 CrossFit Vollautomatisierung

**Erstellt:** 2025-01-27  
**Status:** Code-Analyse und Refactoring-Plan  
**Ziel:** Code-Qualität verbessern, Wartbarkeit erhöhen

---

## Code-Analyse

### Bestehende Code-Struktur

**Stärken:**
- ✅ Klare Trennung von Concerns (API, Services, Models)
- ✅ Pydantic-Modelle für Validierung
- ✅ Logging mit Loguru
- ✅ Error-Handling vorhanden
- ✅ Type Hints verwendet

**Schwächen:**
- ⚠️ Einige TODO-Kommentare vorhanden
- ⚠️ Scheduler-Service verwendet Memory-JobStore (nicht persistent)
- ⚠️ Fehlende E-Mail-Templates für neue Workflows
- ⚠️ Lead-State-Management fehlt
- ⚠️ Keine Retry-Logik für WODIFY API-Calls

---

## Refactoring-Prioritäten

### Priorität 1: Kritisch (Vor Production)

#### 1.1 Scheduler-Service: Persistent Job Store

**Problem:**
- Aktuell: Memory-JobStore (Jobs gehen bei Neustart verloren)
- Impact: Hoch - Geplante E-Mails gehen verloren

**Lösung:**
- Redis-JobStore für Production
- SQLite-JobStore für Development
- Job-Persistence sicherstellen

**Dateien:**
- `src/services/scheduler_service.py`

**Änderungen:**
```python
# Vorher:
jobstores = {
    'default': MemoryJobStore()
}

# Nachher:
if settings.app_env == "production":
    jobstores = {
        'default': RedisJobStore(host=settings.redis_host)
    }
else:
    jobstores = {
        'default': SQLAlchemyJobStore(url=settings.database_url)
    }
```

---

#### 1.2 Lead-State-Management

**Problem:**
- Kein State-Management für Lead-Nurturing-Sequenz
- Keine Möglichkeit, Sequenz-Status zu tracken

**Lösung:**
- `nurturing_state` Feld zu Lead-Modell hinzufügen
- State-Machine implementieren
- Sequenz-Status in Datenbank speichern

**Dateien:**
- `src/models/database.py` - Lead-Modell erweitern
- `src/models/wodify.py` - LeadStatus-Enum erweitern
- `src/services/automation_service.py` - State-Machine-Logik

**Neue States:**
```python
class LeadNurturingState(str, Enum):
    NEW = "NEW"
    RESPONDED = "RESPONDED"  # Lead-Response gesendet
    NURTURING_2 = "NURTURING_2"  # Tag 2 E-Mail gesendet
    NURTURING_5 = "NURTURING_5"  # Tag 5 E-Mail gesendet
    NURTURING_7 = "NURTURING_7"  # Tag 7 E-Mail gesendet
    CONVERTED = "CONVERTED"  # Zu Mitglied konvertiert
    OPTED_OUT = "OPTED_OUT"  # Opt-out
```

---

#### 1.3 WODIFY API Retry-Logik

**Problem:**
- Keine Retry-Logik für fehlgeschlagene API-Calls
- Impact: Mittelhoch - Fehlerhafte Requests führen zu Datenverlust

**Lösung:**
- Retry-Decorator mit exponentieller Backoff
- Max 3 Versuche
- Logging aller Versuche

**Dateien:**
- `src/services/wodify_api_service.py`

**Implementierung:**
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True
)
async def _make_request(self, method: str, endpoint: str, ...):
    # Existing code
```

---

### Priorität 2: Wichtig (Vor Phase 4)

#### 2.1 E-Mail-Template-System erweitern

**Problem:**
- Fehlende Templates für neue Workflows
- Keine Template-Versionierung

**Lösung:**
- Alle fehlenden Templates erstellen
- Template-Versionierung einführen
- Template-Testing-System

**Neue Templates:**
- `templates/email/lead_response.html`
- `templates/email/trial_confirmation.html`
- `templates/email/trial_reminder.html`
- `templates/email/trial_followup.html`
- `templates/email/lead_nurturing_2.html`
- `templates/email/lead_nurturing_5.html`
- `templates/email/lead_nurturing_7.html`

**Dateien:**
- `src/services/email_service.py` - Template-Loading erweitern
- `templates/email/*.html` - Neue Templates

---

#### 2.2 Scheduler-Service erweitern

**Problem:**
- Fehlende Methoden für neue Workflows
- Keine Möglichkeit, Sequenzen zu planen

**Lösung:**
- Neue Scheduler-Methoden hinzufügen
- Sequenz-Planung implementieren
- Job-Cancellation-Mechanismus

**Neue Methoden:**
```python
def schedule_lead_response_email(...)
def schedule_trial_confirmation(...)
def schedule_trial_reminder(...)
def schedule_trial_followup(...)
def schedule_nurturing_sequence(...)  # Plant Tag 2, 5, 7
```

**Dateien:**
- `src/services/scheduler_service.py`

---

#### 2.3 Automation-Service erweitern

**Problem:**
- Fehlende Workflows für neue E-Mail-Types
- Keine Sequenz-Logik

**Lösung:**
- Neue Workflow-Methoden hinzufügen
- Sequenz-Logik implementieren
- State-Management integrieren

**Neue Methoden:**
```python
async def process_booking_created(...)
async def process_trial_booking(...)
async def process_lead_nurturing_sequence(...)
```

**Dateien:**
- `src/services/automation_service.py`

---

### Priorität 3: Nice-to-Have (Optional)

#### 3.1 Code-Dokumentation verbessern

**Problem:**
- Einige Funktionen haben unvollständige Docstrings
- Keine Type-Hints für alle Parameter

**Lösung:**
- Vollständige Docstrings für alle Funktionen
- Type-Hints für alle Parameter
- Beispiel-Usage in Docstrings

**Dateien:**
- Alle Python-Dateien in `src/`

---

#### 3.2 Error-Handling verbessern

**Problem:**
- Einige Exceptions werden zu generisch behandelt
- Keine spezifischen Error-Types

**Lösung:**
- Custom Exception-Klassen erstellen
- Spezifische Error-Handling
- Bessere Error-Messages

**Neue Exceptions:**
```python
class WodifyAPIError(Exception):
    pass

class EmailDeliveryError(Exception):
    pass

class SchedulerError(Exception):
    pass
```

**Dateien:**
- `src/utils/exceptions.py` (neu)
- Alle Service-Dateien

---

#### 3.3 Testing erweitern

**Problem:**
- Fehlende Tests für neue Workflows
- Keine Integration-Tests

**Lösung:**
- Unit-Tests für alle neuen Workflows
- Integration-Tests für E-Mail-Workflows
- Mock-Tests für WODIFY API

**Neue Test-Dateien:**
- `tests/test_email_workflows.py`
- `tests/test_wodify_integration.py`
- `tests/test_scheduler_service.py`

---

## Code-Qualitäts-Standards

### Python

**Standards:**
- PEP 8 Code-Style
- Type Hints für alle Funktionen
- Docstrings für alle öffentlichen Funktionen
- Max. Zeilenlänge: 100 Zeichen
- Black für Code-Formatierung

**Tools:**
- `black` - Code-Formatierung
- `flake8` - Linting
- `mypy` - Type-Checking
- `pytest` - Testing

---

### TypeScript/React

**Standards:**
- ESLint-Konfiguration befolgen
- TypeScript strict mode
- Komponenten-Dokumentation
- Max. Zeilenlänge: 100 Zeichen

**Tools:**
- `eslint` - Linting
- `prettier` - Code-Formatierung
- `typescript` - Type-Checking

---

## Refactoring-Timeline

### Woche 2 (Phase 1)
- ✅ Code-Analyse abgeschlossen
- ✅ Priorität 1 Refactorings implementiert:
  - ✅ Scheduler-Service: Persistent Job Store (SQLAlchemy)
  - ✅ WODIFY API Service: Retry-Logik mit exponentieller Backoff
  - ✅ Lead-State-Management: Migration vorhanden, Database-Service erweitert
- ✅ Code-Qualitäts-Standards definiert

### Woche 9-10 (Phase 4)
- ⏳ Priorität 2 Refactorings
- ⏳ E-Mail-Templates erstellt
- ⏳ Scheduler erweitert

### Woche 12 (Phase 4)
- ⏳ Priorität 3 Refactorings (optional)
- ⏳ Testing erweitert
- ⏳ Dokumentation verbessert

---

## Migration-Strategie

### Schrittweise Migration

1. **Phase 1:** Kritische Refactorings (Woche 2)
   - Scheduler-Persistenz
   - Lead-State-Management
   - WODIFY API Retry-Logik

2. **Phase 2:** Feature-Erweiterungen (Woche 9-10)
   - E-Mail-Templates
   - Scheduler-Erweiterungen
   - Automation-Service-Erweiterungen

3. **Phase 3:** Code-Qualität (Woche 12)
   - Dokumentation
   - Error-Handling
   - Testing

---

## Risiken & Mitigation

### Risiko 1: Breaking Changes

**Mitigation:**
- Schrittweise Migration
- Umfangreiche Tests
- Feature-Flags für neue Features

### Risiko 2: Datenverlust bei Scheduler-Migration

**Mitigation:**
- Backup vor Migration
- Graduelle Migration
- Monitoring nach Migration

### Risiko 3: Performance-Impact

**Mitigation:**
- Performance-Tests vor/nach Refactoring
- Monitoring während Migration
- Rollback-Plan

---

## Nächste Schritte

1. ✅ Code-Analyse abgeschlossen
2. ✅ Refactoring-Plan erstellt
3. ✅ Priorität 1 Refactorings implementiert
4. → Weiter zu: Phase 2, Woche 3 - Design-System & Komponenten
5. → Weiter zu: Phase 4, Woche 9-10 - Priorität 2 Refactorings (E-Mail-Templates, Scheduler-Erweiterungen)

---

**Letzte Aktualisierung:** 2025-01-27

