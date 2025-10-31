"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { specificUnsplashPhotos } from "@/lib/unsplash";

const coaches = [
  {
    name: "Denis",
    role: "Head Coach & Owner",
    certifications: "CF-L2, Olympic Weightlifting, Mobility Coach",
    image: specificUnsplashPhotos.coachMale1,
    specialty: "Olympic Lifting & Programming",
    experience: "8 Jahre Erfahrung",
    funFact: "Kann 150kg Clean & Jerk",
  },
  {
    name: "Sarah",
    role: "Senior Coach",
    certifications: "CF-L1, Nutrition Coach, Gymnastics",
    image: specificUnsplashPhotos.coachFemale1,
    specialty: "Gymnastics & Mobility",
    experience: "5 Jahre Erfahrung",
    funFact: "15 Strict Pull-ups am Stück",
  },
  {
    name: "Michael",
    role: "Coach",
    certifications: "CF-L1, Kettlebell Instructor",
    image: specificUnsplashPhotos.coachMale2,
    specialty: "Strength & Conditioning",
    experience: "3 Jahre Erfahrung",
    funFact: "Marathon in unter 3 Stunden",
  },
];

const stats = [
  {
    icon: Award,
    value: "15+",
    label: "Zertifizierte Coaches",
  },
  {
    icon: Users,
    value: "500+",
    label: "Betreute Athleten",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Erfolgsrate",
  },
];

export default function CoachPreview() {
  return (
    <section className="py-24 bg-zinc-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            Unser Team
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Lerne von den Besten
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Unsere zertifizierten Coaches bringen jahrelange Erfahrung und Leidenschaft mit
          </p>
        </motion.div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {coaches.map((coach, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl border border-primary-200 bg-card hover:border-primary-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
                {/* Coach Image */}
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-500 group-hover:border-accent-500 transition-all duration-300">
                  <Image
                    src={coach.image}
                    alt={`${coach.name} - ${coach.role} bei G3 CrossFit`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="128px"
                  />
                </div>

                {/* Coach Info */}
                <div className="text-center space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {coach.name}
                    </h3>
                    <p className="text-primary-600 font-semibold mb-1">
                      {coach.role}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {coach.experience}
                    </p>
                  </div>

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {coach.certifications.split(', ').map((cert, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-medium">
                        {cert}
                      </span>
                    ))}
                  </div>

                  {/* Specialty Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 text-secondary-700 text-sm font-medium">
                    🎯 {coach.specialty}
                  </div>

                  {/* Fun Fact */}
                  <p className="text-sm text-accent-600 font-medium italic">
                    💪 {coach.funFact}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-zinc-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Link href="/coaches">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all duration-300 group"
            >
              Alle Coaches kennenlernen
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

