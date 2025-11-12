# 🛍️ Premium E-Commerce Shop Setup Guide

## Übersicht

Dieser Guide erklärt, wie du den vollständigen Premium E-Commerce-Shop für G3 CrossFit einrichtest und verwendest.

## 🚀 Schnellstart

### 1. Datenbank-Migrationen ausführen

```bash
# Erstelle die Migrationen für die neuen Tabellen (Reviews, Wishlist)
alembic revision --autogenerate -m "Add product reviews and wishlist"

# Wende die Migrationen an
alembic upgrade head
```

### 2. Produkte seeden

```bash
# Führe das Seeding-Script aus
python scripts/seed_products.py
```

Das Script erstellt 20+ echte CrossFit-Produkte in verschiedenen Kategorien:
- Bekleidung (T-Shirts, Hoodies, Leggings, Shorts)
- Accessoires (Wasserflaschen, Rucksäcke, Handtücher, Handschuhe)
- Supplements (Protein, BCAA, Pre-Workout, Kreatin, Omega-3)
- Equipment (Kettlebells, Springseile, Resistance Bands, Pull-Up Bars)

### 3. Backend starten

```bash
python main.py
# oder
./start_backend.sh
```

### 4. Frontend starten

```bash
cd website
npm run dev
```

## ✨ Features

### Vollständige Shop-Funktionalität

- ✅ **Produktkatalog** mit Filterung, Suche und Sortierung
- ✅ **Produktdetailseiten** mit Bildergalerie und Variantenauswahl
- ✅ **Warenkorb** mit Mengenänderung und Entfernen
- ✅ **Checkout-Prozess** mit Lieferadresse
- ✅ **Bestellabschluss** mit Bestellnummer
- ✅ **Produktbewertungen** mit Sternen-Rating und Kommentaren
- ✅ **Wishlist/Favoriten** für gespeicherte Produkte
- ✅ **Warenkorb-Badge** im Header mit Artikelanzahl
- ✅ **Responsive Design** für alle Geräte

### Premium Features

- ⭐ **Produktbewertungen**: Kunden können Produkte bewerten (1-5 Sterne)
- ⭐ **Verifizierte Käufe**: Badge für Käufer, die das Produkt gekauft haben
- ⭐ **Hilfreiche Bewertungen**: Nutzer können Bewertungen als hilfreich markieren
- ⭐ **Wishlist**: Produkte für später speichern
- ⭐ **Erweiterte Filterung**: Nach Kategorie, Preis, Verfügbarkeit
- ⭐ **Produktvarianten**: Größen und andere Optionen
- ⭐ **Bildergalerie**: Mehrere Produktbilder pro Produkt

## 📁 Dateistruktur

### Backend

```
src/
├── api/
│   └── shop.py              # Shop API Endpoints (Products, Cart, Orders, Reviews, Wishlist)
├── models/
│   └── database.py          # Datenbankmodelle (Product, CartItem, Order, ProductReview, WishlistItem)
└── database.py              # Datenbank-Session-Management

scripts/
└── seed_products.py         # Produkt-Seeding-Script
```

### Frontend

```
website/src/
├── app/shop/
│   ├── page.tsx             # Shop-Übersichtsseite
│   ├── [id]/page.tsx        # Produktdetailseite
│   ├── cart/page.tsx        # Warenkorb-Seite
│   ├── checkout/page.tsx    # Checkout-Seite
│   └── wishlist/page.tsx    # Wishlist-Seite
├── components/
│   └── ProductReviews.tsx   # Reviews-Komponente
└── lib/api/
    ├── products.ts          # Produkt-API
    ├── cart.ts             # Warenkorb-API
    ├── orders.ts           # Bestellungen-API
    ├── reviews.ts          # Reviews-API
    └── wishlist.ts         # Wishlist-API
```

## 🔌 API-Endpoints

### Produkte

- `GET /api/shop/products` - Alle Produkte abrufen
- `GET /api/shop/products/{product_id}` - Einzelnes Produkt abrufen

### Warenkorb

- `GET /api/shop/cart` - Warenkorb abrufen
- `POST /api/shop/cart` - Produkt zum Warenkorb hinzufügen
- `PATCH /api/shop/cart/{item_id}` - Menge aktualisieren
- `DELETE /api/shop/cart/{item_id}` - Item entfernen
- `DELETE /api/shop/cart` - Warenkorb leeren

### Bestellungen

- `POST /api/shop/orders` - Bestellung erstellen
- `GET /api/shop/orders` - Alle Bestellungen abrufen
- `GET /api/shop/orders/{order_id}` - Einzelne Bestellung abrufen

### Bewertungen

- `GET /api/shop/products/{product_id}/reviews` - Bewertungen abrufen
- `POST /api/shop/reviews` - Bewertung erstellen
- `POST /api/shop/reviews/{review_id}/helpful` - Als hilfreich markieren

### Wishlist

- `GET /api/shop/wishlist` - Wishlist abrufen
- `POST /api/shop/wishlist/{product_id}` - Zur Wishlist hinzufügen
- `DELETE /api/shop/wishlist/{product_id}` - Aus Wishlist entfernen

## 🎨 Verwendung

### Produkte anzeigen

1. Navigiere zu `/shop`
2. Verwende Filter und Suche, um Produkte zu finden
3. Klicke auf ein Produkt, um Details zu sehen

### Produkt bewerten

1. Gehe zur Produktdetailseite
2. Scrolle zu "Kundenbewertungen"
3. Klicke auf "Bewertung schreiben"
4. Wähle Sterne-Bewertung (1-5)
5. Schreibe optional einen Titel und Kommentar
6. Klicke auf "Bewertung absenden"

### Produkt zur Wishlist hinzufügen

1. Gehe zur Produktdetailseite
2. Klicke auf das Herz-Icon neben "In den Warenkorb"
3. Das Produkt wird zu deiner Wishlist hinzugefügt
4. Zugriff über `/shop/wishlist` oder das Herz-Icon im Header

### Bestellung aufgeben

1. Füge Produkte zum Warenkorb hinzu
2. Gehe zum Warenkorb (`/shop/cart`)
3. Überprüfe deine Artikel
4. Klicke auf "Zur Kasse"
5. Fülle die Lieferadresse aus
6. Klicke auf "Bestellung abschließen"
7. Erhalte deine Bestellnummer

## 🔧 Konfiguration

### Versandkosten

Standardversand: 5,99€
Kostenloser Versand: ab 50€ Bestellwert

Die Versandkosten werden automatisch im Backend berechnet (`src/api/shop.py`).

### Produktkategorien

- `clothing` - Bekleidung
- `accessories` - Accessoires
- `supplements` - Nahrungsergänzungsmittel
- `equipment` - Trainingsgeräte

## 📊 Datenbank-Schema

### Neue Tabellen

- `product_reviews` - Produktbewertungen
- `wishlist_items` - Wishlist-Einträge

### Erweiterte Tabellen

- `products` - Produkte mit erweiterten Feldern
- `cart_items` - Warenkorb-Items
- `orders` - Bestellungen
- `order_items` - Bestellpositionen

## 🐛 Troubleshooting

### Produkte werden nicht angezeigt

1. Prüfe, ob das Seeding-Script erfolgreich ausgeführt wurde
2. Prüfe die Datenbank-Verbindung
3. Prüfe die Backend-Logs

### Bewertungen funktionieren nicht

1. Stelle sicher, dass der User eingeloggt ist
2. Prüfe, ob die Migrationen ausgeführt wurden
3. Prüfe die Backend-Logs für Fehler

### Wishlist funktioniert nicht

1. Stelle sicher, dass der User eingeloggt ist
2. Prüfe die API-Antworten im Browser-Console
3. Prüfe die Backend-Logs

## 🚀 Nächste Schritte

Mögliche Erweiterungen:

- [ ] Zahlungsintegration (Stripe, PayPal)
- [ ] Produktempfehlungen basierend auf Käufen
- [ ] Erweiterte Suche mit Autocomplete
- [ ] Produktvergleich
- [ ] Kategorien-Seiten
- [ ] Bestellverfolgung mit Tracking-Nummern
- [ ] E-Mail-Benachrichtigungen für Bestellungen
- [ ] Admin-Panel für Produktverwaltung
- [ ] Produktbild-Upload
- [ ] Rabattcodes und Gutscheine

## 📝 Entwicklung

### Neue Produkte hinzufügen

Bearbeite `scripts/seed_products.py` und füge neue Produkte zum `PRODUCTS`-Array hinzu.

### API erweitern

Erweitere `src/api/shop.py` mit neuen Endpoints.

### UI-Komponenten erweitern

Erstelle neue Komponenten in `website/src/components/` und binde sie in die Shop-Seiten ein.

## 📞 Support

Bei Fragen oder Problemen, erstelle ein Issue im Repository oder kontaktiere das Entwicklungsteam.

