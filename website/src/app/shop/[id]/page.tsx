import { notFound } from "next/navigation";
import ShopExperience from "@/components/shop/ShopExperience";
import { getShopCatalog } from "@/lib/commerce/shopify";
export const dynamic = "force-dynamic";
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getShopCatalog();
  if (!catalog.error && !catalog.products.some(p => p.handle === id)) notFound();
  return <ShopExperience catalog={catalog} handle={id} />;
}
