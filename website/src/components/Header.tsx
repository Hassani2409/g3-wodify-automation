"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Dumbbell, Phone, Mail, MapPin, User, ShoppingBag, Heart, ChevronDown, Calendar, Users, Award, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getCart } from "@/lib/api/cart";

const navigation = [
  { 
    name: "Home", 
    href: "/",
    megaMenu: null
  },
  { 
    name: "Training", 
    href: "/training",
    megaMenu: {
      title: "Unsere Trainingsprogramme",
      description: "Von Anfänger bis Elite - finde das Training, das zu dir passt",
      columns: [
        {
          title: "Programme",
          links: [
            { name: "CrossFit Classes", href: "/training#crossfit-advanced", description: "Intensives CrossFit für alle Level" },
            { name: "CrossFit Foundations", href: "/training#crossfit-beginner", description: "Perfekt für Einsteiger" },
            { name: "Olympic Weightlifting", href: "/training#olympic-lifting", description: "Technikfokussiertes Training" },
            { name: "Strength & Conditioning", href: "/training#strength-conditioning", description: "Kraftaufbau & athletische Entwicklung" },
            { name: "Gymnastics & Mobility", href: "/training#gymnastics", description: "Körperbeherrschung & Beweglichkeit" },
            { name: "Personal Training", href: "/training#personal-training", description: "1:1 Coaching" },
          ]
        },
        {
          title: "Ressourcen",
          links: [
            { name: "Kursplan", href: "/schedule", description: "Live-Kursplan & Buchung" },
            { name: "Probetraining", href: "/trial", description: "Kostenlos testen" },
            { name: "Mitgliedschaft", href: "/membership", description: "Preise & Pakete" },
            { name: "Coaches", href: "/coaches", description: "Unser Trainerteam" },
          ]
        }
      ]
    }
  },
  { 
    name: "Über uns", 
    href: "/about",
    megaMenu: {
      title: "Über G3 CrossFit",
      description: "Lerne uns kennen - unsere Werte, unser Team und unsere Community",
      columns: [
        {
          title: "Über uns",
          links: [
            { name: "Unsere Geschichte", href: "/about#story", description: "Wie alles begann" },
            { name: "Unser Team", href: "/coaches", description: "Lerne unsere Coaches kennen" },
            { name: "Unsere Werte", href: "/about#values", description: "Was uns antreibt" },
            { name: "Community", href: "/about#community", description: "Unsere G3 Familie" },
          ]
        },
        {
          title: "Erfahre mehr",
          links: [
            { name: "Blog", href: "/blog", description: "Aktuelle News & Tipps" },
            { name: "Showcase", href: "/showcase", description: "Erfolgsgeschichten" },
            { name: "Kontakt", href: "/contact", description: "Sprich mit uns" },
          ]
        }
      ]
    }
  },
  { 
    name: "Coaches", 
    href: "/coaches",
    megaMenu: null
  },
  { 
    name: "Preise", 
    href: "/pricing",
    megaMenu: null
  },
  { 
    name: "Shop", 
    href: "/shop",
    megaMenu: {
      title: "G3 CrossFit Shop",
      description: "Premium Equipment, Bekleidung und mehr",
      columns: [
        {
          title: "Kategorien",
          links: [
            { name: "Bekleidung", href: "/shop/category/clothing", description: "T-Shirts, Hoodies & mehr" },
            { name: "Accessoires", href: "/shop/category/accessories", description: "Trinkflaschen, Handtücher & mehr" },
            { name: "Supplements", href: "/shop/category/supplements", description: "Protein, Pre-Workout & mehr" },
            { name: "Equipment", href: "/shop/category/equipment", description: "Gewichte, Bänder & mehr" },
          ]
        },
        {
          title: "Shop",
          links: [
            { name: "Alle Produkte", href: "/shop", description: "Vollständiger Katalog" },
            { name: "Warenkorb", href: "/shop/cart", description: "Deine Auswahl" },
            { name: "Wunschliste", href: "/shop/wishlist", description: "Gespeicherte Artikel" },
          ]
        }
      ]
    }
  },
  { 
    name: "Kontakt", 
    href: "/contact",
    megaMenu: null
  },
];

const shopCategories = [
  { name: "Bekleidung", href: "/shop/category/clothing" },
  { name: "Accessoires", href: "/shop/category/accessories" },
  { name: "Supplements", href: "/shop/category/supplements" },
  { name: "Equipment", href: "/shop/category/equipment" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();
  const { user, token } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (user && token) {
      loadCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [user, token]);

  const loadCartCount = async () => {
    if (!token) return;
    try {
      const cart = await getCart(token);
      if (cart) {
        setCartItemCount(cart.items.length);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={`relative transition-all duration-300 ${
                  isScrolled ? "h-12 w-auto" : "h-14 w-auto"
                }`}
              >
                <Image
                  src="/logo.png"
                  alt="G3 CrossFit Logo"
                  width={150}
                  height={60}
                  className={`object-contain transition-opacity duration-300 ${
                    isScrolled ? "opacity-100" : "opacity-100"
                  }`}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation with Mega Menu */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const hasMegaMenu = item.megaMenu !== null;
                
                return (
                  <div
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  >
                    <Link
                      href={item.href}
                      className={`relative px-4 py-2 rounded-lg font-medium font-body transition-all duration-300 flex items-center gap-1 ${
                        isActive(item.href)
                          ? isScrolled
                            ? "text-primary-700"
                            : "text-white"
                          : isScrolled
                          ? "text-muted-foreground hover:text-primary-700"
                          : "text-primary-100 hover:text-white"
                      }`}
                    >
                      {item.name}
                      {hasMegaMenu && (
                        <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                      )}
                      {isActive(item.href) && (
                        <motion.div
                          layoutId="activeTab"
                          className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                            isScrolled ? "bg-primary-500" : "bg-white"
                          }`}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                    
                    {/* Mega Menu */}
                    {hasMegaMenu && item.megaMenu && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-screen max-w-4xl">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-card shadow-2xl border border-muted p-8"
                        >
                          <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground mb-2 font-heading">
                              {item.megaMenu.title}
                            </h3>
                            <p className="text-muted-foreground font-body">
                              {item.megaMenu.description}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-8">
                            {item.megaMenu.columns.map((column, colIndex) => (
                              <div key={colIndex}>
                                <h4 className="font-semibold text-foreground mb-4 font-heading">
                                  {column.title}
                                </h4>
                                <ul className="space-y-3">
                                  {column.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                      <Link
                                        href={link.href}
                                        className="block group/link hover:bg-primary-50 p-3 rounded-lg transition-colors"
                                      >
                                        <div className="font-medium text-foreground group-hover/link:text-primary-700 mb-1 font-body">
                                          {link.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground font-body">
                                          {link.description}
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/shop/cart"
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-button font-button font-medium transition-all duration-300 ${
                  isScrolled
                    ? "text-primary-700 hover:text-primary-800"
                    : "text-white hover:text-primary-50"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent-500 text-white text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
              <Link
                href="/shop/wishlist"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-button font-button font-medium transition-all duration-300 ${
                  isScrolled
                    ? "text-primary-700 hover:text-primary-800"
                    : "text-white hover:text-primary-50"
                }`}
              >
                <Heart className="w-5 h-5" />
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-button font-button font-semibold transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? "bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-white hover:bg-primary-50 text-primary-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-button font-button font-medium transition-all duration-300 ${
                      isScrolled
                        ? "text-primary-700 hover:text-primary-800"
                        : "text-white hover:text-primary-50"
                    }`}
                  >
                    Anmelden
                  </Link>
                  <Link
                    href="/contact"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-button font-button font-semibold transition-all duration-300 hover:scale-105 ${
                      isScrolled
                        ? "bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-white hover:bg-primary-50 text-primary-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    Probetraining
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-3 rounded-lg transition-all duration-300 touch-manipulation active:scale-95 ${
                isScrolled
                  ? "text-primary-700 hover:bg-primary-50 active:bg-primary-100"
                  : "text-white hover:bg-white/10 active:bg-white/20"
              }`}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-40 lg:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`block px-4 py-3 rounded-lg font-medium font-body transition-all duration-300 touch-manipulation active:scale-[0.98] ${
                          isActive(item.href)
                            ? "bg-primary-500 text-white active:bg-primary-600"
                            : "text-muted-foreground hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Divider */}
                <div className="border-t border-muted" />

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-heading">
                    Kontakt
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="tel:+493012345678"
                      className="flex items-center gap-3 text-foreground hover:text-primary-700 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-primary-500" />
                      <span className="font-body">+49 30 1234 5678</span>
                    </a>
                    <a
                      href="mailto:info@g3crossfit.de"
                      className="flex items-center gap-3 text-foreground hover:text-primary-700 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-primary-500" />
                      <span className="font-body">info@g3crossfit.de</span>
                    </a>
                    <div className="flex items-start gap-3 text-foreground">
                      <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                      <span className="font-body">
                        Musterstraße 123
                        <br />
                        10115 Berlin
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-muted" />

                {/* Cart Link */}
                <Link
                  href="/shop/cart"
                  className="relative inline-flex items-center gap-2 px-4 py-3 rounded-lg font-medium font-body transition-all duration-300 text-muted-foreground hover:bg-primary-50 hover:text-primary-700"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Warenkorb</span>
                  {cartItemCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 bg-accent-500 text-white text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>

                {/* Divider */}
                <div className="border-t border-muted" />

                {/* CTA Buttons */}
                {user ? (
                  <Link
                    href="/dashboard"
                    className="block w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white text-center font-button font-semibold rounded-button shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Zum Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block w-full px-6 py-4 mb-3 bg-white hover:bg-muted text-primary-700 text-center font-button font-semibold rounded-button border-2 border-primary-500 transition-all duration-300"
                    >
                      Anmelden
                    </Link>
                  <Link
                    href="/contact"
                    className="block w-full px-6 py-4 bg-accent-500 hover:bg-accent-600 text-white text-center font-button font-semibold rounded-button shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation active:scale-[0.98] active:bg-accent-700"
                  >
                    Kostenloses Probetraining
                  </Link>
                  </>
                )}

                {/* Opening Hours */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-heading">
                    Öffnungszeiten
                  </h3>
                  <div className="space-y-2 text-sm font-body">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mo - Fr</span>
                      <span className="font-semibold text-foreground">6:00 - 21:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sa - So</span>
                      <span className="font-semibold text-foreground">9:00 - 18:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

