# Technische Architektur - G3 CrossFit Vollautomatisierung

**Erstellt:** 2025-01-27  
**Status:** Vollständige Architektur-Dokumentation  
**Ziel:** Übersicht über System-Architektur, Datenfluss und Integration-Punkte

---

## System-Übersicht

Das System besteht aus drei Hauptkomponenten:

1. **Frontend (Next.js)** - Moderne Website mit React
2. **Backend (FastAPI)** - Python-API für Automatisierung
3. **WODIFY** - Externes Mitgliederverwaltungssystem

```
┌─────────────────┐
│   Next.js       │
│   Frontend      │
│   (Port 3000)   │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│   FastAPI       │
│   Backend       │
│   (Port 8000)   │
└────────┬────────┘
         │
         ├──────────┐
         │          │
    ┌────▼────┐ ┌──▼──────────┐
    │ WODIFY  │ │ SendGrid     │
    │ API     │ │ Email API    │
    └─────────┘ └─────────────┘
```

---

## Komponenten-Architektur

### Frontend (Next.js)

**Technologie-Stack:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Framer Motion (Animationen)

**Struktur:**
```
website/
├── src/
│   ├── app/                    # Next.js App Router Pages
│   │   ├── page.tsx           # Homepage
│   │   ├── pricing/           # Mitgliedschafts-Seite
│   │   ├── schedule/           # Kursplan
│   │   ├── contact/           # Kontaktformular
│   │   └── dashboard/         # Member-Portal
│   ├── components/            # React-Komponenten
│   │   ├── ui/                # UI-Komponenten (shadcn/ui)
│   │   ├── Header.tsx         # Navigation
│   │   ├── HeroSection.tsx    # Hero-Bereich
│   │   └── ...
│   ├── lib/                   # Utilities & API-Clients
│   │   ├── api/               # API-Client-Funktionen
│   │   └── utils.ts           # Helper-Funktionen
│   └── contexts/              # React Contexts
│       └── AuthContext.tsx    # Authentifizierung
```

**Integration-Punkte:**
- REST API Calls zu Backend (`/api/*`)
- WODIFY Sales Portal (iframe/embed)
- Stripe Checkout (Payment)

---

### Backend (FastAPI)

**Technologie-Stack:**
- FastAPI (Python Web Framework)
- SQLAlchemy (ORM)
- Alembic (Migrations)
- APScheduler (Job Scheduling)
- SendGrid (E-Mail)
- Pydantic (Data Validation)

**Struktur:**
```
src/
├── api/                       # API-Endpunkte
│   ├── webhooks.py           # WODIFY Webhook-Handler
│   ├── schedule.py           # Kursplan-API
│   ├── auth.py               # Authentifizierung
│   ├── admin.py              # Admin-Dashboard
│   ├── membership.py         # Membership-Management (neu)
│   └── shop.py               # Shop-API
├── models/                    # Datenmodelle
│   ├── wodify.py             # WODIFY Webhook-Modelle (Pydantic)
│   ├── database.py           # Datenbank-Modelle (SQLAlchemy)
│   └── auth.py               # Auth-Modelle
├── services/                  # Business-Logic
│   ├── automation_service.py # Automatisierungs-Workflows
│   ├── email_service.py      # E-Mail-Versand
│   ├── database_service.py   # Datenbank-Operationen
│   ├── scheduler_service.py  # Job-Scheduling
│   └── wodify_api_service.py # WODIFY API-Client
└── utils/                     # Utilities
    └── auth.py                # JWT-Utilities
```

**API-Endpunkte:**

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/webhooks/wodify/membership-created` | POST | Membership-Webhook |
| `/webhooks/wodify/lead-created` | POST | Lead-Webhook |
| `/webhooks/wodify/booking-created` | POST | Booking-Webhook |
| `/api/schedule/classes` | GET | Kursplan abrufen |
| `/api/schedule/book` | POST | Kurs buchen |
| `/api/membership/create` | POST | Mitgliedschaft erstellen |
| `/api/auth/login` | POST | User-Login |
| `/api/admin/stats` | GET | Statistiken |

---

## Datenfluss-Diagramme

### Workflow 1: Neues Mitglied

```
┌─────────────┐
│   WODIFY     │
│   (Webhook)  │
└──────┬───────┘
       │
       │ POST /webhooks/wodify/membership-created
       │
┌──────▼──────────────────────────────────────┐
│   FastAPI Backend                            │
│   ┌──────────────────────────────────────┐  │
│   │  webhooks.py                         │  │
│   │  - Signature-Verifizierung           │  │
│   │  - Payload-Validierung               │  │
│   └──────────┬───────────────────────────┘  │
│              │                               │
│   ┌──────────▼───────────────────────────┐  │
│   │  automation_service.py               │  │
│   │  - process_new_membership()          │  │
│   └──────────┬───────────────────────────┘  │
│              │                               │
│   ┌──────────▼───────────────────────────┐  │
│   │  database_service.py                 │  │
│   │  - create_member()                   │  │
│   └──────────┬───────────────────────────┘  │
│              │                               │
│   ┌──────────▼───────────────────────────┐  │
│   │  scheduler_service.py                │  │
│   │  - schedule_welcome_email()          │  │
│   │  - schedule_team_notification()      │  │
│   └──────────┬───────────────────────────┘  │
└──────────────┼───────────────────────────────┘
               │
               │ Scheduled Jobs
               │
┌──────────────▼───────────────────────────────┐
│   APScheduler                               │
│   - Welcome Email (5 Min Delay)             │
│   - Team Notification (5 Sek Delay)         │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│   email_service.py                          │
│   - send_welcome_email()                     │
│   - send_team_notification_email()           │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│   SendGrid API                              │
│   - E-Mail-Versand                          │
└──────────────────────────────────────────────┘
```

### Workflow 2: Online-Mitgliedschaftsabschluss

```
┌─────────────┐
│   User      │
│   (Browser) │
└──────┬──────┘
       │
       │ Besucht /pricing
       │
┌──────▼──────────────────────────────────────┐
│   Next.js Frontend                          │
│   ┌──────────────────────────────────────┐  │
│   │  pricing/page.tsx                    │  │
│   │  - Zeigt Mitgliedschafts-Pakete      │  │
│   │  - WODIFY Sales Portal (iframe)      │  │
│   └──────────┬───────────────────────────┘  │
│              │                               │
│              │ User wählt Paket              │
│              │                               │
│   ┌──────────▼───────────────────────────┐  │
│   │  WODIFY Sales Portal                 │  │
│   │  - Checkout-Flow                     │  │
│   │  - Zahlungsabwicklung                │  │
│   └──────────┬───────────────────────────┘  │
└──────────────┼───────────────────────────────┘
               │
               │ Membership Created Webhook
               │
┌──────────────▼───────────────────────────────┐
│   FastAPI Backend                            │
│   (siehe Workflow 1)                         │
└──────────────────────────────────────────────┘
```

### Workflow 3: Lead-Nurturing-Sequenz

```
┌─────────────┐
│   WODIFY     │
│   (Webhook)  │
└──────┬───────┘
       │
       │ POST /webhooks/wodify/lead-created
       │
┌──────▼──────────────────────────────────────┐
│   FastAPI Backend                            │
│   ┌──────────────────────────────────────┐  │
│   │  automation_service.py               │  │
│   │  - process_new_lead()                │  │
│   └──────────┬───────────────────────────┘  │
│              │                               │
│   ┌──────────▼───────────────────────────┐  │
│   │  scheduler_service.py                │  │
│   │  - schedule_lead_response_email()     │  │
│   │  - schedule_nurturing_sequence()      │  │
│   └──────────┬───────────────────────────┘  │
└──────────────┼───────────────────────────────┘
               │
               │ Scheduled Jobs
               │
┌──────────────▼───────────────────────────────┐
│   APScheduler                               │
│   ┌──────────────────────────────────────┐ │
│   │ Tag 0: Lead-Response (5 Min)         │ │
│   │ Tag 2: Follow-up E-Mail              │ │
│   │ Tag 5: Value-Content E-Mail          │ │
│   │ Tag 7: Finale E-Mail mit Angebot     │ │
│   └──────────────────────────────────────┘ │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│   email_service.py                          │
│   - send_lead_response_email()               │
│   - send_lead_nurturing_2()                  │
│   - send_lead_nurturing_5()                  │
│   - send_lead_nurturing_7()                  │
└──────────────────────────────────────────────┘
```

---

## Datenbank-Schema

### Haupt-Tabellen

#### Members
```sql
CREATE TABLE members (
    id INTEGER PRIMARY KEY,
    client_id VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR,
    membership_type VARCHAR,
    membership_status VARCHAR,
    monthly_price DECIMAL,
    start_date DATETIME,
    end_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Leads
```sql
CREATE TABLE leads (
    id INTEGER PRIMARY KEY,
    lead_id VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR,
    lead_status VARCHAR,
    nurturing_state VARCHAR,  -- NEW, RESPONDED, NURTURING_2, NURTURING_5, NURTURING_7, CONVERTED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_nurturing_sent DATETIME
);
```

#### EmailLogs
```sql
CREATE TABLE email_logs (
    id INTEGER PRIMARY KEY,
    email_type VARCHAR NOT NULL,
    recipient_email VARCHAR NOT NULL,
    recipient_name VARCHAR,
    sendgrid_message_id VARCHAR,
    related_client_id VARCHAR,
    related_lead_id VARCHAR,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR  -- sent, failed, pending
);
```

#### WebhookLogs
```sql
CREATE TABLE webhook_logs (
    id INTEGER PRIMARY KEY,
    event_type VARCHAR NOT NULL,
    event_id VARCHAR UNIQUE NOT NULL,
    payload TEXT,
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR  -- processed, failed, pending
);
```

---

## Integration-Punkte

### 1. WODIFY API Integration

**Service:** `src/services/wodify_api_service.py`

**Endpunkte:**
- `GET /classes` - Kursplan abrufen
- `POST /bookings` - Kurs buchen
- `GET /memberships` - Mitgliedschaften abrufen
- `POST /leads` - Lead erstellen

**Authentifizierung:**
- API-Key im Header: `Authorization: Bearer {WODIFY_API_KEY}`

**Rate Limiting:**
- Max 100 Requests/Minute
- Caching für Schedule-Daten (5 Minuten)

---

### 2. WODIFY Webhook Integration

**Endpunkte:**
- `/webhooks/wodify/membership-created`
- `/webhooks/wodify/lead-created`
- `/webhooks/wodify/booking-created`

**Signatur-Verifizierung:**
```python
def verify_wodify_signature(payload: bytes, signature: str) -> bool:
    expected = hmac.new(
        settings.wodify_webhook_secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)
```

---

### 3. SendGrid E-Mail Integration

**Service:** `src/services/email_service.py`

**Templates:**
- `templates/email/welcome.html`
- `templates/email/team_notification.html`
- `templates/email/lead_response.html`
- `templates/email/trial_confirmation.html`
- `templates/email/trial_reminder.html`
- `templates/email/trial_followup.html`
- `templates/email/lead_nurturing_2.html`
- `templates/email/lead_nurturing_5.html`
- `templates/email/lead_nurturing_7.html`

**Retry-Logik:**
- 3 Versuche mit exponentieller Backoff
- Logging aller Versuche

---

### 4. WODIFY Sales Portal Integration

**Integration-Typ:** iframe/Embed

**URL-Format:**
```
https://app.wodify.com/SalesPortal/{LOCATION_ID}
```

**Frontend-Integration:**
```tsx
<iframe
  src={wodifySalesPortalUrl}
  width="100%"
  height="800px"
  frameBorder="0"
/>
```

**Webhook-Integration:**
- Sales Portal erstellt Mitgliedschaft → Webhook wird ausgelöst
- Backend verarbeitet Webhook → Automatisierung startet

---

## Sicherheits-Architektur

### Authentifizierung

**Backend:**
- JWT-Tokens (Access & Refresh)
- Password-Hashing mit bcrypt
- Token-Refresh-Mechanismus

**Frontend:**
- AuthContext für State-Management
- Protected Routes
- Auto-Refresh bei Token-Expiry

### API-Sicherheit

- Rate Limiting (slowapi)
- CORS-Konfiguration
- Webhook-Signatur-Verifizierung
- Input-Validierung (Pydantic)

### Datenbank-Sicherheit

- SQL Injection-Schutz (SQLAlchemy ORM)
- Prepared Statements
- Environment-Variablen für Credentials

---

## Skalierbarkeit

### Horizontal Scaling

**Backend:**
- Stateless API (kann horizontal skaliert werden)
- Shared Database
- Job-Scheduler muss koordiniert werden (Redis für Distributed Locking)

**Frontend:**
- Statische Assets über CDN
- Server-Side Rendering (Next.js)
- API-Caching

### Performance-Optimierung

**Backend:**
- Database-Connection-Pooling
- API-Response-Caching (Redis)
- Async/Await für I/O-Operationen

**Frontend:**
- Image-Optimization (Next.js Image)
- Code-Splitting
- Lazy-Loading
- Static Generation wo möglich

---

## Monitoring & Logging

### Logging

**Backend:**
- Loguru für strukturiertes Logging
- Log-Levels: DEBUG, INFO, WARNING, ERROR
- Log-Rotation (täglich, 30 Tage Retention)

**Frontend:**
- Console-Logging für Development
- Error-Boundaries für Fehlerbehandlung

### Monitoring

**Error Tracking:**
- Sentry-Integration
- Automatische Error-Reports

**Performance Monitoring:**
- API-Response-Times
- E-Mail-Delivery-Rates
- Webhook-Processing-Times

---

## Deployment-Architektur

### Development

```
Frontend: localhost:3000 (Next.js Dev Server)
Backend:  localhost:8000 (FastAPI Uvicorn)
Database: SQLite (lokal)
```

### Production

```
Frontend: Vercel / Netlify
Backend:  Railway / Render / DigitalOcean
Database: PostgreSQL (managed)
Email:    SendGrid (SaaS)
Monitoring: Sentry (SaaS)
```

---

## Datenfluss-Übersicht

### E-Mail-Workflows

| Workflow | Trigger | Timing | Template |
|----------|---------|--------|----------|
| Willkommens-E-Mail | Membership Created | 5 Min | welcome.html |
| Team-Benachrichtigung | Membership Created | Sofort | team_notification.html |
| Lead-Antwort | Lead Created | 5 Min | lead_response.html |
| Probetraining-Bestätigung | Booking Created | Sofort | trial_confirmation.html |
| Probetraining-Reminder | Booking Created | 24h vorher | trial_reminder.html |
| Follow-up nach Probetraining | Booking Completed | 24h danach | trial_followup.html |
| Nurturing Tag 2 | Lead Created | Tag 2 | lead_nurturing_2.html |
| Nurturing Tag 5 | Lead Created | Tag 5 | lead_nurturing_5.html |
| Nurturing Tag 7 | Lead Created | Tag 7 | lead_nurturing_7.html |

---

## Erweiterungen (Phase 2)

### Geplante Features

1. **Geburtstags-E-Mails**
   - Scheduler-Job täglich
   - Template: birthday.html

2. **Zahlungserinnerungen**
   - Scheduler-Job bei fälligen Zahlungen
   - Template: payment_reminder.html

3. **Erweiterte Analytics**
   - Conversion-Tracking
   - E-Mail-Open-Rates
   - Click-Through-Rates

---

## Nächste Schritte

1. ✅ Architektur dokumentiert
2. → Weiter zu: `PROJECT_PLAN.md` für detaillierten Projektplan
3. → Weiter zu: `REFACTORING_PLAN.md` für Code-Optimierung

---

**Letzte Aktualisierung:** 2025-01-27

