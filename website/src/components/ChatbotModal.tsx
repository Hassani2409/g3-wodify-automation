"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { InvokeLLM } from '@/integrations/Core';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
    text: string;
    sender: 'user' | 'bot';
    id: number;
}

interface ChatbotModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const conversationHistoryRef = useRef<string[]>([]);

    const chatbotContext = `
Du bist ein freundlicher und hilfsbereiter Chatbot-Assistent für G3 CrossFit in Berlin.

Deine Aufgabe ist es, Besuchern der Website zu helfen und ihre Fragen zu beantworten.

WICHTIGE INFORMATIONEN:
- Standort: Musterstraße 123, 10115 Berlin
- Telefon: +49 30 12345678
- Öffnungszeiten: Mo-Fr 6:00-21:00, Sa 8:00-18:00, So 9:00-16:00
- Preise: Starter 89€, Unlimited 139€, Premium 189€
- Kostenloses Probetraining verfügbar
- Alle Level willkommen

GESPRÄCHSFÜHRUNG:
- Sei freundlich, professionell und hilfsbereit
- Antworte kurz und präzise
- Biete bei Fragen zu Probetraining die Online-Buchung an
- Erwähne wichtige Informationen wie kostenloses Probetraining

Beginne das erste Gespräch mit: "Hallo! 👋 Ich bin der G3 CrossFit Assistent. Wie kann ich Ihnen helfen?"

Antworte immer natürlich, kurz und hilfsbereit.
`;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Start message when modal opens
            const startMessage: ChatMessage = {
                text: "Hallo! 👋 Ich bin der G3 CrossFit Assistent. Wie kann ich Ihnen helfen?",
                sender: 'bot',
                id: Date.now()
            };
            setMessages([startMessage]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setMessages([]);
            setInputValue('');
            conversationHistoryRef.current = [];
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;

        const userMessage: ChatMessage = {
            text: inputValue.trim(),
            sender: 'user',
            id: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        conversationHistoryRef.current.push(`User: ${inputValue.trim()}`);
        setInputValue('');
        setIsTyping(true);

        try {
            // Build conversation context
            const conversationContext = conversationHistoryRef.current.length > 0
                ? `Vorherige Gesprächspunkte:\n${conversationHistoryRef.current.join('\n')}\n\n`
                : '';

            const fullPrompt = `${chatbotContext}\n\n${conversationContext}Der Nutzer sagt: "${userMessage.text}"`;
            
            const response = await InvokeLLM({
                prompt: fullPrompt,
                context: chatbotContext,
            });
            
            // Add bot response to history
            conversationHistoryRef.current.push(`Bot: ${response}`);
            
            // Simulate typing delay
            setTimeout(() => {
                const botMessage: ChatMessage = {
                    text: response,
                    sender: 'bot',
                    id: Date.now()
                };
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);
            }, 1000);
        } catch (error) {
            console.error("Error getting AI response:", error);
            setIsTyping(false);
            const errorMessage: ChatMessage = {
                text: "Entschuldigung, es gab ein Problem. Bitte versuchen Sie es erneut.",
                sender: 'bot',
                id: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        "Was kostet eine Mitgliedschaft?",
        "Wo finde ich euch?",
        "Wie sind eure Öffnungszeiten?",
        "Kann ich ein Probetraining buchen?"
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 right-6 z-50 w-full max-w-md"
                    >
                        <Card className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 h-[600px] flex flex-col">
                            {/* Header */}
                            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold font-heading">G3 CrossFit Assistent</h3>
                                        <p className="text-xs text-primary-100 font-body">Normalerweise antworten wir sofort</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                            msg.sender === 'user'
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-white text-gray-800 border border-gray-200'
                                        }`}>
                                            <p className="text-sm font-body whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Questions */}
                            {messages.length <= 1 && (
                                <div className="px-4 pt-2 pb-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-2 font-body">Häufige Fragen:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {quickQuestions.map((question, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setInputValue(question);
                                                    setTimeout(() => handleSend(), 100);
                                                }}
                                                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors font-body"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input */}
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Schreiben Sie eine Nachricht..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
                                        disabled={isTyping}
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim() || isTyping}
                                        className="rounded-full bg-primary-600 hover:bg-primary-700 text-white px-4 font-button"
                                    >
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

