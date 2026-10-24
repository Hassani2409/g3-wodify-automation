"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, MapPin, User, ShoppingBag, Heart, ChevronDown } from "lucide-react";
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

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const mobilePanel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { user, token } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (user && token) {
      getCart(token).then((cart) => {
        if (!cancelled) setCartItemCount(cart?.items.length ?? 0);
      }).catch((error) => console.error("Error loading cart count:", error));
    }
    return () => { cancelled = true; };
  }, [user, token]);

  const solidHeader = isScrolled || pathname !== "/";

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobilePanel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const links = mobilePanel.current?.querySelectorAll<HTMLElement>("a, button");
        if (!links?.length) return;
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === menuButton.current)) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); menuButton.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out ${
          solidHeader
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={`relative transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out ${
                  solidHeader ? "h-12 w-auto" : "h-14 w-auto"
                }`}
              >
                <Image
                  src="/logo.png"
                  alt="G3 CrossFit Logo"
                  width={150}
                  height={60}
                  className="h-14 w-auto object-contain"
                  priority
                />
              </div>
            </Link>

            <NavigationMenu.Root aria-label="Hauptnavigation" value={openMenu} onValueChange={setOpenMenu} className="relative hidden xl:block" delayDuration={100}>
              <NavigationMenu.List className="flex items-center gap-1">
                {navigation.map((item) => (
                  <NavigationMenu.Item key={item.name} value={item.name}>
                    {item.megaMenu ? (
                      <NavigationMenu.Trigger className={`group flex items-center gap-1 px-3 py-2 rounded-lg font-body text-sm font-medium transition-colors duration-150 ${solidHeader ? "text-foreground hover:bg-primary-50" : "text-white hover:bg-white/10"}`}>
                        {item.name}<ChevronDown aria-hidden="true" className="w-4 h-4 transition-transform duration-150 group-data-[state=open]:rotate-180" />
                      </NavigationMenu.Trigger>
                    ) : (
                      <NavigationMenu.Link asChild active={isActive(item.href)}>
                        <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={`block px-3 py-2 rounded-lg text-sm font-body font-medium ${solidHeader ? "text-foreground hover:bg-primary-50" : "text-white hover:bg-white/10"}`}>{item.name}</Link>
                      </NavigationMenu.Link>
                    )}
                    {item.megaMenu && (
                      <NavigationMenu.Content className="mega-menu-content absolute left-0 top-full pt-3 w-[min(48rem,calc(100vw-3rem))]" onClick={() => setOpenMenu("")}>
                        <div className="bg-card text-foreground rounded-card shadow-2xl border border-border p-6">
                          <Link href={item.href} className="text-2xl font-heading font-semibold hover:underline">{item.megaMenu.title}</Link>
                          <p className="text-muted-foreground mt-2 mb-6 text-sm">{item.megaMenu.description}</p>
                          <div className="grid grid-cols-2 gap-6">
                            {item.megaMenu.columns.map((column) => (
                              <div key={column.title}>
                                <h3 className="font-heading text-lg font-semibold mb-2">{column.title}</h3>
                                <ul className="space-y-1">
                                  {column.links.map((link) => (
                                    <li key={link.href}><NavigationMenu.Link asChild>
                                      <Link href={link.href} className="block p-2 rounded-lg hover:bg-primary-50 focus-visible:bg-primary-50">
                                        <span className="block text-sm font-semibold">{link.name}</span>
                                        <span className="block text-xs text-muted-foreground mt-1">{link.description}</span>
                                      </Link>
                                    </NavigationMenu.Link></li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </NavigationMenu.Content>
                    )}
                  </NavigationMenu.Item>
                ))}
              </NavigationMenu.List>
            </NavigationMenu.Root>

            {/* Desktop CTA */}
            <div className="hidden xl:flex items-center gap-4">
              <Link
                href="/shop/cart"
                aria-label="Warenkorb"
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-button font-button font-medium transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out ${
                  solidHeader
                    ? "text-primary-700 hover:text-primary-800"
                    : "text-white hover:text-primary-50"
                }`}
              >
                <ShoppingBag aria-hidden="true" className="w-5 h-5" />
                {user && cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent-500 text-white text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
              <Link
                href="/shop/wishlist"
                aria-label="Wunschliste"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-button font-button font-medium transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out ${
                  solidHeader
                    ? "text-primary-700 hover:text-primary-800"
                    : "text-white hover:text-primary-50"
                }`}
              >
                <Heart className="w-5 h-5" />
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-button font-button font-semibold transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out active:scale-[0.97] ${
                    solidHeader
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
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-button font-button font-medium transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out ${
                      solidHeader
                        ? "text-primary-700 hover:text-primary-800"
                        : "text-white hover:text-primary-50"
                    }`}
                  >
                    Anmelden
                  </Link>
                  <Link
                    href="/contact#booking"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-button font-button font-semibold transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out active:scale-[0.97] ${
                      solidHeader
                        ? "bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl"
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
              ref={menuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`xl:hidden p-3 rounded-lg transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out touch-manipulation active:scale-95 ${
                solidHeader
                  ? "text-primary-700 hover:bg-primary-50 active:bg-primary-100"
                  : "text-white hover:bg-white/10 active:bg-white/20"
              }`}
              aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"} aria-controls={isMobileMenuOpen ? "mobile-navigation" : undefined}
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={mobilePanel}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-40 xl:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Navigation Links */}
                <nav id="mobile-navigation" aria-label="Mobile Navigation" className="space-y-2">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg font-medium font-body transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out touch-manipulation active:scale-[0.98] ${
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
                  className="relative inline-flex items-center gap-2 px-4 py-3 rounded-lg font-medium font-body transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out text-muted-foreground hover:bg-primary-50 hover:text-primary-700"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Warenkorb</span>
                  {user && cartItemCount > 0 && (
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
                    className="block w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white text-center font-button font-semibold rounded-button shadow-lg hover:shadow-xl transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out"
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Zum Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block w-full px-6 py-4 mb-3 bg-white hover:bg-muted text-primary-700 text-center font-button font-semibold rounded-button border-2 border-primary-500 transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out"
                    >
                      Anmelden
                    </Link>
                  <Link
                    href="/contact#booking"
                    className="block w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white text-center font-button font-semibold rounded-button shadow-lg hover:shadow-xl transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-160 ease-out touch-manipulation active:scale-[0.98] active:bg-accent-700"
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

