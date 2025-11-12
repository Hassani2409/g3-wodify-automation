"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, Mail, Phone, Instagram, Award, Calendar, Users, Heart, Target, Star 
} from "lucide-react";

export default function Trainers() {
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);

  const trainers = [
    {
      id: 'dave',
      name: "Dave Thompson",
      role: "Head Coach & Studio-Gründer",
      image: "https://images.unsplash.com/photo-1567013127542-490d757e51cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      portraitImage: "https://images.unsplash.com/photo-1567013127542-490d757e51cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      shortBio: "Dave ist der Gründer von G3 CrossFit und bringt über 15 Jahre Coaching-Erfahrung mit.",
      longBio: "Dave gründete G3 CrossFit aus seiner Leidenschaft heraus, Menschen dabei zu helfen, ihre körperlichen und mentalen Grenzen zu überwinden. Mit über 15 Jahren Erfahrung im Fitness- und CrossFit-Bereich hat er hunderte von Athleten auf ihrem Weg zu besserer Gesundheit und Leistung begleitet. Seine Philosophie basiert auf der Überzeugung, dass jeder Mensch das Potential hat, außergewöhnliche Dinge zu erreichen - man muss nur den ersten Schritt machen.",
      specializations: ['CrossFit', 'Leadership', 'Strength Training', 'Mobility'],
      certifications: [
        'CrossFit Level 4 Trainer (CF-L4)',
        'NSCA Certified Strength & Conditioning Specialist',
        'Olympic Weightlifting Level 2',
        'CrossFit Gymnastics Certificate',
        'Precision Nutrition Level 1'
      ],
      experience: "15+ Jahre",
      languages: ["Deutsch", "Englisch"],
      achievements: [
        "Gründung von G3 CrossFit 2018",
        "Über 500 Athleten erfolgreich trainiert",
        "Mehrfache Teilnahme an CrossFit-Wettkämpfen",
        "Ausbildung von 8 Junior-Coaches"
      ],
      philosophy: "Fitness sollte für jeden zugänglich sein. Mein Ziel ist es, eine Umgebung zu schaffen, in der sich jeder willkommen fühlt und seine persönlichen Ziele erreichen kann. Es geht nicht darum, perfekt zu sein - es geht darum, besser zu werden.",
      workoutStyle: "Dave legt großen Wert auf Technik und sichere Bewegungsausführung. Seine Workouts sind herausfordernd, aber immer skalierbar für alle Fitnesslevel.",
      email: "dave@g3crossfit.de",
      phone: "+49 30 12345678",
      instagram: "@dave.g3crossfit",
      availability: ["Mo-Fr: 6:00-21:00", "Sa: 8:00-18:00", "Personal Training nach Vereinbarung"],
      funFacts: [
        "Lieblings-WOD: Fran (21-15-9 Thrusters & Pull-ups)",
        "Kann 150kg Deadliften",
        "Trinkt täglich 5 Tassen Kaffee",
        "Hat schon in 12 verschiedenen CrossFit-Gyms trainiert"
      ]
    },
    {
      id: 'flo',
      name: "Florian 'Flo' Weber",
      role: "Olympic Weightlifting Coach",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      portraitImage: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      shortBio: "Flo ist unser Spezialist für Olympic Weightlifting und bringt eine ansteckende Energie mit.",
      longBio: "Flo entdeckte seine Leidenschaft für Olympic Weightlifting während seines Sportstudiums und hat sich seitdem vollständig dieser Disziplin verschrieben. Als ehemaliger Wettkampfathlet versteht er die komplexen Bewegungsmuster des Reißens und Stoßens wie kein Zweiter. Seine enthusiastische und geduldige Art macht auch die technisch anspruchsvollsten Übungen für Anfänger zugänglich.",
      specializations: ['Olympic Weightlifting', 'Technikanalyse', 'Wettkampfvorbereitung', 'Kraftaufbau'],
      certifications: [
        'CrossFit Level 3 Trainer (CF-L3)',
        'USAW Olympic Weightlifting Coach',
        'German Weightlifting Federation Coach',
        'FMS Level 2 Certified',
        'Burgener Strength Olympic Lifting Certification'
      ],
      experience: "8 Jahre",
      languages: ["Deutsch", "Englisch", "Französisch"],
      achievements: [
        "Deutsche Meisterschaft Gewichtheben: 3. Platz (2019)",
        "Trainiert 3 aktive Wettkampfathleten",
        "Verbesserung der Gym-Rekorde um durchschnittlich 25%",
        "Entwicklung des G3 Lifting-Programms"
      ],
      philosophy: "Technik kommt vor Intensität. Ich helfe dir dabei, die komplexen olympischen Bewegungen zu meistern und dabei Spaß zu haben. Jeder kann lernen, richtig zu reißen und zu stoßen - es braucht nur Zeit und die richtige Anleitung.",
      workoutStyle: "Flo ist akribisch in der Technikschulung, aber verpackt das Training in ein motivierendes, energiegeladenes Umfeld. Seine Sessions sind progressiv aufgebaut und individuell angepasst.",
      email: "flo@g3crossfit.de",
      phone: "+49 30 12345679",
      instagram: "@flo.lifts.heavy",
      availability: ["Mo, Mi, Fr: 7:00-20:00", "Sa: 9:00-15:00", "Olympic Lifting Classes täglich"],
      funFacts: [
        "Persönlicher Rekord: 140kg Reißen, 175kg Stoßen",
        "Kann 15 verschiedene Snatch-Varianten unterrichten",
        "Sammelt Vintage-Gewichthebergürtel",
        "Hat über 2000 Stunden Videoanalyse gemacht"
      ]
    },
    {
      id: 'johannes',
      name: "Johannes Müller",
      role: "CrossFit Coach & Foundations-Spezialist",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      portraitImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      shortBio: "Johannes legt großen Wert auf Technik und hilft Anfängern, sichere Bewegungsmuster zu entwickeln.",
      longBio: "Johannes kam über Umwege zum CrossFit - nach Jahren im klassischen Fitnessstudio suchte er nach einer Herausforderung und fand seine Berufung. Als Coach legt er besonderen Wert darauf, dass jeder Athlet eine solide Basis entwickelt, bevor er zu komplexeren Bewegungen übergeht. Seine ruhige, methodische Art schafft Vertrauen und hilft auch den nervösesten Anfängern, sich wohlzufühlen.",
      specializations: ['Foundations-Training', 'Bewegungsanalyse', 'Skalierung', 'Injury Prevention'],
      certifications: [
        'CrossFit Level 2 Trainer (CF-L2)',
        'CrossFit Gymnastics Certificate',
        'FMS Certified',
        'Mobility Specialist Level 1',
        'Mental Health First Aid'
      ],
      experience: "6 Jahre",
      languages: ["Deutsch", "Englisch"],
      achievements: [
        "Ausbildung von über 200 CrossFit-Anfängern",
        "Entwicklung des G3 Foundations-Programms",
        "Null Verletzungen in seinen Foundations-Kursen",
        "Mentor für neue Coaches"
      ],
      philosophy: "Jeder kann CrossFit machen. Mein Fokus liegt darauf, sichere Bewegungsmuster zu entwickeln und Vertrauen aufzubauen. Es ist mir wichtiger, dass du dich sicher fühlst und richtig bewegst, als dass du schwer hebst.",
      workoutStyle: "Johannes' Sessions sind strukturiert und progressiv. Er nimmt sich Zeit für individuelle Korrekturen und sorgt dafür, dass niemand zurückgelassen wird.",
      email: "johannes@g3crossfit.de",
      phone: "+49 30 12345680",
      instagram: "@johannes.builds.basics",
      availability: ["Di, Do: 6:00-21:00", "Sa: 10:00-16:00", "Foundations-Kurse täglich"],
      funFacts: [
        "War früher Maschinenbauingenieur",
        "Kann jeden Air Squat in Zeitlupe analysieren",
        "Liest Anatomie-Bücher als Hobby",
        "Baut eigene Mobility-Geräte"
      ]
    },
    {
      id: 'laura',
      name: "Laura Schmidt",
      role: "Gymnastics & Mobility Coach",
      image: "https://images.unsplash.com/photo-1583500178690-f7b6aee1b5c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      portraitImage: "https://images.unsplash.com/photo-1583500178690-f7b6aee1b5c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      shortBio: "Laura ist unsere Spezialistin für Gymnastik und Beweglichkeit mit einem Hintergrund im Turnen.",
      longBio: "Laura bringt ihre 15-jährige Erfahrung als Turnerin in das CrossFit-Training ein. Nach ihrer aktiven Turnkarriere entdeckte sie CrossFit als perfekte Kombination aus Kraft, Ausdauer und Beweglichkeit. Als Coach hilft sie Athleten dabei, komplexe gymnastics Bewegungen zu meistern und dabei ihre Beweglichkeit und Körperbeherrschung zu entwickeln.",
      specializations: ['Gymnastics', 'Mobility', 'Flexibility', 'Handstand Training', 'Muscle-ups'],
      certifications: [
        'CrossFit Level 2 Trainer (CF-L2)',
        'CrossFit Gymnastics Certificate',
        'Yoga Teacher Training 200h',
        'FRC Mobility Specialist',
        'Handstand Training Certification'
      ],
      experience: "7 Jahre CrossFit, 15 Jahre Turnen",
      languages: ["Deutsch", "Englisch", "Spanisch"],
      achievements: [
        "Ehemalige Deutsche Jugendmeisterin im Turnen",
        "Erste Frau bei G3 mit einem freistehenden Handstand",
        "Entwicklung des G3 Gymnastics-Programms",
        "50+ Athleten zum ersten Muscle-up verholfen"
      ],
      philosophy: "Bewegung sollte geschmeidig und kraftvoll sein. Ich helfe dir dabei, deine Beweglichkeit und Körperbeherrschung zu entwickeln. Jeder Körper ist anders, und wir finden gemeinsam deinen Weg zu besserer Mobilität.",
      workoutStyle: "Laura kombiniert präzise Technikschulung mit spielerischen Elementen. Ihre Sessions sind herausfordernd, aber immer mit Fokus auf richtige Ausführung und Verletzungsprävention.",
      email: "laura@g3crossfit.de",
      phone: "+49 30 12345681",
      instagram: "@laura.flows.strong",
      availability: ["Mo, Mi, Fr: 16:00-21:00", "So: 10:00-14:00", "Gymnastics Classes täglich"],
      funFacts: [
        "Kann 90 Sekunden Handstand halten",
        "Hat in 8 Ländern Yoga unterrichtet",
        "Sammelt Turngeräte aus aller Welt",
        "Kann 25 verschiedene Pistol Squat-Variationen"
      ]
    },
    {
      id: 'leon',
      name: "Leon Richter",
      role: "Strength & Conditioning Coach",
      image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      portraitImage: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      shortBio: "Leon begeistert mit seiner Leidenschaft für Krafttraining und systematischen Ansatz.",
      longBio: "Leon kam vom Powerlifting zum CrossFit und bringt ein tiefes Verständnis für Kraftentwicklung mit. Seine wissenschaftlich fundierte Herangehensweise hilft Athleten dabei, systematisch stärker zu werden, während sie gleichzeitig ihre Ausdauer und Beweglichkeit verbessern. Als ehemaliger Sportwissenschaftler kann er komplexe Trainingsprinzipien verständlich erklären.",
      specializations: ['Strength Training', 'Powerlifting', 'Program Design', 'Sports Science'],
      certifications: [
        'CrossFit Level 2 Trainer (CF-L2)',
        'Starting Strength Coach',
        'NSCA Certified Personal Trainer',
        'Precision Nutrition Level 1',
        'Sports Science Master Degree'
      ],
      experience: "5 Jahre CrossFit, 10 Jahre Krafttraining",
      languages: ["Deutsch", "Englisch"],
      achievements: [
        "200kg Deadlift, 180kg Back Squat, 120kg Bench Press",
        "Entwicklung individueller Kraftprogramme für 100+ Athleten",
        "Verbesserung der Gym-Kraftwerte um durchschnittlich 35%",
        "Publikation von 5 wissenschaftlichen Artikeln zum Thema Kraft"
      ],
      philosophy: "Kraft ist die Basis für alles. Ich zeige dir, wie du systematisch stärker wirst und dabei gesund bleibst. Jeder Fortschritt, egal wie klein, ist ein Erfolg wert.",
      workoutStyle: "Leon's Training ist strukturiert und datenbasiert. Er nutzt wissenschaftliche Prinzipien, um optimale Fortschritte zu gewährleisten, ohne dabei den Spaß aus den Augen zu verlieren.",
      email: "leon@g3crossfit.de",
      phone: "+49 30 12345682",
      instagram: "@leon.lifts.science",
      availability: ["Di, Do, Sa: 7:00-20:00", "Personal Training nach Vereinbarung"],
      funFacts: [
        "Hat über 1000 Stunden Trainingspläne geschrieben",
        "Kann dein 1RM mathematisch vorhersagen",
        "Besitzt 47 verschiedene Trainingsbücher",
        "Trackt seit 8 Jahren jedes Training"
      ]
    },
    {
      id: 'sarah',
      name: "Sarah Klein",
      role: "Yoga & Recovery Coach",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      portraitImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      shortBio: "Sarah leitet unsere Yoga-Kurse und sorgt für die perfekte Balance zwischen Kraft und Entspannung.",
      longBio: "Sarah entdeckte Yoga als Ausgleich zu ihrem stressigen Job im Marketing und erkannte schnell dessen transformative Kraft. Nach ihrer 500-Stunden Yoga-Ausbildung in Indien spezialisierte sie sich darauf, Yoga mit hochintensivem Training zu kombinieren. Bei G3 hilft sie Athleten dabei, die mentale und körperliche Balance zu finden, die für nachhaltigen Erfolg im CrossFit essential ist.",
      specializations: ['Hatha Yoga', 'Yin Yoga', 'Meditation', 'Recovery', 'Mindfulness'],
      certifications: [
        'Yoga Teacher Training 500h (RYT-500)',
        'Yin Yoga Certification',
        'Meditation Teacher Certification',
        'Breathwork Facilitator',
        'Mindfulness-Based Stress Reduction'
      ],
      experience: "10 Jahre Yoga, 3 Jahre CrossFit",
      languages: ["Deutsch", "Englisch", "Hindi (Grundkenntnisse)"],
      achievements: [
        "6 Monate Yoga-Studium in Rishikesh, Indien",
        "Entwicklung des G3 Recovery-Programms",
        "200+ Stunden Meditation unterrichtet",
        "Integration von Mindfulness in CrossFit-Training"
      ],
      philosophy: "Balance ist alles. Ich helfe dir dabei, Körper und Geist in Einklang zu bringen und nachhaltig gesund zu bleiben. Wahre Stärke kommt von innen.",
      workoutStyle: "Sarah's Sessions sind fließend und meditativ, aber trotzdem herausfordernd. Sie kombiniert traditionelle Yoga-Prinzipien mit modernen Recovery-Methoden.",
      email: "sarah@g3crossfit.de",
      phone: "+49 30 12345683",
      instagram: "@sarah.finds.balance",
      availability: ["Mo, Mi, Fr: 19:00-21:00", "So: 9:00-12:00", "Recovery Sessions täglich"],
      funFacts: [
        "Meditiert täglich seit 8 Jahren",
        "Kann 108 Sonnengrüße am Stück",
        "Spricht fließend Sanskrit",
        "Hat in 15 Ländern Yoga praktiziert"
      ]
    }
  ];

  const TrainerCard = ({ trainer }: { trainer: any }) => (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      onClick={() => setSelectedTrainer(trainer)}
    >
      <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
        <img 
          src={trainer.image} 
          alt={`${trainer.name} - ${trainer.role} bei G3 CrossFit Berlin`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 text-primary-600">{trainer.name}</h3>
        <p className="text-sm font-medium mb-3 text-accent-500">{trainer.role}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{trainer.shortBio}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {trainer.specializations.slice(0, 2).map((spec: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">{spec}</Badge>
          ))}
          {trainer.specializations.length > 2 && (
            <Badge variant="outline" className="text-xs">+{trainer.specializations.length - 2}</Badge>
          )}
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{trainer.experience} Erfahrung</span>
          <Button variant="ghost" size="sm" className="text-xs">Profil ansehen →</Button>
        </div>
      </CardContent>
    </Card>
  );

  const TrainerDetailModal = ({ trainer, onClose }: { trainer: any; onClose: () => void }) => {
    if (!trainer) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
            <Button variant="ghost" onClick={onClose} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Zurück zu allen Trainern
            </Button>
          </div>

          <div className="p-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              <div className="lg:w-1/3">
                <img 
                  src={trainer.portraitImage} 
                  alt={`Detailportrait von ${trainer.name}`}
                  className="w-full aspect-[3/4] object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="lg:w-2/3">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold mb-2 text-primary-600">{trainer.name}</h1>
                  <p className="text-xl font-medium mb-4 text-accent-500">{trainer.role}</p>
                  <p className="text-lg text-gray-700 leading-relaxed">{trainer.longBio}</p>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent-500" />
                    <a href={`mailto:${trainer.email}`} className="hover:underline">{trainer.email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent-500" />
                    <a href={`tel:${trainer.phone}`} className="hover:underline">{trainer.phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-accent-500" />
                    <a 
                      href={`https://instagram.com/${trainer.instagram.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline"
                    >
                      {trainer.instagram}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-accent-500" />
                    <span>{trainer.experience}</span>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Spezialisierungen</h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.specializations.map((spec: string, index: number) => (
                      <Badge key={index} className="bg-green-100 text-green-800">{spec}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent-500" />
                    Zertifizierungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {trainer.certifications.map((cert: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent-500" />
                        <span className="text-sm">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent-500" />
                    Erfolge & Meilensteine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {trainer.achievements.map((achievement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent-500" />
                        <span className="text-sm">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Philosophy Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent-500" />
                  Trainingsphilosophie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-lg italic text-gray-700 leading-relaxed border-l-4 border-accent-500 pl-4">
                  "{trainer.philosophy}"
                </blockquote>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Trainingsstil:</h4>
                  <p className="text-gray-600">{trainer.workoutStyle}</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent-500" />
                    Verfügbarkeit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {trainer.availability.map((time: string, index: number) => (
                      <li key={index} className="text-sm">{time}</li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Sprachen: {trainer.languages.join(', ')}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fun Facts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent-500" />
                    Fun Facts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {trainer.funFacts.map((fact: string, index: number) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-accent-500">•</span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">Trainiere mit {trainer.name.split(' ')[0]}!</h3>
                <p className="text-gray-600 mb-6">
                  Interessiert an Personal Training oder möchtest du mehr über {trainer.name.split(' ')[0]}s Classes erfahren?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-accent-500 hover:bg-accent-600 text-white">
                    <Link href="/contact">Personal Training anfragen</Link>
                  </Button>
                  <Button variant="outline">
                    <Link href="/schedule">Kursplan ansehen</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 text-white bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")' 
          }} 
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Unser Expertenteam</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
            Lerne unsere zertifizierten Trainer kennen, die dich mit Leidenschaft und Expertise auf deinem Fitness-Weg begleiten.
          </p>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-sm text-gray-300">Jahre kombinierte Erfahrung</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">25+</div>
              <div className="text-sm text-gray-300">Zertifizierungen</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-sm text-gray-300">Zufriedene Athleten</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Bereit, mit unseren Experten zu trainieren?</h2>
          <p className="text-xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Buche dein kostenloses Probetraining und lerne unsere Trainer persönlich kennen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-4">
              <Link href="/contact">Kostenloses Probetraining</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-800 text-lg px-8 py-4">
              <Link href="/schedule">Kursplan ansehen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trainer Detail Modal */}
      {selectedTrainer && (
        <TrainerDetailModal 
          trainer={selectedTrainer} 
          onClose={() => setSelectedTrainer(null)} 
        />
      )}
    </div>
  );
}
