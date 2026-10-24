# G3 Shop in der Website

## Umgesetzt

- `/shop`: gemeinsame Vorschau mit 51 Artikeln. Kategorien: 32 Bekleidungsartikel, fünf Accessoires, acht Geräte und sechs Supplements. Die acht G3-Entwürfe bleiben zuerst sichtbar.
- `/shop/<handle>`: lokale Muster-Handles, Größen-/Schnitt-/Farbauswahl, Bildergalerie, Mengenauswahl. Das Hauptbild und das Warenkorbbild folgen der gewählten Variante.
- `/shop/cart`: lokale Produktauswahl ohne G3-Anmeldung, Mengen und Entfernen, Header-Zähler, Speicherung im Browser.
- Alle vier gefüllten Kategorien sind in Shop-Navigation und Header verlinkt und haben eigene gefilterte Seiten.
- Der alte Shop-Checkout leitet auf den Warenkorb. Keine Kundendaten werden in einem eigenen Bestellformular gesammelt.
- Merkliste und Shopify-Bestellhistorie sind noch keine implementierten Funktionen; die alten Routen zeigen diesen Status ausdrücklich.

## Vorschaumodus (Standard)

`SHOPIFY_MODE=preview` verwendet `src/data/shopify-preview.json`, die am 24.10.2026 erweiterte Musterkollektion. Bilder/Preise sind Beispiele, die Auswahl löst keine Bestellung aus. Varianten sind im Vorschaumodus auswählbar; daraus wird keine Lieferbarkeit behauptet. Kein automatischer Aktualisierungslauf ist eingerichtet. Shop-Seiten sind bis zur echten Sortimentsfreigabe von der Indexierung ausgeschlossen.

## Musterkollektion und Bildquellen

Der G3-Teil enthält acht Artikel, 97 Varianten und 18 eigene Farbansichten. Hinzu kommen alle 29 bestehenden Shopify-Musterprodukte (erneut am 24.10.2026 per Admin-Abfrage gelesen) sowie acht Geräte und sechs Supplements aus Shopifys Mock-Shop-Katalogen. Die Shopify-Artikel tragen „Shopify-Muster“, die zusätzlichen Geräte und Supplements „Sortimentsvorschlag“. Die zusätzlichen Produkte sind noch nicht im entfernten G3-Shop angelegt. College-Jacke und Tasse sind als Produktarten auf g3crossfit.com belegt; ihre konkrete Gestaltung und sämtliche Preise bleiben Beispiele. Die sechs weiteren Artikel tragen zusätzlich das Badge „Konzept“. Technische Eigenschaften wie eine 12-Stunden-Kühlleistung werden nicht als bestätigt dargestellt.

Bildvorlagen sind KI-generiert; das vorhandene G3-PNG-Logo wird unverändert in lokale SVG-Mockups eingebettet. Es liegt kein originales Vektorlogo vor. Quellen und Prompts: `website/public/images/shop/g3/SOURCES.md` und `docs/g3-merch-image-prompts.md`. Alle Farbvarianten haben eine eigene Bilddatei; Schnittvarianten nutzen ausdrücklich eine gemeinsame Gestaltungsansicht.

Lokale Varianten-IDs beginnen mit `preview:g3-`. Sie sind nur für die gespeicherte Vorschauauswahl zugelassen und werden von der Checkout-Validierung abgewiesen. Der entfernte Shopify-Shop enthält weiterhin das bisher importierte Beispielsortiment; die neue Kollektion wurde noch nicht dorthin übertragen. Vor Live-Freigabe muss das Shopify-Sortiment entsprechend ersetzt und veröffentlicht werden.

## Aktuelle externe Grenze

Der Shop ist gespeichert und der CLI-/Admin-Zugriff funktioniert. Der Nutzer meldet, dass Headless im aktuellen Tarif nicht verfügbar ist. Die tokenlose Storefront-API antwortet mit `Online Store channel is locked`. Installation des Kanals allein hebt diese Tarifgrenze nicht auf. Keine Tarifänderung vorgenommen.

## Live-Anbindung vorbereiten

Konfiguration siehe `.env.shopify.example`. Die Datei enthält keine Zugangsdaten.

1. Im Shop einen unterstützten Storefront-Zugang einrichten. Ein passender Tarif ist vom Betreiber zu prüfen und auszuwählen.
2. Öffentlichen Storefront-Token (kein Admin-Token) über sichere Umgebungskonfiguration als `SHOPIFY_STOREFRONT_PUBLIC_TOKEN` hinterlegen. Nicht in Git schreiben oder im Chat posten.
3. `SHOPIFY_STORE_DOMAIN` setzen und `SHOPIFY_MODE=live` verwenden. Produktveröffentlichung für den betreffenden Kanal prüfen. Live-Modus fällt bei Fehlern bewusst nicht auf Musterprodukte zurück.
4. Produktkatalog, Varianten, Kategorien und Verfügbarkeit gegen Shopify prüfen. Produktarten pflegen (Bekleidung/Apparel, Accessoires, Equipment/Geräte, Supplements); unbekannte Typen erscheinen nur in der Gesamtübersicht. Für bekannte Muster-Handles bleibt die bisherige Kategorie erhalten.
5. Echte Produkte/Bilder/Preise sowie Zahlungsanbieter, Versand, Steuern, Richtlinien und Bestellprozess fertigstellen. Erst dann `SHOPIFY_CHECKOUT_ENABLED=true` freigeben und einen autorisierten Testkauf durchführen.

Die Checkout-Route akzeptiert nur Varianten-IDs und begrenzte ganzzahlige Mengen, prüft die aktuellen Varianten über Shopify und lässt Preise durch Shopify bestimmen. Fehler, Änderungen an der Auswahl und unerwartete Checkout-Hosts verhindern die Weiterleitung. Es werden keine Admin-Zugangsdaten im Webprozess verwendet.

## Noch nicht live verifiziert

- Storefront-Produktabfrage mit dem Zielshop.
- `cartCreate` und die echte Shopify-Checkout-Weiterleitung.
- Zahlung, Steuern, Versand, Bestellbestätigung und Rückerstattung.

Referenzen:
- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started
- https://shopify.dev/docs/api/storefront/2026-10/mutations/cartCreate


## Ergänztes Sortiment – Quellen und Grenzen

- Bekleidung/Accessoires: vorhandener Shopify-Aufbaushop; Referenzbilder der ursprünglichen Varianten aus `https://demostore.mock.shop/api` anhand von Handle, Variantentitel und Bilddateiname den importierten Galeriebildern zugeordnet. Importierte Preise/IDs bleiben erhalten; deutsche Namen und neutrale Vorschautexte ersetzen Muster-Werbetexte.
- Geräte: `https://fitness-dropship.mock.shop/api`, acht Musterartikel, darunter Kurzhanteln, Matten, Pedaltrainer und Massagestab.
- Supplements: `https://supplements.mock.shop/api`, sechs ausgewählte Produktarten: Protein, pflanzliches Protein, Kreatin, Elektrolyte, Multivitamine und Magnesium. Keine Gesundheits- oder Wirkversprechen übernommen. Vor Verkauf sind Herstellerdaten und vollständige Produktkennzeichnung erforderlich.
- Geräte-/Supplement-Preise sind frei gesetzte EUR-Beispiele, keine Umrechnung der USD-Quellpreise. Die Varianten verwenden synthetische `preview:g3-…`-IDs. Quellkatalog-IDs werden nie als IDs des G3-Shops ausgegeben.
- Bilder bleiben beim jeweiligen Shopify-CDN; SVG-Mockups der G3-Kollektion sind lokal. Der Vorschaukatalog ist eine Momentaufnahme und wird nicht automatisch synchronisiert.
