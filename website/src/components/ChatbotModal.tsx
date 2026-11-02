"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GREETING = "Hi! Ich bin der G3-Assistent. Frag mich zu Probetraining, Preisen, Trainingsangeboten oder Anfahrt.";
const QUICK_QUESTIONS = [
  "Muss ich schon fit sein?",
  "Was kostet eine Mitgliedschaft?",
  "Wie läuft das Probetraining ab?",
  "Wo finde ich euch?",
];
const MAX_HISTORY = 11; // keeps the request within the server limit of 12 messages

export default function ChatbotModal(props: ChatbotModalProps) {
  return <ChatSession key={String(props.isOpen)} {...props} />;
}

function ChatSession({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"live" | "demo" | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const question = text.trim().slice(0, 800);
    if (!question || busy) return;
    // Keep alternating user/assistant turns that start with the user.
    let history = [...messages, { role: "user" as const, content: question }].slice(-MAX_HISTORY);
    while (history.length && history[0].role !== "user") history = history.slice(1);
    setMessages((current) => [...current, { role: "user", content: question }]);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await response.json().catch(() => ({}));
      const answer = typeof data.reply === "string" ? data.reply : (data.message as string | undefined);
      if (data.mode === "live" || data.mode === "demo") setMode(data.mode);
      setMessages((current) => [...current, {
        role: "assistant",
        content: answer || `Das hat gerade nicht geklappt. Ruf uns gern an: ${site.phone}.`,
      }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: `Das hat gerade nicht geklappt. Ruf uns gern an: ${site.phone}.` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild forceMount>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-50" />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount onCloseAutoFocus={(event) => { event.preventDefault(); onClose(); }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 16 }}
                  className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-md"
                >
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 h-[min(620px,calc(100svh-8rem))] flex flex-col text-neutral-900">
                    <div className="bg-primary-700 text-white p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"><Bot className="w-5 h-5" aria-hidden="true" /></div>
                        <div>
                          <Dialog.Title className="font-bold font-heading text-lg leading-tight">G3-Assistent</Dialog.Title>
                          <Dialog.Description className="text-xs text-white/80 font-body">
                            KI-Assistent{mode === "demo" ? " · Demo-Modus" : ""} · Antworten ohne Gewähr
                          </Dialog.Description>
                        </div>
                      </div>
                      <button aria-label="Chat schließen" onClick={onClose} className="p-2 rounded-full hover:bg-white/15 transition-colors"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50" aria-live="polite">
                      <Bubble role="assistant" content={GREETING} />
                      {messages.map((message, index) => <Bubble key={index} {...message} />)}
                      {busy && (
                        <div className="flex justify-start" aria-label="Assistent schreibt">
                          <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 flex gap-1">
                            {[0, 150, 300].map((delay) => <span key={delay} className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />)}
                          </div>
                        </div>
                      )}
                      {messages.length === 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {QUICK_QUESTIONS.map((question) => (
                            <button key={question} onClick={() => send(question)} className="text-sm px-3 py-1.5 bg-white border border-neutral-300 hover:border-primary-600 rounded-full transition-colors font-body">
                              {question}
                            </button>
                          ))}
                        </div>
                      )}
                      <div ref={endRef} />
                    </div>

                    <div className="px-4 pt-3 bg-white border-t border-neutral-200">
                      <Button asChild size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent-600">
                        <Link href="/contact#booking" onClick={onClose}>Kostenloses Probetraining anfragen <ArrowRight aria-hidden="true" /></Link>
                      </Button>
                    </div>
                    <form className="p-4 pt-3 bg-white" onSubmit={(event) => { event.preventDefault(); send(input); }}>
                      <div className="flex gap-2">
                        <label htmlFor="assistant-input" className="sr-only">Deine Frage</label>
                        <input
                          id="assistant-input"
                          value={input}
                          maxLength={800}
                          onChange={(event) => setInput(event.target.value)}
                          placeholder="Deine Frage …"
                          autoComplete="off"
                          className="min-w-0 flex-1 px-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-600 font-body"
                          disabled={busy}
                        />
                        <Button type="submit" aria-label="Senden" disabled={!input.trim() || busy} className="rounded-full bg-primary-700 hover:bg-primary-800 text-white px-4"><Send className="w-5 h-5" /></Button>
                      </div>
                      <p className="mt-2 text-[11px] leading-snug text-neutral-500 font-body">
                        Bitte keine Gesundheits- oder Kontaktdaten eingeben. Deine Nachrichten werden zur Beantwortung an Anthropic übermittelt und von uns nicht gespeichert. <Link href="/datenschutz#assistent" className="underline" onClick={onClose}>Datenschutz</Link>
                      </p>
                    </form>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Bubble({ role, content }: ChatMessage) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${role === "user" ? "bg-primary-700 text-white" : "bg-white text-neutral-800 border border-neutral-200"}`}>
        <p className="text-sm font-body whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
