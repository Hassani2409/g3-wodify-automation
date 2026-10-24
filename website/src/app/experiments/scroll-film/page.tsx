import type { Metadata } from "next";
import ScrollFilm from "@/components/ScrollFilm";

export const metadata: Metadata = {
  title: "Scroll-Film · G3 Prototyp",
  robots: { index: false, follow: false },
};

export default function ScrollFilmPage() {
  return <ScrollFilm />;
}
