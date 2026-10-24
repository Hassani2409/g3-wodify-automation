"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollSequence } from "./useScrollSequence";
import styles from "./TrainingScroll.module.css";

export default function TrainingScroll() {
  const { sequenceRef, stickyRef, canvasRef, ready, active, enabled, toggle } = useScrollSequence({
    mediaQuery: "(min-width: 900px) and (min-height: 600px) and (hover: hover)", fit: "cover", topOffset: 0, base: "/sequences/g3-training", count: 144, lazy: true,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const pause = () => { if (document.hidden) video.pause(); };
    if (active) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.pause(); });
    observer.observe(video);
    document.addEventListener("visibilitychange", pause);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", pause); video.pause(); };
  }, [active]);

  function toggleFilm() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (!video.getAttribute("src")) video.src = "/videos/g3-training-mobile.mp4";
      if (video.ended) video.currentTime = 0;
      void video.play().catch(() => { setVideoFailed(true); });
    } else video.pause();
  }

  return <section ref={sequenceRef} className={styles.sequence} data-animated={active} aria-label="Training bei G3 CrossFit">
    <div ref={stickyRef} className={styles.stage}>
      <div className={styles.copy}>
        <h2>Finde dein Training.</h2>
        <p className={styles.description}>CrossFit, Weightlifting oder Yoga – entdecke die Trainingsangebote bei G3.</p>
        <Button asChild size="lg" className={styles.cta}>
          <Link href="#training-programmes">Trainingsangebote entdecken <ArrowRight aria-hidden="true" /></Link>
        </Button>
      </div>
      <div className={styles.visual}>
        <Image src="/sequences/g3-training/0000.webp" alt="KI-inszenierte Trainingsszene mit Kletterseil und Rig" fill priority sizes="100vw" className={styles.poster} />
        <canvas ref={canvasRef} aria-hidden="true" className={styles.canvas} style={{ opacity: active && ready ? 1 : 0 }} />
        <video ref={videoRef} className={styles.video} style={{ opacity: started ? 1 : 0 }} muted playsInline preload="none" poster="/sequences/g3-training/0000.webp" aria-hidden="true"
          onError={() => { setVideoFailed(true); setStarted(false); setPlaying(false); }}
          onPlay={() => { setStarted(true); setPlaying(true); setVideoFailed(false); }} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.bar}>
        <p>KI-inszenierte Trainingsszene · Raum als Gestaltungskonzept{videoFailed ? " · Film konnte nicht geladen werden." : ""}</p>
        <a href="#training-programmes" className={styles.skip}>Zur Trainingsauswahl <ArrowDown size={16} aria-hidden="true" /></a>
        <button type="button" className={styles.motionButton} onClick={active ? toggle : toggleFilm}>
          {(active ? enabled : playing) ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          {active ? enabled ? "Bewegung pausieren" : "Bewegung fortsetzen" : playing ? "Film pausieren" : "Film abspielen"}
        </button>
      </div>
    </div>
  </section>;
}
