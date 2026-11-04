"""Usage: python -m scripts.simulate_trials --output /absolute/local/output

Creates synthetic, isolated SQLite files and static review artifacts only.
Never reads .env files or contacts HubSpot, Vercel, SMTP or SendGrid.
"""
import argparse
from datetime import datetime
from pathlib import Path

from src.leads.reactivation_simulation import ReactivationSimulation
from src.leads.trial_simulation import TrialSimulation
from src.leads.trial_preview import export_gallery

# Placeholder only: the real Google review link has not been verified yet.
DEMO_REVIEW_URL = "https://example.invalid/g3-google-bewertung-platzhalter"


def dt(value):
    return datetime.fromisoformat(value)


def build(output):
    output = Path(output)
    cases = {}
    for label, slug in [
        ("1 · Vollständiges Probetraining", "complete"),
        ("2 · Absage vor Erinnerung", "cancel"),
        ("3 · Terminverschiebung nach erster Erinnerung", "reschedule"),
        ("4 · Unbearbeitete Anfrage", "unprocessed"),
        ("5 · Persönlich kontaktiert, keine Antwort", "no-reply"),
        ("6 · Antwort stoppt allgemeine Nachfrage", "reply"),
        ("7 · Keine bestätigte Teilnahme", "no-attendance"),
        ("8 · Absage per NEIN und neuer Termin", "declined"),
        ("9 · Nicht erschienen", "no-show"),
        ("10 · Feedback mit niedriger Bewertung", "low-feedback"),
    ]:
        sim = TrialSimulation(
            output / "databases" / f"{slug}.sqlite", review_url=DEMO_REVIEW_URL
        )
        sim.event(
            "inquiry",
            "inquiry",
            dt("2026-10-24T10:00:00+02:00"),
            first_name="Alex",
            email="alex.test@example.com",
            wish_date="2026-10-30",
            experience="Anfänger",
            message="Ich möchte CrossFit kennenlernen. Passt mein Terminwunsch?",
        )
        if slug == "unprocessed":
            sim.advance(dt("2026-10-27T09:00:00+01:00"))
        elif slug in ("no-reply", "reply"):
            sim.event("contact", "contacted", dt("2026-10-24T11:00:00+02:00"))
            if slug == "reply":
                sim.event("reply", "responded", dt("2026-10-25T12:00:00+01:00"))
            sim.advance(dt("2026-10-27T10:00:00+01:00"))
        else:
            args = dict(
                begins="2026-10-30T18:00:00+01:00", ends="2026-10-30T19:00:00+01:00"
            )
            sim.event("confirm", "confirm", dt("2026-10-27T10:00:00+01:00"), **args)
            sim.event("confirm", "confirm", dt("2026-10-27T10:00:00+01:00"), **args)
            if slug == "cancel":
                sim.event("cancel", "cancel", dt("2026-10-28T10:00:00+01:00"))
                sim.advance(dt("2026-11-01T10:00:00+01:00"))
            else:
                sim.advance(dt("2026-10-29T18:00:00+01:00"))
                if slug == "reschedule":
                    sim.event(
                        "move",
                        "reschedule",
                        dt("2026-10-29T19:00:00+01:00"),
                        begins="2026-11-02T18:00:00+01:00",
                        ends="2026-11-02T19:00:00+01:00",
                    )
                    sim.advance(dt("2026-11-01T18:00:00+01:00"))
                elif slug == "declined":
                    sim.event("no", "declined", dt("2026-10-29T19:00:00+01:00"))
                    sim.advance(dt("2026-10-30T10:00:00+01:00"))
                    sim.event(
                        "new-date",
                        "confirm",
                        dt("2026-10-30T11:00:00+01:00"),
                        begins="2026-11-03T18:00:00+01:00",
                        ends="2026-11-03T19:00:00+01:00",
                    )
                    sim.advance(dt("2026-11-02T18:00:00+01:00"))
                elif slug == "no-show":
                    sim.event("absent", "no_show", dt("2026-10-30T19:15:00+01:00"))
                elif slug in ("complete", "low-feedback"):
                    sim.event("attended", "attended", dt("2026-10-30T19:00:00+01:00"))
                    sim.advance(dt("2026-10-31T19:00:00+01:00"))
                    sim.event(
                        "rating",
                        "feedback_received",
                        dt("2026-11-01T09:00:00+01:00"),
                        rating=5 if slug == "complete" else 2,
                        comment="Super Coaches!"
                        if slug == "complete"
                        else "Die Gruppe war mir zu groß.",
                    )
                else:
                    sim.advance(dt("2026-10-31T19:00:00+01:00"))
        cases[label] = sim.previews()
    for label, slug in [
        ("11 · Reaktivierung ehemaliger Mitglieder", "reactivation"),
        ("12 · Reaktivierung gestoppt durch Antwort", "reactivation-stop"),
    ]:
        sim = ReactivationSimulation(output / "databases" / f"{slug}.sqlite")
        sim.event(
            "ended",
            "membership_ended",
            dt("2026-06-30T23:59:00+02:00"),
            first_name="Kim",
            email="kim.test@example.com",
        )
        sim.advance(dt("2026-07-31T10:00:00+02:00"))
        if slug == "reactivation-stop":
            sim.event("reply", "responded", dt("2026-08-02T10:00:00+02:00"))
        sim.advance(dt("2026-09-29T10:00:00+02:00"))
        cases[label] = sim.previews()
    export_gallery(cases, output)
    return cases


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    # Each run gets its own directory; existing evidence is never silently reused.
    if args.output.exists():
        parser.error("Output directory already exists; choose a new local directory.")
    build(args.output)
    print(f'Local test gallery: {args.output / "index.html"}; no messages sent.')
