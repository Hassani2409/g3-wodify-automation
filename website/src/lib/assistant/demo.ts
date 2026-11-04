// Import-free so it can be unit-tested without a bundler.
export interface AssistantFacts {
  address: string;
  phone: string;
  email: string;
  maxParticipants: number;
  programs: string[];
  prices: string[];
  pricesRetrievedOn: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const LIMITS = { messages: 12, chars: 800, totalChars: 6000 } as const;

/** Returns sanitized messages or null. The last message must come from the user. */
export function validateMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > LIMITS.messages) return null;
  let total = 0;
  const messages: ChatMessage[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const { role, content } = item as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const text = content.trim();
    if (!text || text.length > LIMITS.chars) return null;
    total += text.length;
    messages.push({ role, content: text });
  }
  if (total > LIMITS.totalChars || messages[messages.length - 1].role !== "user") return null;
  // The API requires alternating roles starting with the user.
  if (messages[0].role !== "user") return null;
  for (let i = 1; i < messages.length; i++) if (messages[i].role === messages[i - 1].role) return null;
  return messages;
}

/** Rule-based answers from verified facts, used when no API key is configured. */
export function demoAnswer(question: string, facts: AssistantFacts): string {
  const q = question.toLowerCase();
  const has = (...words: string[]) => words.some((word) => q.includes(word));
  if (has("preis", "kostet", "kosten", "mitgliedschaft", "beitrag", "teuer"))
    return `Laut veröffentlichter Preisliste (Stand ${facts.pricesRetrievedOn}) kosten die Mitgliedschaften bei 12 Monaten Laufzeit: ${facts.prices.join("; ")}. Die aktuellen Konditionen bestätigt dir das Team vor Vertragsabschluss.`;
  if (has("anfänger", "fit sein", "einsteiger", "kein sport", "unsportlich", "level"))
    return `Du musst nicht fit sein, um anzufangen. Die Übungen werden an dein Level angepasst, und mit ONRAMP lernst du die Grundbewegungen. Die Gruppen haben höchstens ${facts.maxParticipants} Personen.`;
  if (has("probetraining", "probe", "testen", "ausprobieren", "anfangen", "starten"))
    return "Das Probetraining ist kostenlos. Schick uns über das Formular eine Anfrage – den Termin bestätigen wir dir persönlich.";
  if (has("wo ", "wo?", "adresse", "anfahrt", "finde", "standort", "u-bahn", "ubahn", "bahn"))
    return `Du findest uns am ${facts.address} – am Gleisdreieck, nahe Potsdamer Platz. Mit der U1/U2 bis Gleisdreieck oder Mendelssohn-Bartholdy-Park.`;
  if (has("zeit", "uhr", "öffnung", "wann", "kursplan", "termine"))
    return `Aktuelle Kurszeiten siehst du in der Wodify-App. Ich kann dir keine Zeiten nennen – frag gern beim Team nach: ${facts.phone} oder ${facts.email}.`;
  if (has("gruppe", "personen", "wie viele"))
    return `Die Gruppen haben höchstens ${facts.maxParticipants} Personen. Bist du allein angemeldet, wird der Kurs zum Personal Training ohne Aufpreis.`;
  if (has("angebot", "kurse", "training", "yoga", "weightlifting"))
    return `Wir bieten ${facts.programs.join(", ")}.`;
  return `Dazu kann ich dir gerade nichts Verlässliches sagen. Das Team hilft dir gern: ${facts.phone} oder ${facts.email}.`;
}

/** Fixed-window limiter. In-memory: per server instance only, a best-effort cost guard. */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { start: number; count: number }>();
  return (key: string, now: number): boolean => {
    if (hits.size > 5000) for (const [k, v] of hits) if (now - v.start >= windowMs) hits.delete(k);
    const entry = hits.get(key);
    if (!entry || now - entry.start >= windowMs) {
      hits.set(key, { start: now, count: 1 });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}
