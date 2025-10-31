"use client";

import { motion } from "framer-motion";
import { Clock, Users, Trophy, Target, ArrowRight, Dumbbell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const programs = [
  {
    id: "crossfit-beginner",
    title: "CrossFit Foundations",
    level: "Anfänger",
    duration: "60 min",
    maxParticipants: 8,
    description: "Perfekt für CrossFit-Einsteiger. Lerne die Grundbewegungen und baue deine Basis auf.",
    schedule: ["Mo 19:00", "Mi 18:00", "Fr 17:00"],
    benefits: [
      "Grundlegende CrossFit-Bewegungen",
      "Technik vor Intensität",
      "Individuelle Anpassungen",
      "Aufbau von Kraft und Ausdauer"
    ],
    image: "https://images.unsplash.com/photo-1583500178690-f7b6aee1b5c0?w=800&h=600&fit=crop&q=80"
  },
  {
    id: "crossfit-advanced",
    title: "CrossFit Classes",
    level: "Fortgeschritten",
    duration: "60 min",
    maxParticipants: 12,
    description: "Intensives CrossFit für erfahrene Athleten. Täglich wechselnde WODs für maximale Vielfalt.",
    schedule: ["Mo-Fr 6:00, 12:00, 18:00, 19:00", "Sa-So 9:00, 10:00"],
    benefits: [
      "Hochintensive Workouts",
      "Ständig variierende WODs",
      "Rx und Scaled Optionen",
      "Wettkampfvorbereitung"
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&q=80"
  },
  {
    id: "olympic-lifting",
    title: "Olympic Weightlifting",
    level: "Alle Level",
    duration: "90 min",
    maxParticipants: 6,
    description: "Technikfokussiertes Training für Reißen und Stoßen. Von Grundlagen bis Wettkampfniveau.",
    schedule: ["Di 19:00", "Do 19:00", "Sa 11:00"],
    benefits: [
      "Technik-Coaching",
      "Progressive Programmierung",
      "Video-Analyse",
      "Wettkampfvorbereitung"
    ],
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&h=600&fit=crop&q=80"
  },
  {
    id: "strength-conditioning",
    title: "Strength & Conditioning",
    level: "Mittelstufe",
    duration: "75 min",
    maxParticipants: 10,
    description: "Fokus auf Kraftaufbau und athletische Entwicklung. Periodisierte Programme für optimale Ergebnisse.",
    schedule: ["Mo 18:00", "Mi 19:00", "Fr 18:00"],
    benefits: [
      "Kraftentwicklung",
      "Periodisierte Programme",
      "Athletische Performance",
      "Injury Prevention"
    ],
    image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=800&h=600&fit=crop&q=80"
  },
  {
    id: "gymnastics",
    title: "Gymnastics & Mobility",
    level: "Alle Level",
    duration: "60 min",
    maxParticipants: 8,
    description: "Entwickle Körperbeherrschung, Beweglichkeit und gymnastics Skills für bessere Performance.",
    schedule: ["Di 18:00", "Do 18:00", "Sa 12:00"],
    benefits: [
      "Körpergewicht-Übungen",
      "Beweglichkeitstraining",
      "Skill-Entwicklung",
      "Injury Prevention"
    ],
    image: "https://images.unsplash.com/photo-1540206276207-3af25c08abc4?w=800&h=600&fit=crop&q=80"
  },
  {
    id: "personal-training",
    title: "Personal Training",
    level: "Alle Level",
    duration: "60 min",
    maxParticipants: 1,
    description: "Individuelles 1:1 Coaching für maximale Aufmerksamkeit und schnellste Fortschritte.",
    schedule: ["Nach Vereinbarung"],
    benefits: [
      "100% individuelle Betreuung",
      "Personalisierte Programme",
      "Flexible Terminplanung",
      "Schnelle Fortschritte"
    ],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80"
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Anfänger":
      return "bg-secondary-100 text-secondary-700 border-secondary-300";
    case "Mittelstufe":
      return "bg-accent-100 text-accent-700 border-accent-300";
    case "Fortgeschritten":
      return "bg-primary-100 text-primary-700 border-primary-300";
    default:
      return "bg-blue-100 text-blue-700 border-blue-300";
  }
};

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-heading">
              Unsere Trainingsprogramme
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 max-w-3xl mx-auto font-body">
              Von Anfänger bis Elite - finde das Training, das zu dir passt
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-card rounded-card border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image 
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  
                  {/* Level Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getLevelColor(program.level)} border font-semibold`}>
                      {program.level}
                    </Badge>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-heading">
                    {program.title}
                  </h3>
                  
                  {/* Meta Info */}
                  <div className="flex items-center gap-6 mb-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span className="text-sm font-medium">{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary-500" />
                      <span className="text-sm font-medium">max. {program.maxParticipants} Teilnehmer</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6 font-body">
                    {program.description}
                  </p>
                  
                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center font-heading">
                      <Trophy className="w-5 h-5 mr-2 text-accent-500" />
                      Was du lernst:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {program.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent-500 shrink-0" />
                          <span className="text-sm text-muted-foreground font-body">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Schedule */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center font-heading">
                      <Target className="w-5 h-5 mr-2 text-accent-500" />
                      Termine:
                    </h4>
                    <div className="space-y-2">
                      {program.schedule.map((time, idx) => (
                        <div 
                          key={idx} 
                          className="text-sm px-4 py-2 rounded-lg bg-muted text-foreground font-medium font-body"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary-50 to-secondary-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Dumbbell className="w-16 h-16 mx-auto mb-6 text-accent-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-heading">
              Bereit für dein erstes Training?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 font-body">
              Buche dein kostenloses Probetraining und lerne uns kennen
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold rounded-button shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Kostenloses Probetraining buchen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

