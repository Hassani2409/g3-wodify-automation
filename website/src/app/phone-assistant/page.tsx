"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, PhoneOff } from 'lucide-react';
import { InvokeLLM } from '@/integrations/Core';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptMessage {
    text: string;
    sender: 'user' | 'bot';
    id: number;
}

export default function PhoneAssistant() {
    const [callState, setCallState] = useState<'disconnected' | 'connecting' | 'active' | 'ended'>('disconnected');
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    const callContext = `
Du bist ein freundlicher und professioneller Telefon-AI-Assistent für G3 CrossFit in Berlin. 

Deine Aufgabe ist es, Anrufer zu begrüßen und ihre Anliegen effizient zu bearbeiten.

WICHTIGE INFORMATIONEN:
- Standort: Musterstraße 123, 10115 Berlin
- Telefon: +49 30 12345678
- Öffnungszeiten: Mo-Fr 6:00-21:00, Sa 8:00-18:00, So 9:00-16:00
- Preise: Starter 89€, Unlimited 139€, Premium 189€
- Kostenloses Probetraining verfügbar
- Alle Level willkommen

GESPRÄCHSFÜHRUNG:
- Probetraining: Biete sofortige Terminbuchung an oder leite zur Online-Buchung weiter
- Kurse/Preise: Gib klare Informationen und erwähne das kostenlose Probetraining
- Standort/Anfahrt: Erwähne kostenlose Parkplätze und gute ÖPNV-Anbindung

Beginne das erste Gespräch mit: "G3 CrossFit, mein Name ist Alex. Wie kann ich Ihnen helfen?"

Antworte immer natürlich, kurz und hilfsbereit.
`;

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript]);

    const startCall = () => {
        setCallState('connecting');
        setTranscript([]);
        setTimeout(() => {
            setCallState('active');
            handleAIResponse("Anruf beginnt");
        }, 1500);
    };

    const endCall = () => {
        setCallState('ended');
        setTranscript([]);
        setTimeout(() => setCallState('disconnected'), 2000);
    };

    const handleUserPrompt = async (promptText: string) => {
        if (isSpeaking || isListening) return;

        addToTranscript(promptText, 'user');
        setIsListening(true);
        setTimeout(() => {
            handleAIResponse(promptText);
        }, 1000);
    };

    const handleAIResponse = async (userMessage: string) => {
        try {
            const response = await InvokeLLM({
                prompt: `${callContext}\n\nDer Anrufer sagt: "${userMessage}"`,
            });
            setIsListening(false);
            setIsSpeaking(true);
            
            // Simulate typing/speaking
            setTimeout(() => {
                addToTranscript(response, 'bot');
                setIsSpeaking(false);
            }, 1200);
        } catch (error) {
            console.error("Error getting AI response:", error);
            setIsListening(false);
            setIsSpeaking(false);
            addToTranscript("Entschuldigung, es gab ein Problem. Bitte versuchen Sie es erneut.", 'bot');
        }
    };

    const addToTranscript = (text: string, sender: 'user' | 'bot') => {
        setTranscript(prev => [...prev, { text, sender, id: Date.now() }]);
    };
    
    const promptOptions = [
        { id: 'trial', text: 'Ich möchte ein Probetraining buchen.' },
        { id: 'prices', text: 'Was kostet eine Mitgliedschaft?' },
        { id: 'location', text: 'Wo finde ich euch?' },
        { id: 'classes', text: 'Welche Kurse bietet ihr an?' },
        { id: 'hours', text: 'Wie sind eure Öffnungszeiten?' }
    ];

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Phone Interface */}
                <Card className="bg-black rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-700">
                    <div className="p-6">
                        <div className="text-center mb-8">
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }} 
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative"
                            >
                                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#2A5D3C'}}>
                                    <Phone className="w-12 h-12 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 font-heading">G3 CrossFit AI</h2>
                                <p className="text-green-400 font-mono transition-opacity duration-300 text-sm">
                                    {callState === 'connecting' && 'Verbinde...'}
                                    {callState === 'active' && (isListening ? '🎧 Höre zu...' : isSpeaking ? '🗣 Spricht...' : '📞 Verbunden')}
                                    {callState === 'ended' && '📱 Anruf beendet'}
                                    {callState === 'disconnected' && '📞 Bereit für Anruf'}
                                </p>
                            </motion.div>
                        </div>
                        
                        <AnimatePresence>
                            {callState === 'active' && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mb-6"
                                >
                                    {/* Transcript */}
                                    <div className="bg-gray-800 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                                        {transcript.map((msg) => (
                                            <motion.div 
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                                            >
                                                <div className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                                                    msg.sender === 'user' 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-green-600 text-white'
                                                }`}>
                                                    <span className="text-xs opacity-75 block mb-1 font-body">
                                                        {msg.sender === 'user' ? 'Sie' : 'G3 Assistant'}
                                                    </span>
                                                    <span className="font-body">{msg.text}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                        <div ref={transcriptEndRef} />
                                    </div>
                                    
                                    {/* Quick Response Options */}
                                    <div className="space-y-2">
                                        <p className="text-white text-sm mb-2 font-body">Wählen Sie eine Option:</p>
                                        {promptOptions.map((option) => (
                                            <Button
                                                key={option.id}
                                                onClick={() => handleUserPrompt(option.text)}
                                                disabled={isListening || isSpeaking}
                                                className="w-full text-left justify-start bg-gray-700 hover:bg-gray-600 text-white text-sm font-button"
                                                size="sm"
                                            >
                                                {option.text}
                                            </Button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Call Controls */}
                        <div className="flex justify-center space-x-4">
                            {callState === 'disconnected' && (
                                <Button
                                    onClick={startCall}
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 font-button"
                                >
                                    <Phone className="mr-2 w-5 h-5" />
                                    Anrufen
                                </Button>
                            )}
                            
                            {(callState === 'connecting' || callState === 'active') && (
                                <Button
                                    onClick={endCall}
                                    size="lg"
                                    className="bg-red-600 hover:bg-red-700 text-white px-8 font-button"
                                >
                                    <PhoneOff className="mr-2 w-5 h-5" />
                                    Auflegen
                                </Button>
                            )}

                            {callState === 'ended' && (
                                <div className="text-center text-green-400 font-body">
                                    ✅ Anruf beendet
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Info Section */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm mb-2 font-body">
                        Demo des KI-gestützten Telefonassistenten
                    </p>
                    <p className="text-gray-500 text-xs font-body">
                        Echte Telefonnummer: <strong className="text-white">+49 30 12345678</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}

