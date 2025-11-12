"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Mail, Phone, MapPin, Building } from "lucide-react";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 text-white bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden pt-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FileText className="h-16 w-16 mx-auto mb-6 text-accent-400" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-heading">
              Impressum
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 max-w-3xl mx-auto font-body">
              Angaben gemäß § 5 TMG
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 md:p-12 space-y-8">
              {/* Geschäftsführer */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <Building className="h-6 w-6 text-primary-500" />
                  Geschäftsführer
                </h2>
                <div className="space-y-2 text-muted-foreground font-body">
                  <p>Denis Boateng</p>
                  <p>G3 CrossFit Berlin</p>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary-500" />
                  Adresse
                </h2>
                <div className="space-y-2 text-muted-foreground font-body">
                  <p>G3 CrossFit Berlin</p>
                  <p>Musterstraße 123</p>
                  <p>10115 Berlin</p>
                  <p>Deutschland</p>
                </div>
              </div>

              {/* Kontakt */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <Phone className="h-6 w-6 text-primary-500" />
                  Kontakt
                </h2>
                <div className="space-y-2 text-muted-foreground font-body">
                  <p>
                    <strong className="text-foreground">Telefon:</strong>{" "}
                    <a href="tel:+493012345678" className="text-primary-600 hover:text-primary-700">
                      +49 30 1234 5678
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">E-Mail:</strong>{" "}
                    <a href="mailto:info@g3crossfit.de" className="text-primary-600 hover:text-primary-700">
                      info@g3crossfit.de
                    </a>
                  </p>
                </div>
              </div>

              {/* Umsatzsteuer-ID */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  Umsatzsteuer-ID
                </h2>
                <p className="text-muted-foreground font-body">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
                </p>
                <p className="text-muted-foreground font-body mt-2">
                  DE123456789
                </p>
              </div>

              {/* Aufsichtsbehörde */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  Aufsichtsbehörde
                </h2>
                <p className="text-muted-foreground font-body">
                  Gewerbeaufsichtsamt Berlin
                </p>
              </div>

              {/* Verantwortlich für den Inhalt */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
                </h2>
                <div className="space-y-2 text-muted-foreground font-body">
                  <p>Denis Boateng</p>
                  <p>Musterstraße 123</p>
                  <p>10115 Berlin</p>
                  <p>Deutschland</p>
                </div>
              </div>

              {/* Haftungsausschluss */}
              <div className="pt-8 border-t border-muted">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  Haftungsausschluss
                </h2>
                <div className="space-y-4 text-muted-foreground font-body">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                      Haftung für Inhalte
                    </h3>
                    <p>
                      Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                      Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
                      Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                      nach den allgemeinen Gesetzen verantwortlich.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                      Haftung für Links
                    </h3>
                    <p>
                      Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
                      Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                      Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                      Seiten verantwortlich.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                      Urheberrecht
                    </h3>
                    <p>
                      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                      dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                      der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung 
                      des jeweiligen Autors bzw. Erstellers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Link */}
              <div className="pt-8 border-t border-muted">
                <Link
                  href="/"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium font-body"
                >
                  ← Zurück zur Startseite
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

