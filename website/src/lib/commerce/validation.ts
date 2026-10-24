import type { SelectionLine } from "./types";

export function validateLines(value: unknown, allowPreview = false): SelectionLine[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) return null;
  const seen = new Set<string>();
  const lines: SelectionLine[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" ||
      typeof item.variantId !== "string" || (!/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(item.variantId) && !(allowPreview && /^preview:g3-[a-z0-9-]+$/.test(item.variantId))) ||
      !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20 || seen.has(item.variantId)) return null;
    seen.add(item.variantId);
    lines.push({ variantId: item.variantId, quantity: item.quantity });
  }
  return lines;
}

export function isSafeCheckoutUrl(value: string, domain: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password &&
      (url.hostname === domain || url.hostname === "checkout.shopify.com" || url.hostname === "shop.app");
  } catch { return false; }
}
