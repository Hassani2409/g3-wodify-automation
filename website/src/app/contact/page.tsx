"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  MapPin, Phone, Mail, Clock, CheckCircle, 
  Car, Train, Bus, Dumbbell, ArrowRight, ArrowLeft, Loader2, AlertCircle
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

interface FormErrors {
  [key: string]: string;
}

export default function ContactPage() {
  const [step, setStep] = useState<number | 'success'>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingType, setBookingType] = useState<'trial' | 'drop-in'>('trial');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [bookingFormData, setBookingFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    experience: '',
    message: '',
    privacy: false
  });

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};
    
    if (currentStep === 1) {
      // Vorname Validierung
      if (!bookingFormData.firstName.trim()) {
        newErrors.firstName = "Vorname ist erforderlich";
      } else if (bookingFormData.firstName.trim().length < 2) {
        newErrors.firstName = "Vorname muss mindestens 2 Zeichen lang sein";
      } else if (bookingFormData.firstName.trim().length > 50) {
        newErrors.firstName = "Vorname darf maximal 50 Zeichen lang sein";
      } else if (!/^[a-zA-ZäöüÄÖÜß\s-]+$/.test(bookingFormData.firstName.trim())) {
        newErrors.firstName = "Vorname darf nur Buchstaben, Leerzeichen und Bindestriche enthalten";
      }
      
      // Nachname Validierung
      if (!bookingFormData.lastName.trim()) {
        newErrors.lastName = "Nachname ist erforderlich";
      } else if (bookingFormData.lastName.trim().length < 2) {
        newErrors.lastName = "Nachname muss mindestens 2 Zeichen lang sein";
      } else if (bookingFormData.lastName.trim().length > 50) {
        newErrors.lastName = "Nachname darf maximal 50 Zeichen lang sein";
      } else if (!/^[a-zA-ZäöüÄÖÜß\s-]+$/.test(bookingFormData.lastName.trim())) {
        newErrors.lastName = "Nachname darf nur Buchstaben, Leerzeichen und Bindestriche enthalten";
      }
      
      // E-Mail Validierung (erweitert)
      if (!bookingFormData.email.trim()) {
        newErrors.email = "E-Mail ist erforderlich";
      } else {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(bookingFormData.email.trim())) {
          newErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein";
        } else if (bookingFormData.email.trim().length > 100) {
          newErrors.email = "E-Mail-Adresse darf maximal 100 Zeichen lang sein";
        }
      }
      
      // Telefonnummer Validierung (erweitert)
      if (!bookingFormData.phone.trim()) {
        newErrors.phone = "Telefonnummer ist erforderlich";
      } else {
        // Entferne alle Leerzeichen und Bindestriche für Validierung
        const cleanedPhone = bookingFormData.phone.replace(/[\s-]/g, '');
        // Erlaubt: +, Ziffern, Klammern
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[0-9]{4,14}$/;
        if (!phoneRegex.test(cleanedPhone)) {
          newErrors.phone = "Bitte gib eine gültige Telefonnummer ein (z.B. +49 30 12345678 oder 030 12345678)";
        } else if (cleanedPhone.length < 5) {
          newErrors.phone = "Telefonnummer muss mindestens 5 Zeichen lang sein";
        } else if (bookingFormData.phone.length > 50) {
          newErrors.phone = "Telefonnummer darf maximal 50 Zeichen lang sein";
        }
      }
    }
    
    if (currentStep === 2) {
      // Datum Validierung (erweitert)
      if (!bookingFormData.date) {
        newErrors.date = "Bitte wähle ein Datum";
      } else {
        const selectedDate = new Date(bookingFormData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          newErrors.date = "Das Datum darf nicht in der Vergangenheit liegen";
        }
        
        // Maximal 3 Monate im Voraus
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        if (selectedDate > maxDate) {
          newErrors.date = "Bitte wähle ein Datum innerhalb der nächsten 3 Monate";
        }
      }
      
      // Erfahrung Validierung (nur für Probetraining)
      if (bookingType === 'trial' && !bookingFormData.experience) {
        newErrors.experience = "Bitte wähle deine Erfahrung";
      }
      
      // Nachricht Validierung (optional, aber wenn vorhanden, dann validieren)
      if (bookingFormData.message && bookingFormData.message.length > 2000) {
        newErrors.message = "Nachricht darf maximal 2000 Zeichen lang sein";
      }
    }
    
    if (currentStep === 3) {
      if (!bookingFormData.privacy) {
        newErrors.privacy = "Du musst die Datenschutzerklärung akzeptieren";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step as number)) {
      setStep(s => typeof s === 'number' ? s + 1 : s);
      setSubmitError(null);
    }
  };

  const handleBack = () => {
    setStep(s => typeof s === 'number' ? s - 1 : s);
    setSubmitError(null);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setBookingFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Split name into first and last name if needed
      const [firstName, ...lastNameParts] = bookingFormData.firstName.split(' ');
      const lastName = lastNameParts.join(' ') || bookingFormData.lastName || '';
      
      // Prepare data for WODIFY API
      const leadData = {
        firstName: bookingFormData.firstName.trim(),
        lastName: bookingFormData.lastName.trim() || lastName.trim(),
        email: bookingFormData.email.trim(),
        phone: bookingFormData.phone.trim() || undefined,
        message: bookingFormData.message?.trim() || undefined,
        interested_in: bookingType === 'trial' ? 'Probetraining' : 'Drop-In',
        booking_date: bookingFormData.date || undefined,
        booking_time: bookingFormData.time || undefined,
        experience_level: bookingFormData.experience || undefined,
        source: 'Website Contact Form'
      };

      // Call backend API to create lead in WODIFY
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || 'Fehler beim Senden der Anfrage';
        
        // Spezifische Fehlermeldungen für verschiedene Status-Codes
        if (response.status === 400) {
          throw new Error(`Validierungsfehler: ${errorMessage}`);
        } else if (response.status === 429) {
          throw new Error('Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.');
        } else if (response.status >= 500) {
          throw new Error('Serverfehler. Bitte versuche es später erneut oder kontaktiere uns direkt.');
        } else {
          throw new Error(errorMessage);
        }
      }

      const result = await response.json();
      
      // Log success (optional, für Debugging)
      if (process.env.NODE_ENV === 'development') {
        console.log('Lead created successfully:', result);
      }
      
      // Success - show success screen
      setStep('success');
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Ein Fehler ist aufgetreten. Bitte versuche es erneut oder kontaktiere uns direkt.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
              {step === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 mx-auto mb-6 text-secondary-500" />
                  <h3 className="text-3xl font-bold mb-4 text-secondary-700 font-heading">Anfrage gesendet!</h3>
                  <p className="text-lg mb-8 max-w-lg mx-auto text-muted-foreground font-body">
                    Vielen Dank, {bookingFormData.firstName}! Wir haben deine Anfrage für den <strong>{new Date(bookingFormData.date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> erhalten und werden uns innerhalb von 24 Stunden bei dir melden.
                    {bookingType === 'drop-in' && (
                      <>
                        <br/><br/>
                        <strong>Bitte beachte: Die Zahlung von 25€ erfolgt vor Ort im Studio.</strong>
                      </>
                    )}
                  </p>
                  <Button 
                    onClick={() => {
                      setStep(1);
                      setBookingFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        date: '',
                        time: '',
                        experience: '',
                        message: '',
                        privacy: false
                      });
                      setErrors({});
                    }} 
                    className="bg-secondary-500 hover:bg-secondary-600 text-white font-button font-semibold px-6 py-3 rounded-button"
                  >
                    Neue Anfrage stellen
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-center border-2 border-muted rounded-lg p-1 mb-8 max-w-sm mx-auto">
                    <Button 
                      type="button"
                      onClick={() => {
                        setBookingType('trial');
                        setStep(1);
                        setErrors({});
                      }}
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
                      onClick={() => {
                        setBookingType('drop-in');
                        setStep(1);
                        setErrors({});
                      }}
                      className={`flex-1 transition-all font-button ${
                        bookingType === 'drop-in' 
                          ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                          : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      Drop-In (25€)
                    </Button>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold font-body ${
                            step === s 
                              ? 'bg-primary-500 text-white' 
                              : step > s 
                              ? 'bg-secondary-500 text-white' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {step > s ? '✓' : s}
                          </div>
                          {s < 3 && (
                            <div className={`w-12 h-0.5 ${
                              step > s ? 'bg-secondary-500' : 'bg-muted'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm font-body">{submitError}</p>
                    </motion.div>
                  )}
                  
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Persönliche Daten */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-primary-700 font-heading">
                              Schritt 1: Deine Kontaktdaten
                            </h3>
                            <p className="text-muted-foreground mt-2 font-body">
                              Wir benötigen deine Daten, um dich zu kontaktieren
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-semibold text-foreground mb-2 font-body">
                                Vorname *
                              </label>
                              <input 
                                id="firstName"
                                className={`w-full px-4 py-3 border-2 rounded-button focus:outline-none transition-colors font-body ${
                                  errors.firstName ? 'border-red-500' : 'border-muted focus:border-primary-500'
                                }`}
                                required 
                                value={bookingFormData.firstName} 
                                onChange={(e) => handleInputChange('firstName', e.target.value)} 
                                placeholder="Max"
                              />
                              {errors.firstName && (
                                <p className="text-red-500 text-xs mt-1 font-body">{errors.firstName}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="lastName" className="block text-sm font-semibold text-foreground mb-2 font-body">
                                Nachname *
                              </label>
                              <input 
                                id="lastName"
                                className={`w-full px-4 py-3 border-2 rounded-button focus:outline-none transition-colors font-body ${
                                  errors.lastName ? 'border-red-500' : 'border-muted focus:border-primary-500'
                                }`}
                                required 
                                value={bookingFormData.lastName} 
                                onChange={(e) => handleInputChange('lastName', e.target.value)} 
                                placeholder="Mustermann"
                              />
                              {errors.lastName && (
                                <p className="text-red-500 text-xs mt-1 font-body">{errors.lastName}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2 font-body">
                                E-Mail Adresse *
                              </label>
                              <input 
                                id="email"
                                className={`w-full px-4 py-3 border-2 rounded-button focus:outline-none transition-colors font-body ${
                                  errors.email ? 'border-red-500' : 'border-muted focus:border-primary-500'
                                }`}
                                type="email" 
                                required 
                                value={bookingFormData.email} 
                                onChange={(e) => handleInputChange('email', e.target.value)} 
                                placeholder="max@beispiel.de"
                              />
                              {errors.email && (
                                <p className="text-red-500 text-xs mt-1 font-body">{errors.email}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2 font-body">
                                Telefonnummer *
                              </label>
                              <input 
                                id="phone"
                                className={`w-full px-4 py-3 border-2 rounded-button focus:outline-none transition-colors font-body ${
                                  errors.phone ? 'border-red-500' : 'border-muted focus:border-primary-500'
                                }`}
                                type="tel" 
                                required 
                                value={bookingFormData.phone} 
                                onChange={(e) => handleInputChange('phone', e.target.value)} 
                                placeholder="+49 123 456789"
                              />
                              {errors.phone && (
                                <p className="text-red-500 text-xs mt-1 font-body">{errors.phone}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-4">
                            <Button 
                              type="button"
                              onClick={handleNext}
                              className="bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold px-6 py-3 rounded-button flex items-center gap-2"
                            >
                              Weiter zu Schritt 2
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Termin & Details */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-primary-700 font-heading">
                              Schritt 2: Termin & Details
                            </h3>
                            <p className="text-muted-foreground mt-2 font-body">
                              Wann möchtest du {bookingType === 'trial' ? 'dein Probetraining' : 'deinen Drop-In'}?
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="date" className="block text-sm font-semibold text-foreground mb-2 font-body">
                                Wunschtermin *
                              </label>
                              <input 
                                id="date"
                                className={`w-full px-4 py-3 border-2 rounded-button focus:outline-none transition-colors font-body ${
                                  errors.date ? 'border-red-500' : 'border-muted focus:border-primary-500'
                                }`}
                                type="date" 
                                required 
                                min={new Date().toISOString().split('T')[0]}
                                value={bookingFormData.date} 
                                onChange={(e) => handleInputChange('date', e.target.value)}
                              />
                              {errors.date && (
                                <p className="text-red-500 text-xs mt-1 font-body">{errors.date}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="time" className="block text-sm font-semibold text-foreground mb-2 font-body">
                                Bevorzugte Uhrzeit (optional)
                              </label>
                              <select 
                                id="time"
                                className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body"
                                value={bookingFormData.time} 
                                onChange={(e) => handleInputChange('time', e.target.value)}
                              >
                                <option value="">Keine Präferenz</option>
                                <option value="morning">Morgen (6:00 - 12:00)</option>
                                <option value="afternoon">Mittag (12:00 - 17:00)</option>
                                <option value="evening">Abend (17:00 - 21:00)</option>
                              </select>
                            </div>
                          </div>
                          
                          {bookingType === 'trial' && (
                            <div className="mt-6">
                              <label htmlFor="experience" className="block text-sm font-semibold text-foreground mb-2 font-body">
                                Deine CrossFit Erfahrung *
                              </label>
                              <select 
                                id="experience"
                                className={`w-full px-4 py-3 border-2 rounded-button focus:outline-none transition-colors font-body ${
                                  errors.experience ? 'border-red-500' : 'border-muted focus:border-primary-500'
                                }`}
                                value={bookingFormData.experience} 
                                onChange={(e) => handleInputChange('experience', e.target.value)}
                              >
                                <option value="">Bitte wähle dein Level</option>
                                <option value="beginner">Anfänger (keine Erfahrung)</option>
                                <option value="intermediate">Etwas Erfahrung (weniger als 1 Jahr)</option>
                                <option value="advanced">Erfahren (1+ Jahre)</option>
                              </select>
                              {errors.experience && (
                                <p className="text-red-500 text-xs mt-1 font-body">{errors.experience}</p>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-6">
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
                          
                          <div className="flex justify-between pt-4">
                            <Button 
                              type="button"
                              onClick={handleBack}
                              className="bg-transparent border-2 border-muted text-muted-foreground hover:bg-muted hover:text-foreground font-button font-semibold px-6 py-3 rounded-button flex items-center gap-2"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              Zurück
                            </Button>
                            <Button 
                              type="button"
                              onClick={handleNext}
                              className="bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold px-6 py-3 rounded-button flex items-center gap-2"
                            >
                              Weiter zu Schritt 3
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Bestätigung */}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-primary-700 font-heading">
                              Schritt 3: Bestätigung
                            </h3>
                            <p className="text-muted-foreground mt-2 font-body">
                              Bitte überprüfe deine Angaben
                            </p>
                          </div>
                          
                          <div className="bg-muted p-6 rounded-lg space-y-3 mb-6">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-body">Name:</span>
                              <span className="font-semibold text-foreground font-body">
                                {bookingFormData.firstName} {bookingFormData.lastName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-body">E-Mail:</span>
                              <span className="font-semibold text-foreground font-body">{bookingFormData.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-body">Telefon:</span>
                              <span className="font-semibold text-foreground font-body">{bookingFormData.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-body">Termin:</span>
                              <span className="font-semibold text-foreground font-body">
                                {new Date(bookingFormData.date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-body">Typ:</span>
                              <span className="font-semibold text-foreground font-body">
                                {bookingType === 'trial' ? 'Kostenloses Probetraining' : 'Drop-In (25€)'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border-t pt-6">
                            <label htmlFor="privacy" className="flex items-start space-x-3">
                              <input 
                                id="privacy" 
                                type="checkbox" 
                                checked={bookingFormData.privacy} 
                                onChange={(e) => handleInputChange('privacy', e.target.checked)}
                                className={`mt-1 w-5 h-5 ${errors.privacy ? 'border-red-500' : ''}`}
                                required 
                              />
                              <span className="text-sm text-muted-foreground font-body">
                                Ich habe die <Link href="/datenschutz" className="underline text-primary-700 hover:text-primary-800">Datenschutzerklärung</Link> gelesen und akzeptiere sie. *
                              </span>
                            </label>
                            {errors.privacy && (
                              <p className="text-red-500 text-xs mt-1 font-body">{errors.privacy}</p>
                            )}
                          </div>
                          
                          <div className="flex justify-between pt-6">
                            <Button 
                              type="button"
                              onClick={handleBack}
                              className="bg-transparent border-2 border-muted text-muted-foreground hover:bg-muted hover:text-foreground font-button font-semibold px-6 py-3 rounded-button flex items-center gap-2"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              Zurück
                            </Button>
                            <Button 
                              type="submit" 
                              className="bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold text-lg px-8 py-3 rounded-button shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2" 
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Wird gesendet...
                                </>
                              ) : (
                                <>
                                  Buchungsanfrage senden
                                  <ArrowRight className="w-5 h-5" />
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

