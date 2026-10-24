import type { Metadata } from "next";
import "./shop.css";
export const metadata: Metadata = { title: "G3 Shop | Bekleidung und Zubehör", robots: { index: false, follow: false } };
export default function ShopLayout({ children }: { children: React.ReactNode }) { return children; }
