"""Behavioral tests: no network or production database is needed."""
from datetime import datetime
import socket

import pytest


def dt(value):
    return datetime.fromisoformat(value)


@pytest.fixture
def sim(tmp_path):
    from src.leads.trial_simulation import TrialSimulation

    return TrialSimulation(tmp_path / "test.sqlite")


def start(sim, wish="2026-10-30"):
    sim.event(
        "new",
        "inquiry",
        dt("2026-10-24T10:00:00+02:00"),
        first_name="Alex",
        email="alex@example.com",
        wish_date=wish,
        message="<script>alert(1)</script>",
    )


def confirm(
    sim,
    event_id="confirmed",
    at="2026-10-27T10:00:00+01:00",
    begins="2026-10-30T18:00:00+01:00",
    ends="2026-10-30T19:00:00+01:00",
):
    sim.event(event_id, "confirm", dt(at), begins=begins, ends=ends)


def kinds(sim):
    return [p["kind"] for p in sim.previews() if p["state"] == "preview"]


def test_inquiry_is_not_a_confirmed_booking_and_escapes_html(sim):
    start(sim)
    assert kinds(sim) == ["acknowledgment", "team_notification"]
    assert "noch nicht bestätigt" in sim.previews()[0]["text"]
    internal = sim.previews()[1]
    assert "<script>" not in internal["html"]
    assert "&lt;script&gt;" in internal["html"]


def test_duplicate_events_and_restart_do_not_duplicate_previews(sim):
    from src.leads.trial_simulation import TrialSimulation

    start(sim)
    start(sim)
    confirm(sim)
    sim.advance(dt("2026-10-29T18:00:00+01:00"))
    reopened = TrialSimulation(sim.path)
    reopened.advance(dt("2026-10-29T18:00:00+01:00"))
    assert kinds(reopened).count("appointment_reminder") == 1
    assert len(reopened.previews()) == len(sim.previews())
    with pytest.raises(ValueError):
        start(reopened, "2026-10-31")


def test_unanswered_inquiry_escalates_internally(sim):
    start(sim)
    sim.advance(dt("2026-10-25T09:00:00+01:00"))  # exactly 24 hours across DST
    assert "team_reminder" in kinds(sim)
    sim.advance(dt("2026-10-27T09:00:00+01:00"))
    assert "team_escalation" in kinds(sim)
    assert "general_followup" not in kinds(sim)


def test_contacted_lead_gets_one_followup(sim):
    start(sim)
    sim.event("call", "contacted", dt("2026-10-24T11:00:00+02:00"))
    sim.advance(dt("2026-10-27T09:00:00+01:00"))
    sim.advance(dt("2026-10-27T10:00:00+01:00"))
    assert kinds(sim).count("general_followup") == 1
    assert "team_reminder" not in kinds(sim)


@pytest.mark.parametrize("stop", ["responded", "cancel", "closed", "converted"])
def test_stop_events_prevent_general_followup(sim, stop):
    start(sim)
    sim.event("call", "contacted", dt("2026-10-24T11:00:00+02:00"))
    sim.event("stop", stop, dt("2026-10-24T12:00:00+02:00"))
    sim.advance(dt("2026-10-28T10:00:00+01:00"))
    assert "general_followup" not in kinds(sim)


def test_expired_wish_never_generates_external_followup(sim):
    start(sim, "2026-10-26")
    sim.event("call", "contacted", dt("2026-10-24T11:00:00+02:00"))
    sim.advance(dt("2026-10-27T10:00:00+01:00"))
    assert "general_followup" not in kinds(sim)


def test_cancellation_stops_reminder_and_feedback(sim):
    start(sim)
    confirm(sim)
    sim.event("cancelled", "cancel", dt("2026-10-28T10:00:00+01:00"))
    sim.advance(dt("2026-11-01T10:00:00+01:00"))
    assert "appointment_reminder" not in kinds(sim)
    assert "feedback" not in kinds(sim)
    with pytest.raises(ValueError):
        sim.event("attended", "attended", dt("2026-11-01T11:00:00+01:00"))


def test_reschedule_invalidates_old_version_and_uses_new_date(sim):
    start(sim)
    confirm(sim)
    sim.advance(dt("2026-10-29T18:00:00+01:00"))
    sim.event(
        "move",
        "reschedule",
        dt("2026-10-29T19:00:00+01:00"),
        begins="2026-11-02T18:00:00+01:00",
        ends="2026-11-02T19:00:00+01:00",
    )
    assert "appointment_reminder" not in kinds(sim)
    sim.advance(dt("2026-11-01T18:00:00+01:00"))
    reminders = [p for p in sim.previews() if p["kind"] == "appointment_reminder"]
    assert [p["state"] for p in reminders] == ["superseded", "preview"]
    assert "02.11.2026" in reminders[-1]["text"]


def test_feedback_requires_attendance_and_waits_until_end_plus_24_hours(sim):
    start(sim)
    confirm(sim)
    sim.advance(dt("2026-10-30T19:00:00+01:00"))
    assert "feedback" not in kinds(sim)
    sim.event("attended", "attended", dt("2026-10-30T19:00:00+01:00"))
    sim.advance(dt("2026-10-31T18:59:00+01:00"))
    assert "feedback" not in kinds(sim)
    sim.advance(dt("2026-10-31T19:00:00+01:00"))
    assert kinds(sim).count("feedback") == 1


def test_late_confirmation_skips_reminder(sim):
    start(sim)
    confirm(sim, at="2026-10-30T12:00:00+01:00")
    sim.advance(dt("2026-10-30T17:00:00+01:00"))
    assert "appointment_reminder" not in kinds(sim)


def test_response_preserves_confirmed_reminder(sim):
    start(sim)
    confirm(sim)
    sim.event("reply", "responded", dt("2026-10-28T12:00:00+01:00"))
    sim.advance(dt("2026-10-29T18:00:00+01:00"))
    assert "appointment_reminder" in kinds(sim)
    assert "general_followup" not in kinds(sim)


def test_invalid_events_are_atomic_and_time_must_be_aware(sim):
    start(sim)
    with pytest.raises(ValueError):
        confirm(sim, begins="2026-10-30T18:00:00")
    with pytest.raises(ValueError):
        sim.event("early", "attended", dt("2026-10-24T11:00:00+02:00"))
    with pytest.raises(ValueError):
        sim.advance(dt("2026-10-23T10:00:00+02:00"))
    assert kinds(sim) == ["acknowledgment", "team_notification"]


def test_simulation_has_no_network_side_effects(sim, monkeypatch):
    def forbidden(*args, **kwargs):
        raise AssertionError("Network access attempted")

    monkeypatch.setattr(socket.socket, "connect", forbidden)
    start(sim)
    confirm(sim)
    sim.advance(dt("2026-10-31T20:00:00+01:00"))
    assert all(p["state"] in ("preview", "superseded") for p in sim.previews())


def test_confirmation_and_attendance_cannot_be_inferred_or_repeated(sim):
    start(sim)
    confirm(sim)
    with pytest.raises(ValueError):
        sim.event("tooearly", "attended", dt("2026-10-30T18:30:00+01:00"))
    sim.event("absent", "no_show", dt("2026-10-30T19:00:00+01:00"))
    sim.advance(dt("2026-10-31T20:00:00+01:00"))
    assert "feedback" not in kinds(sim)


def test_missed_reminder_window_does_not_create_stale_email(sim):
    start(sim)
    confirm(sim)
    sim.advance(dt("2026-10-30T20:00:00+01:00"))
    assert "appointment_reminder" not in kinds(sim)


def test_offset_required_for_ambiguous_autumn_time(sim):
    start(sim)
    with pytest.raises(ValueError):
        confirm(
            sim,
            at="2026-10-24T11:00:00+02:00",
            begins="2026-10-25T02:30:00",
            ends="2026-10-25T03:30:00+01:00",
        )


def test_export_contains_text_html_and_test_only_gallery(sim, tmp_path):
    from src.leads.trial_preview import export_gallery

    start(sim)
    output = tmp_path / "review"
    export_gallery({"Beispiel": sim.previews()}, output)
    assert (output / "index.html").exists()
    assert len(list(output.glob("*.txt"))) == 2
    assert "&lt;script&gt;" in (output / "index.html").read_text()
    assert "<script>alert" not in (output / "index.html").read_text()
    assert "NICHT VERSENDET" in (output / "index.html").read_text()


def test_late_reminder_does_not_say_tomorrow_for_today(sim):
    start(sim)
    confirm(sim)
    sim.advance(dt("2026-10-30T10:00:00+01:00"))
    reminder = next(p for p in sim.previews() if p["kind"] == "appointment_reminder")
    assert "morgen" not in (reminder["subject"] + reminder["text"]).lower()


def test_demo_exports_every_email_kind_without_network(tmp_path, monkeypatch):
    from scripts.simulate_trials import build

    def forbidden(*args, **kwargs):
        raise AssertionError("Network access attempted")

    monkeypatch.setattr(socket.socket, "connect", forbidden)
    monkeypatch.setenv("LEAD_DATABASE_URL", "postgresql://do-not-contact.invalid/live")
    monkeypatch.setenv("SENDGRID_API_KEY", "not-a-real-key")
    cases = build(tmp_path / "review")
    all_kinds = {p["kind"] for case in cases.values() for p in case}
    assert all_kinds == {
        "acknowledgment",
        "team_notification",
        "team_reminder",
        "team_escalation",
        "general_followup",
        "appointment_confirmation",
        "appointment_reminder",
        "feedback",
    }
    cancelled = cases["2 · Absage vor Erinnerung"]
    assert not any(p["kind"] in ("appointment_reminder", "feedback") for p in cancelled)
