# G3 CrossFit WODIFY Automation

Vollautomatisierte Workflows für G3 CrossFit WODIFY-Integration mit Python, FastAPI und SendGrid.

## 📋 Überblick

Diese Anwendung automatisiert den gesamten Prozess von der Mitgliedschaftsanmeldung bis zum Onboarding:

- **Willkommens-E-Mails** an neue Mitglieder
- **Team-Benachrichtigungen** bei neuen Anmeldungen
- **Lead-Nurturing** für Interessenten
- **Datenbank-Tracking** aller Aktivitäten
- **Webhook-Empfang** von WODIFY

## 🚀 Features

✅ **Automatische Willkommens-E-Mails**
- Personalisierte E-Mails mit Mitgliedschaftsdetails
- Links zur WODIFY-App und Facebook-Gruppe
- Anleitung für die ersten Schritte

✅ **Team-Benachrichtigungen**
- Sofortige E-Mail an das Team bei neuen Mitgliedern
- Alle relevanten Kontaktdaten
- Checkliste für Onboarding-Schritte
- Direktlink zum WODIFY-Profil

✅ **Lead-Nurturing**
- Automatische Follow-up-E-Mails nach 24 Stunden
- FAQ-Bereich mit häufigen Fragen
- Call-to-Actions für Mitgliedschaftsabschluss

✅ **Datenbank-Tracking**
- Speicherung aller Mitglieder und Leads
- E-Mail-Logs mit SendGrid Message IDs
- Webhook-Logs für Debugging

## 📁 Projektstruktur

```
g3-wodify-automation/
├── main.py                      # FastAPI Hauptanwendung
├── requirements.txt             # Python-Dependencies
├── .env.example                 # Umgebungsvariablen-Vorlage
├── .gitignore                   # Git-Ignore-Datei
├── README.md                    # Diese Datei
│
├── config/
│   └── settings.py              # Zentrale Konfiguration
│
├── src/
│   ├── api/
│   │   └── webhooks.py          # Webhook-Endpoints
│   │
│   ├── models/
│   │   ├── wodify.py            # WODIFY Datenmodelle (Pydantic)
│   │   └── database.py          # Datenbank-Modelle (SQLAlchemy)
│   │
│   ├── services/
│   │   ├── email_service.py     # E-Mail-Service (SendGrid)
│   │   ├── automation_service.py # Automatisierungs-Logik
│   │   └── database_service.py  # Datenbank-Operationen
│   │
│   └── utils/
│
├── templates/
│   └── email/
│       ├── welcome.html         # Willkommens-E-Mail-Template
│       ├── team_notification.html # Team-Benachrichtigungs-Template
│       └── lead_nurturing.html  # Lead-Nurturing-Template
│
└── tests/
    └── (Tests hier)
```

## 🛠️ Installation

### Voraussetzungen

- Python 3.11+
- SendGrid-Account
- WODIFY-Account mit Admin-Zugriff

### Schritt 1: Repository klonen

```bash
git clone <your-repo-url>
cd g3-wodify-automation
```

### Schritt 2: Virtuelle Umgebung erstellen

```bash
python3.11 -m venv venv
source venv/bin/activate  # Auf Windows: venv\Scripts\activate
```

### Schritt 3: Dependencies installieren

```bash
pip install -r requirements.txt
```

### Schritt 4: Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

Bearbeiten Sie `.env` und fügen Sie Ihre Credentials ein:

```env
# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=info@g3crossfit.com

# WODIFY
WODIFY_WEBHOOK_SECRET=your_wodify_webhook_secret_here
WODIFY_TENANT=g3crossfit

# G3 CrossFit
G3_PHONE=+49 30 12345678
G3_EMAIL=info@g3crossfit.com
G3_WEBSITE=https://g3-cross-fit-53cc52df.base44.app
```

### Schritt 5: Datenbank initialisieren

Die SQLite-Datenbank wird automatisch beim ersten Start erstellt.

Für PostgreSQL (optional):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/g3_wodify
```

## 🎯 Verwendung

### Lokale Entwicklung

```bash
python main.py
```

Die Anwendung läuft auf: `http://localhost:8000`

### Mit Uvicorn (empfohlen)

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API-Dokumentation

FastAPI generiert automatisch eine interaktive API-Dokumentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔗 WODIFY-Integration

### Webhook-URLs

Konfigurieren Sie folgende Webhook-URLs in WODIFY Admin:

| Event | URL |
|-------|-----|
| **Membership Created** | `https://your-domain.com/webhooks/wodify/membership-created` |
| **Lead Created** | `https://your-domain.com/webhooks/wodify/lead-created` |
| **Generic Webhook** | `https://your-domain.com/webhooks/wodify/generic` |

### Webhook-Secret

1. Gehen Sie zu **WODIFY Admin → Settings → Webhooks**
2. Generieren Sie ein Webhook-Secret
3. Kopieren Sie es in Ihre `.env`-Datei: `WODIFY_WEBHOOK_SECRET=...`

### Webhook-Signatur-Verifizierung

Die Anwendung verifiziert automatisch die HMAC-SHA256-Signatur aller eingehenden Webhooks.

## 📧 SendGrid-Setup

### API-Key erstellen

1. Melden Sie sich bei [SendGrid](https://sendgrid.com) an
2. Gehen Sie zu **Settings → API Keys**
3. Erstellen Sie einen neuen API-Key mit **Full Access**
4. Kopieren Sie den Key in Ihre `.env`-Datei

### Sender-Verifizierung

1. Gehen Sie zu **Settings → Sender Authentication**
2. Verifizieren Sie Ihre E-Mail-Adresse oder Domain
3. Verwenden Sie die verifizierte E-Mail als `SENDGRID_FROM_EMAIL`

### E-Mail-Templates anpassen

Die E-Mail-Templates befinden sich in `templates/email/`:

- `welcome.html` - Willkommens-E-Mail
- `team_notification.html` - Team-Benachrichtigung
- `lead_nurturing.html` - Lead-Nurturing

Passen Sie HTML und CSS nach Ihren Wünschen an.

## 🗄️ Datenbank

### SQLite (Standard)

Keine zusätzliche Konfiguration erforderlich. Die Datei `g3_wodify.db` wird automatisch erstellt.

### PostgreSQL (Produktion empfohlen)

```bash
# PostgreSQL installieren
sudo apt-get install postgresql postgresql-contrib

# Datenbank erstellen
sudo -u postgres createdb g3_wodify

# Connection String in .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/g3_wodify
```

### Datenbank-Schema

Die Anwendung erstellt automatisch folgende Tabellen:

- `members` - Mitglieder-Daten
- `leads` - Lead-Daten
- `webhook_logs` - Webhook-Logs
- `email_logs` - E-Mail-Logs

## 🧪 Testing

### Manueller Test

1. Starten Sie die Anwendung:
```bash
python main.py
```

2. Senden Sie einen Test-Webhook:
```bash
curl -X POST http://localhost:8000/webhooks/wodify/membership-created \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "test123",
    "first_name": "Max",
    "last_name": "Mustermann",
    "email": "max@example.com",
    "phone": "+49 123 456789",
    "membership_id": "mem123",
    "membership_type": "Regular Unlimited",
    "membership_status": "Active",
    "monthly_price": 129.00,
    "start_date": "2025-11-01T00:00:00Z",
    "is_first_membership": true
  }'
```

3. Prüfen Sie:
   - ✅ Logs in der Konsole
   - ✅ E-Mail-Empfang (Welcome + Team Notification)
   - ✅ Datenbank-Eintrag in `g3_wodify.db`

### Unit Tests

```bash
pytest tests/ -v
```

## 🚀 Deployment

### Option 1: VPS (Ubuntu/Debian)

#### 1. Server vorbereiten

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Python und Dependencies installieren
sudo apt install python3.11 python3.11-venv python3-pip nginx -y

# Projekt hochladen
scp -r g3-wodify-automation user@your-server:/home/user/
```

#### 2. Anwendung einrichten

```bash
cd /home/user/g3-wodify-automation

# Virtuelle Umgebung
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# .env konfigurieren
nano .env
```

#### 3. Systemd Service erstellen

```bash
sudo nano /etc/systemd/system/g3-wodify.service
```

```ini
[Unit]
Description=G3 CrossFit WODIFY Automation
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/g3-wodify-automation
Environment="PATH=/home/ubuntu/g3-wodify-automation/venv/bin"
ExecStart=/home/ubuntu/g3-wodify-automation/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Service aktivieren und starten
sudo systemctl daemon-reload
sudo systemctl enable g3-wodify
sudo systemctl start g3-wodify
sudo systemctl status g3-wodify
```

#### 4. Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/g3-wodify
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Nginx konfigurieren
sudo ln -s /etc/nginx/sites-available/g3-wodify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL mit Let's Encrypt (optional)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker

#### Dockerfile erstellen

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./logs:/app/logs
      - ./g3_wodify.db:/app/g3_wodify.db
    restart: always
```

```bash
# Build und Start
docker-compose up -d

# Logs anzeigen
docker-compose logs -f
```

### Option 3: Cloud Platforms

#### Heroku

```bash
# Procfile erstellen
echo "web: gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker" > Procfile

# Deploy
heroku create g3-wodify-automation
heroku config:set $(cat .env | xargs)
git push heroku main
```

#### Railway.app

1. Verbinden Sie Ihr GitHub-Repository
2. Railway erkennt automatisch Python
3. Fügen Sie Umgebungsvariablen hinzu
4. Deploy!

## 📊 Monitoring & Logs

### Logs anzeigen

```bash
# Echtzeit-Logs
tail -f logs/app.log

# Systemd-Logs
sudo journalctl -u g3-wodify -f
```

### Log-Rotation

Logs werden automatisch rotiert:
- **Rotation**: Täglich
- **Aufbewahrung**: 30 Tage

### Health Check

```bash
curl http://localhost:8000/webhooks/health
```

Response:
```json
{
  "status": "healthy",
  "service": "G3 CrossFit WODIFY Automation",
  "timestamp": "2025-10-31T12:00:00.000000"
}
```

## 🔧 Troubleshooting

### Problem: E-Mails werden nicht versendet

**Lösung:**
1. Prüfen Sie SendGrid API-Key: `echo $SENDGRID_API_KEY`
2. Prüfen Sie Sender-Verifizierung in SendGrid
3. Prüfen Sie Logs: `tail -f logs/app.log`

### Problem: Webhooks kommen nicht an

**Lösung:**
1. Prüfen Sie WODIFY Webhook-Konfiguration
2. Prüfen Sie Firewall/Ports: `sudo ufw status`
3. Testen Sie mit `curl` (siehe Testing-Sektion)
4. Prüfen Sie Webhook-Secret

### Problem: Datenbank-Fehler

**Lösung:**
1. Prüfen Sie Database-URL in `.env`
2. Prüfen Sie Berechtigungen: `ls -la g3_wodify.db`
3. Löschen Sie DB und starten Sie neu (Entwicklung)

## 📝 VSCode + GitHub Copilot

### Empfohlene Extensions

- **Python** (Microsoft)
- **Pylance** (Microsoft)
- **GitHub Copilot** (GitHub)
- **Thunder Client** (für API-Tests)
- **SQLite Viewer** (für DB-Inspektion)

### VSCode-Konfiguration

`.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "[python]": {
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  }
}
```

### GitHub Copilot nutzen

1. Öffnen Sie eine Python-Datei
2. Schreiben Sie einen Kommentar, z.B.:
   ```python
   # Send birthday email to member
   ```
3. Copilot schlägt automatisch Code vor
4. Drücken Sie `Tab` zum Akzeptieren

## 🤝 Beitragen

Contributions sind willkommen! Bitte erstellen Sie einen Pull Request.

## 📄 Lizenz

MIT License - siehe LICENSE-Datei

## 📞 Support

Bei Fragen oder Problemen:
- E-Mail: info@g3crossfit.com
- Telefon: +49 30 12345678

---

**Erstellt für G3 CrossFit Berlin** 🐻💪
