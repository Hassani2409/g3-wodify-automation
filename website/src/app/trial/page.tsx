"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackCTAClick, trackTrialBooking } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Check, 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  ArrowRight,
  Dumbbell,
  Heart,
  Star,
  Phone,
  Mail
} from "lucide-react";
import Image from "next/image";

export default function TrialPage() {
  const benefits = [
    {
      icon: <Dumbbell className="h-6 w-6" />,
      title: "Professionelles Training",
      description: "Zertifizierte CrossFit Level 2 Coaches begleiten dich"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Familiäre Atmosphäre",
      description: "Unterstützende Community für alle Fitnesslevel"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Individuelle Betreuung",
      description: "Personalisierte Trainingspläne und Feedback"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Keine Verpflichtungen",
      description: "100% kostenlos und unverbindlich"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Probetraining buchen",
      description: "Wähle einen passenden Termin aus unserem Kursplan"
    },
    {
      number: "02",
      title: "Kostenlos teilnehmen",
      description: "Erlebe ein vollständiges CrossFit-Training mit unserem Team"
    },
    {
      number: "03",
      title: "Beratungsgespräch",
      description: "Gemeinsam finden wir den perfekten Plan für dich"
    },
    {
      number: "04",
      title: "Mitglied werden",
      description: "Entscheide dich für eine passende Mitgliedschaft"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 border border-accent-500/40 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
            </span>
            <span className="text-accent-100 text-sm font-medium font-button">100% Kostenlos & Unverbindlich</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading"
          >
            Starte dein{" "}
            <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              kostenloses Probetraining
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-primary-50 mb-10 max-w-3xl mx-auto font-body"
          >
            Erlebe die G3 CrossFit Community hautnah und entdecke, wie wir dir helfen können, deine Fitnessziele zu erreichen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact#booking">
              <Button 
                size="lg" 
                className="bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-button text-base h-14 px-8 rounded-button"
                onClick={() => {
                  trackCTAClick('trial_booking_hero', 'trial_page');
                  trackTrialBooking();
                }}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Jetzt Termin buchen
              </Button>
            </Link>
            <Link href="/schedule">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-button text-base h-14 px-8 rounded-button"
              >
                Kursplan ansehen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
              Warum ein Probetraining?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Entdecke, was G3 CrossFit einzigartig macht
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary-500">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-600 mb-4">
                      {benefit.icon}
                    </div>
                    <CardTitle className="font-heading">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-body">{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
              So funktioniert's
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              In 4 einfachen Schritten zu deinem Probetraining
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-primary-300 -z-10" 
                    style={{ width: 'calc(100% - 4rem)' }} />
                )}
                <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="text-6xl font-bold text-primary-500/20 mb-4 font-heading">
                      {step.number}
                    </div>
                    <CardTitle className="font-heading">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-body">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
              Bereit für dein Probetraining?
            </h2>
            <p className="text-xl text-primary-50 mb-10 font-body">
              Buche jetzt deinen kostenlosen Termin und erlebe G3 CrossFit hautnah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact#booking">
                <Button 
                  size="lg" 
                  className="bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-button text-base h-14 px-8 rounded-button"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Jetzt buchen
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-button text-base h-14 px-8 rounded-button"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Kontakt aufnehmen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

