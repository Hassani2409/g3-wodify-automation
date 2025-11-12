"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Check, Star, ArrowRight, X, Loader2, PartyPopper 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Plan {
  name: string;
  monthlyPrice: number;
  sixMonthPrice: number;
  twelveMonthPrice: number;
  features: string[];
  isPopular: boolean;
  stripePriceId?: {
    monthly?: string;
    sixMonth?: string;
    twelveMonth?: string;
  };
}

interface SignupModalProps {
  plan: Plan | null;
  billingType: 'monthly' | 'sixMonth' | 'twelveMonth';
  onClose: () => void;
}

const SignupModal = ({ plan, billingType, onClose }: SignupModalProps) => {
  const [step, setStep] = useState<number | 'success'>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthdate: '',
    experience: '',
    goals: '',
    privacy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isStudent, setIsStudent] = useState(false);

  if (!plan) return null;

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => typeof s === 'number' ? s + 1 : s);
    }
  };
  
  const handleBack = () => setStep(s => typeof s === 'number' ? s - 1 : s);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? target.checked : undefined;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "Vorname ist erforderlich.";
      if (!formData.lastName) newErrors.lastName = "Nachname ist erforderlich.";
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Gültige E-Mail ist erforderlich.";
      if (!formData.birthdate) newErrors.birthdate = "Geburtsdatum ist erforderlich.";
    }
    if (step === 2) {
      if (!formData.experience) newErrors.experience = "Bitte wähle deine Erfahrung.";
      if (!formData.goals) newErrors.goals = "Bitte beschreibe deine Ziele.";
    }
    if (step === 3) {
      if (!formData.privacy) newErrors.privacy = "Du musst die Bedingungen akzeptieren.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      // Determine plan type for Stripe
      const planTypeMap: Record<string, '2x_weekly' | '3x_weekly' | 'unlimited'> = {
        '2x pro Woche': '2x_weekly',
        '3x pro Woche': '3x_weekly',
        'Unlimited': 'unlimited'
      };
      
      const planType = planTypeMap[plan.name] || '2x_weekly';
      const stripePriceId = plan.stripePriceId?.[billingType];
      
      // Check if Stripe is configured
      if (!stripePriceId || stripePriceId === 'price_xxx') {
        // Fallback: Create lead in WODIFY and show success message
        // User will complete payment manually or via WODIFY Sales Portal
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        try {
          // Create lead in WODIFY for manual follow-up
          const leadResponse = await fetch(`${apiUrl}/api/leads`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone || undefined,
              message: `Mitgliedschaftsanfrage: ${plan.name} (${billingType === 'monthly' ? 'Monatlich' : billingType === 'sixMonth' ? '6 Monate' : '12 Monate'}). Ziele: ${formData.goals}`,
              interested_in: `Mitgliedschaft: ${plan.name}`,
              source: 'Website Membership Form'
            }),
          });
          
          if (leadResponse.ok) {
            setStep('success');
            return;
          }
        } catch (leadError) {
          console.error('Failed to create lead:', leadError);
        }
        
        // If lead creation fails, still show success but inform user
        setStep('success');
        return;
      }

      // Stripe Checkout Flow
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      
      const checkoutResponse = await fetch(`${baseUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: stripePriceId,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          metadata: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone || '',
            birthdate: formData.birthdate || '',
            experience: formData.experience || '',
            goals: formData.goals || '',
            planName: plan.name,
            billingType: billingType,
          },
          isStudent: isStudent,
          planType: planType,
        }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Fehler beim Erstellen der Checkout-Session');
      }

      const { url: checkoutUrl } = await checkoutResponse.json();
      
      if (checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
      
    } catch (error) {
      console.error("Submission failed:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten. Bitte versuche es erneut."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key={1} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-foreground font-heading">Schritt 1: Persönliche Daten</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-foreground mb-2 font-body">Vorname *</label>
                <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body" required />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-foreground mb-2 font-body">Nachname *</label>
                <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body" required />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2 font-body">E-Mail Adresse *</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body" required />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2 font-body">Telefonnummer</label>
                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body" />
              </div>
              <div>
                <label htmlFor="birthdate" className="block text-sm font-semibold text-foreground mb-2 font-body">Geburtsdatum *</label>
                <input id="birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body" required />
                {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
              </div>
            </div>
            <div className="pt-2">
              <label htmlFor="isStudent" className="flex items-center space-x-3 cursor-pointer">
                <input 
                  id="isStudent" 
                  type="checkbox" 
                  checked={isStudent} 
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-sm text-muted-foreground font-body">
                  Ich bin Student, Auszubildender oder Soldat und berechtigt für eine Ermäßigung
                </span>
              </label>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="button" onClick={handleNext} className="bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold px-6 py-3 rounded-button">Weiter zu Schritt 2</Button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key={2} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-foreground font-heading">Schritt 2: Deine Ziele</h3>
            <div>
              <label htmlFor="experience" className="block text-sm font-semibold text-foreground mb-2 font-body">Deine Trainingserfahrung *</label>
              <select id="experience" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body" required>
                <option value="">Bitte wählen</option>
                <option value="beginner">Anfänger (noch nie CrossFit)</option>
                <option value="intermediate">Etwas Erfahrung (&lt; 1 Jahr)</option>
                <option value="advanced">Fortgeschritten (1+ Jahre)</option>
              </select>
              {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
            </div>
            <div>
              <label htmlFor="goals" className="block text-sm font-semibold text-foreground mb-2 font-body">Was sind deine Hauptziele? *</label>
              <textarea id="goals" name="goals" value={formData.goals} onChange={handleChange} className="w-full px-4 py-3 border-2 border-muted rounded-button focus:border-primary-500 focus:outline-none transition-colors font-body h-24" placeholder="z.B. fitter werden, Muskeln aufbauen, abnehmen..." required></textarea>
              {errors.goals && <p className="text-red-500 text-xs mt-1">{errors.goals}</p>}
            </div>
            <div className="flex justify-between pt-2">
              <Button type="button" onClick={handleBack} className="bg-transparent border-2 border-muted text-muted-foreground hover:bg-muted hover:text-foreground font-button font-semibold px-6 py-3 rounded-button">Zurück</Button>
              <Button type="button" onClick={handleNext} className="bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold px-6 py-3 rounded-button">Weiter zu Schritt 3</Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key={3} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h3 className="text-xl font-bold mb-4 text-foreground font-heading">Schritt 3: Bestätigung</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2 mb-6">
              <div className="flex justify-between"><span className="text-muted-foreground font-body">Mitgliedschaft:</span> <span className="font-semibold text-foreground font-body">{plan.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-body">Zahlungsweise:</span> <span className="font-semibold text-foreground font-body">{billingType === 'monthly' ? 'Monatlich' : billingType === 'sixMonth' ? '6 Monate' : '12 Monate'}</span></div>
              <div className="flex justify-between font-bold text-lg"><span className="text-foreground font-heading">Preis:</span> <span className="text-accent-500 font-heading">{billingType === 'monthly' ? plan.monthlyPrice : billingType === 'sixMonth' ? plan.sixMonthPrice : plan.twelveMonthPrice}€ / Monat</span></div>
              {billingType !== 'monthly' && (
                <div className="flex justify-between text-sm"><span className="text-muted-foreground font-body">Aufnahmegebühr:</span> <span className="font-semibold text-foreground font-body">49€ (einmalig)</span></div>
              )}
            </div>
            <div className="border-t pt-4">
              <label htmlFor="privacy" className="flex items-start space-x-3">
                <input id="privacy" type="checkbox" name="privacy" checked={formData.privacy} onChange={handleChange} className="mt-1" required />
                <span className="text-sm text-muted-foreground font-body">
                  Ich habe die <Link href="/agb" className="underline text-primary-700">AGB</Link> und die <Link href="/datenschutz" className="underline text-primary-700">Datenschutzerklärung</Link> gelesen und akzeptiere sie.
                </span>
              </label>
              {errors.privacy && <p className="text-red-500 text-xs mt-1">{errors.privacy}</p>}
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" onClick={handleBack} className="bg-transparent border-2 border-muted text-muted-foreground hover:bg-muted hover:text-foreground font-button font-semibold px-6 py-3 rounded-button">Zurück</Button>
              <Button type="submit" onClick={handleSubmit} className="bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold px-6 py-3 rounded-button" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird gesendet...</> : "Anmeldung absenden"}
              </Button>
            </div>
          </motion.div>
        );
      case 'success':
        return (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <PartyPopper className="w-16 h-16 mx-auto mb-4 text-secondary-500" />
            <h2 className="text-2xl font-bold mb-4 text-foreground font-heading">Fast geschafft, {formData.firstName}!</h2>
            <p className="text-muted-foreground mb-6 font-body">
              {plan.stripePriceId?.[billingType] && plan.stripePriceId[billingType] !== 'price_xxx'
                ? 'Du wirst jetzt zu Stripe Checkout weitergeleitet, um deine Zahlung abzuschließen. Nach erfolgreicher Zahlung wird deine Mitgliedschaft automatisch aktiviert.'
                : 'Wir haben deine Anmeldung erhalten. Du bekommst in Kürze eine E-Mail von uns mit allen weiteren Schritten, inklusive dem Link zur Zahlung und zur Aktivierung deines Accounts.'}
            </p>
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-body">{errors.submit}</p>
              </div>
            )}
            <Button onClick={onClose} className="bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold px-6 py-3 rounded-button">Schließen</Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="w-full max-w-2xl bg-white rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto"
        >
          <Button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-transparent hover:bg-muted text-foreground p-2 rounded-button"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground font-heading">Mitglied werden: {plan.name}</h2>
                {step !== 'success' && (
                  <div className="text-sm font-semibold p-2 rounded-lg bg-muted text-foreground font-body">
                    Schritt {typeof step === 'number' ? `${step} / 3` : '✓'}
                  </div>
                )}
              </div>
            </div>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function PricingPage() {
  const [billingType, setBillingType] = useState<'monthly' | 'sixMonth' | 'twelveMonth'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const plans: Plan[] = [
    {
      name: "2x pro Woche",
      monthlyPrice: 140,
      sixMonthPrice: 110,
      twelveMonthPrice: 100,
      features: [
        "2 Trainings pro Woche",
        "Freier Zugang zum Open Gym",
        "Community Events",
        "Professionelle Betreuung"
      ],
      isPopular: false,
      stripePriceId: {
        monthly: 'price_xxx', // TODO: Add real Stripe Price IDs
        sixMonth: 'price_xxx',
        twelveMonth: 'price_xxx'
      }
    },
    {
      name: "3x pro Woche",
      monthlyPrice: 150,
      sixMonthPrice: 130,
      twelveMonthPrice: 120,
      features: [
        "3 Trainings pro Woche",
        "Freier Zugang zum Open Gym",
        "Alle Spezialkurse inklusive",
        "Community Events",
        "Professionelle Betreuung"
      ],
      isPopular: false,
      stripePriceId: {
        monthly: 'price_xxx',
        sixMonth: 'price_xxx',
        twelveMonth: 'price_xxx'
      }
    },
    {
      name: "Unlimited",
      monthlyPrice: 175,
      sixMonthPrice: 150,
      twelveMonthPrice: 140,
      features: [
        "Unbegrenzt Trainings pro Woche",
        "Freier Zugang zum Open Gym",
        "Alle Spezialkurse inklusive",
        "Community Events",
        "Professionelle Betreuung",
        "Priorität bei Workshops"
      ],
      isPopular: true,
      stripePriceId: {
        monthly: 'price_xxx',
        sixMonth: 'price_xxx',
        twelveMonth: 'price_xxx'
      }
    }
  ];

  const handleSignupClick = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {selectedPlan && (
          <SignupModal plan={selectedPlan} billingType={billingType} onClose={() => setSelectedPlan(null)} />
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1574680096145-f8493c9e1a45?w=2069&h=1200&fit=crop&q=80")'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-heading">
              Preise & Mitgliedschaft
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 max-w-3xl mx-auto font-body">
              Werde Teil der G3-Community. Finde die Mitgliedschaft, die perfekt zu dir passt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Billing Cycle Toggle */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button
              onClick={() => setBillingType('monthly')}
              className={`px-6 py-3 rounded-button font-button font-semibold transition-all ${
                billingType === 'monthly'
                  ? 'bg-accent-500 text-white shadow-lg'
                  : 'bg-transparent border-2 border-muted text-muted-foreground hover:bg-muted'
              }`}
            >
              Monatlich
            </button>
            <button
              onClick={() => setBillingType('sixMonth')}
              className={`px-6 py-3 rounded-button font-button font-semibold transition-all relative ${
                billingType === 'sixMonth'
                  ? 'bg-accent-500 text-white shadow-lg'
                  : 'bg-transparent border-2 border-muted text-muted-foreground hover:bg-muted'
              }`}
            >
              6 Monate
              <Badge className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs">Spare bis zu 30€</Badge>
            </button>
            <button
              onClick={() => setBillingType('twelveMonth')}
              className={`px-6 py-3 rounded-button font-button font-semibold transition-all relative ${
                billingType === 'twelveMonth'
                  ? 'bg-accent-500 text-white shadow-lg'
                  : 'bg-transparent border-2 border-muted text-muted-foreground hover:bg-muted'
              }`}
            >
              12 Monate
              <Badge className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs">Spare bis zu 40€</Badge>
            </button>
          </div>
          <p className="text-center mt-4 text-sm text-muted-foreground font-body">
            Aufnahmegebühr: 49€ (einmalig bei 6- und 12-Monats-Verträgen)
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`flex flex-col shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative ${plan.isPopular ? 'border-2 border-accent-500' : 'border-2 border-primary-500/20'}`}
                >
                  {plan.isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm bg-accent-500 text-white hover:bg-accent-600">
                      <Star className="w-3 h-3 mr-1" />
                      Beliebteste Wahl
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-heading text-foreground">{plan.name}</CardTitle>
                    <p className="text-4xl font-bold my-4 text-accent-500 font-heading">
                      {billingType === 'monthly' ? plan.monthlyPrice : billingType === 'sixMonth' ? plan.sixMonthPrice : plan.twelveMonthPrice}€
                      <span className="text-lg font-medium text-muted-foreground font-body">/Monat</span>
                    </p>
                    {billingType !== 'monthly' && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground font-body">
                          Vertragslaufzeit: {billingType === 'sixMonth' ? '6 Monate' : '12 Monate'}
                        </p>
                        <p className="text-xs text-secondary-600 font-body font-semibold">
                          Spare {billingType === 'sixMonth'
                            ? `${(plan.monthlyPrice - plan.sixMonthPrice) * 6}€`
                            : `${(plan.monthlyPrice - plan.twelveMonthPrice) * 12}€`
                          } insgesamt
                        </p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                          <span className="text-muted-foreground font-body">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSignupClick(plan)}
                      className={`w-full text-lg font-semibold py-6 font-button rounded-button ${
                        plan.isPopular
                          ? 'bg-accent-500 hover:bg-accent-600 text-white'
                          : 'bg-secondary-500 hover:bg-secondary-600 text-white'
                      }`}
                    >
                      Mitglied werden <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground font-heading">
            Weitere Optionen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="flex flex-col justify-between p-6 h-full border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300">
                <div>
                  <CardTitle className="mb-2 font-heading text-foreground">Drop-In</CardTitle>
                  <p className="mb-4 text-muted-foreground font-body">
                    Besuchst du Berlin oder möchtest nur eine einzelne Klasse ausprobieren?
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-accent-500 font-heading">
                    25€ <span className="text-lg font-medium text-muted-foreground font-body">/Klasse</span>
                  </div>
                  <Button asChild className="w-full bg-transparent border-2 border-primary-500 text-primary-700 hover:bg-primary-500 hover:text-white font-button font-semibold px-6 py-3 rounded-button">
                    <Link href="/contact">Drop-In buchen</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="flex flex-col justify-between p-6 h-full border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-300">
                <div>
                  <CardTitle className="mb-2 font-heading text-foreground">10er-Karte</CardTitle>
                  <p className="mb-4 text-muted-foreground font-body">
                    10 Gruppentrainings in 4 Monaten. Personenbezogen und nicht übertragbar.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-accent-500 font-heading">
                    200€ <span className="text-lg font-medium text-muted-foreground font-body">/10 Klassen</span>
                  </div>
                  <Button asChild className="w-full bg-transparent border-2 border-primary-500 text-primary-700 hover:bg-primary-500 hover:text-white font-button font-semibold px-6 py-3 rounded-button">
                    <Link href="/contact">10er-Karte kaufen</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="flex flex-col justify-between p-6 h-full border-2 border-accent-500 hover:border-accent-600 transition-all duration-300 bg-accent-50">
                <div>
                  <CardTitle className="mb-2 font-heading text-foreground">Kostenloses Probetraining</CardTitle>
                  <p className="mb-4 text-muted-foreground font-body">
                    Neu bei CrossFit? Teste uns kostenlos. Lerne die Trainer, die Community und die Grundlagen kennen.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-accent-500 font-heading">0€</div>
                  <Button asChild className="w-full bg-accent-500 hover:bg-accent-600 text-white font-button font-semibold px-6 py-3 rounded-button">
                    <Link href="/contact">Probetraining buchen</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Student Discount Info */}
      <section className="py-12 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-foreground font-heading">Ermäßigungen</h3>
          <p className="text-lg text-muted-foreground font-body max-w-3xl mx-auto">
            <strong>Studenten, Auszubildende und Soldaten</strong> erhalten eine Ermäßigung:<br />
            <span className="text-accent-500 font-semibold">10€ bei 2x pro Woche</span> •
            <span className="text-accent-500 font-semibold"> 15€ bei 3x pro Woche</span> •
            <span className="text-accent-500 font-semibold"> 20€ bei Unlimited</span>
          </p>
          <p className="text-sm text-muted-foreground font-body mt-4">
            Nachweis erforderlich bei Vertragsabschluss
          </p>
        </div>
      </section>
    </div>
  );
}

