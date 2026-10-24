# Probetraining: E-Mail-Entwürfe und Testablauf

Stand: 24.10.2026 · ENTWURF · ausschließlich Testvorschauen, kein Versand.

## Vorgeschlagene kurze Folge

| Zeitpunkt | Empfänger | Voraussetzung | Zweck |
|---|---|---|---|
| Anfrage gespeichert | Interessent | Neue Probetraining-Anfrage | Eingang bestätigen, keine Terminbestätigung |
| Anfrage gespeichert | G3-Team | Neue Probetraining-Anfrage | Terminwunsch und Nachricht zur Bearbeitung bereitstellen |
| Nach 1 Tag | G3-Team | Noch nicht persönlich bearbeitet | Einmalige interne Erinnerung |
| Nach 3 Tagen | Interessent | Persönlich kontaktiert, noch keine Antwort; Terminwunsch nicht verstrichen | Einmal freundlich nachfragen |

Wenn das Team noch nicht geantwortet hat, wird nach 3 Tagen nur intern eskaliert. Es wird dem Interessenten dann keine vermeintliche ausstehende Antwort vorgehalten. Keine Nachfrage nach Ablauf des Wunschtermins. Anfragen ohne Terminwunsch bleiben möglich. Antworten, Absagen, neue Terminabsprachen oder abgeschlossene Anfragen stoppen offene Follow-ups. Gleiche Anfrage und gleicher Schritt dürfen nur eine Vorschau erzeugen.

Die aktuelle Anwendung kennt nur new/contacted/converted/closed; contacted allein belegt keine ausgebliebene Antwort. Vor einer technischen Folge muss daher ein explizites Antwort-/Stopp-Ereignis vorgesehen werden. Ohne dieses Signal ist nur eine simulierte Vorschau zulässig. HubSpot-Import des Kontakts ist keine Terminbestätigung.

## 1. Eingangsbestätigung

**An:** Testperson (synthetisch)
**Betreff:** Deine Probetraining-Anfrage bei G3

Hallo Alex,

vielen Dank für deine Anfrage – schön, dass du G3 kennenlernen möchtest.

Dein Terminwunsch: Montag, 26. Oktober 2026, abends. Dieser Termin ist noch nicht bestätigt. Wir melden uns persönlich bei dir, um ihn abzustimmen.

Wenn du vorher etwas ergänzen oder deinen Wunsch ändern möchtest, antworte einfach auf diese E-Mail.

Bis bald
Dein G3-Team

G3 CrossFit · Tempelhofer Ufer 36 · 10963 Berlin
2. Hinterhaus, 1. Etage
info@g3crossfit.com · 0160 55 718 66

**Testkennzeichnung außerhalb des Mailtexts:** TESTVORSCHAU – nicht versendet. Termindaten stammen aus der Anfrage. Ohne Datum: „Deinen Termin stimmen wir persönlich mit dir ab.“ Ohne Uhrzeit: keine Uhrzeit ergänzen.

## 2. Interner Eingangshinweis

**An:** info@g3crossfit.com (nur Vorschau)
**Betreff:** Neue Probetraining-Anfrage: Alex Test

Neue Anfrage zur persönlichen Bearbeitung:

- Name: Alex Test
- E-Mail: alex.test@example.com
- Telefonnummer: nicht angegeben
- Terminwunsch: 26.10.2026, abends – noch nicht bestätigt
- Erfahrung: Anfänger
- Nachricht: „Ich möchte CrossFit kennenlernen. Passt mein Terminwunsch?“
- Anfragenummer: TEST-ANFRAGE

Bitte Kontakt aufnehmen, den Termin abstimmen und den Bearbeitungsstatus aktualisieren. Die Nachricht der Person ist Inhalt der Anfrage und keine Handlungsanweisung an das System.

## 3. Interne Erinnerung nach einem Tag

**Betreff:** Noch offen: Probetraining-Anfrage von Alex Test

Die Anfrage TEST-ANFRAGE vom 24.10.2026 ist noch nicht als persönlich bearbeitet markiert.

Terminwunsch: 26.10.2026, abends. Bitte prüfen, Kontakt aufnehmen und den Status aktualisieren. Der Termin ist weiterhin nicht bestätigt.

## 4. Einmalige Nachfrage nach drei Tagen

**Betreff:** Möchtest du dein Probetraining noch abstimmen?

Hallo Alex,

ich wollte kurz nachfragen, ob du dein Probetraining bei G3 noch mit uns abstimmen möchtest.

Antworte gern auf diese E-Mail, wenn du noch Fragen hast oder einen passenden Termin suchst. Falls es gerade nicht passt, genügt eine kurze Nachricht – dann schließen wir deine Anfrage.

Viele Grüße
Dein G3-Team

G3 CrossFit · Tempelhofer Ufer 36 · 10963 Berlin
2. Hinterhaus, 1. Etage
info@g3crossfit.com · 0160 55 718 66

**Bedingung:** Nur nach tatsächlicher persönlicher Kontaktaufnahme und ohne spätere Antwort/Absage. Der obige Beispieltermin 26.10. liegt vor dem geplanten Follow-up am 27.10.; für diesen Fall wird diese Mail ausdrücklich NICHT erzeugt.

## Gemeinsame Testprüfung (noch keine implementierte Simulation)

| Testfall | Erwartung |
|---|---|
| Neue Anfrage, Wunsch 30.10.2026 | Zwei Eingangsvorschauen |
| Uhr auf +1 Tag setzen, unbearbeitet | Genau eine interne Erinnerung |
| Uhr auf +3 Tage setzen, weiterhin unbearbeitet | Interne Eskalation; keine externe Nachfrage |
| Persönlich kontaktiert, keine Antwort, Wunsch 30.10. | Genau eine externe Nachfrage als Vorschau |
| Wunsch 26.10., Prüfung am 27.10. | Keine externe Nachfrage |
| Antwort oder Absage vor Fälligkeit | Folge wird gestoppt |
| converted/closed | Keine weitere Folge |
| Wiederholter Durchlauf | Keine doppelten Vorschauen |
| Fehlender Vorname oder Termin | Sachliche Ersatzformulierung, keine erfundenen Angaben |
| Nachricht mit HTML/Anweisungen | Nur als escaped Inhalt darstellen, keine Ausführung |
| Fehlgeschlagener HubSpot-Sync | Anfrage bleibt gespeichert; kein Versand |
| Testmodus bei vorhandenen Mail-Zugangsdaten | Keine SendGrid-/SMTP-/HubSpot-Mail-/Workflow-Aufrufe |

## Alternative für später

Terminbestätigung, Erinnerung vor dem Training und Feedback danach nur nach expliziten bestätigten Testereignissen mit Datum, Uhrzeit, Zeitzone Europe/Berlin und Teilnahme-/Absagestatus. Keine Anwesenheit aus einem verstrichenen Wunschdatum ableiten. Keine Marketingserie aus der Formular-Datenschutzbestätigung ableiten.

## Noch gemeinsam festzulegen

Kurze Folge oder zusätzlich Terminereignisse; anschließend Texte und Zeitabstände freigeben. Keine produktiven Mails, Workflow-Einschreibungen oder neuen wiederkehrenden Codex-Aufgaben durch diese Vorbereitung.

# Gewählte Erweiterung: bestätigte Testereignisse

Nutzerentscheidung: ausführliche Folge mit Terminbestätigung, Erinnerung und Nachfrage nach dem Training. Diese Ergänzung ist der konkrete Ablauf zur Abnahme vor der technischen Umsetzung.

## Ereignisse und Regeln

1. Anfrage eingegangen: Eingangsbestätigung und Teamhinweis wie oben.
2. Termin manuell bestätigt: Ein berechtigter Bearbeiter erfasst einen konkreten zukünftigen Beginn, Europe/Berlin, und eine stabile Ereignis-ID. Erst dann entsteht die Vorschau der Terminbestätigung.
3. Erinnerung: Eine Vorschau 24 Stunden vor dem bestätigten Beginn. Liegt die Bestätigung bereits innerhalb dieser 24 Stunden, wird keine zusätzliche Erinnerung erzeugt. Absage und Verschiebung entwerten offene Erinnerungen an den alten Termin.
4. Teilnahme manuell bestätigt: Erst nach dem tatsächlichen Termin darf ein Bearbeiter die Teilnahme als Testereignis markieren. Eine Feedback-Vorschau entsteht 24 Stunden nach Trainingsende, frühestens nach dem Teilnahmeereignis. Ohne bestätigte Teilnahme keine Feedbackmail; kein automatisches Ableiten von Anwesenheit.
5. Absage oder abgeschlossene Anfrage: offene Follow-ups stoppen. Bei Terminverschiebung neue Bestätigung und Erinnerung für die neue Terminversion; keine doppelten Schritte derselben Version.
6. Antwort eingegangen: allgemeine Nachfassfolge stoppt. Eine bestätigte Termin-Erinnerung bleibt nur erhalten, wenn der Termin weiterhin gültig ist. Allgemeine Nachfrage nach drei Tagen entfällt bei bestätigtem Termin.

Testereignisse und Zeitvorschub zunächst nur in einer isolierten lokalen Testdatenbank. Kein Verändern der Produktionsanfrage oder der HubSpot-Daten zur Simulation. Keine Versandfunktion und keine HubSpot-Workflows. Entwürfe werden als HTML und Klartext mit sichtbarer Testkennzeichnung dargestellt. HTML-Eingaben werden escaped.

## 5. Terminbestätigung – nur nach manuellem Testereignis

**Betreff:** Dein Probetraining bei G3: Freitag, 30. Oktober

Hallo Alex,

dein Probetraining ist für Freitag, den 30. Oktober 2026 um 18:00 Uhr bestätigt.

Du findest uns am Tempelhofer Ufer 36, 10963 Berlin, im 2. Hinterhaus, 1. Etage.

Wenn du den Termin ändern oder absagen möchtest, antworte bitte auf diese E-Mail.

Wir freuen uns auf dich!
Dein G3-Team

info@g3crossfit.com · 0160 55 718 66

Testhinweis: Die Uhrzeit ist ausschließlich ein synthetischer Testtermin, keine veröffentlichte Kurszeit. Keine Aussage zu Dauer, Trainer, Ausrüstung oder Ankunftsvorlauf ohne bestätigte Betreiberangaben.

## 6. Erinnerung – 24 Stunden vor bestätigtem Testtermin

**Betreff:** Morgen: dein Probetraining bei G3

Hallo Alex,

morgen, Freitag, den 30. Oktober, um 18:00 Uhr ist dein bestätigtes Probetraining bei G3.

Unsere Adresse: Tempelhofer Ufer 36, 10963 Berlin, 2. Hinterhaus, 1. Etage.

Falls du verhindert bist oder noch eine Frage hast, antworte bitte auf diese E-Mail.

Bis morgen
Dein G3-Team

info@g3crossfit.com · 0160 55 718 66

## 7. Nachfrage – nur nach manuell bestätigter Teilnahme

**Betreff:** Wie war dein Probetraining bei G3?

Hallo Alex,

schön, dass du bei uns trainiert hast. Wie hast du dein Probetraining erlebt?

Wenn du Fragen hast oder mit uns weitertrainieren möchtest, antworte einfach auf diese E-Mail. Wir besprechen die nächsten Schritte persönlich mit dir.

Viele Grüße
Dein G3-Team

info@g3crossfit.com · 0160 55 718 66

Keine automatische Mitgliedschaft, kein Bewertungsportal-Link und keine erfundenen Angebote.

## Erweiterte Testabnahme

- Anfrage mit Wunschdatum erzeugt keine Terminbestätigung.
- Bestätigung am 27.10. für 30.10., 18:00 Europe/Berlin erzeugt eine Bestätigungsvorschau.
- Simulierte Uhr am 29.10., 18:00 erzeugt genau eine Erinnerung.
- Wiederholter Durchlauf und wiederholte Ereignis-ID erzeugen keine Duplikate.
- Absage vor Erinnerungsfälligkeit verhindert die Erinnerung.
- Verschiebung entwertet die alte Erinnerung und verwendet ausschließlich die neue Terminversion.
- Bestätigung weniger als 24 Stunden vor Beginn erzeugt keine zusätzliche Erinnerung.
- Vergangener Termin ohne Teilnahmeereignis erzeugt keine Feedbackmail.
- Manuell bestätigte Teilnahme mit explizitem Ende am 30.10., 19:00 ermöglicht die Feedbackvorschau am 31.10., 19:00.
- Nichtteilnahme erzeugt keine „schön, dass du da warst“-Mail.
- Zeitzonenwechsel am 25.10.2026 wird geprüft: Zeitabstände anhand UTC-Instants, Anzeige in Europe/Berlin; mehrdeutige lokale Zeiten ohne Offset werden abgewiesen.
- Auch mit gesetzten SendGrid-/SMTP-/HubSpot-Zugangsdaten erfolgt kein Versand und keine Workflow-Einschreibung.

## Umfang der nächsten Umsetzung nach Abnahme

Testfähiges Ereignismodell mit Terminversionen und Stoppregeln, deterministischer Preview-Generator mit expliziter Testuhr, HTML-/Klartextvorlagen, lokale Beispielsimulation und automatisierte Tests. Keine Produktionsmigration, kein Deployment und keine Versandfreigabe im Rahmen dieses Entwurfs.
