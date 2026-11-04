"""Local-only reactivation drafts for former members. No transport, no live imports.

One SQLite file per former member, like ``TrialSimulation``. Drafts are previews only.
Before any live use, G3 must confirm that the legal basis for existing-customer emails
is met (address collected with the membership, objection notice at collection and in
every message). Each draft carries the objection notice.
"""
import json
import sqlite3
from datetime import timedelta
from pathlib import Path

from .trial_preview import render
from .trial_simulation import instant

FIRST_AFTER = timedelta(days=30)
SECOND_AFTER = timedelta(days=90)
MIN_GAP = timedelta(days=30)
STOP_EVENTS = ("rejoined", "opted_out", "responded")


class ReactivationSimulation:
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
            state = self._load(db)
            if state.get("clock") and at < instant(state["clock"]):
                raise ValueError("Time cannot move backwards.")
            if kind == "membership_ended":
                if state:
                    raise ValueError("Use a separate local database for each member.")
                if not data.get("email"):
                    raise ValueError("Test recipient required.")
                state = dict(data, ended=at.isoformat())
            elif not state or state.get("stopped"):
                raise ValueError("No active reactivation.")
            elif kind in STOP_EVENTS:
                state["stopped"] = kind
                db.execute("UPDATE previews SET state='superseded'")
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
            state = self._load(db)
            if not state:
                raise ValueError("Record an ended membership first.")
            if now < instant(state["clock"]):
                raise ValueError("Time cannot move backwards.")
            state["clock"] = now.isoformat()
            self._generate(db, state, now)
            self._save(db, state)

    def _load(self, db):
        row = db.execute("SELECT data FROM state WHERE id=1").fetchone()
        return json.loads(row[0]) if row else {}

    def _save(self, db, state):
        db.execute("INSERT OR REPLACE INTO state VALUES (1,?)", (json.dumps(state),))

    def _generate(self, db, state, now):
        if state.get("stopped"):
            return
        ended = instant(state["ended"])
        first = db.execute(
            "SELECT created_at FROM previews WHERE kind='reactivation_first'"
        ).fetchone()
        if not first and ended + FIRST_AFTER <= now < ended + SECOND_AFTER:
            self._add(db, "reactivation_first", state, now)
        # The final message needs the first one and a real gap, so a late run never
        # sends both at once.
        if first and now >= max(
            ended + SECOND_AFTER, instant(first["created_at"]) + MIN_GAP
        ):
            self._add(db, "reactivation_second", state, now)

    def _add(self, db, kind, state, now):
        content = render(kind, state)
        db.execute(
            "INSERT OR IGNORE INTO previews VALUES (?,?,?,?,?,?,?,?,?)",
            (
                f"{kind}:0",
                kind,
                0,
                "preview",
                now.isoformat(),
                state["email"],
                content["subject"],
                content["text"],
                content["html"],
            ),
        )

    def previews(self):
        with self._db() as db:
            return [
                dict(row) for row in db.execute("SELECT * FROM previews ORDER BY rowid")
            ]
