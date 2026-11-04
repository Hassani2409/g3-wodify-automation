import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter, demoAnswer, validateMessages } from "@/lib/assistant/demo";
import { assistantFactsData, buildSystemPrompt } from "@/lib/assistant/knowledge";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };
const DEFAULT_MODEL = "claude-haiku-5-5";
const allow = createRateLimiter(20, 10 * 60 * 1000);

function reply(text: string, mode: "live" | "demo", status = 200) {
  return NextResponse.json({ reply: text, mode }, { status, headers: noStore });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ message: "Anfrage nicht erlaubt." }, { status: 403, headers: noStore });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ message: "Bitte JSON-Daten übermitteln." }, { status: 415, headers: noStore });
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > 16000) {
    return NextResponse.json({ message: "Die Nachricht ist zu lang." }, { status: 413, headers: noStore });
  }
  let messages;
  try {
    messages = validateMessages(JSON.parse(raw)?.messages);
  } catch {
    messages = null;
  }
  if (!messages) {
    return NextResponse.json({ message: "Ungültige Nachricht. Bitte lade den Chat neu." }, { status: 400, headers: noStore });
  }
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(client, Date.now())) {
    return NextResponse.json({ message: "Zu viele Nachrichten. Bitte versuch es in ein paar Minuten erneut oder ruf uns an." }, { status: 429, headers: noStore });
  }

  const question = messages[messages.length - 1].content;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return reply(demoAnswer(question, assistantFactsData), "demo");

  try {
    // Chat contents are forwarded to Anthropic and never stored or logged by this route.
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.ASSISTANT_MODEL || DEFAULT_MODEL,
        max_tokens: 400,
        system: buildSystemPrompt(),
        messages,
      }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Assistant upstream ${response.status}`);
    const data = await response.json();
    const text = Array.isArray(data?.content)
      ? data.content.filter((part: { type?: string }) => part?.type === "text").map((part: { text?: string }) => part.text ?? "").join("").trim()
      : "";
    if (!text) throw new Error("Empty assistant reply");
    return reply(text.slice(0, 2000), "live");
  } catch (error) {
    console.error("assistant_error", error instanceof Error ? error.message : "unknown");
    return reply(demoAnswer(question, assistantFactsData), "demo");
  }
}
