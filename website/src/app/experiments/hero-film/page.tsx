import type { Metadata } from "next";
import HeroFilmComparison from "@/components/HeroFilmComparison";
import FeatureCards from "@/components/FeatureCards";

export const metadata: Metadata = { title: "Film-Hero · Vergleich", robots: { index: false, follow: false } };
export default function HeroFilmComparisonPage() {
  return <><HeroFilmComparison /><FeatureCards /></>;
}
