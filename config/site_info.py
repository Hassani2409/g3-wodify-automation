"""Public facts verified at g3crossfit.com on 2026-10-24."""
SITE_ADDRESS = "Tempelhofer Ufer 36, 10963 Berlin, 2. Hinterhaus, 1. Etage"
SITE_PHONE = "0160 55 718 66"
SITE_EMAIL = "info@g3crossfit.com"
ASSISTANT_FACTS = f"""
Standort: {SITE_ADDRESS}. Telefon: {SITE_PHONE}. E-Mail: {SITE_EMAIL}.
Öffnungszeiten und aktuelle Preise sind nicht bestätigt. Keine Zeiten oder Preise erfinden.
Bei Fragen an die E-Mail-Adresse oder die Wodify-App verweisen.
Kostenloses Probetraining anfragen; keine sofortige Terminbestätigung versprechen.
Keine kostenlosen Parkplätze versprechen.
Maximal acht Personen laut Startseite. Bei einer Anmeldung Personal Training ohne Aufpreis.
Angebote: CrossFit, ONRAMP, Yoga, Weightlifting, Functional Bodybuilding, Endurance, Gymnastics, Open Gym und Team-WODs.
"""

def public_info_response(prompt: str) -> str | None:
    """Only answer public business questions with verified facts."""
    import re
    match = re.search(r'Der (?:Nutzer|Anrufer) sagt: "(.*)"\s*$', prompt, re.DOTALL)
    question = (match.group(1) if match else prompt).lower()
    if any(word in question for word in ("preis", "kostet", "mitgliedschaft")):
        return f"Aktuelle Preise bestätigen wir dir gern persönlich unter {SITE_EMAIL}."
    if any(word in question for word in ("öffnungszeiten", "geöffnet", "wann", "stunden")):
        return f"Bitte prüfe die Wodify-App oder frage unter {SITE_EMAIL} nach den Zeiten."
    if any(word in question for word in ("standort", "adresse")) or re.search(r"\bwo\b", question):
        return f"Du findest uns am {SITE_ADDRESS}."
    if any(word in question for word in ("probetraining", "trial")):
        return "Gerne kannst du ein kostenloses Probetraining anfragen. Deinen Termin stimmen wir persönlich mit dir ab."
    return None
