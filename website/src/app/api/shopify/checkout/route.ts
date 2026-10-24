import { NextResponse } from "next/server";
import { checkoutEnabled, getShopCatalog, shopDomain, storefront } from "@/lib/commerce/shopify";
import { isSafeCheckoutUrl, validateLines } from "@/lib/commerce/validation";

export async function POST(request: Request) {
  if (!checkoutEnabled) return NextResponse.json({ error: "Die Shop-Vorschau nimmt noch keine Bestellungen an." }, { status: 403 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Ungültiger Ursprung." }, { status: 403 });
  const raw = await request.text();
  if (raw.length > 12000) return NextResponse.json({ error: "Die Auswahl ist zu groß." }, { status: 413 });
  let input;
  try { input = JSON.parse(raw); } catch { return NextResponse.json({ error: "Ungültige Auswahl." }, { status: 400 }); }
  const lines = validateLines(input.lines);
  if (!lines) return NextResponse.json({ error: "Bitte prüfe Varianten und Mengen." }, { status: 400 });
  const catalog = await getShopCatalog();
  if (catalog.error) return NextResponse.json({ error: catalog.error }, { status: 503 });
  const variants = new Map(catalog.products.flatMap(p => p.variants.map(v => [v.id, v] as const)));
  if (lines.some(l => !variants.get(l.variantId)?.availableForSale)) return NextResponse.json({ error: "Eine Variante ist nicht mehr verfügbar. Bitte prüfe deinen Warenkorb." }, { status: 409 });
  try {
    const data = await storefront<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[]; warnings: { message: string }[] } }>(
      `mutation G3Checkout($input: CartInput!) { cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } warnings { message } } }`,
      { input: { buyerIdentity: { countryCode: "DE" }, lines: lines.map(l => ({ merchandiseId: l.variantId, quantity: l.quantity })) } },
    );
    const result = data.cartCreate;
    if (result.userErrors.length || result.warnings.length || !result.cart || !isSafeCheckoutUrl(result.cart.checkoutUrl, shopDomain)) {
      return NextResponse.json({ error: "Shopify konnte die Auswahl nicht unverändert übernehmen. Bitte prüfe Varianten und Mengen." }, { status: 409 });
    }
    return NextResponse.json({ checkoutUrl: result.cart.checkoutUrl });
  } catch {
    return NextResponse.json({ error: "Der Checkout ist gerade nicht erreichbar. Deine Auswahl bleibt erhalten." }, { status: 503 });
  }
}
