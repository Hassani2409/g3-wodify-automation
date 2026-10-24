"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, PhoneOff, X } from 'lucide-react';
import { InvokeLLM } from '@/integrations/Core';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptMessage {
    text: string;
    sender: 'user' | 'bot';
    id: number;
}

interface PhoneAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PhoneAssistantModal(props: PhoneAssistantModalProps) {
    return <PhoneSession key={String(props.isOpen)} {...props} />;
}

function PhoneSession({ isOpen, onClose }: PhoneAssistantModalProps) {
    const [callState, setCallState] = useState<'disconnected' | 'connecting' | 'active' | 'ended'>('disconnected');
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    const conversationHistoryRef = useRef<string[]>([]);

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
        conversationHistoryRef.current = [];
        setTimeout(() => {
            setCallState('active');
            handleAIResponse("Anruf beginnt");
        }, 1500);
    };

    const endCall = () => {
        setCallState('ended');
        setTimeout(() => {
            setCallState('disconnected');
            setTranscript([]);
            conversationHistoryRef.current = [];
        }, 2000);
    };

    const handleUserPrompt = async (promptText: string) => {
        if (isSpeaking || isListening) return;

        addToTranscript(promptText, 'user');
        conversationHistoryRef.current.push(`User: ${promptText}`);
        setIsListening(true);
        setTimeout(() => {
            handleAIResponse(promptText);
        }, 1000);
    };

    const handleAIResponse = async (userMessage: string) => {
        try {
            // Build conversation context
            const conversationContext = conversationHistoryRef.current.length > 0
                ? `Vorherige Gesprächspunkte:\n${conversationHistoryRef.current.join('\n')}\n\n`
                : '';

            const fullPrompt = `${callContext}\n\n${conversationContext}Der Anrufer sagt: "${userMessage}"`;

            const response = await InvokeLLM({
                prompt: fullPrompt,
                context: callContext,
            });

            setIsListening(false);
            setIsSpeaking(true);

            // Add bot response to history
            conversationHistoryRef.current.push(`Assistant: ${response}`);

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
        <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Dialog.Portal forceMount>
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <Dialog.Overlay asChild forceMount><motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-50"
                    /></Dialog.Overlay>

                    {/* Modal */}
                    <Dialog.Content asChild forceMount aria-describedby={undefined} onCloseAutoFocus={(event) => { event.preventDefault(); onClose(); }}><motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <Card className="bg-black rounded-3xl shadow-2xl overflow-hidden border-4 border-neutral-700 w-full max-w-md relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

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
                                        <Dialog.Title className="text-2xl font-bold text-white mb-2 font-heading">G3 CrossFit AI</Dialog.Title>
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
                                            <div className="bg-neutral-800 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                                                {transcript.map((msg) => (
                                                    <motion.div
                                                        key={msg.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                                                    >
                                                        <div className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                                                            msg.sender === 'user'
                                                                ? 'bg-primary-600 text-white'
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
                                                        className="w-full text-left justify-start bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-button"
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
                    </motion.div></Dialog.Content>
                </>
            )}
        </AnimatePresence>
        </Dialog.Portal>
        </Dialog.Root>
    );
}

