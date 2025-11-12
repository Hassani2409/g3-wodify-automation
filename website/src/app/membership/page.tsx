"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackCTAClick, trackMembershipSignup } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X,
  Star,
  Users,
  Calendar,
  Award,
  Heart,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  TrendingUp
} from "lucide-react";

export default function MembershipPage() {
  const memberships = [
    {
      name: "Starter",
      price: "79",
      period: "Monat",
      description: "Perfekt für Einsteiger",
      popular: false,
      features: [
        "3x Training pro Woche",
        "Zugang zu allen Kursen",
        "WODIFY App Zugang",
        "Community Events",
        "E-Mail Support"
      ],
      cta: "Jetzt starten",
      color: "primary"
    },
    {
      name: "Premium",
      price: "99",
      period: "Monat",
      description: "Unsere beliebteste Option",
      popular: true,
      features: [
        "Unbegrenztes Training",
        "Zugang zu allen Kursen",
        "WODIFY App Zugang",
        "Priority Booking",
        "Personal Training (1x/Monat)",
        "Nutrition Coaching",
        "Community Events",
        "24/7 Support"
      ],
      cta: "Jetzt starten",
      color: "accent"
    },
    {
      name: "Elite",
      price: "149",
      period: "Monat",
      description: "Für maximale Ergebnisse",
      popular: false,
      features: [
        "Unbegrenztes Training",
        "Zugang zu allen Kursen",
        "WODIFY App Zugang",
        "Priority Booking",
        "Personal Training (2x/Monat)",
        "Nutrition Coaching",
        "Recovery Sessions",
        "Competition Prep",
        "Community Events",
        "24/7 Support"
      ],
      cta: "Jetzt starten",
      color: "secondary"
    }
  ];

  const benefits = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "Zertifizierte Coaches",
      description: "Alle Trainer sind CrossFit Level 1 & 2 zertifiziert"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Kleine Gruppen",
      description: "Maximal 12 Personen für persönliche Betreuung"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Zeiten",
      description: "30+ Kurse pro Woche von 6:00 bis 20:00 Uhr"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Starke Community",
      description: "Unterstützende und motivierende Atmosphäre"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Alle Fitnesslevel",
      description: "Individuell skalierte Workouts für jeden"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Keine Vertragsbindung",
      description: "Monatlich kündbar, keine versteckten Kosten"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 pt-20">
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
            <Star className="h-4 w-4 text-accent-400 fill-accent-400" />
            <span className="text-accent-100 text-sm font-medium font-button">Beste Preise in Berlin</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading"
          >
            Wähle deine{" "}
            <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              perfekte Mitgliedschaft
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-primary-50 mb-10 max-w-3xl mx-auto font-body"
          >
            Flexible Pläne für jedes Fitnesslevel. Keine Vertragsbindung, monatlich kündbar.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-background -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {memberships.map((membership, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={membership.popular ? "md:-mt-8" : ""}
              >
                <Card className={`h-full relative ${membership.popular ? 'border-2 border-accent-500 shadow-xl' : ''}`}>
                  {membership.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-accent-500 text-white px-4 py-1 font-button">
                        Beliebteste Option
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-heading mb-2">{membership.name}</CardTitle>
                    <CardDescription className="font-body mb-6">{membership.description}</CardDescription>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-foreground font-heading">{membership.price}€</span>
                      <span className="text-muted-foreground font-body">/{membership.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {membership.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground font-body">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Link href="/pricing" className="w-full">
                      <Button 
                        className={`w-full h-12 font-button ${
                          membership.popular 
                            ? 'bg-accent-500 hover:bg-accent-600 text-white' 
                            : 'bg-primary-500 hover:bg-primary-600 text-white'
                        }`}
                        onClick={() => {
                          trackCTAClick(`membership_${membership.name.toLowerCase()}`, 'membership_page');
                          trackMembershipSignup(membership.name);
                        }}
                      >
                        {membership.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Warum G3 CrossFit?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Was dich bei uns erwartet
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
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

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
              Häufige Fragen
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Kann ich jederzeit kündigen?",
                answer: "Ja, alle Mitgliedschaften sind monatlich kündbar ohne Vertragsbindung. Du kannst jederzeit mit einer Frist von 30 Tagen kündigen."
              },
              {
                question: "Gibt es eine Anmeldegebühr?",
                answer: "Nein, wir erheben keine Anmeldegebühr. Du zahlst nur den monatlichen Mitgliedsbeitrag."
              },
              {
                question: "Kann ich ein Probetraining machen?",
                answer: "Ja, wir bieten kostenlose Probetrainings an. Buche einfach einen Termin über unser Kontaktformular oder ruf uns an."
              },
              {
                question: "Was ist, wenn ich Anfänger bin?",
                answer: "Perfekt! Alle unsere Kurse sind für alle Fitnesslevel skalierbar. Unsere Coaches passen jedes Workout individuell an dein Level an."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-body text-base">{faq.answer}</CardDescription>
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
              Bereit, Mitglied zu werden?
            </h2>
            <p className="text-xl text-primary-50 mb-10 font-body">
              Starte noch heute deine Fitness-Reise mit G3 CrossFit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button 
                  size="lg" 
                  className="bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-button text-base h-14 px-8 rounded-button"
                >
                  Mitgliedschaft wählen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/trial">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-button text-base h-14 px-8 rounded-button"
                >
                  Erst Probetraining
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

