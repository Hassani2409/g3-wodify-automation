# Shopify-Integration – abgestimmte Umsetzung

G3-Website und ihre Gestaltung bleiben erhalten. Shopify verwaltet Produktkatalog, Varianten und Checkout. Einkaufen benötigt keinen G3-Login. Bekleidung wird zuerst aufgebaut, Geräte und Supplements folgen.

Die Website bekommt eine gemeinsame Produktübersicht, Produktdetail mit Varianten, einen lokal gespeicherten Auswahl-Warenkorb und serverseitige Übergabe an Shopify Checkout. Preise werden beim Checkout durch Shopify bestimmt, niemals vom Browser übernommen. Die Vorschau verwendet die ausdrücklich gekennzeichnete erweiterte Musterkollektion mit 51 Artikeln: acht G3-Entwürfe, 29 aus dem Shopify-Aufbaushop gelesene Artikel, acht Geräte und sechs Supplements aus Shopify Mock Shop. Zusätzliche Sortimentsvorschläge verwenden synthetische Vorschau-IDs. Kaufabschluss bleibt dort gesperrt. Live-Modus verlangt konfigurierte Storefront-Zugangsdaten und eine ausdrückliche Checkout-Freigabe.

Prüfen: Varianten und Mengen, manipulierte Checkout-Anfragen, fehlender Storefront-Zugriff, ungültige gespeicherte Auswahl, leere Kategorien, Desktop/Mobil, Lint/TypeScript/Tests/Build. Bis der Headless-Zugang funktioniert, ist die API-Anbindung vorbereitet, aber nicht live abgenommen.
