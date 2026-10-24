import { notFound } from "next/navigation";
import ShopExperience from "@/components/shop/ShopExperience";
import { getShopCatalog } from "@/lib/commerce/shopify";
export const dynamic = "force-dynamic";
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!["clothing", "accessories", "equipment", "supplements"].includes(category)) notFound();
  return <ShopExperience catalog={await getShopCatalog()} category={category} />;
}
