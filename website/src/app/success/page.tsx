"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  CheckCircle2, 
  Mail, 
  Calendar, 
  Download, 
  ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Keine Session-ID gefunden');
      setLoading(false);
      return;
    }

    // Fetch session data from API
    // This currently returns mock data until Stripe is fully configured
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`/api/checkout-session?session_id=${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch session');
        const data = await response.json();

        // Use mockData if available (temporary until Stripe is configured)
        const sessionInfo = data.mockData || data;
        setSessionData(sessionInfo);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Fehler beim Laden der Bestelldaten');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground font-body">
            Bestellung wird verarbeitet...
          </p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <CardTitle className="text-center text-2xl font-heading">
              Fehler
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground font-body mb-6">
              {error || 'Bestelldaten konnten nicht geladen werden'}
            </p>
            <Link href="/pricing">
              <Button className="w-full">
                Zurück zur Preisübersicht
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (amountInCents: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountInCents / 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-primary-500 to-secondary-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-block mb-6"
          >
            <CheckCircle2 className="w-24 h-24 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading"
          >
            Zahlung erfolgreich!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/90 font-body"
          >
            Willkommen in der G3 CrossFit Community! 🎉
          </motion.p>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">
                  Bestelldetails
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-muted">
                  <span className="text-muted-foreground font-body">Plan:</span>
                  <span className="font-semibold font-body">
                    {sessionData.metadata?.plan_name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-muted">
                  <span className="text-muted-foreground font-body">Laufzeit:</span>
                  <span className="font-semibold font-body">
                    {sessionData.metadata?.billing_type || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-muted">
                  <span className="text-muted-foreground font-body">E-Mail:</span>
                  <span className="font-semibold font-body">
                    {sessionData.customer_email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground font-body">Gesamtbetrag:</span>
                  <span className="text-2xl font-bold text-primary-500 font-heading">
                    {formatPrice(sessionData.amount_total, sessionData.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 font-heading text-center">
              Wie geht es weiter?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Step 1 */}
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-heading">
                    1. Bestätigungs-E-Mail
                  </h3>
                  <p className="text-muted-foreground font-body">
                    Du erhältst in Kürze eine E-Mail mit allen Details zu deiner Mitgliedschaft.
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-secondary-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-heading">
                    2. Termin buchen
                  </h3>
                  <p className="text-muted-foreground font-body">
                    Buche dein erstes Training über unsere WODIFY-App oder Website.
                  </p>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-accent-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-heading">
                    3. App herunterladen
                  </h3>
                  <p className="text-muted-foreground font-body">
                    Lade die WODIFY-App herunter, um Trainings zu buchen und deinen Fortschritt zu tracken.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto">
                Erstes Training buchen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Zur Startseite
              </Button>
            </Link>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground font-body mb-2">
              Fragen zu deiner Mitgliedschaft?
            </p>
            <p className="font-body">
              Kontaktiere uns unter{' '}
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

