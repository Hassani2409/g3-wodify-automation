"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const configure = () => {
      if (motion.matches) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      } else {
        video.src = "/videos/g3-owner-entrance.mp4";
        video.load();
        void video.play().catch(() => {
          // The poster remains visible when autoplay is unavailable.
        });
      }
    };
    const pauseWhenHidden = () => {
      if (document.hidden) video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    observer.observe(video);
    configure();
    motion.addEventListener("change", configure);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", configure);
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      video.pause();
    };
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (video.ended) video.currentTime = 0;
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        muted
        playsInline
        preload="none"
        poster="/images/g3-owner-entrance-poster.jpg"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[90%_center] lg:object-center"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/10 lg:via-black/40" />
      <div className="absolute bottom-24 left-6 right-6 z-10 flex items-end justify-between gap-4 pb-[env(safe-area-inset-bottom)] lg:left-8 lg:right-8">
        <p className="max-w-48 text-[10px] leading-relaxed text-white/80">KI-inszenierte Szene mit dem Inhaber · Raum als Gestaltungskonzept</p>
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? "Hero-Film pausieren" : "Hero-Film abspielen"}
          className="motion-reduce:hidden inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/60 bg-black/70 px-4 py-2 text-xs text-white transition-colors duration-150 hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          {playing ? "Film pausieren" : "Film abspielen"}
        </button>
      </div>
    </>
  );
}
