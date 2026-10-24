"""Local-only durable event simulator. Never imports production settings/adapters."""
import json
from pathlib import Path
import sqlite3
from datetime import datetime, timedelta, timezone, date

from .trial_preview import BERLIN, render


def instant(value):
    if isinstance(value, str):
        value = datetime.fromisoformat(value)
    if (
        not isinstance(value, datetime)
        or value.tzinfo is None
        or value.utcoffset() is None
    ):
        raise ValueError("An explicit UTC offset is required.")
    return value.astimezone(timezone.utc)


class TrialSimulation:
    def __init__(self, path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self._db() as db:
            db.executescript(
                """
                CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS previews (
                    step TEXT PRIMARY KEY, kind TEXT NOT NULL, version INTEGER NOT NULL,
                    state TEXT NOT NULL, created_at TEXT NOT NULL, recipient TEXT NOT NULL,
                    subject TEXT NOT NULL, text TEXT NOT NULL, html TEXT NOT NULL);
            """
            )

    def _db(self):
        db = sqlite3.connect(self.path)
        db.row_factory = sqlite3.Row
        return db

    def event(self, event_id, kind, at, **data):
        at = instant(at)
        payload = json.dumps(
            {"kind": kind, "at": at.isoformat(), "data": data}, sort_keys=True
        )
        with self._db() as db:
            db.execute("BEGIN IMMEDIATE")
            old = db.execute(
                "SELECT payload FROM events WHERE id=?", (event_id,)
            ).fetchone()
            if old:
                if old[0] != payload:
                    raise ValueError("Conflicting event ID.")
                return
            row = db.execute("SELECT data FROM state WHERE id=1").fetchone()
            state = json.loads(row[0]) if row else {}
            if state.get("clock") and at < instant(state["clock"]):
                raise ValueError("Time cannot move backwards.")
            if kind == "inquiry":
                if state:
                    raise ValueError("Use a separate local database for each inquiry.")
                if data.get("wish_date"):
                    date.fromisoformat(data["wish_date"])
                if not data.get("email"):
                    raise ValueError("Test recipient required.")
                state = dict(data, created=at.isoformat(), version=0)
            elif not state or state.get("stopped"):
                raise ValueError("No active inquiry.")
            elif kind in ("confirm", "reschedule"):
                if kind == "reschedule" and not state.get("appointment"):
                    raise ValueError("No appointment to reschedule.")
                if kind == "confirm" and state.get("appointment"):
                    raise ValueError("Use reschedule for an existing appointment.")
                begins, ends = instant(data["begins"]), instant(data["ends"])
                if begins <= at or ends <= begins:
                    raise ValueError("Future start and end after start required.")
                state["version"] += 1
                state["appointment"] = dict(
                    begins=begins.isoformat(),
                    ends=ends.isoformat(),
                    confirmed=at.isoformat(),
                )
                state.pop("attended", None)
                state.pop("no_show", None)
                db.execute(
                    "UPDATE previews SET state='superseded' WHERE kind IN ('appointment_confirmation','appointment_reminder','feedback','general_followup')"
                )
            elif kind in ("cancel", "closed", "converted"):
                state["stopped"] = kind
                db.execute(
                    "UPDATE previews SET state='superseded' WHERE kind NOT IN ('acknowledgment','team_notification')"
                )
            elif kind in ("contacted", "responded"):
                state[kind] = at.isoformat()
                db.execute(
                    "UPDATE previews SET state='superseded' WHERE kind IN ('team_reminder','team_escalation','general_followup')"
                )
            elif kind in ("attended", "no_show"):
                appointment = state.get("appointment")
                if not appointment or at < instant(appointment["ends"]):
                    raise ValueError("Record attendance only after the confirmed end.")
                if state.get("attended") or state.get("no_show"):
                    raise ValueError("Attendance already recorded.")
                state[kind] = at.isoformat()
            else:
                raise ValueError("Unknown test event.")
            state["clock"] = at.isoformat()
            db.execute("INSERT INTO events VALUES (?,?)", (event_id, payload))
            self._generate(db, state, at)
            self._save(db, state)

    def advance(self, now):
        now = instant(now)
        with self._db() as db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute("SELECT data FROM state WHERE id=1").fetchone()
            if not row:
                raise ValueError("Create an inquiry first.")
            state = json.loads(row[0])
            if now < instant(state["clock"]):
                raise ValueError("Time cannot move backwards.")
            state["clock"] = now.isoformat()
            self._generate(db, state, now)
            self._save(db, state)

    def _save(self, db, state):
        db.execute("INSERT OR REPLACE INTO state VALUES (1,?)", (json.dumps(state),))

    def _generate(self, db, state, now):
        def add(kind, version=0):
            content = render(kind, state)
            recipient = (
                "info@g3crossfit.com" if kind.startswith("team_") else state["email"]
            )
            db.execute(
                "INSERT OR IGNORE INTO previews VALUES (?,?,?,?,?,?,?,?,?)",
                (
                    f"{kind}:{version}",
                    kind,
                    version,
                    "preview",
                    now.isoformat(),
                    recipient,
                    content["subject"],
                    content["text"],
                    content["html"],
                ),
            )

        add("acknowledgment")
        add("team_notification")
        if state.get("stopped"):
            return
        created = instant(state["created"])
        appointment = state.get("appointment")
        if appointment:
            version = state["version"]
            add("appointment_confirmation", version)
            begins = instant(appointment["begins"])
            reminder = begins - timedelta(hours=24)
            if (
                instant(appointment["confirmed"]) <= reminder
                and reminder <= now < begins
            ):
                add("appointment_reminder", version)
            if state.get("attended") and now >= instant(
                appointment["ends"]
            ) + timedelta(hours=24):
                add("feedback", version)
            return
        if state.get("responded"):
            return
        if not state.get("contacted"):
            if now >= created + timedelta(hours=24):
                add("team_reminder")
            if now >= created + timedelta(hours=72):
                add("team_escalation")
        elif now >= created + timedelta(hours=72):
            wish = state.get("wish_date")
            if not wish or date.fromisoformat(wish) >= now.astimezone(BERLIN).date():
                add("general_followup")

    def previews(self):
        with self._db() as db:
            return [
                dict(row) for row in db.execute("SELECT * FROM previews ORDER BY rowid")
            ]
