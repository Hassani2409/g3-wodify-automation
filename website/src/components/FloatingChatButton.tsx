"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import ChatbotModal from './ChatbotModal';

export default function FloatingChatButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <ChatbotModal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
            />
            
            {/* Floating Button */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
                className="fixed bottom-6 right-6 z-40"
            >
                <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-16 h-16 rounded-full bg-accent-500 hover:bg-accent-600 text-white shadow-2xl flex items-center justify-center transition-all duration-300 group"
                    aria-label="Chat starten"
                >
                    {/* Pulse Animation */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-accent-400"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 0, 0.7],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    
                    {/* Icon */}
                    <MessageSquare className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    
                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap shadow-lg">
                            Chat starten
                            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
                        </div>
                    </div>
                </motion.button>
            </motion.div>
        </>
    );
}

