# Trial Preview Simulation Implementation Plan

> Execution: inline with executing-plans; no delegation, deployment or sending. Commit and PR requested after local acceptance.

**Goal:** Local durable test simulation of the approved full trial email sequence.
**Architecture:** Standalone SQLite event journal and preview outbox, deterministic explicit UTC clock, validated manual appointment/attendance events. No imports from live adapters or settings; no mail transport. HTML and text export for joint review.
**Tech Stack:** Python standard library, SQLite, pytest.
**Spec:** User-approved `docs/superpowers/specs/2026-10-24-trial-email-design.md`, including full sequence amendment.

## Constraints and review focus

- Test only; no production connections or credentials, no delivery implementation.
- Aware datetimes required; UTC arithmetic and Europe/Berlin display.
- Event IDs deduplicate identical payloads, reject conflicting reuse; reject backward event/clock movement.
- Cancellation/reschedule invalidate pending appointment previews; previously generated previews remain an auditable superseded record.
- Response stops general follow-ups; attendance must be explicitly recorded after actual end; closed/cancelled blocks outstanding steps.

## Tasks

- [x] Tests first: persistence/replay, cancellation, reschedule, duplicate/conflicting IDs, +24h/+72h rules, explicit attendance, late confirmation, time zones, escaping, network isolation.
- [x] Implement `src/leads/trial_simulation.py`: isolated SQLite journal, validated state transitions, transactional generation with unique step/version keys.
- [x] Implement `src/leads/trial_preview.py`: approved German HTML/text and safe review export; all pages visibly test-only.
- [x] Add runnable synthetic scenario script under `scripts/simulate_trials.py`, output review gallery and JSON event trace.
- [x] Run focused and full Python suite, formatting/lint; inspect rendered preview and document exact results. No commit/push requested.

Verification: 22 new tests, 99 total tests passed; Black and Flake8 passed. Seven synthetic scenarios exported and HTML confirmation visually inspected. No network or production writes.
Ruling: use explicit ends on confirmation; do not invent training duration. Local simulator remains separate from production until a separate integration request.
