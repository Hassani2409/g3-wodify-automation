# 🚀 CI/CD Guide - G3 CrossFit WODIFY Automation

## 📋 Übersicht

Dieses Projekt verwendet GitHub Actions für Continuous Integration und Continuous Deployment.

## 🔄 Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Trigger:** Bei jedem Push oder Pull Request auf `main` oder `develop`

**Jobs:**
- **Test**: Führt Python-Tests mit pytest aus
  - Unterstützt Python 3.11
  - PostgreSQL als Service für Integrationstests
  - Code-Coverage mit pytest-cov
  - Upload zu Codecov
  
- **Lint**: Code-Qualitäts-Checks
  - Black (Code-Formatierung)
  - Flake8 (Linting)
  - MyPy (Type-Checking)
  
- **Security**: Sicherheits-Scan
  - Safety Check für bekannte Vulnerabilities

### 2. Frontend CI (`.github/workflows/frontend-ci.yml`)

**Trigger:** Bei Änderungen im `website/` Verzeichnis

**Jobs:**
- **Lint & Test**: 
  - ESLint
  - TypeScript Type-Check
  - Next.js Build
  
- **Build**: 
  - Erstellt Production-Build
  - Upload als Artifact

### 3. Docker Build (`.github/workflows/docker-build.yml`)

**Trigger:** Bei Push auf `main` oder Tags

**Jobs:**
- **Build**: 
  - Erstellt Docker-Image
  - Testet Docker-Container
  - Health-Check

### 4. Deploy (`.github/workflows/deploy.yml`)

**Trigger:** Bei Push auf `main` oder Tags (manuell auslösbar)

**Jobs:**
- **Deploy Backend**: 
  - Tests ausführen
  - Docker-Image bauen
  - Optional: Deployment zu Server
  
- **Deploy Frontend**: 
  - Next.js Build
  - Optional: Deployment zu Vercel/Railway

## 🔧 Lokale Verwendung

### Tests ausführen

```bash
# Alle Tests
pytest tests/ -v

# Mit Coverage
pytest tests/ -v --cov=src --cov-report=html

# Spezifische Test-Datei
pytest tests/test_webhooks.py -v
```

### Linting

```bash
# Black (Formatierung)
black src/ tests/ main.py

# Flake8 (Linting)
flake8 src/ tests/ main.py --max-line-length=120

# MyPy (Type-Checking)
mypy src/ --ignore-missing-imports
```

### Frontend

```bash
cd website

# Linting
npm run lint

# Type-Check
npm run type-check

# Build
npm run build
```

## 🔐 Secrets konfigurieren

Für GitHub Actions müssen folgende Secrets konfiguriert werden:

### Backend Secrets
- `WODIFY_WEBHOOK_SECRET` - WODIFY Webhook Secret
- `SENDGRID_API_KEY` - SendGrid API Key
- `JWT_SECRET_KEY` - JWT Secret Key

### Deployment Secrets (optional)
- `DOCKER_USERNAME` - Docker Hub Username
- `DOCKER_PASSWORD` - Docker Hub Password
- `DEPLOY_HOST` - Deployment Server Host
- `DEPLOY_USER` - Deployment Server User
- `DEPLOY_SSH_KEY` - SSH Private Key
- `NEXT_PUBLIC_API_URL` - Frontend API URL
- `VERCEL_TOKEN` - Vercel Deployment Token
- `VERCEL_ORG_ID` - Vercel Organization ID
- `VERCEL_PROJECT_ID` - Vercel Project ID

### Secrets hinzufügen

1. Gehe zu GitHub Repository → Settings → Secrets and variables → Actions
2. Klicke auf "New repository secret"
3. Füge Name und Wert hinzu

## 📊 Status Badges

Füge diese Badges zu deinem README hinzu:

```markdown
![CI](https://github.com/your-username/g3-wodify-automation/workflows/CI/badge.svg)
![Frontend CI](https://github.com/your-username/g3-wodify-automation/workflows/Frontend%20CI/badge.svg)
![Docker Build](https://github.com/your-username/g3-wodify-automation/workflows/Docker%20Build/badge.svg)
```

## 🐛 Troubleshooting

### Problem: Tests schlagen fehl

**Lösung:**
- Prüfe, ob alle Dependencies installiert sind
- Stelle sicher, dass `.env` Datei korrekt konfiguriert ist
- Prüfe PostgreSQL-Service in CI

### Problem: Linting schlägt fehl

**Lösung:**
```bash
# Code automatisch formatieren
black src/ tests/ main.py

# Dann committen
git add .
git commit -m "Format code with black"
```

### Problem: Docker Build schlägt fehl

**Lösung:**
- Prüfe Dockerfile auf Fehler
- Teste lokal: `docker build -t g3-wodify-automation .`
- Prüfe Logs in GitHub Actions

## 📝 Best Practices

1. **Vor jedem Commit:**
   ```bash
   # Tests lokal ausführen
   pytest tests/ -v
   
   # Code formatieren
   black src/ tests/ main.py
   
   # Linting prüfen
   flake8 src/ tests/ main.py
   ```

2. **Pull Requests:**
   - Alle CI-Checks müssen bestehen
   - Code-Review erforderlich
   - Tests müssen hinzugefügt werden für neue Features

3. **Deployment:**
   - Nur von `main` Branch deployen
   - Tags für Versionen verwenden
   - Deployment-Logs prüfen

## 🚀 Deployment-Optionen

### Option 1: Vercel (Frontend)

1. Verbinde GitHub Repository mit Vercel
2. Konfiguriere Environment Variables
3. Automatisches Deployment bei Push auf `main`

### Option 2: Railway (Backend & Frontend)

1. Verbinde GitHub Repository
2. Konfiguriere Environment Variables
3. Railway erkennt automatisch Dockerfile

### Option 3: Eigenes VPS

1. Konfiguriere SSH-Secrets in GitHub
2. Aktiviere Deployment-Workflow
3. Server führt automatisch `docker-compose up -d` aus

## 📚 Weitere Ressourcen

- [GitHub Actions Dokumentation](https://docs.github.com/en/actions)
- [Docker Dokumentation](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

