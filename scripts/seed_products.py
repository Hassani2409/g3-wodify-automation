"""
Produkt-Seeding-Script für G3 CrossFit Shop
Erstellt echte CrossFit-Produkte mit realistischen Daten
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy.orm import Session
from src.database import get_db
from src.models.database import Product, ProductCategoryDB
import uuid

# Echte CrossFit-Produkte mit realistischen Daten
PRODUCTS = [
    # Bekleidung
    {
        "name": "G3 CrossFit Performance T-Shirt",
        "description": "Premium Baumwoll-T-Shirt mit G3 CrossFit Logo. Atmungsaktiv, langlebig und perfekt für intensive Workouts. Made in Germany.",
        "price": 29.99,
        "category": ProductCategoryDB.CLOTHING,
        "images": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop"
        ],
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "in_stock": True,
        "stock_quantity": 150,
        "featured": True,
        "sku": "G3-TS-001",
        "weight": 0.2,
        "dimensions": {"length": 70, "width": 50, "height": 2}
    },
    {
        "name": "G3 CrossFit Tank Top",
        "description": "Atmungsaktives Tank Top für intensive Workouts. Perfekt für warme Tage und hochintensive Trainingseinheiten.",
        "price": 24.99,
        "category": ProductCategoryDB.CLOTHING,
        "images": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop"
        ],
        "sizes": ["S", "M", "L", "XL"],
        "in_stock": True,
        "stock_quantity": 120,
        "featured": False,
        "sku": "G3-TT-001",
        "weight": 0.15,
        "dimensions": {"length": 65, "width": 45, "height": 2}
    },
    {
        "name": "G3 CrossFit Hoodie Premium",
        "description": "Warmes, bequemes Hoodie für dein Training und die Regeneration. Mit Reißverschluss und Kapuze. Perfekt für kühle Tage.",
        "price": 69.99,
        "category": ProductCategoryDB.CLOTHING,
        "images": [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop"
        ],
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "in_stock": True,
        "stock_quantity": 80,
        "featured": True,
        "sku": "G3-HD-001",
        "weight": 0.6,
        "dimensions": {"length": 75, "width": 60, "height": 5}
    },
    {
        "name": "G3 CrossFit Leggings",
        "description": "Hochwertige Leggings mit Kompression für optimale Performance. Atmungsaktiv und dehnbar für maximale Bewegungsfreiheit.",
        "price": 49.99,
        "category": ProductCategoryDB.CLOTHING,
        "images": [
            "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
        ],
        "sizes": ["XS", "S", "M", "L", "XL"],
        "in_stock": True,
        "stock_quantity": 100,
        "featured": False,
        "sku": "G3-LG-001",
        "weight": 0.3,
        "dimensions": {"length": 95, "width": 40, "height": 2}
    },
    {
        "name": "G3 CrossFit Shorts",
        "description": "Leichte, flexible Shorts für CrossFit-Training. Mit Taschen und elastischem Bund für maximalen Komfort.",
        "price": 34.99,
        "category": ProductCategoryDB.CLOTHING,
        "images": [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"
        ],
        "sizes": ["S", "M", "L", "XL"],
        "in_stock": True,
        "stock_quantity": 90,
        "featured": False,
        "sku": "G3-SH-001",
        "weight": 0.2,
        "dimensions": {"length": 50, "width": 45, "height": 2}
    },
    
    # Accessoires
    {
        "name": "G3 CrossFit Wasserflasche 750ml",
        "description": "Robuste, wiederverwendbare Trinkflasche aus Edelstahl. BPA-frei, isoliert und perfekt für dein Training.",
        "price": 19.99,
        "category": ProductCategoryDB.ACCESSORIES,
        "images": [
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop"
        ],
        "sizes": ["750ml"],
        "in_stock": True,
        "stock_quantity": 200,
        "featured": True,
        "sku": "G3-WF-001",
        "weight": 0.3,
        "dimensions": {"length": 25, "width": 8, "height": 8}
    },
    {
        "name": "G3 CrossFit Rucksack",
        "description": "Praktischer Rucksack für Training und Alltag. Mit separatem Schuhfach, Laptopfach und vielen Taschen.",
        "price": 79.99,
        "category": ProductCategoryDB.ACCESSORIES,
        "images": [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop"
        ],
        "sizes": ["One Size"],
        "in_stock": True,
        "stock_quantity": 60,
        "featured": True,
        "sku": "G3-BP-001",
        "weight": 0.8,
        "dimensions": {"length": 45, "width": 30, "height": 20}
    },
    {
        "name": "G3 CrossFit Handtuch",
        "description": "Schnelltrocknendes Mikrofaser-Handtuch. Kompakt, leicht und perfekt für das Training.",
        "price": 14.99,
        "category": ProductCategoryDB.ACCESSORIES,
        "images": [
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"
        ],
        "sizes": ["One Size"],
        "in_stock": True,
        "stock_quantity": 150,
        "featured": False,
        "sku": "G3-HT-001",
        "weight": 0.1,
        "dimensions": {"length": 80, "width": 40, "height": 1}
    },
    {
        "name": "G3 CrossFit Handschuhe",
        "description": "Professionelle Trainingshandschuhe mit verbesserter Griffigkeit. Schützen deine Hände bei Rope Climbs und Pull-Ups.",
        "price": 24.99,
        "category": ProductCategoryDB.ACCESSORIES,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop"
        ],
        "sizes": ["S", "M", "L", "XL"],
        "in_stock": True,
        "stock_quantity": 100,
        "featured": False,
        "sku": "G3-GL-001",
        "weight": 0.15,
        "dimensions": {"length": 25, "width": 15, "height": 2}
    },
    {
        "name": "G3 CrossFit Stirnband",
        "description": "Funktionales Stirnband aus hochwertigem Material. Hält Schweiß fern und sieht dabei stylisch aus.",
        "price": 9.99,
        "category": ProductCategoryDB.ACCESSORIES,
        "images": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop"
        ],
        "sizes": ["One Size"],
        "in_stock": True,
        "stock_quantity": 200,
        "featured": False,
        "sku": "G3-SB-001",
        "weight": 0.05,
        "dimensions": {"length": 50, "width": 8, "height": 1}
    },
    
    # Supplements
    {
        "name": "G3 Whey Protein Pulver",
        "description": "Hochwertiges Whey-Protein für optimale Regeneration. 25g Protein pro Portion, Vanille-Geschmack. Made in Germany.",
        "price": 39.99,
        "category": ProductCategoryDB.SUPPLEMENTS,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop"
        ],
        "sizes": ["1kg", "2.5kg"],
        "in_stock": True,
        "stock_quantity": 80,
        "featured": True,
        "sku": "G3-WP-001",
        "weight": 1.0,
        "dimensions": {"length": 20, "width": 20, "height": 25}
    },
    {
        "name": "G3 BCAA Pulver",
        "description": "Branched-Chain Amino Acids für bessere Performance und schnellere Regeneration. 2:1:1 Verhältnis, Zitrone-Geschmack.",
        "price": 29.99,
        "category": ProductCategoryDB.SUPPLEMENTS,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop"
        ],
        "sizes": ["300g", "600g"],
        "in_stock": True,
        "stock_quantity": 100,
        "featured": False,
        "sku": "G3-BC-001",
        "weight": 0.3,
        "dimensions": {"length": 15, "width": 15, "height": 20}
    },
    {
        "name": "G3 Pre-Workout Booster",
        "description": "Energie-Booster für maximale Performance. Mit Koffein, Beta-Alanin und Kreatin. Beeren-Geschmack.",
        "price": 34.99,
        "category": ProductCategoryDB.SUPPLEMENTS,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop"
        ],
        "sizes": ["300g", "600g"],
        "in_stock": True,
        "stock_quantity": 70,
        "featured": True,
        "sku": "G3-PW-001",
        "weight": 0.3,
        "dimensions": {"length": 15, "width": 15, "height": 20}
    },
    {
        "name": "G3 Kreatin Monohydrat",
        "description": "Reines Kreatin Monohydrat für mehr Kraft und Ausdauer. 100% rein, ohne Zusatzstoffe.",
        "price": 19.99,
        "category": ProductCategoryDB.SUPPLEMENTS,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop"
        ],
        "sizes": ["300g", "500g"],
        "in_stock": True,
        "stock_quantity": 120,
        "featured": False,
        "sku": "G3-CR-001",
        "weight": 0.3,
        "dimensions": {"length": 12, "width": 12, "height": 18}
    },
    {
        "name": "G3 Omega-3 Kapseln",
        "description": "Hochwertige Omega-3 Fettsäuren für Entzündungsreduktion und Herzgesundheit. 1000mg pro Kapsel.",
        "price": 24.99,
        "category": ProductCategoryDB.SUPPLEMENTS,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop"
        ],
        "sizes": ["120 Kapseln", "240 Kapseln"],
        "in_stock": True,
        "stock_quantity": 90,
        "featured": False,
        "sku": "G3-OM-001",
        "weight": 0.2,
        "dimensions": {"length": 10, "width": 10, "height": 15}
    },
    
    # Equipment
    {
        "name": "G3 Kettlebell 16kg",
        "description": "Professionelle Kettlebell für zu Hause. Aus Gusseisen, perfekt ausbalanciert für alle Kettlebell-Übungen.",
        "price": 79.99,
        "category": ProductCategoryDB.EQUIPMENT,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop"
        ],
        "sizes": ["16kg", "20kg", "24kg"],
        "in_stock": True,
        "stock_quantity": 40,
        "featured": True,
        "sku": "G3-KB-016",
        "weight": 16.0,
        "dimensions": {"length": 25, "width": 25, "height": 30}
    },
    {
        "name": "G3 CrossFit Jump Rope",
        "description": "Professionelles Springseil für Double Unders und Speed Rope. Verstellbare Länge, schnelle Rotation.",
        "price": 19.99,
        "category": ProductCategoryDB.EQUIPMENT,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop"
        ],
        "sizes": ["One Size"],
        "in_stock": True,
        "stock_quantity": 100,
        "featured": False,
        "sku": "G3-JR-001",
        "weight": 0.3,
        "dimensions": {"length": 300, "width": 2, "height": 2}
    },
    {
        "name": "G3 Resistance Bands Set",
        "description": "Komplettes Set mit 5 Widerstandsbändern (verschiedene Widerstände). Perfekt für Mobility und Krafttraining.",
        "price": 34.99,
        "category": ProductCategoryDB.EQUIPMENT,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop"
        ],
        "sizes": ["Set"],
        "in_stock": True,
        "stock_quantity": 60,
        "featured": False,
        "sku": "G3-RB-001",
        "weight": 0.5,
        "dimensions": {"length": 30, "width": 20, "height": 5}
    },
    {
        "name": "G3 Ab Roller",
        "description": "Professioneller Bauchmuskel-Roller für effektives Core-Training. Mit rutschfesten Griffen.",
        "price": 24.99,
        "category": ProductCategoryDB.EQUIPMENT,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop"
        ],
        "sizes": ["One Size"],
        "in_stock": True,
        "stock_quantity": 80,
        "featured": False,
        "sku": "G3-AR-001",
        "weight": 0.8,
        "dimensions": {"length": 35, "width": 15, "height": 15}
    },
    {
        "name": "G3 Pull-Up Bar für Türrahmen",
        "description": "Robuste Klimmzugstange für den Türrahmen. Einfach zu montieren, hält bis zu 150kg.",
        "price": 49.99,
        "category": ProductCategoryDB.EQUIPMENT,
        "images": [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop"
        ],
        "sizes": ["One Size"],
        "in_stock": True,
        "stock_quantity": 50,
        "featured": True,
        "sku": "G3-PB-001",
        "weight": 2.5,
        "dimensions": {"length": 100, "width": 5, "height": 5}
    },
    {
        "name": "G3 Yoga Mat Premium",
        "description": "Extra dicke Yogamatte (10mm) für optimalen Komfort. Rutschfest und langlebig.",
        "price": 39.99,
        "category": ProductCategoryDB.EQUIPMENT,
        "images": [
            "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
        ],
        "sizes": ["One Size"],
        "in_stock": True,
        "stock_quantity": 70,
        "featured": False,
        "sku": "G3-YM-001",
        "weight": 1.2,
        "dimensions": {"length": 180, "width": 60, "height": 1}
    },
]


def seed_products():
    """Seed products into database"""
    db: Session = SessionLocal()
    
    try:
        # Check if products already exist
        existing_count = db.query(Product).count()
        if existing_count > 0:
            print(f"⚠️  Es existieren bereits {existing_count} Produkte in der Datenbank.")
            response = input("Möchtest du die bestehenden Produkte löschen und neu anlegen? (j/n): ")
            if response.lower() != 'j':
                print("❌ Abgebrochen.")
                return
            
            # Delete existing products
            db.query(Product).delete()
            db.commit()
            print("✅ Bestehende Produkte gelöscht.")
        
        # Create products
        created_count = 0
        for product_data in PRODUCTS:
            product = Product(
                id=str(uuid.uuid4()),
                **product_data
            )
            db.add(product)
            created_count += 1
        
        db.commit()
        print(f"✅ {created_count} Produkte erfolgreich erstellt!")
        
        # Show summary
        print("\n📊 Zusammenfassung:")
        for category in ProductCategoryDB:
            count = db.query(Product).filter(Product.category == category).count()
            print(f"   {category.value}: {count} Produkte")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Fehler beim Seeding: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🌱 Starte Produkt-Seeding...")
    seed_products()
    print("✨ Fertig!")

