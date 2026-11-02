"""Reactivation drafts for former members: local previews only."""
from datetime import datetime
import socket

import pytest


def dt(value):
    return datetime.fromisoformat(value)


@pytest.fixture
def sim(tmp_path):
    from src.leads.reactivation_simulation import ReactivationSimulation

    sim = ReactivationSimulation(tmp_path / "member.sqlite")
    sim.event(
        "ended",
        "membership_ended",
        dt("2026-06-30T23:59:00+02:00"),
        first_name="Kim",
        email="kim@example.com",
    )
    return sim


def kinds(sim):
    return [p["kind"] for p in sim.previews() if p["state"] == "preview"]


def test_two_spaced_messages_with_objection_notice(sim):
    sim.advance(dt("2026-07-30T23:58:00+02:00"))
    assert kinds(sim) == []
    sim.advance(dt("2026-07-30T23:59:00+02:00"))
    assert kinds(sim) == ["reactivation_first"]
    sim.advance(dt("2026-09-28T23:58:00+02:00"))
    assert kinds(sim) == ["reactivation_first"]
    sim.advance(dt("2026-09-28T23:59:00+02:00"))
    sim.advance(dt("2027-01-01T10:00:00+01:00"))
    assert kinds(sim) == ["reactivation_first", "reactivation_second"]
    for preview in sim.previews():
        assert "jederzeit widersprechen" in preview["text"]
        assert preview["recipient"] == "kim@example.com"


@pytest.mark.parametrize("stop", ["rejoined", "opted_out", "responded"])
def test_stop_events_end_the_sequence(sim, stop):
    sim.advance(dt("2026-08-01T10:00:00+02:00"))
    sim.event("stop", stop, dt("2026-08-02T10:00:00+02:00"))
    sim.advance(dt("2026-12-01T10:00:00+01:00"))
    assert kinds(sim) == []
    with pytest.raises(ValueError):
        sim.event("other", "responded", dt("2026-12-02T10:00:00+01:00"))


def test_late_run_never_sends_both_messages_at_once(sim):
    sim.advance(dt("2026-09-15T10:00:00+02:00"))
    assert kinds(sim) == ["reactivation_first"]
    sim.advance(dt("2026-09-29T10:00:00+02:00"))
    assert kinds(sim) == ["reactivation_first"]  # 30-day gap after the first draft
    sim.advance(dt("2026-10-15T10:00:00+02:00"))
    assert kinds(sim) == ["reactivation_first", "reactivation_second"]


def test_very_late_start_creates_no_stale_message(sim):
    sim.advance(dt("2026-10-15T10:00:00+02:00"))
    assert kinds(sim) == []


def test_idempotency_and_validation(tmp_path, sim):
    from src.leads.reactivation_simulation import ReactivationSimulation

    sim.advance(dt("2026-08-01T10:00:00+02:00"))
    reopened = ReactivationSimulation(sim.path)
    reopened.advance(dt("2026-08-01T10:00:00+02:00"))
    assert kinds(reopened) == ["reactivation_first"]
    with pytest.raises(ValueError):
        reopened.advance(dt("2026-07-01T10:00:00+02:00"))
    with pytest.raises(ValueError):
        reopened.event(
            "ended",
            "membership_ended",
            dt("2026-08-01T10:00:00+02:00"),
            email="x@example.com",
        )
    with pytest.raises(ValueError):
        reopened.event("weird", "unknown", dt("2026-08-02T10:00:00+02:00"))
    empty = ReactivationSimulation(tmp_path / "empty.sqlite")
    with pytest.raises(ValueError):
        empty.event("ended", "membership_ended", dt("2026-06-30T10:00:00+02:00"))


def test_no_network(sim, monkeypatch):
    def forbidden(*args, **kwargs):
        raise AssertionError("Network access attempted")

    monkeypatch.setattr(socket.socket, "connect", forbidden)
    sim.advance(dt("2026-12-01T10:00:00+01:00"))
    assert all(p["state"] == "preview" for p in sim.previews())
