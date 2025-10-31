"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Anna Becker",
    role: "Mitglied seit 2022",
    image: "👩",
    rating: 5,
    text: "G3 CrossFit hat mein Leben verändert! Die Coaches sind unglaublich motivierend und die Community ist wie eine zweite Familie. Ich habe nicht nur 15kg abgenommen, sondern auch so viel Selbstvertrauen gewonnen.",
  },
  {
    name: "Michael Schneider",
    role: "Mitglied seit 2021",
    image: "👨",
    rating: 5,
    text: "Als ehemaliger Sportmuffel hätte ich nie gedacht, dass ich CrossFit lieben würde. Das Team bei G3 macht jeden WOD zu einem Erlebnis. Beste Entscheidung meines Lebens!",
  },
  {
    name: "Lisa Weber",
    role: "Mitglied seit 2023",
    image: "👩‍🦰",
    rating: 5,
    text: "Die Atmosphäre ist einzigartig! Jeder wird auf seinem Level abgeholt und gefördert. Die Fortschritte, die ich in nur 6 Monaten gemacht habe, sind unglaublich. Absolute Empfehlung!",
  },
  {
    name: "David Klein",
    role: "Mitglied seit 2020",
    image: "👨‍🦱",
    rating: 5,
    text: "Professionelles Coaching, top Equipment und eine motivierende Community – was will man mehr? G3 CrossFit ist das beste Gym in Berlin, hands down!",
  },
  {
    name: "Julia Hoffmann",
    role: "Mitglied seit 2022",
    image: "👩‍🦱",
    rating: 5,
    text: "Ich war anfangs skeptisch, aber die Coaches haben mich sofort überzeugt. Individuelles Training trotz Gruppenkursen. Hier fühlt man sich wirklich wohl!",
  },
  {
    name: "Thomas Meyer",
    role: "Mitglied seit 2021",
    image: "👨‍🦲",
    rating: 5,
    text: "Nach mehreren Gyms habe ich endlich mein Zuhause gefunden. Die Kombination aus hartem Training und Spaß ist perfekt. Danke G3 Team!",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105 relative">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-12 h-12 text-emerald-400" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-emerald-400 text-emerald-400"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-zinc-300 leading-relaxed mb-6 relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-zinc-700">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-zinc-700 flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {testimonial.role}
                    </div>
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

