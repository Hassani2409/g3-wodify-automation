import ShopExperience from "@/components/shop/ShopExperience";
import { getShopCatalog } from "@/lib/commerce/shopify";
export const dynamic = "force-dynamic";
export default async function ShopPage() { return <ShopExperience catalog={await getShopCatalog()} />; }
