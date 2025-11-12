"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Bot, LayoutDashboard, Calendar, Palette, ArrowRight, Phone } from 'lucide-react';

export default function Showcase() {
    const features = [
        {
            icon: <Bot className="w-8 h-8 text-white" />,
            title: 'KI-gestützter Assistent',
            description: 'Ein intelligenter Chatbot, der rund um die Uhr Anfragen beantwortet und Probetrainings bucht.',
            link: '/contact', // Link zur Kontaktseite mit Chatbot-Funktionalität
            linkText: "Chatbot testen"
        },
        {
            icon: <Phone className="w-8 h-8 text-white" />,
            title: 'Telefon-AI-Assistent',
            description: 'Eine Simulation eines KI-gestützten Telefonanrufs zur Bearbeitung von Standardanfragen.',
            link: '/phone-assistant', // Link zur Phone-Assistant-Seite
            linkText: "Anruf simulieren"
        },
        {
            icon: <LayoutDashboard className="w-8 h-8 text-white" />,
            title: 'Personalisiertes Mitgliederportal',
            description: 'Ein Dashboard mit KI-generierten Trainingsplänen, Fortschrittsverfolgung und Kursempfehlungen.',
            link: '/dashboard',
            linkText: "Portal öffnen"
        },
        {
            icon: <Calendar className="w-8 h-8 text-white" />,
            title: 'Dynamische Kursplanung',
            description: 'Ein interaktiver Kursplan mit Filterfunktionen und direkter Anbindung an das Buchungssystem.',
            link: '/schedule',
            linkText: "Kursplan ansehen"
        },
        {
            icon: <Palette className="w-8 h-8 text-white" />,
            title: 'Modernes Design-System',
            description: 'Eine konsistente, ansprechende und responsive Benutzeroberfläche für alle Endgeräte.'
        }
    ];

    const techStack = ['React.js', 'Tailwind CSS', 'Framer Motion', 'KI-Integration', 'Server-Side Rendering'];
    
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Open+Sans:wght@400&display=swap');
                    body { font-family: 'Open Sans', sans-serif; }
                    h1, h2, h3, h4 { font-family: 'Barlow Condensed', sans-serif; }
                `}
            </style>

            {/* Header */}
            <header className="py-4 px-6 md:px-12 flex justify-between items-center bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#2A5D3C'}}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278C12 6.25278 15.2148 3 18.2528 3C21.2908 3 23.2528 5.68629 23.2528 8.5C23.2528 12.5193 18.2528 17 12 21L5.74722 17C1.72794 12.5193 0.747218 8.5 0.747218 8.5C0.747218 5.68629 2.70924 3 5.74722 3C8.7852 3 12 6.25278 12 6.25278Z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold font-heading">G3 CrossFit | Project Showcase</span>
                </div>
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                    <Link href="/">Zur Live-Anwendung <ArrowRight className="ml-2 w-4 h-4"/></Link>
                </Button>
            </header>

            {/* Hero Section */}
            <main>
                <section className="relative text-center py-24 md:py-40 px-4" style={{background: 'linear-gradient(135deg, #2A5D3C 0%, #1a3a26 100%)'}}>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                            Eine neue Ära des digitalen Fitnesserlebnisses
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Eine Präsentation des G3 CrossFit Web-Projekts, entwickelt mit modernster Technologie und künstlicher Intelligenz auf der base44-Plattform.
                        </p>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="py-20 md:py-28 bg-gray-800">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Kernfunktionen im Überblick</h2>
                            <p className="text-gray-400 mt-4">Innovative Lösungen für ein herausragendes Nutzererlebnis.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <motion.div 
                                    key={index}
                                    className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 hover:border-orange-500 transition-colors duration-300 flex flex-col"
                                    variants={fadeIn}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-500 mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-gray-400 flex-grow">{feature.description}</p>
                                    {feature.link && (
                                        <Button asChild variant="ghost" className="mt-4 text-orange-400 hover:text-orange-300 self-start p-0 h-auto">
                                            <Link href={feature.link} className="flex items-center text-sm font-semibold">
                                                {feature.linkText} <ArrowRight className="ml-2 w-4 h-4" />
                                            </Link>
                                        </Button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Visual Showcase */}
                <section className="py-20 md:py-28">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Einblicke in die Anwendung</h2>
                            <p className="text-gray-400 mt-4">Screenshots ausgewählter Bereiche der G3 CrossFit Plattform.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                                <h3 className="text-2xl font-bold mb-4 text-orange-400">Personalisiertes Mitglieder-Dashboard</h3>
                                <p className="text-gray-300 mb-6">Die Kommandozentrale für jedes Mitglied. Hier sehen Nutzer ihre anstehenden Kurse, verfolgen ihre Trainings-Performance mit visuellen Diagrammen und erhalten von der KI generierte Pläne, die auf ihre individuellen Ziele zugeschnitten sind.</p>
                                <div className="aspect-video bg-gray-800 rounded-lg shadow-2xl p-2 border border-gray-700">
                                    <img 
                                        src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=2094&auto=format&fit=crop" 
                                        alt="Dashboard Mockup" 
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                            </motion.div>
                            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                                <h3 className="text-2xl font-bold mb-4 text-orange-400">Intelligenter Chat-Assistent</h3>
                                <p className="text-gray-300 mb-6">Der virtuelle Assistent steht rund um die Uhr zur Verfügung, beantwortet Fragen zu Preisen und Kursen, hilft bei der Buchung von Probetrainings und bietet eine natürliche, dialogorientierte Benutzererfahrung. Alles angetrieben durch eine leistungsstarke LLM-Integration.</p>
                                <div className="aspect-video bg-gray-800 rounded-lg shadow-2xl p-2 border border-gray-700">
                                    <img 
                                        src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1769&auto=format&fit=crop" 
                                        alt="Chatbot Mockup" 
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="py-20 md:py-28 bg-gray-800">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Technologie & Innovation</h2>
                        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Gebaut auf einem modernen, performanten und skalierbaren Tech-Stack für eine zukunftssichere Lösung.</p>
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            {techStack.map((tech, index) => (
                                <motion.div 
                                    key={index}
                                    className="bg-gray-700 text-white py-2 px-5 rounded-full text-lg font-medium"
                                    variants={fadeIn}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    custom={index}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {tech}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 md:py-28 text-center">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Erleben Sie die Zukunft des CrossFit</h2>
                        <p className="text-gray-300 max-w-2xl mx-auto mb-8">Entdecken Sie die vollständige Anwendung und sehen Sie, wie G3 CrossFit die digitale Fitnesslandschaft neu definiert.</p>
                        <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4">
                            <Link href="/">Live-Anwendung jetzt erkunden</Link>
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t border-gray-800">
                <div className="container mx-auto px-6 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} G3 CrossFit | Projekt-Showcase</p>
                    <p className="text-sm mt-2">
                        Entwickelt auf der{' '}
                        <a 
                            href="https://base44.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="underline hover:text-white"
                        >
                            base44.com
                        </a>{' '}
                        Plattform
                    </p>
                </div>
            </footer>
        </div>
    );
}

