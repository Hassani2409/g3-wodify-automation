"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Heart, Zap } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Target,
    title: "Zielorientiert",
    description: "Wir helfen dir, deine persönlichen Fitnessziele zu erreichen",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "Gemeinsam sind wir stärker – unsere Community ist unser Herz",
  },
  {
    icon: Zap,
    title: "Maximale Intensität",
    description: "Hochintensives Training für maximale Ergebnisse",
  },
];

export default function AboutPreview() {
  return (
    <section className="py-24 bg-zinc-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Placeholder for Image - Replace with actual image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-zinc-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏋️</div>
                  <p className="text-zinc-400">G3 CrossFit Gym</p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
            </div>

            {/* Stats Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">500+</div>
                  <div className="text-sm text-zinc-400">Mitglieder</div>
                </div>
                <div className="w-px h-12 bg-zinc-700" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">8+</div>
                  <div className="text-sm text-zinc-400">Jahre</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              Über uns
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Mehr als nur ein Gym
            </h2>

            <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
              G3 CrossFit ist Berlins führendes CrossFit-Gym. Seit 2016 helfen wir 
              Menschen dabei, ihre Fitnessziele zu erreichen und Teil einer starken 
              Community zu werden.
            </p>

            <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
              Unser Team aus zertifizierten Coaches bietet dir professionelles Training 
              in einer motivierenden Atmosphäre. Egal ob Anfänger oder Profi – bei uns 
              bist du richtig.
            </p>

            {/* Values */}
            <div className="space-y-6 mb-10">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {value.title}
                      </h3>
                      <p className="text-zinc-400">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <Link href="/about">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all duration-300 group"
              >
                Mehr über uns erfahren
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

