"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./ClosingInvitation.module.css";

const query = "(min-width: 900px) and (min-height: 600px) and (hover: hover) and (prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => false;

export default function ClosingInvitation() {
  const section = useRef<HTMLElement>(null);
  const active = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const transform = useTransform(scrollYProgress, [0, 1], ["scale(1.06)", "scale(1)"]);

  return <section ref={section} className={styles.section} data-animated={active} aria-labelledby="closing-title">
    <div className={styles.stage}>
      <div className={styles.visual}>
        <motion.div className={styles.image} style={{ transform: active ? transform : "none" }}>
          <Image src="/images/g3-invitation.webp" alt="KI-inszenierte Einladungsszene mit dem Inhaber in einem Gym" fill sizes="100vw" />
        </motion.div>
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Dein nächster Schritt</p>
        <h2 id="closing-title">Lerne G3 kennen.</h2>
        <p>Dein Einstieg beginnt mit einem kostenlosen Probetraining. Wir freuen uns auf dich.</p>
        <Button asChild size="lg" className={styles.cta}><Link href="/contact#booking">Kostenloses Probetraining anfragen <ArrowRight aria-hidden="true" /></Link></Button>
        <p className={styles.note}>Deinen Termin bestätigen wir persönlich.</p>
      </div>
      <p className={styles.caption}>KI-inszenierte Szene · Raum als Gestaltungskonzept</p>
    </div>
  </section>;
}
