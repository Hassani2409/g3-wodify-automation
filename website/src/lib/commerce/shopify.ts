import "server-only";
import previewData from "@/data/shopify-preview.json";
import type { ShopCatalog, ShopProduct } from "./types";

export const isPreview = process.env.SHOPIFY_MODE !== "live";
export const checkoutEnabled = !isPreview && process.env.SHOPIFY_CHECKOUT_ENABLED === "true";
export const shopDomain = process.env.SHOPIFY_STORE_DOMAIN || "y2qygs-ud.myshopify.com";

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shopDomain)) throw new Error("Invalid Shopify domain");
  const token = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
  if (!token) throw new Error("Storefront access is not configured");
  const response = await fetch(`https://${shopDomain}/api/2026-10/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error("Shopify is unavailable");
  const result = await response.json();
  if (result.errors?.length || !result.data) throw new Error("Shopify rejected the request");
  return result.data as T;
}

const productQuery = `query G3Products($after: String) {
  products(first: 50, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes { id handle title description productType
      images(first: 6) { nodes { url altText width height } }
      variants(first: 100) { pageInfo { hasNextPage } nodes { id title availableForSale image { url altText width height } price { amount currencyCode } selectedOptions { name value } } }
    }
  }
}`;
interface RemoteProduct extends Omit<ShopProduct, "images" | "variants" | "category"> {
  productType: string;
  images: { nodes: ShopProduct["images"] };
  variants: { nodes: ShopProduct["variants"]; pageInfo: { hasNextPage: boolean } };
}
export async function getShopCatalog(): Promise<ShopCatalog> {
  if (isPreview) return { products: previewData.products as ShopProduct[], preview: true, checkoutEnabled: false };
  try {
    const products: ShopProduct[] = [];
    let after: string | null = null;
    for (let page = 0; page < 10; page++) {
      const data: { products: { nodes: RemoteProduct[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } = await storefront(productQuery, { after });
      for (const p of data.products.nodes) {
        if (p.variants.pageInfo.hasNextPage) throw new Error("Variant pagination required");
        const kind = p.productType.toLowerCase();
        const category = /supplement|protein/.test(kind) ? "supplements" : /equipment|gerät/.test(kind) ? "equipment" : /accessor/.test(kind) ? "accessories" : /clothing|bekleidung|apparel/.test(kind) ? "clothing" : previewData.products.find(sample => sample.handle === p.handle)?.category || "other";
        products.push({ ...p, category, images: p.images.nodes, variants: p.variants.nodes });
      }
      if (!data.products.pageInfo.hasNextPage) return { products, preview: false, checkoutEnabled };
      after = data.products.pageInfo.endCursor;
    }
    throw new Error("Catalog pagination exceeded");
  } catch {
    return { products: [], preview: false, checkoutEnabled: false, error: "Der Shopify-Katalog ist gerade nicht erreichbar. Bitte versuche es später erneut." };
  }
}
