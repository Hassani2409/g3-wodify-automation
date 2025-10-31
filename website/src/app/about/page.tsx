"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, Users, Award, Target, Shield, Zap, Play, Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const coaches = [
  {
    id: 'dave',
    name: "Dave",
    role: "Head Coach & Gründer",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=800&h=800&fit=crop&q=80",
    description: "Dave ist der Gründer von G3 CrossFit. Mit über 15 Jahren Erfahrung hilft er Menschen, ihre Fitnessziele zu erreichen.",
    specializations: ['CrossFit', 'Leadership', 'Strength'],
    experience: "15+ Jahre"
  },
  {
    id: 'flo',
    name: "Flo",
    role: "Olympic Weightlifting Coach",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&h=800&fit=crop&q=80",
    description: "Flo bringt eine unglaubliche Energie in jede Klasse und motiviert dich, deine Grenzen zu überschreiten.",
    specializations: ['Olympic Weightlifting', 'CrossFit', 'Strength'],
    experience: "8 Jahre"
  },
  {
    id: 'johannes',
    name: "Johannes",
    role: "CrossFit Coach",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&q=80",
    description: "Johannes legt großen Wert auf Technik und hilft dir, die Grundlagen für langfristigen Erfolg zu schaffen.",
    specializations: ['CrossFit', 'Foundations', 'Mobility'],
    experience: "6 Jahre"
  },
  {
    id: 'laura',
    name: "Laura",
    role: "Gymnastics & Mobility Coach",
    image: "https://images.unsplash.com/photo-1583500178690-f7b6aee1b5c0?w=800&h=800&fit=crop&q=80",
    description: "Laura ist unsere Spezialistin für Gymnastik und Beweglichkeit und bringt dich auf das nächste Level.",
    specializations: ['Gymnastics', 'Mobility', 'CrossFit'],
    experience: "7 Jahre"
  },
  {
    id: 'leon',
    name: "Leon",
    role: "Strength & Conditioning Coach",
    image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=800&h=800&fit=crop&q=80",
    description: "Leon begeistert mit seiner Leidenschaft für Krafttraining und hilft dir, stärker als je zuvor zu werden.",
    specializations: ['Strength', 'PowerLifting', 'CrossFit'],
    experience: "5 Jahre"
  },
  {
    id: 'sarah',
    name: "Sarah",
    role: "Yoga & Recovery Coach",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop&q=80",
    description: "Sarah leitet unsere Yoga-Kurse und sorgt für die perfekte Balance zwischen Kraft und Entspannung.",
    specializations: ['Yoga', 'Recovery', 'Mindfulness'],
    experience: "10 Jahre"
  }
];

const filterOptions = [
  { value: 'all', label: 'Alle Trainer' },
  { value: 'CrossFit', label: 'CrossFit' },
  { value: 'Olympic Weightlifting', label: 'Olympic Weightlifting' },
  { value: 'Gymnastics', label: 'Gymnastics' },
  { value: 'Strength', label: 'Strength' },
  { value: 'Yoga', label: 'Yoga' }
];

const teamValues = [
  {
    icon: Heart,
    title: "Gemeinschaft",
    description: "Wir schaffen eine Umgebung, in der sich jeder willkommen und unterstützt fühlt."
  },
  {
    icon: Target,
    title: "Individuelle Betreuung",
    description: "Jeder Athlet bekommt die Aufmerksamkeit und Unterstützung, die er verdient."
  },
  {
    icon: Shield,
    title: "Sicherheit zuerst",
    description: "Korrekte Technik und sichere Bewegungsmuster stehen immer an erster Stelle."
  },
  {
    icon: Zap,
    title: "Kontinuierliche Verbesserung",
    description: "Wir entwickeln uns ständig weiter und lernen dazu, um besser zu werden."
  }
];

const behindScenes = [
  {
    icon: Users,
    title: "Wöchentliche Team-Meetings",
    description: "Jeden Montag treffen wir uns, um die Woche zu planen und uns über neue Entwicklungen auszutauschen."
  },
  {
    icon: Calendar,
    title: "Regelmäßige Weiterbildungen",
    description: "Unser Team nimmt regelmäßig an Seminaren und Zertifizierungen teil, um auf dem neuesten Stand zu bleiben."
  },
  {
    icon: Award,
    title: "Community Events",
    description: "Von BBQs bis zu Wettkämpfen - wir organisieren regelmäßig Events für unsere G3 Familie."
  }
];

export default function AboutPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredCoaches = selectedFilter === 'all' 
    ? coaches 
    : coaches.filter(coach => coach.specializations.includes(selectedFilter));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=2069&h=1200&fit=crop&q=80")'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white font-heading">
                Dein Expertenteam für CrossFit
              </h1>
              <p className="text-xl md:text-2xl text-primary-50 leading-relaxed mb-8 font-body">
                Lerne unser erfahrenes und leidenschaftliches Trainerteam kennen, 
                das dich auf deinem Fitness-Weg begleitet und unterstützt.
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2 font-heading">50+</div>
                  <div className="text-sm text-primary-100 font-body">Jahre kombinierte Erfahrung</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2 font-heading">15+</div>
                  <div className="text-sm text-primary-100 font-body">Zertifizierungen</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2 font-heading">200+</div>
                  <div className="text-sm text-primary-100 font-body">Zufriedene Athleten</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&q=80"
                alt="G3 CrossFit Team in Aktion"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Filter & Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading">
              Unser Trainerteam
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8 text-muted-foreground font-body">
              Jeder unserer Trainer bringt einzigartige Expertise und Leidenschaft mit. 
              Finde den Coach, der am besten zu deinen Zielen passt.
            </p>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-4 py-2 text-sm font-medium transition-all font-button ${
                    selectedFilter === option.value
                      ? 'bg-accent-500 text-white hover:bg-accent-600'
                      : 'bg-transparent border-2 border-muted text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCoaches.map((coach, index) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-primary-500/20 hover:border-primary-500">
                  <div className="relative h-80">
                    <Image 
                      src={coach.image}
                      alt={coach.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold font-heading">{coach.name}</h3>
                      <p className="font-heading font-medium text-accent-500">{coach.role}</p>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {coach.specializations.map((spec, specIndex) => (
                          <Badge key={specIndex} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground font-body">
                        {coach.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground font-body">
                        <span className="font-semibold text-foreground">Erfahrung:</span> {coach.experience}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values & Philosophy */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading">
              Unsere Werte & Philosophie
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed text-muted-foreground font-body">
              Diese Prinzipien leiten uns täglich und prägen die Art, wie wir mit unseren Athleten arbeiten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center p-8 border-2 border-primary-500/20 hover:border-primary-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-accent-50">
                      <IconComponent className="w-8 h-8 text-accent-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-primary-700 font-heading">
                      {value.title}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground font-body">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading">
                Hinter den Kulissen
              </h2>
              <p className="text-xl leading-relaxed mb-8 text-muted-foreground font-body">
                Erfahre mehr über das Leben bei G3 CrossFit - von unseren wöchentlichen Team-Meetings
                bis hin zu den gemeinsamen Trainingseinheiten und Events.
              </p>

              <div className="space-y-6 mb-8">
                {behindScenes.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-accent-50">
                        <IconComponent className="w-4 h-4 text-accent-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-foreground font-heading">{item.title}</h4>
                        <p className="text-sm text-muted-foreground font-body">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button className="bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold px-6 py-3 rounded-button">
                <Play className="w-4 h-4 mr-2" />
                Team-Video ansehen
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="space-y-6">
                <div className="relative h-48 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80"
                    alt="Team Meeting bei G3"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=600&h=500&fit=crop&q=80"
                    alt="Trainer beim gemeinsamen Training"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-6 pt-8">
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1540206276207-3af25c08abc4?w=600&h=500&fit=crop&q=80"
                    alt="Community Event"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&q=80"
                    alt="G3 Team in Aktion"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Team Section */}
      <section className="py-20 bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-heading">
              Lerne unser Team persönlich kennen
            </h2>
            <p className="text-xl mb-8 text-primary-50 max-w-3xl mx-auto font-body">
              Buche dein kostenloses Probetraining und treffe die Trainer,
              die dich auf deinem Weg zu deinen Fitnesszielen begleiten werden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold text-lg px-8 py-4 rounded-button shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/contact">
                  Kostenloses Probetraining buchen
                </Link>
              </Button>
              <Button
                asChild
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-800 font-button font-semibold text-lg px-8 py-4 rounded-button transition-all duration-300"
              >
                <Link href="/contact">
                  Team kontaktieren
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

