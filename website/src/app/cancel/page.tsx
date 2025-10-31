"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  XCircle, 
  ArrowLeft, 
  MessageCircle, 
  HelpCircle,
  CreditCard,
  Shield,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-muted to-muted/50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-foreground rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-block mb-6"
          >
            <XCircle className="w-24 h-24 text-muted-foreground" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading"
          >
            Zahlung abgebrochen
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground font-body max-w-2xl mx-auto"
          >
            Kein Problem! Deine Zahlung wurde nicht durchgeführt und es wurden keine Kosten berechnet.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Why might this happen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 font-heading text-center">
              Warum wurde die Zahlung abgebrochen?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Reason 1 */}
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-heading">
                    Zahlungsmethode
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Möglicherweise gab es ein Problem mit deiner Zahlungsmethode oder du hast den Vorgang abgebrochen.
                  </p>
                </CardContent>
              </Card>

              {/* Reason 2 */}
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-secondary-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-heading">
                    Mehr Zeit benötigt
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Du möchtest dir noch mehr Zeit nehmen, um die richtige Mitgliedschaft auszuwählen.
                  </p>
                </CardContent>
              </Card>

              {/* Reason 3 */}
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-accent-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-heading">
                    Fragen offen
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Du hast noch Fragen zu den Mitgliedschaften oder möchtest persönlich beraten werden.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* What's next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="bg-primary-50 border-primary-200">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-center">
                  Wie können wir dir helfen?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Option 1: Try again */}
                  <div className="bg-white rounded-card p-6 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <ArrowLeft className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2 font-heading">
                          Erneut versuchen
                        </h3>
                        <p className="text-sm text-muted-foreground font-body mb-4">
                          Gehe zurück zur Preisübersicht und wähle deine Mitgliedschaft erneut aus.
                        </p>
                        <Link href="/pricing">
                          <Button className="w-full">
                            Zur Preisübersicht
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Contact us */}
                  <div className="bg-white rounded-card p-6 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2 font-heading">
                          Persönliche Beratung
                        </h3>
                        <p className="text-sm text-muted-foreground font-body mb-4">
                          Lass dich von unserem Team beraten und finde die perfekte Mitgliedschaft.
                        </p>
                        <Link href="/contact">
                          <Button variant="outline" className="w-full">
                            Kontakt aufnehmen
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Free Trial CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-linear-to-br from-accent-500 to-accent-600 text-white border-0">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl font-bold mb-4 font-heading">
                  Noch unsicher? Probiere uns kostenlos aus!
                </h2>
                <p className="text-xl mb-8 text-white/90 font-body max-w-2xl mx-auto">
                  Buche ein kostenloses Probetraining und überzeuge dich selbst von G3 CrossFit.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button 
                      size="lg" 
                      className="bg-white text-accent-500 hover:bg-white/90 w-full sm:w-auto"
                    >
                      Probetraining buchen
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                    >
                      Mehr über uns erfahren
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 font-heading text-center">
              Häufig gestellte Fragen
            </h2>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">
                    Wurde meine Karte belastet?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-body">
                    Nein, da die Zahlung abgebrochen wurde, wurde keine Belastung vorgenommen. 
                    Du kannst den Vorgang jederzeit erneut starten.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">
                    Welche Zahlungsmethoden akzeptiert ihr?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-body">
                    Wir akzeptieren alle gängigen Kreditkarten (Visa, Mastercard, American Express) 
                    sowie SEPA-Lastschrift für wiederkehrende Zahlungen.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">
                    Kann ich die Mitgliedschaft auch vor Ort abschließen?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-body">
                    Ja, du kannst gerne zu unseren Öffnungszeiten vorbeikommen und die Mitgliedschaft 
                    persönlich abschließen. Unser Team berät dich gerne!
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading">
              Sichere Zahlung mit Stripe
            </h3>
            <p className="text-muted-foreground font-body mb-4 max-w-2xl mx-auto">
              Alle Zahlungen werden sicher über Stripe verarbeitet. Deine Zahlungsdaten sind 
              durch modernste Verschlüsselung geschützt.
            </p>
            <p className="text-muted-foreground font-body">
              Fragen? Kontaktiere uns unter{' '}
              <a 
                href="mailto:info@g3crossfit.com" 
                className="text-primary-500 hover:text-primary-600 font-semibold"
              >
                info@g3crossfit.com
              </a>
              {' '}oder{' '}
              <a 
                href="tel:01605571866" 
                className="text-primary-500 hover:text-primary-600 font-semibold"
              >
                0160/5571866
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

