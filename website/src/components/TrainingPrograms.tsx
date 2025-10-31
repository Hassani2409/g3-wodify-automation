"use client";

import { motion } from "framer-motion";
import { Dumbbell, Trophy, TrendingUp, Clock, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const programs = [
  {
    icon: Dumbbell,
    title: "CrossFit",
    tagline: "Constantly varied, high-intensity, functional movement",
    description: "Kombination aus Gewichtheben, Gymnastik und Cardio für maximale Fitness",
    suitableFor: ["Anfänger", "Fortgeschrittene", "Athleten"],
    schedule: "Täglich 6:00-20:00 Uhr",
    duration: "60 Minuten",
    intensity: "Hoch",
    maxParticipants: 12,
    exampleWorkout: '"Fran" - 21-15-9 Thrusters (43kg) & Pull-ups',
    benefits: [
      "Ganzkörper-Fitness",
      "Verbesserte Ausdauer",
      "Kraftaufbau",
      "Fettverbrennung",
      "Funktionelle Bewegungen",
    ],
    gradient: "from-primary-600 to-primary-800",
    iconBg: "bg-primary-500",
  },
  {
    icon: Trophy,
    title: "Olympic Weightlifting",
    tagline: "Snatch & Clean & Jerk Technik",
    description: "Spezialisiertes Training für olympisches Gewichtheben mit Fokus auf Technik",
    suitableFor: ["Fortgeschrittene", "Athleten"],
    schedule: "Dienstag & Donnerstag 18:00-19:30 Uhr",
    duration: "90 Minuten",
    intensity: "Mittel-Hoch",
    maxParticipants: 8,
    exampleWorkout: '"Snatch Complex" - 5x3 @ 70-80% 1RM',
    benefits: [
      "Explosive Kraft",
      "Technik-Verbesserung",
      "Koordination",
      "Performance-Steigerung",
      "Wettkampf-Vorbereitung",
    ],
    gradient: "from-secondary-600 to-secondary-800",
    iconBg: "bg-secondary-500",
  },
  {
    icon: TrendingUp,
    title: "Strength & Conditioning",
    tagline: "Maximalkraft und Muskelaufbau",
    description: "Fokussiertes Krafttraining mit Squats, Deadlifts und Bench Press",
    suitableFor: ["Alle Level"],
    schedule: "Montag, Mittwoch, Freitag 17:00-18:00 Uhr",
    duration: "60 Minuten",
    intensity: "Mittel-Hoch",
    maxParticipants: 10,
    exampleWorkout: '"5x5 Strength" - Progressive Overload',
    benefits: [
      "Maximalkraft",
      "Muskelaufbau",
      "Bessere Körperhaltung",
      "Injury Prevention",
      "Athletische Performance",
    ],
    gradient: "from-accent-600 to-accent-800",
    iconBg: "bg-accent-500",
  },
];

export default function TrainingPrograms() {
  return (
    <section className="py-24 bg-card">
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
            Unsere Trainingsprogramme
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-body"
          >
            Finde das perfekte Programm für deine Fitnessziele
          </motion.p>
        </div>

        {/* Programs */}
        <div className="space-y-12">
          {programs.map((program, index) => {
            const Icon = program.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
              >
                {/* Image/Icon Section */}
                <div className={`flex-1 relative h-96 rounded-card overflow-hidden bg-gradient-to-br ${program.gradient} p-8 flex items-center justify-center`}>
                  <div className="absolute inset-0 opacity-20">
                    <div 
                      className="absolute inset-0" 
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />
                  </div>
                  <Icon className="h-48 w-48 text-white opacity-80" />
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-6">
                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-heading">
                      {program.title}
                    </h3>
                    <p className="text-lg text-muted-foreground italic font-body">
                      {program.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-foreground font-body">
                    {program.description}
                  </p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Dauer</p>
                        <p className="font-semibold text-foreground">{program.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Max. Teilnehmer</p>
                        <p className="font-semibold text-foreground">{program.maxParticipants}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Intensität</p>
                        <p className="font-semibold text-foreground">{program.intensity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Kurszeiten</p>
                        <p className="font-semibold text-foreground text-sm">{program.schedule}</p>
                      </div>
                    </div>
                  </div>

                  {/* Suitable For Tags */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Geeignet für:</p>
                    <div className="flex flex-wrap gap-2">
                      {program.suitableFor.map((level, i) => (
                        <span key={i} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Benefits:</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {program.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-foreground">
                          <span className="text-accent-500">✓</span>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Example Workout */}
                  <div className="p-4 bg-muted rounded-card border-l-4 border-primary-500">
                    <p className="text-sm text-muted-foreground mb-1">Beispiel-Workout:</p>
                    <p className="font-mono text-foreground">{program.exampleWorkout}</p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className={`${program.iconBg} hover:opacity-90 text-white font-button`}>
                      Probetraining buchen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="border-2 font-button">
                      Mehr erfahren
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

