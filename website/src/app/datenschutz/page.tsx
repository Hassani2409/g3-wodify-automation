"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Mail, Server } from "lucide-react";

export default function DatenschutzPage() {
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
            <Shield className="h-16 w-16 mx-auto mb-6 text-accent-400" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-heading">
              Datenschutzerklärung
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 max-w-3xl mx-auto font-body">
              Informationen zum Datenschutz gemäß DSGVO
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
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen 
                  Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit 
                  denen Sie persönlich identifiziert werden können.
                </p>
              </div>

              {/* Verantwortliche Stelle */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <Server className="h-6 w-6 text-primary-500" />
                  1. Verantwortliche Stelle
                </h2>
                <div className="space-y-2 text-muted-foreground font-body">
                  <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
                  <div className="bg-muted p-4 rounded-lg mt-4">
                    <p className="font-semibold text-foreground">G3 CrossFit Berlin</p>
                    <p>Denis Boateng</p>
                    <p>Musterstraße 123</p>
                    <p>10115 Berlin</p>
                    <p>Deutschland</p>
                    <p className="mt-2">
                      <strong>E-Mail:</strong>{" "}
                      <a href="mailto:info@g3crossfit.de" className="text-primary-600 hover:text-primary-700">
                        info@g3crossfit.de
                      </a>
                    </p>
                    <p>
                      <strong>Telefon:</strong>{" "}
                      <a href="tel:+493012345678" className="text-primary-600 hover:text-primary-700">
                        +49 30 1234 5678
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Datenerfassung */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <Database className="h-6 w-6 text-primary-500" />
                  2. Datenerfassung auf dieser Website
                </h2>
                <div className="space-y-4 text-muted-foreground font-body">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                      Kontaktformular
                    </h3>
                    <p>
                      Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
                      Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung 
                      der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                      Registrierung und Mitgliedschaft
                    </h3>
                    <p>
                      Bei der Registrierung für eine Mitgliedschaft werden folgende Daten erfasst: Name, E-Mail-Adresse, 
                      Telefonnummer, Geburtsdatum und Adresse. Diese Daten werden zur Verwaltung Ihrer Mitgliedschaft 
                      und zur Kommunikation mit Ihnen verwendet.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                      Kursbuchungen
                    </h3>
                    <p>
                      Bei der Buchung von Kursen werden Ihre Buchungsdaten gespeichert, um die Kursverwaltung 
                      durchzuführen und Ihnen Bestätigungen zukommen zu lassen.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <Eye className="h-6 w-6 text-primary-500" />
                  3. Cookies
                </h2>
                <p className="text-muted-foreground font-body">
                  Diese Website nutzt Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert 
                  werden. Einige Cookies sind notwendig für den Betrieb der Website, andere helfen uns, die Website 
                  zu verbessern und die Nutzung zu analysieren.
                </p>
              </div>

              {/* Ihre Rechte */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <Lock className="h-6 w-6 text-primary-500" />
                  4. Ihre Rechte
                </h2>
                <div className="space-y-2 text-muted-foreground font-body">
                  <p>Sie haben jederzeit das Recht:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten</li>
                    <li>Berichtigung unrichtiger Daten zu verlangen</li>
                    <li>Löschung Ihrer bei uns gespeicherten Daten zu verlangen</li>
                    <li>Einschränkung der Datenverarbeitung zu verlangen</li>
                    <li>Widerspruch gegen die Verarbeitung Ihrer Daten einzulegen</li>
                    <li>Datenübertragbarkeit zu verlangen</li>
                    <li>Beschwerde bei einer Aufsichtsbehörde einzulegen</li>
                  </ul>
                </div>
              </div>

              {/* WODIFY Integration */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  5. WODIFY Integration
                </h2>
                <p className="text-muted-foreground font-body">
                  Wir nutzen WODIFY für die Verwaltung von Mitgliedschaften und Kursbuchungen. Ihre Daten werden 
                  dabei an WODIFY übermittelt. Weitere Informationen zum Datenschutz bei WODIFY finden Sie in 
                  der Datenschutzerklärung von WODIFY.
                </p>
              </div>

              {/* SendGrid */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary-500" />
                  6. E-Mail-Versand (SendGrid)
                </h2>
                <p className="text-muted-foreground font-body">
                  Für den Versand von E-Mails nutzen wir den Dienst SendGrid. Ihre E-Mail-Adresse wird dabei 
                  an SendGrid übermittelt. SendGrid verarbeitet Ihre Daten gemäß den Datenschutzbestimmungen 
                  von SendGrid.
                </p>
              </div>

              {/* SSL-Verschlüsselung */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  7. SSL-Verschlüsselung
                </h2>
                <p className="text-muted-foreground font-body">
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte 
                  eine SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile 
                  des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
                </p>
              </div>

              {/* Kontakt */}
              <div className="pt-8 border-t border-muted">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">
                  Fragen zum Datenschutz?
                </h2>
                <p className="text-muted-foreground font-body mb-4">
                  Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-body">
                    <strong className="text-foreground">E-Mail:</strong>{" "}
                    <a href="mailto:datenschutz@g3crossfit.de" className="text-primary-600 hover:text-primary-700">
                      datenschutz@g3crossfit.de
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

