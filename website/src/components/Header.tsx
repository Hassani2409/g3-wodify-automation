"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Dumbbell, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Training", href: "/training" },
  { name: "Über uns", href: "/about" },
  { name: "Coaches", href: "/coaches" },
  { name: "Preise", href: "/pricing" },
  { name: "Kontakt", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? "bg-primary-500"
                    : "bg-white/10 backdrop-blur-sm"
                }`}
              >
                <Dumbbell
                  className={`h-8 w-8 transition-colors duration-300 ${
                    isScrolled ? "text-white" : "text-white"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-2xl font-bold font-heading transition-colors duration-300 ${
                    isScrolled ? "text-primary-700" : "text-white"
                  }`}
                >
                  G3 CrossFit
                </span>
                <span
                  className={`text-xs font-medium font-body transition-colors duration-300 ${
                    isScrolled ? "text-muted-foreground" : "text-primary-100"
                  }`}
                >
                  Berlin
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium font-body transition-all duration-300 ${
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
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
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
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? "text-primary-700 hover:bg-primary-50"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
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
                        className={`block px-4 py-3 rounded-lg font-medium font-body transition-all duration-300 ${
                          isActive(item.href)
                            ? "bg-primary-500 text-white"
                            : "text-muted-foreground hover:bg-primary-50 hover:text-primary-700"
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

                {/* CTA Button */}
                <Link
                  href="/contact"
                  className="block w-full px-6 py-4 bg-accent-500 hover:bg-accent-600 text-white text-center font-button font-semibold rounded-button shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Kostenloses Probetraining
                </Link>

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

