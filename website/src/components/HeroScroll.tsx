"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { useScrollSequence } from "./useScrollSequence";
import styles from "./HeroScroll.module.css";

export default function HeroScroll() {
  const { sequenceRef, stickyRef, canvasRef, ready, active, enabled, toggle } = useScrollSequence({
    mediaQuery: "(min-width: 900px) and (min-height: 600px) and (hover: hover)", fit: "cover", topOffset: 0,
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
      if (!video.getAttribute("src")) video.src = "/videos/g3-owner-tour-mobile.mp4";
      if (video.ended) video.currentTime = 0;
      void video.play().catch(() => { setVideoFailed(true); });
    } else video.pause();
  }

  return <section ref={sequenceRef} className={styles.sequence} data-animated={active} aria-label="Willkommen bei G3 CrossFit">
    <div ref={stickyRef} className={styles.stage}>
      <div className={styles.copy}>
        <h1>Dein CrossFit<br />am Gleisdreieck</h1>
        <p className={styles.description}>Trainiere mit persönlichem Coaching und einer Community, die dich unterstützt – auf deinem Fitnesslevel.</p>
        <Button asChild size="lg" className={styles.cta}>
          <Link href="/contact#booking">Kostenloses Probetraining <ArrowRight aria-hidden="true" /></Link>
        </Button>
        <p className={styles.proof}>Maximal {site.maxParticipants} Personen pro Kurs. Bei einer Anmeldung: Personal Training ohne Aufpreis.</p>
      </div>
      <div className={styles.visual}>
        <Image src="/sequences/g3-owner-tour/0000.webp" alt="KI-inszenierte Eingangsszene mit dem G3-Inhaber" fill priority sizes="100vw" className={styles.poster} />
        <canvas ref={canvasRef} aria-hidden="true" className={styles.canvas} style={{ opacity: active && ready ? 1 : 0 }} />
        <video ref={videoRef} className={styles.video} style={{ opacity: started ? 1 : 0 }} muted playsInline preload="none" poster="/sequences/g3-owner-tour/0000.webp" aria-hidden="true"
          onError={() => { setVideoFailed(true); setStarted(false); setPlaying(false); }}
          onPlay={() => { setStarted(true); setPlaying(true); setVideoFailed(false); }} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.bar}>
        <p>KI-inszenierte Szene mit dem Inhaber · Raum als Gestaltungskonzept{videoFailed ? " · Film konnte nicht geladen werden." : ""}</p>
        <a href="#training-overview" className={styles.skip}>Weiter zum Training <ArrowDown size={16} aria-hidden="true" /></a>
        <button type="button" className={styles.motionButton} onClick={active ? toggle : toggleFilm}>
          {(active ? enabled : playing) ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          {active ? enabled ? "Bewegung pausieren" : "Bewegung fortsetzen" : playing ? "Film pausieren" : "Film abspielen"}
        </button>
      </div>
    </div>
  </section>;
}
