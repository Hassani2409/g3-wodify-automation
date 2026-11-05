"use client";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatbotModal from "./ChatbotModal";
import { site } from "@/lib/site";

export default function ContactButton() {
  const [expanded, setExpanded] = useState(false);
  const [channel, setChannel] = useState<"chat" | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (expanded) container.current?.querySelector<HTMLButtonElement>("#contact-options button")?.focus();
  }, [expanded]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setExpanded(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  const closeModal = () => { setChannel(null); trigger.current?.focus(); };
  return <>
    <ChatbotModal isOpen={channel === "chat"} onClose={closeModal} />
    <div ref={container} className="fixed right-6 z-40" style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }} onKeyDown={(event) => {
      if (event.key === "Escape") { setExpanded(false); trigger.current?.focus(); }
    }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}>
      {expanded && <div id="contact-options" role="group" aria-label="Kontakt aufnehmen" className="absolute bottom-full right-0 mb-3 w-64 p-2 bg-card rounded-card shadow-xl border border-border text-foreground">
        <Button variant="ghost" className="w-full justify-start" onClick={() => { setExpanded(false); setChannel("chat"); }}><MessageSquare aria-hidden="true" />Frag den G3-Assistenten</Button>
        <Button asChild variant="ghost" className="w-full justify-start"><a href={site.phoneHref}><Phone aria-hidden="true" />{site.phone} anrufen</a></Button>
      </div>}
      <Button ref={trigger} aria-expanded={expanded} aria-controls={expanded ? "contact-options" : undefined} onClick={() => setExpanded(!expanded)} className="h-12 px-5 rounded-full shadow-lg">
        {expanded ? <X aria-hidden="true" /> : <MessageSquare aria-hidden="true" />}Kontakt
      </Button>
    </div>
  </>;
}
