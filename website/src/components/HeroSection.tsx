"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Award, Users, Calendar, Dumbbell, ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-secondary-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Urgency Badge */}
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
          <span className="text-accent-100 text-sm font-medium font-button">🔥 Nur noch 3 Plätze diese Woche verfügbar</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading"
        >
          Dein CrossFit Gym im{" "}
          <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
            Herzen Berlins
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-primary-50 mb-8 max-w-3xl mx-auto font-body"
        >
          Familiäre Atmosphäre • Zertifizierte Coaches • Alle Fitnesslevel
        </motion.p>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Award className="h-4 w-4 text-accent-400" />
            <span className="text-sm text-white font-medium">CrossFit Level 2 Coaches</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Users className="h-4 w-4 text-accent-400" />
            <span className="text-sm text-white font-medium">500+ Mitglieder</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Calendar className="h-4 w-4 text-accent-400" />
            <span className="text-sm text-white font-medium">Seit 2015</span>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Button 
            size="lg" 
            className="bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-button text-base h-14 px-8 rounded-button"
          >
            <Dumbbell className="mr-2 h-5 w-5" />
            Kostenloses Probetraining
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-button text-base h-14 px-8 rounded-button"
          >
            Zum Kursplan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center justify-center gap-2 mb-16"
        >
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-accent-400 fill-accent-400" />
            ))}
          </div>
          <span className="text-white font-medium">4.9/5</span>
          <span className="text-primary-100">•</span>
          <span className="text-primary-100">200+ Google Reviews</span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: "500+", label: "Zufriedene Mitglieder" },
            { value: "10+", label: "Zertifizierte Coaches" },
            { value: "1000m²", label: "Trainingsfläche" },
            { value: "30+", label: "Kurse pro Woche" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-card border border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-heading">{stat.value}</div>
              <div className="text-sm text-primary-100 font-body">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-8 w-8 text-primary-100" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

