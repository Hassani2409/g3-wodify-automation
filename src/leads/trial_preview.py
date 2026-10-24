"""Pure German preview rendering. No transport, credentials or live imports."""
from datetime import datetime, timedelta
from html import escape
from zoneinfo import ZoneInfo

BERLIN = ZoneInfo("Europe/Berlin")
FOOTER = (
    "G3 CrossFit · Tempelhofer Ufer 36 · 10963 Berlin\n"
    "2. Hinterhaus, 1. Etage\ninfo@g3crossfit.com · 0160 55 718 66"
)


def render(kind, state):
    name = state.get("first_name") or "du"
    greeting = f"Hallo {name},\n\n"
    appointment = state.get("appointment")
    when = ""
    tomorrow = False
    if appointment:
        when = (
            datetime.fromisoformat(appointment["begins"])
            .astimezone(BERLIN)
            .strftime("%d.%m.%Y um %H:%M Uhr")
        )
        tomorrow = datetime.fromisoformat(appointment["begins"]).astimezone(
            BERLIN
        ).date() == datetime.fromisoformat(state["clock"]).astimezone(
            BERLIN
        ).date() + timedelta(
            days=1
        )
    reminder_intro = "morgen, am" if tomorrow else "am"
    wish = state.get("wish_date")
    wishes = (
        f"Dein Terminwunsch: {wish}. Dieser Termin ist noch nicht bestätigt. "
        if wish
        else "Deinen Termin stimmen wir persönlich mit dir ab. "
    )
    subjects = {
        "acknowledgment": "Deine Probetraining-Anfrage bei G3",
        "team_notification": "Neue Probetraining-Anfrage",
        "team_reminder": "Noch offen: Probetraining-Anfrage",
        "team_escalation": "Bitte persönlich bearbeiten: offene Probetraining-Anfrage",
        "general_followup": "Möchtest du dein Probetraining noch abstimmen?",
        "appointment_confirmation": "Dein bestätigtes Probetraining bei G3",
        "appointment_reminder": "Morgen: dein Probetraining bei G3"
        if tomorrow
        else "Erinnerung an dein Probetraining bei G3",
        "feedback": "Wie war dein Probetraining bei G3?",
    }
    texts = {
        "acknowledgment": greeting
        + "vielen Dank für deine Anfrage – schön, dass du G3 kennenlernen möchtest.\n\n"
        + wishes
        + "Wir melden uns persönlich bei dir, um den Termin abzustimmen.\n\nWenn du vorher etwas ergänzen oder deinen Wunsch ändern möchtest, antworte einfach auf diese E-Mail.",
        "team_notification": f"Neue Anfrage zur persönlichen Bearbeitung:\n\nName: {name}\nE-Mail: {state.get('email')}\nTelefon: {state.get('phone') or 'nicht angegeben'}\nTerminwunsch: {wish or 'offen'} – nicht bestätigt\nErfahrung: {state.get('experience') or 'nicht angegeben'}\nNachricht:\n{state.get('message') or 'keine'}\n\nBitte Kontakt aufnehmen, den Termin abstimmen und den Status aktualisieren.",
        "team_reminder": "Die Anfrage ist seit einem Tag noch nicht als persönlich bearbeitet markiert. Bitte Kontakt aufnehmen und den Status aktualisieren. Der Termin ist nicht bestätigt.",
        "team_escalation": "Die Anfrage ist seit drei Tagen noch nicht persönlich bearbeitet. Bitte intern klären. Es wurde keine externe Nachfrage erstellt.",
        "general_followup": greeting
        + "ich wollte kurz nachfragen, ob du dein Probetraining bei G3 noch mit uns abstimmen möchtest.\n\nAntworte gern auf diese E-Mail, wenn du noch Fragen hast oder einen passenden Termin suchst. Falls es gerade nicht passt, genügt eine kurze Nachricht – dann schließen wir deine Anfrage.",
        "appointment_confirmation": greeting
        + f"dein Probetraining ist für den {when} bestätigt.\n\nDu findest uns am Tempelhofer Ufer 36, 10963 Berlin, im 2. Hinterhaus, 1. Etage.\n\nWenn du den Termin ändern oder absagen möchtest, antworte bitte auf diese E-Mail.\n\nWir freuen uns auf dich!",
        "appointment_reminder": greeting
        + f"{reminder_intro} {when}, ist dein bestätigtes Probetraining bei G3.\n\nUnsere Adresse: Tempelhofer Ufer 36, 10963 Berlin, 2. Hinterhaus, 1. Etage.\n\nFalls du verhindert bist oder noch eine Frage hast, antworte bitte auf diese E-Mail.",
        "feedback": greeting
        + "schön, dass du bei uns trainiert hast. Wie hast du dein Probetraining erlebt?\n\nWenn du Fragen hast oder mit uns weitertrainieren möchtest, antworte einfach auf diese E-Mail. Wir besprechen die nächsten Schritte persönlich mit dir.",
    }
    text = texts[kind] + "\n\nDein G3-Team\n\n" + FOOTER
    subject = subjects[kind]
    html = (
        '<!doctype html><html lang="de"><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{escape(subject)}</title><body style="margin:0;background:#eef2ee;font-family:Arial,sans-serif;color:#17241c">'
        '<main style="max-width:600px;margin:24px auto;background:white;padding:28px">'
        '<p style="background:#fff3ba;padding:12px;color:#272000"><strong>TESTVORSCHAU · NICHT VERSENDET</strong><br>Synthetisches Szenario, keine echte Terminbestätigung.</p>'
        '<p style="color:#1d7533;font-weight:bold">G3 CROSSFIT</p>'
        f'<h1 style="font-size:24px">{escape(subject)}</h1>'
        f'<div style="white-space:pre-wrap;line-height:1.65;overflow-wrap:anywhere">{escape(text)}</div>'
        "</main></body></html>"
    )
    return {"subject": subject, "text": text, "html": html}


def export_gallery(scenarios, output):
    """Write a static local review artifact, never send previews."""
    import json
    from pathlib import Path

    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    labels = {
        "acknowledgment": "Eingangsbestätigung",
        "team_notification": "Interner Eingangshinweis",
        "team_reminder": "Interne Erinnerung",
        "team_escalation": "Interne Eskalation",
        "general_followup": "Einmalige Nachfrage",
        "appointment_confirmation": "Terminbestätigung",
        "appointment_reminder": "Terminerinnerung",
        "feedback": "Nachfrage nach dem Training",
    }
    cards = []
    index = 0
    for label, previews in scenarios.items():
        cards.append(f"<h2>{escape(label)}</h2>")
        for preview in previews:
            index += 1
            base = f'{index:02d}-{preview["kind"]}'
            (output / f"{base}.html").write_text(preview["html"], encoding="utf-8")
            (output / f"{base}.txt").write_text(
                "TESTVORSCHAU · NICHT VERSENDET\n\n"
                + preview["subject"]
                + "\n\n"
                + preview["text"],
                encoding="utf-8",
            )
            cards.append(
                f'<details><summary>{escape(labels.get(preview["kind"], preview["kind"]))} · {"Entwertet" if preview["state"] == "superseded" else "Vorschau"} · Version {preview["version"]}</summary>'
                f'<p>Testempfänger: {escape(preview["recipient"])} · erzeugt: {escape(preview["created_at"])}</p>'
                f'<p><a href="{base}.html">E-Mail-Vorschau öffnen</a> · <a href="{base}.txt">Klartext</a></p>'
                f'<h3>{escape(preview["subject"])}</h3><pre>{escape(preview["text"])}</pre></details>'
            )
    page = (
        '<!doctype html><html lang="de"><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        "<title>G3 · Probetraining-Testsimulation</title>"
        "<style>body{font:16px/1.6 system-ui;background:#f2f5f1;color:#17271c;margin:0}main{max-width:1000px;margin:auto;padding:32px 20px}h1{font-size:clamp(28px,5vw,44px);line-height:1.1}h2{margin-top:48px}details{background:white;border:1px solid #cbd7cc;border-radius:10px;padding:18px;margin:12px 0}summary{cursor:pointer;font-weight:650;overflow-wrap:anywhere}pre{font:inherit;white-space:pre-wrap;overflow-wrap:anywhere}a{color:#1d7533}.notice{background:#fff3ba;padding:16px;border-radius:8px}</style>"
        "<main><p>G3 CROSSFIT · LOKALE ABNAHME</p><h1>Probetraining: E-Mail-Vorschauen</h1>"
        '<p class="notice"><strong>TESTMODUS · NICHT VERSENDET</strong><br>Alle Personen und Termine sind synthetisch. Kein Zugriff auf Produktionskontakte. Aufklappen zeigt den Inhalt; „E-Mail-Vorschau öffnen“ zeigt die gestaltete Mail.</p>'
        "<p>Vorschau = aktuell gültiger Entwurf · Entwertet = durch Absage, Antwort oder Verschiebung überholt, nur zur Prüfung erhalten.</p>"
        + "".join(cards)
        + "</main></html>"
    )
    (output / "index.html").write_text(page, encoding="utf-8")
    (output / "results.json").write_text(
        json.dumps(scenarios, ensure_ascii=False, indent=2), encoding="utf-8"
    )
