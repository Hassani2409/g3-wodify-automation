"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  MapPin, Phone, Mail, Clock, CheckCircle, 
  Car, Train, Bus, Dumbbell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const contactPeople = [
  {
    name: "Denis",
    role: "Studio-Leitung & Head Coach",
    email: "denis@g3crossfit.de",
    phone: "+49 30 1234 5678",
    specialties: ["Mitgliedschaften", "Personal Training", "Allgemeine Fragen"]
  },
  {
    name: "Sarah",
    role: "Community Management",
    email: "sarah@g3crossfit.de", 
    phone: "+49 30 1234 5679",
    specialties: ["Events", "Community", "Social Media"]
  },
  {
    name: "Michael",
    role: "Senior Coach",
    email: "michael@g3crossfit.de",
    phone: "+49 30 1234 5680", 
    specialties: ["CrossFit Classes", "Wettkampfvorbereitung", "Techniktraining"]
  }
];

const openingHours = [
  { day: "Montag", hours: "6:00 - 21:00", highlight: false },
  { day: "Dienstag", hours: "6:00 - 21:00", highlight: false },
  { day: "Mittwoch", hours: "6:00 - 21:00", highlight: false },
  { day: "Donnerstag", hours: "6:00 - 21:00", highlight: false },
  { day: "Freitag", hours: "6:00 - 21:00", highlight: false },
  { day: "Samstag", hours: "8:00 - 18:00", highlight: true },
  { day: "Sonntag", hours: "9:00 - 16:00", highlight: true }
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingType, setBookingType] = useState<'trial' | 'drop-in'>('trial');
  
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    experience: '',
    message: ''
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-heading">
              Kontakt & Standort
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 max-w-3xl mx-auto mb-8 font-body">
              Wir sind für dich da. Kontaktiere uns für Fragen, Beratung oder dein kostenloses Probetraining.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <CheckCircle className="w-5 h-5 text-accent-500" />
              <span className="font-medium font-body">Antwort innerhalb von 24 Stunden garantiert</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Online Booking Section */}
      <section id="booking" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground font-heading">Direkt buchen</h2>
            <p className="text-xl text-muted-foreground font-body">
              Sichere dir deinen Platz für ein kostenloses Probetraining oder einen Drop-In.
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-primary-500/20">
            <CardContent className="p-8 md:p-12">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 mx-auto mb-6 text-secondary-500" />
                  <h3 className="text-3xl font-bold mb-4 text-secondary-700 font-heading">Anfrage gesendet!</h3>
                  <p className="text-lg mb-8 max-w-lg mx-auto text-muted-foreground font-body">
                    Vielen Dank, {bookingFormData.name}! Wir haben deine Anfrage für den <strong>{bookingFormData.date}</strong> erhalten und werden uns in Kürze bei dir melden.
                    {bookingType === 'drop-in' && (
                      <>
                        <br/><br/>
                        <strong>Bitte beachte: Die Zahlung von 25€ erfolgt vor Ort im Studio.</strong>
                      </>
                    )}
                  </p>
                  <Button 
                    onClick={() => setIsSubmitted(false)} 
                    className="bg-secondary-500 hover:bg-secondary-600 text-white font-button font-semibold px-6 py-3 rounded-button"
                  >
                    Neue Anfrage stellen
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center border-2 border-muted rounded-lg p-1 mb-8 max-w-sm mx-auto">
                    <Button 
                      type="button"
                      onClick={() => setBookingType('trial')}
                      className={`flex-1 transition-all font-button ${
                        bookingType === 'trial' 
                          ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                          : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      Kostenloses Probetraining
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setBookingType('drop-in')}
                      className={`flex-1 transition-all font-button ${
                        bookingType === 'drop-in' 
                          ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                          : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      Drop-In (25€)
                    </Button>
                  </div>
                  
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-primary-700 font-heading">
                        {bookingType === 'trial' ? 'Dein Probetraining' : 'Dein Drop-In'}
                      </h3>
                      <p className="text-muted-foreground mt-2 font-body">
                        {bookingType === 'trial' 
                          ? 'Lerne uns unverbindlich kennen. Wir freuen uns auf dich!'
                          : 'Trainiere mit uns für einen Tag. Zahlung erfolgt vor Ort.'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2 font-body">
                          Vollständiger Name *
                        </label>
                        <input 
                          id="name"
                          className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body"
                          required 
                          value={bookingFormData.name} 
                          onChange={(e) => handleInputChange('name', e.target.value)} 
                          placeholder="Max Mustermann"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2 font-body">
                          E-Mail Adresse *
                        </label>
                        <input 
                          id="email"
                          className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body"
                          type="email" 
                          required 
                          value={bookingFormData.email} 
                          onChange={(e) => handleInputChange('email', e.target.value)} 
                          placeholder="max@beispiel.de"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2 font-body">
                          Telefonnummer
                        </label>
                        <input 
                          id="phone"
                          className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body"
                          type="tel" 
                          value={bookingFormData.phone} 
                          onChange={(e) => handleInputChange('phone', e.target.value)} 
                          placeholder="+49 123 456789"
                        />
                      </div>
                      <div>
                        <label htmlFor="date" className="block text-sm font-semibold text-foreground mb-2 font-body">
                          Wunschtermin *
                        </label>
                        <input 
                          id="date"
                          className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body"
                          type="date" 
                          required 
                          value={bookingFormData.date} 
                          onChange={(e) => handleInputChange('date', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {bookingType === 'trial' && (
                      <div>
                        <label htmlFor="experience" className="block text-sm font-semibold text-foreground mb-2 font-body">
                          Deine CrossFit Erfahrung
                        </label>
                        <select 
                          id="experience"
                          className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body"
                          value={bookingFormData.experience} 
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                        >
                          <option value="">Bitte wähle dein Level</option>
                          <option value="beginner">Anfänger (keine Erfahrung)</option>
                          <option value="intermediate">Etwas Erfahrung (weniger als 1 Jahr)</option>
                          <option value="advanced">Erfahren (1+ Jahre)</option>
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2 font-body">
                        Nachricht (optional)
                      </label>
                      <textarea 
                        id="message"
                        className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body h-32"
                        value={bookingFormData.message} 
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Hast du noch Fragen oder besondere Wünsche?"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold text-lg py-4 rounded-button shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Wird gesendet...' : 'Buchungsanfrage senden'}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact People Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground font-heading">Deine Ansprechpartner</h2>
            <p className="text-xl text-muted-foreground font-body">
              Unser Team steht dir für alle Fragen zur Verfügung
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactPeople.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300 hover:shadow-xl h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-primary-700 font-heading">
                      {person.name}
                    </h3>
                    <p className="text-sm mb-4 text-muted-foreground font-body">{person.role}</p>

                    <div className="space-y-2 mb-4">
                      <a
                        href={`mailto:${person.email}`}
                        className="flex items-center justify-center gap-2 text-foreground hover:text-primary-700 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-accent-500" />
                        <span className="text-sm font-body">{person.email}</span>
                      </a>
                      <a
                        href={`tel:${person.phone}`}
                        className="flex items-center justify-center gap-2 text-foreground hover:text-primary-700 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-accent-500" />
                        <span className="text-sm font-body">{person.phone}</span>
                      </a>
                    </div>

                    <div className="text-xs text-muted-foreground font-body">
                      <strong className="text-foreground">Spezialisiert auf:</strong>
                      <div className="mt-1">
                        {person.specialties.join(', ')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Info & Opening Hours */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Studio Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-primary-500/20 shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-accent-500" />
                    <CardTitle className="text-2xl font-heading">G3 CrossFit Berlin</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="font-semibold mb-1 font-heading">Adresse</p>
                    <p className="text-muted-foreground font-body">
                      Musterstraße 123<br />
                      10115 Berlin-Mitte
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold mb-3 font-heading">Kontakt</p>
                    <div className="space-y-2">
                      <a
                        href="tel:+493012345678"
                        className="flex items-center gap-2 text-foreground hover:text-primary-700 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-accent-500" />
                        <span className="font-body">+49 30 1234 5678</span>
                      </a>
                      <a
                        href="mailto:info@g3crossfit.de"
                        className="flex items-center gap-2 text-foreground hover:text-primary-700 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-accent-500" />
                        <span className="font-body">info@g3crossfit.de</span>
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold mb-3 font-heading">Anfahrt</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Car className="w-5 h-5 mt-1 text-accent-500" />
                        <div>
                          <p className="font-semibold font-body">Mit dem Auto</p>
                          <p className="text-sm text-muted-foreground font-body">
                            Kostenlose Parkplätze direkt vor dem Studio
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Train className="w-5 h-5 mt-1 text-accent-500" />
                        <div>
                          <p className="font-semibold font-body">S-Bahn</p>
                          <p className="text-sm text-muted-foreground font-body">
                            S1, S2, S25 - Haltestelle Friedrichstraße (5 Min. Fußweg)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Bus className="w-5 h-5 mt-1 text-accent-500" />
                        <div>
                          <p className="font-semibold font-body">Bus</p>
                          <p className="text-sm text-muted-foreground font-body">
                            Linie 147, 245 - Haltestelle Musterplatz (2 Min. Fußweg)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Opening Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-primary-500/20 shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-accent-500" />
                    <CardTitle className="text-xl font-heading">Öffnungszeiten</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    {openingHours.map((schedule) => (
                      <div
                        key={schedule.day}
                        className={`flex justify-between py-3 px-4 rounded-lg transition-colors ${
                          schedule.highlight ? 'bg-accent-50' : 'hover:bg-muted'
                        }`}
                      >
                        <span className="font-medium font-body">{schedule.day}</span>
                        <span className="text-muted-foreground font-body">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-secondary-50 border-2 border-secondary-200 rounded-lg">
                    <p className="text-sm font-semibold text-secondary-800 mb-2 font-heading">Open Gym Zeiten:</p>
                    <p className="text-sm text-secondary-700 font-body">
                      Mo-Fr: 12:00-14:00 & 16:00-18:00<br />
                      Sa-So: Nach Kursende bis Schließung
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
              Buche jetzt dein kostenloses Probetraining und lerne uns kennen
            </p>
            <Link
              href="#booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold rounded-button shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Jetzt buchen
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

