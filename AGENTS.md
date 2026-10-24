# G3 – Entwicklungsplan

Stand: 24.10.2026. Dieser Plan dokumentiert die abgestimmte Richtung. Er richtet noch keine Automatisierung ein und löst keine Veröffentlichung aus.

## Prioritäten

1. **Website veröffentlichen:** PR #3 abschließen, Vercel-Projektkonfiguration einschließlich `website/` als Frontend-Wurzel prüfen und den vollständigen Weg vom Hero zum Probetraining testen.
2. **Wodify anbinden:** Einen verifizierten echten Kursplan und eine funktionierende Anmeldung integrieren. Bis dahin keine erfundenen Kurse, Trainer, Uhrzeiten, Belegungen oder Restplätze anzeigen.
3. **Blog-Grundlage schaffen:** Die vorhandene Blog-Implementierung prüfen und zu einer kleinen Redaktion mit Artikelverwaltung, sprechenden URLs, Autoren, Entwurfsstatus und Vorschau weiterentwickeln. Bestehende Artikel-URLs bei einer Umstellung berücksichtigen und gegebenenfalls weiterleiten.
4. **Agentisches Blogging pilotieren:** Einen ersten Artikel durch den vollständigen redaktionellen Ablauf führen. Danach zunächst zwei Artikel pro Monat als Ziel ansetzen; eine wiederkehrende Automatisierung erst nach erfolgreichem Testlauf einrichten.
5. **Wirkung messen:** Suchanfragen, Artikelbesuche und daraus entstandene Probetrainings erfassen. Vor der Umsetzung Messwerkzeuge und erforderliche Einwilligungen klären; keine Tracking-Dienste allein aufgrund dieses Plans aktivieren.

## Lead-Verarbeitung – aktuelle Priorität

- Nutzerfreigabe: CRM-unabhängige Lead-Verarbeitung mit HubSpot als erstem Adapter; E-Mails und Automatisierungen ausschließlich im Testmodus.
- Implementierung unter `src/leads/`, eigenständiger Einstieg `src.lead_app:app`, separater Worker `python -m src.leads.worker`. Keine Abhängigkeit von installierter Wodify-Anbindung.
- Neue Daten liegen in separaten `crm_*`-Tabellen. Anfrage, CRM-Auftrag und Kommunikationsentwürfe zuerst atomar speichern; nie vor der Speicherung an externe Systeme senden.
- Standard `CRM_SYNC_MODE=test`; `LEAD_AUTOMATION_MODE` unterstützt nur `test`. Keine Testaufträge nachträglich live übertragen. HubSpot ist noch nicht mit einem echten Konto verifiziert.
- Website nutzt die gleichnamige serverseitige Route `/api/leads` und `LEAD_API_URL`; Verwaltungszugriffe nur mit serverseitigem `LEAD_ADMIN_KEY`. Keine Tokens in Browsercode oder Repository.
- Betrieb, Grenzen und Prüfungen: `docs/LEADS.md`.

## Nächster Entwicklungsschritt

- Aktuelle Nutzerpriorität: zuerst E-Commerce auf Shopify aufbauen, in der Reihenfolge **Bekleidung → Geräte → Supplements**. Die Blog-Redaktion folgt danach.
- Shopify-Aufbaushop: `y2qygs-ud.myshopify.com`, Name „G3 CrossFit“. Vom Nutzer gespeichert; erneute CLI-Anmeldung und Produktabfrage erfolgreich geprüft. Aktueller Tarif: Trial; kein bestätigter Live-Verkauf. Zugangsdaten und Übernahmelinks nicht ins Repository schreiben.
- Der Bekleidungs-Beispielkatalog `demostore` wurde zur Übernahme freigegeben. Musterprodukte und deren Preise, Bilder und Texte sind keine echten G3-Angebote und müssen vor Verkaufsstart ersetzt werden.
- Geräte anschließend mit geeignetem Katalog bzw. echten Lieferantendaten aufbauen; danach Supplements mit verifizierten Produktangaben. Keine erfundenen Bestände, Wirkversprechen oder Produkteigenschaften.
- Shopify-Theme am 24.10.2026 an G3 angepasst (Logo, Farben, Schriften, deutsche Startseite, Musterhinweis). Arbeitskopie und Sicherung liegen außerhalb des Repositorys unter `work/shopify-g3-theme` bzw. `work/shopify-g3-theme-baseline` im übergeordneten Chat-Arbeitsbereich.
- Headless laut Nutzer im aktuellen Tarif nicht verfügbar. CLI-/Admin-Zugriff funktioniert; tokenloser Storefront-Zugriff meldet weiterhin `Online Store channel is locked`. Website deshalb im expliziten Vorschaumodus betreiben. Seit dem 24.10.2026 zeigt die Website eine erweiterte Vorschau mit 51 Artikeln: acht G3-Entwürfe (18 Farb-Mockups, 97 Varianten), alle 29 bisherigen Shopify-Musterprodukte sowie acht Geräte und sechs Supplements aus Shopify Mock Shop. Alle vier Kategorien sind gefüllt und wieder verlinkt. Herkunfts-Badges unterscheiden G3-Konzept, belegte Produktart, Shopify-Muster und Sortimentsvorschlag. Das entfernte Shopify-Sortiment wurde dadurch noch nicht ersetzt. Vorschau-IDs sind keine Shopify-IDs und dürfen nie an Checkout weitergereicht werden. Keine Tarifänderung ohne Nutzerauftrag, keine kurzlebigen Vorschau-URLs oder Admin-Token als öffentliche Shop-Anbindung verwenden.
- Die G3-Website enthält nun Shop-Übersicht, Kategorien, Produktdetails mit Varianten, eine lokale Auswahl ohne G3-Login und eine serverseitig vorbereitete Shopify-Checkout-Übergabe. Standard ist Vorschau mit deaktiviertem Checkout. Live-API und echter Kaufabschluss sind wegen des fehlenden unterstützten Storefront-Zugangs noch nicht abgenommen.
- Danach die kleine Blog-Redaktion mit Entwurfsstatus und Vorschau umsetzen.
- Einen ersten Artikel als vollständigen Testlauf vorbereiten: „Dein erstes CrossFit-Probetraining bei G3: So läuft es ab“.
- Den tatsächlichen Ablauf des Probetrainings beim Betreiber bzw. den Coaches erheben. Fehlende Angaben als offene Fragen behandeln und nicht ergänzen oder erfinden.
- Technische Artikelablage, Redaktionsoberfläche und mögliche KI-Anbindung nach Prüfung des vorhandenen Codes auswählen. Dieser Plan legt noch keinen CMS- oder Modellanbieter fest.

## Redaktioneller Ablauf

Themen finden → Quellen und Coach-Wissen sammeln → Entwurf schreiben → Fakten prüfen → Vorschau erstellen → menschlich freigeben → veröffentlichen.

Der Agent darf Themen vorschlagen, recherchieren, Entwürfe erstellen und passende interne Links, Metadaten sowie kurze Social-Media-Auszüge vorbereiten. Veröffentlichungen und das Versenden von Social-Media-Beiträgen benötigen eine ausdrückliche Freigabe; vorbereitete Auszüge werden nicht automatisch versendet.

### Inhaltliche Regeln

- Zielgruppe sind Interessierte und Mitglieder von G3. Artikel sollen konkrete Fragen beantworten und eigene Erfahrung aus der Box vermitteln.
- Gym-Fakten aus den zentralen gepflegten Projektquellen beziehen, insbesondere `website/src/lib/site.ts`. Preise und Kurszeiten ausschließlich aus verifizierten aktuellen Quellen übernehmen. Widersprüche vor Veröffentlichung klären.
- Coach-Zitate, Erfahrungsberichte, Namen, Qualifikationen und Bewertungen nur mit echtem Ausgangsmaterial verwenden. Keine Aussagen realen Personen zuschreiben, die sie nicht freigegeben haben.
- Quellen und offene Fragen im Entwurf festhalten. Trainings- und Gesundheitsaussagen fachlich prüfen lassen; keine erfundenen Studien oder Heilversprechen.
- Echte Fotos nur mit entsprechender Nutzungsfreigabe verwenden. KI-inszenierte Räume oder Szenen nicht als dokumentarische Aufnahmen von G3 darstellen.
- Auf Originalität, hilfreiche Antworten und nachvollziehbare Expertise achten. Keine massenhafte Produktion austauschbarer SEO-Seiten.

### Themen für den Pilot

1. Dein erstes CrossFit-Probetraining bei G3: So läuft es ab.
2. Muss ich für CrossFit schon fit sein?
3. Was bedeutet Skalieren im CrossFit?

### Abnahme des Testlaufs

- Ein vollständiger Entwurf mit Quellen, Autorenzuordnung und geklärten Fakten liegt vor.
- Entwürfe bleiben aus öffentlicher Artikelliste, Sitemap und Suchmaschinenindex ausgeschlossen. Eine Vorschau vertraulicher oder unveröffentlichter Inhalte benötigt geeigneten Zugriffsschutz; `noindex` allein ist kein Zugriffsschutz.
- Eine Vorschau funktioniert auf Desktop und Mobil; Links und Probetraining-CTA führen zu den richtigen Zielen.
- Autor und Freigabe dürfen nicht automatisch behauptet werden. Die zuständige Person prüft den Artikel vor Veröffentlichung.
- Der freigegebene Artikel erhält eine stabile sprechende URL, passende Metadaten und interne Verlinkungen. Strukturierte Daten enthalten nur tatsächliche Angaben.
- Erst nach erfolgreichem Testlauf den wiederkehrenden Ablauf konkretisieren: Zuständigkeit, Themenauswahl, Rhythmus, Freigabe, Fehlerbehandlung und Erfolgsmessung.

## Referenz

- Google Search Central: [Leitlinie zu generativer KI für Website-Inhalte](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content).

## Hero-Entscheidung

- Startseite: Scroll-Sequenz mit 240 Einzelbildern auf geeigneten Desktop-Geräten. Headline und Probetraining-CTA stehen fest über einer abgedunkelten Bildebene.
- Mobil/Touch, reduzierte Bewegung und Datensparmodus: keine Canvas-Haltestrecke; Text und CTA stehen vor dem Poster. Optionaler Film wird nur nach Klick geladen (ca. 1 MB).
- Alter Film-Hero zum Vergleich: `/experiments/hero-film`; reiner Canvas-Versuch: `/experiments/scroll-film`, beide noindex. Herkunft der KI-inszenierten Aufnahmen sichtbar kennzeichnen.
- Technische Grenzen und Vergleich: `docs/SCROLL_FILM.md`. Keine behaupteten Conversion- oder Realgeräte-FPS-Messungen.

## Arbeitsstand zur Orientierung

- Entwicklungsbranch: `fix/website-design-audit`, bestehender PR #3.
- Der Hero-Film ist mit Commit `659ced9` in diesen Branch hochgeladen. Eine erfolgreiche Live-Veröffentlichung ist dadurch nicht bestätigt.
- Deployment-Status und CI vor weiteren Veröffentlichungen erneut prüfen; diese Angaben sind eine Momentaufnahme.
