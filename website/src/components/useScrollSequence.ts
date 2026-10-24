"use client";
import { useEffect, useRef, useState } from "react";
import { containedFrame, coveredFrame, sequenceFrame, sequenceProgress } from "@/lib/scroll-sequence";

const COUNT = 240;
const WIDTH = 960;
const HEIGHT = 540;
const CACHE_LIMIT = 20;
const BASE = "/sequences/g3-owner-tour";

export function useScrollSequence({ mediaQuery = "all", fit = "contain", topOffset = 80, base = BASE, count = COUNT, lazy = false }: {
  mediaQuery?: string; fit?: "contain" | "cover"; topOffset?: number; base?: string; count?: number; lazy?: boolean;
} = {}) {
  const sequenceRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLOutputElement>(null);
  const seekRef = useRef<(frame: number) => void>(() => {});
  const enabledRef = useRef(true);
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sequenceRef.current;
    const sticky = stickyRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !section || !sticky || !context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const suitable = window.matchMedia(mediaQuery);
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let degraded = false;
    let nearby = !lazy;
    const canAnimate = () => !degraded && !reduced.matches && suitable.matches && !connection?.saveData;
    const cache = new Map<number, ImageBitmap>();
    const pending = new Map<number, AbortController>();
    const errors = new Set<number>();
    let disposed = false;
    let canvasReady = false;
    let target = 0;
    let drawn = -1;
    let raf = 0;
    let start = 0;
    let end = 1;

    function draw() {
      if (disposed || document.hidden) return;
      // Keep the previous frame visible while the exact requested frame loads.
      let index = target;
      if (!cache.has(index)) {
        const nearest = [...cache.keys()].sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0];
        if (nearest === undefined) return;
        index = nearest;
      }
      if (drawn === index) return;
      const bitmap = cache.get(index)!;
      const rect = (fit === "cover" ? coveredFrame : containedFrame)(canvas!.width, canvas!.height, WIDTH, HEIGHT);
      context!.fillStyle = "#030508";
      context!.fillRect(0, 0, canvas!.width, canvas!.height);
      context!.drawImage(bitmap, rect.x, rect.y, rect.width, rect.height);
      drawn = index;
      canvas!.dataset.frame = String(index);
      if (outputRef.current) outputRef.current.textContent = `${index + 1} / ${count}`;
      if (rangeRef.current) rangeRef.current.value = String(target);
    }

    function scheduleDraw() {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); });
    }

    function trim() {
      const farthest = [...cache.keys()].sort((a, b) => Math.abs(b - target) - Math.abs(a - target));
      while (cache.size > CACHE_LIMIT) {
        const index = farthest.shift()!;
        cache.get(index)?.close();
        cache.delete(index);
      }
    }

    function pump() {
      if (disposed || !nearby || !canAnimate() || document.hidden) return;
      // Decode at most three images concurrently; prefer target, then nearby frames.
      const wanted = [target];
      for (let distance = 1; distance <= 8; distance++) wanted.push(target + distance, target - distance);
      for (const index of wanted) {
        if (pending.size >= 3) break;
        if (index < 0 || index >= count || cache.has(index) || pending.has(index) || errors.has(index)) continue;
        const controller = new AbortController();
        pending.set(index, controller);
        void fetch(`${base}/${String(index).padStart(4, "0")}.webp`, { signal: controller.signal })
          .then(response => { if (!response.ok) throw new Error("Frame unavailable"); return response.blob(); })
          .then(blob => createImageBitmap(blob))
          .then(bitmap => {
            if (disposed || !canAnimate() || Math.abs(index - target) > CACHE_LIMIT) { bitmap.close(); return; }
            cache.set(index, bitmap);
            trim();
            if (!canvasReady) { canvasReady = true; setReady(true); }
            scheduleDraw();
          })
          .catch(() => {
            if (!controller.signal.aborted) {
              errors.add(index);
              if (index === 0) setFailed(true);
              if (errors.size >= 3 && cache.size === 0) {
                degraded = true;
                setActive(false);
                setReady(false);
                for (const controller of pending.values()) controller.abort();
              }
            }
          })
          .finally(() => { pending.delete(index); pump(); });
      }
    }

    function seek(index: number) {
      target = Math.max(0, Math.min(count - 1, Math.round(index)));
      for (const [frame, controller] of pending) {
        if (Math.abs(frame - target) > 12) controller.abort();
      }
      scheduleDraw();
      pump();
    }
    seekRef.current = seek;

    function onScroll() {
      if (!enabledRef.current || !canAnimate()) return;
      end = start + section!.offsetHeight - sticky!.offsetHeight;
      seek(sequenceFrame(sequenceProgress(window.scrollY, start, end), count));
    }
    function resize() {
      const bounds = canvas!.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.max(1, Math.round(bounds.width * ratio));
      canvas!.height = Math.max(1, Math.round(bounds.height * ratio));
      drawn = -1;
      start = section!.getBoundingClientRect().top + window.scrollY - topOffset;
      end = start + section!.offsetHeight - sticky!.offsetHeight;
      setReducedMotion(reduced.matches);
      setActive(canAnimate());
      if (!canAnimate()) {
        for (const controller of pending.values()) controller.abort();
        for (const bitmap of cache.values()) bitmap.close();
        cache.clear();
        canvasReady = false;
        setReady(false);
      } else {
        onScroll();
        scheduleDraw();
        pump();
      }
    }
    const proximity = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      if (nearby) { onScroll(); pump(); }
      else for (const controller of pending.values()) controller.abort();
    }, { rootMargin: "600px 0px" });
    if (lazy) proximity.observe(section);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    reduced.addEventListener("change", resize);
    suitable.addEventListener("change", resize);
    document.addEventListener("visibilitychange", resize);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      proximity.disconnect();
      window.removeEventListener("scroll", onScroll);
      reduced.removeEventListener("change", resize);
      suitable.removeEventListener("change", resize);
      document.removeEventListener("visibilitychange", resize);
      for (const controller of pending.values()) controller.abort();
      for (const bitmap of cache.values()) bitmap.close();
      cache.clear();
      seekRef.current = () => {};
    };
  }, [mediaQuery, fit, topOffset, base, count, lazy]);

  function toggle() {
    enabledRef.current = !enabledRef.current;
    setEnabled(enabledRef.current);
    if (enabledRef.current) window.dispatchEvent(new Event("scroll"));
  }

  return { sequenceRef, stickyRef, canvasRef, rangeRef, outputRef, ready, failed,
    reducedMotion, active, enabled, toggle, seekRef };
}
