# Scroll-gesteuerter Canvas-Film – isolierter Prototyp

Routen: `/` verwendet nun den responsiven Scroll-Hero; `/experiments/scroll-film` zeigt die reine Steuerung, `/experiments/hero-film` bewahrt den vorherigen automatisch laufenden Film-Hero zum Vergleich. Beide Experimente sind noindex.

Quelle: vom Nutzer bereitgestellter Film `Gym_owner_guiding_camera_motion_1080p_20261024190217.mp4`, 24.10.2026. Zehn Sekunden, 1920×1080, 24 fps. KI-inszenierter Inhaber und Raumkonzept; kein dokumentarischer Rundgang.

240 Originalbilder wurden ohne Zwischenbildgenerierung in WebP (960×540, Qualität 58) umgewandelt. Gesamtgröße laut `public/sequences/g3-owner-tour/manifest.json`: rund 10,84 MiB. Aus dem Filmton wird keine Audiospur übernommen.

## Umsetzung

- Native Scrollposition wird linear auf Bild 0–239 abgebildet. Kein Abspielen nach Zeit, kein Scroll-Hijacking und kein Video-Seeking.
- Sticky-Canvas; Zurückscrollen wählt frühere Bilder. Pause, Tastatur-bedienbarer Positionsregler und Überspringen-Link stehen bereit.
- Native `requestAnimationFrame`-Zeichnung, keine React-Zustandsänderung pro Scrollbild. Drei parallele Lade-/Dekodiervorgänge, höchstens 20 dekodierte `ImageBitmap`-Objekte im eigenen Cache; entfernte Bitmaps werden mit `close()` freigegeben. Browser-Netzwerkcache und Canvas-Puffer sind zusätzliche Ressourcen.
- Nur benachbarte Bilder werden vorgeladen. Ein schneller Sprung kann kurz das nächste verfügbare Bild zeigen, bis das Zielbild geladen ist. Dies ist keine Garantie für alle Netzwerke oder Geräteleistungen.
- Statisches Poster bei `prefers-reduced-motion`; Scroll-Haltestrecke entfällt dabei und die Bewegungssteuerung ist deaktiviert. Ohne JavaScript bleibt das Poster sichtbar. Versteckte Tabs zeichnen nicht weiter.
- Gesamte Szene bleibt im 16:9-Format sichtbar, auch mobil. Die Startseite verwendet eine separate Hero-Komposition: feststehende Textebene und CTA über abgedunkeltem Cover-Bild.

## Prüfung

- Browser: Bild 0 → 74 → 141 → 101 beim Vorwärts-/Rückwärtsscrollen beobachtet; Pause hielt Bild 122 trotz weiterem Scrollen fest. Mobil Bild 93 und kein horizontaler Überlauf bei 390 px.
- Desktop-/Mobil-Vorschau geprüft. Bewegungseinstellung wurde im Browser nicht umgeschaltet; statischer Pfad aus Code und CSS geprüft. Vor einer Veröffentlichung auf echtem Mittelklasse-Handy und mit langsamem Netz messen.
- 18 Frontend-Tests, Lint, TypeScript und Produktions-Build erfolgreich. Tests prüfen Abbildung, Seitenverhältnisse, vorhandene Bildfolge und Transferbudget.

API-Referenzen: [ImageBitmap.close](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close), [createImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap).


## Startseiten-Integration

- Gemeinsame Canvas-Engine: `useScrollSequence.ts`; Hero und Technik-Prototyp teilen Laden, begrenzten Bitmap-Cache, Scroll-Mapping und Cleanup.
- Desktop ab 900 px Breite und 600 px Höhe mit Hover-Eingabe: 240svh Gesamtstrecke, davon 140svh native Scrollbewegung. Die Textebene und der Probetraining-Link bleiben auf ihrer Position; keine Animation dieser Bedienelemente. Pause und „Weiter zum Training“ umgehen den Effekt.
- Mobil und Geräte ohne Hover: normale Dokumenthöhe ohne Pinning. Headline, Erklärung und CTA stehen vor dem Filmfenster. Nur das Poster wird automatisch geladen. Nach explizitem Abspielen lädt ein stummer H.264-Film mit etwa 1 MB statt der ganzen Einzelbildfolge.
- `prefers-reduced-motion`, Datensparmodus oder fehlgeschlagene Bilddekodierung: Poster und optionale bewusste Filmwiedergabe, keine automatische Canvas-Sequenz. Ein gestarteter Mobilfilm pausiert außerhalb des sichtbaren Bereichs und im versteckten Tab.
- Vergleichskriterium ist hier Bedienbarkeit und Komposition, kein gemessener Conversion-Uplift. Eine Performance-Aufzeichnung auf echtem Mittelklasse-Handy und langsamem Netz bleibt vor Live-Freigabe erforderlich.

## Zweiter Abschnitt B1

- Startseite nach „Warum G3?“ und vor der Trainingsauswahl: `TrainingScroll`, 180svh einschließlich sichtbarer Bühne, 144 Einzelbilder aus dem sechssekündigen Nutzerclip `Hanging_climbing_rope_on_rig_1080p_20261024201546.mp4`.
- WebP 960×540; eigener begrenzter Bitmap-Cache. Die Bildfolge lädt erst innerhalb von 600px Abstand zum Abschnitt. Poster bleibt bei Ladefehlern sichtbar.
- Mobile/Touch, kleine Fenster, Datensparen und reduzierte Bewegung: normale Dokumenthöhe, Standbild und freiwillige Wiedergabe. Mobile MP4 ist ohne Audiospur; kein Autoplay.
- Überschrift und Link stehen rechts auf dunkler Fläche; Pause und Sprung zur echten Programmauswahl sind verfügbar. KI-inszenierter Raum ist als Gestaltungskonzept gekennzeichnet.

## Abschluss C1 aus Standbild

`ClosingInvitation` nach der Anfahrt: vorhandenes, vom Nutzer freigegebenes KI-Bild mit Inhaber. Desktop bei geeigneter Höhe/Breite, Hover und ohne reduzierte Bewegung: 160svh Gesamtstrecke, Bild skaliert scrollabhängig von 1.06 auf 1. Die Text- und CTA-Ebene bleibt unverändert; keine künstliche Personenbewegung. Mobil/Touch und kurze Fenster: normale Dokumenthöhe, Text vor vollständigem Standbild. Reduzierte Bewegung: keine Skalierung und keine zusätzliche Scrollstrecke. Kein zusätzlicher Film oder Canvas nötig; Herkunft sichtbar gekennzeichnet.

## Vercel-Vorschau / CI (24.10.2026)

Die beiden bereits verknüpften Vercel-Projekte `g3-wodify-automation` und `website` bauen die Next.js-Website aus `website/` mit Framework `nextjs`. Root Directory ist eine Projekteinstellung, kein Feld in `vercel.json`. Der FastAPI-Betrieb bleibt im separaten Docker-/Backend-Deployment; diese Vorschauen sind kein Nachweis einer produktiven CRM-Anbindung.
