export interface ShopImage { url: string; altText: string | null; width?: number; height?: number }
export interface ShopVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  image?: ShopImage | null;
  selectedOptions: { name: string; value: string }[];
}
export interface ShopProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: string;
  concept?: boolean;
  origin?: "shopify" | "sample";
  provenance?: string;
  sourceUrl?: string | null;
  images: ShopImage[];
  variants: ShopVariant[];
}
export interface ShopCatalog {
  products: ShopProduct[];
  preview: boolean;
  checkoutEnabled: boolean;
  error?: string;
}
export interface SelectionLine { variantId: string; quantity: number }
export function formatPrice(amount: string | number, currency = "EUR") {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(Number(amount));
}
