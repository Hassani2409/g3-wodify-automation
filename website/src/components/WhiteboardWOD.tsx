"use client";

import localFont from "next/font/local";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import styles from "./WhiteboardWOD.module.css";

const marker = localFont({
  src: [
    { path: "../fonts/kalam-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/kalam-latin-700-normal.woff2", weight: "700" },
  ],
  display: "swap",
});

type Segment = string | { scaled: string };
type Variant = {
  id: "rx" | "scaled" | "einstieg";
  label: string;
  hint: string;
  lines: Segment[][];
  note: string;
};

// Illustrative workout, not today's schedule. Movement standards follow common CrossFit scaling.
const variants: Variant[] = [
  {
    id: "rx",
    label: "Rx",
    hint: "wie ausgeschrieben",
    lines: [["10 Thruster ", "43 / 30 kg"], ["10 Pull-ups"], ["200 m Lauf"]],
    note: "Volles Gewicht, volle Bewegung.",
  },
  {
    id: "scaled",
    label: "Scaled",
    hint: "angepasst",
    lines: [["10 Thruster ", { scaled: "30 / 20 kg" }], ["10 ", { scaled: "Jumping" }, " Pull-ups"], ["200 m Lauf"]],
    note: "Weniger Gewicht, gleiche Intensität.",
  },
  {
    id: "einstieg",
    label: "Einstieg",
    hint: "dein erster Tag",
    lines: [["10 Thruster ", { scaled: "mit PVC-Stab" }], ["10 ", { scaled: "Ring Rows" }], ["200 m ", { scaled: "Gehen oder Laufen" }]],
    note: "Technik zuerst. Der Coach zeigt dir jede Bewegung.",
  },
];

type Phase = "blank" | "writing" | "erasing";

export default function WhiteboardWOD() {
  const [active, setActive] = useState<Variant["id"]>("rx");
  const [shown, setShown] = useState<Variant["id"]>("rx");
  const [phase, setPhase] = useState<Phase>("blank");
  const [run, setRun] = useState(0);
  const board = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Write the board once when it first scrolls into view.
  useEffect(() => {
    const node = board.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPhase("writing");
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function choose(id: Variant["id"]) {
    if (id === active) return;
    setActive(id);
    if (timer.current) clearTimeout(timer.current);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || phase === "blank") {
      setShown(id);
      setPhase("writing");
      setRun((n) => n + 1);
      return;
    }
    setPhase("erasing");
    timer.current = setTimeout(() => {
      setShown(id);
      setPhase("writing");
      setRun((n) => n + 1);
    }, 420);
  }

  const variant = variants.find((v) => v.id === shown)!;
  let order = 0;

  return (
    <section className={styles.wall} aria-labelledby="wod-heading">
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h2 id="wod-heading">Ein Workout.<br />Dein Level.</h2>
          <p>
            Bei uns trainieren Einsteiger und Erfahrene im selben Kurs. Der Coach passt Gewicht und Übungen an dich an.
            Probier es an der Tafel aus.
          </p>
          <p className={styles.small}>Höchstens {site.maxParticipants} Personen pro Kurs.</p>
          <Button asChild className={styles.cta}>
            <Link href="/contact#booking">Kostenloses Probetraining anfragen <ArrowUpRight aria-hidden="true" /></Link>
          </Button>
        </header>

        <div className={styles.boardColumn}>
          <div ref={board} className={`${styles.frame} ${marker.className}`}>
            <div className={styles.board} data-phase={phase}>
              <span className={styles.wiper} aria-hidden="true" key={`wipe-${run}`} />
              <div className={styles.ink} key={`${shown}-${run}`} aria-live="polite">
                <p className={styles.tag} style={{ ["--i" as string]: order++ }}><span>Beispiel-WOD</span></p>
                <p className={styles.title} style={{ ["--i" as string]: order++ }}><span>AMRAP 12 min</span></p>
                <p className={styles.explain} style={{ ["--i" as string]: order++ }}><span>so viele Runden wie möglich</span></p>
                <ul className={styles.lines}>
                  {variant.lines.map((line, index) => (
                    <li key={index} style={{ ["--i" as string]: order++ }}>
                      <span>
                        {line.map((part, p) => typeof part === "string"
                          ? <span key={p}>{part}</span>
                          : <mark key={p} className={styles.scaled}>{part.scaled}</mark>)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className={styles.note} style={{ ["--i" as string]: order++ }}><span>{variant.note}</span></p>
                <p className={styles.footer} style={{ ["--i" as string]: order++ }}><span>gleiche Gruppe, gleiche Uhr</span></p>
              </div>
            </div>
            <span className={styles.tray} aria-hidden="true">
              <i className={styles.markerBlack} /><i className={styles.markerGreen} /><i className={styles.markerRed} />
            </span>
          </div>

          <div className={styles.switcher} role="group" aria-label="Version des Workouts wählen">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={active === v.id}
                className={styles.option}
                onClick={() => choose(v.id)}
              >
                <strong>{v.label}</strong>
                <span>{v.hint}</span>
              </button>
            ))}
          </div>
          <p className={styles.disclaimer}>Beispiel zur Veranschaulichung, nicht der aktuelle Kursplan.</p>
        </div>
      </div>
    </section>
  );
}
