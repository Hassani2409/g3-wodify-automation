"use client";

import { motion } from "framer-motion";
import { Star, Quote, TrendingUp } from "lucide-react";
import Image from "next/image";
import { specificUnsplashPhotos } from "@/lib/unsplash";

const testimonials = [
  {
    name: "Sarah M.",
    age: 32,
    role: "Mitglied seit 2022",
    image: specificUnsplashPhotos.transformation1,
    rating: 5,
    text: "Von 0 auf 10 Pull-ups in 6 Monaten! Die Coaches bei G3 haben mir gezeigt, dass ich viel stärker bin, als ich dachte. Die Community pusht mich jeden Tag zu neuen Höchstleistungen.",
    transformation: "+150% Fitness-Level",
    result: "10 Pull-ups",
  },
  {
    name: "Michael K.",
    age: 45,
    role: "Mitglied seit 2020",
    image: specificUnsplashPhotos.transformation2,
    rating: 5,
    text: "15kg Gewichtsverlust in 8 Monaten! G3 CrossFit hat nicht nur meinen Körper, sondern auch mein Leben transformiert. Ich fühle mich mit 45 fitter als mit 30!",
    transformation: "-15kg in 8 Monaten",
    result: "Beste Form meines Lebens",
  },
  {
    name: "Lisa T.",
    age: 28,
    role: "Mitglied seit 2021",
    image: specificUnsplashPhotos.transformation3,
    rating: 5,
    text: "Erste Muscle-Up nach 1 Jahr Training! Was als Hobby begann, ist jetzt meine Leidenschaft. Die Coaches sind top und die Atmosphäre ist familiär.",
    transformation: "+200% Kraft",
    result: "Muscle-Up geschafft",
  },
  {
    name: "Tom R.",
    age: 38,
    role: "Mitglied seit 2019",
    image: specificUnsplashPhotos.transformation4,
    rating: 5,
    text: "Von Couch-Potato zum Marathon-Finisher! G3 CrossFit hat mir die Ausdauer und mentale Stärke gegeben, meinen ersten Marathon zu laufen. Unglaubliche Transformation!",
    transformation: "Marathon in 3:45h",
    result: "Vom Anfänger zum Athleten",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-zinc-800 to-zinc-900 relative overflow-hidden">
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
            Testimonials
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Was unsere Mitglieder sagen
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Echte Erfahrungen von echten Menschen
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl border border-primary-200 bg-card hover:border-primary-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl relative">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-12 h-12 text-primary-500" />
                </div>

                {/* Author with Image */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-500 shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={`${testimonial.name} - G3 CrossFit Transformation`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {testimonial.name}, {testimonial.age}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...new Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent-500 text-accent-500"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground leading-relaxed mb-6 relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Transformation Result */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50 border border-primary-200">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-semibold text-primary-700">
                      {testimonial.transformation}
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-accent-50 border border-accent-200">
                    <span className="text-sm font-medium text-accent-700">
                      🎯 {testimonial.result}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 p-8 rounded-2xl bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-1">4.9/5</div>
              <div className="text-sm text-zinc-400">Durchschnittliche Bewertung</div>
            </div>
            <div className="w-px h-12 bg-zinc-700" />
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-1">500+</div>
              <div className="text-sm text-zinc-400">Zufriedene Mitglieder</div>
            </div>
            <div className="w-px h-12 bg-zinc-700" />
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-1">98%</div>
              <div className="text-sm text-zinc-400">Weiterempfehlungsrate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

