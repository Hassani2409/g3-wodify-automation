import type { ShopImage, ShopProduct } from "./types";

/** A manual gallery choice wins until the next variant change. Cart images always follow the variant. */
export function getProductImage(product: ShopProduct, variantId?: string, galleryIndex: number | null = null): ShopImage | undefined {
  if (galleryIndex !== null && Number.isInteger(galleryIndex) && galleryIndex >= 0 && product.images[galleryIndex]) {
    return product.images[galleryIndex];
  }
  return product.variants.find(variant => variant.id === variantId)?.image || product.images[0];
}
