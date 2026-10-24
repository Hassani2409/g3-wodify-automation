"use client";

import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const query = "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => false;

export default function AboutImage() {
  const figure = useRef<HTMLElement>(null);
  const active = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const { scrollYProgress } = useScroll({ target: figure, offset: ["start end", "end start"] });
  const transform = useTransform(scrollYProgress, [0, 1], ["scale(1.035)", "scale(1)"]);

  return <figure ref={figure} className="w-full max-w-[420px] mx-auto">
    <div className="relative aspect-[1536/2752] overflow-hidden rounded-xl">
      <motion.div className="absolute inset-0 origin-center" style={{ transform: active ? transform : "none" }}>
        <Image src="/images/g3-never-give-up.webp"
          alt="Inszeniertes Gym-Motiv mit bandagierter Faust und dem Schriftzug Never give up"
          fill className="object-contain" sizes="(max-width: 480px) calc(100vw - 32px), 420px" />
      </motion.div>
    </div>
    <figcaption className="mt-3 text-xs leading-relaxed text-neutral-300">KI-inszeniertes Motiv · Never give up</figcaption>
  </figure>;
}
