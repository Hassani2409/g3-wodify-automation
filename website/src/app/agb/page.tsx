"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Scale, CreditCard, Calendar, X, AlertCircle } from "lucide-react";

export default function AGBPage() {
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
            <Scale className="h-16 w-16 mx-auto mb-6 text-accent-400" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-heading">
              Allgemeine Geschäftsbedingungen
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 max-w-3xl mx-auto font-body">
              AGB für G3 CrossFit Berlin
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 md:p-12 space-y-8">
              {/* Einleitung */}
              <div>
                <p className="text-muted-foreground font-body mb-4">
                  Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-muted-foreground font-body">
                  Die nachfolgenden Allgemeinen Geschäftsbedingungen (AGB) regeln die rechtlichen Beziehungen 
                  zwischen G3 CrossFit Berlin und den Mitgliedern sowie Nutzern unserer Dienstleistungen.
                </p>
              </div>

              {/* Geltungsbereich */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary-500" />
                  1. Geltungsbereich
                </h2>
                <p className="text-muted-foreground font-body">
                  Diese AGB gelten für alle Verträge zwischen G3 CrossFit Berlin und den Mitgliedern über die 
                  Nutzung der Trainingsangebote, Kursbuchungen und sonstigen Dienstleistungen.
                </p>
              </div>

              {/* Vertragsabschluss */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-primary-500" />
                  2. Vertragsabschluss
                </h2>
                <div className="space-y-4 text-muted-foreground font-body">
                  <p>
                    Der Vertrag kommt durch die Anmeldung des Mitglieds und die Annahme durch G3 CrossFit Berlin 
                    zustande. Die Anmeldung kann schriftlich, per E-Mail oder online erfolgen.
                  </p>
                  <p>
                    Mit der Anmeldung erkennt das Mitglied diese AGB an. Abweichende Bedingungen des Mitglieds 
                    werden nicht anerkannt, es sei denn, G3 CrossFit Berlin stimmt ihrer Geltung ausdrücklich zu.
                  </p>
                </div>
              </div>

              {/* Mitgliedschaften */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary-500" />
                  3. Mitgliedschaften und Preise
                </h2>
                <div className="space-y-4 text-muted-foreground font-body">
                  <p>
                    G3 CrossFit Berlin bietet verschiedene Mitgliedschaftsmodelle an. Die aktuellen Preise sind 
                    auf der Website unter /pricing einsehbar.
                  </p>
                  <p>
                    Die Mitgliedschaftsgebühren sind monatlich im Voraus zu zahlen. Bei Jahresverträgen kann eine 
                    jährliche Zahlung vereinbart werden.
                  </p>
                  <p>
                    Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.
                  </p>
                </div>
              </div>

              {/* Kündigung */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <X className="h-6 w-6 text-primary-500" />
                  4. Kündigung
                </h2>
                <div className="space-y-4 text-muted-foreground font-body">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                      Ordentliche Kündigung
                    </h3>
                    <p>
                      Mitgliedschaften können mit einer Frist von 4 Wochen zum Monatsende gekündigt werden. 
                      Die Kündigung muss schriftlich erfolgen.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                      Außerordentliche Kündigung
                    </h3>
                    <p>
                      Eine außerordentliche Kündigung aus wichtigem Grund ist jederzeit möglich. Ein wichtiger 
                      Grund liegt insbesondere vor, wenn G3 CrossFit Berlin die Erbringung der Leistungen dauerhaft 
                      einstellt oder wesentliche Vertragsbestandteile ändert.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kursbuchungen */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  5. Kursbuchungen
                </h2>
                <div className="space-y-4 text-muted-foreground font-body">
                  <p>
                    Kurse können online über unsere Website oder direkt im Studio gebucht werden. Die Buchung ist 
                    verbindlich, sobald sie von G3 CrossFit Berlin bestätigt wurde.
                  </p>
                  <p>
                    Stornierungen müssen spätestens 24 Stunden vor Kursbeginn erfolgen. Bei späteren Stornierungen 
                    oder Nichterscheinen wird die Kursgebühr nicht erstattet.
                  </p>
                </div>
              </div>

              {/* Haftung */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-primary-500" />
                  6. Haftung
                </h2>
                <div className="space-y-4 text-muted-foreground font-body">
                  <p>
                    Die Teilnahme am Training erfolgt auf eigene Gefahr. G3 CrossFit Berlin haftet nicht für 
                    Schäden, die durch die Teilnahme am Training entstehen, es sei denn, der Schaden wurde durch 
                    vorsätzliches oder grob fahrlässiges Verhalten von G3 CrossFit Berlin oder dessen Mitarbeitern 
                    verursacht.
                  </p>
                  <p>
                    Mitglieder sind verpflichtet, vor Beginn des Trainings eine Gesundheitsprüfung durchzuführen 
                    und bei gesundheitlichen Problemen einen Arzt zu konsultieren.
                  </p>
                </div>
              </div>

              {/* Hausordnung */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  7. Hausordnung
                </h2>
                <div className="space-y-4 text-muted-foreground font-body">
                  <p>Mitglieder sind verpflichtet, die Hausordnung einzuhalten:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Trainingsgeräte nach Gebrauch zurückstellen und säubern</li>
                    <li>Rücksicht auf andere Mitglieder nehmen</li>
                    <li>Anweisungen der Trainer befolgen</li>
                    <li>Keine verschmutzten Schuhe im Trainingsbereich tragen</li>
                    <li>Handtücher mitbringen und verwenden</li>
                    <li>Handys während des Trainings nicht benutzen</li>
                  </ul>
                </div>
              </div>

              {/* Datenschutz */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  8. Datenschutz
                </h2>
                <p className="text-muted-foreground font-body">
                  Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung, 
                  die Sie unter{" "}
                  <Link href="/datenschutz" className="text-primary-600 hover:text-primary-700 underline">
                    /datenschutz
                  </Link>{" "}
                  einsehen können.
                </p>
              </div>

              {/* Schlussbestimmungen */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  9. Schlussbestimmungen
                </h2>
                <div className="space-y-4 text-muted-foreground font-body">
                  <p>
                    Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten 
                    ist Berlin, sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder 
                    öffentlich-rechtliches Sondervermögen ist.
                  </p>
                  <p>
                    Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit 
                    der übrigen Bestimmungen unberührt.
                  </p>
                </div>
              </div>

              {/* Kontakt */}
              <div className="pt-8 border-t border-muted">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  Fragen zu den AGB?
                </h2>
                <p className="text-muted-foreground font-body mb-4">
                  Bei Fragen zu unseren AGB können Sie sich jederzeit an uns wenden:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-body">
                    <strong className="text-foreground">E-Mail:</strong>{" "}
                    <a href="mailto:info@g3crossfit.de" className="text-primary-600 hover:text-primary-700">
                      info@g3crossfit.de
                    </a>
                  </p>
                  <p className="font-body mt-2">
                    <strong className="text-foreground">Telefon:</strong>{" "}
                    <a href="tel:+493012345678" className="text-primary-600 hover:text-primary-700">
                      +49 30 1234 5678
                    </a>
                  </p>
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

