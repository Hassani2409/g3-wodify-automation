"use client";

import { motion } from "framer-motion";
import { Users, Award, Clock, Heart, TrendingUp, Dumbbell } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Kleine Gruppen",
    description: "Maximal 12 Personen pro Kurs für persönliche Betreuung und individuelle Anpassungen",
    benefit: "Persönliche Betreuung",
    color: "primary",
  },
  {
    icon: Award,
    title: "Zertifizierte Coaches",
    description: "Alle Trainer sind CrossFit Level 1 & 2 zertifiziert mit jahrelanger Erfahrung",
    benefit: "Professionelles Coaching",
    color: "secondary",
  },
  {
    icon: Clock,
    title: "Flexible Kurszeiten",
    description: "30+ Kurse pro Woche von 6:00 bis 20:00 Uhr - finde die perfekte Zeit für dich",
    benefit: "Maximale Flexibilität",
    color: "accent",
  },
  {
    icon: Heart,
    title: "Starke Community",
    description: "Werde Teil einer motivierenden Familie statt nur einem Fitnessstudio",
    benefit: "Familiäre Atmosphäre",
    color: "primary",
  },
  {
    icon: TrendingUp,
    title: "Alle Fitnesslevel",
    description: "Individuell skalierte Workouts - vom Anfänger bis zum Athleten",
    benefit: "Für jeden geeignet",
    color: "secondary",
  },
  {
    icon: Dumbbell,
    title: "Modernste Ausstattung",
    description: "Rogue Fitness Equipment, Concept2 Rudergeräte und professionelle Gewichte",
    benefit: "Premium Equipment",
    color: "accent",
  },
];

const colorClasses = {
  primary: {
    icon: "text-primary-500",
    border: "border-primary-500/20 hover:border-primary-500",
    bg: "bg-primary-50",
    badge: "bg-primary-100 text-primary-700",
  },
  secondary: {
    icon: "text-secondary-500",
    border: "border-secondary-500/20 hover:border-secondary-500",
    bg: "bg-secondary-50",
    badge: "bg-secondary-100 text-secondary-700",
  },
  accent: {
    icon: "text-accent-500",
    border: "border-accent-500/20 hover:border-accent-500",
    bg: "bg-accent-50",
    badge: "bg-accent-100 text-accent-700",
  },
};

export default function FeatureCards() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading"
          >
            Warum G3 CrossFit?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-body"
          >
            Entdecke, was uns zur besten CrossFit Box in Berlin macht
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative p-8 bg-card rounded-card border-2 ${colors.border} transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-card ${colors.bg} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-8 w-8 ${colors.icon}`} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-3 font-heading">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-4 font-body leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefit Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                  ✓ {feature.benefit}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6 font-body">
            Überzeuge dich selbst von unserer Community
          </p>
          <button className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold rounded-button shadow-lg hover:shadow-xl transition-all duration-300">
            Jetzt kostenloses Probetraining buchen
          </button>
        </motion.div>
      </div>
    </section>
  );
}

