import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ message: "Anfrage nicht erlaubt." }, { status: 403, headers: noStore });
  }
  const endpoint = process.env.LEAD_API_URL;
  if (!endpoint) {
    return NextResponse.json({ message: "Das Anfrageformular ist noch nicht verbunden. Bitte kontaktiere uns per E-Mail oder Telefon." }, { status: 503, headers: noStore });
  }
  try {
    const url = new URL(endpoint);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if ((url.protocol !== "https:" && !(url.protocol === "http:" && local)) || url.username || url.password || url.search || url.hash) throw new Error("Invalid backend URL");
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ message: "Bitte JSON-Daten übermitteln." }, { status: 415, headers: noStore });
    }
    const body = await request.text();
    if (new TextEncoder().encode(body).length > 12000) {
      return NextResponse.json({ message: "Die Anfrage ist zu groß." }, { status: 413, headers: noStore });
    }
    try { JSON.parse(body); } catch {
      return NextResponse.json({ message: "Ungültige Anfrage." }, { status: 400, headers: noStore });
    }
    const key = request.headers.get("idempotency-key");
    if (!key || !/^[a-zA-Z0-9_-]{16,128}$/.test(key)) {
      return NextResponse.json({ message: "Ungültiger Anfrageschlüssel. Bitte lade die Seite neu." }, { status: 422, headers: noStore });
    }
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/api/leads`, {
      method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key },
      body, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      const status = [409, 422, 429].includes(response.status) ? response.status : 503;
      return NextResponse.json({ message: status === 429 ? "Zu viele Anfragen. Bitte versuche es in einer Minute erneut." : status === 409 ? "Die Angaben wurden verändert. Bitte starte eine neue Anfrage." : status === 422 ? "Bitte prüfe deine Angaben und den Datenschutzhinweis." : "Deine Anfrage konnte gerade nicht gespeichert werden. Bitte versuche es erneut oder kontaktiere uns direkt." }, { status, headers: noStore });
    }
    const data = await response.json();
    if (data.success !== true || typeof data.request_id !== "string" || data.automation_mode !== "test") throw new Error("Unexpected intake response");
    return NextResponse.json({ success: true, request_id: data.request_id, automation_mode: "test", message: "Anfrage gespeichert. Dein Wunschtermin ist noch nicht bestätigt." }, { status: 202, headers: noStore });
  } catch {
    return NextResponse.json({ message: "Deine Anfrage konnte gerade nicht bestätigt werden. Bitte versuche es erneut oder kontaktiere uns direkt." }, { status: 503, headers: noStore });
  }
}
