"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

const coaches = [
  {
    name: "Max Müller",
    role: "Head Coach & Gründer",
    certifications: "CF-L2, Weightlifting Coach",
    image: "👨‍🏫",
    specialty: "Olympic Lifting",
  },
  {
    name: "Sarah Schmidt",
    role: "Senior Coach",
    certifications: "CF-L2, Nutrition Coach",
    image: "👩‍🏫",
    specialty: "Gymnastics & Mobility",
  },
  {
    name: "Tom Wagner",
    role: "Performance Coach",
    certifications: "CF-L1, Sports Science",
    image: "👨‍💼",
    specialty: "Strength & Conditioning",
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
              <div className="h-full p-8 rounded-2xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105">
                {/* Coach Image Placeholder */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-2 border-zinc-700 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                  {coach.image}
                </div>

                {/* Coach Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {coach.name}
                  </h3>
                  <p className="text-emerald-400 font-medium mb-2">
                    {coach.role}
                  </p>
                  <p className="text-sm text-zinc-400 mb-3">
                    {coach.certifications}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-700/50 text-xs text-zinc-300">
                    Spezialisierung: {coach.specialty}
                  </div>
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

