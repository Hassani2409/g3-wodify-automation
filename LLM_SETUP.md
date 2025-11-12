# 🤖 LLM-Integration Setup - Echte Gespräche führen

## Übersicht

Um echte, intelligente Gespräche mit dem Phone Assistant und Chatbot zu führen, können Sie eine LLM-Integration einrichten. Das System unterstützt:

- **OpenAI** (GPT-4, GPT-4o-mini, etc.)
- **Anthropic Claude** (Claude 3 Haiku, Sonnet, etc.)
- **Fallback** (Regelbasierte Antworten, wenn kein LLM konfiguriert ist)

---

## 🚀 Schnellstart mit OpenAI

### Schritt 1: OpenAI API Key erhalten

1. Gehen Sie zu [OpenAI Platform](https://platform.openai.com/)
2. Erstellen Sie ein Konto oder melden Sie sich an
3. Gehen Sie zu **API Keys** → **Create new secret key**
4. Kopieren Sie den API Key (beginnt mit `sk-...`)

### Schritt 2: Dependencies installieren

```bash
pip install openai
```

### Schritt 3: Environment-Variablen konfigurieren

Fügen Sie in Ihre `.env` Datei hinzu:

```env
# LLM Configuration
OPENAI_API_KEY=sk-your-api-key-here
LLM_PROVIDER=openai
LLM_MODEL=gpt-4o-mini
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=500
```

### Schritt 4: Backend neu starten

```bash
python main.py
# oder
uvicorn main:app --reload
```

**Fertig!** 🎉 Der Phone Assistant und Chatbot verwenden jetzt echte KI-Antworten.

---

## 🎯 Alternative: Anthropic Claude

### Schritt 1: Anthropic API Key erhalten

1. Gehen Sie zu [Anthropic Console](https://console.anthropic.com/)
2. Erstellen Sie ein Konto
3. Gehen Sie zu **API Keys** → **Create Key**
4. Kopieren Sie den API Key

### Schritt 2: Dependencies installieren

```bash
pip install anthropic
```

### Schritt 3: Environment-Variablen konfigurieren

```env
# LLM Configuration
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
LLM_PROVIDER=anthropic
LLM_MODEL=claude-3-haiku-20240307
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=500
```

---

## ⚙️ Konfigurationsoptionen

### LLM Provider

```env
LLM_PROVIDER=openai        # oder "anthropic" oder "fallback"
```

### Model-Auswahl

**OpenAI Models:**
- `gpt-4o-mini` - Schnell und günstig (empfohlen)
- `gpt-4o` - Besser, aber teurer
- `gpt-4-turbo` - Sehr gut, aber teuer
- `gpt-3.5-turbo` - Alt, aber günstig

**Anthropic Models:**
- `claude-3-haiku-20240307` - Schnell und günstig (empfohlen)
- `claude-3-sonnet-20240229` - Besser, aber teurer
- `claude-3-opus-20240229` - Beste Qualität, aber teuer

### Temperature

```env
LLM_TEMPERATURE=0.7  # 0.0 = konservativ, 1.0 = kreativ
```

- **0.0-0.3**: Sehr konservativ, vorhersagbar
- **0.4-0.7**: Ausgewogen (empfohlen)
- **0.8-1.0**: Kreativ, variabel

### Max Tokens

```env
LLM_MAX_TOKENS=500  # Maximale Antwortlänge
```

- **200-300**: Sehr kurz
- **500**: Kurz bis mittel (empfohlen für Chat)
- **1000+**: Längere Antworten

---

## 💰 Kosten-Übersicht

### OpenAI GPT-4o-mini (empfohlen)
- **Input**: $0.15 / 1M Tokens
- **Output**: $0.60 / 1M Tokens
- **Geschätzte Kosten**: ~$0.001 pro Gespräch (10 Nachrichten)

### Anthropic Claude 3 Haiku (empfohlen)
- **Input**: $0.25 / 1M Tokens
- **Output**: $1.25 / 1M Tokens
- **Geschätzte Kosten**: ~$0.002 pro Gespräch (10 Nachrichten)

### Fallback (kostenlos)
- Regelbasierte Antworten
- Keine API-Kosten
- Begrenzte Flexibilität

---

## 🔍 Testen der Integration

### 1. Phone Assistant testen

1. Öffnen Sie die Website
2. Klicken Sie auf den Phone-Button (unten links)
3. Klicken Sie auf "Anrufen"
4. Stellen Sie eine Frage, z.B.:
   - "Was kostet eine Mitgliedschaft?"
   - "Kann ich heute noch ein Probetraining buchen?"
   - "Erzähl mir mehr über eure Kurse"

### 2. Chatbot testen

1. Öffnen Sie die Website
2. Klicken Sie auf den Chat-Button (unten rechts)
3. Stellen Sie eine Frage

### 3. Backend-Logs prüfen

```bash
# Sie sollten sehen:
INFO: Generating AI response for prompt: ...
INFO: Using LLM provider: openai
```

---

## 🐛 Troubleshooting

### Problem: "OpenAI library not installed"

**Lösung:**
```bash
pip install openai
```

### Problem: "OpenAI API key not configured"

**Lösung:**
1. Prüfen Sie, ob `OPENAI_API_KEY` in `.env` gesetzt ist
2. Backend neu starten
3. Prüfen Sie die Logs: `LLM provider: openai`

### Problem: "API request failed"

**Lösung:**
1. Prüfen Sie Ihre Internetverbindung
2. Prüfen Sie, ob der API Key gültig ist
3. Prüfen Sie Ihr OpenAI/Anthropic Guthaben
4. System verwendet automatisch Fallback-Antworten

### Problem: Antworten sind zu lang/kurz

**Lösung:**
- `LLM_MAX_TOKENS` anpassen (z.B. 300 für kürzer, 800 für länger)
- `LLM_TEMPERATURE` anpassen (niedriger = konservativer)

---

## 📊 Monitoring

### Logs prüfen

```bash
# Backend-Logs zeigen:
- Welcher LLM-Provider verwendet wird
- API-Aufrufe und Fehler
- Fallback-Nutzung
```

### Kosten überwachen

- **OpenAI**: [Usage Dashboard](https://platform.openai.com/usage)
- **Anthropic**: [Console Dashboard](https://console.anthropic.com/)

---

## 🎯 Best Practices

1. **Start mit GPT-4o-mini**: Gute Balance zwischen Kosten und Qualität
2. **Temperature 0.7**: Ausgewogen für Kundenservice
3. **Max Tokens 500**: Kurz genug für Chat, lang genug für Details
4. **Fallback aktiviert**: System funktioniert auch ohne LLM
5. **Monitoring**: Überwachen Sie Kosten und Nutzung

---

## 🔐 Sicherheit

- **Niemals API Keys committen**: Verwenden Sie `.env` Dateien
- **API Keys rotieren**: Regelmäßig neue Keys erstellen
- **Rate Limiting**: Backend hat bereits Rate Limiting implementiert
- **Input Validation**: Alle Eingaben werden validiert

---

## ✅ Checkliste

- [ ] OpenAI oder Anthropic Account erstellt
- [ ] API Key erhalten
- [ ] Dependencies installiert (`pip install openai` oder `pip install anthropic`)
- [ ] `.env` Datei konfiguriert
- [ ] Backend neu gestartet
- [ ] Phone Assistant getestet
- [ ] Chatbot getestet
- [ ] Logs geprüft

---

## 🚀 Nächste Schritte

Nach der Einrichtung können Sie:

1. **LangGraph integrieren** für komplexere Workflows
2. **Tool-Calling** für direkte Aktionen (Buchungen, etc.)
3. **Conversation History** im Backend speichern
4. **Analytics** für Gespräche hinzufügen

Viel Erfolg! 🎉

